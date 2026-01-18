const chatListElem = document.getElementById("chatList");
const chatMessagesElem = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatWithElem = document.getElementById("chatWith");
const searchUserInput = document.getElementById("searchUser");
const imageUploadInput = document.getElementById("imageUploadInput");
const imageUploadBtn = document.getElementById("imageUploadBtn");

const searchSuggestions = document.getElementById("searchSuggestions");
const searchLoading = document.getElementById("searchLoading");

let currentChatUser = null;
let currentChatRecentMessages = null;
const chatUsers = new Set();
let messageOffset = 0;
let hasMoreMessages = true;
let isLoadingMessages = false;
let hasLoadedMoreMessages = false; // Track if user has clicked Load More at least once
const MESSAGES_PER_PAGE = 30;

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

function isTextPersian(text) {
    return /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF]/.test(text);
}

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
    if (username === currentChatUser) {
        return;
    }
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
            `api/fetch_messages.php?with=${encodeURIComponent(username)}&limit=${MESSAGES_PER_PAGE}&offset=${offset}`
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
                    previosLastMessageId = currentChatRecentMessages?.[currentChatRecentMessages.length - 1]?.id;
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
    } catch (err) {
        chatMessagesElem.textContent = "Error loading messages";
        console.error(err);
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
            `api/fetch_recent_messages.php?with=${encodeURIComponent(currentChatUser)}&offsetMsgId=${
                currentChatRecentMessages[currentChatRecentMessages.length - 1].id
            }`
        );
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();

        if (!data?.messages?.length) {
            return;
        }
        currentChatRecentMessages = data.messages;
        messageOffset += currentChatRecentMessages?.length ?? 0;
        for (const msg of currentChatRecentMessages) {
            await addMessageToChat(msg);
        }
        if (!hasLoadedMoreMessages) {
            requestAnimationFrame(() => {
                chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;
            });
        }
    } catch (err) {
        isLoadingMessages = false;
        await loadMessages(currentChatUser, false, !currentChatRecentMessages?.length);
    } finally {
        isLoadingMessages = false;
    }
}

function forceFetchCurrentChatMessages() {
    if (!currentChatRecentMessages?.length) {
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
function newDateTag(msg, { atLeft = true, topSpace = 3, fontSize = 10, extraStyles = '' }) {
    return `<span class="mx-2 mt-${topSpace}" style="font-size: ${fontSize}px; float: ${
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
            ${newDateTag(msg, { atLeft: msg.sender_id == CURRENT_USER_ID, topSpace: 1, fontSize: 8.5, extraStyles: 'color: var(--text-color);' })}
        `;
        div.setAttribute("data-message-id", msg.id);
    } else if (msg.message_type === "image" && msg.image_file_path) {
        div.classList.add("is-image-message");

        // div.innerHTML = `<a href="api/get_image.php?id=${msg.id}" target="_blank" title="View full image">
        div.innerHTML = `<a href="api/get_image.php?id=${msg.id}" title="View full image">
                    <img src="api/get_image.php?id=${msg.id}" class="message-image" alt="Image from ${msg.sender_id}" 
                        onerror="this.parentNode.innerHTML='<div style=\\'padding: 20px; text-align: center; color: #6c757d;\\'>Image not available</div>'">
                </a>${newDateTag(msg, { atLeft: msg.sender_id == CURRENT_USER_ID, topSpace: 1, fontSize: 8.5, extraStyles: 'color: var(--text-color);' })}`;
        // onload="this.parentNode.parentNode.parentNode.scrollTop = this.parentNode.parentNode.parentNode.scrollHeight"

        // showModal()
    } else {
        let decryptedText = "[Unable to decrypt message]";
        try {
            if (msg.sender_id == CURRENT_USER_ID) {
                decryptedText = await decryptLongMessage(msg.message_for_sender);
            } else {
                decryptedText = await decryptLongMessage(msg.message);
            }
        } catch (e) {
            decryptedText = "[Unsupported message]";
        }
        const isPersian = isTextPersian(decryptedText.trim());
        div.innerHTML = `<span>${decryptedText}</span>${newDateTag(msg, { atLeft: isPersian })}`;
        if (isPersian) {
            div.dir = "rtl";
        }
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
        chatMessagesElem.scrollTop + chatMessagesElem.clientHeight >= chatMessagesElem.scrollHeight - 100;

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

            messageDiv.querySelectorAll(".waveform-bar").forEach((bar) => bar.classList.add("played"));
        });

        audio.addEventListener("error", function (e) {
            console.error("Audio error:", e);
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
            console.error("Playback error:", error);
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
        const recipientKey = await getPublicKey(currentChatUser);
        const senderKey = await getPublicKey(CURRENT_USER);

        const encryptedForRecipient = await encryptLongMessage(text, recipientKey, isTextPersian(text));
        const encryptedForSender = await encryptLongMessage(text, senderKey, isTextPersian(text));

        const formData = new FormData();
        formData.append("target", currentChatUser);
        formData.append("message", encryptedForRecipient);
        formData.append("message_for_sender", encryptedForSender);

        const res = await fetch("api/send_message.php", {
            method: "POST",
            body: formData,
        });
        const json = await res.json();
        if (json.status !== "ok") throw new Error(json.error || "Send failed");

        addUserToChatList(currentChatUser);
        chatInput.value = "";
        await loadCurrentChatsRecentMessages();
    } catch (err) {
        showModal("Send Error", "Encryption/send error: " + err.message, "error");
    } finally {
        sendBtn.disabled = false;
        sendBtn.classList.remove("btn-pressed");
    }
};

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
        const response = await fetch(`api/check_user_exists.php?username=${encodeURIComponent(val)}`);
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
        console.error("Search error:", error);
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
            updateSuggestionSelection(searchSuggestions.querySelectorAll(".search-suggestion-item"));
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
            item.style.backgroundColor = "color-mix(in srgb, var(--secondary-color) 15%, transparent)";
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
    } catch (e) {
        console.error("Error loading chat list:", e);
    }
}

loadChatList();

let chatListTriggerTime = 0;

setInterval(async () => {
    if (!navigator.onLine) {
        return;
    }
    await Promise.all([
        currentChatUser?.length && loadCurrentChatsRecentMessages(),
        !(chatListTriggerTime % 5) && loadChatList(),
    ]);
    chatListTriggerTime = ++chatListTriggerTime % 5;
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
            body: formData,
        });

        const json = await res.json();
        if (json.status !== "ok") throw new Error(json.error || "Send failed");

        sendingIndicator.remove();

        addUserToChatList(currentChatUser);
        await loadCurrentChatsRecentMessages();
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

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
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
            body: formData,
        });

        const json = await res.json();
        if (json.status !== "ok") throw new Error(json.error || "Send failed");

        sendingIndicator.remove();

        addUserToChatList(currentChatUser);
        await loadCurrentChatsRecentMessages();
    } catch (err) {
        showModal("Image Send Error", "Image send error: " + err.message, "error");

        const sendingIndicator = document.querySelector(".sending-indicator");
        if (sendingIndicator) sendingIndicator.remove();
    } finally {
        imageUploadBtn.disabled = false;
    }
}
