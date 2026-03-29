# TinTinChat Tasks

Date: 2026-03-18  
Source: Current codebase review + PRD + Technical Design

Legend:
- Priority: `P0` critical, `P1` high, `P2` medium, `P3` nice-to-have
- Status: `[x]` done, `[ ]` planned

## 1) Completed Tasks (Already Implemented)

### Product/Core
- [x] (`P0`) User auth flow with session-based login and logout.
- [x] (`P0`) Auto-registration for unknown usernames with password hash storage.
- [x] (`P1`) Responsive dashboard + chat layout for desktop/mobile.
- [x] (`P1`) Username search + suggestion dropdown.
- [x] (`P1`) Chat list from message history.

### Messaging
- [x] (`P0`) 1:1 text messaging.
- [x] (`P0`) Client-side RSA text encryption/decryption using Web Crypto.
- [x] (`P1`) Read receipts (`seen_at`) with tick indicators.
- [x] (`P1`) Message pagination with load-more and go-to-latest controls.
- [x] (`P1`) Polling for near real-time updates.

### Media & Files
- [x] (`P1`) Voice message recording/upload/playback.
- [x] (`P1`) Image upload and modal preview.
- [x] (`P1`) Generic file upload/download.
- [x] (`P2`) IndexedDB caching for downloaded files.

### Security/Infra (partial)
- [x] (`P1`) Prepared statements used in DB queries.
- [x] (`P1`) Login CSRF protection.
- [x] (`P1`) Session cookie hardening basics (`HttpOnly`, `SameSite`, `Secure` when HTTPS).
- [x] (`P1`) Authorization checks on protected media retrieval endpoints.

## 2) Current Gaps from Your Requested Feature Set

- [x] (`P0`) Full source review for debugging/improvement.
- [x] (`P0`) Complete security audit + hardening across all endpoints.
- [x] (`P1`) Reply to message.
- [x] (`P1`) Small copy-message action.
- [x] (`P1`) Message context menu (right-click/long-press).
- [x] (`P1`) Forward message.
- [x] (`P1`) Forward message via in-app chat picker modal (no prompt flow).
- [x] (`P1`) UI/UX simplification and consistency pass.
- [x] (`P1`) Message details action and modal in context menu.
- [x] (`P1`) Live seen-tick refresh using targeted seen-status polling.

### Post-Review Maintenance & Optimization (2026-03-10)
- [x] (`P0`) Harden logout flow to POST + CSRF and remove state-changing GET logout behavior.
- [x] (`P1`) Fix auth flow consistency issue in login redirect handling.
- [x] (`P1`) Run frontend cleanup pass:
	- remove debug logging,
	- remove unused jQuery runtime dependency,
	- remove dead/redundant UI-enhancement logic.
- [x] (`P1`) Run UI harmony/accessibility pass:
	- composer button layering consistency,
	- stronger reduced-motion behavior for animation-heavy interactions.
- [x] (`P1`) Run backend cleanup/optimization pass:
	- remove unreferenced helper functions,
	- apply low-risk hot-path query micro-optimizations in message fetch APIs.
- [x] (`P0`) Validate all changes with full automated test suite reruns.

## 3) Priority Roadmap (Planned)

### Phase A — Stabilization & Security (`P0`)
- [x] (`P0`) Standardize endpoint method checks (`GET/POST/DELETE`) everywhere.
- [x] (`P0`) Standardize API JSON response contract across all endpoints.
- [x] (`P0`) Add CSRF validation to every state-changing endpoint.
- [x] (`P0`) Centralize auth/method/input guards in shared include utility.
- [x] (`P0`) Normalize upload validation (server-side MIME + size + extension policy).
- [x] (`P0`) Align frontend and backend file size limits.
- [x] (`P0`) Run full endpoint authorization review for cross-user data isolation.
- [x] (`P0`) Create security regression checklist and execute after each major change.

