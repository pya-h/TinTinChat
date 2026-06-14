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

    const CHANGELOG_LAST_UPDATED = "2026-04-14T00:00:00.000Z";

    const CHANGELOG_HTML = `
<ul class="changelog-list">
    <li class="changelog-item changelog-highlight">
        <span class="changelog-icon"><i class="fas fa-images"></i></span>
        <div>
            <strong>Send Multiple Photos as Albums</strong>
            <p>Select up to 10 photos at once and send them as a grouped album. Photos are displayed in a compact grid layout.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-search-plus"></i></span>
        <div>
            <strong>Photo Zoom</strong>
            <p>Tap any image to open a full-screen viewer with pinch-to-zoom and directional open/close animations.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-share"></i></span>
        <div>
            <strong>Forward Any Message Type</strong>
            <p>Multi-select and forward images, voice messages, videos, files &amp; music &mdash; not just text. Forwarded photo albums keep their grouping.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-spinner"></i></span>
        <div>
            <strong>Upload Progress &amp; Cancel</strong>
            <p>See a real-time progress bar when uploading photos, videos, voice messages and files. Cancel any upload in progress with one tap.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-layer-group"></i></span>
        <div>
            <strong>Select Group</strong>
            <p>Right-click (or long-press) a grouped photo and choose <em>Select Group</em> to instantly select all photos in that album.</p>
        </div>
    </li>
    <li class="changelog-item">
        <span class="changelog-icon"><i class="fas fa-sticky-note"></i></span>
        <div>
            <strong>User Notes &amp; Profile Details</strong>
            <p>Write multiple notes about any user from their profile details panel. View and manage all notes in the <em>Opinions</em> section.</p>
        </div>
    </li>
    <li class="changelog-item">
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
            <p><em>Double-click</em> a message to heart/unheart it. <em>Click</em>/<em>Long-press</em> (or right-click) to open the action menu. Tap a reply banner to scroll to the original.</p>
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
        setTimeout(() => { overlay.style.display = "none"; }, 500);
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
