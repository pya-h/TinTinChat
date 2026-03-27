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

    const CHANGELOG_LAST_UPDATED = "2026-03-28T00:00:00.000Z";

    const CHANGELOG_HTML = `
<ul class="changelog-list">
    <li class="changelog-item changelog-highlight">
        <span class="changelog-icon"><i class="fas fa-music"></i></span>
        <div>
            <strong>Music Messages &amp; Playlists</strong>
            <p>Send and receive music files with a dedicated player. Your music messages are collected in a <em>Playlist</em> section for easy access.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-mouse-pointer"></i></span>
        <div>
            <strong>New Click &amp; Long-press Actions</strong>
            <p><em>Double-click</em> a message to heart/unheart it. <em>Click</em>/<em>Long-press</em> (or right-click) to open the message action menu. Tap on a reply banner to scroll to the original message.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-hand-pointer"></i></span>
        <div>
            <strong>Swipe Chat List (Mobile)</strong>
            <p>On mobile, <em>drag</em> the pull handle down to expand your chat list full-screen, and drag it back up to collapse &mdash; just like a notification shade.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-play-circle"></i></span>
        <div>
            <strong>Now Playing Bar</strong>
            <p>A floating mini-player appears at the top when a voice or music message is playing, so you can keep scrolling without losing your spot.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-bookmark"></i></span>
        <div>
            <strong>Saved Messages (You)</strong>
            <p>Forward any message to <em>Saved Messages</em> to keep it for later. Access it from the top of your chat list.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-bullhorn"></i></span>
        <div>
            <strong>Announcements</strong>
            <p>Important platform announcements now appear with a notification badge. Tap the bell icon in the header to view them.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-sliders-h"></i></span>
        <div>
            <strong>Voice Seek &amp; Drag</strong>
            <p>Drag on the voice message waveform to seek to any position in the recording.</p>
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
