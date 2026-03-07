# TinTinChat API Contract & Error Codes

Last updated: 2026-03-07
Audience: developers extending `api/*.php` and frontend consumers in `assets/js/*`.

## 1) Response Envelope

All JSON endpoints should return a stable envelope via shared helpers in `includes/api_helpers.php`.

### Success

```json
{
  "status": "ok",
  "...": "endpoint-specific fields"
}
```

Notes:
- `apiSuccess(array $data = [], int $statusCode = 200)` merges `status: ok` with endpoint payload.
- Some endpoints return data at top-level keys (legacy-compatible), not nested under `data`.

### Failure

```json
{
  "status": "error",
  "error": "Human-readable message",
  "error_details": {
    "code": "MACHINE_CODE",
    "message": "Human-readable message"
  }
}
```

Notes:
- `error_details.code` is the stable machine key for frontend handling and logs.
- Do not leak raw exceptions/SQL details to clients.

---

## 2) Guard Order (Recommended)

For protected endpoints:
1. `apiRequireMethod(...)`
2. `apiRequireAuth()`
3. `apiRequireCsrf()` for mutating operations
4. Input normalization/validation
5. Domain logic and DB operations
6. `apiSuccess(...)` / `apiError(...)`

For file uploads, include `apiGuardOversizedPostBody()` before reading files.

---

## 3) Shared Constants

Centralized in `includes/constants.php`.

Examples:
- Upload limits: `TTC_UPLOAD_IMAGE_MAX_BYTES`, `TTC_UPLOAD_FILE_MAX_BYTES`, `TTC_UPLOAD_VOICE_MAX_BYTES`
- Paging limits: `TTC_FETCH_MESSAGES_MIN_LIMIT`, `TTC_FETCH_MESSAGES_MAX_LIMIT`, `TTC_FETCH_MESSAGES_DEFAULT_LIMIT`
- Search/seen caps: `TTC_SEARCH_USERS_MIN_QUERY_LENGTH`, `TTC_SEARCH_USERS_LIMIT`, `TTC_SEEN_STATUS_MAX_IDS`

Frontend receives synced values via `APP_CONSTANTS` in `dashboard.php`.

---

## 4) Common Error Codes

### Auth / Session
- `UNAUTHORIZED` → user session missing/invalid.
- `INVALID_CSRF` → missing/invalid CSRF token for write endpoint.

### Request / Validation
- `INVALID_METHOD` → wrong HTTP method.
- `INVALID_JSON` → malformed JSON body.
- `MISSING_USERNAME` / `INVALID_USERNAME` / `INVALID_TARGET_USERNAME` → username validation failures.
- `TARGET_NOT_FOUND` → referenced chat user does not exist.
- `MISSING_OFFSET` / `INVALID_MESSAGE_IDS` → required pagination/seen inputs missing/invalid.

### Upload / File Handling
- `UPLOAD_TOO_LARGE` → POST body exceeded server config (`post_max_size`).
- `UPLOAD_MISSING` / `UPLOAD_FAILED` → missing file or upload transport error.
- `FILE_TOO_LARGE` → endpoint-specific max size exceeded.
- `INVALID_IMAGE_TYPE` / `INVALID_FILE_TYPE` / `BLOCKED_FILE_TYPE` → MIME/ext policy violation.
- `DIRECTORY_CREATE_FAILED` / `DIRECTORY_NOT_WRITABLE` → storage path issues.
- `FILE_MOVE_FAILED` / `FILE_SAVE_FAILED` → failed move/write.
- `MIME_CHECK_FAILED` → MIME detection failure.

### Data / Persistence
- `SEND_FAILED` → write operation rejected/failure.
- `DB_SAVE_FAILED` / `DB_ERROR` → database operation failure.

### Security / Access
- `FORBIDDEN` (or endpoint-specific equivalent) → resource exists but user not permitted.

---

## 5) HTTP Status Mapping Guidelines

- `200` success reads/writes (or `201` for explicit create if introduced later)
- `400` validation and malformed payload
- `401` unauthenticated
- `403` authenticated but disallowed (including CSRF)
- `404` resource/target not found
- `405` invalid HTTP method
- `409` conflict-like domain failures
- `500` unexpected server failure

Keep status code + error code pair consistent for the same failure class.

---

## 6) Frontend Consumption Rules

Frontend should:
- Treat non-`2xx` as failure.
- Treat JSON with `status: error` as failure even on `2xx`.
- Surface user-safe messages and avoid exposing backend internals.
- Prefer shared helpers (`assets/js/api-service.js`) for fetch and error handling.

---

## 7) Adding a New Endpoint Checklist

- Add method/auth/CSRF guards as required.
- Reuse `apiNormalizeUsername`, upload helpers, and shared constants.
- Return responses only via `apiSuccess` / `apiError`.
- Use existing error codes where semantics match; add new code only when needed.
- Update this doc when introducing new reusable error codes or contract behavior.