### Phase B — Message Actions (`P1`)
- [x] (`P1`) DB migration: add `reply_to_message_id` to `messages`.
- [x] (`P1`) DB migration: add forwarding metadata columns.
- [x] (`P1`) Add backend support for `reply_to_message_id` in send/fetch endpoints.
- [x] (`P1`) Implement UI reply composer state + quoted preview.
- [x] (`P1`) Render quoted/referenced original message block in message bubble.
- [x] (`P1`) Add copy button for text messages with clipboard fallback.
- [x] (`P1`) Add message context menu component (desktop + mobile parity).
- [x] (`P1`) Add forward message flow (text first).
- [x] (`P1`) Add delete action entry in context menu using existing endpoint.

### Phase C — UX Quality (`P1/P2`)
- [x] (`P1`) Improve empty states and inline error/retry UX.
- [x] (`P1`) Improve message action discoverability (hover/focus/long-press cues).
- [x] (`P1`) Improve mobile composer ergonomics and action placement.
- [x] (`P2`) Improve accessibility: keyboard focus, ARIA labels, context menu navigation.
- [x] (`P2`) Improve visual consistency of status indicators and message metadata.
- [x] (`P2`) Add lightweight user settings (notification sound on/off, auto-scroll behavior).
- [x] (`P2`) Centralize key user-facing modal strings in chat actions/errors for localization-readiness.

### Phase D — Maintainability (`P1/P2`)
- [x] (`P1`) Introduce internal `api-service.js` for consistent fetch/error handling.
- [x] (`P1`) Split `chat.js` into smaller modules while keeping vanilla JS approach.
- [x] (`P2`) Introduce shared constants for limits/timeouts (frontend + backend sync).
- [x] (`P2`) Add developer docs for endpoint contract and error codes.

### Phase E — Group Support (`P1/P2`)
- [x] (`P1`) **Milestone E1 — Schema Foundation**
	- define group chat data model and migration plan:
	- `groups` table (`id`, `title`, `description`, `created_by_user_id`, `join_token`, `created_at`, `updated_at`),
	- `group_members` table (`group_id`, `user_id`, `role`, `joined_at`, `invited_by_user_id`),
	- `messages.group_id` nullable FK for group messages,
	- keep direct-message compatibility fully intact.
- [x] (`P1`) **Milestone E2 — Group Lifecycle APIs**
	- implement backend APIs for group lifecycle:
	- create group,
	- update group details,
	- fetch user groups,
	- fetch group details + members,
	- add member (owner/admin-controlled),
	- join group by secure tokenized link.
- [x] (`P1`) **Milestone E3 — Join Link Management**
	- add group join-link flow with rotation/revocation:
	- generate copyable invite link,
	- allow owner/admin to rotate link,
	- validate expiry/authorization rules server-side.
- [x] (`P1`) **Milestone E4 — Message API Group Parity**
	- extend send/fetch message APIs to support group conversations:
	- sender identity always included per message,
	- membership check on all group reads/writes,
	- seen/read behavior adapted for group-safe semantics.
- [x] (`P1`) **Milestone E5 — Group UI Entry + Navigation**
	- add group UI entry points in chat list:
	- create-group action,
	- clear visual distinction between users and groups,
	- fast switch between direct and group chats.
- [x] (`P1`) **Milestone E6 — Group Details Panel**
	- add group details panel in chat header area:
	- title,
	- description/details,
	- members list,
	- add-member button,
	- copy/rotate join-link actions.
- [x] (`P1`) **Milestone E7 — Group Message Rendering**
	- update message renderer for group context:
	- show sender name/avatar on each inbound group message,
	- keep clean bubble spacing for repeated sender blocks,
	- preserve existing media/file rendering behavior.
- [x] (`P1`) **Milestone E8 — Action Parity (Reply/Forward/Copy/Delete/Details)**
	- ensure message actions parity in groups:
	- reply works end-to-end in groups,
	- forward supports user→group, group→user, and group→group targets,
	- copy/details/delete behaviors follow group permissions.
	- text-first group parity delivered; group media/file parity remains follow-up.
- [x] (`P2`) **Milestone E9 — Roles & Permissions**
	- add group role/permission policy baseline:
	- owner/admin/member roles,
	- add/remove member permissions,
	- optional group leave and owner-transfer safeguards.
- [x] (`P2`) **Milestone E10 — UX Polish + QA Closure**
	- add user-friendly polish for group UX:
	- empty states for new groups,
	- member-add success/error feedback,
	- lightweight “new in group” badge in list,
	- accessibility parity (keyboard + screen reader labels).
	- run full regression for direct chat flows (reply/forward/seen/media) before closing Phase E.

