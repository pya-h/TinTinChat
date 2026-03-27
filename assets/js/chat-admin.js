(function () {
    "use strict";

    let adminStickerSettings = [];
    let adminUsersList = [];
    let blockedUsersList = [];

    const escapeHtml = (str) => window.ChatUtils.escapeHtml(str);
    const formatFileSize = (bytes) => window.MediaCacheService.formatFileSize(bytes);

    /* ── Sticker Management ── */

    function renderAdminStickerSettings() {
        const container = document.getElementById("settingsAdminStickerList");
        if (!container) return;

        container.innerHTML = "";
        if (!Array.isArray(adminStickerSettings) || !adminStickerSettings.length) {
            container.innerHTML = '<div class="chat-ui-admin-empty">No stickers available.</div>';
            return;
        }

        adminStickerSettings.forEach((sticker) => {
            const row = document.createElement("label");
            row.className = "chat-ui-admin-item";
            row.innerHTML = `
                <span class="chat-ui-admin-item-preview-wrap">
                    <img class="chat-ui-admin-item-preview" src="${escapeHtml(String(sticker.url || ""))}" alt="Sticker ${Number(sticker.id || 0)}">
                </span>
                <span class="chat-ui-admin-item-meta">
                    <span class="chat-ui-admin-item-title">Sticker #${Number(sticker.id || 0)}</span>
                    <span class="chat-ui-admin-item-subtitle">Uploaded by ${escapeHtml(String(sticker.uploaded_by_username || "Unknown"))}</span>
                </span>
                <span class="chat-ui-admin-item-toggle">
                    <input type="checkbox" ${sticker.is_admin_only ? "checked" : ""} data-sticker-id="${Number(sticker.id || 0)}">
                    <span>Admin-only</span>
                </span>
            `;

            const toggle = row.querySelector('input[type="checkbox"]');
            toggle?.addEventListener("change", async (event) => {
                const target = event.target;
                const stickerId = Number(target?.dataset?.stickerId || 0);
                if (!stickerId) return;
                target.disabled = true;
                try {
                    const response = await window.ApiService.jsonOk("api/admin/stickers/toggle_admin_only.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...window.getCsrfHeaders() },
                        body: JSON.stringify({ sticker_id: stickerId, is_admin_only: Boolean(target.checked) }),
                    });
                    const newValue = Boolean(response?.is_admin_only);
                    adminStickerSettings = adminStickerSettings.map((item) =>
                        Number(item.id) === stickerId ? { ...item, is_admin_only: newValue } : item
                    );
                    target.checked = newValue;
                    window.setComposerStatus("Sticker visibility updated", "success");
                } catch (error) {
                    target.checked = !target.checked;
                    showModal("Sticker Update Failed", error?.message || "Unable to update sticker visibility.", "error");
                    window.setComposerStatus("Unable to update sticker visibility", "error");
                } finally {
                    target.disabled = false;
                }
            });

            container.appendChild(row);
        });
    }

    async function loadAdminStickerSettings() {
        const container = document.getElementById("settingsAdminStickerList");
        if (!window.CURRENT_USER_IS_ADMIN || !container) return;

        container.innerHTML = '<div class="chat-ui-admin-empty">Loading stickers...</div>';
        try {
            const response = await window.ApiService.jsonOk("api/admin/stickers/fetch.php?limit=300");
            adminStickerSettings = Array.isArray(response?.stickers) ? response.stickers : [];
            renderAdminStickerSettings();
        } catch (error) {
            container.innerHTML = `<div class="chat-ui-admin-empty">${escapeHtml(String(error?.message || "Unable to load stickers."))}</div>`;
        }
    }

    /* ── User Management (admin role + ban) ── */

    function renderAdminUsersSettings() {
        const container = document.getElementById("settingsAdminUsersList");
        if (!container) return;

        container.innerHTML = "";
        if (!Array.isArray(adminUsersList) || !adminUsersList.length) {
            container.innerHTML = '<div class="chat-ui-admin-empty">No users available.</div>';
            return;
        }

        adminUsersList.forEach((user) => {
            const row = document.createElement("div");
            row.className = "chat-ui-admin-user-row";
            const isBanned = user.banned_at != null;

            row.innerHTML = `
                <span class="chat-ui-admin-item-meta">
                    <span class="chat-ui-admin-item-title">
                        ${escapeHtml(String(user.username || "Unknown"))}${user.is_superuser ? ' <span class="chat-ui-admin-badge badge-superuser">superuser</span>' : ""}
                    </span>
                    <span class="chat-ui-admin-item-subtitle">${user.last_login ? `Last login: ${escapeHtml(String(user.last_login))}` : "No login data"}</span>
                </span>
                <span class="chat-ui-admin-user-actions">
                    <label class="chat-ui-admin-item-toggle" title="Admin role">
                        <input type="checkbox" class="admin-role-toggle" ${user.is_admin ? "checked" : ""} ${user.can_edit ? "" : "disabled"} data-user-id="${Number(user.id || 0)}">
                        <span>Admin</span>
                    </label>
                    <label class="chat-ui-admin-item-toggle" title="${isBanned ? "Unban" : "Ban"} this user">
                        <input type="checkbox" class="admin-ban-toggle toggle-danger" ${isBanned ? "checked" : ""} ${user.can_edit ? "" : "disabled"} data-user-id="${Number(user.id || 0)}">
                        <span>Banned</span>
                    </label>
                </span>
            `;

            const adminToggle = row.querySelector(".admin-role-toggle");
            adminToggle?.addEventListener("change", async (event) => {
                const target = event.target;
                const targetUserId = Number(target?.dataset?.userId || 0);
                if (!targetUserId) return;
                target.disabled = true;
                try {
                    const response = await window.ApiService.jsonOk("api/admin/users/set_admin.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...window.getCsrfHeaders() },
                        body: JSON.stringify({ user_id: targetUserId, is_admin: Boolean(target.checked) }),
                    });
                    const newValue = Boolean(response?.is_admin);
                    adminUsersList = adminUsersList.map((item) =>
                        Number(item.id) === targetUserId ? { ...item, is_admin: newValue } : item
                    );
                    target.checked = newValue;
                    window.setComposerStatus("Admin role updated", "success");
                } catch (error) {
                    target.checked = !target.checked;
                    showModal("Role Update Failed", error?.message || "Unable to update admin role.", "error");
                    window.setComposerStatus("Unable to update admin role", "error");
                } finally {
                    target.disabled = !user.can_edit;
                }
            });

            const banToggle = row.querySelector(".admin-ban-toggle");
            banToggle?.addEventListener("change", async (event) => {
                const target = event.target;
                const targetUserId = Number(target?.dataset?.userId || 0);
                if (!targetUserId) return;

                const wantBan = Boolean(target.checked);
                const action = wantBan ? "ban" : "unban";
                const targetUsername = String(user.username || "this user");

                const confirmed = window.confirm(`${wantBan ? "Ban" : "Unban"} ${targetUsername}? ${wantBan ? "They will be logged out and unable to log in." : "They will be able to log in again."}`);
                if (!confirmed) {
                    target.checked = !target.checked;
                    return;
                }

                target.disabled = true;
                try {
                    const response = await window.ApiService.jsonOk("api/admin/users/set_ban.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...window.getCsrfHeaders() },
                        body: JSON.stringify({ user_id: targetUserId, ban: wantBan }),
                    });
                    const newBannedAt = response?.banned_at ?? null;
                    adminUsersList = adminUsersList.map((item) =>
                        Number(item.id) === targetUserId ? { ...item, banned_at: newBannedAt } : item
                    );
                    target.checked = newBannedAt != null;
                    window.setComposerStatus(`${targetUsername} ${newBannedAt ? "banned" : "unbanned"}`, "success");
                } catch (error) {
                    target.checked = !target.checked;
                    showModal(`${action === "ban" ? "Ban" : "Unban"} Failed`, error?.message || `Unable to ${action} user.`, "error");
                } finally {
                    target.disabled = !user.can_edit;
                }
            });

            container.appendChild(row);
        });
    }

    async function loadAdminUsersSettings() {
        const container = document.getElementById("settingsAdminUsersList");
        if (!window.CURRENT_USER_IS_SUPERUSER || !container) return;

        container.innerHTML = '<div class="chat-ui-admin-empty">Loading users...</div>';
        try {
            const response = await window.ApiService.jsonOk("api/admin/users/list.php");
            adminUsersList = Array.isArray(response?.users) ? response.users : [];
            renderAdminUsersSettings();
        } catch (error) {
            container.innerHTML = `<div class="chat-ui-admin-empty">${escapeHtml(String(error?.message || "Unable to load users."))}</div>`;
        }
    }

    async function refreshAdminSettingsData() {
        if (!window.CURRENT_USER_IS_ADMIN) return;
        await loadAdminStickerSettings();
        if (window.CURRENT_USER_IS_SUPERUSER) {
            await loadAdminUsersSettings();
            await loadAdminAnnouncements();
        }
    }

    /* ── Announcements (superuser) ── */

    let adminAnnouncementsList = [];

    function formatAdminAnnouncementTime(dateStr) {
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
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }

    function renderAdminAnnouncements() {
        const container = document.getElementById("settingsAdminAnnouncementsList");
        if (!container) return;
        container.innerHTML = "";
        if (!adminAnnouncementsList.length) {
            container.innerHTML = '<div class="chat-ui-admin-empty"><i class="far fa-folder-open me-2"></i>No announcements posted yet.</div>';
            return;
        }
        adminAnnouncementsList.forEach((a, i) => {
            const row = document.createElement("div");
            row.className = "chat-ui-announcement-item";
            row.style.animationDelay = `${i * 0.05}s`;
            row.innerHTML = `
                <div class="chat-ui-announcement-item-content">
                    <div class="chat-ui-announcement-item-title">${escapeHtml(String(a.title || ""))}</div>
                    <div class="chat-ui-announcement-item-body">${escapeHtml(String(a.body || "")).replace(/\n/g, "<br>")}</div>
                    <div class="chat-ui-announcement-item-meta">
                        <span class="chat-ui-announcement-item-date"><i class="far fa-clock me-1"></i>${formatAdminAnnouncementTime(a.created_at)}</span>
                        <span class="chat-ui-announcement-item-author">${escapeHtml(String(a.author || ""))}</span>
                    </div>
                </div>
                <button type="button" class="chat-ui-announcement-delete-btn" title="Delete announcement">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            const delBtn = row.querySelector(".chat-ui-announcement-delete-btn");
            delBtn?.addEventListener("click", async () => {
                if (!window.confirm("Delete this announcement?")) return;
                row.classList.add("chat-ui-announcement-item-removing");
                delBtn.disabled = true;
                try {
                    await window.ApiService.jsonOk("api/admin/announcements/delete.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...window.getCsrfHeaders() },
                        body: JSON.stringify({ id: Number(a.id) }),
                    });
                    setTimeout(() => {
                        adminAnnouncementsList = adminAnnouncementsList.filter((x) => x.id !== a.id);
                        renderAdminAnnouncements();
                    }, 300);
                    window.setComposerStatus("Announcement deleted", "success");
                } catch (error) {
                    row.classList.remove("chat-ui-announcement-item-removing");
                    delBtn.disabled = false;
                    showModal("Delete Failed", error?.message || "Unable to delete announcement.", "error");
                }
            });
            container.appendChild(row);
        });
    }

    async function loadAdminAnnouncements() {
        const container = document.getElementById("settingsAdminAnnouncementsList");
        if (!container) return;
        container.innerHTML = '<div class="chat-ui-admin-empty">Loading announcements...</div>';
        try {
            const response = await window.ApiService.jsonOk("api/admin/announcements/fetch.php");
            adminAnnouncementsList = Array.isArray(response?.announcements) ? response.announcements : [];
            renderAdminAnnouncements();
        } catch (error) {
            container.innerHTML = `<div class="chat-ui-admin-empty">${escapeHtml(String(error?.message || "Unable to load announcements."))}</div>`;
        }
    }

    function bindAnnouncementEvents() {
        const createBtn = document.getElementById("announcementCreateBtn");
        const titleInput = document.getElementById("announcementTitleInput");
        const bodyInput = document.getElementById("announcementBodyInput");
        const refreshBtn = document.getElementById("settingsAdminRefreshAnnouncementsBtn");
        const titleCounter = document.getElementById("announcementTitleCharCount");
        const bodyCounter = document.getElementById("announcementBodyCharCount");

        function updateCharCount(input, counter, max) {
            if (!input || !counter) return;
            const len = input.value.length;
            counter.textContent = `${len}/${max}`;
            counter.classList.toggle("announcement-char-count-warn", len > max * 0.9);
        }
        titleInput?.addEventListener("input", () => updateCharCount(titleInput, titleCounter, 200));
        bodyInput?.addEventListener("input", () => updateCharCount(bodyInput, bodyCounter, 5000));

        createBtn?.addEventListener("click", async () => {
            const title = titleInput?.value.trim() || "";
            const body = bodyInput?.value.trim() || "";
            if (!title || !body) {
                showModal("Missing Fields", "Both title and body are required.", "warning");
                return;
            }
            createBtn.disabled = true;
            createBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Publishing...';
            try {
                await window.ApiService.jsonOk("api/admin/announcements/create.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...window.getCsrfHeaders() },
                    body: JSON.stringify({ title, body }),
                });
                titleInput.value = "";
                bodyInput.value = "";
                if (titleCounter) titleCounter.textContent = "0/200";
                if (bodyCounter) bodyCounter.textContent = "0/5000";
                titleCounter?.classList.remove("announcement-char-count-warn");
                bodyCounter?.classList.remove("announcement-char-count-warn");
                createBtn.innerHTML = '<i class="fas fa-check me-1"></i>Published!';
                createBtn.classList.add("announcement-post-btn-success");
                setTimeout(() => {
                    createBtn.classList.remove("announcement-post-btn-success");
                    createBtn.disabled = false;
                    createBtn.innerHTML = '<i class="fas fa-paper-plane me-1"></i>Publish';
                }, 1500);
                await loadAdminAnnouncements();
                window.setComposerStatus("Announcement posted", "success");
            } catch (error) {
                createBtn.disabled = false;
                createBtn.innerHTML = '<i class="fas fa-paper-plane me-1"></i>Publish';
                showModal("Post Failed", error?.message || "Unable to post announcement.", "error");
            }
        });

        refreshBtn?.addEventListener("click", async () => {
            refreshBtn.classList.add("announcement-refresh-spinning");
            await loadAdminAnnouncements();
            setTimeout(() => refreshBtn.classList.remove("announcement-refresh-spinning"), 500);
        });
    }

    /* ── Blocked Users ── */

    function renderBlockedUsersSettings() {
        const container = document.getElementById("settingsBlockedUsersList");
        if (!container) return;

        container.innerHTML = "";
        if (!Array.isArray(blockedUsersList) || !blockedUsersList.length) {
            container.innerHTML = '<div class="chat-ui-admin-empty">No blocked users.</div>';
            return;
        }

        blockedUsersList.forEach((user) => {
            const row = document.createElement("div");
            row.className = "chat-ui-blocked-item";
            row.dataset.userId = Number(user.id || 0);
            row.innerHTML = `
                <div class="chat-ui-blocked-item-avatar-wrap">
                    <img class="chat-ui-blocked-item-avatar" src="${window.buildAvatarUrl({ userId: Number(user.id || 0), username: String(user.username || ""), size: 40 })}" alt="" />
                </div>
                <span class="chat-ui-blocked-item-meta">
                    <span class="chat-ui-blocked-item-name">${escapeHtml(String(user.username || "Unknown"))}</span>
                    <span class="chat-ui-blocked-item-date">Blocked ${user.blocked_at ? escapeHtml(String(user.blocked_at)) : ""}</span>
                </span>
                <button type="button" class="btn btn-sm btn-outline-warning chat-ui-blocked-unblock-btn" title="Unblock ${escapeHtml(String(user.username || ""))}">
                    <i class="fas fa-user-check me-1"></i>Unblock
                </button>
            `;

            const unblockBtn = row.querySelector(".chat-ui-blocked-unblock-btn");
            unblockBtn?.addEventListener("click", async () => {
                const targetUserId = Number(user.id || 0);
                const targetUsername = String(user.username || "this user");
                if (!targetUserId) return;

                const confirmed = window.confirm(`Unblock ${targetUsername}?`);
                if (!confirmed) return;

                const originalLabel = unblockBtn.innerHTML;
                unblockBtn.disabled = true;
                unblockBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>...';

                try {
                    await window.ApiService.jsonOk("api/users/unblock.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", ...window.getCsrfHeaders() },
                        body: JSON.stringify({ target_user_id: targetUserId }),
                    });

                    blockedUsersList = blockedUsersList.filter((u) => Number(u.id) !== targetUserId);
                    renderBlockedUsersSettings();
                    window.setComposerStatus(`${targetUsername} unblocked`, "success");
                } catch (error) {
                    unblockBtn.innerHTML = originalLabel;
                    unblockBtn.disabled = false;
                    showModal("Unblock Failed", error?.message || "Unable to unblock user.", "error");
                }
            });

            container.appendChild(row);
        });
    }

    async function loadBlockedUsersSettings() {
        const container = document.getElementById("settingsBlockedUsersList");
        if (!container) return;

        container.innerHTML = '<div class="chat-ui-admin-empty">Loading blocked users...</div>';
        try {
            const response = await window.ApiService.jsonOk("api/users/list_blocked.php");
            blockedUsersList = Array.isArray(response?.blocked_users) ? response.blocked_users : [];
            renderBlockedUsersSettings();
        } catch (error) {
            container.innerHTML = `<div class="chat-ui-admin-empty">${escapeHtml(String(error?.message || "Unable to load blocked users."))}</div>`;
        }
    }

    /* ── Media Cleanup ── */

    function getMediaCleanupParams() {
        const days = Number(document.getElementById("mediaCleanupDays")?.value || 0);
        const maxSizeMB = Number(document.getElementById("mediaCleanupMaxSize")?.value || 0);
        if (days < 1 || maxSizeMB <= 0) {
            showModal("Invalid Input", "Please provide valid values for days and file size.", "warning");
            return null;
        }
        return { days, maxSizeMB, maxSizeBytes: Math.round(maxSizeMB * 1024 * 1024) };
    }

    async function fetchMediaAnalysis(days, maxSizeBytes) {
        return window.ApiService.jsonOk(
            `api/admin/media_analyze.php?older_than_days=${days}&max_size_bytes=${maxSizeBytes}`,
            { method: "GET" }
        );
    }

    function buildAnalysisHtml(stats, days, maxSizeMB) {
        const typeLabels = { image: "Images", voice: "Voice", file: "Files", video: "Videos" };
        const typeIcons = { image: "fa-image", voice: "fa-microphone", file: "fa-file", video: "fa-video" };

        let html = '<div class="media-analysis">';

        // Summary row
        html += '<div class="media-analysis-summary">';
        html += `<div class="media-analysis-stat">
            <div class="media-analysis-stat-value">${stats.total_files}</div>
            <div class="media-analysis-stat-label">Files</div>
        </div>`;
        html += `<div class="media-analysis-stat">
            <div class="media-analysis-stat-value">${formatFileSize(stats.total_size)}</div>
            <div class="media-analysis-stat-label">To free</div>
        </div>`;
        html += '</div>';

        // Criteria
        html += `<div class="media-analysis-criteria">Older than <strong>${days}</strong> days &amp; larger than <strong>${maxSizeMB} MB</strong> &mdash; before ${stats.cutoff_date}</div>`;

        // Breakdown by type
        const types = stats.by_type || {};
        const hasBreakdown = Object.values(types).some(t => t.count > 0);
        if (hasBreakdown) {
            html += '<div class="media-analysis-section-title">By type</div>';
            html += '<div class="media-analysis-types">';
            for (const [type, data] of Object.entries(types)) {
                if (data.count === 0) continue;
                html += `<div class="media-analysis-type-row">
                    <i class="fas ${typeIcons[type] || "fa-file"} media-analysis-type-icon"></i>
                    <span class="media-analysis-type-label">${typeLabels[type] || type}</span>
                    <span class="media-analysis-type-count">${data.count}</span>
                    <span class="media-analysis-type-size">${formatFileSize(data.size)}</span>
                </div>`;
            }
            html += '</div>';
        }

        // Largest file
        if (stats.largest_file) {
            const lf = stats.largest_file;
            html += '<div class="media-analysis-section-title">Largest file</div>';
            html += `<div class="media-analysis-largest">
                <i class="fas ${typeIcons[lf.type] || "fa-file"} media-analysis-type-icon"></i>
                <span>${formatFileSize(lf.size)} ${typeLabels[lf.type] || lf.type} by <strong>${lf.sender_username}</strong></span>
                <span class="media-analysis-date">${lf.created_at}</span>
            </div>`;
        }

        // Top users
        if (stats.top_users && stats.top_users.length > 0) {
            html += '<div class="media-analysis-section-title">Top users by size</div>';
            html += '<div class="media-analysis-users">';
            for (const u of stats.top_users) {
                const pct = stats.total_size > 0 ? Math.round((u.size / stats.total_size) * 100) : 0;
                html += `<div class="media-analysis-user-row">
                    <span class="media-analysis-user-name">${u.username}</span>
                    <span class="media-analysis-user-count">${u.count} files</span>
                    <span class="media-analysis-user-size">${formatFileSize(u.size)}</span>
                    <div class="media-analysis-bar-track"><div class="media-analysis-bar-fill" style="width:${pct}%"></div></div>
                </div>`;
            }
            html += '</div>';
        }

        // Extra info
        if (stats.already_purged > 0 || stats.missing_from_disk > 0) {
            html += '<div class="media-analysis-extra">';
            if (stats.already_purged > 0) {
                html += `<span><i class="fas fa-check-circle"></i> ${stats.already_purged} already purged</span>`;
            }
            if (stats.missing_from_disk > 0) {
                html += `<span><i class="fas fa-ghost"></i> ${stats.missing_from_disk} missing from disk</span>`;
            }
            html += '</div>';
        }

        if (stats.total_files === 0) {
            html += '<div class="media-analysis-empty"><i class="fas fa-check-circle"></i> No files match these criteria.</div>';
        }

        html += '</div>';
        return html;
    }

    function bindMediaCleanupEvents() {
        const mediaAnalyzeBtn = document.getElementById("mediaAnalyzeBtn");
        const mediaCleanupBtn = document.getElementById("mediaCleanupBtn");
        const mediaCleanupResult = document.getElementById("mediaCleanupResult");

        // ── Analyze button ──
        mediaAnalyzeBtn?.addEventListener("click", async () => {
            const p = getMediaCleanupParams();
            if (!p) return;

            mediaAnalyzeBtn.disabled = true;
            mediaAnalyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Analyzing...';

            try {
                const stats = await fetchMediaAnalysis(p.days, p.maxSizeBytes);
                const html = buildAnalysisHtml(stats, p.days, p.maxSizeMB);
                showModalHtml("Storage Analysis", html, "info");
            } catch (error) {
                showModal("Analysis Failed", error?.message || "Unable to analyze media.", "error");
            } finally {
                mediaAnalyzeBtn.disabled = false;
                mediaAnalyzeBtn.innerHTML = '<i class="fas fa-chart-bar me-1"></i>Analyze';
            }
        });

        // ── Clean up button (now with preview) ──
        mediaCleanupBtn?.addEventListener("click", async () => {
            const p = getMediaCleanupParams();
            if (!p) return;

            mediaCleanupBtn.disabled = true;
            mediaCleanupBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Analyzing...';
            if (mediaCleanupResult) { mediaCleanupResult.style.display = "none"; }

            try {
                // Step 1: fetch analysis first
                const stats = await fetchMediaAnalysis(p.days, p.maxSizeBytes);

                if (stats.total_files === 0) {
                    showModal("Nothing to clean", "No files match the specified criteria.", "info");
                    return;
                }

                // Step 2: show preview and confirm
                let html = buildAnalysisHtml(stats, p.days, p.maxSizeMB);
                html += `<div class="media-analysis-confirm">
                    <div class="media-analysis-confirm-warning"><i class="fas fa-exclamation-triangle"></i> This action cannot be undone.</div>
                    <button type="button" id="mediaCleanupConfirmBtn" class="btn btn-sm btn-danger">
                        <i class="fas fa-broom me-1"></i>Confirm cleanup
                    </button>
                </div>`;
                showModalHtml("Confirm Cleanup", html, "warning");

                // Step 3: wait for confirm click inside modal
                const confirmBtn = document.getElementById("mediaCleanupConfirmBtn");
                if (confirmBtn) {
                    confirmBtn.addEventListener("click", async () => {
                        confirmBtn.disabled = true;
                        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Cleaning...';

                        try {
                            const result = await window.ApiService.jsonOk("api/admin/media_cleanup.php", {
                                method: "POST",
                                headers: { "Content-Type": "application/json", ...window.getCsrfHeaders() },
                                body: JSON.stringify({ older_than_days: p.days, max_size_bytes: p.maxSizeBytes }),
                            });
                            closeModal();
                            const freed = formatFileSize(result.freed_bytes || 0);
                            const msg = result.deleted_count > 0
                                ? `Deleted ${result.deleted_count} file(s), freed ${freed}.${result.failed_count ? ` ${result.failed_count} failed.` : ""}`
                                : "No matching files found.";
                            if (mediaCleanupResult) {
                                mediaCleanupResult.textContent = msg;
                                mediaCleanupResult.style.display = "block";
                            }
                            window.setComposerStatus(msg, "success");
                        } catch (err) {
                            closeModal();
                            showModal("Cleanup Failed", err?.message || "Unable to run media cleanup.", "error");
                        }
                    });
                }
            } catch (error) {
                showModal("Analysis Failed", error?.message || "Unable to analyze media.", "error");
            } finally {
                mediaCleanupBtn.disabled = false;
                mediaCleanupBtn.innerHTML = '<i class="fas fa-broom me-1"></i>Clean up';
            }
        });
    }

    /* ── Admin Event Bindings ── */

    function bindAdminEvents() {
        const settingsAdminRefreshStickersBtn = document.getElementById("settingsAdminRefreshStickersBtn");
        const settingsAdminRefreshUsersBtn = document.getElementById("settingsAdminRefreshUsersBtn");
        const settingsRefreshBlockedBtn = document.getElementById("settingsRefreshBlockedBtn");
        settingsAdminRefreshStickersBtn?.addEventListener("click", async () => {
            await loadAdminStickerSettings();
        });

        settingsAdminRefreshUsersBtn?.addEventListener("click", async () => {
            await loadAdminUsersSettings();
        });

        settingsRefreshBlockedBtn?.addEventListener("click", async () => {
            await loadBlockedUsersSettings();
        });

        bindMediaCleanupEvents();
        bindAnnouncementEvents();
    }

    /* ── Init ── */

    window.AdminPanel = {
        init: function () {
            bindAdminEvents();
        },
        refreshAdminSettingsData: refreshAdminSettingsData,
        loadBlockedUsersSettings: loadBlockedUsersSettings,
        loadAdminUsersSettings: loadAdminUsersSettings,
    };
})();
