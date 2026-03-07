# TinTinChat Tasks

Date: 2026-03-06  
Source: Current codebase review + PRD + Technical Design

Legend:
- Priority: `P0` critical, `P1` high, `P2` medium, `P3` nice-to-have
- Status: `[x]` done, `[ ]` planned

## 1) Completed Tasks (Already Implemented)

### Product/Core
- [x] (`P0`) User auth flow with session-based login and logout.
- [x] (`P0`) Auto-registration for unknown usernames with password hash storage.
- [x] (`P1`) Responsive dashboard + chat layout for desktop/mobile.
- [x] (`P1`) Username search + suggestion dropdown.
- [x] (`P1`) Chat list from message history.

### Messaging
- [x] (`P0`) 1:1 text messaging.
- [x] (`P0`) Client-side RSA text encryption/decryption using Web Crypto.
- [x] (`P1`) Read receipts (`seen_at`) with tick indicators.
- [x] (`P1`) Message pagination with load-more and go-to-latest controls.
- [x] (`P1`) Polling for near real-time updates.

### Media & Files
- [x] (`P1`) Voice message recording/upload/playback.
- [x] (`P1`) Image upload and modal preview.
- [x] (`P1`) Generic file upload/download.
- [x] (`P2`) IndexedDB caching for downloaded files.

### Security/Infra (partial)
- [x] (`P1`) Prepared statements used in DB queries.
- [x] (`P1`) Login CSRF protection.
- [x] (`P1`) Session cookie hardening basics (`HttpOnly`, `SameSite`, `Secure` when HTTPS).
- [x] (`P1`) Authorization checks on protected media retrieval endpoints.

## 2) Current Gaps from Your Requested Feature Set

- [ ] (`P0`) Full source review for debugging/improvement.
- [ ] (`P0`) Complete security audit + hardening across all endpoints.
- [ ] (`P1`) Reply to message.
- [ ] (`P1`) Small copy-message action.
- [ ] (`P1`) Message context menu (right-click/long-press).
- [ ] (`P1`) Forward message.
- [ ] (`P1`) UI/UX simplification and consistency pass.

## 3) Priority Roadmap (Planned)

### Phase A — Stabilization & Security (`P0`)
- [ ] (`P0`) Standardize endpoint method checks (`GET/POST/DELETE`) everywhere.
- [ ] (`P0`) Standardize API JSON response contract across all endpoints.
- [x] (`P0`) Add CSRF validation to every state-changing endpoint.
- [x] (`P0`) Centralize auth/method/input guards in shared include utility.
- [x] (`P0`) Normalize upload validation (server-side MIME + size + extension policy).
- [x] (`P0`) Align frontend and backend file size limits.
- [ ] (`P0`) Run full endpoint authorization review for cross-user data isolation.
- [ ] (`P0`) Create security regression checklist and execute after each major change.

### Phase B — Message Actions (`P1`)
- [ ] (`P1`) DB migration: add `reply_to_message_id` to `messages`.
- [ ] (`P1`) DB migration: add forwarding metadata columns.
- [ ] (`P1`) Add backend support for `reply_to_message_id` in send/fetch endpoints.
- [ ] (`P1`) Implement UI reply composer state + quoted preview.
- [ ] (`P1`) Render quoted/referenced original message block in message bubble.
- [ ] (`P1`) Add copy button for text messages with clipboard fallback.
- [ ] (`P1`) Add message context menu component (desktop + mobile parity).
- [ ] (`P1`) Add forward message flow (text first).
- [ ] (`P1`) Add delete action entry in context menu using existing endpoint.

### Phase C — UX Quality (`P1/P2`)
- [ ] (`P1`) Improve empty states and inline error/retry UX.
- [ ] (`P1`) Improve message action discoverability (hover/focus/long-press cues).
- [ ] (`P1`) Improve mobile composer ergonomics and action placement.
- [ ] (`P2`) Improve accessibility: keyboard focus, ARIA labels, context menu navigation.
- [ ] (`P2`) Improve visual consistency of status indicators and message metadata.
- [ ] (`P2`) Add lightweight user settings (notification sound on/off, auto-scroll behavior).

### Phase D — Maintainability (`P1/P2`)
- [ ] (`P1`) Introduce internal `api-service.js` for consistent fetch/error handling.
- [ ] (`P1`) Split `chat.js` into smaller modules while keeping vanilla JS approach.
- [ ] (`P2`) Introduce shared constants for limits/timeouts (frontend + backend sync).
- [ ] (`P2`) Add developer docs for endpoint contract and error codes.

### Phase E — Chatroom Parity Features (Recommended) (`P2/P3`)
- [ ] (`P2`) Typing indicator.
- [ ] (`P2`) Unread counter per chat.
- [ ] (`P2`) Better per-message timestamp formatting and grouping.
- [ ] (`P2`) Search inside current conversation.
- [ ] (`P3`) Message reactions (minimal emoji set).
- [ ] (`P3`) Optional edit message (time-limited).
- [ ] (`P3`) Optional delete-for-everyone policy (with permissions).

## 4) Suggested Execution Order

1. Security and endpoint consistency (`P0`)  
2. Reply + context menu + copy + forward (`P1`)  
3. UX polishing and accessibility (`P1/P2`)  
4. Optional parity features (`P2/P3`)

## 5) Definition of Done (for upcoming feature work)

For each new feature/task:
- [ ] Backend validations + auth checks included.
- [ ] UI behavior works on desktop and mobile.
- [ ] Error states are user-friendly and actionable.
- [ ] No breaking change to existing message types.
- [ ] Manual regression checklist completed.
