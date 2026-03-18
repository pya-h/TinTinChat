/**
 * Changelog / What's New Tip Modal
 *
 * Self-contained module that shows a changelog overlay when new features
 * have been added since the user last dismissed the modal.
 *
 * Dependencies (expected globals):
 *   - USER_TIPS_SEEN_AT  (set by dashboard.php inline script)
 *   - window.ApiService   (api-service.js)
 *   - window.getCsrfHeaders()  (exposed by chat.js)
 *
 * To add a new changelog entry:
 *   1. Add a new <li> item at the TOP of CHANGELOG_HTML.
 *   2. Move the "changelog-highlight" class to the new item.
 *   3. Update CHANGELOG_LAST_UPDATED to a date AFTER the deploy.
 */
(function initChangelog() {
    "use strict";

    const CHANGELOG_LAST_UPDATED = "2026-03-18T12:00:00Z";

    const CHANGELOG_HTML = `
<ul class="changelog-list">
    <li class="changelog-item changelog-highlight">
        <span class="changelog-icon"><i class="fas fa-hand-pointer"></i></span>
        <div>
            <strong>Swipe Gestures</strong>
            <p>Swipe right on any message to <em>reply</em> to it. Swipe left on your own messages to <em>edit</em> or <em>forward</em>. Works on both mobile and desktop (click-drag).</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-lightbulb"></i></span>
        <div>
            <strong>Ideas &amp; Feedback</strong>
            <p>Head to <em>Settings → Ideas</em> to submit feature requests or bug reports, and vote on others' ideas.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-bell"></i></span>
        <div>
            <strong>Browser Notifications</strong>
            <p>Enable in <em>Settings → General</em> to get desktop notifications for new messages even when the tab is in the background.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-ban"></i></span>
        <div>
            <strong>Block Users</strong>
            <p>You can now block/unblock users from their profile popup. Manage blocked users in <em>Settings → Account</em>.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-paint-brush"></i></span>
        <div>
            <strong>UI Refresh &amp; Improvements</strong>
            <p>Modernized design, smoother animations, improved dark mode, and better voice message waveforms.</p>
        </div>
    </li>
</ul>
<div class="changelog-hint">
    <i class="fas fa-info-circle"></i>
    Tip: Clear your browser's cache &amp; cookies so it fetches the latest version of the app.
</div>
`;

    const overlay = document.getElementById("changelogOverlay");
    const body = document.getElementById("changelogBody");
    const dismissBtn = document.getElementById("changelogDismissBtn");
    const closeBtn = document.getElementById("changelogCloseBtn");
    if (!overlay || !body || !dismissBtn) return;

    const changelogTs = new Date(CHANGELOG_LAST_UPDATED).getTime();
    const seenTs = (typeof USER_TIPS_SEEN_AT !== "undefined" && USER_TIPS_SEEN_AT)
        ? new Date(USER_TIPS_SEEN_AT).getTime()
        : 0;

    if (!Number.isNaN(changelogTs) && seenTs >= changelogTs) return;

    body.innerHTML = CHANGELOG_HTML;

    // Show after a short delay so the page loads first
    setTimeout(() => {
        overlay.style.display = "flex";
        requestAnimationFrame(() => overlay.classList.add("visible"));
    }, 1200);

    function dismiss() {
        overlay.classList.remove("visible");
        setTimeout(() => { overlay.style.display = "none"; }, 350);
        // Fire-and-forget server update
        try {
            const csrfHeaders = typeof window.getCsrfHeaders === "function"
                ? window.getCsrfHeaders()
                : (typeof CSRF_TOKEN === "string" && CSRF_TOKEN.length ? { "X-CSRF-Token": CSRF_TOKEN } : {});
            window.ApiService.jsonOk("api/users/dismiss_changelog.php", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...csrfHeaders },
                body: "{}",
            });
        } catch (e) { /* best-effort */ }
    }

    dismissBtn.addEventListener("click", dismiss);
    closeBtn?.addEventListener("click", dismiss);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) dismiss();
    });
})();
