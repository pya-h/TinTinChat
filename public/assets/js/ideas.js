/**
 * Ideas / Feedback Module
 *
 * Self-contained module for the Ideas & Feedback feature.
 * Handles listing, voting, deleting, and replying to ideas.
 *
 * Dependencies (expected globals):
 *   - CURRENT_USER_IS_SUPERUSER  (dashboard.php inline)
 *   - CURRENT_USER_ID             (dashboard.php inline)
 *   - window.ApiService            (api-service.js)
 *   - window.getCsrfHeaders()      (chat.js bridge)
 *   - window.setComposerStatus()   (chat.js bridge)
 *   - window.ChatUtils.escapeHtml  (chat-utils.js)
 *   - showModal()                   (modal.js — global)
 *
 * Exposes on window:
 *   - window.loadIdeasList(page)
 */
(function (global) {
    "use strict";

    /* ── DOM refs ── */
    const ideasList = document.getElementById("ideasList");
    const ideasSubmitForm = document.getElementById("ideasSubmitForm");
    const ideasBodyInput = document.getElementById("ideasBodyInput");

    /* ── Internal state ── */
    let ideasCurrentPage = 1;
    let ideasHasMore = false;

    /* ── Helpers pulled from other modules ── */
    function escapeHtml(text) {
        return global.ChatUtils?.escapeHtml
            ? global.ChatUtils.escapeHtml(text)
            : String(text || "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");
    }

    function getCsrfHeaders() {
        if (typeof global.getCsrfHeaders === "function") return global.getCsrfHeaders();
        if (typeof CSRF_TOKEN === "string" && CSRF_TOKEN.length) return { "X-CSRF-Token": CSRF_TOKEN };
        return {};
    }

    function setComposerStatus(message, type) {
        if (typeof global.setComposerStatus === "function") {
            global.setComposerStatus(message, type);
        }
    }

    /* ── Date formatting ── */
    function formatIdeaDate(dateStr) {
        try {
            const d = new Date(dateStr);
            if (Number.isNaN(d.getTime())) return dateStr || "";
            const now = new Date();
            const diffMs = now - d;
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 1) return "Just now";
            if (diffMins < 60) return `${diffMins}m ago`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours}h ago`;
            const diffDays = Math.floor(diffHours / 24);
            if (diffDays < 7) return `${diffDays}d ago`;
            return d.toLocaleDateString();
        } catch {
            return dateStr || "";
        }
    }

    /* ── Core functions ── */

    async function loadIdeasList(page) {
        if (page == null) page = ideasCurrentPage;
        if (!ideasList) return;
        ideasCurrentPage = page;
        try {
            const data = await global.ApiService.json(`api/ideas/fetch.php?page=${page}&limit=20`);
            if (!data || data.status !== "ok") throw new Error(data?.error || "Failed to load ideas");
            renderIdeasList(data.ideas || [], data.pagination || {});
        } catch (error) {
            ideasList.innerHTML = `<div class="chat-ui-admin-empty">${escapeHtml(String(error?.message || "Unable to load ideas."))}</div>`;
        }
    }

    function renderIdeasList(ideas, pagination) {
        if (!ideasList) return;
        ideasList.innerHTML = "";

        if (!ideas.length) {
            ideasList.innerHTML = '<div class="chat-ui-admin-empty">No ideas posted yet. Be the first!</div>';
            return;
        }

        const isSuperuser = Boolean(typeof CURRENT_USER_IS_SUPERUSER !== "undefined" && CURRENT_USER_IS_SUPERUSER);
        for (const idea of ideas) {
            const card = document.createElement("div");
            card.className = "idea-card";
            card.setAttribute("data-idea-id", idea.id);

            const score = Number(idea.likes || 0) - Number(idea.dislikes || 0);
            const myVote = Number(idea.my_vote || 0);
            const isOwn = Boolean(idea.is_own);

            const authorLabel = isSuperuser
                ? escapeHtml(idea.username || "Anonymous")
                : isOwn
                    ? "You"
                    : "Anonymous";

            let headerHtml = `<div class="idea-card-header">
                <span class="idea-card-author${isOwn ? " is-own" : ""}">${authorLabel}</span>
                <span class="idea-card-date">${formatIdeaDate(idea.created_at)}</span>
            </div>`;

            let bodyHtml = `<div class="idea-card-body">${escapeHtml(idea.body)}</div>`;

            let voteHtml = `<div class="idea-card-actions">
                <button type="button" class="idea-vote-btn idea-vote-like${myVote === 1 ? " active" : ""}" data-idea-id="${idea.id}" data-vote="1" aria-label="Like">
                    <i class="fas fa-thumbs-up"></i> <span class="idea-vote-count">${Number(idea.likes || 0)}</span>
                </button>
                <button type="button" class="idea-vote-btn idea-vote-dislike${myVote === -1 ? " active" : ""}" data-idea-id="${idea.id}" data-vote="-1" aria-label="Dislike">
                    <i class="fas fa-thumbs-down"></i> <span class="idea-vote-count">${Number(idea.dislikes || 0)}</span>
                </button>
                <span class="idea-score${score > 0 ? " positive" : score < 0 ? " negative" : ""}" title="Score">${score > 0 ? "+" : ""}${score}</span>`;

            const canDelete = isSuperuser || isOwn;
            if (canDelete) {
                voteHtml += `<button type="button" class="idea-delete-btn" data-idea-id="${idea.id}" aria-label="Delete idea" title="Delete"><i class="fas fa-trash-alt"></i></button>`;
            }
            voteHtml += `</div>`;

            let replyHtml = "";
            if (idea.admin_reply) {
                replyHtml = `<div class="idea-admin-reply">
                    <div class="idea-admin-reply-label"><i class="fas fa-crown me-1"></i>Paya</div>
                    <div class="idea-admin-reply-text">${escapeHtml(idea.admin_reply)}</div>
                </div>`;
            } else if (isSuperuser) {
                replyHtml = `<div class="idea-admin-reply-form" data-idea-id="${idea.id}">
                    <input type="text" class="form-control form-control-sm idea-reply-input" placeholder="Write reply..." maxlength="2000">
                    <button type="button" class="btn btn-sm btn-outline-primary idea-reply-submit-btn"><i class="fas fa-reply"></i></button>
                </div>`;
            }

            card.innerHTML = headerHtml + bodyHtml + voteHtml + replyHtml;
            ideasList.appendChild(card);
        }

        // Pagination
        ideasHasMore = Boolean(pagination.has_more);
        if (pagination.total_pages > 1) {
            const paginationWrap = document.createElement("div");
            paginationWrap.className = "ideas-pagination";
            if (ideasCurrentPage > 1) {
                const prevBtn = document.createElement("button");
                prevBtn.type = "button";
                prevBtn.className = "btn btn-sm btn-outline-secondary";
                prevBtn.textContent = "← Previous";
                prevBtn.addEventListener("click", () => loadIdeasList(ideasCurrentPage - 1));
                paginationWrap.appendChild(prevBtn);
            }
            const pageLabel = document.createElement("span");
            pageLabel.className = "ideas-page-label";
            pageLabel.textContent = `Page ${pagination.page} of ${pagination.total_pages}`;
            paginationWrap.appendChild(pageLabel);
            if (ideasHasMore) {
                const nextBtn = document.createElement("button");
                nextBtn.type = "button";
                nextBtn.className = "btn btn-sm btn-outline-secondary";
                nextBtn.textContent = "Next →";
                nextBtn.addEventListener("click", () => loadIdeasList(ideasCurrentPage + 1));
                paginationWrap.appendChild(nextBtn);
            }
            ideasList.appendChild(paginationWrap);
        }

        // Attach event listeners via delegation
        ideasList.removeEventListener("click", handleIdeasListClick);
        ideasList.addEventListener("click", handleIdeasListClick);
        ideasList.removeEventListener("keydown", handleIdeasListKeydown);
        ideasList.addEventListener("keydown", handleIdeasListKeydown);
    }

    /* ── Event handlers ── */

    function handleIdeasListKeydown(event) {
        if (event.key !== "Enter") return;
        const input = event.target.closest(".idea-reply-input");
        if (!input) return;
        event.preventDefault();
        const form = input.closest(".idea-admin-reply-form");
        const btn = form?.querySelector(".idea-reply-submit-btn");
        if (btn) btn.click();
    }

    async function handleIdeasListClick(event) {
        const voteBtn = event.target.closest(".idea-vote-btn");
        if (voteBtn) {
            event.preventDefault();
            if (voteBtn.disabled) return;
            const ideaId = Number(voteBtn.getAttribute("data-idea-id"));
            const voteValue = Number(voteBtn.getAttribute("data-vote"));
            const isAlreadyActive = voteBtn.classList.contains("active");
            await voteOnIdea(ideaId, isAlreadyActive ? 0 : voteValue);
            return;
        }

        const deleteBtn = event.target.closest(".idea-delete-btn");
        if (deleteBtn) {
            event.preventDefault();
            if (deleteBtn.disabled) return;
            if (!(await showConfirmModal("Delete Idea", "Delete this idea? This cannot be undone.", { type: "warning", confirmLabel: "Delete" }))) return;
            const ideaId = Number(deleteBtn.getAttribute("data-idea-id"));
            await deleteIdea(ideaId);
            return;
        }

        const replySubmitBtn = event.target.closest(".idea-reply-submit-btn");
        if (replySubmitBtn) {
            event.preventDefault();
            if (replySubmitBtn.disabled) return;
            const form = replySubmitBtn.closest(".idea-admin-reply-form");
            const ideaId = Number(form?.getAttribute("data-idea-id"));
            const input = form?.querySelector(".idea-reply-input");
            const replyText = String(input?.value || "").trim();
            if (!replyText) return;
            replySubmitBtn.disabled = true;
            if (input) input.disabled = true;
            try {
                await adminReplyToIdea(ideaId, replyText);
            } finally {
                replySubmitBtn.disabled = false;
                if (input) input.disabled = false;
            }
            return;
        }
    }

    async function voteOnIdea(ideaId, vote) {
        const card = ideasList?.querySelector(`.idea-card[data-idea-id="${ideaId}"]`);
        const allVoteBtns = card ? card.querySelectorAll(".idea-vote-btn") : [];
        allVoteBtns.forEach((b) => (b.disabled = true));
        try {
            const result = await global.ApiService.jsonOk("api/ideas/vote.php", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...getCsrfHeaders() },
                body: JSON.stringify({ idea_id: ideaId, vote }),
            });
            if (card && result) {
                const likes = Number(result.likes || 0);
                const dislikes = Number(result.dislikes || 0);
                const newScore = likes - dislikes;
                const myVote = result.my_vote;
                const likeBtn = card.querySelector(".idea-vote-like");
                const dislikeBtn = card.querySelector(".idea-vote-dislike");
                if (likeBtn) {
                    likeBtn.classList.toggle("active", myVote === 1);
                    const cnt = likeBtn.querySelector(".idea-vote-count");
                    if (cnt) cnt.textContent = String(likes);
                }
                if (dislikeBtn) {
                    dislikeBtn.classList.toggle("active", myVote === -1);
                    const cnt = dislikeBtn.querySelector(".idea-vote-count");
                    if (cnt) cnt.textContent = String(dislikes);
                }
                const scoreBadge = card.querySelector(".idea-score");
                if (scoreBadge) {
                    scoreBadge.textContent = (newScore > 0 ? "+" : "") + newScore;
                    scoreBadge.classList.toggle("positive", newScore > 0);
                    scoreBadge.classList.toggle("negative", newScore < 0);
                }
            }
        } catch (error) {
            showModal("Vote Failed", error?.message || "Unable to vote.", "error");
        } finally {
            allVoteBtns.forEach((b) => (b.disabled = false));
        }
    }

    async function deleteIdea(ideaId) {
        const card = ideasList?.querySelector(`.idea-card[data-idea-id="${ideaId}"]`);
        const deleteBtn = card?.querySelector(".idea-delete-btn");
        if (deleteBtn) deleteBtn.disabled = true;
        try {
            await global.ApiService.jsonOk("api/ideas/delete.php", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...getCsrfHeaders() },
                body: JSON.stringify({ idea_id: ideaId }),
            });
            if (card) {
                card.style.transition = "opacity 0.25s ease, transform 0.25s ease";
                card.style.opacity = "0";
                card.style.transform = "scale(0.96)";
                setTimeout(() => card.remove(), 260);
            }
            setComposerStatus("Idea deleted", "success");
        } catch (error) {
            if (deleteBtn) deleteBtn.disabled = false;
            showModal("Delete Failed", error?.message || "Unable to delete idea.", "error");
        }
    }

    async function adminReplyToIdea(ideaId, reply) {
        try {
            await global.ApiService.jsonOk("api/ideas/reply.php", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...getCsrfHeaders() },
                body: JSON.stringify({ idea_id: ideaId, reply }),
            });
            setComposerStatus("Reply posted", "success");
            await loadIdeasList(ideasCurrentPage);
        } catch (error) {
            showModal("Reply Failed", error?.message || "Unable to reply.", "error");
        }
    }

    /* ── Ideas submit form (moved from bindSettingsUiEvents) ── */
    ideasSubmitForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const body = String(ideasBodyInput?.value || "").trim();
        if (!body) {
            showModal("Empty Idea", "Please write something before posting.", "warning");
            return;
        }
        const submitBtn = ideasSubmitForm.querySelector(".ideas-submit-btn");
        try {
            if (submitBtn) submitBtn.disabled = true;
            await global.ApiService.jsonOk("api/ideas/create.php", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...getCsrfHeaders() },
                body: JSON.stringify({ body }),
            });
            if (ideasBodyInput) ideasBodyInput.value = "";
            setComposerStatus("Idea posted!", "success");
            await loadIdeasList();
        } catch (error) {
            showModal("Post Failed", error?.message || "Unable to post idea.", "error");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });

    /* ── Public API ── */
    global.loadIdeasList = loadIdeasList;

})(window);
