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

- `api/` — organized endpoints by domain:
  - `auth/`, `chats/`, `groups/`, `ideas/`, `keys/`, `messages/`, `system/`, `typing/`, `users/`, `admin/`
- `includes/` — shared backend helpers (db, auth, session, api_helpers, group_helpers, crypto, constants, block, admin, modal)
- `assets/js/` — frontend logic (`chat.js`, `api-service.js`, `pwa.js`, `ui-enhancements.js`, `crypto.js`)
- `assets/css/` — UI styling (`dashboard.css`, `style.css`, `modal.css`)
- `migrations/` — SQL migration history (00–25 + final schema)
- `docs/` — product, API, encryption, technical design, security, PWA docs
- `tests/` — unit + E2E smoke + orchestration scripts
- `uploads/` — runtime storage for avatars/media/files/stickers

## Quick Start

1. Configure database credentials in `includes/db.php` for your environment.
2. Apply migrations in order from `migrations/`.
3. Ensure writable upload directories:
   - `uploads/avatars`
   - `uploads/images`
   - `uploads/voice_messages`
   - `uploads/files`
   - `uploads/stickers`
4. Start local server (example):
   - `php -d upload_max_filesize=110M -d post_max_size=120M -S localhost:8080`
5. Open `index.php`.

## Upload Limits

| Type | Max Size |
|------|----------|
| Avatar | 5 MB |
| Image | 20 MB |
| Voice | 10 MB |
| File / Video | 100 MB |
| Sticker output | 512 KB |

## Testing

### Full suite
```bash
bash tests/run_all_tests.sh
```

### Individual scripts
- Environment/setup check: `bash tests/setup_test_env.sh http://localhost:8080`
- Unit tests: `php tests/unit/run.php`
- E2E smoke tests:
  - `bash tests/e2e/api_guard_smoke.sh http://localhost:8080`
  - `bash tests/e2e/authenticated_chat_smoke.sh http://localhost:8080`
  - `bash tests/e2e/profile_settings_smoke.sh http://localhost:8080`
  - `bash tests/e2e/profile_settings_edge_smoke.sh http://localhost:8080`
  - `bash tests/e2e/group_chat_smoke.sh http://localhost:8080`
  - `bash tests/e2e/group_authorization_smoke.sh http://localhost:8080`
  - `bash tests/e2e/block_user_smoke.sh http://localhost:8080`

### Test server lifecycle
- Stop managed/orphan test server: `bash tests/stop_test_server.sh`
- Optional overrides: `bash tests/stop_test_server.sh --pid-file /tmp/tintin_test_server.pid --port 8080`

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
- Full automated suite passes (`bash tests/run_all_tests.sh`).
