# TinTinChat Security Audit Report — 2026-03-07

Scope:
- `api/*.php`
- `includes/api_helpers.php`
- Session restoration and sensitive admin endpoint behavior

## Summary
A full endpoint-level hardening review was executed with targeted remediations applied for validation consistency, high-risk endpoint protection, and session token replay reduction.

## Findings and Remediations

### 1) Inconsistent server-side username validation
Risk:
- Username-dependent endpoints accepted unvalidated target usernames, relying mostly on UI-side checks.

Fixes:
- Added shared `apiNormalizeUsername()` helper in `includes/api_helpers.php`.
- Applied to:
  - `api/send_message.php`
  - `api/send_image_message.php`
  - `api/send_file_message.php`
  - `api/send_voice_message.php`
  - `api/fetch_messages.php`
  - `api/fetch_recent_messages.php`
  - `api/get_public_key.php`

### 2) Destructive admin endpoint callable via GET query parameter
Risk:
- `api/notrace.php` allowed dangerous operation over GET and URL query string.
- Increased accidental trigger/logging risk and weaker CSRF posture.

Fixes:
- Switched to `POST` only.
- Enforced CSRF validation.
- Moved required secret input (`word`) to JSON body.
- Replaced exception leak in response with generic safe error message.

### 3) Session restore token replay window
Risk:
- `api/get_user_by_ident.php` accepted valid token and restored session without rotating token.

Fixes:
- Rotates `ident` on successful restore.
- Updates DB `ident` + `last_login` atomically for restored user session.

### 4) Pagination input hardening
Risk:
- Unbounded/negative pagination values can increase load or edge behavior.

Fixes:
- `api/fetch_messages.php` now bounds:
  - `offset >= 0`
  - `limit` to `[1, 100]`
- `api/fetch_recent_messages.php` now enforces `offsetMsgId >= 0`.

## Verification
- `php -l` passed on all `api/*.php` files after changes.
- No diagnostics reported on modified files.

## Residual Risk Notes
- Private key storage/retrieval architecture remains a known trade-off and should be addressed in a future design migration.
- `api/notrace.php` is intentionally dangerous even after hardening; keep access tightly controlled and disabled in non-admin deployments where possible.
