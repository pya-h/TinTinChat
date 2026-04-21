/**
 * Conversation Search System
 * Extracted from chat.js for readability.
 *
 * Algorithm (newest-first cursor model):
 *   - On search: scans all currently rendered message text nodes (decrypted DOM).
 *   - All messages are E2E encrypted at rest, so search must be client-side over rendered text.
 *   - Results: message IDs in DESC order (index 0 = most recent match).
 *   - Cursor starts at 0 (most recent match). Prev/Up ↑ → older (cursor++). Next/Down ↓ → newer (cursor--).
 *   - When navigating past the oldest loaded match with hasMoreMessages=true, ONE batch is
 *     loaded on demand, the scan is rebuilt, and navigation continues — never loads all history.
 *   - No wraparound at either boundary.
 *   - "Search Placeholders" setting: % → .* and _ → . in match regex (client-side only).
 *
 * Dependencies (from chat.js global scope):
 *   chatMessagesElem, conversationSearchBar, conversationSearchInput,
 *   conversationSearchCount, conversationSearchRunBtn, conversationSearchPrevBtn,
 *   conversationSearchNextBtn, conversationSearchCloseBtn,
 *   buildMessageTextHtmlWithLinks, escapeHtml, appSettings,
 *   hasMoreMessages, currentChatUser, loadMessages, setComposerStatus
 */

// ── State ──────────────────────────────────────────────────────────────────────
let conversationSearchToken = 0;
let conversationSearchMatchMsgIds = []; // msg IDs, DESC (index 0 = newest match)
let conversationSearchCursor = -1;      // current position in conversationSearchMatchMsgIds
let conversationSearchActiveQuery = ""; // query string that produced current results