### Phase E.1 — Group Text Encryption (`P1`)
- [x] (`P1`) Implement shared group text encryption key model (single encrypted payload per group message).
- [x] (`P1`) Add member key distribution for create/add/join flows with membership-gated access.
- [x] (`P1`) Encrypt/decrypt group text and forwarded text across group↔group, user↔group paths.
- [x] (`P1`) Expand encrypted text storage capacity (`messages.message`, `messages.message_for_sender`) to `MEDIUMTEXT` for larger payload support.

### Phase E.2 — Group Media/File Encryption (Separate) (`P1/P2`)
- [x] (`P1`) Encrypt group voice message payloads with shared group key.
- [x] (`P1`) Encrypt group image payloads (at-rest + transport metadata policy).
- [x] (`P1`) Encrypt group generic file payloads with secure key handling.
- [x] (`P1`) Apply full media encryption parity to direct/private chats (voice/image/file) using same envelope model.
- [x] (`P2`) Add key-versioning/rotation strategy for non-text encrypted attachments.
- [x] (`P2`) Add migration/backfill policy for legacy unencrypted group media/files.

### Phase F — Chatroom Parity Features (Recommended) (`P2/P3`)
- [x] (`P2`) Search inside current conversation.
- [x] (`P3`) Message reactions (minimal emoji set).
- [x] (`P3`) Delete policy simplified to a single global Delete action for allowed participants.
- [x] (`P3`) Improve Search conversation: Allow searching in old messages (for now it just searchs loaded messages only)
- [x] (`P3`) Add separate Send Video/Record Video option (Use File mode with video flag or something)

### Phase F.5 — Avatar Assignment (Small) (`P2`)
- [x] (`P2`) DB migration for user avatar metadata/path.
- [x] (`P2`) Add secure avatar upload endpoint with MIME/size validation.
- [x] (`P2`) Add avatar retrieval endpoint + default fallback behavior.
- [x] (`P2`) Show avatars in chat list, member lists, and message sender contexts.
- [x] (`P2`) Add simple profile/avatar update UI action.

### Phase F.6 — Avatar & User Profile UX Hardening (Pre-Stickers) (`P1/P2`)
- [x] (`P1`) Run focused post-Phase-F.5 review and bug sweep:
	- verify upload/retrieval behavior for valid/invalid avatar files,
	- verify cache-busting and fallback rendering across desktop/mobile,
	- verify no regressions in chat list, group members, and sender avatar contexts.
- [x] (`P1`) Define user info entry points (from direct chat header and chat list item click/secondary action).
- [x] (`P1`) Extend user-info entry points to group context:
	- click sender avatar/name in incoming group messages,
	- click member avatar in group details panel.
- [x] (`P1`) Add **User Info modal** for direct-chat target with minimal profile details:
	- username,
	- user ident/metadata that is safe to expose,
	- current avatar preview in circular style.
- [x] (`P1`) Add **Show Avatar** action in the User Info modal.
- [x] (`P1`) Implement enlarged avatar viewer (overlay/modal) opened from User Info modal avatar click.
- [x] (`P1`) Add **Send Message** action from User Info modal to jump to private chat with that user.
- [x] (`P2`) Add close/escape/backdrop interactions and keyboard accessibility for User Info + enlarged avatar views.
- [x] (`P2`) Add optional user actions section in User Info modal (planned):
	- `Delete Chat` (remove all direct-chat messages between current user and target user) with explicit confirmation,
	- reserve space for future actions (mute/block/report policy, if introduced later).
- [x] (`P2`) Define backend/API contract for `Delete Chat` action (scope, auth, audit safety, and response contract) before implementation.
- [x] (`P2`) Add regression checklist for this phase (modal behavior, avatar enlarge UX, destructive-action safeguards).

### Phase G — Sticker Support (Telegram-like) (`P1/P2`)
- [x] (`P1`) Define sticker format spec aligned to Telegram style:
	- static sticker image on `512x512` canvas,
	- one side exactly `512px` (the other side `<=512px`),
	- preferred `WEBP`, allow `PNG` fallback,
	- enforce max upload size (target: `<=512KB` per sticker).
