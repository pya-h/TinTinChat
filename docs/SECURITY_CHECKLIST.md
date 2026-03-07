# TinTinChat Security Regression Checklist

Last run: 2026-03-07 (deep pass)
Owner: Engineering

## Purpose
Use this checklist after every major backend/API change to prevent regressions in auth, authorization, request validation, and response consistency.

## A) Endpoint Contract Checks
- [ ] Every JSON API endpoint enforces explicit HTTP method checks.
- [ ] Every protected endpoint enforces authenticated session checks.
- [ ] Every mutating endpoint enforces CSRF (`X-CSRF-Token` or equivalent).
- [ ] JSON APIs return standardized success/error payloads via shared helpers.
- [ ] No endpoint leaks stack traces or raw SQL/internal errors.

## B) Authorization / Data Isolation
- [ ] Message fetch endpoints only return messages where requester is sender/receiver.
- [ ] Seen/delete operations only affect requester-owned or requester-received messages.
- [ ] File/image/voice retrieval verifies ownership before serving content.
- [ ] Public/private key endpoints do not expose key data to unauthenticated callers.
- [ ] Session restoration (`ident`) validates token age and identity safely.

## C) Input Validation
- [ ] Username parameters are validated with expected regex rules.
- [ ] Numeric IDs are parsed and validated as integers.
- [ ] JSON body parsing rejects malformed payloads safely.
- [ ] Missing required fields return explicit 4xx errors.

## D) Upload Safety
- [ ] Server-side MIME detection is used (not only extension checks).
- [ ] Upload size limits are enforced server-side.
- [ ] Uploaded files are stored only in allowed directories.
- [ ] Path traversal protections (`realpath` / base-dir checks) are present on retrieval.

## E) Manual Runtime Smoke Tests
- [ ] Login/register/logout works and session regeneration remains intact.
- [ ] Send/fetch/reply/forward/delete/seen flows work with no contract regressions.
- [ ] Image/file/voice upload + download/playback work for authorized users.
- [ ] Unauthorized access attempts return 401/403 as expected.
- [ ] Invalid method attempts return 405 as expected.

---

## Execution Log

### Run: 2026-03-07 (Phase A normalization pass)
- Standardized method checks across JSON APIs and media/file retrieval endpoints.
- Standardized auth checks using shared helpers for JSON endpoints.
- Standardized JSON response shape for legacy GET endpoints via shared helpers.
- Added auth requirement for public key endpoint to reduce unauthenticated user/key enumeration.
- Performed syntax validation (`php -l`) on all modified API files.

### Run: 2026-03-07 (Deep hardening pass)
- Added shared server-side username normalization helper and applied it across send/fetch/key endpoints.
- Hardened destructive admin endpoint (`notrace`) to require POST + CSRF + JSON body and return non-leaky error text.
- Rotated `ident` token on session restore in `get_user_by_ident` to reduce replay window.
- Added pagination bounds hardening for fetch endpoints (`limit` cap and non-negative offsets).
- Re-ran full API syntax validation after changes.

Outstanding follow-up:
- Full source review (`P0`) remains open.
- Full security audit depth review remains open for additional defense-in-depth checks.
