# TinTinChat — PWA Persistent Cache System

**Created**: 2026-03-20  
**Overall estimate**: ~15-22 days across all phases  
**Architecture**: IndexedDB-based client-side persistent cache with sync  
**Security note**: Storing decrypted content in IndexedDB means anyone with physical device access + browser DevTools can read the data. This is the same tradeoff Telegram Desktop makes.

---

## Current State Summary

| Component | Status | What Exists Today |
|---|---|---|
| Chat list persistence | ❌ | Only in-memory `chatGroupsById` Map |
| Message persistence | ❌ | Only volatile `currentChatRecentMessages` array |
| Decrypted media persistence | 🟡 ~15% | Volatile in-memory `decryptedMediaCacheByMessageId` Map (lost on refresh) + `TinTinChatFileCache` IndexedDB for manually-downloaded files only |
| User session persistence | 🟡 ~50% | `localStorage` has `ident` for auto-login + `ttc_app_settings` for preferences |
| Sync / conflict resolution | ❌ | Server always fetched fresh, no delta sync |
| Offline browsing | 🟡 ~10% | SW caches raw encrypted API JSON responses (stale quickly) |
| Storage quota management | ❌ | No eviction policy |
| HTTP cache headers | 🟡 ~10% | Only `get_avatar.php` (5min) and `stickers/get.php` (24h) set `Cache-Control` |
| Session lock optimization | ✅ 100% | All read-only endpoints call `session_write_close()` after auth |

---

## Phase 1 — Persistent Decrypted Media Cache

**Effort**: ~3-4 days  
**Impact**: ★★★★★ (High — directly eliminates "Decrypting image/video..." delays on repeat views)  
**Necessity**: High — this is the #1 perceived performance bottleneck  
**Complexity**: Medium

### Goal
When a user views an image/video/voice message, store the decrypted blob in IndexedDB. On subsequent views (including after page refresh), load from IDB instead of re-fetching + re-decrypting from server.

### Codebase Context

**Key files:**
- `assets/js/chat.js` — main app logic (~9100 lines)
- `assets/js/crypto.js` — encryption/decryption functions (394 lines)
- `service-worker.js` — SW caching (160 lines)

**Existing infrastructure to extend:**
- `TinTinChatFileCache` IndexedDB (DB name: `"TinTinChatFileCache"`, version 1)
  - Has one object store: `"downloadedFiles"` with keyPath `"messageId"` and `"timestamp"` index
  - Currently only used for user-initiated file downloads (`saveDownloadedFile` / `getDownloadedFile`)
  - Located at chat.js lines ~6725-6798

**Media decryption pipeline (chat.js lines ~770-812):**
```
getDecryptedMediaResource(msg)
  → check in-memory Map cache (decryptedMediaCacheByMessageId)
  → parse envelope → resolve AES key → decrypt metadata
  → fetch(endpoint) encrypted blob from server
  → decryptBinaryWithAesKey(encryptedBytes, mediaKey)
  → new Blob([decryptedBytes]) → URL.createObjectURL(blob)
  → store in Map, return { blob, objectUrl, metadata }
```

**Hydration functions (chat.js lines ~877-931):**
- `hydrateImageMessageElement(messageElement, msg)` — calls `getDecryptedMediaResource`, sets `<img>.src`
- `hydrateVideoMessageElement(messageElement, msg)` — calls `getDecryptedMediaResource`, sets `<video>.src`
- Both called via `void hydrateImageMessageElement(div, msg)` (fire-and-forget) after DOM insertion

**In-memory cache (chat.js line 252):**
```js
const decryptedMediaCacheByMessageId = new Map();
```
- Cleared on `beforeunload` and on `clearDecryptedMediaCache()` (called on chat switch)

### Tasks

- [ ] **1.1** — Add new IDB object store `"mediaCache"` to the existing `TinTinChatFileCache` database
  - Bump DB version from 1 to 2
  - Schema: `{ messageId (keyPath), blob (Blob), mimeType (string), fileName (string), size (number), cachedAt (number) }`
  - Add indexes: `cachedAt` (for LRU eviction), `size` (for quota queries)
  - Update `initFileCache()` `onupgradeneeded` handler to create the new store while preserving existing `"downloadedFiles"` store
  - **File**: `assets/js/chat.js` lines ~6728-6755

