const chatListElem = document.getElementById("chatList");
const chatMessagesElem = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const replyPreviewElem = document.getElementById("replyPreview");
const chatWithElem = document.getElementById("chatWith");
const searchUserInput = document.getElementById("searchUser");
const imageUploadInput = document.getElementById("imageUploadInput");
const imageUploadBtn = document.getElementById("imageUploadBtn");

const searchSuggestions = document.getElementById("searchSuggestions");
const searchLoading = document.getElementById("searchLoading");
const IMAGE_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
const FILE_UPLOAD_MAX_BYTES = 50 * 1024 * 1024;
const MESSAGE_LONG_PRESS_MS = 500;

let currentChatUser = null;
let currentChatRecentMessages = null;
let currentReplyTarget = null;
const chatUsers = new Set();
let messageOffset = 0;
let hasMoreMessages = true;
let isLoadingMessages = false;
let hasLoadedMoreMessages = false; // Track if user has clicked Load More at least once
const MESSAGES_PER_PAGE = 50;

let searchTimeout = null;
let currentSuggestions = [];
let selectedSuggestionIndex = -1;
let isSearching = false;

let mediaRecorder = null;
let audioChunks = [];
const voiceBtn = document.getElementById("voiceBtn");
let isRecording = false;
let recordingStartTime = null;
let shouldSendRecording = true;
let audioContext = null;
let activeAnalyser = null;

let initialViewportHeight = window.innerHeight;

let notificationAudio = null;
let customNotificationAudio = null;
const NOTIFICATION_COOLDOWN = 500;
const CUSTOM_SOUND_PATH = "assets/sounds/notification.mp3";

async function loadCustomNotificationSound() {
    try {
        const response = await fetch(CUSTOM_SOUND_PATH);
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            customNotificationAudio = new Audio();
            customNotificationAudio.src = url;
            customNotificationAudio.volume = 0.7;
            return true;
        }
    } catch (error) {
        initNotificationSound();
        createNotificationSound();
    }
    return false;
}

document.addEventListener("DOMContentLoaded", loadCustomNotificationSound);

function createNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.setValueAtTime(550, now + 0.12);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.05, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);
    } catch (error) {
        initNotificationSound();
    }
}

function initNotificationSound() {
    if (!notificationAudio) {
        notificationAudio = new Audio();
        notificationAudio.src =
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
        notificationAudio.volume = 0.7;
    }
}

function playDefaultNotificationSound() {
    if (!notificationAudio) {
        initNotificationSound();
    }
    createNotificationSound();
    return notificationAudio.cloneNode().play();
}

function setupNotificationSoundPlayer() {
    if (customNotificationAudio) {
        return () => {
            return customNotificationAudio
                .cloneNode()
                .play()
                .catch(() => playDefaultNotificationSound());
        };
    }
    initNotificationSound();
    return () => {
        createNotificationSound();
        return notificationAudio
            .cloneNode()
            .play()
            .catch(() => playDefaultNotificationSound());
    };
}

const playNotificationSound = setupNotificationSoundPlayer();

function isTextPersian(text) {
    return /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF]/.test(text);
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

function getCsrfHeaders() {
    if (typeof CSRF_TOKEN === "string" && CSRF_TOKEN.length) {
        return { "X-CSRF-Token": CSRF_TOKEN };
    }
    return {};
}

function showMessageCopiedFeedback() {
    if (window.UIEnhancements?.showSearchNotification) {
        window.UIEnhancements.showSearchNotification("Message copied", "success");
        return;
    }
    showModal("Copied", "Message copied to clipboard.", "success");
}

function closeMessageContextMenu() {
    document.getElementById("messageContextMenu")?.remove();
}

function getMessageTextForCopy(messageElement) {
    const textElement = messageElement.querySelector(".message-text-content");
    if (!textElement) {
        return "";
    }
    return textElement.innerText?.trim() || "";
}

function getReplySnippetFromMessageElement(messageElement) {
    const textContent = getMessageTextForCopy(messageElement);
    if (textContent.length) {
        return textContent;
    }

    if (messageElement.classList.contains("is-image-message")) {
        return "[Image]";
    }
    if (messageElement.classList.contains("is-voice-message")) {
        return "[Voice message]";
    }
    if (messageElement.classList.contains("is-file-message")) {
        return "[File]";
    }

    return "[Message]";
}

function clearReplyState() {
    currentReplyTarget = null;
    if (replyPreviewElem) {
        replyPreviewElem.style.display = "none";
        replyPreviewElem.innerHTML = "";
    }
}

function setReplyState(messageElement) {
    const messageId = Number(messageElement.getAttribute("data-message-id") || 0);
    if (!messageId || !replyPreviewElem) {
        return;
    }

    const snippet = getReplySnippetFromMessageElement(messageElement);
    const senderLabel = messageElement.classList.contains("sent") ? "You" : currentChatUser;

    currentReplyTarget = {
        messageId,
        senderLabel,
        snippet,
    };

    replyPreviewElem.innerHTML = `
        <div class="reply-preview-content">
            <div class="reply-preview-title">Replying to ${escapeHtml(senderLabel)}</div>
            <div class="reply-preview-text">${escapeHtml(snippet.slice(0, 160))}</div>
        </div>
        <button type="button" class="reply-preview-close" aria-label="Cancel reply">
            <i class="fas fa-times"></i>
        </button>
    `;

    replyPreviewElem.style.display = "flex";
    const closeBtn = replyPreviewElem.querySelector(".reply-preview-close");
    closeBtn?.addEventListener("click", clearReplyState);
}

function buildReplyPreviewHtml(msg, decryptedReplyText) {
    if (!msg.reply_message_id) {
        return "";
    }

    const senderLabel = Number(msg.reply_sender_id) === Number(CURRENT_USER_ID) ? "You" : currentChatUser;
    const fallbackText = msg.reply_message_type === "text" ? "[Message]" : `[${msg.reply_message_type}]`;
    const previewText = (decryptedReplyText || fallbackText || "[Message]").slice(0, 160);

    return `
        <div class="reply-quote" data-reply-target-id="${msg.reply_message_id}">
            <div class="reply-quote-sender">${escapeHtml(senderLabel)}</div>
            <div class="reply-quote-text">${escapeHtml(previewText)}</div>
        </div>
    `;
}

async function copyMessageText(messageElement) {
    const messageText = getMessageTextForCopy(messageElement);
    if (!messageText) {
        showModal("Copy Failed", "This message cannot be copied.", "warning");
        return;
    }

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(messageText);
        } else {
            const tempTextArea = document.createElement("textarea");
            tempTextArea.value = messageText;
            tempTextArea.setAttribute("readonly", "readonly");
            tempTextArea.style.position = "absolute";
            tempTextArea.style.left = "-9999px";
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand("copy");
            document.body.removeChild(tempTextArea);
        }
        showMessageCopiedFeedback();
    } catch (err) {
        showModal("Copy Failed", "Unable to copy message.", "error");
    }
}

