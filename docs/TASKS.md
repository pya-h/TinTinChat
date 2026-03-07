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

- [x] (`P0`) Full source review for debugging/improvement.
- [x] (`P0`) Complete security audit + hardening across all endpoints.
- [x] (`P1`) Reply to message.
- [x] (`P1`) Small copy-message action.
- [x] (`P1`) Message context menu (right-click/long-press).
- [x] (`P1`) Forward message.
- [x] (`P1`) Forward message via in-app chat picker modal (no prompt flow).
- [x] (`P1`) UI/UX simplification and consistency pass.
- [x] (`P1`) Message details action and modal in context menu.
- [x] (`P1`) Live seen-tick refresh using targeted seen-status polling.

## 3) Priority Roadmap (Planned)

### Phase A — Stabilization & Security (`P0`)
- [x] (`P0`) Standardize endpoint method checks (`GET/POST/DELETE`) everywhere.
- [x] (`P0`) Standardize API JSON response contract across all endpoints.
- [x] (`P0`) Add CSRF validation to every state-changing endpoint.
- [x] (`P0`) Centralize auth/method/input guards in shared include utility.
- [x] (`P0`) Normalize upload validation (server-side MIME + size + extension policy).
- [x] (`P0`) Align frontend and backend file size limits.
- [x] (`P0`) Run full endpoint authorization review for cross-user data isolation.
- [x] (`P0`) Create security regression checklist and execute after each major change.

### Phase B — Message Actions (`P1`)
- [x] (`P1`) DB migration: add `reply_to_message_id` to `messages`.
- [x] (`P1`) DB migration: add forwarding metadata columns.
- [x] (`P1`) Add backend support for `reply_to_message_id` in send/fetch endpoints.
- [x] (`P1`) Implement UI reply composer state + quoted preview.
- [x] (`P1`) Render quoted/referenced original message block in message bubble.
- [x] (`P1`) Add copy button for text messages with clipboard fallback.
- [x] (`P1`) Add message context menu component (desktop + mobile parity).
- [x] (`P1`) Add forward message flow (text first).
- [x] (`P1`) Add delete action entry in context menu using existing endpoint.

### Phase C — UX Quality (`P1/P2`)
- [x] (`P1`) Improve empty states and inline error/retry UX.
- [x] (`P1`) Improve message action discoverability (hover/focus/long-press cues).
- [x] (`P1`) Improve mobile composer ergonomics and action placement.
- [x] (`P2`) Improve accessibility: keyboard focus, ARIA labels, context menu navigation.
- [x] (`P2`) Improve visual consistency of status indicators and message metadata.
- [x] (`P2`) Add lightweight user settings (notification sound on/off, auto-scroll behavior).
- [x] (`P2`) Centralize key user-facing modal strings in chat actions/errors for localization-readiness.

### Phase D — Maintainability (`P1/P2`)
- [x] (`P1`) Introduce internal `api-service.js` for consistent fetch/error handling.
- [x] (`P1`) Split `chat.js` into smaller modules while keeping vanilla JS approach.
- [x] (`P2`) Introduce shared constants for limits/timeouts (frontend + backend sync).
- [x] (`P2`) Add developer docs for endpoint contract and error codes.

### Phase E — Group Support (`P1/P2`)
- [x] (`P1`) **Milestone E1 — Schema Foundation**
	- define group chat data model and migration plan:
	- `groups` table (`id`, `title`, `description`, `created_by_user_id`, `join_token`, `created_at`, `updated_at`),
	- `group_members` table (`group_id`, `user_id`, `role`, `joined_at`, `invited_by_user_id`),
	- `messages.group_id` nullable FK for group messages,
	- keep direct-message compatibility fully intact.
- [x] (`P1`) **Milestone E2 — Group Lifecycle APIs**
	- implement backend APIs for group lifecycle:
	- create group,
	- update group details,
	- fetch user groups,
	- fetch group details + members,
	- add member (owner/admin-controlled),
	- join group by secure tokenized link.
- [x] (`P1`) **Milestone E3 — Join Link Management**
	- add group join-link flow with rotation/revocation:
	- generate copyable invite link,
	- allow owner/admin to rotate link,
	- validate expiry/authorization rules server-side.
- [x] (`P1`) **Milestone E4 — Message API Group Parity**
	- extend send/fetch message APIs to support group conversations:
	- sender identity always included per message,
	- membership check on all group reads/writes,
	- seen/read behavior adapted for group-safe semantics.
- [x] (`P1`) **Milestone E5 — Group UI Entry + Navigation**
	- add group UI entry points in chat list:
	- create-group action,
	- clear visual distinction between users and groups,
	- fast switch between direct and group chats.
- [x] (`P1`) **Milestone E6 — Group Details Panel**
	- add group details panel in chat header area:
	- title,
	- description/details,
	- members list,
	- add-member button,
	- copy/rotate join-link actions.
- [x] (`P1`) **Milestone E7 — Group Message Rendering**
	- update message renderer for group context:
	- show sender name/avatar on each inbound group message,
	- keep clean bubble spacing for repeated sender blocks,
	- preserve existing media/file rendering behavior.
