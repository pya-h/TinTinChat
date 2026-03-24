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
        }
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

    function bindMediaCleanupEvents() {
        const mediaCleanupBtn = document.getElementById("mediaCleanupBtn");
        const mediaCleanupDays = document.getElementById("mediaCleanupDays");
        const mediaCleanupMaxSize = document.getElementById("mediaCleanupMaxSize");
        const mediaCleanupResult = document.getElementById("mediaCleanupResult");

        mediaCleanupBtn?.addEventListener("click", async () => {
            const days = Number(mediaCleanupDays?.value || 0);
            const maxSizeMB = Number(mediaCleanupMaxSize?.value || 0);
            if (days < 1 || maxSizeMB <= 0) {
                showModal("Invalid Input", "Please provide valid values for days and file size.", "warning");
                return;
            }
            const maxSizeBytes = Math.round(maxSizeMB * 1024 * 1024);
            const confirmed = window.confirm(
                `Delete all media files older than ${days} days and larger than ${maxSizeMB} MB? This cannot be undone.`
            );
            if (!confirmed) return;

            mediaCleanupBtn.disabled = true;
            mediaCleanupBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Cleaning...';
            if (mediaCleanupResult) { mediaCleanupResult.style.display = "none"; }

            try {
                const result = await window.ApiService.jsonOk("api/admin/media_cleanup.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...window.getCsrfHeaders() },
                    body: JSON.stringify({ older_than_days: days, max_size_bytes: maxSizeBytes }),
                });
                const freed = formatFileSize(result.freed_bytes || 0);
                const msg = result.deleted_count > 0
                    ? `Deleted ${result.deleted_count} file(s), freed ${freed}.${result.failed_count ? ` ${result.failed_count} failed.` : ""}`
                    : "No matching files found.";
                if (mediaCleanupResult) {
                    mediaCleanupResult.textContent = msg;
                    mediaCleanupResult.style.display = "block";
                }
                window.setComposerStatus(msg, "success");
            } catch (error) {
                showModal("Cleanup Failed", error?.message || "Unable to run media cleanup.", "error");
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
