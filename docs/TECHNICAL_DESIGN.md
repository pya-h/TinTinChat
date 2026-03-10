# TinTinChat Technical Design Document

Version: 1.1  
Date: 2026-03-07

## 1) Overview

TinTinChat is a monolithic PHP web application with server-rendered entry pages and JavaScript-driven chat interactions. It uses:
- PHP + PDO + MySQL for backend APIs and persistence.
- Vanilla JavaScript + Web Crypto APIs for client behavior and text encryption/decryption.
- Static assets for CSS/JS and uploaded media/file content.

Design priority: keep implementation lightweight and deployable on constrained/shared hosting.

## 2) Architecture

### 2.1 High-Level Components
- UI Pages
  - `index.php` (auth page)
  - `dashboard.php` (chat UI shell)
- API Layer (`api/*.php`)
  - Auth/session, direct + group messaging actions, upload/download, search, read status
- Core Includes (`includes/*.php`)
  - DB bootstrap, session helpers, shared utilities, group helpers
- Frontend Scripts
  - `assets/js/chat.js` (chat logic, polling, rendering, uploads)
  - `assets/js/crypto.js` (RSA key import + encrypt/decrypt utilities)
- Data
  - MySQL tables: `users`, `messages`, `groups`, `group_members`
- Storage
  - `uploads/images`, `uploads/voice_messages`, `uploads/files`

### 2.2 Runtime Flow
1. User authenticates at `index.php` -> `api/auth/login.php`.
2. Session established; user lands on `dashboard.php`.
3. Frontend loads private key via `api/keys/get_private.php` and chat list via `api/chats/fetch.php`.
4. Selecting a user or group triggers `api/messages/fetch.php` with pagination.
5. New messages fetched by polling (`api/messages/fetch_recent.php`).
6. Sending text calls `api/messages/send_text.php` for direct/group targets; media/files remain direct-chat endpoints in current scope.
7. Seen status updated via `api/messages/see.php`.

## 3) Data Model

### 3.1 `users` (current)
- `id` (PK)
- `username` (unique)
- `password_hash`
- `public_key`
- `private_key`
- `created_at`
- `ident`
- `last_login`
- `is_admin`

### 3.2 `messages` (current)
- `id` (PK)
- `sender_id` (FK -> users)
- `receiver_id` (nullable FK -> users)
- `group_id` (nullable FK -> groups)
- `message` (recipient encrypted payload for text)
- `message_for_sender` (sender encrypted payload for text)
- `message_type` (`text`, `voice`, `image`, `video`, `file`)
- `voice_file_path`
- `image_file_path`
- `any_file_path`
- `file_size`
- `created_at`
- `seen_at`

### 3.3 `groups` (implemented)
- `id` (PK)
- `title`
- `description`
- `created_by_user_id` (FK -> users)
- `join_token` (unique)
- `created_at`
- `updated_at`

### 3.4 `group_members` (implemented)
- `group_id` (FK -> groups)
- `user_id` (FK -> users)
- `role` (`owner`, `admin`, `member`)
- `joined_at`
- `invited_by_user_id` (nullable FK -> users)

### 3.5 Message metadata additions (implemented)
- `messages.reply_to_message_id` nullable FK -> `messages.id`
- `messages.forwarded_from_message_id` nullable FK -> `messages.id`
- `messages.forwarded_by_user_id` nullable FK -> `users.id`

## 4) API Design (Current + Direction)

### 4.1 Current Endpoint Groups
- Auth: `login.php`, `logout.php`
- Keys: `get_public_key.php`, `get_private_key.php`, `save_key.php`
- Messaging: `send_message.php`, `fetch_messages.php`, `fetch_recent_messages.php`, `see_messages.php`, `delete_messages.php`
- Media/files: `send_image_message.php`, `send_voice_message.php`, `send_file_message.php`, retrieval endpoints
- User search/discovery: `search_users.php`, `check_user_exists.php`, `fetch_chats.php`
- Groups:
  - `create_group.php`
  - `update_group.php`
  - `fetch_groups.php`
  - `fetch_group_details.php`
  - `add_group_member.php`
  - `remove_group_member.php`
  - `join_group.php`
  - `leave_group.php`
  - `rotate_group_join_link.php`
  - `transfer_group_owner.php`

### 4.2 Current Inconsistencies
- Not all endpoints validate request method consistently.
- Error response schema varies (`error` vs `status/error`, different status codes).
- Upload size constraints are inconsistent between frontend and backend in some places.
- CSRF is implemented for login but not uniformly enforced on all state-changing API endpoints.

### 4.3 Target API Contract
Adopt unified JSON response shape for all APIs:
- Success: `{ "status": "ok", "data": { ... } }`
- Failure: `{ "status": "error", "error": { "code": "STRING_CODE", "message": "Human readable" } }`

