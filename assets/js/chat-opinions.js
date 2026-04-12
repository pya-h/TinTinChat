/**
 * Opinions Panel
 * Extracted from chat.js for readability.
 *
 * Dependencies (from chat.js global scope):
 *   pushUiBackLayer, removeUiBackLayer, requestUiLayerClose, UI_BACK_LAYER_KEYS,
 *   escapeHtml, startsWithRtlScriptChars, getCsrfHeaders,
 *   showPromptModal, showConfirmModal, showModal
 */

const opinionsOverlay = document.getElementById("opinionsOverlay");
const opinionsBody = document.getElementById("opinionsBody");
const opinionsCount = document.getElementById("opinionsCount");
let opinionsPanelCache = null; // cached fetch result

async function openOpinionsPanel() {
    if (!opinionsOverlay) return;
    opinionsOverlay.hidden = false;
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.opinions,
        ({ fromHistory = false } = {}) => {
            closeOpinionsPanel({ fromHistory });
        },
    );
    requestAnimationFrame(() => opinionsOverlay.classList.add("visible"));
    try {
        const res = await window.ApiService.jsonOk("api/opinions/fetch.php");
        opinionsPanelCache = res;
        renderOpinionsUserList(res.grouped || []);
    } catch {
        if (opinionsBody)
            opinionsBody.innerHTML =
                '<div class="opinions-empty"><i class="fas fa-pen-fancy"></i>Unable to load opinions.</div>';
    }
}

