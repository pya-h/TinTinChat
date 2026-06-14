# TinTinChat

TinTinChat is a lightweight, self-hostable web chat app built with native PHP and vanilla JavaScript, designed for practical deployment on constrained/shared hosting while providing modern chat capabilities.

## Goals

- Keep stack and deployment simple (PHP + MySQL + static assets).
- Provide secure day-to-day messaging for direct and group conversations.
- Maintain consistent API contracts and predictable frontend behavior.
- Improve UX incrementally without introducing heavy framework dependencies.

## What's Implemented

### Core chat
- Direct (1:1) and group chat.
- Message pagination with load-more and go-to-latest controls.
- Poll-based near-real-time updates (typing status inlined into fetch_recent).
- Typing indicators for private and group contexts.
- Unread message counters for group chats.
- Saved Messages (self-chat with bookmark icon, "Save" context menu action).

### Security and encryption
- Session auth + CSRF protection on all mutating APIs.
- Text encryption:
  - Private chat: RSA-OAEP client-side encryption flow.
  - Group chat: shared group-key AES-GCM encrypted text flow.
- Media/file encrypted envelope model (`med1`) for image/voice/file/video paths.
- Endpoint-level authorization guards (method → auth → CSRF → validate → logic → response).
- Multi-session tracking with device/OS detection and session revocation.
- Username blacklist (~30 reserved names, case-insensitive with separator stripping).

### Message actions
- Reply (with quoted preview).
- Copy (with clipboard fallback).
- Forward (text + actual media re-encryption for all message types).
- Message details modal.
- Reactions (emoji set).
- Edit (text only, with time limit and edited marker).
- Delete (global for allowed participants).
- Delete full direct-chat history from user profile modal.
- Select mode (multi-select with bulk forward/delete).
- Swipe gestures (right to reply, left to edit/forward) on mobile.

### Media and attachments
- Image messages with modal preview.
- Voice messages with recording/upload/playback.
- File/video messages.
- Music file detection with inline audio player (play/pause, seekable progress, format badge).
- Sticker upload/catalog/send/render pipeline (Telegram-like, 512x512 WEBP/PNG).
- Media forwarding re-encrypts and sends actual media (not text labels).
- Browser-side IndexedDB caching for downloaded files.

### Music and playback
- Playlist (localStorage-based, add/remove tracks, auto-advance).
- Global Now Playing bar (persistent across chat switches, seekable progress).
- Saved Messages details panel with playlist management.

### Users, profile, and moderation
- Avatar upload/retrieval with safe fallback rendering.
- User Info modal with avatar enlargement and send-message shortcut.
- Block/unblock user flow with send enforcement.
- Blocked users management in settings.
- Settings modal with tabbed sections (General / Account / Sessions / Ideas / Admin).
- Account settings: username, password, avatar updates.
- Font-size preference (sm / md / lg / xl).
- Active sessions list with device/OS/browser detection and revocation.
- Admin panel: user management (admin/ban), sticker management, announcements, media cleanup.

### Ideas / Feedback
- In-app idea submission and browsing.
- Voting (upvote/downvote) with anonymous authorship for non-superusers.
- Superuser-only reply and superuser/owner delete permissions.

### Engagement and discovery
- Browser Notification API for new messages when tab is hidden/unfocused.
- Changelog / What's New modal with DB-backed dismiss tracking.
- Global Announcements system (superuser create/delete, alert button with unread indicator).
- Multiline message input with auto-grow.
- Send by Enter setting (Enter or Shift+Enter modes).

### PWA support
- Web app manifest with icons and display mode.
- Service worker with cache-first app shell and network-first API data.
- Installability UX (install prompt + fallback guidance).
- Offline/poor-network states with retry UX.

### Quality and reliability
- Unit + E2E smoke test suite with one-command runner.
- Test env setup + test server lifecycle helper scripts.
- Security regression checklist maintained across changes.

## Tech Stack

- Backend: PHP, PDO, MySQL
- Frontend: HTML, CSS, Vanilla JavaScript
- Crypto: Web Crypto API + server-assisted key workflows
- Storage:
  - MySQL for metadata/messages
  - Local filesystem under `uploads/*` for encrypted media/assets

## Repository Structure

The project is split into two top-level deployment folders so that only public
assets are exposed by the web server (see **Deployment / Hosting** below):

- `public/` — the web document root (everything browser-reachable):
  - `index.php`, `dashboard.php` — entry pages
  - `manifest.webmanifest`, `service-worker.js`, `offline.html` — PWA shell
  - `api/` — organized endpoints by domain:
    - `auth/`, `chats/`, `groups/`, `ideas/`, `keys/`, `messages/`, `opinions/`, `playlist/`, `system/`, `typing/`, `users/`, `admin/`
  - `assets/js/` — frontend logic (`chat.js`, `api-service.js`, `pwa.js`, `crypto.js`, …)
  - `assets/css/` — UI styling (`dashboard.css`, `style.css`, `modal.css`)
  - `.htaccess` — disables directory browsing, blocks dotfiles
