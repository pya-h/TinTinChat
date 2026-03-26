# TinTinChat — Security Audit Report

Date: 2026-03-27
Scope: Full codebase (PHP backend, JS frontend, crypto layer, session management)

> **Note:** Issues that will be resolved by the E2E Encryption Upgrade (Phase N — see `docs/E2E_ENCRYPTION_UPGRADE.md`) are excluded from this report. Those include: plaintext private key storage, server-side RSA key generation, server access to private keys, and `groupTryGetAnyDecryptableSharedKey()` reading private keys from DB.

---

## MITM Analysis

Three attack scenarios were evaluated for a man-in-the-middle attacker:

| Scenario | Can attacker read messages? | Why |
|---|---|---|
| **Network-level MITM (HTTPS intact)** | No | TLS encrypts all traffic. Attacker sees only ciphertext. |
| **TLS compromised (forged cert / CA compromise)** | Yes | Attacker intercepts the plaintext private key returned by `api/keys/get_private.php` during session init. With the private key, all private chat messages (RSA-OAEP) and group keys (AES-GCM) are decryptable. |
| **Full server / database compromise** | Yes | Private keys are stored in plaintext in `users.private_key`. Direct DB read = all keys = all messages. |

**After the Phase N encryption upgrade**, scenarios 2 and 3 improve significantly — the private key is encrypted with a password-derived KEK and never leaves the client in plaintext.

---

## Findings

### HIGH

#### H1 — No Login Rate Limiting / Brute Force Protection

- **File:** [login.php](api/auth/login.php)
- **Description:** The login endpoint accepts unlimited authentication attempts. There is no per-IP throttling, account lockout, progressive delay, or CAPTCHA trigger after failed attempts. An attacker can brute-force passwords at network speed.
- **Remediation:** Implement a failed-attempt counter per username and/or per IP. After N failures (e.g. 5), enforce a progressive delay or temporary lockout. Consider adding CAPTCHA after 3 failed attempts.

#### H2 — Ban Enforcement Never Applied on API Endpoints

