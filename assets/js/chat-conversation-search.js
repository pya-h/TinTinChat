/**
 * Conversation Search System
 * Extracted from chat.js for readability.
 *
 * Dependencies (from chat.js global scope):
 *   chatMessagesElem, conversationSearchBar, conversationSearchInput,
 *   conversationSearchCount, conversationSearchRunBtn, conversationSearchPrevBtn,
 *   conversationSearchNextBtn, conversationSearchCloseBtn,
 *   conversationSearchToken, conversationSearchResults, conversationSearchResultIndex,
 *   buildMessageTextHtmlWithLinks, escapeHtml, appSettings,
 *   hasMoreMessages, currentChatUser, loadMessages, setComposerStatus
 */

function resetConversationSearchHighlights() {
    const textNodes = chatMessagesElem.querySelectorAll(
        ".message-text-content",
    );
    textNodes.forEach((node) => {
        const originalText = node.getAttribute("data-original-text");
        if (originalText !== null) {
            node.innerHTML = buildMessageTextHtmlWithLinks(originalText);
            node.removeAttribute("data-original-text");
        }
    });
    conversationSearchResults = [];
    conversationSearchResultIndex = -1;
    if (conversationSearchCount) {
        conversationSearchCount.textContent = "0 / 0";
    }
}

function cancelConversationSearch() {
    conversationSearchToken++;
    resetConversationSearchHighlights();
}

function updateConversationSearchCounter() {
    if (!conversationSearchCount) {
        return;
    }
    if (!conversationSearchResults.length) {
        conversationSearchCount.textContent = "0 / 0";
        return;
    }
    conversationSearchCount.textContent = `${conversationSearchResultIndex + 1} / ${conversationSearchResults.length}`;
}

function focusConversationSearchResult(index, { behavior = "smooth" } = {}) {
    if (!conversationSearchResults.length) {
        updateConversationSearchCounter();
        return;
    }
    conversationSearchResults.forEach((node) =>
        node.classList.remove("is-active"),
    );

    const normalizedIndex = Math.max(
        0,
        Math.min(Number(index) || 0, conversationSearchResults.length - 1),
    );
    conversationSearchResultIndex = normalizedIndex;

    const activeNode = conversationSearchResults[conversationSearchResultIndex];
    activeNode.classList.add("is-active");
    activeNode.scrollIntoView({ behavior, block: "center" });
    updateConversationSearchCounter();
}

function runConversationSearch(force = false) {
    if (!force && !appSettings.interactiveMessageSearch) {
        return;
    }
    void runConversationSearchAsync();
}

function highlightConversationSearchHits(query) {
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${safeQuery})`, "gi");
    const messageTextNodes = chatMessagesElem.querySelectorAll(
        ".message-text-content",
    );

    messageTextNodes.forEach((node) => {
        const originalText = node.textContent || "";
        if (!originalText || !regex.test(originalText)) {
            regex.lastIndex = 0;
            return;
        }
        regex.lastIndex = 0;
        node.setAttribute("data-original-text", originalText);
        node.innerHTML = escapeHtml(originalText).replace(
            regex,
            '<mark class="chat-search-hit">$1</mark>',
        );
        conversationSearchResults.push(
            ...node.querySelectorAll(".chat-search-hit"),
        );
    });

    return conversationSearchResults.length;
}

async function runConversationSearchAsync() {
    const query = String(conversationSearchInput?.value || "").trim();
    const token = ++conversationSearchToken;
    resetConversationSearchHighlights();
    if (!query.length) {
        return;
    }

    highlightConversationSearchHits(query);
    let loadedOlderBatches = 0;

    while (
        hasMoreMessages &&
        currentChatUser &&
        String(conversationSearchInput?.value || "").trim() === query &&
        loadedOlderBatches < 180
    ) {
        setComposerStatus("Searching older messages...", "success");
        await loadMessages(currentChatUser, false, false);
        if (token !== conversationSearchToken) {
            return;
        }
        resetConversationSearchHighlights();
        highlightConversationSearchHits(query);
        loadedOlderBatches++;
    }

    if (token !== conversationSearchToken) {
        return;
    }

    if (!conversationSearchResults.length) {
        updateConversationSearchCounter();
        setComposerStatus("No results in this conversation", "warning");
        return;
    }

    if (loadedOlderBatches > 0) {
        setComposerStatus("Found results including older messages", "success");
    }
    focusConversationSearchResult(conversationSearchResults.length - 1, {
        behavior: "auto",
    });
}

async function navigateConversationSearch(direction = 1) {
    const query = String(conversationSearchInput?.value || "").trim();
    if (!query || !currentChatUser) {
        return;
    }

    if (!conversationSearchResults.length) {
        await runConversationSearchAsync();
        if (!conversationSearchResults.length) {
            return;
        }
    }

    let targetIndex = conversationSearchResultIndex + (direction < 0 ? -1 : 1);

    if (direction < 0 && targetIndex < 0 && hasMoreMessages) {
        const previousCount = conversationSearchResults.length;
        setComposerStatus("Loading older search results...", "success");
        await loadMessages(currentChatUser, false, false);
        const latestQuery = String(conversationSearchInput?.value || "").trim();
        if (latestQuery !== query) {
            return;
        }
        resetConversationSearchHighlights();
        highlightConversationSearchHits(query);
        const addedCount = Math.max(
            0,
            conversationSearchResults.length - previousCount,
        );
        if (addedCount > 0) {
            targetIndex = addedCount - 1;
        }
    }

    focusConversationSearchResult(targetIndex);
}

function openConversationSearchBar() {
    if (!conversationSearchBar || !currentChatUser) {
        return;
    }
    conversationSearchBar.hidden = false;
    conversationSearchInput?.focus();
    conversationSearchInput?.select();
}

function closeConversationSearchBar({ clearInput = true } = {}) {
    if (!conversationSearchBar) {
        return;
    }
    conversationSearchBar.hidden = true;
    cancelConversationSearch();
    if (clearInput && conversationSearchInput) {
        conversationSearchInput.value = "";
    }
}

function bindConversationSearchEvents() {
    conversationSearchInput?.addEventListener("input", () => {
        if (appSettings.interactiveMessageSearch) {
            runConversationSearch();
            return;
        }
        cancelConversationSearch();
    });

    conversationSearchInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
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

    conversationSearchPrevBtn?.addEventListener("click", () => {
        void navigateConversationSearch(-1);
    });

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