Minimum policy:
- Verify request method early.
- Verify auth session for protected endpoints.
- Validate and normalize inputs.
- Return stable status codes and payload shapes.

## 5) Security Design

### 5.1 Current Strengths
- PDO prepared statements for SQL interactions.
- Session cookie hardening in `configSession()`.
- Login CSRF token verification.
- Authorization checks for media retrieval endpoints.
- Path traversal mitigation through `realpath` checks in file retrieval.

### 5.2 Key Risks Identified
- Private key is persisted server-side and transmitted to client (security trade-off).
- Missing or inconsistent CSRF enforcement on mutating endpoints.
- Missing method checks on multiple endpoints.
- Mixed validation strategy for uploads and payload fields.
- Potentially duplicated and inconsistent auth/method guard code.

### 5.3 Hardening Plan
1. Introduce shared guard helpers (auth, method, JSON output, input parsing).
2. Enforce CSRF on all write/delete/update actions.
3. Standardize upload validation using server-side MIME checks (`finfo`) and shared limits.
4. Add centralized audit logging for security-relevant failures (optional, lightweight file log).
5. Review key management model and add safer option (encrypted private key at rest or browser-only generation phase).

## 6) Frontend Design

### 6.1 Current Behavior
- Main state and rendering are in `assets/js/chat.js`.
- Polling every second updates current chat and periodically refreshes chat list.
- Message render branches by `message_type`.
- Media-specific handlers for playback, modal preview, download caching.

### 6.2 Current Gaps
- Group media/file send parity is not yet implemented (group text-first currently).
- Group read-state/seen semantics are not yet implemented.
- `chat.js` remains large and mixed-concern despite module extraction.

### 6.3 Frontend Refactor Status (implemented baseline)
- `api-service.js` added for consistent fetch/error handling.
- `chat-utils.js` and `chat-notifications.js` extracted from `chat.js`.
- Group target model integrated in `chat.js` using mixed user/group chat entries.

## 7) Feature Design: Requested Next Capabilities

### 7.0 Group Support (implemented baseline)
Data/API:
- Group and membership tables with role model and tokenized join links.
- Group lifecycle/member management endpoints.
- Message fetch/send endpoints extended for direct/group text support.

UI:
- Group creation entry point in sidebar.
- Group details panel with title/description/members/add-member/join-link actions.
- Sender labels in group messages.
- Role actions: remove member, transfer ownership, leave group.

Security:
- Group membership enforced on group message fetch/send.
- Owner/admin permission checks for management operations.
- Owner transfer/leave safeguards.

### 7.1 Reply Message
Data:
- Add `reply_to_message_id` in DB.

UI:
- Context menu -> Reply.
- Composer shows reply preview with close/cancel option.
- Sent message renders small quoted block of original message snippet.

API:
- Extend send endpoints with optional `reply_to_message_id`.
- Fetch endpoints include reply target metadata.

### 7.2 Copy Message Button
UI:
- Show compact copy icon/button on text message hover/focus (desktop) and in context menu (mobile/desktop).

Behavior:
- Copy decrypted text via Clipboard API.
- Fallback method for unsupported browsers.

### 7.3 Message Context Menu
Trigger:
- `contextmenu` event (desktop), long press (mobile).

Actions v1:
- Reply
- Copy (text)
- Forward
- Delete (self/all depending policy)

### 7.4 Forward Message
Data:
- Add forward metadata columns.

UI:
- Multi-step flow:
  1) Trigger forward from message menu
  2) Pick destination chat
  3) Confirm send

Scope:
- V1 text forwarding
- V2 media/file forwarding with reference-or-duplicate policy

## 8) Performance & Scalability Notes

- Polling every second is simple but costly with many users; keep for now due to low complexity target.
- Improve incrementally:
  - Pause or reduce polling in hidden tab.
  - Poll only active chat at high frequency; chat list less frequent.
  - Add optional SSE/WebSocket as future enhancement.

## 9) Testing Strategy

### 9.1 Manual Test Matrix
- Auth: login/register/logout/session restore.
- Messaging: send/receive text across languages + decryption path.
- Media/file: upload/download/playback with size/type edge cases.
- Actions: reply/copy/context menu/forward (once added).
- Security: unauthorized access to endpoints/files, CSRF checks, invalid methods.

### 9.2 Low-dependency QA Approach
- Keep browser-based test pages and endpoint smoke scripts.
- Add deterministic checklist in repository for regressions.

## 10) Rollout Plan

Phase 1 (stability/security):
- Endpoint consistency and shared guards.
- Security fixes and response normalization.

Phase 2 (chat UX):
- Reply + context menu + copy + forward (text).

Phase 3 (polish):
- UI/UX refinements, accessibility, keyboard/touch parity.

## 11) Open Decisions

- Preferred delete semantics: delete-for-me vs delete-for-everyone.
- Forward implementation for media: duplicate file or reference existing payload.
- Future key management model and migration approach.
