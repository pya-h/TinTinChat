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
- [x] (`P2`) **Milestone E9 — Roles & Permissions**
	- add group role/permission policy baseline:
	- owner/admin/member roles,
	- add/remove member permissions,
	- optional group leave and owner-transfer safeguards.
- [x] (`P2`) **Milestone E10 — UX Polish + QA Closure**
	- add user-friendly polish for group UX:
	- empty states for new groups,
	- member-add success/error feedback,
	- lightweight “new in group” badge in list,
	- accessibility parity (keyboard + screen reader labels).
	- run full regression for direct chat flows (reply/forward/seen/media) before closing Phase E.

### Phase E.1 — Group Text Encryption (`P1`)
- [x] (`P1`) Implement shared group text encryption key model (single encrypted payload per group message).
- [x] (`P1`) Add member key distribution for create/add/join flows with membership-gated access.
- [x] (`P1`) Encrypt/decrypt group text and forwarded text across group↔group, user↔group paths.
- [x] (`P1`) Expand encrypted text storage capacity (`messages.message`, `messages.message_for_sender`) to `MEDIUMTEXT` for larger payload support.

### Phase E.2 — Group Media/File Encryption (Separate) (`P1/P2`)
- [x] (`P1`) Encrypt group voice message payloads with shared group key.
- [x] (`P1`) Encrypt group image payloads (at-rest + transport metadata policy).
- [x] (`P1`) Encrypt group generic file payloads with secure key handling.
- [x] (`P1`) Apply full media encryption parity to direct/private chats (voice/image/file) using same envelope model.
- [x] (`P2`) Add key-versioning/rotation strategy for non-text encrypted attachments.
- [x] (`P2`) Add migration/backfill policy for legacy unencrypted group media/files.

### Phase F — Chatroom Parity Features (Recommended) (`P2/P3`)
- [x] (`P2`) Search inside current conversation.
- [x] (`P3`) Message reactions (minimal emoji set).
- [x] (`P3`) Optional delete-for-everyone policy (with permissions).
- [x] (`P3`) Improve Search conversation: Allow searching in old messages (for now it just searchs loaded messages only)
- [x] (`P3`) Add separate Send Video/Record Video option (Use File mode with video flag or something)

### Phase F.5 — Avatar Assignment (Small) (`P2`)
- [x] (`P2`) DB migration for user avatar metadata/path.
- [x] (`P2`) Add secure avatar upload endpoint with MIME/size validation.
- [x] (`P2`) Add avatar retrieval endpoint + default fallback behavior.
- [x] (`P2`) Show avatars in chat list, member lists, and message sender contexts.
- [x] (`P2`) Add simple profile/avatar update UI action.

### Phase F.6 — Avatar & User Profile UX Hardening (Pre-Stickers) (`P1/P2`)
- [x] (`P1`) Run focused post-Phase-F.5 review and bug sweep:
	- verify upload/retrieval behavior for valid/invalid avatar files,
	- verify cache-busting and fallback rendering across desktop/mobile,
	- verify no regressions in chat list, group members, and sender avatar contexts.
- [x] (`P1`) Define user info entry points (from direct chat header and chat list item click/secondary action).
- [x] (`P1`) Extend user-info entry points to group context:
	- click sender avatar/name in incoming group messages,
	- click member avatar in group details panel.
- [x] (`P1`) Add **User Info modal** for direct-chat target with minimal profile details:
	- username,
	- user ident/metadata that is safe to expose,
	- current avatar preview in circular style.
- [x] (`P1`) Add **Show Avatar** action in the User Info modal.
- [x] (`P1`) Implement enlarged avatar viewer (overlay/modal) opened from User Info modal avatar click.
- [x] (`P1`) Add **Send Message** action from User Info modal to jump to private chat with that user.
- [x] (`P2`) Add close/escape/backdrop interactions and keyboard accessibility for User Info + enlarged avatar views.
- [x] (`P2`) Add optional user actions section in User Info modal (planned):
	- `Delete Chat` (remove all direct-chat messages between current user and target user) with explicit confirmation,
	- reserve space for future actions (mute/block/report policy, if introduced later).