- [x] (`P1`) DB migration: add `stickers` table (id, file_path, width, height, uploaded_by_user_id, created_at, is_active).
- [x] (`P1`) DB migration: add sticker message reference (e.g. `messages.sticker_id` nullable FK).
- [x] (`P1`) Add backend endpoint to upload sticker image with validation/resizing to spec.
- [x] (`P1`) Add backend endpoint to fetch sticker catalog (global list usable by all users).
- [x] (`P1`) Add backend support to send sticker messages and fetch/render them in chat history.
- [x] (`P1`) Add sticker picker section in composer area (toggle/button + grid list of stickers).
- [x] (`P1`) Add “Add Sticker” button inside sticker section for user uploads.
- [x] (`P2`) Add lightweight sticker management safeguards:
	- file type + dimension checks,
	- duplicate/hash check,
	- basic moderation control (`is_active` flag for admin disable).
- [x] (`P2`) Add UX states for sticker flow (loading, empty, upload progress, error/retry).


### Phase H - Tests
- [x] (`P2`) Phase H bootstrap: add lightweight local test harness and first smoke checks.
- [x] (`P1`) Add authenticated endpoint smoke flow for login/session + send/fetch message.
- [x] (`P1`) Extend authenticated smoke flow with reaction/delete/sticker coverage.
- [x] (`P2`) Unit Tests for important operations/actions.
- [x] (`P1`) E2E Tests
- [x] (`P1`) Extend tests by adding new unit and e2e tests
- [x] (`P1`) Add scripts and tools to setup whole testing requirements and run all tests easily.


### Phase I — Nice to Have (Power UX) (`P3`)
- [x] (`P3`) Add Block user: Blocked user is not able to send message to the blocker anymore.
- [x] (`P3`) Add **Select messages** action to message context menu.
- [x] (`P3`) Implement select mode behavior:
	- tap/click messages to multi-select,
	- show selected count,
	- clear visual selected state on cancel/success.
- [x] (`P3`) In select mode, show top action bar with:
	- `Cancel`,
	- `Forward`,
	- `Delete`.
- [x] (`P3`) Implement bulk actions for selected messages:
	- bulk forward to chosen target chat,
	- bulk delete with confirmation and partial-failure handling.
- [x] (`P3`) Add **Edit message** (text only) with time limit and edited marker:
	- context menu item `Edit` on eligible sent text messages,
	- composer enters edit mode with save/cancel,
	- show `edited` metadata in message bubble.
- [x] (`P3`) Add **Settings modal** with user UI preferences:
	- theme mode (`System` / `Light` / `Dark`),
	- compact vs comfortable density,
	- show/hide message timestamps,
	- animation/reduced motion toggle.
- [x] (`P3`) Add persistence for UI preferences (localStorage first, optional server sync later).
- [x] (`P3`) Add keyboard shortcuts for power users:
	- `Esc` to exit select/edit mode,
	- `Ctrl/Cmd + A` for select-all visible (when in select mode),
	- `Ctrl/Cmd + Enter` to save edit.
- [x] (`P3`) Add guardrails for destructive bulk actions (confirm dialogs + clear success/error summaries).

### Phase J — PWA Support (Final Phase) (`P1/P2`)
- [x] (`P1`) Add web app manifest (`name`, `short_name`, icons, theme/background, display mode).
- [x] (`P1`) Register service worker with safe versioned update strategy.
- [x] (`P1`) Implement core app-shell caching strategy for offline launch.
- [x] (`P1`) Define runtime caching policies for API calls (network-first for chat data, stale fallback rules).
- [x] (`P1`) Define secure caching policy for encrypted media/file payloads (no plaintext persistence beyond policy).
- [x] (`P2`) Add installability UX (install prompt handling + fallback guidance).
- [x] (`P2`) Add push notification readiness checklist (permissions flow + backend token lifecycle plan).
- [x] (`P2`) Add iOS/Android/browser compatibility QA checklist for PWA behavior.
- [x] (`P2`) Add offline/poor-network UX states for message fetch/send retry.
- [x] (`P2`) Add PWA release runbook (cache busting, rollback, update rollout).