function closeOpinionsPanel({ fromHistory = false } = {}) {
    if (!opinionsOverlay) return;
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.opinions, () => {
            closeOpinionsPanel({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.opinions);
    opinionsOverlay.classList.remove("visible");
    setTimeout(() => {
        if (!opinionsOverlay.classList.contains("visible")) {
            opinionsOverlay.hidden = true;
        }
    }, 250);
}

function renderOpinionsUserList(grouped) {
    if (!opinionsBody) return;
    const totalOpinions = grouped.reduce((s, g) => s + g.count, 0);
    if (opinionsCount)
        opinionsCount.textContent = totalOpinions
            ? `${grouped.length} user${grouped.length > 1 ? "s" : ""}, ${totalOpinions} note${totalOpinions > 1 ? "s" : ""}`
            : "";
    opinionsBody.innerHTML = "";
    // Remove back button if present
    const existingBack = opinionsOverlay?.querySelector(".opinions-back-btn");
    if (existingBack) existingBack.remove();

    if (!grouped.length) {
        opinionsBody.innerHTML =
            '<div class="opinions-empty"><i class="fas fa-pen-fancy"></i>No opinions written yet.<br>Open a chat details panel to add one.</div>';
        return;
    }
    grouped.forEach((group, idx) => {
        const item = document.createElement("div");
        item.className = "opinions-item opinions-user-item";
        item.style.animationDelay = `${idx * 0.04}s`;
        const username = escapeHtml(group.target_username || "Unknown");
        const avatarUrl =
            "api/users/get_avatar.php?user_id=" +
            (group.target_user_id || 0) +
            "&size=64";
        const preview = escapeHtml(
            String(group.latest_body || "").substring(0, 80),
        );
        const previewDir = startsWithRtlScriptChars(group.latest_body || "", 2)
            ? "rtl"
            : "ltr";
        item.innerHTML = `
            <div class="opinions-item-avatar">
                <img src="${avatarUrl}" alt="${username}" loading="lazy">
            </div>
            <div class="opinions-item-content">
                <div class="opinions-item-username">${username}</div>
                <div class="opinions-item-text" dir="${previewDir}">${preview}${(group.latest_body || "").length > 80 ? "..." : ""}</div>
                <div class="opinions-item-meta">
                    <span>${group.count} note${group.count > 1 ? "s" : ""}</span>
                </div>
            </div>
            <div class="opinions-item-chevron"><i class="fas fa-chevron-right"></i></div>
        `;
        item.addEventListener("click", () => {
            openOpinionsForUser(
                Number(group.target_user_id),
                group.target_username,
            );
        });
        opinionsBody.appendChild(item);
    });
}

async function openOpinionsForUser(targetUserId, targetUsername) {
    if (!opinionsBody) return;
    opinionsBody.innerHTML =
        '<div class="opinions-loading"><i class="fas fa-circle-notch fa-spin"></i><span>Loading...</span></div>';

    // Add back button to header
    let backBtn = opinionsOverlay?.querySelector(".opinions-back-btn");
    if (!backBtn) {
        backBtn = document.createElement("button");
        backBtn.type = "button";
        backBtn.className = "opinions-back-btn";
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        backBtn.title = "Back to users";
        const header = opinionsOverlay?.querySelector(".opinions-header");
        if (header) header.prepend(backBtn);
    }
    backBtn.onclick = () => {
        backBtn.remove();
        if (opinionsPanelCache) {
            renderOpinionsUserList(opinionsPanelCache.grouped || []);
        } else {
            openOpinionsPanel();
        }
    };

    if (opinionsCount)
        opinionsCount.textContent = escapeHtml(targetUsername || "User");

    try {
        const res = await window.ApiService.jsonOk(
            "api/opinions/fetch.php?target_user_id=" + targetUserId,
        );
        renderOpinionsDetailList(
            res.opinions || [],
            targetUserId,
            targetUsername,
        );
    } catch {
        opinionsBody.innerHTML =
            '<div class="opinions-empty"><i class="fas fa-pen-fancy"></i>Unable to load opinions.</div>';
    }
}

function renderOpinionsDetailList(opinions, targetUserId, targetUsername) {
    if (!opinionsBody) return;
    opinionsBody.innerHTML = "";

    if (!opinions.length) {
        opinionsBody.innerHTML =
            '<div class="opinions-empty"><i class="fas fa-pen-fancy"></i>No opinions about this user.</div>';
        return;
    }

    opinions.forEach((op, idx) => {
        const item = document.createElement("div");
        item.className = "opinions-item opinions-detail-item";
        item.style.animationDelay = `${idx * 0.04}s`;
        const date = op.updated_at || op.created_at || "";
        const dateStr = date ? new Date(date).toLocaleDateString() : "";
        const bodyDir = startsWithRtlScriptChars(op.body || "", 2)
            ? "rtl"
            : "ltr";
        item.innerHTML = `
            <div class="opinions-detail-body">
                <div class="opinions-item-text" dir="${bodyDir}">${escapeHtml(op.body || "")}</div>
                <div class="opinions-item-meta"><span>${dateStr}</span></div>
            </div>
            <div class="opinions-item-actions">
                <button type="button" class="opinions-item-action-btn edit-btn" title="Edit"><i class="fas fa-pen"></i></button>
                <button type="button" class="opinions-item-action-btn delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        item.querySelector(".edit-btn")?.addEventListener("click", async () => {
            const newText = await showPromptModal(
                "Edit Opinion",
                "Edit your opinion about " +
                    escapeHtml(targetUsername || "this user") +
                    ":",
                {
                    defaultValue: op.body || "",
                    maxLength: 500,
                    placeholder: "Your opinion...",
                },
            );
            if (newText === null || !newText.trim()) return;
            try {
                await window.ApiService.jsonOk("api/opinions/save.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...getCsrfHeaders(),
                    },
                    body: JSON.stringify({
                        target_user_id: targetUserId,
                        opinion_id: Number(op.id),
                        body: newText.trim(),
                    }),
                });
                openOpinionsForUser(targetUserId, targetUsername);
            } catch (e) {
                showModal(
                    "Error",
                    e?.message || "Failed to save opinion.",
                    "error",
                );
            }
        });
        item.querySelector(".delete-btn")?.addEventListener(
            "click",
            async () => {
                const confirmed = await showConfirmModal(
                    "Delete Opinion",
                    "Delete this opinion?",
                    { type: "warning", confirmLabel: "Delete" },
                );
                if (!confirmed) return;
                try {
                    await window.ApiService.jsonOk("api/opinions/delete.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...getCsrfHeaders(),
                        },
                        body: JSON.stringify({ opinion_id: Number(op.id) }),
                    });
                    // Refresh — re-fetch to update cache too
                    opinionsPanelCache = null;
                    const remaining = await window.ApiService.jsonOk(
                        "api/opinions/fetch.php?target_user_id=" + targetUserId,
                    );
                    if (!remaining.opinions?.length) {
                        // No opinions left for this user, go back to user list
                        const backBtn =
                            opinionsOverlay?.querySelector(
                                ".opinions-back-btn",
                            );
                        if (backBtn) backBtn.remove();
                        openOpinionsPanel();
                    } else {
                        renderOpinionsDetailList(
                            remaining.opinions,
                            targetUserId,
                            targetUsername,
                        );
                    }
                } catch {
                    /* ignore */
                }
            },
        );
        opinionsBody.appendChild(item);
    });
}