- [x] (`P2`) Define backend/API contract for `Delete Chat` action (scope, auth, audit safety, and response contract) before implementation.
- [x] (`P2`) Add regression checklist for this phase (modal behavior, avatar enlarge UX, destructive-action safeguards).

### Phase G — Sticker Support (Telegram-like) (`P1/P2`)
- [x] (`P1`) Define sticker format spec aligned to Telegram style:
	- static sticker image on `512x512` canvas,
	- one side exactly `512px` (the other side `<=512px`),
	- preferred `WEBP`, allow `PNG` fallback,
	- enforce max upload size (target: `<=512KB` per sticker).
- [x] (`P1`) DB migration: add `stickers` table (id, file_path, width, height, uploaded_by_user_id, created_at, is_active).
- [x] (`P1`) DB migration: add sticker message reference (e.g. `messages.sticker_id` nullable FK).
- [x] (`P1`) Add backend endpoint to upload sticker image with validation/resizing to spec.
- [x] (`P1`) Add backend endpoint to fetch sticker catalog (global list usable by all users).
- [x] (`P1`) Add backend support to send sticker messages and fetch/render them in chat history.
- [x] (`P1`) Add sticker picker section in composer area (toggle/button + grid list of stickers).
- [x] (`P1`) Add “Add Sticker” button inside sticker section for user uploads.
- [x] (`P2`) Add lightweight sticker management safeguards:
	- file type + dimension checks,
	- duplicate/hash check,
	- basic moderation control (`is_active` flag for admin disable).
- [x] (`P2`) Add UX states for sticker flow (loading, empty, upload progress, error/retry).


### Phase H - Tests
- [x] (`P2`) Phase H bootstrap: add lightweight local test harness and first smoke checks.
- [x] (`P1`) Add authenticated endpoint smoke flow for login/session + send/fetch message.
- [x] (`P1`) Extend authenticated smoke flow with reaction/delete/sticker coverage.
- [x] (`P2`) Unit Tests for important operations/actions.
- [x] (`P1`) E2E Tests
- [ ] (`P1`) Extend tests by adding new unit and e2e tests
- [ ] (`P1`) Add scripts and tools to setup whole testing requirements and run all tests easily.


### Phase I — Nice to Have (Power UX) (`P3`)
- [ ] (`P3`) Add Block user: Blocked user is not able to send message to the blocker anymore.
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

### Phase J — PWA Support (Final Phase) (`P1/P2`)
- [ ] (`P1`) Add web app manifest (`name`, `short_name`, icons, theme/background, display mode).
- [ ] (`P1`) Register service worker with safe versioned update strategy.
- [ ] (`P1`) Implement core app-shell caching strategy for offline launch.
- [ ] (`P1`) Define runtime caching policies for API calls (network-first for chat data, stale fallback rules).
- [ ] (`P1`) Define secure caching policy for encrypted media/file payloads (no plaintext persistence beyond policy).
- [ ] (`P2`) Add installability UX (install prompt handling + fallback guidance).
- [ ] (`P2`) Add push notification readiness checklist (permissions flow + backend token lifecycle plan).
- [ ] (`P2`) Add iOS/Android/browser compatibility QA checklist for PWA behavior.
- [ ] (`P2`) Add offline/poor-network UX states for message fetch/send retry.
- [ ] (`P2`) Add PWA release runbook (cache busting, rollback, update rollout).

## 4) Suggested Execution Order

1. Security and endpoint consistency (`P0`)  
2. Reply + context menu + copy + forward (`P1`)  
3. UX polishing and accessibility (`P1/P2`)  
4. Group support foundation + UX (`P1/P2`)  
5. Optional parity features (`P2/P3`)  
6. Avatar/profile UX hardening + user info modal (`P1/P2`)
7. Telegram-like sticker support (`P1/P2`)  
8. Tests foundation + coverage (`P1/P2`)
9. Nice-to-have power UX (`P3`)
10. Final PWA support rollout (`P1/P2`)

## 5) Definition of Done (for upcoming feature work)

For each new feature/task:
- [ ] Backend validations + auth checks included.
- [ ] UI behavior works on desktop and mobile.
- [ ] Error states are user-friendly and actionable.
- [ ] No breaking change to existing message types.
- [ ] Manual regression checklist completed.