### Phase J.2 — Group seen manager & Unread counter (`P2`)
- [x] (`P2`) Add the group message seen system (the first user seeing my message, means message is seen)
- [x] (`P2`) Implement unread message counter for group chats.

### Phase K — Improvements (`P2`)
- [x] (`P3`) Add other customization for user if you have something in mind (For example font size change)
- [x] (`P3`) Add Avatar change and username and password change options to settings (Make settings sectioned by tabs)
- [x] (`P3`) Improve the Settings modal UI (styles & animations)
- [x] (`P3`) Add Edit message option to messages; It's obvious it should only for normal text messages; Other types of messages or fprwarded messages don't need editting.
- [x] (`P3`) Add new tests for new sections & for sections that didn't had tests.

### Phase L — Post-K Features & Optimizations (`P2/P3`)
- [x] (`P2`) **Ideas / Feedback system** (full stack):
	- DB migration (`ideas`, `idea_votes`, `idea_replies` tables),
	- 5 API endpoints (create, fetch, vote, reply, delete),
	- Ideas tab UI with vote/reply/delete, anonymous authors for non-superuser,
	- Superuser-only reply and superuser/owner delete permissions (server-enforced),
	- In-place vote DOM updates, delete confirmation dialog, Enter key reply, disabled states during API calls.
- [x] (`P2`) **Swipe-to-reply / edit / forward gestures**:
	- Swipe right to reply, swipe left on own text to edit, swipe left on others to forward,
	- Visual feedback (translation + opacity indicators), mobile/touch support.
- [x] (`P2`) **Browser Notification API**:
	- Permission prompt and toggle in settings,
	- Desktop notifications for new messages when tab is hidden/unfocused,
	- Fixed notification body field name (`lastMsg.text` → `lastMsg.message`),
	- Fixed hidden-tab polling gap (now fetches messages every ~5s when notifications enabled).
- [x] (`P2`) **Changelog / What's New modal**:
	- DB migration for `tips_seen_at` column on users table,
	- `api/users/dismiss_changelog.php` POST endpoint,
	- Animated modal with blur backdrop, styled item list, highlight effect, dark mode,
	- Auto-shows when `tips_seen_at` is null or older than manually-updated `CHANGELOG_LAST_UPDATED` JS constant.
- [x] (`P2`) **Typing status merged into fetch_recent** (network optimization):
	- Typing queries inlined into `api/messages/fetch_recent.php` response,
	- Eliminated separate `/typing/fetch.php` call from polling loop,
	- New shared `applyTypingData()` JS function.
- [x] (`P2`) **Superuser / admin fixes**:
	- `$is_superuser` computed independently of `$is_admin` (username match only),
	- Score display fix ("+0" → "0").
- [x] (`P3`) **Blocked users management UI**:
	- Blocked users section in settings modal with unblock capability.
- [x] (`P3`) **UX modernization** (Telegram-inspired):
	- Settings controls polish, chat header action bar styling,
	- Account avatar preview/sync, cache-busting for startup CSS/JS,
	- Load-more scroll anchoring, voice waveform baseline fix.

### Phase M — New Features & Enhancements (`P1/P2`)
- [x] (`P1`) **Multiline message input**:
	- Textarea auto-grow on input (max 150px), proper CSS height transition,
	- Reset height on send/clear.
- [x] (`P1`) **Send by Enter setting**:
	- Toggle in General settings, Enter sends (default) or Shift+Enter sends,
	- Ctrl/Cmd+Enter always saves edits.
- [x] (`P1`) **Music file display** (Telegram-style):
	- Audio file detection by extension set (mp3, wav, ogg, flac, aac, m4a, etc.),
	- Inline player with play/pause, progress bar (seekable), duration, format badge,
	- Gradient styling with dark mode, auto-pause other playing audio.
- [x] (`P1`) **Saved Messages** (self-chat):
	- No new tables — `sender_id == receiver_id` in existing messages table,
	- Bookmark icon avatar, always at top of chat list,
	- "Save" context menu action on all messages (text forwarded, media saved as label),
	- Forward target list includes Saved Messages, search finds Saved Messages,
	- Toggle in General settings to show/hide, typing status disabled for self-chat.
