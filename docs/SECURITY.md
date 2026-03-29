# TinTinChat — Security Document

Last updated: 2026-03-29

This document consolidates the security audit findings, regression checklist, and remediation status into a single reference.

---

## Part 1 — Security Audit

**Scope:** Full codebase (PHP backend, JS frontend, crypto layer, session management)

> **Note:** Issues resolved by the E2E Encryption Upgrade (Phase N — see `ENCRYPTION.md` §Part 2) are excluded. Those include: plaintext private key storage, server-side RSA key generation, server access to private keys, and `groupTryGetAnyDecryptableSharedKey()` reading private keys from DB.

### MITM Analysis

| Scenario | Can attacker read messages? | Why |
|---|---|---|
| **Network-level MITM (HTTPS intact)** | No | TLS encrypts all traffic. Attacker sees only ciphertext. |
| **TLS compromised (forged cert / CA compromise)** | Yes | Attacker intercepts the plaintext private key returned by `api/keys/get_private.php` during session init. With the private key, all private chat messages (RSA-OAEP) and group keys (AES-GCM) are decryptable. |
| **Full server / database compromise** | Yes | Private keys are stored in plaintext in `users.private_key`. Direct DB read = all keys = all messages. |

**After the Phase N encryption upgrade**, scenarios 2 and 3 improve significantly — the private key is encrypted with a password-derived KEK and never leaves the client in plaintext.

---

### Findings

#### HIGH

##### H1 — No Login Rate Limiting / Brute Force Protection

- **File:** `api/auth/login.php`
- **Status:** OPEN
- **Description:** The login endpoint accepts unlimited authentication attempts. No per-IP throttling, account lockout, progressive delay, or CAPTCHA trigger.
- **Remediation:** Implement a failed-attempt counter per username/IP. After N failures (e.g. 5), enforce progressive delay or temporary lockout. Consider CAPTCHA after 3 failures.

##### H2 — Ban Enforcement Gaps on API Endpoints

- **File:** `includes/api_helpers.php:48`
- **Status:** PARTIALLY FIXED (2026-03-29)
- **Description:** `apiRequireBanCheck()` exists but is only called in `api/users/list_sessions.php` and `api/users/revoke_session.php`. Most other endpoints do not enforce ban checks. A banned user with an active session retains API access to messaging, media, groups, etc.
- **Remediation:** Integrate ban check into `apiRequireAuth()` or add `apiRequireBanCheck($pdo, $userId)` to all protected endpoints.

##### H3 — Emergency Data Destruction Function

- **File:** `includes/admin.php:15-40`
- **Status:** OPEN
- **Description:** `fuckEverything()` deletes all messages, users, and uploaded files in one call. Requires admin session + `EMERGENCY_WORD` from `.env`, but no rate limiting on word guesses, no 2FA, no time delay, no audit log.
- **Remediation:** Add rate limiting on attempts (lock after 3 failures). Add 30-second confirmation delay. Log action with full detail before execution. Consider re-authentication.

---

#### MEDIUM

##### M1 — No HTTPS Enforcement / Missing HSTS Header

- **File:** `includes/session.php:5-12`
- **Status:** OPEN
- **Description:** `secure` cookie flag is conditional on HTTPS, but no `Strict-Transport-Security` header and no HTTP→HTTPS redirect. Cookies sent insecure over HTTP.
- **Remediation:** Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` when HTTPS detected. Add HTTP→HTTPS redirect.

##### M2 — No Content-Security-Policy Header

- **File:** `includes/session.php:16-19`
- **Status:** OPEN
- **Description:** Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`) are set, but no CSP. Inline `<script>` blocks exist, which would need nonces. Without CSP, injected scripts face no browser restriction.
- **Remediation:** Add CSP header, start with report-only. Use nonces for inline scripts to remove `'unsafe-inline'`.

##### M3 — Ident Token Passed as GET Parameter

- **File:** `includes/session.php:29`, `api/users/get_by_ident.php`
- **Status:** OPEN
- **Description:** Persistent login `ident` token passed as URL query parameter. Can leak through server logs, proxy logs, browser history, and `Referer` headers. Token has 256-bit entropy and 48-hour expiry, but log exposure creates session hijacking window.
- **Remediation:** Switch ident restoration to POST or a dedicated `httpOnly` cookie.

##### M4 — No Server-Side Session Absolute Timeout

- **File:** `includes/session.php:6`
- **Status:** OPEN
- **Description:** Session cookie lifetime is `0` (browser session), no server-side absolute timeout. Ident token refreshes on each restoration, so sessions can live indefinitely. Compromised sessions never expire on their own.
- **Remediation:** Track session creation time and enforce absolute timeout (e.g. 7 days). Require re-auth after expiry.

##### M5 — User Search Has No Rate Limiting

- **File:** `api/users/search.php`
- **Status:** OPEN
- **Description:** Minimum query length enforced but no rate limiting. Username enumeration possible via rapid sequential searches.
- **Remediation:** Add per-user rate limiting (e.g. 10 searches/minute). Consider exact prefix match only for short queries.

---

#### LOW

##### L1 — `editedSince` Parameter Lacks Format Validation

- **File:** `api/messages/fetch_recent.php:32`
- **Status:** OPEN
- **Description:** `editedSince` is trimmed but never validated as datetime. Invalid format causes MySQL to compare against `'0000-00-00 00:00:00'`, returning unexpected results. No SQL injection risk (parameterized).
- **Remediation:** Validate `Y-m-d H:i:s` format before use.

##### L2 — Log File May Contain Sensitive Data

- **File:** `includes/admin.php:5-11`
- **Status:** OPEN
- **Description:** `logText()` writes to `log.fux` with `json_encode()`. Exception objects may contain stack traces with file paths and query strings. No log rotation or size limit.
- **Remediation:** Sanitize logged data. Add log rotation. Ensure log file is outside web root or protected.