async function sendEncryptedTextMessage(targetUsername, text, replyToMessageId = null) {
    const recipientKey = await getPublicKey(targetUsername);
    const senderKey = await getPublicKey(CURRENT_USER);

    const encryptedForRecipient = await encryptLongMessage(text, recipientKey, isTextPersian(text));
    const encryptedForSender = await encryptLongMessage(text, senderKey, isTextPersian(text));

    const formData = new FormData();
    formData.append("target", targetUsername);
    formData.append("message", encryptedForRecipient);
    formData.append("message_for_sender", encryptedForSender);
    if (replyToMessageId) {
        formData.append("reply_to_message_id", String(replyToMessageId));
    }

    const res = await fetch("api/send_message.php", {
        method: "POST",
        headers: getCsrfHeaders(),
        body: formData,
    });
    const json = await res.json();
    if (json.status !== "ok") {
        throw new Error(json.error || "Send failed");
    }

    return json;
}

async function forwardMessageText(messageElement) {
    const messageText = getMessageTextForCopy(messageElement);
    if (!messageText) {
        showModal("Forward Failed", "Only text messages can be forwarded right now.", "warning");
        return;
    }

    const destination = window
        .prompt("Forward to username:", currentChatUser || "")
        ?.trim();
    if (!destination) {
        return;
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_-]{2,}$/.test(destination)) {
        showModal(
            "Invalid Username",
            "Username must start with a letter and contain only letters, numbers, hyphens, and underscores.",
            "warning"
        );
        return;
    }

    if (destination === CURRENT_USER) {
        showModal("Forward Failed", "You cannot forward messages to yourself.", "warning");
        return;
    }

    try {
        await sendEncryptedTextMessage(destination, messageText);
        addUserToChatList(destination);
        showModal("Forwarded", `Message forwarded to ${destination}.`, "success");
    } catch (error) {
        showModal("Forward Failed", error.message || "Unable to forward message.", "error");
    }
}

async function deleteMessageById(messageId) {
    const res = await fetch("api/delete_messages.php", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...getCsrfHeaders(),
        },
        body: JSON.stringify({ messages: [messageId] }),
    });
    const json = await res.json();
    if (json.status !== "ok") {
        throw new Error(json.error || "Failed to delete message");
    }
}

async function deleteMessageFromContext(messageElement) {
    const messageId = Number(messageElement.getAttribute("data-message-id") || 0);
    if (!messageId) {
        showModal("Delete Failed", "Invalid message id.", "warning");
        return;
    }

    const confirmed = window.confirm("Delete this message?");
    if (!confirmed) {
        return;
    }

    try {
        await deleteMessageById(messageId);
        messageElement.remove();

        if (currentReplyTarget?.messageId === messageId) {
            clearReplyState();
        }
        if (Array.isArray(currentChatRecentMessages)) {
            currentChatRecentMessages = currentChatRecentMessages.filter(
                (item) => Number(item.id) !== messageId
            );
        }
    } catch (error) {
        showModal("Delete Failed", error.message || "Unable to delete message.", "error");
    }
}

function addMessageActionHandlers(messageElement) {
    let longPressTimer = null;

    const openContextMenu = (clientX, clientY) => {
        closeMessageContextMenu();

        const menu = document.createElement("div");
        menu.id = "messageContextMenu";
        menu.className = "message-context-menu";

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "message-context-menu-item";
        copyBtn.innerHTML = '<i class="fas fa-copy me-2"></i>Copy';
        copyBtn.addEventListener("click", async () => {
            await copyMessageText(messageElement);
            closeMessageContextMenu();
        });
        menu.appendChild(copyBtn);

        const replyBtn = document.createElement("button");
        replyBtn.type = "button";
        replyBtn.className = "message-context-menu-item";
        replyBtn.innerHTML = '<i class="fas fa-reply me-2"></i>Reply';
        replyBtn.addEventListener("click", () => {
            setReplyState(messageElement);
            closeMessageContextMenu();
            chatInput.focus();
        });
        menu.appendChild(replyBtn);

        const forwardBtn = document.createElement("button");
        forwardBtn.type = "button";
        forwardBtn.className = "message-context-menu-item";
        forwardBtn.innerHTML = '<i class="fas fa-share-from-square me-2"></i>Forward';
        forwardBtn.addEventListener("click", async () => {
            await forwardMessageText(messageElement);
            closeMessageContextMenu();
        });
        menu.appendChild(forwardBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "message-context-menu-item";
        deleteBtn.innerHTML = '<i class="fas fa-trash me-2"></i>Delete';
        deleteBtn.addEventListener("click", async () => {
            await deleteMessageFromContext(messageElement);
            closeMessageContextMenu();
        });
        menu.appendChild(deleteBtn);

        document.body.appendChild(menu);

        const menuRect = menu.getBoundingClientRect();
        const maxLeft = Math.max(8, window.innerWidth - menuRect.width - 8);
        const maxTop = Math.max(8, window.innerHeight - menuRect.height - 8);
        menu.style.left = `${Math.min(clientX, maxLeft)}px`;
        menu.style.top = `${Math.min(clientY, maxTop)}px`;
    };

    messageElement.addEventListener("contextmenu", (event) => {
        if (!messageElement.classList.contains("is-text-message")) {
            return;
        }
        event.preventDefault();
        openContextMenu(event.clientX, event.clientY);
    });

    messageElement.addEventListener("touchstart", (event) => {
        if (!messageElement.classList.contains("is-text-message")) {
            return;
        }
        longPressTimer = setTimeout(() => {
            const touch = event.touches?.[0];
            if (!touch) {
                return;
            }
            openContextMenu(touch.clientX, touch.clientY);
        }, MESSAGE_LONG_PRESS_MS);
    });

    const clearLongPress = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };

    messageElement.addEventListener("touchend", clearLongPress);
    messageElement.addEventListener("touchcancel", clearLongPress);
}

document.addEventListener("click", (event) => {
    const menu = document.getElementById("messageContextMenu");
    if (!menu) {
        return;
    }
    if (!event.target.closest("#messageContextMenu")) {
        closeMessageContextMenu();
    }
});

document.addEventListener("scroll", closeMessageContextMenu, true);

window.addEventListener("resize", () => {
    if (window.innerWidth <= 767.98) {
        const heightDifference = initialViewportHeight - window.innerHeight;
        if (Math.abs(heightDifference) > 150) {
            const chatContainer = document.querySelector(".chat-container");
            if (chatContainer) {
                chatContainer.style.height = `calc(100vh - 60px)`;
            }

            setTimeout(() => {
                if (chatMessagesElem) {
                    chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;
                }
            }, 300);
        }
    }
});

window.addEventListener("load", () => {
    initialViewportHeight = window.innerHeight;
});

function addUserToChatList(username) {
    if (chatUsers.has(username) || username === CURRENT_USER) return false;
    chatUsers.add(username);

    const li = document.createElement("li");
    li.tabIndex = 0;
    li.style.setProperty("--i", chatListElem.children.length);

    const initials = username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    li.innerHTML = `<span class="avatar">${initials}</span> <span>${username}</span><span id='user_${username}_loading' style="display:none" class="spinner-border spinner-border-sm text-primary ms-2" role="status" aria-hidden="true"></span>`;
    li.id = `user_${username}`;
    li.classList.add("chat-user");
    li.addEventListener("click", () => selectChatUser(username));
    chatListElem.appendChild(li);
    return true;
}

function updateLoadingSpinnerState(username, show = false) {
    const loadingSpinnerElement = document.getElementById(`user_${username}_loading`);
    loadingSpinnerElement.style = `display: ${show ? "inline" : "none"}`;
}