- [x] (`P2`) **Username blacklist**:
	- `TTC_USERNAME_BLACKLIST` constant with ~30 reserved names,
	- Server-side check in `apiNormalizeUsername()` and `login.php` registration,
	- Client-side check in `index.php` with JS `RESERVED_USERNAMES` array,
	- Case-insensitive with separator stripping (dashes, underscores, spaces removed).
- [x] (`P1`) **Global Announcements system**:
	- DB migration (`announcements` table with title, body, user_id, created_at),
	- 3 API endpoints (create, fetch, delete) with superuser-only write access,
	- Admin panel "Announcements" section with create form and delete buttons,
	- Alert button in chat header with bullhorn icon and unread dot indicator,
	- Announcements overlay panel with styled item list, author, timestamps,
	- Unread detection via `tips_seen_at` comparison with latest announcement.
- [x] (`P2`) **Playlist** (music collection):
	- localStorage-based playlist storage with encrypted message meta for offline playback,
	- "Add to Playlist" context menu option on music messages,
	- Playlist button visible in chat header when viewing Saved Messages,
	- Playlist panel overlay with play/pause, auto-advance to next track, remove tracks,
	- Gradient-styled play buttons with pulse animation.
- [x] (`P2`) **Message horizon improvement**:
	- Reduced from 100% to 60% of free space adjacent to message for context menu trigger.
- [x] (`P2`) **Click/double-click/long-click refactor**:
	- Unified interaction model for messages across desktop and mobile.
- [x] (`P2`) **Bug fixes**:
	- Voice bar click when voice not yet played,
	- Context menu re-opening on outside click (now closes properly).

### Phase M.1 — Fixes & Improvements
- [x] (`P1`) **Multimedia forward support**:
	- Forward button and swipe-left gesture now work for all message types (voice, image, video, file, music, sticker),
	- Forwards as text label with `forwarded_from_message_id` reference.
- [x] (`P2`) **Voice recording UI fix**:
	- Recording indicator now hides immediately when user stops recording (before upload completes).
- [x] (`P2`) **Input area improvements**:
	- Hidden scrollbar on message input textarea,
	- Arrow keys no longer leak to parent handlers,
	- Long-press magnify on mobile (expands textarea with larger font for easier editing).
- [x] (`P2`) **Username blacklist cleanup**:
	- Removed superuser username from reserved list (already protected by superuser logic).
- [ ] (`P2`) **Saved Messages click-to-navigate**:
	- Clicking a saved message (forwarded from another chat) should navigate to the original chat and scroll to the source message.

### Phase M.2 — Media Forward, Saved Messages Panel & Fixes
- [x] (`P1`) **Actual media forwarding**:
	- Forwarding multimedia messages now re-encrypts and sends the actual media (voice, image, video, file, sticker) instead of text labels.
	- Backend: added `forwarded_from_message_id` support to all media send endpoints (voice, image, file, sticker).
	- Save to Saved Messages also sends actual media now.
- [x] (`P2`) **Saved Messages details panel**:
	- New side panel (like group info) with message type statistics and full playlist management.
	- Playlist section with play/pause/prev/next controls, seekable progress bar, and track delete.
	- Now Playing bar with live progress, time display, and seek support.
- [x] (`P2`) **Playlist orphan cleanup**:
	- Deleting a message now removes it from the playlist automatically.
- [x] (`P2`) **Announcement button visibility**:
	- Announcement button now only visible when no chat is selected; hidden once a chat is opened.
- [x] (`P2`) **Music player UI improvements**:
	- Progress bar increased to 6px, fully draggable (mouse + touch), with seek handle indicator.
	- Music player container fills message bubble width properly.

### Phase M.3 — Forwarded Tag, Global Now Playing & Polish
- [x] (`P1`) **Forwarded-by tag on multimedia messages**:
	- All forwarded multimedia messages (voice, image, video, file, sticker) now show "Forwarded by ... · from ..." tag.
- [x] (`P1`) **Global Now Playing bar**:
	- Persistent mini-player below chat header; shows when voice/music is playing.
	- Play/pause, seekable progress slider, time display, caption (filename for music, sender · time for voice).
	- Audio persists across chat switches (detached from DOM before chat clear).
	- Hooks into in-message voice/music players and saved panel playlist.