- [ ] **1.2** — Create `saveMediaToCache(messageId, blob, metadata)` function
  - Writes decrypted blob + metadata to `"mediaCache"` IDB store
  - Fire-and-forget (don't await in the hot path)
  - Silently catch errors (IDB failure should never break the app)
  - **File**: `assets/js/chat.js`, new function near existing `saveDownloadedFile`

- [ ] **1.3** — Create `getMediaFromCache(messageId)` function
  - Reads from `"mediaCache"` IDB store by messageId
  - Returns `{ blob, mimeType, fileName }` or `null`
  - Update `cachedAt` timestamp on read (for LRU tracking) — optional, can use a separate touch function
  - **File**: `assets/js/chat.js`, new function near existing `getDownloadedFile`

- [ ] **1.4** — Integrate IDB read into `getDecryptedMediaResource(msg)` 
  - After the in-memory Map check (line ~775), add IDB check:
    ```
    1. Check in-memory Map → return if found
    2. NEW: Check IDB mediaCache → if found, create objectUrl, populate in-memory Map, return
    3. (existing) Fetch from server → decrypt → create blob → objectUrl
    4. (existing) Store in in-memory Map
    5. NEW: Fire-and-forget saveMediaToCache(messageId, blob, metadata)
    ```
  - The IDB read adds ~1-5ms (vs 200-2000ms for server fetch+decrypt), so it's worth checking
  - When loading from IDB, must create a new `URL.createObjectURL()` since the old one was revoked
  - **File**: `assets/js/chat.js` lines ~770-812

- [ ] **1.5** — Integrate IDB write into `getDecryptedMediaResource(msg)` after successful decrypt
  - After creating the blob and objectUrl (line ~808), fire-and-forget: `saveMediaToCache(messageId, blob, metadata)`
  - **File**: `assets/js/chat.js` line ~810

- [ ] **1.6** — Update `clearDecryptedMediaCache()` to only revoke objectURLs, NOT clear IDB
  - The in-memory Map should still be cleared (objectURLs become invalid on page unload)
  - IDB data must persist across page loads — that's the whole point
  - **File**: `assets/js/chat.js` lines ~932-939

- [ ] **1.7** — Implement LRU eviction with storage quota monitoring
  - On app startup (or after each IDB write), check `navigator.storage.estimate()`
  - If usage > 80% of quota, or if mediaCache exceeds a configurable max (e.g. 500MB):
    - Query all entries sorted by `cachedAt` ascending
    - Delete oldest entries until under threshold
  - Alternative simpler approach: cap at N entries (e.g. 2000) and delete oldest on overflow
  - Create `evictStaleCachedMedia()` function
  - Call it on app init and periodically (e.g. every 10 minutes)
  - **File**: `assets/js/chat.js`, new function

- [ ] **1.8** — Handle message deletion: when a message is deleted (locally or via delete API), also remove its cached media from IDB
  - Find existing delete handler in chat.js and add IDB cleanup
  - Create `removeMediaFromCache(messageId)` function
  - **File**: `assets/js/chat.js`

- [ ] **1.9** — Add a "Clear Media Cache" button in Settings → General
  - Shows current cache size (count of entries + total bytes)
  - Button: "Clear cached media (X MB)" → clears `"mediaCache"` store
  - **File**: `dashboard.php` (HTML), `assets/js/chat.js` (handler), `assets/css/dashboard.css` (styles)

- [ ] **1.10** — Test edge cases
  - Verify: image/video/voice all cached and restored correctly after page refresh
  - Verify: cache hit skips network fetch entirely (check Network tab)
  - Verify: IDB failure (e.g. private browsing mode) falls back to normal fetch+decrypt gracefully
  - Verify: deleted messages have their cached media removed
  - Verify: eviction works when storage is constrained
  - Verify: multi-tab doesn't corrupt IDB (concurrent reads are safe, concurrent writes use transactions)
  - Verify: the `clearDecryptedMediaCache()` on chat switch still works correctly

### Implementation Notes

- **Supported media types**: image (`image_file_path`), video (`any_file_path` with `message_type="video"`), voice (`voice_file_path`)
- **Media endpoint mapping** (chat.js line 714):
  - image → `api/messages/media/get_image.php?id={messageId}`
  - voice → `api/messages/media/get_voice.php?id={messageId}`
  - file/video → `api/messages/media/get_file.php?id={messageId}`
- **Stickers are NOT encrypted** — they load directly via `<img src="api/messages/stickers/get.php?id=...">` and already have `Cache-Control: max-age=86400`. Do NOT cache them in IDB.
- **The `getDecryptedMediaResource` function is the single entry point** for all media decryption. Modifying only this function covers images, videos, voices, and file downloads.
- **Do NOT await IDB writes** in the hot rendering path. Use fire-and-forget: `void saveMediaToCache(...)` to avoid adding latency.
- **Private browsing**: Some browsers disable IndexedDB in private mode. All IDB operations must be wrapped in try-catch with graceful fallback to the existing fetch+decrypt path.

---

## Phase 2 — Chat List + Last Messages Cache

**Effort**: ~4-5 days  
**Impact**: ★★★☆☆ (Medium — faster perceived initial load, instant sidebar)  
**Necessity**: Medium — useful for slow connections and offline browsing  
**Complexity**: Medium-High

### Goal
Cache the chat sidebar list and the last N messages per chat in IndexedDB. On app load, render cached data immediately while syncing fresh data from server in the background.

### Tasks

- [ ] **2.1** — Add `"chatList"` IDB object store
  - Schema: `{ odentifier (keyPath — username or group token), displayName, lastMessage, lastMessageTime, unreadCount, avatarUrl, isGroup, updatedAt }`
  - Populated after each `chats/fetch.php` response
  - **File**: `assets/js/chat.js`

- [ ] **2.2** — Add `"cachedMessages"` IDB object store
  - Schema: `{ id (keyPath — message ID), chatIdentifier (indexed), senderUsername, messageType, decryptedText, timestamp, replyToId, isEdited, isDeleted, reactions, seenAt, groupId, fileMetadata }`
  - Compound index on `[chatIdentifier, id]` for efficient per-chat queries
  - **File**: `assets/js/chat.js`

- [ ] **2.3** — Write to `"chatList"` after sidebar fetch
  - After `chats/fetch.php` response, write each chat entry to IDB
  - **File**: `assets/js/chat.js` in sidebar fetch handler

- [ ] **2.4** — Write decrypted messages to `"cachedMessages"` after render
  - After successful decryption + DOM insertion in `addMessageToChat`, fire-and-forget IDB write
  - Only cache text content + metadata, NOT media blobs (those are in Phase 1's `"mediaCache"`)
  - **File**: `assets/js/chat.js` `addMessageToChat` function

- [ ] **2.5** — Load cached sidebar on app startup (before network fetch)
  - On `DOMContentLoaded`, check `"chatList"` IDB store
  - If entries exist, render sidebar immediately (show "cached" indicator)
  - Then fetch fresh data from server and reconcile (update/add/remove entries)
  - **File**: `assets/js/chat.js` initialization

- [ ] **2.6** — Load cached messages when opening a chat (before network fetch)
  - When user clicks a chat, query `"cachedMessages"` for that `chatIdentifier`
  - Render cached messages immediately (with "loading fresh data..." indicator)
  - Then fetch fresh from `messages/fetch.php` and reconcile
  - **File**: `assets/js/chat.js` `loadMessages` function

- [ ] **2.7** — Handle offline mode
  - If network fetch fails, stay with cached data
  - Show offline banner: "You're offline. Showing cached messages."
  - Disable send button when offline
  - **File**: `assets/js/chat.js`, `assets/css/dashboard.css`

- [ ] **2.8** — Cache invalidation on logout
  - On logout, clear all IDB stores (chatList, cachedMessages, mediaCache)
  - Ensure no data leaks between user sessions
  - **File**: `assets/js/chat.js` logout handler

### Implementation Notes

- **Encryption challenge**: Messages in `messages/fetch.php` response arrive encrypted. Decryption happens during render. The cache must store the DECRYPTED text, meaning cache writes happen after `decryptLongMessage` or `decryptGroupMessage` completes.
- **Chat identifier**: For DMs it's the other user's username, for groups it's `group_{groupId}`. The existing `buildChatQueryParams` / `isGroupToken` helpers define this.
- **Message limit**: Cache the last ~200 messages per chat (configurable). Older messages beyond this window are not cached.
- **The "Load More" button**: When user clicks Load More and older messages are fetched + decrypted, those should also be written to the cache.

---

## Phase 3 — Full Offline Read + Sync Engine

**Effort**: ~6-8 days  
**Impact**: ★★☆☆☆ (Medium-Low — nice to have, full Telegram-like experience)  
**Necessity**: Low-Medium — only needed if app is used heavily offline  
**Complexity**: Very High

### Goal
Full offline message reading with a background sync engine that reconciles local cache with server on reconnect. Handle edits, deletes, reactions, group membership changes.

### Tasks

- [ ] **3.1** — Implement delta sync protocol
  - Track `lastSyncedMessageId` per chat in IDB
  - On reconnect/focus, fetch only messages newer than `lastSyncedMessageId`
  - Merge new messages into cache without duplicates
  - **File**: `assets/js/chat.js`, potentially new `sync.js` module

- [ ] **3.2** — Handle message edits in cache
  - When `messages/fetch_recent.php` returns a message with `is_edited=1` and the cached version differs:
    - Update cached decrypted text
    - Update DOM if message is currently visible
  - **File**: `assets/js/chat.js`

- [ ] **3.3** — Handle message deletions in cache
  - When a message exists in cache but not in server response (within the synced range), mark it deleted
  - When `delete.php` is called locally, remove from cache immediately
  - Handle "delete for everyone" vs "delete for me" distinction
  - **File**: `assets/js/chat.js`

- [ ] **3.4** — Handle reaction updates in cache
  - When `toggle_reaction.php` is called, update cache
  - When fetched messages show different reactions than cached, reconcile
  - **File**: `assets/js/chat.js`

- [ ] **3.5** — Handle seen status updates in cache
  - Cache `seen_at` per message
  - Update on `fetch_seen.php` response
  - **File**: `assets/js/chat.js`

- [ ] **3.6** — Handle group membership changes
  - When user is removed from a group, purge all cached messages + media for that group
  - When group is deleted, purge cache
  - When new members join, no cache impact (but group details cache should update)
  - **File**: `assets/js/chat.js`

- [ ] **3.7** — Offline send queue (optional, advanced)
  - When user sends a message while offline, queue in IDB
  - On reconnect, send queued messages in order
  - Show "pending" indicator on queued messages
  - Handle send failures (retry with backoff)
  - **File**: `assets/js/chat.js`

- [ ] **3.8** — Cache integrity checks
  - On app start, verify IDB stores are not corrupted
  - If corruption detected, clear cache and re-fetch
  - Handle IDB version upgrade gracefully (preserve data where possible)
  - **File**: `assets/js/chat.js`

- [ ] **3.9** — Multi-tab coordination
  - Use `BroadcastChannel` API to notify other tabs of cache updates
  - Or use a simpler approach: each tab syncs independently, IDB handles concurrent access via transactions
  - **File**: `assets/js/chat.js`

### Implementation Notes

- **Server-side support needed**: The current `fetch_recent.php` uses `offsetMsgId` to get messages newer than a given ID. This works for delta sync, but doesn't tell you about deleted messages. A proper sync would need a server endpoint that returns "changes since timestamp" including deletions. Consider adding `api/messages/sync.php` that returns `{ new: [...], edited: [...], deleted: [id, id, ...] }`.
- **Conflict resolution rule**: Server is always authoritative. If server says a message is deleted, delete from cache. If server says text is different, update cache.
- **This phase should NOT be attempted without Phase 2 complete** — the message cache infrastructure from Phase 2 is a prerequisite.

---

## Phase 4 — HTTP Cache Headers + Service Worker Improvements

**Effort**: ~2-3 days  
**Impact**: ★★★☆☆ (Medium — reduces redundant network requests across the board)  
**Necessity**: Medium  
**Complexity**: Low

### Tasks

- [x] **4.1** — Add `session_write_close()` to all read-only API endpoints
  - Eliminates PHP session file lock contention
  - **Status**: ✅ Completed (2026-03-20) — 22+ endpoints updated

- [ ] **4.2** — Add `Cache-Control` headers to encrypted media endpoints
  - `get_image.php`, `get_file.php`, `get_voice.php`: Add `Cache-Control: private, max-age=3600, immutable`
  - Encrypted blobs for a given message ID never change, so they're safe to cache
  - **Files**: `api/messages/media/get_image.php`, `get_file.php`, `get_voice.php`

- [ ] **4.3** — Add `Cache-Control` headers to key API endpoints
  - `get_public.php`: `Cache-Control: private, max-age=86400` (public keys rarely change)
  - `get_private.php`: `Cache-Control: private, max-age=86400, no-store` (sensitive, but rarely changes; prefer no-store for security)
  - **Files**: `api/keys/get_public.php`, `api/keys/get_private.php`

- [ ] **4.4** — Fix Service Worker shell cache / query string mismatch
  - `APP_SHELL_URLS` in `service-worker.js` lists `"./assets/js/chat.js"` (no query param)
  - `dashboard.php` loads `assets/js/chat.js?v=1234567890` (with filemtime query param)
  - These are different URLs to the SW — shell cache doesn't serve the versioned request
  - Fix: either strip query params in SW `fetch` handler matching, or include versioned URLs in shell list
  - Recommended: in the SW fetch handler, match by pathname ignoring query params for shell assets
  - **File**: `service-worker.js`

- [ ] **4.5** — Add `Cache-Control: no-store` to sensitive JSON API responses
  - `get_private.php`: already sensitive, should have `no-store` to prevent browser disk caching of private key PEM
  - Auth endpoints: `login.php` — should not be cached
  - **Files**: Various API endpoints

---

## Appendix A — Existing File/Function Reference

### IndexedDB Infrastructure (chat.js)
| Function | Lines | Purpose |
|---|---|---|
| `initFileCache()` | ~6728-6755 | Opens `TinTinChatFileCache` IDB v1 |
| `saveDownloadedFile(messageId, fileName, fileBlob)` | ~6757-6778 | Writes to `downloadedFiles` store |
| `getDownloadedFile(messageId)` | ~6780-6794 | Reads from `downloadedFiles` store |
| `isFileDownloaded(messageId)` | ~6795-6798 | Boolean check via `getDownloadedFile` |

### Media Decryption Pipeline (chat.js)
| Function | Lines | Purpose |
|---|---|---|
| `getDecryptedMediaResource(msg)` | ~770-812 | **Single entry point**: fetch + decrypt + cache in Map |
| `getDecryptedMediaMetadata(msg)` | ~814-830 | Metadata-only decryption (for file names) |
| `hydrateImageMessageElement(el, msg)` | ~877-900 | Sets `<img>.src` from decrypted resource |
| `hydrateVideoMessageElement(el, msg)` | ~905-931 | Sets `<video>.src` from decrypted resource |
| `clearDecryptedMediaCache()` | ~932-939 | Revokes objectURLs + clears in-memory Map |
| `getMediaEndpointForType(type, id)` | ~714-722 | Maps message_type → API URL |
| `resolveMediaAesKey(msg, wrappedKey)` | ~759-768 | Unwraps AES key (RSA for DM, group key for groups) |

### Crypto Functions (crypto.js)
| Function | Purpose |
|---|---|
| `decryptBinaryWithAesKey(buffer, key)` | AES-GCM decrypt of raw bytes (media blobs) |
| `decryptMediaMetadata(payload, key)` | AES-GCM decrypt of JSON metadata |
| `parseMediaEnvelopePayload(payload)` | Parses `{v, k, m, kv}` envelope |
| `unwrapMediaKeyFromPrivateWrapped(key)` | RSA-OAEP unwrap for DM media |
| `unwrapMediaKeyFromGroupWrapped(key, groupKey)` | AES-GCM unwrap for group media |
| `ensurePrivateKeyLoaded()` | Lazy-loads RSA private key from server |

### In-Memory Caches (chat.js)
| Variable | Line | Purpose |
|---|---|---|
| `decryptedMediaCacheByMessageId` | 252 | Map<messageId, {blob, objectUrl, metadata}> |
| `publicKeyCache` | crypto.js:69 | Map<username, CryptoKey> |
| `groupTextCryptoKeyCache` | ~223 | Map<groupId, CryptoKey> |
| `messageMetaById` | ~251 | Map<messageId, messageObject> |

### Script Load Order (dashboard.php)
```
ui-enhancements.js → pwa.js → api-service.js → chat-utils.js 
→ chat-notifications.js → crypto.js → chat.js → ideas.js → changelog.js
```

### Global Bridge Functions (exposed on window from chat.js)
- `window.getCsrfHeaders()` — returns `{"X-CSRF-Token": token}`
- `window.setComposerStatus(message, type)` — sets composer status bar
- `window.loadIdeasList(page)` — loads ideas tab
- `window.ApiService.json(url, opts)` — fetch + parse JSON (from api-service.js)
- `window.ApiService.jsonOk(url, opts)` — fetch + parse + assert status=ok
- `window.ChatUtils.escapeHtml(text)` — HTML entity escaping
- `showModal(title, body, type)` — global modal function (from modal.js)

---

## Appendix B — Architecture Constraints

1. **Vanilla JS + global `<script>` tags** — no ES modules, no bundler. All files share global scope via `window.*`.
2. **PHP backend** — no Node.js, no Redis, no server-side caching layer.
3. **PDO with emulated prepares** — `mbstring` not installed, use `strlen()` not `mb_strlen()`.
4. **Encryption is client-side** — server stores only encrypted blobs. Cache must store DECRYPTED content.
5. **Session**: PHP file-based sessions with `session_write_close()` optimization on all read-only endpoints.
6. **Cache-busting**: JS files use `?v=filemtime()` query param in `dashboard.php` script tags.