##### L3 — Logout Redirect Uses Inline JavaScript

- **File:** `includes/auth.php:24-29`
- **Status:** OPEN
- **Description:** `logout()` outputs inline `<script>` to clear localStorage and redirect. Target derived from `SCRIPT_NAME` (not user input). Less robust than server-side redirect.
- **Remediation:** Use server-side `Location` header redirect. Handle localStorage cleanup on login page.

##### L4 — Sticker Upload Memory Consumption

- **File:** `api/messages/stickers/upload.php`
- **Status:** OPEN
- **Description:** Source images up to 20MB accepted and processed with GD. Large images consume significant memory. No concurrency limit.
- **Remediation:** Reduce max source size (e.g. 5MB). Add concurrency limit or processing queue.

---

### Summary

| Severity | Count | IDs | Fixed |
|----------|-------|-----|-------|
| **High** | 3 | H1, H2, H3 | H2 partial |
| **Medium** | 5 | M1, M2, M3, M4, M5 | — |
| **Low** | 4 | L1, L2, L3, L4 | — |

### Recommended Priority

1. **H2 (ban enforcement)** — integrate into `apiRequireAuth()` for automatic coverage
2. **H1 (login rate limiting)** — critical for production exposure
3. **M1 (HSTS)** — single header addition
4. **H3 (emergency function safeguards)** — add rate limiting + confirmation delay
5. **M2 (CSP)** — requires nonce implementation; start report-only
6. **M3–M5** — schedule for next hardening pass

---

## Part 2 — Security Regression Checklist

Use after every major backend/API change to prevent regressions.

### A) Endpoint Contract Checks
- [ ] Every JSON API endpoint enforces explicit HTTP method checks.
- [ ] Every protected endpoint enforces authenticated session checks.
- [ ] Every mutating endpoint enforces CSRF (`X-CSRF-Token` or equivalent).
- [ ] JSON APIs return standardized success/error payloads via shared helpers.
- [ ] No endpoint leaks stack traces or raw SQL/internal errors.

### B) Authorization / Data Isolation
- [ ] Message fetch endpoints only return messages where requester is sender/receiver.
- [ ] Seen/delete operations only affect requester-owned or requester-received messages.
- [ ] File/image/voice retrieval verifies ownership before serving content.
- [ ] Public/private key endpoints do not expose key data to unauthenticated callers.
- [ ] Session restoration (`ident`) validates token age and identity safely.
- [ ] Session list/revoke endpoints enforce ownership (user can only see/revoke own sessions).

### C) Input Validation
- [ ] Username parameters are validated with expected regex rules.
- [ ] Numeric IDs are parsed and validated as integers.
- [ ] JSON body parsing rejects malformed payloads safely.
- [ ] Missing required fields return explicit 4xx errors.

### D) Upload Safety
- [ ] Server-side MIME detection is used (not only extension checks).
- [ ] Upload size limits are enforced server-side.
- [ ] Uploaded files are stored only in allowed directories.
- [ ] Path traversal protections (`realpath` / base-dir checks) are present on retrieval.

### E) Session Management
- [ ] Login creates a `user_sessions` record with token, IP, and user-agent.
- [ ] Logout deletes the session record for the current token.
- [ ] Session revocation enforces 12-hour minimum age and ownership.
- [ ] Ident token swap updates the `user_sessions` record atomically.

### F) Manual Runtime Smoke Tests
- [ ] Login/register/logout works and session regeneration remains intact.
- [ ] Send/fetch/reply/forward/delete/seen flows work with no contract regressions.
- [ ] Image/file/voice upload + download/playback work for authorized users.
- [ ] Unauthorized access attempts return 401/403 as expected.
- [ ] Invalid method attempts return 405 as expected.

---

## Part 3 — Execution Log

### Run: 2026-03-07 (Phase A normalization pass)
- Standardized method checks across JSON APIs and media/file retrieval endpoints.
- Standardized auth checks using shared helpers for JSON endpoints.
- Standardized JSON response shape for legacy GET endpoints via shared helpers.
- Added auth requirement for public key endpoint to reduce unauthenticated user/key enumeration.

### Run: 2026-03-07 (Deep hardening pass)
- Added shared server-side username normalization helper.
- Hardened destructive admin endpoint to require POST + CSRF + JSON body.
- Rotated `ident` token on session restore to reduce replay window.
- Added pagination bounds hardening for fetch endpoints.

### Run: 2026-03-10 (Route organization + runtime audit)
- Removed legacy root `api/*.php` wrappers; runtime uses organized paths only.
- Verified runtime scope has no legacy flat-route references.

### Run: 2026-03-10 (Auth hardening + cleanup)
- Hardened logout from GET-triggered to POST + CSRF validated flow.
- Fixed login failure redirect inconsistency.
- Removed unused runtime dependencies and dead helper code.
- Applied low-risk query optimizations on message-fetch endpoints.

### Run: 2026-03-29 (Sessions feature + review)
- Added `user_sessions` table with multi-session tracking (migration 25).
- Login creates session records; logout and ident swap maintain records.
- Added `list_sessions.php` (GET) and `revoke_session.php` (POST + CSRF) endpoints.
- Both session endpoints enforce ban check via `apiRequireBanCheck()`.
- Revocation requires 12-hour session age and prevents revoking current session.
- Reviewed all 67+ API endpoints: SQL injection (safe — all parameterized), CSRF (consistent on POST), auth checks (present on all protected endpoints).
- File upload validation confirmed: MIME detection via `finfo_file()`, size limits, path traversal protection via `realpath()`.
- Session cookie settings confirmed: `HttpOnly`, `SameSite: Strict`, `Secure` when HTTPS.
