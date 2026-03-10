# TinTinChat

A lightweight, self-hostable web chat application built with native PHP and vanilla JavaScript, focused on secure messaging and practical deployment on constrained/shared hosting.

## Current Highlights

- Direct chat + group chat support.
- Encrypted text messaging (direct + group) with media/file encryption envelope model.
- Message actions: reply, copy, forward, details, reactions, delete variants.
- Media support: image, voice, file, video.
- User avatars with secure upload/retrieval + fallback avatar rendering.
- User Info modal + avatar enlargement + send-message shortcut.
- Delete full direct-chat history from user profile modal.
- Sticker support with upload, picker, and send flow.
- Responsive UX with desktop/mobile parity and accessibility-focused interactions.

## Tech Stack

- Backend: PHP (PDO), MySQL
- Frontend: HTML, CSS, vanilla JavaScript
- Crypto: Web Crypto API + server-assisted key workflows
- Storage: MySQL + local uploads directories

## Project Structure

- [api](api): endpoint layer
- [includes](includes): shared backend helpers (auth/session/api/db/group/crypto/constants)
- [assets/js](assets/js): frontend app logic (`chat.js`, `api-service.js`, helpers)
- [assets/css](assets/css): UI styles (`dashboard.css`, `modal.css`, auth/style)
- [migrations](migrations): SQL migration history
- [docs](docs): product/design/security/API docs
- [uploads](uploads): user-uploaded encrypted assets and avatars

## Quick Start

1. Configure database credentials (current project setup uses `includes/db.php`; adjust to your environment).
2. Apply SQL migrations from [migrations](migrations) in order.
3. Ensure web server/PHP can write to:
   - `uploads/avatars`
   - `uploads/images`
   - `uploads/voice_messages`
   - `uploads/files`
4. Run with PHP built-in server for local dev (example):
   - `php -d upload_max_filesize=110M -d post_max_size=120M -S localhost:8080`
5. Open `index.php` and authenticate.

## Upload Limits (Synced)

- Avatar: 5MB
- Image: 20MB
- Voice: 10MB
- File/Video: 100MB

## Tests (Phase H Bootstrap)

- Run lightweight unit tests:
   - `php tests/unit/run.php`
- Run API guard smoke checks (requires local server running):
   - `./tests/e2e/api_guard_smoke.sh http://localhost:8080`

## Security Notes

- API guard pattern uses method + auth + CSRF checks for mutating routes.
- Response contract is standardized (`status`, `error_details.code`).
- Media retrieval endpoints enforce authorization and path safety checks.
- See [docs/API_CONTRACT.md](docs/API_CONTRACT.md) and [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md).

## Key Docs

- Product roadmap: [docs/TASKS.md](docs/TASKS.md)
- Session bootstrap context: [CONTEXT.md](CONTEXT.md)
- Technical design: [docs/TECHNICAL_DESIGN.md](docs/TECHNICAL_DESIGN.md)
- Encryption reference: [docs/ENCRYPTION.md](docs/ENCRYPTION.md)
- API contract: [docs/API_CONTRACT.md](docs/API_CONTRACT.md)

## Development Progress Attribution

Based on your requested declaration for this repository:

- Developer (pya-h): **40%**
- AI-assisted implementation: **60%**

This is a project-level attribution statement, not a legal ownership transfer.

## Status Snapshot

- Completed through Phase G (sticker support) in [docs/TASKS.md](docs/TASKS.md).
- Upcoming major phase: Phase H (tests), then power UX/PWA.

## Changelog (Recent)

- **2026-03-10 — Phase F.6 completed**
   - Added User Info modal and enlarged avatar viewer.
   - Added direct/group profile entry points from chat header, group sender avatar/name, and group member avatar.
   - Added Send Message shortcut from profile modal.
   - Added Delete Chat action with backend endpoint and immediate UI refresh.
- **2026-03-09 — Phase F.5 completed**
   - Added avatar schema migration and secure avatar upload/retrieval endpoints.
   - Integrated avatars across chat list, group member list, and group sender contexts.
- **2026-03-09 — Phase F polish**
   - Improved in-conversation search across older messages.
   - Added video send flow parity and reaction UX refinements.
- **2026-03-10 — Phase G completed**
   - Added sticker schema migration with `stickers` catalog and `messages.sticker_id` reference.
   - Added sticker upload/fetch/send/get endpoints with validation, resize-to-canvas, and duplicate hash protection.
   - Added left-side composer sticker button, animated sticker picker grid, upload action, and sticker message rendering.
- **2026-03-10 — Phase H bootstrap started**
   - Added lightweight unit test runner and helper-function tests.
   - Added API guard smoke test script for unauthenticated endpoint checks.
