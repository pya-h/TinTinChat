# TinTinChat Product Requirements Document (PRD)

Version: 1.2
Date: 2026-03-10
Owner: Product + Engineering

## 1) Product Summary

TinTinChat is a lightweight, self-hostable chat application built with PHP, MySQL, and vanilla JavaScript.
It targets teams/users who need practical private/group messaging on constrained hosting without heavy framework dependencies.

## 2) Product Vision

Provide a secure, usable, low-ops chat platform with modern baseline features (direct/group messaging, encrypted content flows, message actions, media, profile UX, and testable reliability).

## 3) Current Scope (Implemented)

### 3.1 Messaging
- Direct and group chat
- Pagination + load-more
- Poll-based message refresh
- Typing indicators
- Seen status flow

### 3.2 Security & Encryption
- Session auth + CSRF on mutating routes
- Private text encryption flow
- Group text shared-key encryption flow
- Encrypted media envelope model for direct/group media and files
- Authorization checks on protected retrieval and group membership operations

### 3.3 Message actions
- Reply
- Copy
- Forward
- Details
- Reactions
- Delete modes
- Delete direct chat history (from profile modal)

### 3.4 Media/attachments
- Image / voice / file / video flows
- Sticker upload, catalog fetch, send, and render

### 3.5 User/profile/moderation
- Avatar upload/retrieval with fallback avatar rendering
- User Info modal with avatar enlargement + send-message shortcut
- Block/unblock with direct-message send enforcement

### 3.6 Quality & reliability
- Unit + E2E smoke suite and one-command runner
- Test env setup + test server lifecycle helper scripts

## 4) Goals (Current and Next)

### 4.1 Active goals
- Keep endpoint contract and behavior consistent.
- Reduce UX friction in high-frequency flows (open chat, send, scroll, actions).
- Maintain direct/group parity for core messaging behaviors.

### 4.2 Upcoming priorities
- Finish remaining Phase I power UX items.
- Phase J PWA baseline (manifest + service worker + offline shell strategy).
- Phase J.2 group seen/unread refinement.

## 5) Non-Goals (for now)

- Full-scale real-time infrastructure migration (WebSocket-first architecture).
- Enterprise federation/multi-tenant workspace model.
- Large plugin ecosystem or framework migration.

## 6) Primary User Personas

- Small private teams needing self-hosted secure chat.
- Technical operators on shared/constrained hosting.
- Privacy-aware users preferring minimal dependency surfaces.

## 7) Functional Requirements (Current Baseline)

- FR-1: Authenticated chat access with stable session behavior.
- FR-2: Direct/group message send/fetch and incremental refresh.
- FR-3: Message action parity (reply/copy/forward/details/delete/reactions).
- FR-4: Encrypted text and encrypted media/file envelope handling.
- FR-5: Profile and moderation actions (avatar, user info, block/unblock).
- FR-6: Repeatable automated test flow for critical behaviors.

## 8) Non-Functional Requirements

- NFR-1 Security: strict guard ordering (method/auth/csrf/input), safe error contracts.
- NFR-2 Reliability: deterministic API envelopes and stable client handling.
- NFR-3 Performance: acceptable chat responsiveness under polling model.
- NFR-4 Maintainability: dependency-light architecture with clear docs and shared helpers.

## 9) Risks and Constraints

- Polling remains simple but can be inefficient at scale.
- Some crypto key-management tradeoffs still exist and require staged hardening over time.
- Single large frontend surface (`chat.js`) still benefits from ongoing modularization.

## 10) Success Criteria

- High-confidence test pass on every substantial change (`tests/run_all_tests.sh`).
- No regressions in direct/group parity for core chat flows.
- Documentation remains synchronized with current architecture and endpoint organization.

## 11) Phase Status Snapshot

Completed:
- A, B, C, D, E, E.1, E.2, F, F.5, F.6, G, H

In progress:
- I (partially complete)

Planned:
- J, J.2

Source of truth for detailed task lines: `docs/TASKS.md`.