async function selectChatUser(username) {
    if (currentChatUser?.length) {
        updateLoadingSpinnerState(currentChatUser, false);
    }

    document.getElementById(`user_${currentChatUser}`)?.classList.remove("selected-chat");
    currentChatUser = username;
    currentChatRecentMessages = null;
    document.getElementById(`user_${currentChatUser}`)?.classList.add("selected-chat");
    chatInput.disabled = false;
    chatWithElem.textContent = username;
    chatInput.value = "";
    clearReplyState();
    chatMessagesElem.innerHTML = "";

    messageOffset = 0;
    hasMoreMessages = true;
    isLoadingMessages = false;
    hasLoadedMoreMessages = false; // Reset when selecting a new chat

    [...chatListElem.children].forEach((li) => {
        li.classList.toggle("active", li.textContent === username);
    });

    await loadMessages(username, true, true);
}

async function updateMessagesStatus(messages) {
    const messagesNewlySeen = messages
        ?.filter((msg) => msg.receiver_id == CURRENT_USER_ID && !msg.seen_at)
        .map((msg) => Number(msg.id));
    if (!messagesNewlySeen?.length) {
        return false;
    }
    res = await fetch("api/see_messages.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getCsrfHeaders(),
        },
        body: JSON.stringify({ messages: messagesNewlySeen }),
    });
    const json = await res.json();
    if (json.status !== "ok") {
        throw new Error(json.error || "Failed marking new messages as seen");
    }
    return true;
}

async function loadMessages(username, showLoading = false, isInitialLoad = false) {
    if (isLoadingMessages) return;

    const loadingSpinnerElement = document.getElementById(`user_${username}_loading`);
    try {
        isLoadingMessages = true;

        if (showLoading) {
            loadingSpinnerElement.style = "display: inline";
        }

        const offset = isInitialLoad ? 0 : messageOffset;

        const res = await fetch(
            `api/fetch_messages.php?with=${encodeURIComponent(
                username
            )}&limit=${MESSAGES_PER_PAGE}&offset=${offset}`
        );
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();

        if (isInitialLoad) {
            if (!data.messages.length) {
                chatMessagesElem.innerHTML = "";
                chatMessagesElem.textContent = "No messages yet.";
                currentChatRecentMessages = [];
                messageOffset = 0;
                return;
            }
            if (currentChatRecentMessages?.length) {
                const lastMessage = data.messages?.[data.messages.length - 1],
                    previosLastMessageId =
                        currentChatRecentMessages?.[currentChatRecentMessages.length - 1]?.id;
                if (lastMessage && previosLastMessageId && lastMessage.id <= previosLastMessageId) {
                    return;
                }
            }
            chatMessagesElem.innerHTML = "";
            messageOffset = 0;
            currentChatRecentMessages = data?.messages ?? [];
        } else {
            const existingLoadMore = document.getElementById("loadMoreBtn");
            if (existingLoadMore) {
                existingLoadMore.remove();
            }
        }
        messageOffset += data.messages?.length ?? 0;
        hasMoreMessages = data.hasMore;

        if (hasMoreMessages && !isInitialLoad) {
            addLoadMoreButton();
        }

        const previousScrollHeight = chatMessagesElem.scrollHeight;

        if (isInitialLoad) {
            for (const msg of data.messages) {
                await addMessageToChat(msg);
            }
            requestAnimationFrame(() => {
                chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;
                removeGoToLatestButton();
            });

            if (hasMoreMessages) {
                addLoadMoreButton();
            }
        } else {
            for (let i = data.messages.length - 1; i >= 0; i--) {
                await addMessageToChat(data.messages[i], true);
            }
            chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight - previousScrollHeight;
            hasLoadedMoreMessages = true;
            updateGoToLatestButton();
        }
        updateMessagesStatus(data.messages);
    } catch (err) {
        chatMessagesElem.textContent = "Error loading messages";
    } finally {
        if (loadingSpinnerElement) loadingSpinnerElement.style = "display: none";
        isLoadingMessages = false;
    }
}

async function loadCurrentChatsRecentMessages() {
    if (isLoadingMessages) return;

    try {
        isLoadingMessages = true;
        const res = await fetch(
            `api/fetch_recent_messages.php?with=${encodeURIComponent(
                currentChatUser
            )}&offsetMsgId=${currentChatRecentMessages[currentChatRecentMessages.length - 1].id}`
        );
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();

        if (!data?.messages?.length) {
            return;
        }

        if (data.messages[data.messages.length - 1]?.sender_id != CURRENT_USER_ID) {
            try {

                playNotificationSound()
            } catch(ex) {
                console.log(ex);
            }
        }
        currentChatRecentMessages = data.messages;
        messageOffset += currentChatRecentMessages?.length ?? 0;
        for (const msg of currentChatRecentMessages) {
            await addMessageToChat(msg, false, true);
        }
        updateMessagesStatus(data.messages); // Mark as seen on the background

        if (!hasLoadedMoreMessages) {
            requestAnimationFrame(() => {
                chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;
            });
        }
    } finally {
        isLoadingMessages = false;
    }
}

function forceFetchCurrentChatMessages() {
    if (currentChatRecentMessages == null) {
        return loadMessages(currentChatUser, false, true);
    }
    return loadCurrentChatsRecentMessages();
}

function generateWaveformBars() {
    const bars = [];
    const barCount = 30;
    for (let i = 0; i < barCount; i++) {
        const height = Math.random() * 60 + 15;
        bars.push(`<div class="waveform-bar" style="height: ${height}%"></div>`);
    }
    return bars.join("");
}

function addLoadMoreButton() {
    const existingBtn = document.getElementById("loadMoreBtn");
    if (existingBtn) return; // Don't add if already exists

    const loadMoreBtn = document.createElement("div");
    loadMoreBtn.id = "loadMoreBtn";
    loadMoreBtn.className = "load-more-container";
    loadMoreBtn.innerHTML = `
        <button class="btn btn-outline-primary btn-sm load-more-btn" onclick="loadMoreMessages()">
            <i class="fas fa-chevron-up me-1"></i>
            Load More Messages
        </button>
    `;

    chatMessagesElem.insertBefore(loadMoreBtn, chatMessagesElem.firstChild);
}

async function loadMoreMessages() {
    if (!currentChatUser || isLoadingMessages || !hasMoreMessages) return;

    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
        const btn = loadMoreBtn.querySelector("button");
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Loading...';
    }

    await loadMessages(currentChatUser, false, false);

    if (loadMoreBtn && !hasMoreMessages) {
        loadMoreBtn.remove();
    } else if (loadMoreBtn) {
        const btn = loadMoreBtn.querySelector("button");
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-chevron-up me-1"></i>Load More Messages';
    }

    updateGoToLatestButton();
}
function newDateTag(
    msg,
    { atLeft = true, topSpace = 3, fontSize = 10, strictMargins = false, extraStyles = "" }
) {
    const margins = strictMargins ? `mt-${topSpace}` : `mt-0 mt-lg-${topSpace} mt-md-${topSpace}`;
    return `<span class="mx-2 ${margins}" style="font-size: ${fontSize}px; float: ${
        atLeft ? "left" : "right"
    };${extraStyles}">${new Date(msg.created_at).toLocaleString("default", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    })}</span>`;
}