- [ ] (`P2`) **Caption for multimedia messages**:
	- Allow adding text captions to voice, image, video, and file messages (like Telegram).

### Phase M.4 - Favorite chats
- [ ] (`P2`) **Decode on Interface**:
	- Decide on ways to go to it, where it should be, what other roperties it should have, etc.
- [ ] (`P3`) **Database structure upgrade & migrations**:
		- Write migrations that adds the table and columns requied.
- [ ] (`P3`) **Implement The Section**:
		- Implement the actual Favorite Chat section.
- [ ] (`P3`) **Add to Favorites**:
		- The interface to add chats to favorites.
- [ ] (`P3`) **Animations & Improvements & Shortcuts**:
		- Add animations & extra creative options & also shortcut approach on opening the section

### Phase M.5 - Minor UI Improvements
- [ ] (`P2`) **Style/animation upgrade**:
	- Platform-wide visual polish: smoother transitions, refined animations, UI beautification.
- [ ] (`P3`) **Constant Add to Playlist**:
		- Find a way to prevent Add to playlist again, on a music message which has been added.
- [ ] (`P3`) **Anouncement Red Counter**:
		- It seems that its not working (or at least working properly).
- [ ] (`P3`) **Admin Section UI**:
		- Improve and Beautfy Admin section, esp. Post anouncement section & Refresh button
- [ ] (`P3`) **Stupid Action bar**:
		- The action bar was always this way despite how many times i asked for improvement and styling.
- [ ] (`P3`) **Magnifying Input Message**:
		- Magnifying input message on hold, works stupidly. Improve it.

### Phase N — E2E Encryption Upgrade (Private Key Protection) (`P1`)
- [ ] (`P1`) **Password-derived KEK for private key encryption**:
	- Encrypt user private keys at rest using AES-GCM with a PBKDF2-derived Key Encryption Key (KEK).
	- Move RSA keypair generation from server-side (OpenSSL) to client-side (WebCrypto).
	- Convert login flow to AJAX for password availability during KEK derivation.
	- Dual-mode support: legacy (plaintext) and upgraded (encrypted) accounts during migration.
	- Auto-migration: legacy users transparently upgrade on next login.
	- Full design doc: `docs/E2E_ENCRYPTION_UPGRADE.md`
- [ ] (`P1`) **Client-side group key distribution**:
	- Move group shared key distribution from server-side to client-side.
	- Server can no longer read private keys to unwrap/re-wrap group keys.
	- Pending distribution table for deferred key delivery when no member is online.
	- Online members auto-distribute keys to pending new members.
- [ ] (`P2`) **Password change re-encryption**:
	- Re-encrypt private key with new KEK on password change.
	- Atomic update of password hash + encrypted private key + kek_salt.
- [ ] (`P3`) **Split auth/KEK derivation (Phase 2 hardening)**:
	- Derive auth_hash and KEK separately client-side so server never sees raw password.
	- Requires full auth flow rewrite (server stores bcrypt of auth_hash, not password).
- [ ] (`P3`) **Group key rotation on member removal**:
	- Generate new group key when a member is removed, re-distribute to remaining members.

## 4) Suggested Execution Order

1. Security and endpoint consistency (`P0`)  
2. Reply + context menu + copy + forward (`P1`)  
3. UX polishing and accessibility (`P1/P2`)  
4. Group support foundation + UX (`P1/P2`)  
5. Optional parity features (`P2/P3`)  
6. Avatar/profile UX hardening + user info modal (`P1/P2`)
7. Telegram-like sticker support (`P1/P2`)  
8. Tests foundation + coverage (`P1/P2`)
9. Nice-to-have power UX (`P3`)
10. Final PWA support rollout (`P1/P2`)

## 5) Definition of Done (for upcoming feature work)

For each new feature/task:
- [ ] Backend validations + auth checks included.
- [ ] UI behavior works on desktop and mobile.
- [ ] Error states are user-friendly and actionable.
- [ ] No breaking change to existing message types.
- [ ] Manual regression checklist completed.
