# Known Performance Issues

## 1. Unbounded DOM Growth

**Severity:** Medium
**Component:** `chat.js` — message rendering

Messages are never removed from the DOM during a session. After extended chatting (30+ minutes of active conversation), hundreds or thousands of message nodes accumulate. This makes every DOM query, layout recalculation, and scroll operation progressively slower.

**Potential fix:** Implement a virtual scrolling / DOM recycling strategy that keeps only a window of visible messages (plus a buffer) in the DOM, removing off-screen messages and re-rendering them on scroll. The message data is already stored in `messageMetaById`, so re-rendering from cache is feasible. This would cap DOM size at a constant regardless of conversation length.

**Trade-offs to consider:**
- Scroll position restoration becomes more complex
- Search highlighting across off-screen messages needs a different approach
- Anchor-based viewport stabilization must account for recycled nodes

---

## 2. Object URL Accumulation (Memory Leak)

**Severity:** Medium
**Component:** `chat.js` — media decryption / rendering

`URL.createObjectURL()` is called when decrypted media (images, videos, audio, files) is rendered in the chat. The corresponding `URL.revokeObjectURL()` is never called, so the browser retains the underlying `Blob` data in memory indefinitely. Over a long session with many media messages, this accumulates significant memory pressure.

**Potential fix:** Track created Object URLs per message element. When a message is removed from the DOM (relevant once #1 is implemented), revoke its Object URLs. Alternatively, revoke URLs after the browser has loaded/cached the resource (e.g., on `<img>.onload` or `<video>.onloadeddata`), though this may break re-display if the element is scrolled back into view.

**Relation to #1:** Fixing unbounded DOM growth (#1) naturally creates the hook point for revoking Object URLs — when a message node is recycled out of the DOM, its Object URLs can be revoked at the same time.