async function addMessageToChat(msg, prepend = false) {
    let div = document.createElement("div");
    div.classList.add("message");
    div.classList.add(msg.sender_id == CURRENT_USER_ID ? "sent" : "received");

    if (msg.message_type === "voice" && msg.voice_file_path) {
        div.classList.add("is-voice-message");

        div.innerHTML = `
          <div class="voice-player-container">
            <button class="voice-play-btn" onclick="playVoiceMessage(${msg.id})">
              <i class="fas fa-play"></i>
            </button>
            <div class="voice-waveform">
              <div class="waveform-bars">
                ${generateWaveformBars()}
              </div>
            </div>
            <div class="voice-duration-display">--:--</div>
          </div>
        ${newDateTag(msg, {
            atLeft: msg.sender_id == CURRENT_USER_ID,
            topSpace: 1,
            fontSize: 8.5,
            extraStyles: "color: var(--text-color); font-weight: 600;",
        })}
        `;
        div.setAttribute("data-message-id", msg.id);
    } else if (msg.message_type === "image" && msg.image_file_path) {
        div.classList.add("is-image-message");

        const imageUrl = `api/get_image.php?id=${msg.id}`;
        div.innerHTML = `<a href="${imageUrl}" class="image-message-link" data-image-url="${imageUrl}" title="View full image">
                <img src="${imageUrl}" class="message-image" alt="Image from ${msg.sender_id}" 
                    onerror="this.parentNode.innerHTML='<div style=\\'padding: 20px; text-align: center; color: #6c757d;\\'>Image not available</div>'">
                </a>${newDateTag(msg, {
                    atLeft: msg.sender_id == CURRENT_USER_ID,
                    topSpace: 1,
                    fontSize: 8.5,
                    extraStyles: "color: var(--text-color); font-weight: 600;",
                })}`;

        const imageLink = div.querySelector(".image-message-link");
        if (imageLink) {
            imageLink.addEventListener("click", (e) => {
                e.preventDefault();
                openImageModal(imageUrl);
            });
        }
    } else if (msg.message_type === "file" && msg.any_file_path) {
        div.classList.add("is-file-message");

        const fileUrl = `api/get_file_message.php?id=${msg.id}`;
        let fileName = msg.any_file_path;
        if (fileName.includes("_")) {
            const parts = fileName.split("_");
            if (parts.length > 2) {
                fileName = parts.slice(2).join("_");
            } else {
                fileName = parts[parts.length - 1];
            }
        }
        const fileSize = msg.file_size ? formatFileSize(msg.file_size) : "";
        const escapedFileName = fileName.replace(/'/g, "\\'").replace(/"/g, "&quot;");

        const isDownloaded = await isFileDownloaded(msg.id);
        const downloadIconClass = isDownloaded ? "fa-check-circle" : "fa-download";
        const downloadIconColor = isDownloaded ? "color: var(--primary-color);" : "";
        const cacheTitle = isDownloaded ? 'title="Click to open cached file"' : "";

        div.innerHTML = `
          <div class="file-message-container" data-file-msg-id="${
              msg.id
          }" onclick="downloadAndOpenFile(${msg.id}, '${escapedFileName}')" ${cacheTitle}>
            <div class="file-icon">
              <i class="fas fa-file"></i>
            </div>
            <div class="file-info">
              <div class="file-name">${fileName}</div>
              ${fileSize ? `<div class="file-size">${fileSize}</div>` : ""}
            </div>
            <div class="file-download-icon">
              <i class="fas ${downloadIconClass}" style="${downloadIconColor}"></i>
            </div>
          </div>
          ${newDateTag(msg, {
              atLeft: msg.sender_id == CURRENT_USER_ID,
              topSpace: 1,
              fontSize: 8.5,
              extraStyles: "color: var(--text-color); font-weight: 600;",
          })}
        `;
        div.setAttribute("data-message-id", msg.id);
    } else {
        let decryptedText = "[Unable to decrypt message]";
        let decryptedReplyText = "";
        try {
            if (msg.sender_id == CURRENT_USER_ID) {
                decryptedText = await decryptLongMessage(msg.message_for_sender);
            } else {
                decryptedText = await decryptLongMessage(msg.message);
            }

            if (msg.reply_message_id && msg.reply_message_type === "text") {
                const replyPayload = msg.reply_sender_id == CURRENT_USER_ID
                    ? msg.reply_message_for_sender
                    : msg.reply_message;
                if (replyPayload) {
                    decryptedReplyText = await decryptLongMessage(replyPayload);
                }
            }
        } catch (e) {
            decryptedText = "[Unsupported message]";
        }
        const isPersian = isTextPersian(decryptedText.trim());
        const safeText = escapeHtml(decryptedText);
        div.classList.add("is-text-message");
        div.innerHTML = `<button type="button" class="message-copy-btn" title="Copy message" aria-label="Copy message"><i class="fas fa-copy"></i></button>${buildReplyPreviewHtml(msg, decryptedReplyText)}<span class="message-text-content">${safeText}</span>${newDateTag(msg, {
            atLeft: isPersian,
            strictMargins: true,
            topSpace: 3,
        })}`;
        div.setAttribute("data-message-id", msg.id);
        if (isPersian) {
            div.dir = "rtl";
        }

        const copyBtn = div.querySelector(".message-copy-btn");
        if (copyBtn) {
            copyBtn.addEventListener("click", async (event) => {
                event.stopPropagation();
                await copyMessageText(div);
            });
        }

        addMessageActionHandlers(div);

        const replyQuote = div.querySelector(".reply-quote");
        if (replyQuote) {
            replyQuote.addEventListener("click", () => {
                const targetId = replyQuote.getAttribute("data-reply-target-id");
                if (!targetId) {
                    return;
                }
                const targetMessage = chatMessagesElem.querySelector(`[data-message-id="${targetId}"]`);
                if (targetMessage) {
                    targetMessage.scrollIntoView({ behavior: "smooth", block: "center" });
                    targetMessage.classList.add("reply-target-highlight");
                    setTimeout(() => targetMessage.classList.remove("reply-target-highlight"), 1100);
                }
            });
        }
    }

    if (msg.sender_id == CURRENT_USER_ID) {
        const tickContainer = document.createElement("span");
        tickContainer.className = msg.seen_at
            ? "message-status-indicator seen-ticks"
            : "message-status-indicator just-sent-tick";
        div.appendChild(tickContainer);
    }
    if (prepend) {
        const loadMoreBtn = document.getElementById("loadMoreBtn");
        if (loadMoreBtn) {
            chatMessagesElem.insertBefore(div, loadMoreBtn.nextSibling);
        } else {
            chatMessagesElem.insertBefore(div, chatMessagesElem.firstChild);
        }
    } else {
        chatMessagesElem.appendChild(div);
    }
}

window.loadMoreMessages = loadMoreMessages;

function addGoToLatestButton() {
    const existingBtn = document.getElementById("goToLatestBtn");
    if (existingBtn) return; // Don't add if already exists

    const goToLatestBtn = document.createElement("div");
    goToLatestBtn.id = "goToLatestBtn";
    goToLatestBtn.className = "go-to-latest-container";
    goToLatestBtn.innerHTML = `
        <button class="btn btn-primary btn-sm go-to-latest-btn" onclick="scrollToLatest()">
            <i class="fas fa-chevron-down me-1"></i>
            Go to Latest
        </button>
    `;

    chatMessagesElem.appendChild(goToLatestBtn);
}

