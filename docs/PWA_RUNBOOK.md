# TinTinChat PWA Runbook

Last updated: 2026-03-11

## 1) Runtime Caching Policy

Service worker: `service-worker.js`

### 1.1 App shell
- Strategy: cache-first
- Cache group: `ttc-pwa-v1-shell` / `ttc-pwa-v1-static`
- Targets:
  - core pages (`index.php`, `offline.html`)
  - CSS/JS bundles and icon assets
- Purpose: offline app boot and quick startup.

### 1.2 API chat data
- Strategy: network-first (timeout-aware) with stale fallback
- Cache group: `ttc-pwa-v1-api`
- Allowlist:
  - `/api/chats/fetch.php`
  - `/api/messages/fetch.php`
  - `/api/messages/fetch_recent.php`
  - `/api/messages/fetch_seen.php`
  - `/api/groups/fetch.php`
  - `/api/groups/fetch_details.php`
  - `/api/typing/fetch.php`
  - `/api/messages/stickers/fetch.php`
- Fallback behavior:
  - return cached response when network fails/timeouts,
  - return explicit `503` JSON error when no cache exists.

## 2) Secure Caching Policy

### 2.1 No plaintext persistence policy
- Client decrypts content in runtime memory only.
- Service worker does not cache sensitive media/file retrieval domains.

### 2.2 Denylist in SW
- Prefixes denied from API caching:
  - `/api/messages/media/`
  - `/uploads/`
- Result: encrypted attachment fetches are never persisted by SW cache policy.

## 3) Installability UX

Implemented in `assets/js/pwa.js`:
- Registers service worker on page load.
- Captures `beforeinstallprompt` and exposes `Install app` action in settings panel.
- Uses fallback install guidance if browser does not expose prompt.
- Hides install action after successful `appinstalled`.

## 4) Safe Update Strategy

- Registration URL is versioned by file mtime query (`service-worker.js?v=<version>`).
- SW update lifecycle:
  - `updatefound` monitored.
  - Users are informed that refresh applies newest version.
  - `controllerchange` forces one reload to activate new worker cleanly.

## 5) Offline / Poor-Network UX

### 5.1 Fetch
- Message loading already exposes inline retry (`Retry`) on fetch failures.

### 5.2 Send
- Offline send guard in composer:
  - immediate offline warning,
  - inline `Retry Send` action,
  - retry after reconnect or transient failure.

## 6) Push Notification Readiness Checklist

- [ ] Add push token table in DB (`user_id`, `endpoint`, key material, `updated_at`).
- [ ] Add authenticated subscribe/unsubscribe APIs with CSRF + ownership checks.
- [ ] Add token invalidation on 404/410 provider responses.
- [ ] Add user opt-in/out preference in settings.
- [ ] Add backend job/worker for push fanout and retry policy.
- [ ] Add payload policy: never include plaintext message body.

## 7) Compatibility QA Checklist

### Browsers
- [ ] Chrome desktop (install prompt + offline shell + update flow)
- [ ] Edge desktop (install prompt + offline shell + update flow)
- [ ] Firefox desktop (fallback guidance + offline behavior)
- [ ] Safari macOS (fallback guidance + standalone checks where supported)

### Mobile
- [ ] Android Chrome (A2HS + standalone launch + reconnect behavior)
- [ ] Android Firefox (fallback guidance + network transitions)
- [ ] iOS Safari (Add to Home Screen instructions + standalone launch)

### Functional checks
- [ ] Manifest loads and icons resolve.
- [ ] SW registers without console errors.
- [ ] Offline launch reaches shell/fallback page.
- [ ] Chat fetch fallback works when previously cached.
- [ ] Send retry UX is visible and actionable offline.

## 8) Release Operations

### 8.1 Cache busting
1. Update `SW_VERSION` in `service-worker.js` for release.
2. Deploy updated assets.
3. Confirm clients receive update notice and one-time reload.

### 8.2 Rollback
1. Revert service worker + manifest + assets to last stable.
2. Deploy with restored `SW_VERSION` lineage.
3. Validate with hard refresh and fresh private session.

### 8.3 Update rollout verification
- [ ] Fresh login loads correct `manifest.webmanifest`.
- [ ] `navigator.serviceWorker.controller` becomes active.
- [ ] App shell requests served from cache on second load.
- [ ] No stale API schema mismatches in cached JSON.