// ── Regex builder ───────────────────────────────────────────────────────────────
function buildSearchRegex(query) {
    const normalizedQuery = String(query || "");

    // Guard: wildcard-only queries are too broad and can degrade performance.
    if (
        appSettings.searchSqlWildcards &&
        normalizedQuery.replace(/[\s%_]/g, "").length === 0
    ) {
        return null;
    }

    if (appSettings.searchSqlWildcards) {
        // % → .* (any substring),  _ → . (any single char); escape everything else
        const pattern = Array.from(normalizedQuery)
            .map((ch) => {
                if (ch === "%") return ".*";
                if (ch === "_") return ".";
                return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            })
            .join("");
        const compactPattern = pattern.replace(/(\.\*){2,}/g, ".*");
        try {
            return new RegExp(`(${compactPattern})`, "gi");
        } catch {
            /* bad pattern — fall through to literal */
        }
    }
    const escaped = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(${escaped})`, "gi");
}

// ── Highlight helpers ───────────────────────────────────────────────────────────────
function resetConversationSearchHighlights() {
    chatMessagesElem
        ?.querySelectorAll(".message-text-content[data-original-text]")
        .forEach((node) => {
            const originalText = node.getAttribute("data-original-text");
            if (originalText !== null) {
                node.innerHTML = buildMessageTextHtmlWithLinks(originalText);
                node.removeAttribute("data-original-text");
            }
        });
    clearActiveSearchHighlight();
    conversationSearchMatchMsgIds = [];
    conversationSearchCursor = -1;
    conversationSearchActiveQuery = "";
    if (conversationSearchCount) {
        conversationSearchCount.textContent = "0 / 0";
    }
}

function cancelConversationSearch() {
    conversationSearchToken++;
    resetConversationSearchHighlights();
}

function activateSearchHighlightOnMessage(messageElement) {
    if (!messageElement) return;
    messageElement
        .querySelectorAll(".chat-search-hit")
        .forEach((mark) => mark.classList.add("is-active"));
    messageElement.classList.add("chat-search-active-anchor");
}

function clearActiveSearchHighlight() {
    chatMessagesElem
        ?.querySelectorAll(".chat-search-active-anchor")
        .forEach((el) => {
            el.querySelectorAll(".chat-search-hit.is-active").forEach((mark) =>
                mark.classList.remove("is-active"),
            );
            el.classList.remove("chat-search-active-anchor");
        });
}

// ── DOM scanner ──────────────────────────────────────────────────────────────────
/**
 * Scans all currently rendered text message elements.
 * Applies dim highlight to every match.
 * Returns matched message IDs sorted DESC (newest = index 0).
 */
function scanDomForSearchMatches(query) {
    const regex = buildSearchRegex(query);
    if (!(regex instanceof RegExp)) {
        return [];
    }
    const textNodes = Array.from(
        chatMessagesElem?.querySelectorAll(
            ".message[data-message-id] .message-text-content",
        ) ?? [],
    );
    const matchedIds = [];

    for (const textNode of textNodes) {
        const messageElement = textNode.closest(".message[data-message-id]");
        if (!messageElement) continue;

        // Prefer data-original-text if already highlighted
        const rawText =
            textNode.getAttribute("data-original-text") ??
            textNode.textContent ??
            "";
        if (!rawText) continue;

        regex.lastIndex = 0;
        if (!regex.test(rawText)) {
            regex.lastIndex = 0;
            continue;
        }
        regex.lastIndex = 0;

        // Wrap every match instance in a dim highlight mark
        textNode.setAttribute("data-original-text", rawText);
        textNode.innerHTML = escapeHtml(rawText).replace(
            regex,
            '<mark class="chat-search-hit">$1</mark>',
        );
        matchedIds.push(
            Number(messageElement.getAttribute("data-message-id")),
        );
    }

    // Sort ASC then reverse → DESC (newest first)
    matchedIds.sort((a, b) => a - b);
    matchedIds.reverse();
    return matchedIds;
}

// ── Counter ───────────────────────────────────────────────────────────────────────
function updateConversationSearchCounter() {
    if (!conversationSearchCount) return;
    const total = conversationSearchMatchMsgIds.length;
    if (total === 0) {
        conversationSearchCount.textContent = "0 / 0";
        return;
    }
    const pos = conversationSearchCursor + 1;
    // Append "+" when there are more unloaded messages that might contain matches
    const suffix = hasMoreMessages ? "+" : "";
    conversationSearchCount.textContent = `${pos} / ${total}${suffix}`;
}

// ── Scroll & focus ───────────────────────────────────────────────────────────────────
/**
 * Precisely centers a message element in the chat scroll container.
 * Uses double-rAF so layout is fully settled before measuring.
 */
async function centerMessageInSearchView(messageElement) {
    if (!(messageElement instanceof HTMLElement) || !chatMessagesElem) return;

    // Bring into rough view first (instant, no jank)
    messageElement.scrollIntoView({ behavior: "auto", block: "center" });

    // Wait two frames for layout to settle
    await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    // Fine-tune: precisely center the element in the scrollport
    const containerRect = chatMessagesElem.getBoundingClientRect();
    const elRect = messageElement.getBoundingClientRect();
    const idealTop =
        containerRect.top +
        chatMessagesElem.clientHeight / 2 -
        elRect.height / 2;
    const delta = elRect.top - idealTop;
    if (Math.abs(delta) > 1) {
        chatMessagesElem.scrollTop += delta;
    }
}

/**
 * Applies active highlight to the message at conversationSearchCursor and scrolls to it.
 */
async function goToSearchCursor() {
    if (
        conversationSearchCursor < 0 ||
        conversationSearchCursor >= conversationSearchMatchMsgIds.length
    ) {
        updateConversationSearchCounter();
        return;
    }

    const msgId = conversationSearchMatchMsgIds[conversationSearchCursor];
    const messageElement = chatMessagesElem?.querySelector(
        `.message[data-message-id="${msgId}"]`,
    );

    clearActiveSearchHighlight();

    if (messageElement) {
        activateSearchHighlightOnMessage(messageElement);
        await centerMessageInSearchView(messageElement);
    }

    updateConversationSearchCounter();
}

// ── Search runner ──────────────────────────────────────────────────────────────────
function runConversationSearch(force = false) {
    if (!force && !appSettings.interactiveMessageSearch) return;
    void runConversationSearchAsync();
}

async function runConversationSearchAsync() {
    const query = String(conversationSearchInput?.value ?? "").trim();
    const token = ++conversationSearchToken;

    resetConversationSearchHighlights();
    if (!query || !currentChatUser) return;

    conversationSearchActiveQuery = query;
    conversationSearchMatchMsgIds = scanDomForSearchMatches(query);

    if (token !== conversationSearchToken) return;

    if (!conversationSearchMatchMsgIds.length) {
        updateConversationSearchCounter();
        if (
            appSettings.searchSqlWildcards &&
            query.replace(/[\s%_]/g, "").length === 0
        ) {
            setComposerStatus(
                "Search placeholders need at least one non-placeholder character.",
                "warning",
            );
            return;
        }
        setComposerStatus(
            hasMoreMessages
                ? "No matches in visible messages. Press ↑ to search older messages."
                : "No results found in this conversation.",
            "warning",
        );
        return;
    }

    // Start at most recent match (cursor = 0)
    conversationSearchCursor = 0;
    await goToSearchCursor();
    if (token !== conversationSearchToken) return;
    setComposerStatus("");
}

// ── Navigation ─────────────────────────────────────────────────────────────────────
/**
 * direction = -1 → Prev / Up ↑   → older message (cursor++)
 * direction = +1 → Next / Down ↓ → newer message (cursor--)
 */
async function navigateConversationSearch(direction = -1) {
    const query = String(conversationSearchInput?.value ?? "").trim();
    if (!query || !currentChatUser) return;

    // Re-run fresh search if no results or query changed
    if (
        !conversationSearchMatchMsgIds.length ||
        conversationSearchActiveQuery !== query
    ) {
        await runConversationSearchAsync();
        return;
    }

    const token = conversationSearchToken; // snapshot; do NOT increment

    if (direction > 0) {
        // ↓ Down / Next → newer → cursor--
        if (conversationSearchCursor <= 0) {
            return; // already at newest; no wraparound
        }
        conversationSearchCursor--;
    } else {
        // ↑ Up / Prev → older → cursor++
        if (conversationSearchCursor >= conversationSearchMatchMsgIds.length - 1) {
            // At oldest loaded match
            if (!hasMoreMessages) {
                return; // no more pages; no wraparound
            }

            // Remember which ID was the oldest so we can find the next older one
            const oldestLoadedId =
                conversationSearchMatchMsgIds[
                    conversationSearchMatchMsgIds.length - 1
                ];

            setComposerStatus("Loading older messages…", "success");

            let foundOlder = false;
            let safety = 0;
            while (hasMoreMessages && !foundOlder && safety < 180) {
                safety++;
                await loadMessages(currentChatUser, false, false);

                if (conversationSearchToken !== token) return; // cancelled

                // Rebuild after each page so we can stop as soon as a next older hit appears
                resetConversationSearchHighlights();
                if (conversationSearchToken !== token) return;

                conversationSearchActiveQuery = query;
                conversationSearchMatchMsgIds = scanDomForSearchMatches(query);

                if (conversationSearchToken !== token) return;

                const oldIdxProbe = conversationSearchMatchMsgIds.indexOf(
                    oldestLoadedId,
                );
                if (
                    oldIdxProbe >= 0 &&
                    oldIdxProbe + 1 < conversationSearchMatchMsgIds.length
                ) {
                    foundOlder = true;
                    break;
                }
            }

            if (!conversationSearchMatchMsgIds.length) {
                updateConversationSearchCounter();
                setComposerStatus("No results found.", "warning");
                return;
            }

            // In the rebuilt DESC array, move to the entry just older than oldestLoadedId
            const oldIdx = conversationSearchMatchMsgIds.indexOf(oldestLoadedId);
            if (oldIdx >= 0 && oldIdx + 1 < conversationSearchMatchMsgIds.length) {
                conversationSearchCursor = oldIdx + 1;
            } else if (oldIdx < 0) {
                // oldestLoadedId not found (edge case) — go to very last
                conversationSearchCursor =
                    conversationSearchMatchMsgIds.length - 1;
            } else {
                // No new older matches in this batch
                conversationSearchCursor =
                    conversationSearchMatchMsgIds.length - 1;
                setComposerStatus("No more older matches.", "warning");
                await goToSearchCursor();
                return;
            }

            setComposerStatus("");
            await goToSearchCursor();
            return;
        }

        conversationSearchCursor++;
    }

    await goToSearchCursor();
}

// ── Bar open / close ────────────────────────────────────────────────────────────
function openConversationSearchBar() {
    if (!conversationSearchBar || !currentChatUser) return;
    conversationSearchBar.hidden = false;
    conversationSearchInput?.focus();
    conversationSearchInput?.select();
}

function closeConversationSearchBar({ clearInput = true } = {}) {
    if (!conversationSearchBar) return;
    conversationSearchBar.hidden = true;
    cancelConversationSearch();
    if (clearInput && conversationSearchInput) {
        conversationSearchInput.value = "";
    }
}

// ── Event binding ────────────────────────────────────────────────────────────────
function bindConversationSearchEvents() {
    conversationSearchInput?.addEventListener("input", () => {
        if (appSettings.interactiveMessageSearch) {
            runConversationSearch();
        } else {
            cancelConversationSearch();
        }
    });

    conversationSearchInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            // In either mode, Enter = navigate to next older match (same as Up button)
            if (appSettings.interactiveMessageSearch) {
                void navigateConversationSearch(-1);
            } else {
                runConversationSearch(true);
            }
        } else if (event.key === "Escape") {
            event.preventDefault();
            closeConversationSearchBar();
        }
    });

    conversationSearchRunBtn?.addEventListener("click", () => {
        runConversationSearch(true);
    });

    // Prev = Up ↑ = older
    conversationSearchPrevBtn?.addEventListener("click", () => {
        void navigateConversationSearch(-1);
    });

    // Next = Down ↓ = newer
    conversationSearchNextBtn?.addEventListener("click", () => {
        void navigateConversationSearch(1);
    });

    conversationSearchCloseBtn?.addEventListener("click", () => {
        closeConversationSearchBar();
    });

    document.addEventListener("keydown", (event) => {
        const wantsSearch =
            (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f";
        if (wantsSearch && currentChatUser) {
            event.preventDefault();
            openConversationSearchBar();
        }
        if (
            event.key === "Escape" &&
            conversationSearchBar &&
            !conversationSearchBar.hidden
        ) {
            closeConversationSearchBar();
        }
    });
}