function removeGoToLatestButton() {
    const goToLatestBtn = document.getElementById("goToLatestBtn");
    if (goToLatestBtn) {
        goToLatestBtn.remove();
    }
}

function updateGoToLatestButton() {
    if (!hasLoadedMoreMessages) {
        removeGoToLatestButton();
        return;
    }

    const isNearBottom =
        chatMessagesElem.scrollTop + chatMessagesElem.clientHeight >=
        chatMessagesElem.scrollHeight - 100;

    if (isNearBottom) {
        removeGoToLatestButton();
    } else {
        addGoToLatestButton();
    }
}

function scrollToLatest() {
    chatMessagesElem.scrollTo({
        top: chatMessagesElem.scrollHeight,
        behavior: "smooth",
    });
    setTimeout(() => {
        removeGoToLatestButton();
    }, 100);
}

window.scrollToLatest = scrollToLatest;

function updateMessageTickStatus(messageId, isSeen) {
    const messageDiv = Array.from(chatMessagesElem.children).find(
        (el) =>
            el.getAttribute("data-message-id") == messageId ||
            el.querySelector(`[data-message-id="${messageId}"]`)
    );

    if (!messageDiv) return;

    const tickIndicator = messageDiv.querySelector(".message-status-indicator");
    if (tickIndicator) {
        tickIndicator.className = isSeen
            ? "message-status-indicator seen-ticks"
            : "message-status-indicator just-sent-tick";
    }
}

window.updateMessageTickStatus = updateMessageTickStatus;

function openImageModal(imageUrl) {
    const imageModalOverlay = document.getElementById("imageModalOverlay");
    const imageModalImage = document.getElementById("imageModalImage");
    const imageModalDownload = document.getElementById("imageModalDownload");

    if (!imageModalOverlay || !imageModalImage || !imageModalDownload) return;

    imageModalImage.src = imageUrl;
    imageModalDownload.href = imageUrl;
    imageModalDownload.download = `image_${Date.now()}.jpg`;

    imageModalOverlay.style.display = "flex";
    setTimeout(() => {
        imageModalOverlay.classList.add("visible");
    }, 10);

    document.body.style.overflow = "hidden";
}

function closeImageModal() {
    const imageModalOverlay = document.getElementById("imageModalOverlay");
    if (!imageModalOverlay) return;

    imageModalOverlay.classList.remove("visible");

    setTimeout(() => {
        if (!imageModalOverlay.classList.contains("visible")) {
            imageModalOverlay.style.display = "none";
            document.body.style.overflow = "";
        }
    }, 300);
}

function downloadImage(event) {
    event.stopPropagation();
}

window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;

function formatFileSize(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
}

const FILE_CACHE_DB = "TinTinChatFileCache";
const FILE_CACHE_STORE = "downloadedFiles";

async function initFileCache() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(FILE_CACHE_DB, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(FILE_CACHE_STORE)) {
                const objectStore = db.createObjectStore(FILE_CACHE_STORE, {
                    keyPath: "messageId",
                });
                objectStore.createIndex("timestamp", "timestamp", {
                    unique: false,
                });
            }
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(FILE_CACHE_STORE)) {
                db.createObjectStore(FILE_CACHE_STORE, {
                    keyPath: "messageId",
                });
            }
        };
    });
}

async function saveDownloadedFile(messageId, fileName, fileBlob) {
    try {
        const db = await initFileCache();
        const transaction = db.transaction([FILE_CACHE_STORE], "readwrite");
        const objectStore = transaction.objectStore(FILE_CACHE_STORE);

        const fileData = {
            messageId: messageId,
            fileName: fileName,
            fileBlob: fileBlob,
            timestamp: Date.now(),
            size: fileBlob.size,
        };

        return new Promise((resolve, reject) => {
            const request = objectStore.put(fileData);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(fileData);
        });
    } catch (error) {}
    return null;
}

