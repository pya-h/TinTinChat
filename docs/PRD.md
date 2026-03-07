# TinTinChat Product Requirements Document (PRD)

Version: 1.1  
Date: 2026-03-07  
Owner: Product + Engineering

## 1) Product Summary

TinTinChat is a lightweight, self-hostable web chat application built with native PHP, HTML, CSS, and vanilla JavaScript. It is designed to run on limited hosting environments without relying on server-side external frameworks or package ecosystems.

The product currently supports direct 1:1 chat plus group chat (text-first), with encrypted direct text messaging and media/file exchange for direct conversations. The next stage focuses on parity enhancements and quality improvements while keeping the architecture simple and dependency-light.

## 2) Vision

Deliver a secure, responsive, easy-to-use chat experience that works on constrained infrastructure and remains maintainable as a pure PHP + vanilla JS codebase.

## 3) Goals

### 3.1 Primary Goals
- Keep the project minimal and host-friendly (no mandatory external backend modules/frameworks).
- Provide dependable private messaging for text, image, voice, and file content.
- Strengthen security and consistency across all API endpoints.
- Improve usability to feel closer to mainstream chat applications.

### 3.2 Near-term Goals (next major milestones)
- Add message actions and conversation ergonomics:
	- Reply to message
	- Copy message (one-click)
	- Message context menu (right-click / long-press)
	- Forward message
- Perform full source review and resolve critical bugs/inconsistencies.
- Complete security hardening pass for auth, endpoints, uploads, and session handling.

### 3.3 Non-Goals (for now)
- Channels/communities beyond current group-chat scope.
- Full multi-device synchronization with push infrastructure.
- Mandatory real-time WebSocket backend migration.
- End-to-end encryption for large media binaries (text E2EE remains priority).

## 4) Target Users

- Privacy-aware users needing lightweight private chat.
- Small teams/friends requiring self-hosted messaging with minimal infra.
- Developers/operators using restricted or shared hosting.

## 5) Current Product Scope (Implemented)

### 5.1 Authentication & Sessions
- Username/password authentication.
- Auto-registration on first login attempt when user does not exist.
- Password hashing (`password_hash` / `password_verify`).
- Session-based auth with session regeneration.
- CSRF protection implemented on login flow.
- Session ident field for reconnection convenience.

### 5.2 Messaging
- 1:1 direct messaging.
- Group messaging (text-first flow with sender attribution).
- Client-side RSA-OAEP encryption/decryption for text messages.
- Read receipt model via `seen_at` and UI ticks.
- Polling-based updates for recent messages.
- Message history pagination with load-more behavior.

### 5.3 Media & Files
- Voice message upload and playback.
- Image upload + full-screen modal preview.
- Generic file upload/download.
- Downloaded file caching in browser IndexedDB.

### 5.4 Discovery & Navigation
- Chat list of recent contacts.
- Group list integrated into chat sidebar.
- Username search with suggestions and keyboard navigation.

### 5.6 Group Support
- Create group, update group details, and fetch member details.
- Add/remove member with role-based permissions (owner/admin/member baseline).
- Join group via tokenized join link with rotation support.
- Leave group and transfer ownership safeguards.

### 5.5 UI
- Responsive dashboard/chat layout.
- Mobile interaction handling and enhancements.
- Notification sound handling.

## 6) Functional Requirements (Target)

### FR-1: Message Reply
- User can reply to a specific message.
- Reply metadata is stored and rendered in conversation.
- Clicking reply preview scrolls/highlights original message.

### FR-2: Copy Message
- User can copy decrypted text message content from message action button or context menu.
- User gets visual confirmation (toast/modal/inline state).

### FR-3: Message Context Menu
- Desktop: right-click on message opens context menu.
- Mobile: long-press on message opens same menu.
- Initial menu items: Reply, Copy (text-only), Forward, Delete (if permitted).

### FR-4: Forward Message
- User can forward an existing message to another chat.
- Preserve original sender information in metadata where applicable.
- Support at least text forwarding in first iteration; media forwarding as phase 2.

### FR-5: Security Hardening
- Every API endpoint enforces request method and consistent auth checks.
- CSRF policy expanded to state-changing endpoints.
- Unified response contract and input validation.
- Upload validation standardized and hardened.

### FR-6: UX Upgrade Baseline
- Cleaner message action discovery.
- Better empty states and send/error/loading states.
- Improved mobile interaction parity for actions.

### FR-7: Group Support
- User can create and manage groups with details and member list.
- Group header/panel exposes title, description, members, and member management actions.
- Group invite link can be copied and rotated by permitted roles.
- Group messages include sender identification.
- Reply/forward/copy/details/delete text actions work in group context with role-aware permissions.

## 7) Non-Functional Requirements

### NFR-1 Security
- Prevent unauthorized message/file access.
- Enforce strict input validation on all endpoints.
- Keep session cookies secure (`HttpOnly`, `SameSite`, `Secure` under HTTPS).

### NFR-2 Performance
- Maintain smooth rendering on long conversations with pagination.
- Keep initial dashboard interaction responsive under normal small-scale load.

### NFR-3 Reliability
- API errors return stable JSON shape for predictable frontend handling.
- Upload and message failures provide actionable user feedback.

### NFR-4 Compatibility
- Support modern desktop/mobile browsers with graceful degradation.

### NFR-5 Maintainability
- Keep architecture simple and modular within existing no-framework constraints.

## 8) Success Metrics

- Reduced API error inconsistency across endpoints (target: single response schema adoption).
- Lower user friction in message actions (reply/copy/forward usage and fewer failed interactions).
- Security review closes all identified high/critical issues.
- Improved usability feedback for mobile and desktop message interactions.

## 9) Risks & Constraints

- Current polling model can become inefficient at scale.
- Text E2EE exists, but private key delivery/storage model has security trade-offs.
- Inconsistent endpoint patterns increase maintenance risk.
- No dependency-heavy stack means more custom implementation effort.

## 10) Milestones

### M1: Stabilization & Security
- Full source review.
- Endpoint normalization and security fixes.

### M2: Core Chat UX Actions
- Reply, copy, context menu, forward (text first).

### M3: Group Support
- Group schema + APIs + UI + role baseline.

### M4: Quality & Polish
- Usability pass, accessibility pass, and edge-case handling.

### M5: Optional Enhancements
- Typing indicator, better unread states, optional real-time transport, media-forward parity.
