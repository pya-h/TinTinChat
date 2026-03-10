# TinTinChat

TinTinChat is a lightweight, self-hostable web chat app built with native PHP and vanilla JavaScript, designed for practical deployment on constrained/shared hosting while still providing modern chat capabilities.

## Goals

- Keep stack and deployment simple (PHP + MySQL + static assets).
- Provide secure day-to-day messaging for direct and group conversations.
- Maintain consistent API contracts and predictable frontend behavior.
- Improve UX incrementally without introducing heavy framework dependencies.

## What’s Implemented

### Core chat
- Direct (1:1) and group chat.
- Message pagination with load-more and go-to-latest controls.
- Poll-based near-real-time updates.
- Typing indicators for private and group contexts.

### Security and encryption
- Session auth + CSRF protection on mutating APIs.
- Text encryption:
  - private chat: RSA-based client encryption flow
  - group chat: shared group-key encrypted text flow
- Media/file encrypted envelope model for image/voice/file/video paths.
- Endpoint-level authorization guards for protected resources.

### Message actions
- Reply
- Copy
- Forward
- Message details
- Reactions
- Delete (including delete-for-everyone rules where applicable)
- Delete full direct-chat history from user profile modal

### Media and attachments
- Image messages
- Voice messages
- File/video messages
- Sticker upload/catalog/send/render pipeline
- Browser-side cached file handling support

### Users, profile, and moderation
- Avatar upload/retrieval with safe fallback rendering
- User Info modal + avatar enlargement + send-message shortcut
- Block/unblock user flow with send enforcement

## Tech Stack

- Backend: PHP, PDO, MySQL
- Frontend: HTML, CSS, Vanilla JavaScript
- Crypto: Web Crypto + server-assisted key workflows
- Storage:
  - MySQL for metadata/messages
  - local filesystem under `uploads/*` for encrypted media/assets

## Repository Structure

- `api/` organized endpoints:
  - `auth/`, `chats/`, `groups/`, `keys/`, `messages/`, `system/`, `typing/`, `users/`
- `includes/` shared backend helpers (db/auth/session/api/group/crypto/constants)
- `assets/js/` frontend logic (`chat.js`, `api-service.js`, helpers)
- `assets/css/` UI styling
- `migrations/` SQL migration history
- `docs/` product, API, encryption, technical design, security docs
- `tests/` unit + E2E smoke + orchestration scripts
- `uploads/` runtime storage for avatars/media/files/stickers

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

## Upload Limits (synced)

- Avatar: 5MB
- Image: 20MB
- Voice: 10MB
- File/Video: 100MB
- Sticker output: 512KB

## Testing

### Full suite
- `bash tests/run_all_tests.sh`

### Individual scripts
- Environment/setup check:
  - `bash tests/setup_test_env.sh http://localhost:8080`
- Unit tests:
  - `php tests/unit/run.php`
- E2E smoke tests:
  - `bash tests/e2e/api_guard_smoke.sh http://localhost:8080`
  - `bash tests/e2e/authenticated_chat_smoke.sh http://localhost:8080`
  - `bash tests/e2e/group_chat_smoke.sh http://localhost:8080`
  - `bash tests/e2e/group_authorization_smoke.sh http://localhost:8080`
  - `bash tests/e2e/block_user_smoke.sh http://localhost:8080`

### Test server lifecycle
- Stop managed/orphan local php test server on default port:
  - `bash tests/stop_test_server.sh`
- Optional overrides:
  - `bash tests/stop_test_server.sh --pid-file /tmp/tintin_test_server.pid --port 8080`

## Documentation Index

- Session handoff context: `CONTEXT.md`
- Product roadmap and phase tracking: `docs/TASKS.md`
- API response contract and error codes: `docs/API_CONTRACT.md`
- Encryption model/reference: `docs/ENCRYPTION.md`
- Technical architecture/design: `docs/TECHNICAL_DESIGN.md`
- Product requirements: `docs/PRD.md`
- Security regression checklist: `docs/SECURITY_CHECKLIST.md`
- PWA runtime/checklists/runbook: `docs/PWA_RUNBOOK.md`

## Current Status

- Project is in post-Phase J baseline stabilization.
- Organized endpoint architecture is enforced (no legacy flat `api/*.php` wrappers).
- Full automated suite currently passes (`bash tests/run_all_tests.sh`).