async function getDownloadedFile(messageId) {
    try {
        const db = await initFileCache();
        const transaction = db.transaction([FILE_CACHE_STORE], "readonly");
        const objectStore = transaction.objectStore(FILE_CACHE_STORE);

        return new Promise((resolve, reject) => {
            const request = objectStore.get(messageId);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    } catch (error) {}
    return null;
}

async function isFileDownloaded(messageId) {
    const cachedFile = await getDownloadedFile(messageId);
    return Boolean(cachedFile);
}

async function getDownloadDirectory() {
    try {
        if (!("showDirectoryPicker" in window)) {
            return null;
        }

        const dirHandle = await (async () => {
            try {
                const stored = localStorage.getItem("tintinchat_download_dir");
                if (stored) {
                    return JSON.parse(stored);
                }
            } catch (e) {
                localStorage.removeItem("tintinchat_download_dir");
            }
            return null;
        })();

        if (dirHandle) return dirHandle;

        const handle = await window.showDirectoryPicker({
            id: "tintinchat-downloads",
            mode: "readwrite",
            startIn: "downloads",
        });

        localStorage.setItem("tintinchat_download_dir", JSON.stringify(handle));
        return handle;
    } catch (error) {
        console.warn("File System Access API not available or permission denied:", error);
    }
    return null;
}

async function openCachedFile(messageId, fileName) {
    const cachedFile = await getDownloadedFile(messageId);
    if (!cachedFile) return false;

    try {
        const dirHandle = await getDownloadDirectory();
        if (dirHandle) {
            try {
                const fileHandle = await dirHandle.getFileHandle(cachedFile.fileName, {
                    create: true,
                });
                const writable = await fileHandle.createWritable();
                await writable.write(cachedFile.fileBlob);
                await writable.close();

                if ("launchQueue" in window) {
                    window.open(fileHandle);
                } else {
                    showModal(
                        "File Saved",
                        `File saved to your downloads folder:\n${cachedFile.fileName}`,
                        "success"
                    );
                }
                return true;
            } catch (fsError) {
                console.warn("File System Access error:", fsError);
                return await openCachedFileBlob(cachedFile);
            }
        } else {
            return await openCachedFileBlob(cachedFile);
        }
    } catch (error) {
        return false;
    }
}

async function openCachedFileBlob(cachedFile) {
    try {
        const url = URL.createObjectURL(cachedFile.fileBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = cachedFile.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        return false;
    }
}

async function downloadAndOpenFile(messageId, fileName) {
    // Check if file was previously downloaded
    const fileDownloaded = await isFileDownloaded(messageId);
    const fileIcon = document.querySelector(
        `[data-file-msg-id="${messageId}"] .file-download-icon i`
    );
    const container = document.querySelector(`[data-file-msg-id="${messageId}"]`);

    if (fileDownloaded) {
        if (fileIcon) {
            fileIcon.classList.add("fa-check-circle");
            fileIcon.classList.remove("fa-download");
        }

        const opened = await openCachedFile(messageId, fileName);
        if (opened) {
            return;
        }
    }

    // File not cached or failed to open cache - download fresh
    if (container) {
        container.style.opacity = "0.6";
    }
    if (fileIcon) {
        fileIcon.classList.add("fa-spinner", "fa-spin");
        fileIcon.classList.remove("fa-download");
    }

    try {
        const fileUrl = `api/get_file_message.php?id=${messageId}`;
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fileBlob = await response.blob();

        await saveDownloadedFile(messageId, fileName, fileBlob);

        const dirHandle = await getDownloadDirectory();

        if (dirHandle) {
            try {
                const fileHandle = await dirHandle.getFileHandle(fileName, {
                    create: true,
                });
                const writable = await fileHandle.createWritable();
                await writable.write(fileBlob);
                await writable.close();
            } catch (fsError) {
                console.warn("File System Access error:", fsError);
                const url = URL.createObjectURL(fileBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } else {
            const url = URL.createObjectURL(fileBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        showModal("Download Error", "Failed to download file: " + error.message, "error");
    } finally {
        if (container) {
            container.style.opacity = "1";
        }
        if (fileIcon) {
            fileIcon.classList.remove("fa-spinner", "fa-spin");
            fileIcon.classList.add("fa-download");
        }
    }
}

window.downloadAndOpenFile = downloadAndOpenFile;

document.addEventListener("DOMContentLoaded", () => {
    const imageModalOverlay = document.getElementById("imageModalOverlay");

    if (imageModalOverlay) {
        imageModalOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                closeImageModal();
            }
        });

        const imageModalContent = imageModalOverlay.querySelector(".image-modal-content");
        if (imageModalContent) {
            imageModalContent.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                if (
                    imageModalOverlay.style.display !== "none" &&
                    imageModalOverlay.classList.contains("visible")
                ) {
                    closeImageModal();
                }
            }
        });
    }
});

chatMessagesElem.addEventListener("scroll", () => {
    if (hasLoadedMoreMessages) {
        updateGoToLatestButton();
    }
});

window.playVoiceMessage = function (messageId) {
    const messageDiv = document.querySelector(`[data-message-id="${messageId}"]`);
    if (!messageDiv) return;

    const playBtn = messageDiv.querySelector(".voice-play-btn");
    const durationDisplay = messageDiv.querySelector(".voice-duration-display");

    let audio = messageDiv.querySelector("audio");
    if (!audio) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        audio = document.createElement("audio");
        audio.src = `api/get_voice_message.php?id=${messageId}`;
        audio.preload = "metadata";
        audio.style.display = "none"; // Hide the actual audio element
        messageDiv.appendChild(audio);

        const source = audioContext.createMediaElementSource(audio);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        messageDiv.audioAnalyser = { analyser, bufferLength, dataArray };

        audio.addEventListener("loadedmetadata", function () {
            if (isFinite(audio.duration)) {
                const duration = Math.round(audio.duration);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                durationDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
            } else {
                durationDisplay.textContent = "??:??";
            }
        });

        audio.addEventListener("timeupdate", function () {
            if (isFinite(audio.duration)) {
                const current = Math.round(audio.currentTime);
                const minutes = Math.floor(current / 60);
                const seconds = current % 60;
                durationDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                const progress = audio.currentTime / audio.duration;
                const waveformBars = messageDiv.querySelectorAll(".waveform-bar");
                const playedBarsCount = Math.floor(progress * waveformBars.length);

                waveformBars.forEach((bar, index) => {
                    if (index < playedBarsCount) {
                        bar.classList.add("played");
                    } else {
                        bar.classList.remove("played");
                    }
                });
            }
        });

        audio.addEventListener("ended", function () {
            playBtn.innerHTML = `<i class="fas fa-play"></i>`;
            playBtn.classList.remove("playing");

            messageDiv
                .querySelectorAll(".waveform-bar")
                .forEach((bar) => bar.classList.add("played"));
        });

        audio.addEventListener("error", function (e) {
            showModal(
                "Audio Error",
                "Unable to load voice message. The audio file may be missing or corrupted.",
                "error"
            );
            playBtn.disabled = true;
            playBtn.style.opacity = "0.5";
        });
    }

    const { analyser, dataArray } = messageDiv.audioAnalyser;
    const waveformBarsContainer = messageDiv.querySelector(".waveform-bars");

    function draw() {
        if (audio.paused || audio.ended) {
            if (activeAnalyser === analyser) activeAnalyser = null;

            const bars = waveformBarsContainer.children;
            for (let i = 0; i < bars.length; i++) {
                bars[i].style.height = `20%`;
            }

            return;
        }

        activeAnalyser = analyser;
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        const bars = waveformBarsContainer.children;
        const barCount = bars.length;

        for (let i = 0; i < barCount; i++) {
            const barHeight = Math.pow(dataArray[i] / 255, 2) * 100;
            bars[i].style.height = `${Math.max(10, barHeight)}%`;
        }
    }

    if (audio.paused) {
        document.querySelectorAll(".voice-play-btn.playing").forEach((btn) => {
            const audio = btn.closest(".voice-player-container").querySelector("audio");
            if (audio && !audio.paused) {
                audio.pause();
            }
            btn.classList.remove("playing");
            const i = btn.querySelector("i");
            i.classList.remove("fa-pause");
            i.classList.add("fa-play");
        });

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        audio.play().catch(function (error) {
            showModal("Playback Error", "Unable to play voice message. Please try again.", "error");
        });
        playBtn.classList.add("playing");
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        draw();
    } else {
        audio.pause();
        playBtn.classList.remove("playing");
        playBtn.innerHTML = `<i class="fas fa-play"></i>`;
    }
};

const sendTextMessage = async () => {
    if (!currentChatUser) {
        showModal("No Chat Selected", "Select a user to chat with first", "warning");
        return;
    }
    const text = chatInput.value.trim();
    if (!text) return;

    const sendBtn = chatForm.querySelector('button[type="submit"]');
    sendBtn.disabled = true;
    sendBtn.classList.add("btn-pressed");

    try {
        await sendEncryptedTextMessage(currentChatUser, text, currentReplyTarget?.messageId || null);

        addUserToChatList(currentChatUser);
        chatInput.value = "";
        clearReplyState();
    } catch (err) {
        showModal("Send Error", "Encryption/send error: " + err.message, "error");
    } finally {
        sendBtn.disabled = false;
        sendBtn.classList.remove("btn-pressed");
    }
};

const fileUploadInput = document.getElementById("fileUploadInput");
const sendBtn = document.getElementById("sendBtn");

let longPressTimer = null;
const LONG_PRESS_DURATION = 500;

sendBtn.addEventListener("mousedown", (e) => {
    longPressTimer = setTimeout(() => {
        e.preventDefault();
        fileUploadInput.click();
        longPressTimer = null;
    }, LONG_PRESS_DURATION);
});

sendBtn.addEventListener("mouseup", () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
});

sendBtn.addEventListener("mouseleave", () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
});

sendBtn.addEventListener("touchstart", (e) => {
    longPressTimer = setTimeout(() => {
        e.preventDefault();
        fileUploadInput.click();
        longPressTimer = null;
    }, LONG_PRESS_DURATION);
});

sendBtn.addEventListener("touchend", () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
});

fileUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        sendFileMessage(file);
    }
    e.target.value = null;
});

(function sendButtonFileHintOnce() {
    const btn = document.getElementById("sendBtn");
    if (!btn) return;
    const icon = btn.querySelector("i");
    if (!icon) return;

    const defaultIcon = "fa-paper-plane";
    const fileIcon = "fa-file";

    function changeIcon(fromIcon, toIcon, delay) {
        setTimeout(function () {
            icon.classList.add("icon-exit");

            setTimeout(function () {
                icon.classList.remove(fromIcon);
                icon.classList.add(toIcon);
            }, 300); // Change icon at midpoint of animation

            setTimeout(function () {
                icon.classList.remove("icon-exit");
                icon.classList.add("icon-enter");
            }, 300);

            setTimeout(function () {
                icon.classList.remove("icon-enter");
            }, 900);
        }, delay);
    }

    // First change: Send -> File (after 3 seconds)
    changeIcon(defaultIcon, fileIcon, 3000);

    // Second change: File -> Send (after 6 seconds)
    changeIcon(fileIcon, defaultIcon, 6000);
})();

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await sendTextMessage();
});

chatInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await sendTextMessage();
    }
});

chatInput.addEventListener("input", () => {
    chatInput.dir = isTextPersian(chatInput.value) ? "rtl" : "ltr";
});

searchUserInput.addEventListener("input", function () {
    const val = this.value.trim();
    const feedback = document.getElementById("searchUserFeedback");

    this.classList.remove("is-invalid", "is-valid");

    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    if (val.length < 3) {
        hideSuggestions();
        if (feedback) feedback.style.display = "none";
        return;
    }

    if (val && val !== CURRENT_USER) {
        if (/^[a-zA-Z][a-zA-Z0-9_-]{2,}$/.test(val)) {
            this.classList.remove("is-invalid");
            if (feedback) feedback.style.display = "none";

            searchTimeout = setTimeout(() => {
                searchUserSuggestions(val);
            }, 300);
        } else {
            this.classList.add("is-invalid");
            if (feedback) feedback.style.display = "block";
            hideSuggestions();
        }
    } else {
        if (feedback) feedback.style.display = "none";
        hideSuggestions();
    }
});

async function searchForUser(selectUser = false) {
    const val = searchUserInput.value.trim();
    if (!val || val === CURRENT_USER) return;

    if (selectUser && !/^[a-zA-Z][a-zA-Z0-9_-]{2,}$/.test(val)) {
        showModal(
            "Invalid Username",
            "Username must start with a letter and contain only letters, numbers, hyphens, and underscores.",
            "error"
        );
        searchUserInput.value = "";
        return;
    }

    const originalPlaceholder = searchUserInput.placeholder;
    searchUserInput.placeholder = "Checking user...";
    searchUserInput.disabled = true;

    try {
        const response = await fetch(
            `api/check_user_exists.php?username=${encodeURIComponent(val)}`
        );
        const data = await response.json();

        if (data.exists) {
            addUserToChatList(val);
            await selectChatUser(val);
            searchUserInput.value = "";
            hideSuggestions();
        } else if (selectUser) {
            showModal(
                "User Not Found",
                `User "${val}" does not exist. Please check the username and try again.`,
                "warning"
            );
            searchUserInput.value = "";
        }
    } catch (error) {
        showModal("Connection Error", "Error checking user existence. Please try again.", "error");
        searchUserInput.value = "";
    } finally {
        searchUserInput.placeholder = originalPlaceholder;
        searchUserInput.disabled = false;
    }
}
searchUserInput.addEventListener("keydown", async function (e) {
    const suggestions = searchSuggestions.querySelectorAll(".search-suggestion-item");

    switch (e.key) {
        case "ArrowDown":
            e.preventDefault();
            selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
            updateSuggestionSelection(suggestions);
            break;

        case "ArrowUp":
            e.preventDefault();
            selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
            updateSuggestionSelection(suggestions);
            break;

        case "Enter":
            e.preventDefault();
            if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
                await selectSuggestion(suggestions[selectedSuggestionIndex].dataset.username);
            } else {
                await searchForUser(true);
            }
            break;

        case "Escape":
            e.preventDefault();
            hideSuggestions();
            break;
    }
});

document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-container")) {
        hideSuggestions();
    }
});

searchUserInput.addEventListener("change", () => searchForUser());