- `tintin-core/` — backend + secrets, kept OUTSIDE the web root:
  - `includes/` — shared backend helpers (db, auth, session, api_helpers, group_helpers, crypto, constants, block, admin, modal)
  - `migrations/` — SQL migration history (00–32 + final schema)
  - `tests/` — unit + E2E smoke + orchestration scripts
  - `uploads/` — runtime storage for avatars/media/files/stickers (created by code)
  - `.env`, `.env.test`, `.prod.env` — environment/secret files
  - `.htaccess` — deny-all (defense-in-depth if ever served)
- `docs/` — product, API, encryption, technical design, security, PWA docs (repo root, not deployed)

Public PHP files reach the backend via relative requires such as
`__DIR__ . '/../../../tintin-core/includes/db.php'`. The two folders are
deployed as siblings (see below), so this `../tintin-core` relationship is
preserved on the server.

## Deployment / Hosting

On cPanel (or any Apache shared host):

1. Upload the **contents of `public/`** into your domain's `public_html`
   (the web document root).
2. Upload the **`tintin-core/`** folder to your home directory, as a sibling of
   `public_html` (e.g. `~/tintin-core`), so it is NOT served by the web server.
3. The relative path from a public PHP file to `tintin-core` must remain
   `../../../tintin-core` (3 levels up from `public_html/api/<domain>/`), which
   matches the default `public_html` + sibling `tintin-core` layout.

This keeps all backend code, secrets (`.env`), database migrations, and — most
importantly — the `uploads/` directory completely outside the browsable web
root, so users can no longer list or download other users' media by guessing
folder URLs. Encrypted media is still served file-by-file through the
authenticated `api/messages/media/*` and `api/users/get_avatar.php` endpoints.

## Quick Start

1. Configure database credentials via `tintin-core/.env` (copied from `tintin-core/.env.example`).
2. Apply migrations in order from `tintin-core/migrations/`.
3. Ensure writable upload directories (created automatically on first use, under `tintin-core/`):
   - `tintin-core/uploads/avatars`
   - `tintin-core/uploads/images`
   - `tintin-core/uploads/voice_messages`
   - `tintin-core/uploads/files`
   - `tintin-core/uploads/stickers`
4. Start local server from the `public/` document root (example):
   - `php -d upload_max_filesize=110M -d post_max_size=120M -S localhost:8080 -t public`
5. Open `index.php` (served at the docroot, i.e. `public/index.php`).

## Upload Limits

| Type | Max Size |
|------|----------|
| Avatar | 5 MB |
| Image | 20 MB |
| Voice | 10 MB |
| File / Video | 100 MB |
| Sticker output | 512 KB |

## Testing

All test scripts now live under `tintin-core/tests/`. The runner auto-starts a
PHP server with `public/` as its document root.

### Full suite
```bash
bash tintin-core/tests/run_all_tests.sh
```

### Individual scripts
- Environment/setup check: `bash tintin-core/tests/setup_test_env.sh http://localhost:8080`
- Unit tests: `php tintin-core/tests/unit/run.php`
- E2E smoke tests:
  - `bash tintin-core/tests/e2e/api_guard_smoke.sh http://localhost:8080`
  - `bash tintin-core/tests/e2e/authenticated_chat_smoke.sh http://localhost:8080`
  - `bash tintin-core/tests/e2e/profile_settings_smoke.sh http://localhost:8080`
  - `bash tintin-core/tests/e2e/profile_settings_edge_smoke.sh http://localhost:8080`
  - `bash tintin-core/tests/e2e/group_chat_smoke.sh http://localhost:8080`
  - `bash tintin-core/tests/e2e/group_authorization_smoke.sh http://localhost:8080`
  - `bash tintin-core/tests/e2e/block_user_smoke.sh http://localhost:8080`

### Test server lifecycle
- Stop managed/orphan test server: `bash tintin-core/tests/stop_test_server.sh`
- Optional overrides: `bash tintin-core/tests/stop_test_server.sh --pid-file /tmp/tintin_test_server.pid --port 8080`

## Documentation Index

| Document | Description |
|----------|-------------|
| `docs/TASKS.md` | Product roadmap and phase tracking |
| `docs/API_CONTRACT.md` | API response contract, endpoint list, error codes |
| `docs/ENCRYPTION.md` | Encryption reference (current architecture + Phase N upgrade design) |
| `docs/TECHNICAL_DESIGN.md` | Technical architecture and design |
| `docs/PRD.md` | Product requirements document |
| `docs/SECURITY.md` | Security audit findings, regression checklist, execution log |
| `docs/PWA_RUNBOOK.md` | PWA runtime policies, compatibility, release operations |
| `docs/PWA_CACHE_TASKS.md` | PWA persistent cache implementation plan |
| `CONTEXT.md` | Session handoff context |

## Current Status

- All phases A through M.4 completed and stable.
- Phase N (E2E Encryption Upgrade) planned — private key protection via password-derived KEK.
- Organized endpoint architecture enforced (no legacy flat `api/*.php` wrappers).
- Full automated suite passes (`bash tintin-core/tests/run_all_tests.sh`).
