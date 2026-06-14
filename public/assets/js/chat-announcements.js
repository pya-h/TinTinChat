/**
 * Announcements Panel
 * Extracted from chat.js for readability.
 *
 * Dependencies (from chat.js global scope):
 *   announcementsOverlay, announcementsBody, alertUnreadDot, alertPanelBtn,
 *   pushUiBackLayer, removeUiBackLayer, requestUiLayerClose, UI_BACK_LAYER_KEYS,
 *   getCsrfHeaders, ChatUtils, startsWithRtlScriptChars, LAST_READ_ANNOUNCEMENT_ID
 */

let announcementsCachedList = null;
let lastReadAnnouncementId =
    typeof LAST_READ_ANNOUNCEMENT_ID !== "undefined"
        ? Number(LAST_READ_ANNOUNCEMENT_ID) || 0
        : 0;

async function fetchAnnouncements() {
    try {
        const response = await window.ApiService.jsonOk(
            "api/admin/announcements/fetch.php",
        );
        return Array.isArray(response?.announcements)
            ? response.announcements
            : [];
    } catch {
        return [];
    }
}

function formatAnnouncementTime(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
}

function isAnnouncementNew(announcementId) {
    return Number(announcementId) > lastReadAnnouncementId;
}

function hasPersianChar(str) {
    return startsWithRtlScriptChars(str, 2);
}

function renderAnnouncementsPanel(list) {
    if (!announcementsBody) return;
    announcementsBody.innerHTML = "";
    const countEl = document.getElementById("announcementsCount");
    if (countEl) countEl.textContent = list.length ? `${list.length}` : "";
    if (!list.length) {
        announcementsBody.innerHTML = `
            <div class="announcements-empty">
                <div class="announcements-empty-icon"><i class="fas fa-bullhorn"></i></div>
                <div class="announcements-empty-title">No announcements yet</div>
                <div class="announcements-empty-sub">When the admin posts updates, they'll appear here.</div>
            </div>`;
        return;
    }
    list.forEach((a, i) => {
        const item = document.createElement("div");
        item.className = "announcements-item";
        item.style.animationDelay = `${i * 0.06}s`;
        const isNew = isAnnouncementNew(a.id);
        const authorInitial = (a.author || "?")[0].toUpperCase();
        const titleDir = hasPersianChar(a.title) ? "rtl" : "ltr";
        const bodyDir = hasPersianChar(a.body) ? "rtl" : "ltr";
        item.innerHTML = `
            ${isNew ? '<span class="announcements-new-badge">NEW</span>' : ""}
            <div class="announcements-item-title" dir="${titleDir}">${ChatUtils.escapeHtml(String(a.title || ""))}</div>
            <div class="announcements-item-body" dir="${bodyDir}">${ChatUtils.escapeHtml(String(a.body || "")).replace(/\n/g, "<br>")}</div>
            <div class="announcements-item-meta">
                <span class="announcements-item-author"><span class="announcements-author-avatar">${ChatUtils.escapeHtml(authorInitial)}</span>${ChatUtils.escapeHtml(String(a.author || ""))}</span>
                <span class="announcements-item-date"><i class="far fa-clock me-1"></i>${formatAnnouncementTime(a.created_at)}</span>
            </div>
        `;
        announcementsBody.appendChild(item);
    });
}

async function openAnnouncementsPanel() {
    if (!announcementsOverlay) return;
    announcementsOverlay.hidden = false;
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.announcements,
        ({ fromHistory = false } = {}) => {
            closeAnnouncementsPanel({ fromHistory });
        },
    );
    requestAnimationFrame(() => announcementsOverlay.classList.add("visible"));
    const list = await fetchAnnouncements();
    announcementsCachedList = list;
    renderAnnouncementsPanel(list);
    // Mark as seen — send the latest announcement ID
    const latestId = list.length ? Number(list[0].id) || 0 : 0;
    if (latestId > 0) {
        try {
            await window.ApiService.jsonOk(
                "api/users/dismiss_announcements.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...getCsrfHeaders(),
                    },
                    body: JSON.stringify({ last_announcement_id: latestId }),
                },
            );
            lastReadAnnouncementId = latestId;
            setAnnouncementUnreadState(false);
        } catch {
            /* best-effort — keep current unread state */
        }
    } else {
        setAnnouncementUnreadState(false);
    }
}

function closeAnnouncementsPanel({ fromHistory = false } = {}) {
    if (!announcementsOverlay) return;
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.announcements, () => {
            closeAnnouncementsPanel({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.announcements);
    announcementsOverlay.classList.remove("visible");
    setTimeout(() => {
        if (!announcementsOverlay.classList.contains("visible")) {
            announcementsOverlay.hidden = true;
        }
    }, 250);
}

function setAnnouncementUnreadState(hasUnread) {
    if (alertUnreadDot) alertUnreadDot.hidden = !hasUnread;
    const menuDot = document.getElementById("announcementsMenuDot");
    if (menuDot) menuDot.hidden = !hasUnread;
    if (alertPanelBtn) {
        alertPanelBtn.classList.toggle("alert-panel-btn-unread", hasUnread);
    }
}

async function checkAnnouncementUnread() {
    const list = await fetchAnnouncements();
    announcementsCachedList = list;
    if (!list.length) {
        setAnnouncementUnreadState(false);
        return;
    }
    const latestId = Number(list[0].id) || 0;
    setAnnouncementUnreadState(latestId > lastReadAnnouncementId);
}