async function searchUserSuggestions(query) {
    if (isSearching || query.length < 3) return;

    isSearching = true;
    showSearchLoading(true);

    if (window.updateSearchState) {
        window.updateSearchState("searching");
    }

    try {
        const response = await fetch(`api/search_users.php?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.users && data.users.length > 0) {
            showSuggestions(data.users);
        } else {
            hideSuggestions();
            if (window.updateSearchState) {
                window.updateSearchState("no-results");
            }
        }
    } catch (error) {
        hideSuggestions();
        if (window.updateSearchState) {
            window.updateSearchState("idle");
        }
    } finally {
        isSearching = false;
        showSearchLoading(false);
    }
}

function showSuggestions(users) {
    currentSuggestions = users;
    selectedSuggestionIndex = -1;

    searchSuggestions.innerHTML = "";

    users.forEach((username, index) => {
        const item = document.createElement("div");
        item.className = "search-suggestion-item";
        item.dataset.username = username;
        item.dataset.index = index;

        const initials = username
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

        item.innerHTML = `
            <div class="search-suggestion-avatar">${initials}</div>
            <div class="search-suggestion-username">${username}</div>
            <i class="fas fa-arrow-right search-suggestion-icon"></i>
        `;

        item.addEventListener("click", () => selectSuggestion(username));
        item.addEventListener("mouseenter", () => {
            selectedSuggestionIndex = index;
            updateSuggestionSelection(
                searchSuggestions.querySelectorAll(".search-suggestion-item")
            );
        });

        searchSuggestions.appendChild(item);
    });

    searchSuggestions.style.display = "block";
    searchUserInput.classList.add("suggestions-active");
}

function hideSuggestions() {
    searchSuggestions.style.display = "none";
    searchUserInput.classList.remove("suggestions-active");
    selectedSuggestionIndex = -1;
    currentSuggestions = [];

    if (window.updateSearchState) {
        window.updateSearchState("idle");
    }
}

function updateSuggestionSelection(suggestions) {
    suggestions.forEach((item, index) => {
        if (index === selectedSuggestionIndex) {
            item.style.backgroundColor =
                "color-mix(in srgb, var(--secondary-color) 15%, transparent)";
            item.style.transform = "translateX(4px)";
        } else {
            item.style.backgroundColor = "";
            item.style.transform = "";
        }
    });
}

async function selectSuggestion(username) {
    const isANewUser = addUserToChatList(username);
    await selectChatUser(username);
    searchUserInput.value = "";
    hideSuggestions();

    if (isANewUser && window.UIEnhancements) {
        window.UIEnhancements.showSearchNotification(`Started chat with ${username}`, "success");
    }
}

function showSearchLoading(show) {
    if (searchLoading) {
        searchLoading.style.display = show ? "block" : "none";
    }
}

chatInput.disabled = true;
chatInput.textContent = "Select someone to chat...";
fetchAndImportPrivateKey().catch((err) => {
    showModal("Key Error", "Error loading private key: " + err.message, "error");
});

async function loadChatList() {
    try {
        const res = await fetch("api/fetch_chats.php");
        if (!res.ok) throw new Error("Failed to load chat list");
        const data = await res.json();
        if (chatUsers?.size === data.chatUsers.length) {
            return;
        }
        if (data.chatUsers && Array.isArray(data.chatUsers)) {
            data.chatUsers.forEach(addUserToChatList);
        }
    } catch (e) {}
}

loadChatList();

let chatListTriggerTime = 0;

setInterval(async () => {
    if (!navigator.onLine) {
        return;
    }
    await Promise.all([
        currentChatUser?.length && forceFetchCurrentChatMessages(),
        !(chatListTriggerTime % 10) && loadChatList(),
    ]);
    chatListTriggerTime = ++chatListTriggerTime % 10;
}, 1000);

voiceBtn.addEventListener("click", async () => {
    if (!currentChatUser) {
        showModal("No Chat Selected", "Select a user to chat with first", "warning");
        return;
    }
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            recordingStartTime = Date.now();
            shouldSendRecording = true;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunks.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                if (shouldSendRecording && audioChunks.length > 0) {
                    const audioBlob = new Blob(audioChunks, {
                        type: "audio/webm",
                    });
                    await sendVoiceMessage(audioBlob);
                }

                stream.getTracks().forEach((track) => track.stop());
                resetRecordingState();
            };

            mediaRecorder.start();
            isRecording = true;
            setRecordingState(true);

            addRecordingIndicator();
        } catch (err) {
            showModal("Microphone Error", "Microphone access denied or not available.", "error");
        }
    } else {
        stopRecording();
    }
});

function setRecordingState(recording) {
    if (recording) {
        voiceBtn.classList.add("btn-danger");
        voiceBtn.classList.remove("btn-secondary");
        voiceBtn.innerHTML = `<i class="fas fa-stop"></i>`;
        voiceBtn.title = "Stop recording (click to stop)";
    } else {
        voiceBtn.classList.remove("btn-danger");
        voiceBtn.classList.add("btn-secondary");
        voiceBtn.innerHTML = `<i class="fas fa-microphone"></i>`;
        voiceBtn.title = "Record voice message";
    }
}

function resetRecordingState() {
    isRecording = false;
    setRecordingState(false);
    removeRecordingIndicator();
}

function addRecordingIndicator() {
    const indicator = document.createElement("div");
    indicator.id = "recordingIndicator";
    indicator.className = "recording-indicator";
    indicator.innerHTML = `
    <div class="recording-content">
      <div class="recording-dot"></div>
      <span class="px-1 px-lg-5 pg-md-5">Recording...</span>
      <button type="button" class="btn btn-sm btn-outline-light me-2" onclick="stopRecording()" title="Stop Recording">
        <i class="fas fa-stop"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-danger" onclick="cancelRecording()" title="Cancel Recording">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
    chatMessagesElem.appendChild(indicator);
    chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;

    setTimeout(() => {
        chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;
    }, 100);
}

function removeRecordingIndicator() {
    const indicator = document.getElementById("recordingIndicator");
    if (indicator) {
        indicator.remove();
    }
}

function stopRecording() {
    if (isRecording && mediaRecorder) {
        shouldSendRecording = true;
        mediaRecorder.stop();
    }
}

function cancelRecording() {
    if (isRecording && mediaRecorder) {
        shouldSendRecording = false;
        mediaRecorder.stop();
    }
}

window.stopRecording = stopRecording;
window.cancelRecording = cancelRecording;

async function sendVoiceMessage(audioBlob) {
    try {
        const sendingIndicator = document.createElement("div");
        sendingIndicator.className = "message sent sending-indicator";
        sendingIndicator.innerHTML = `
      <div class="voice-message-sending">
        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
        <span>Sending voice message...</span>
      </div>
    `;
        chatMessagesElem.appendChild(sendingIndicator);
        chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;

        setTimeout(() => {
            chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;
        }, 100);

        const formData = new FormData();
        formData.append("target", currentChatUser);
        formData.append("message", null); // TODO: Add caption for voice messages
        formData.append("message_for_sender", null);
        formData.append("voice_file", audioBlob, "voice_message.webm");

        const res = await fetch("api/send_voice_message.php", {
            method: "POST",
            headers: getCsrfHeaders(),
            body: formData,
        });

        const json = await res.json();
        if (json.status !== "ok") throw new Error(json.error || "Send failed");

        sendingIndicator.remove();

        addUserToChatList(currentChatUser);
        loadCurrentChatsRecentMessages();
    } catch (err) {
        showModal("Voice Send Error", "Voice message send error: " + err.message, "error");

        const sendingIndicator = document.querySelector(".sending-indicator");
        if (sendingIndicator) sendingIndicator.remove();
    }
}

imageUploadBtn.addEventListener("click", () => {
    if (!currentChatUser) {
        showModal("No Chat Selected", "Select a user to chat with first", "warning");
        return;
    }
    imageUploadInput.click();
});

imageUploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith("image/")) {
            showModal("Invalid File Type", "Please select an image file.", "warning");
            e.target.value = null;
            return;
        }

        if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
            showModal("File Too Large", "Image file size must be less than 5MB.", "warning");
            e.target.value = null;
            return;
        }

        sendImageMessage(file);
    }

    e.target.value = null;
});

async function sendImageMessage(imageFile) {
    try {
        const sendingIndicator = document.createElement("div");
        sendingIndicator.className = "message sent sending-indicator";
        sendingIndicator.innerHTML = `
      <div class="image-message-sending">
        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
        <span>Sending image...</span>
      </div>
    `;
        chatMessagesElem.appendChild(sendingIndicator);
        chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;

        setTimeout(() => {
            chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;
        }, 100);

        imageUploadBtn.disabled = true;

        const formData = new FormData();
        formData.append("target", currentChatUser);
        formData.append("message", null); // TODO: Add caption for image messages
        formData.append("message_for_sender", null);
        formData.append("image_file", imageFile, imageFile.name);

        const res = await fetch("api/send_image_message.php", {
            method: "POST",
            headers: getCsrfHeaders(),
            body: formData,
        });

        const json = await res.json();
        if (json.status !== "ok") throw new Error(json.error || "Send failed");

        sendingIndicator.remove();

        addUserToChatList(currentChatUser);
        loadCurrentChatsRecentMessages();
    } catch (err) {
        showModal("Image Send Error", "Image send error: " + err.message, "error");

        const sendingIndicator = document.querySelector(".sending-indicator");
        if (sendingIndicator) sendingIndicator.remove();
    } finally {
        imageUploadBtn.disabled = false;
    }
}

async function sendFileMessage(file) {
    if (!currentChatUser) {
        showModal("No Chat Selected", "Select a user to chat with first", "warning");
        return;
    }

    if (file.size > FILE_UPLOAD_MAX_BYTES) {
        showModal("File Too Large", "File size must be less than 50MB.", "warning");
        return;
    }

    try {
        const sendingIndicator = document.createElement("div");
        sendingIndicator.className = "message sent sending-indicator";
        sendingIndicator.innerHTML = `
      <div class="file-message-sending">
        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
        <span>Sending file...</span>
      </div>
    `;
        chatMessagesElem.appendChild(sendingIndicator);
        chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;

        setTimeout(() => {
            chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;
        }, 100);

        const formData = new FormData();
        formData.append("target", currentChatUser);
        formData.append("message", null);
        formData.append("message_for_sender", null);
        formData.append("file", file, file.name);

        const res = await fetch("api/send_file_message.php", {
            method: "POST",
            headers: getCsrfHeaders(),
            body: formData,
        });

        const json = await res.json();
        if (json.status !== "ok") throw new Error(json.error || "Send failed");

        sendingIndicator.remove();

        addUserToChatList(currentChatUser);
        loadCurrentChatsRecentMessages();
    } catch (err) {
        showModal("File Send Error", "File send error: " + err.message, "error");

        const sendingIndicator = document.querySelector(".sending-indicator");
        if (sendingIndicator) sendingIndicator.remove();
    }
}