- [x] (`P1`) **Milestone E8 — Action Parity (Reply/Forward/Copy/Delete/Details)**
	- ensure message actions parity in groups:
	- reply works end-to-end in groups,
	- forward supports user→group, group→user, and group→group targets,
	- copy/details/delete behaviors follow group permissions.
	- text-first group parity delivered; group media/file parity remains follow-up.
- [ ] (`P2`) **Milestone E9 — Roles & Permissions**
	- add group role/permission policy baseline:
	- owner/admin/member roles,
	- add/remove member permissions,
	- optional group leave and owner-transfer safeguards.
- [ ] (`P2`) **Milestone E10 — UX Polish + QA Closure**
	- add user-friendly polish for group UX:
	- empty states for new groups,
	- member-add success/error feedback,
	- lightweight “new in group” badge in list,
	- accessibility parity (keyboard + screen reader labels).
	- run full regression for direct chat flows (reply/forward/seen/media) before closing Phase E.

### Phase F — Chatroom Parity Features (Recommended) (`P2/P3`)
- [ ] (`P2`) Typing indicator.
- [ ] (`P2`) Unread counter per chat.
- [ ] (`P2`) Better per-message timestamp formatting and grouping.
- [ ] (`P2`) Search inside current conversation.
- [ ] (`P3`) Message reactions (minimal emoji set).
- [ ] (`P3`) Optional delete-for-everyone policy (with permissions).

### Phase G — Sticker Support (Telegram-like) (`P1/P2`)
- [ ] (`P1`) Define sticker format spec aligned to Telegram style:
	- static sticker image on `512x512` canvas,
	- one side exactly `512px` (the other side `<=512px`),
	- preferred `WEBP`, allow `PNG` fallback,
	- enforce max upload size (target: `<=512KB` per sticker).
- [ ] (`P1`) DB migration: add `stickers` table (id, file_path, width, height, uploaded_by_user_id, created_at, is_active).
- [ ] (`P1`) DB migration: add sticker message reference (e.g. `messages.sticker_id` nullable FK).
- [ ] (`P1`) Add backend endpoint to upload sticker image with validation/resizing to spec.
- [ ] (`P1`) Add backend endpoint to fetch sticker catalog (global list usable by all users).
- [ ] (`P1`) Add backend support to send sticker messages and fetch/render them in chat history.
- [ ] (`P1`) Add sticker picker section in composer area (toggle/button + grid list of stickers).
- [ ] (`P1`) Add “Add Sticker” button inside sticker section for user uploads.
- [ ] (`P2`) Add lightweight sticker management safeguards:
	- file type + dimension checks,
	- duplicate/hash check,
	- basic moderation control (`is_active` flag for admin disable).
- [ ] (`P2`) Add UX states for sticker flow (loading, empty, upload progress, error/retry).

### Phase H — Nice to Have (Power UX) (`P3`)
- [ ] (`P3`) Add **Select messages** action to message context menu.
- [ ] (`P3`) Implement select mode behavior:
	- tap/click messages to multi-select,
	- show selected count,
	- clear visual selected state on cancel/success.
- [ ] (`P3`) In select mode, show top action bar with:
	- `Cancel`,
	- `Forward`,
	- `Delete`.
- [ ] (`P3`) Implement bulk actions for selected messages:
	- bulk forward to chosen target chat,
	- bulk delete with confirmation and partial-failure handling.
- [ ] (`P3`) Add **Edit message** (text only) with time limit and edited marker:
	- context menu item `Edit` on eligible sent text messages,
	- composer enters edit mode with save/cancel,
	- show `edited` metadata in message bubble.
- [ ] (`P3`) Add **Settings modal** with user UI preferences:
	- theme mode (`System` / `Light` / `Dark`),
	- compact vs comfortable density,
	- show/hide message timestamps,
	- animation/reduced motion toggle.
- [ ] (`P3`) Add persistence for UI preferences (localStorage first, optional server sync later).
- [ ] (`P3`) Add keyboard shortcuts for power users:
	- `Esc` to exit select/edit mode,
	- `Ctrl/Cmd + A` for select-all visible (when in select mode),
	- `Ctrl/Cmd + Enter` to save edit.
- [ ] (`P3`) Add guardrails for destructive bulk actions (confirm dialogs + clear success/error summaries).

## 4) Suggested Execution Order

1. Security and endpoint consistency (`P0`)  
2. Reply + context menu + copy + forward (`P1`)  
3. UX polishing and accessibility (`P1/P2`)  
4. Group support foundation + UX (`P1/P2`)  
5. Optional parity features (`P2/P3`)  
6. Telegram-like sticker support (`P1/P2`)  
7. Nice-to-have power UX (`P3`)

## 5) Definition of Done (for upcoming feature work)

For each new feature/task:
- [ ] Backend validations + auth checks included.
- [ ] UI behavior works on desktop and mobile.
- [ ] Error states are user-friendly and actionable.
- [ ] No breaking change to existing message types.
- [ ] Manual regression checklist completed.