- **File:** [api_helpers.php:48](includes/api_helpers.php#L48)
- **Description:** The function `apiRequireBanCheck()` is defined in `api_helpers.php` but is **never called** from any API endpoint. A banned user whose session is still active retains full API access — they can send messages, fetch data, upload media, and perform all actions until their session naturally expires or they log out.
- **Remediation:** Add `apiRequireBanCheck($pdo, $user_id)` to the auth guard chain in all protected endpoints, or integrate it into `apiRequireAuth()` itself so it's automatic.

#### H3 — Emergency Data Destruction Function

- **File:** [admin.php:15-40](includes/admin.php#L15-L40)
- **Description:** The `fuckEverything()` function deletes all messages, all users, and all uploaded files in a single call. While it requires admin session + a correct `EMERGENCY_WORD` from `.env`, there are no additional safeguards: no rate limiting on attempts to guess the word, no 2FA confirmation, no time-delayed execution, and no granular audit log of what was destroyed.
- **Remediation:** Add rate limiting on emergency word attempts (lock after 3 failures). Add a confirmation step with a time delay (e.g. 30-second countdown). Log the action with full detail before execution. Consider requiring re-authentication.

---

### MEDIUM

#### M1 — No HTTPS Enforcement / Missing HSTS Header

- **File:** [session.php:5-12](includes/session.php#L5-L12)
- **Description:** The `secure` cookie flag is set conditionally based on whether HTTPS is detected, but there is no `Strict-Transport-Security` header and no application-level HTTP→HTTPS redirect. If a user visits via HTTP, cookies are sent insecure and all traffic (including auth credentials) is in plaintext.
- **Remediation:** Add `Strict-Transport-Security: max-age=31536000; includeSubDomains` header when HTTPS is detected. Add an HTTP→HTTPS redirect at the application or web server level.

#### M2 — No Content-Security-Policy Header

- **File:** [session.php:16-19](includes/session.php#L16-L19)
- **Description:** Security headers `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, and `Referrer-Policy` are set, but there is no `Content-Security-Policy` header. The app uses inline `<script>` blocks (e.g. in `session.php:24-36` and `auth.php:24-29`), which would need `'unsafe-inline'` or nonce-based CSP. Without any CSP, injected scripts face no browser-level restriction.
- **Remediation:** Add a CSP header. Start with a report-only policy to identify violations, then enforce. Use nonces for legitimate inline scripts to allow removing `'unsafe-inline'`.

#### M3 — Ident Token Passed as GET Parameter

- **File:** [session.php:29](includes/session.php#L29), [get_by_ident.php](api/users/get_by_ident.php)
- **Description:** The persistent login `ident` token is passed as a URL query parameter (`?ident=...`). GET parameters can leak through server access logs, proxy logs, browser history, and `Referer` headers. Although the token has 256-bit entropy (not brute-forceable) and a 48-hour expiry, log exposure creates a window for session hijacking.
- **Remediation:** Switch ident restoration to use a POST request or a dedicated `httpOnly` cookie instead of a GET parameter.

#### M4 — No Server-Side Session Absolute Timeout

- **File:** [session.php:6](includes/session.php#L6)
- **Description:** Session cookie lifetime is `0` (browser session), and there is no server-side absolute timeout. The ident token refreshes on each successful restoration (new token generated at [get_by_ident.php:35](api/users/get_by_ident.php#L35)), so a session can live indefinitely as long as the user keeps the app open or revisits within 48 hours. A compromised session never expires on its own.
- **Remediation:** Track session creation time in `$_SESSION` and enforce an absolute timeout (e.g. 7 days). After expiry, require full re-authentication regardless of ident token status.

#### M5 — User Search Has No Rate Limiting

- **File:** [search.php](api/users/search.php)
- **Description:** The user search endpoint requires a minimum query length (`TTC_SEARCH_USERS_MIN_QUERY_LENGTH`) but has no rate limiting. An attacker can enumerate all usernames by issuing rapid sequential searches (a, b, c, ... aa, ab, ...).
- **Remediation:** Add per-user rate limiting (e.g. 10 searches per minute). Consider returning results only for exact prefix matches at short query lengths.

---

### LOW

#### L1 — `editedSince` Parameter Lacks Format Validation

- **File:** [fetch_recent.php:32](api/messages/fetch_recent.php#L32)
- **Description:** The `editedSince` query parameter is trimmed but never validated as a proper datetime string before being passed to the SQL query. While it's used as a parameterized value (no SQL injection risk), an invalid format causes MySQL to silently compare against `'0000-00-00 00:00:00'`, potentially returning unexpected results.
- **Remediation:** Validate that `editedSince` matches `Y-m-d H:i:s` format before use. Reject with 400 if invalid.

#### L2 — Log File May Contain Sensitive Data

- **File:** [admin.php:5-11](includes/admin.php#L5-L11)
- **Description:** The `logText()` function writes to `log.fux` with `json_encode($text)`. Exception objects logged at line 37 may contain stack traces with file paths, query strings, or internal state. The log file has no rotation, size limit, or access restriction beyond filesystem permissions.
- **Remediation:** Sanitize logged data to exclude sensitive fields. Add log rotation. Ensure the log file is outside the web root or protected by server config.

#### L3 — Logout Redirect Uses Inline JavaScript

- **File:** [auth.php:24-29](includes/auth.php#L24-L29)
- **Description:** The `logout()` function outputs inline `<script>` to clear `localStorage` and redirect. While the redirect target is derived from `SCRIPT_NAME` (not user input) and is properly escaped, the inline script pattern is less robust than a server-side redirect and depends on JS execution.
- **Remediation:** Clear the ident on the server side (already done). Use a server-side `Location` header redirect. Handle `localStorage` cleanup on the login page instead.

#### L4 — Sticker Upload Memory Consumption

- **File:** `api/messages/stickers/upload.php`
- **Description:** Sticker source images up to 20MB are accepted and processed with GD (resize, format conversion). Large images can consume significant memory during processing. No concurrency limit exists on simultaneous uploads.
- **Remediation:** Reduce maximum source image size (e.g. 5MB). Add a processing queue or concurrency limit for image operations. Set a PHP memory limit specifically for this endpoint.

---

## Summary

| Severity | Count | IDs |
|----------|-------|-----|
| **High** | 3 | H1, H2, H3 |
| **Medium** | 5 | M1, M2, M3, M4, M5 |
| **Low** | 4 | L1, L2, L3, L4 |

### Recommended Priority

1. **H2 (ban enforcement)** — quickest high-impact fix; single line added to `apiRequireAuth()` or a wrapper
2. **H1 (login rate limiting)** — critical for production exposure
3. **M1 (HSTS)** — single header addition
4. **H3 (emergency function safeguards)** — add rate limiting + confirmation delay
5. **M2 (CSP)** — requires nonce implementation for inline scripts; start with report-only
6. **M3–M5** — schedule for next hardening pass
