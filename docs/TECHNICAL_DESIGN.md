# TinTinChat Technical Design

Version: 1.3
Date: 2026-03-11

## 1) Overview

TinTinChat is a monolithic PHP + MySQL web application with a vanilla-JS client.
The design emphasizes low operational complexity, predictable API contracts, and secure-by-default guard patterns.

## 2) System Architecture

### 2.1 Runtime components
- Entry pages:
  - `index.php` (auth)
  - `dashboard.php` (chat shell)
- Backend APIs (organized by domain):
  - `api/auth/*`
  - `api/chats/*`
  - `api/groups/*`
  - `api/keys/*`
  - `api/messages/*`
  - `api/system/*`
  - `api/typing/*`
  - `api/users/*`
- Shared backend helpers:
  - `includes/db.php`, `includes/api_helpers.php`, `includes/auth.php`, `includes/group_helpers.php`, `includes/group_crypto_helpers.php`, `includes/constants.php`, etc.
- Frontend:
  - `assets/js/chat.js` (main interaction surface)
  - `assets/js/api-service.js` (request/error normalization)
  - `assets/js/pwa.js` (PWA registration/install/update handling)
  - additional helper modules
- PWA baseline:
  - `manifest.webmanifest`
  - `service-worker.js`
  - `offline.html`
- Storage:
  - MySQL for metadata and message records
  - local `uploads/*` for encrypted media + avatars/stickers

### 2.2 Request flow (typical)
1. Client authenticates via `api/auth/login.php`.
2. Client loads chat list from `api/chats/fetch.php`.
3. Client selects target (username or group token) and fetches paginated messages via `api/messages/fetch.php`.
4. Incremental recent updates poll `api/messages/fetch_recent.php`.
5. Mutations use organized routes with method/auth/CSRF guards.

## 3) Data Model (High-level)

### 3.1 Core entities
- `users`
- `messages`
- `groups`
- `group_members`
- `group_member_keys`
- `message_reactions`
- `stickers`
- supporting tables for typing/block/session-related features

### 3.2 Message model highlights
- `messages.group_id` nullable for direct/group split.
- text encryption payloads in `message` and `message_for_sender`.
- `message_type` supports `text`, `voice`, `image`, `video`, `file`, `sticker`.
- action metadata:
  - `reply_to_message_id`
  - `forwarded_from_message_id`
  - `forwarded_by_user_id`
- status metadata:
  - `seen_at`

## 4) API Design Conventions

### 4.1 Guard sequence
For protected mutating routes:
1. `apiRequireMethod(...)`
2. `apiRequireAuth()`
3. `apiRequireCsrf()`
4. normalize/validate input
5. execute domain logic
6. respond with `apiSuccess(...)` / `apiError(...)`

Auth route note:
- Login uses POST + CSRF form validation.
- Logout uses POST + CSRF validation (no state-changing GET logout flow).

### 4.2 Response envelope
- Success: `status: ok` + endpoint payload
- Error: `status: error` + `error_details.code`

Reference: `docs/API_CONTRACT.md`

### 4.3 Routing policy
- Legacy flat root wrappers are removed.
- New and existing consumers must use organized endpoint paths only.

## 5) Encryption Design (Summary)

- Private text: client-side public-key flow (recipient + sender copies).
- Group text: shared group key flow.
- Media/files: encrypted envelope containing wrapped media key + encrypted metadata.
- Server stores ciphertext and enforces access control; client performs decryption.

Reference: `docs/ENCRYPTION.md`

## 6) Frontend Interaction Model

- Chat state tracks selected target, pagination offset, recent window, unread/status metadata.
- Polling drives near-real-time behavior for active chat and list refresh.
- Message renderer supports all message types and action affordances.
- Scroll behavior:
  - initial load/new appends snap to latest when auto-scroll enabled,
  - load-more preserves viewport anchor,
  - recent stabilization removed private-only mutation-triggered snap loops to align private with group behavior.

## 7) Upload & File Handling

- Upload size/type limits centralized in backend constants and exposed to frontend.
- Media retrieval endpoints enforce auth + ownership/membership checks.
- Path traversal protections use basename/realpath-root checks.

## 8) Testing & Operations

### 8.1 Tests
- Unit tests: `tests/unit/run.php`
- E2E smoke suites:
  - API guard
  - authenticated chat
  - profile settings
  - group chat
  - group authorization
  - block-user
- Full runner:
  - `bash tests/run_all_tests.sh`

### 8.2 Local test server lifecycle
- Runner can start a managed local PHP server if needed.
- `tests/stop_test_server.sh` supports PID-file and port-based orphan cleanup.

## 9) Known Technical Debt

- `assets/js/chat.js` remains a large file and should be further modularized.
- Polling architecture is intentionally simple but may need scaling strategy later.

## 10) Forward Design Priorities

- Continue UI/performance hardening and bug-sweep iterations after Phase K.
- Continue decomposing `assets/js/chat.js` into smaller modules without changing behavior.
- Expand smoke coverage for recently added UX/account surfaces.
