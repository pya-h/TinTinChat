const chatListElem = document.getElementById("chatList");
const chatMessagesElem = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const stickerPickerBtn = document.getElementById("stickerPickerBtn");
const stickerPickerMenu = document.getElementById("stickerPickerMenu");
const stickerPickerGrid = document.getElementById("stickerPickerGrid");
const stickerPickerState = document.getElementById("stickerPickerState");
const stickerPickerProgress = document.getElementById("stickerPickerProgress");
const stickerPickerProgressFill = document.getElementById("stickerPickerProgressFill");
const stickerUploadBtn = document.getElementById("stickerUploadBtn");
const stickerUploadInput = document.getElementById("stickerUploadInput");
const stickerBgChoiceOverlay = document.getElementById("stickerBgChoiceOverlay");
const stickerBgChoiceClose = document.getElementById("stickerBgChoiceClose");
const stickerBgChoiceLoading = document.getElementById("stickerBgChoiceLoading");
const stickerBgChoiceGrid = document.getElementById("stickerBgChoiceGrid");
const stickerBgKeepBtn = document.getElementById("stickerBgKeepBtn");
const stickerBgRemoveBtn = document.getElementById("stickerBgRemoveBtn");
const stickerBgKeepPreview = document.getElementById("stickerBgKeepPreview");
const stickerBgRemovePreview = document.getElementById("stickerBgRemovePreview");
const replyPreviewElem = document.getElementById("replyPreview");
const composerStatusElem = document.getElementById("composerStatus");
const chatWithElem = document.getElementById("chatWith");
const searchUserInput = document.getElementById("searchUser");
const imageUploadInput = document.getElementById("imageUploadInput");
const imageCaptureInput = document.getElementById("imageCaptureInput");
const videoUploadInput = document.getElementById("videoUploadInput");
const videoCaptureInput = document.getElementById("videoCaptureInput");
const imageUploadBtn = document.getElementById("imageUploadBtn");
const imageSourceMenu = document.getElementById("imageSourceMenu");
const imageSourceMenuHint = document.getElementById("imageSourceMenuHint");
const imageSourceGalleryBtn = document.getElementById("imageSourceGalleryBtn");
const imageSourceCameraBtn = document.getElementById("imageSourceCameraBtn");
const imageSourceSelectVideoBtn = document.getElementById("imageSourceSelectVideoBtn");
const imageSourceRecordVideoBtn = document.getElementById("imageSourceRecordVideoBtn");
const cameraCaptureOverlay = document.getElementById("cameraCaptureOverlay");
const cameraCaptureVideo = document.getElementById("cameraCaptureVideo");
const cameraCaptureCanvas = document.getElementById("cameraCaptureCanvas");
const cameraCaptureTakeBtn = document.getElementById("cameraCaptureTake");
const cameraCaptureCancelBtn = document.getElementById("cameraCaptureCancel");
const cameraCaptureCloseBtn = document.getElementById("cameraCaptureClose");
const videoCaptureOverlay = document.getElementById("videoCaptureOverlay");
const videoCaptureVideo = document.getElementById("videoCaptureVideo");
const videoCaptureStartBtn = document.getElementById("videoCaptureStart");
const videoCaptureStopBtn = document.getElementById("videoCaptureStop");
const videoCaptureCancelBtn = document.getElementById("videoCaptureCancel");
const videoCaptureCloseBtn = document.getElementById("videoCaptureClose");
const videoCaptureTimer = document.getElementById("videoCaptureTimer");
const composerToolsToggleBtn = document.getElementById("composerToolsToggle");
const settingsButton = document.getElementById("chatSettingsBtn");
const quickConversationSearchBtn = document.getElementById("quickConversationSearchBtn");
const settingsPanel = document.getElementById("chatSettingsPanel");
const openUiSettingsBtn = document.getElementById("openUiSettingsBtn");
const settingNotificationSound = document.getElementById("settingNotificationSound");
const settingAutoScroll = document.getElementById("settingAutoScroll");
const settingThemeMode = document.getElementById("settingThemeMode");
const settingDensityMode = document.getElementById("settingDensityMode");
const settingFontScale = document.getElementById("settingFontScale");
const settingShowTimestamps = document.getElementById("settingShowTimestamps");
const settingReduceMotion = document.getElementById("settingReduceMotion");
const chatUiSettingsOverlay = document.getElementById("chatUiSettingsOverlay");
const chatUiSettingsClose = document.getElementById("chatUiSettingsClose");
const chatUiSettingsTabGeneral = document.getElementById("chatUiSettingsTabGeneral");
const chatUiSettingsTabAccount = document.getElementById("chatUiSettingsTabAccount");
const chatUiSettingsTabIdeas = document.getElementById("chatUiSettingsTabIdeas");
const chatUiSettingsTabAdmin = document.getElementById("chatUiSettingsTabAdmin");
const chatUiSettingsPanelGeneral = document.getElementById("chatUiSettingsPanelGeneral");
const chatUiSettingsPanelAccount = document.getElementById("chatUiSettingsPanelAccount");
const chatUiSettingsPanelIdeas = document.getElementById("chatUiSettingsPanelIdeas");
const chatUiSettingsPanelAdmin = document.getElementById("chatUiSettingsPanelAdmin");
const settingBrowserNotifications = document.getElementById("settingBrowserNotifications");
const settingSendByEnter = document.getElementById("settingSendByEnter");
const settingShowSavedMessages = document.getElementById("settingShowSavedMessages");
const settingsGroupKeyHealthBtn = document.getElementById("settingsGroupKeyHealthBtn");
const savedMessagesInfoBtn = document.getElementById("savedMessagesInfoBtn");
const playlistOverlay = document.getElementById("playlistOverlay");
const playlistBody = document.getElementById("playlistBody");
const playlistCloseBtn = document.getElementById("playlistCloseBtn");
const alertPanelBtn = document.getElementById("alertPanelBtn");
const alertUnreadDot = document.getElementById("alertUnreadDot");
const announcementsOverlay = document.getElementById("announcementsOverlay");
const announcementsBody = document.getElementById("announcementsBody");
const announcementsCloseBtn = document.getElementById("announcementsCloseBtn");
/* Admin DOM elements moved to chat-admin.js */
const openConversationSearchBtn = document.getElementById("openConversationSearchBtn");
const openAvatarUploadBtn = document.getElementById("openAvatarUploadBtn");
const settingsAvatarUploadBtn = document.getElementById("settingsAvatarUploadBtn");
const settingsAvatarPreview = document.getElementById("settingsAvatarPreview");
const avatarUploadInput = document.getElementById("avatarUploadInput");
const settingsUsernameForm = document.getElementById("settingsUsernameForm");
const settingsCurrentUsername = document.getElementById("settingsCurrentUsername");
const settingsUsernameInput = document.getElementById("settingsUsernameInput");
const settingsPasswordForm = document.getElementById("settingsPasswordForm");
const settingsCurrentPasswordInput = document.getElementById("settingsCurrentPasswordInput");
const settingsNewPasswordInput = document.getElementById("settingsNewPasswordInput");
const settingsConfirmPasswordInput = document.getElementById("settingsConfirmPasswordInput");
/* Blocked users DOM elements moved to chat-admin.js */
const loggedInUsernameElem = document.getElementById("loggedInUsername");
const logoutForm = document.getElementById("logoutForm");
const selectModeBar = document.getElementById("selectModeBar");
const selectModeCount = document.getElementById("selectModeCount");
const selectModeCancelBtn = document.getElementById("selectModeCancelBtn");
const selectModeCopyBtn = document.getElementById("selectModeCopyBtn");
const selectModeForwardBtn = document.getElementById("selectModeForwardBtn");
const selectModeDeleteBtn = document.getElementById("selectModeDeleteBtn");
const pasteClipboardImageBtn = document.getElementById("pasteClipboardImageBtn");
const messageActionModalOverlay = document.getElementById("messageActionModalOverlay");
const messageActionModalTitle = document.getElementById("messageActionModalTitle");
const messageActionModalBody = document.getElementById("messageActionModalBody");
const messageActionModalClose = document.getElementById("messageActionModalClose");
const messageActionModalAnnouncer = document.getElementById("messageActionModalAnnouncer");
const createGroupBtn = document.getElementById("createGroupBtn");
const groupKeyHealthBtn = document.getElementById("groupKeyHealthBtn");
const groupInfoBtn = document.getElementById("groupInfoBtn");
const groupInfoBackBtn = document.getElementById("groupInfoBackBtn");
const groupInfoPanel = document.getElementById("groupInfoPanel");
const groupInfoTitle = document.getElementById("groupInfoTitle");
const groupInfoDescription = document.getElementById("groupInfoDescription");
const groupInfoMemberCount = document.getElementById("groupInfoMemberCount");
const groupInfoMembers = document.getElementById("groupInfoMembers");
const groupAddMemberBtn = document.getElementById("groupAddMemberBtn");
const groupJoinLinkInput = document.getElementById("groupJoinLinkInput");
const groupCopyJoinLinkBtn = document.getElementById("groupCopyJoinLinkBtn");
const groupRotateJoinLinkBtn = document.getElementById("groupRotateJoinLinkBtn");
const groupTransferOwnerBtn = document.getElementById("groupTransferOwnerBtn");
const groupLeaveBtn = document.getElementById("groupLeaveBtn");
const chatAreaElem = document.querySelector(".chat-area");
const typingIndicatorElem = document.getElementById("typingIndicator");
const conversationSearchBar = document.getElementById("conversationSearchBar");
const conversationSearchInput = document.getElementById("conversationSearchInput");
const conversationSearchCount = document.getElementById("conversationSearchCount");
const conversationSearchPrevBtn = document.getElementById("conversationSearchPrev");
const conversationSearchNextBtn = document.getElementById("conversationSearchNext");
const conversationSearchCloseBtn = document.getElementById("conversationSearchClose");
const createGroupModalOverlay = document.getElementById("createGroupModalOverlay");
const createGroupModalClose = document.getElementById("createGroupModalClose");
const createGroupForm = document.getElementById("createGroupForm");
const createGroupTitleInput = document.getElementById("createGroupTitleInput");
const createGroupDetailsInput = document.getElementById("createGroupDetailsInput");
const createGroupSubmitBtn = document.getElementById("createGroupSubmitBtn");
const userInfoBtn = document.getElementById("userInfoBtn");
const userProfileModalOverlay = document.getElementById("userProfileModalOverlay");
const userProfileModalClose = document.getElementById("userProfileModalClose");
const userProfileModalBody = document.getElementById("userProfileModalBody");
const avatarViewerOverlay = document.getElementById("avatarViewerOverlay");
const avatarViewerClose = document.getElementById("avatarViewerClose");
const avatarViewerImage = document.getElementById("avatarViewerImage");
const avatarViewerTitle = document.getElementById("avatarViewerTitle");

const appConstants = window.APP_CONSTANTS || {};

const searchSuggestions = document.getElementById("searchSuggestions");
const searchLoading = document.getElementById("searchLoading");
const IMAGE_UPLOAD_MAX_BYTES = Number(appConstants.uploadImageMaxBytes) || 20 * 1024 * 1024;
const FILE_UPLOAD_MAX_BYTES = Number(appConstants.uploadFileMaxBytes) || 100 * 1024 * 1024;
const AVATAR_UPLOAD_MAX_BYTES = Number(appConstants.uploadAvatarMaxBytes) || 5 * 1024 * 1024;
const STICKER_UPLOAD_MAX_BYTES = Number(appConstants.uploadStickerMaxBytes) || 512 * 1024;
const STICKER_CANVAS_SIZE = Number(appConstants.stickerCanvasSize) || 512;
const SEARCH_MIN_QUERY_LENGTH = Number(appConstants.usernameMinLength) || 3;
const MESSAGE_LONG_PRESS_MS = 500;
const DOUBLE_TAP_MS = 280;
const LONG_PRESS_MOVE_CANCEL_PX = 12;
const SETTINGS_STORAGE_KEY = "tintinchat.settings.v1";
const MOBILE_BREAKPOINT_WIDTH = 767.98;
const CHAT_REFRESH_POLL_MS = Number(appConstants.chatRefreshPollMs) || 1000;
const SEEN_STATUS_POLL_MS = Number(appConstants.seenStatusPollMs) || 3000;
const TYPING_IDLE_TIMEOUT_MS = 3200;
const TYPING_UPDATE_THROTTLE_MS = 3500;
const MESSAGE_EDIT_WINDOW_MS = Number(appConstants.messageEditWindowMs) || 15 * 60 * 1000;
const REACTION_EMOJI_SET = ["\u{1F44D}", "\u2764\uFE0F", "\u{1F602}", "\u{1F62E}", "\u{1F622}", "\u{1F525}", "\u{1F420}"];
const BLOCKED_ATTACHMENT_EXTENSIONS = new Set([
    "php", "phtml", "php3", "php4", "php5", "phar",
    "exe", "msi", "bat", "cmd", "com", "scr",
    "sh", "bash", "zsh", "ps1",
    "js", "mjs", "cjs",
]);
const I18N_TEXT = {
    modalOpened: "Opened {title} dialog.",
    modalClosed: "Closed {title} dialog.",
    copiedTitle: "Copied",
    copiedBody: "Message copied to clipboard.",
    copyFailedTitle: "Copy Failed",
    copyFailedNoText: "This message cannot be copied.",
    copyFailedUnknown: "Unable to copy message.",
    messageDetailsTitle: "Message Details",
    forwardTitle: "Forward Message",
    forwardFailedTitle: "Forward Failed",
    forwardFailedOnlyText: "Only text messages can be forwarded right now.",
    forwardFailedInvalidTarget: "Invalid forward target.",
    forwardedTitle: "Forwarded",
    forwardedBody: "Message forwarded to {destination}.",
    forwardTargetEmpty: "No chats available yet. Start a chat first, then try forwarding.",
    noChatSelectedTitle: "No Chat Selected",
    noChatSelectedBody: "Select a user to chat with first",
    sendErrorTitle: "Send Error",
    sendErrorBody: "Encryption/send error: {error}",
    downloadErrorTitle: "Download Error",
    downloadErrorBody: "Failed to download file: {error}",
    playbackErrorTitle: "Playback Error",
    playbackErrorBody: "Unable to play voice message. Please try again.",
    connectionErrorTitle: "Connection Error",
    connectionErrorBody: "Error checking user existence. Please try again.",
    keyErrorTitle: "Key Error",
    keyErrorBody: "Error loading private key: {error}",
    microphoneErrorTitle: "Microphone Error",
    microphoneErrorBody: "Microphone access denied or not available.",
    voiceSendErrorTitle: "Voice Send Error",
    voiceSendErrorBody: "Voice message send error: {error}",
    invalidFileTypeTitle: "Invalid File Type",
    invalidFileTypeImageBody: "Please select an image file.",
    fileTooLargeTitle: "File Too Large",
    imageTooLargeBody: "Image file size must be less than 20MB.",
    fileTooLargeBody: "File size must be less than 100MB.",
    imageSendErrorTitle: "Image Send Error",
    imageSendErrorBody: "Image send error: {error}",
    reactTitle: "React to Message",
    reactFailedTitle: "Reaction Failed",
    reactFailedBody: "Unable to update reaction.",
};

let currentChatUser = null;
let currentChatRecentMessages = null;
let lastRecentPollTime = "";
let currentReplyTarget = null;
const chatUsers = new Set();
const chatGroupsById = new Map();
const groupDetailsCache = new Map();
const groupTextCryptoKeyCache = new Map();
const groupTextCryptoKeyInflight = new Map();
const groupKeyVersionCache = new Map();
let messageOffset = 0;
let hasMoreMessages = true;
let isLoadingMessages = false;
let hasLoadedMoreMessages = false; // Track if user has clicked Load More at least once
const MESSAGES_PER_PAGE = Number(appConstants.messagesPerPage) || 50;

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
let globalNpAudio = null;
let globalNpCaption = "";
let globalNpType = ""; // "voice" or "music"

let initialViewportHeight = window.innerHeight;
let lastContextMenuMessageElement = null;
let lastReactionPickerMessageElement = null;
let lastFocusedElementBeforeActionModal = null;
const pendingSeenMessageIds = new Set();
const messageMetaById = new Map();
const decryptedMediaCacheByMessageId = new Map();
const typingStateByTarget = new Map();
const typingLastSentAtByTarget = new Map();
const typingInflightByTarget = new Set();
let typingStopTimer = null;
let imageSourceMenuHideTimer = null;
let suppressNextContextMenuTapUntil = 0;
let contextMenuJustClosedAt = 0;
let refreshMediaCacheLabelGlobal = () => {};
let cameraStream = null;
let isCameraCaptureBusy = false;
let hasVideoInputDevice = null;
let videoCaptureStream = null;
let videoCaptureRecorder = null;
let videoCaptureChunks = [];
let videoCaptureTimerIntervalId = null;
let videoCaptureStartedAt = 0;
let shouldSendVideoCapture = false;
let conversationSearchToken = 0;
let conversationSearchResults = [];
let conversationSearchResultIndex = -1;
let avatarCacheVersion = Date.now();
let activeUserProfile = null;
let lastFocusedElementBeforeUserProfileModal = null;
let stickersCache = [];
let isStickersLoading = false;
let hasLoadedStickers = false;
let snapToBottomRafId = 0;
let snapToBottomTimerIds = [];
let goToLatestRafId = 0;
let retryLastSendAction = null;
let activeSettingsTab = "general";
let currentSelfUsername = String(CURRENT_USER || "");
let isRefreshLoopBusy = false;
let isSeenLoopBusy = false;
let pendingClipboardImageFile = null;
let isChatInputFocused = false;
/* Admin state moved to chat-admin.js */

const chatUserIdsByUsername = new Map();

const appSettings = {
    notificationSoundEnabled: true,
    autoScrollEnabled: true,
    mobileComposerExpanded: false,
    themeMode: "system",
    densityMode: "comfortable",
    fontScale: "md",
    showTimestamps: true,
    reduceMotion: false,
    browserNotificationsEnabled: false,
    sendByEnter: true,
    showSavedMessages: true,
};

const selectedMessageIds = new Set();
let isSelectModeActive = false;
let activeEditMessageId = 0;

const CUSTOM_SOUND_PATH = "assets/sounds/notification.mp3";
const chatUtils = window.ChatUtils || {
    parseStoredBoolean(value, fallback = true) {
        if (typeof value === "boolean") {
            return value;
        }
        if (typeof value === "string") {
            if (value === "true") {
                return true;
            }
            if (value === "false") {
                return false;
            }
        }
        return fallback;
    },
    isTextPersian(text) {
        return /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF]/.test(text);
    },
    escapeHtml(text) {
        const div = document.createElement("div");
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    },
    formatMessageTimestamp(timestamp) {
        if (!timestamp) {
            return "-";
        }
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) {
            return "-";
        }
        return date.toLocaleString("default", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    },
    formatI18nText(template, values = {}) {
        return String(template || "").replace(/\{(\w+)\}/g, (_, key) => {
            const value = values[key];
            return value == null ? "" : String(value);
        });
    },
};

const {
    parseStoredBoolean,
    isTextPersian,
    escapeHtml,
    formatMessageTimestamp,
    formatI18nText,
} = chatUtils;

const notificationPlayer = window.ChatNotificationService?.createPlayer({
    customSoundPath: CUSTOM_SOUND_PATH,
    volume: 0.7,
}) || {
    preloadCustom: async () => false,
    play: () => Promise.resolve(),
};

const playNotificationSound = () => notificationPlayer.play();

function clearPersistedAdminDebugState() {
    try {
        localStorage.removeItem("tintinchat.adminUsers.includeTestUsers.v1");
    } catch (error) {}
}

function buildAvatarUrl({ userId = 0, username = "", size = 96 } = {}) {
    const params = new URLSearchParams();
    if (Number(userId) > 0) {
        params.set("user_id", String(Number(userId)));
    } else if (String(username || "").trim()) {
        params.set("username", String(username || "").trim());
    }
    params.set("size", String(Math.max(32, Number(size) || 96)));
    params.set("v", String(avatarCacheVersion));
    return `api/users/get_avatar.php?${params.toString()}`;
}
window.buildAvatarUrl = buildAvatarUrl;

function buildAvatarImageHtml({ userId = 0, username = "", className = "avatar-image", size = 96 } = {}) {
    const encodedUsername = encodeURIComponent(String(username || ""));
    const sourceUrl = buildAvatarUrl({ userId, username, size });
    return `<img class="${className}" src="${sourceUrl}" alt="Avatar" loading="lazy" decoding="async" data-avatar-source="1" data-avatar-user-id="${Number(userId) || 0}" data-avatar-username-uri="${encodedUsername}">`;
}

function refreshVisibleAvatars() {
    const avatarImages = document.querySelectorAll("img[data-avatar-source='1']");
    avatarImages.forEach((img) => {
        const userId = Number(img.getAttribute("data-avatar-user-id") || 0);
        const usernameUri = String(img.getAttribute("data-avatar-username-uri") || "");
        const username = usernameUri ? decodeURIComponent(usernameUri) : "";
        const size = Number(img.getAttribute("width") || 96) || 96;
        img.src = buildAvatarUrl({ userId, username, size });
    });
}

function formatMemberSinceLabel(rawTimestamp) {
    if (!rawTimestamp) {
        return "Unknown";
    }
    const parsed = new Date(rawTimestamp);
    if (Number.isNaN(parsed.getTime())) {
        return "Unknown";
    }
    return parsed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

async function fetchUserProfile({ userId = 0, username = "" } = {}) {
    const params = new URLSearchParams();
    if (Number(userId) > 0) {
        params.set("user_id", String(Number(userId)));
    } else if (String(username || "").trim()) {
        params.set("username", String(username).trim());
    } else {
        throw new Error("Missing user reference");
    }

    const response = await window.ApiService.json(`api/users/get_profile.php?${params.toString()}`);
    if (!response?.user) {
        throw new Error("User profile data is unavailable");
    }
    return response.user;
}

function closeAvatarViewer() {
    if (!avatarViewerOverlay) {
        return;
    }
    avatarViewerOverlay.classList.remove("visible");
    avatarViewerOverlay.setAttribute("aria-hidden", "true");
    setTimeout(() => {
        if (!avatarViewerOverlay.classList.contains("visible")) {
            avatarViewerOverlay.hidden = true;
        }
    }, 200);
}

function openAvatarViewer(profile) {
    if (!avatarViewerOverlay || !avatarViewerImage || !avatarViewerTitle || !profile) {
        return;
    }
    avatarViewerImage.src = String(profile.avatar_url || "");
    avatarViewerImage.alt = `${String(profile.username || "User")} avatar`;
    avatarViewerTitle.textContent = String(profile.username || "User");

    avatarViewerOverlay.hidden = false;
    avatarViewerOverlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
        avatarViewerOverlay.classList.add("visible");
    });
}

function closeUserProfileModal() {
    if (!userProfileModalOverlay) {
        return;
    }
    userProfileModalOverlay.classList.remove("visible");
    userProfileModalOverlay.setAttribute("aria-hidden", "true");
    setTimeout(() => {
        if (!userProfileModalOverlay.classList.contains("visible")) {
            userProfileModalOverlay.hidden = true;
            if (userProfileModalBody) {
                userProfileModalBody.innerHTML = "";
            }
            if (
                lastFocusedElementBeforeUserProfileModal &&
                document.contains(lastFocusedElementBeforeUserProfileModal)
            ) {
                lastFocusedElementBeforeUserProfileModal.focus();
            }
            lastFocusedElementBeforeUserProfileModal = null;
            activeUserProfile = null;
        }
    }, 200);
}

async function openUserProfileModal({ userId = 0, username = "" } = {}) {
    if (!userProfileModalOverlay || !userProfileModalBody) {
        return;
    }

    lastFocusedElementBeforeUserProfileModal =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    userProfileModalBody.innerHTML = '<div class="chat-inline-state chat-inline-state-info"><span class="chat-inline-state-text">Loading user info...</span></div>';
    userProfileModalOverlay.hidden = false;
    userProfileModalOverlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
        userProfileModalOverlay.classList.add("visible");
    });

    try {
        const profile = await fetchUserProfile({ userId, username });
        activeUserProfile = profile;

        const card = document.createElement("div");
        card.className = "user-profile-card";

        const safeUsername = escapeHtml(String(profile.username || "Unknown"));
        const safeIdent = escapeHtml(String(profile.public_ident || "-"));
        const memberSince = escapeHtml(formatMemberSinceLabel(profile.member_since));
        const avatarUrl = String(profile.avatar_url || "");
        const isCurrentUser = Boolean(profile.is_current_user);
        const isBlockedByMe = Boolean(profile.is_blocked_by_me);

        card.innerHTML = `
            <div class="user-profile-main">
                <button type="button" class="user-profile-avatar-btn" aria-label="Show enlarged avatar">
                    <img src="${avatarUrl}" alt="${safeUsername} avatar">
                </button>
                <div class="user-profile-main-meta">
                    <h6 class="user-profile-name">${safeUsername}</h6>
                    <p class="user-profile-ident">User ID: ${safeIdent}</p>
                    <p class="user-profile-since">Member since: ${memberSince}</p>
                </div>
            </div>
            <div class="user-profile-actions">
                <button type="button" class="btn btn-outline-primary" data-user-profile-action="show-avatar">
                    <i class="fas fa-expand me-1"></i>Show Avatar
                </button>
                <button type="button" class="btn btn-primary" data-user-profile-action="send-message" ${isCurrentUser ? "disabled" : ""}>
                    <i class="fas fa-paper-plane me-1"></i>${isCurrentUser ? "This is you" : "Send Message"}
                </button>
                <button type="button" class="btn btn-outline-danger" data-user-profile-action="delete-chat" ${isCurrentUser ? "disabled" : ""}>
                    <i class="fas fa-trash-alt me-1"></i>${isCurrentUser ? "Delete Chat unavailable" : "Delete Chat"}
                </button>
                <button type="button" class="btn btn-outline-warning" data-user-profile-action="toggle-block" ${isCurrentUser ? "disabled" : ""}>
                    <i class="fas fa-user-slash me-1"></i>${isCurrentUser ? "Block unavailable" : isBlockedByMe ? "Unblock User" : "Block User"}
                </button>
            </div>
        `;

        userProfileModalBody.innerHTML = "";
        userProfileModalBody.appendChild(card);

        const avatarButton = card.querySelector(".user-profile-avatar-btn");
        const showAvatarButton = card.querySelector('[data-user-profile-action="show-avatar"]');
        const sendMessageButton = card.querySelector('[data-user-profile-action="send-message"]');
        const deleteChatButton = card.querySelector('[data-user-profile-action="delete-chat"]');
        const toggleBlockButton = card.querySelector('[data-user-profile-action="toggle-block"]');

        avatarButton?.addEventListener("click", () => openAvatarViewer(profile));
        showAvatarButton?.addEventListener("click", () => openAvatarViewer(profile));
        sendMessageButton?.addEventListener("click", async () => {
            if (isCurrentUser) {
                return;
            }
            addUserToChatList(String(profile.username || ""), {
                userId: Number(profile.user_id || 0),
            });
            await selectChatUser(String(profile.username || ""));
            closeUserProfileModal();
        });
        deleteChatButton?.addEventListener("click", async () => {
            if (isCurrentUser) {
                return;
            }

            const confirmed = window.confirm(
                `Delete all direct messages between you and ${String(profile.username || "this user")}? This cannot be undone.`
            );
            if (!confirmed) {
                return;
            }

            const originalLabel = deleteChatButton.innerHTML;
            deleteChatButton.disabled = true;
            deleteChatButton.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Deleting...';
            setComposerStatus("Deleting chat history...", "warning");

            try {
                const response = await window.ApiService.jsonOk("api/chats/delete.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...getCsrfHeaders(),
                    },
                    body: JSON.stringify({
                        target_username: String(profile.username || ""),
                    }),
                });

                const deletedMessages = Number(response?.messages_deleted || 0);
                const deletedFiles = Number(response?.files_deleted || 0);

                if (currentChatUser === String(profile.username || "")) {
                    currentChatRecentMessages = null;
lastRecentPollTime = "";
                    messageOffset = 0;
                    hasMoreMessages = true;
                    hasLoadedMoreMessages = false;
                    pendingSeenMessageIds.clear();
                    messageMetaById.clear();
                    clearDecryptedMediaCache();
                    chatMessagesElem.innerHTML = "";

                    let waitAttempts = 0;
                    while (isLoadingMessages && waitAttempts < 12) {
                        await new Promise((resolve) => setTimeout(resolve, 120));
                        waitAttempts += 1;
                    }

                    if (!isLoadingMessages) {
                        await loadMessages(currentChatUser, true, true);
                    } else {
                        setTimeout(async () => {
                            if (currentChatUser === String(profile.username || "")) {
                                currentChatRecentMessages = null;
lastRecentPollTime = "";
                                messageOffset = 0;
                                hasMoreMessages = true;
                                hasLoadedMoreMessages = false;
                                await loadMessages(currentChatUser, true, true);
                            }
                        }, 250);
                    }
                }
                await loadChatList(true);

                closeUserProfileModal();
                showModal(
                    "Chat Deleted",
                    `Deleted ${deletedMessages} messages${deletedFiles > 0 ? ` and ${deletedFiles} files` : ""}.`,
                    "success"
                );
                setComposerStatus("Chat history deleted", "success");
            } catch (error) {
                deleteChatButton.disabled = false;
                deleteChatButton.innerHTML = originalLabel;
                showModal("Delete Chat Failed", error?.message || "Unable to delete chat history.", "error");
                setComposerStatus("Unable to delete chat history", "error");
            }
        });

        toggleBlockButton?.addEventListener("click", async () => {
            if (isCurrentUser) {
                return;
            }

            const willBlock = !Boolean(profile.is_blocked_by_me);
            const targetUsername = String(profile.username || "this user");
            const confirmed = window.confirm(
                willBlock
                    ? `Block ${targetUsername}? They will not be able to send messages to you.`
                    : `Unblock ${targetUsername}?`
            );
            if (!confirmed) {
                return;
            }

            const originalLabel = toggleBlockButton.innerHTML;
            toggleBlockButton.disabled = true;
            toggleBlockButton.innerHTML = `<i class="fas fa-spinner fa-spin me-1"></i>${willBlock ? "Blocking..." : "Unblocking..."}`;

            try {
                const endpoint = willBlock ? "api/users/block.php" : "api/users/unblock.php";
                const response = await window.ApiService.jsonOk(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...getCsrfHeaders(),
                    },
                    body: JSON.stringify({
                        target_user_id: Number(profile.user_id || 0),
                    }),
                });

                profile.is_blocked_by_me = Boolean(response?.is_blocked);
                toggleBlockButton.innerHTML = `<i class="fas fa-user-slash me-1"></i>${profile.is_blocked_by_me ? "Unblock User" : "Block User"}`;
                toggleBlockButton.disabled = false;
                showModal(
                    profile.is_blocked_by_me ? "User Blocked" : "User Unblocked",
                    profile.is_blocked_by_me
                        ? `${targetUsername} can no longer send messages to you.`
                        : `${targetUsername} can send messages to you again.`,
                    "success"
                );
            } catch (error) {
                toggleBlockButton.innerHTML = originalLabel;
                toggleBlockButton.disabled = false;
                showModal(
                    willBlock ? "Block Failed" : "Unblock Failed",
                    error?.message || "Unable to update block status.",
                    "error"
                );
            }
        });

        userProfileModalClose?.focus();
    } catch (error) {
        userProfileModalBody.innerHTML = `<div class="chat-inline-state chat-inline-state-error"><span class="chat-inline-state-text">${escapeHtml(String(error?.message || "Failed to load user info."))}</span></div>`;
    }
}

function getMediaEndpointForType(messageType, messageId) {
    if (messageType === "image") {
        return `api/messages/media/get_image.php?id=${messageId}`;
    }
    if (messageType === "voice") {
        return `api/messages/media/get_voice.php?id=${messageId}`;
    }
    return `api/messages/media/get_file.php?id=${messageId}`;
}

function sanitizeAttachmentFileName(fileName, fallback = "attachment") {
    const rawName = String(fileName || "").trim();
    const candidate = rawName || fallback;
    const normalized = candidate
        .replace(/[\\/:*?"<>|\x00-\x1F]/g, "_")
        .replace(/\s+/g, " ")
        .trim();

    if (!normalized.length || normalized === "." || normalized === "..") {
        return `${fallback}.bin`;
    }

    return normalized.slice(0, 180);
}

function getFileExtension(fileName) {
    const name = String(fileName || "").trim();
    const lastDot = name.lastIndexOf(".");
    if (lastDot <= 0 || lastDot === name.length - 1) {
        return "";
    }
    return name.slice(lastDot + 1).toLowerCase();
}

const AUDIO_FILE_EXTENSIONS = new Set([
    "mp3", "wav", "ogg", "flac", "aac", "m4a", "wma", "opus", "webm", "aiff", "alac",
]);

function isAudioFileName(fileName) {
    return AUDIO_FILE_EXTENSIONS.has(getFileExtension(fileName));
}

function getMediaEnvelopePayloadForMessage(msg) {
    const isGroupMessage = Number(msg?.group_id || 0) > 0;
    if (isGroupMessage) {
        return String(msg?.message || msg?.message_for_sender || "");
    }
    return Number(msg?.sender_id) === Number(CURRENT_USER_ID)
        ? String(msg?.message_for_sender || "")
        : String(msg?.message || "");
}

async function resolveMediaAesKey(msg, wrappedKeyPayload) {
    const isGroupMessage = Number(msg?.group_id || 0) > 0;
    if (isGroupMessage) {
        const groupId = Number(msg?.group_id || 0);
        const groupKey = await getGroupCryptoKey(groupId);
        return unwrapMediaKeyFromGroupWrapped(wrappedKeyPayload, groupKey);
    }
    await ensurePrivateKeyLoaded();
    return unwrapMediaKeyFromPrivateWrapped(wrappedKeyPayload);
}

async function getDecryptedMediaResource(msg) {
    const messageId = Number(msg?.id || 0);
    if (!messageId) {
        throw new Error("Invalid media message");
    }

    // 1. Check volatile in-memory Map
    if (decryptedMediaCacheByMessageId.has(messageId)) {
        return decryptedMediaCacheByMessageId.get(messageId);
    }

    // 2. Check persistent IDB media cache
    try {
        const cached = await getMediaFromCache(messageId);
        if (cached?.blob) {
            const objectUrl = URL.createObjectURL(cached.blob);
            const resource = {
                blob: cached.blob,
                objectUrl,
                metadata: { mime_type: cached.mimeType, file_name: cached.fileName },
            };
            decryptedMediaCacheByMessageId.set(messageId, resource);
            return resource;
        }
    } catch (_) {
        // IDB failure: fall through to network fetch
    }

    // 3. Fetch + decrypt from server
    const envelopePayload = getMediaEnvelopePayloadForMessage(msg);
    const envelope = parseMediaEnvelopePayload(envelopePayload);
    if (Number(msg?.group_id || 0) > 0) {
        const groupId = Number(msg.group_id || 0);
        const currentKeyVersion = Number(groupKeyVersionCache.get(groupId) || 1);
        if (Number(envelope.kv || 1) !== currentKeyVersion) {
            await getGroupCryptoKey(groupId, true);
        }
    }
    const mediaKey = await resolveMediaAesKey(msg, envelope.k);
    const metadata = await decryptMediaMetadata(envelope.m, mediaKey);

    const endpoint = getMediaEndpointForType(String(msg.message_type || "file"), messageId);
    const response = await fetch(endpoint);
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("FILE_UNAVAILABLE");
        }
        throw new Error(`Failed to fetch media (${response.status})`);
    }

    const encryptedBytes = new Uint8Array(await response.arrayBuffer());
    const decryptedBytes = await decryptBinaryWithAesKey(encryptedBytes, mediaKey);
    const mimeType =
        String(metadata?.mime_type || metadata?.mime || "").trim() ||
        "application/octet-stream";
    const fileName = sanitizeAttachmentFileName(
        String(metadata?.file_name || metadata?.name || "").trim(),
        `attachment_${messageId}`
    );

    const blob = new Blob([decryptedBytes], { type: mimeType });
    const objectUrl = URL.createObjectURL(blob);
    const resource = { blob, objectUrl, metadata: { ...metadata, mime_type: mimeType, file_name: fileName } };

    // 4. Store in volatile cache
    decryptedMediaCacheByMessageId.set(messageId, resource);

    // 5. Persist to IDB (fire-and-forget, never block render)
    void saveMediaToCache(messageId, blob, { mime_type: mimeType, file_name: fileName });

    return resource;
}

async function getDecryptedMediaMetadata(msg) {
    const messageId = Number(msg?.id || 0);
    if (messageId && decryptedMediaCacheByMessageId.has(messageId)) {
        return decryptedMediaCacheByMessageId.get(messageId).metadata || {};
    }
    const envelopePayload = getMediaEnvelopePayloadForMessage(msg);
    const envelope = parseMediaEnvelopePayload(envelopePayload);
    if (Number(msg?.group_id || 0) > 0) {
        const groupId = Number(msg.group_id || 0);
        const currentKeyVersion = Number(groupKeyVersionCache.get(groupId) || 1);
        if (Number(envelope.kv || 1) !== currentKeyVersion) {
            await getGroupCryptoKey(groupId, true);
        }
    }
    const mediaKey = await resolveMediaAesKey(msg, envelope.k);
    return decryptMediaMetadata(envelope.m, mediaKey);
}

async function encryptMediaForMessage(fileOrBlob, metadata, context = {}) {
    const mediaKey = await generateAesGcmKey();
    const encryptedMetadata = await encryptMediaMetadata(metadata, mediaKey);
    const isGroupMessage = Boolean(context.groupId);

    let recipientEnvelopePayload = "";
    let senderEnvelopePayload = "";
    if (isGroupMessage) {
        const groupKey = await getGroupCryptoKey(Number(context.groupId));
        const keyVersion = Number(groupKeyVersionCache.get(Number(context.groupId)) || 1);
        const wrappedForGroup = await wrapMediaKeyForGroup(mediaKey, groupKey);
        recipientEnvelopePayload = buildMediaEnvelopePayload(
            wrappedForGroup,
            encryptedMetadata,
            keyVersion
        );
        senderEnvelopePayload = recipientEnvelopePayload;
    } else {
        const recipientPublicKey = await getPublicKey(String(context.targetUsername || ""));
        const senderPublicKey = await getPublicKey(CURRENT_USER);
        const wrappedForRecipient = await wrapMediaKeyForPublicKey(mediaKey, recipientPublicKey);
        const wrappedForSender = await wrapMediaKeyForPublicKey(mediaKey, senderPublicKey);
        recipientEnvelopePayload = buildMediaEnvelopePayload(
            wrappedForRecipient,
            encryptedMetadata,
            1
        );
        senderEnvelopePayload = buildMediaEnvelopePayload(
            wrappedForSender,
            encryptedMetadata,
            1
        );
    }

    const sourceBuffer = await fileOrBlob.arrayBuffer();
    const encryptedBytes = await encryptBinaryWithAesKey(sourceBuffer, mediaKey);
    const encryptedBlob = new Blob([encryptedBytes], { type: "application/octet-stream" });

    return {
        encryptedBlob,
        messageForRecipient: recipientEnvelopePayload,
        messageForSender: senderEnvelopePayload,
    };
}

async function hydrateImageMessageElement(messageElement, msg) {
    const imageElem = messageElement.querySelector(".message-image");
    const loadingElem = messageElement.querySelector(".image-message-loading");
    if (!imageElem) {
        return;
    }

    const shouldStickToBottom = isChatNearBottom(180);

    try {
        const mediaResource = await getDecryptedMediaResource(msg);
        imageElem.src = mediaResource.objectUrl;
        imageElem.style.display = "block";
        imageElem.setAttribute("data-ready", "1");
        if (loadingElem) {
            loadingElem.style.display = "none";
        }
        if (shouldStickToBottom && appSettings.autoScrollEnabled && !hasLoadedMoreMessages) {
            scheduleSnapToBottom();
        }
    } catch (error) {
        imageElem.style.display = "none";
        if (loadingElem) {
            loadingElem.textContent = error?.message === "FILE_UNAVAILABLE"
                ? "File no longer available"
                : "Unable to decrypt image";
        }
    }
}

async function hydrateVideoMessageElement(messageElement, msg) {
    const videoElem = messageElement.querySelector(".message-video");
    const loadingElem = messageElement.querySelector(".video-message-loading");
    if (!videoElem) {
        return;
    }

    const shouldStickToBottom = isChatNearBottom(180);

    try {
        const mediaResource = await getDecryptedMediaResource(msg);
        videoElem.src = mediaResource.objectUrl;
        videoElem.style.display = "block";
        if (loadingElem) {
            loadingElem.style.display = "none";
        }
        if (shouldStickToBottom && appSettings.autoScrollEnabled && !hasLoadedMoreMessages) {
            scheduleSnapToBottom();
        }
    } catch (error) {
        videoElem.style.display = "none";
        if (loadingElem) {
            loadingElem.textContent = error?.message === "FILE_UNAVAILABLE"
                ? "File no longer available"
                : "Unable to decrypt video";
        }
    }
}

function clearDecryptedMediaCache() {
    // Revoke objectURLs and clear volatile in-memory map only.
    // IDB persistent cache is intentionally preserved across page loads.
    decryptedMediaCacheByMessageId.forEach((resource) => {
        if (resource?.objectUrl) {
            URL.revokeObjectURL(resource.objectUrl);
        }
    });
    decryptedMediaCacheByMessageId.clear();
}

window.addEventListener("beforeunload", () => {
    clearDecryptedMediaCache();
});

// Run LRU eviction on startup (fire-and-forget)
void window.MediaCacheService.evictStaleCachedMedia();

function buildGroupToken(groupId) {
    return `group:${groupId}`;
}

function isGroupToken(chatTarget) {
    return typeof chatTarget === "string" && chatTarget.startsWith("group:");
}

function parseGroupIdFromToken(chatTarget) {
    if (!isGroupToken(chatTarget)) {
        return 0;
    }
    return Number(chatTarget.slice("group:".length)) || 0;
}

function getCurrentGroupId() {
    return parseGroupIdFromToken(currentChatUser);
}

function isSavedMessagesChat(target) {
    return target === CURRENT_USER;
}

function getCurrentChatDisplayName() {
    if (!currentChatUser) {
        return "";
    }
    if (isSavedMessagesChat(currentChatUser)) {
        return "Saved Messages";
    }
    const groupId = parseGroupIdFromToken(currentChatUser);
    if (groupId > 0) {
        return chatGroupsById.get(groupId)?.title || "Group";
    }
    return currentChatUser;
}

function chatListItemId(chatTarget) {
    return `chat_${encodeURIComponent(String(chatTarget)).replace(/%/g, "_")}`;
}

function chatListSpinnerId(chatTarget) {
    return `${chatListItemId(chatTarget)}_loading`;
}

function setGroupUnreadBadge(groupToken, unreadCount = 0) {
    const chatListItem = document.getElementById(chatListItemId(groupToken));
    if (!chatListItem) {
        return;
    }
    const badge = chatListItem.querySelector(".chat-item-unread-badge");
    if (!badge) {
        return;
    }

    const count = Math.max(0, Number(unreadCount) || 0);
    if (!count) {
        badge.style.display = "none";
        badge.textContent = "0";
        return;
    }

    badge.style.display = "inline-flex";
    badge.textContent = count > 99 ? "99+" : String(count);
}

function setTypingIndicator(text = "") {
    if (!typingIndicatorElem) {
        return;
    }
    const normalizedText = String(text || "").trim();
    const isActive = normalizedText.length > 0;

    typingIndicatorElem.textContent = "";
    if (isActive) {
        const textSpan = document.createElement("span");
        textSpan.className = "typing-indicator-text";
        textSpan.textContent = normalizedText;

        const dots = document.createElement("span");
        dots.className = "typing-dots";
        dots.setAttribute("aria-hidden", "true");

        for (let index = 0; index < 3; index += 1) {
            const dot = document.createElement("span");
            dot.className = "typing-dot";
            dots.appendChild(dot);
        }

        typingIndicatorElem.appendChild(textSpan);
        typingIndicatorElem.appendChild(dots);
        typingIndicatorElem.setAttribute("aria-label", normalizedText);
    } else {
        typingIndicatorElem.removeAttribute("aria-label");
    }

    typingIndicatorElem.classList.toggle("active", isActive);
    typingIndicatorElem.hidden = !isActive;
}

function setUserUnreadBadge(username, unreadCount = 0) {
    const chatItem = document.getElementById(chatListItemId(username));
    if (!chatItem) {
        return;
    }
    const badge = chatItem.querySelector(".chat-item-unread-badge");
    if (!badge) {
        return;
    }

    const count = Math.max(0, Number(unreadCount) || 0);
    if (!count) {
        badge.style.display = "none";
        badge.textContent = "0";
        return;
    }

    badge.style.display = "inline-flex";
    badge.textContent = count > 99 ? "99+" : String(count);
}

async function updateTypingStatus(isTyping, chatTargetOverride = null) {
    const chatTarget = String(chatTargetOverride || currentChatUser || "");
    if (!chatTarget || isSavedMessagesChat(chatTarget)) {
        return;
    }

    const desiredState = Boolean(isTyping);
    const currentKnownState = Boolean(typingStateByTarget.get(chatTarget));
    if (currentKnownState === desiredState) {
        return;
    }

    if (typingInflightByTarget.has(chatTarget)) {
        return;
    }

    const now = Date.now();
    const lastSentAt = Number(typingLastSentAtByTarget.get(chatTarget) || 0);
    if (desiredState && now - lastSentAt < TYPING_UPDATE_THROTTLE_MS) {
        return;
    }

    typingInflightByTarget.add(chatTarget);
    try {
        const payload = {
            is_typing: desiredState,
        };
        if (isGroupToken(chatTarget)) {
            payload.group_id = parseGroupIdFromToken(chatTarget);
        } else {
            payload.target = chatTarget;
        }
        await window.ApiService.jsonOk("api/typing/update.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getCsrfHeaders(),
            },
            body: JSON.stringify(payload),
        });
        typingStateByTarget.set(chatTarget, desiredState);
        typingLastSentAtByTarget.set(chatTarget, now);
    } catch (error) {}
    finally {
        typingInflightByTarget.delete(chatTarget);
    }
}

function applyTypingData(typing) {
    if (!typing || !currentChatUser) {
        setTypingIndicator("");
        return;
    }
    if (isGroupToken(currentChatUser)) {
        const typers = Array.isArray(typing.typers)
            ? typing.typers.map((item) => String(item || "").trim()).filter(Boolean)
            : [];
        if (!typers.length) {
            setTypingIndicator("");
        } else if (typers.length === 1) {
            setTypingIndicator(`${typers[0]} is typing...`);
        } else if (typers.length === 2) {
            setTypingIndicator(`${typers[0]} and ${typers[1]} are typing...`);
        } else {
            setTypingIndicator(`${typers[0]} and ${typers.length - 1} others are typing...`);
        }
    } else {
        setTypingIndicator(typing.is_typing ? `${currentChatUser} is typing...` : "");
    }
}

async function refreshTypingIndicator() {
    if (!currentChatUser) {
        setTypingIndicator("");
        return;
    }
    try {
        let data;
        if (isGroupToken(currentChatUser)) {
            const groupId = parseGroupIdFromToken(currentChatUser);
            if (!groupId) { setTypingIndicator(""); return; }
            data = await window.ApiService.json(
                `api/typing/fetch.php?group_id=${encodeURIComponent(groupId)}`,
                { cache: "no-store" }
            );
        } else {
            data = await window.ApiService.json(
                `api/typing/fetch.php?with=${encodeURIComponent(currentChatUser)}`,
                { cache: "no-store" }
            );
        }
        applyTypingData(data);
    } catch (error) {
        setTypingIndicator("");
    }
}

function loadAppSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!raw) {
            return;
        }
        const parsed = JSON.parse(raw);
        appSettings.notificationSoundEnabled = parseStoredBoolean(
            parsed.notificationSoundEnabled,
            true
        );
        appSettings.autoScrollEnabled = parseStoredBoolean(parsed.autoScrollEnabled, true);
        appSettings.mobileComposerExpanded = parseStoredBoolean(
            parsed.mobileComposerExpanded,
            false
        );
        appSettings.themeMode = ["system", "light", "dark"].includes(parsed.themeMode)
            ? parsed.themeMode
            : "system";
        appSettings.densityMode = parsed.densityMode === "compact" ? "compact" : "comfortable";
        appSettings.fontScale = ["sm", "md", "lg", "xl"].includes(parsed.fontScale)
            ? parsed.fontScale
            : "md";
        appSettings.showTimestamps = parseStoredBoolean(parsed.showTimestamps, true);
        appSettings.reduceMotion = parseStoredBoolean(parsed.reduceMotion, false);
        appSettings.browserNotificationsEnabled = parseStoredBoolean(parsed.browserNotificationsEnabled, false);
        appSettings.sendByEnter = parseStoredBoolean(parsed.sendByEnter, true);
        appSettings.showSavedMessages = parseStoredBoolean(parsed.showSavedMessages, true);
    } catch (error) {}
}

function persistAppSettings() {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(appSettings));
}

function applyUiPreferenceClasses() {
    const root = document.documentElement;
    root.setAttribute("data-theme-mode", appSettings.themeMode);
    if (appSettings.themeMode === "system") {
        root.removeAttribute("data-theme");
    } else {
        root.setAttribute("data-theme", appSettings.themeMode);
    }
    root.setAttribute("data-density", appSettings.densityMode);
    root.setAttribute("data-font-scale", appSettings.fontScale);
    root.classList.toggle("reduced-motion-enabled", Boolean(appSettings.reduceMotion));
    chatMessagesElem?.classList.toggle(
        "hide-message-timestamps",
        !Boolean(appSettings.showTimestamps)
    );
}

function applySettingsTabUi(tabName = "general") {
    let normalizedTab = "general";
    if (tabName === "account") {
        normalizedTab = "account";
    } else if (tabName === "ideas" && chatUiSettingsTabIdeas && chatUiSettingsPanelIdeas) {
        normalizedTab = "ideas";
    } else if (tabName === "admin" && chatUiSettingsTabAdmin && chatUiSettingsPanelAdmin) {
        normalizedTab = "admin";
    }

    const isGeneral = normalizedTab === "general";
    const isAccount = normalizedTab === "account";
    const isIdeas = normalizedTab === "ideas";
    const isAdmin = normalizedTab === "admin";
    activeSettingsTab = normalizedTab;

    chatUiSettingsTabGeneral?.classList.toggle("is-active", isGeneral);
    chatUiSettingsTabGeneral?.setAttribute("aria-selected", isGeneral ? "true" : "false");
    if (chatUiSettingsPanelGeneral) {
        chatUiSettingsPanelGeneral.hidden = !isGeneral;
    }

    chatUiSettingsTabAccount?.classList.toggle("is-active", isAccount);
    chatUiSettingsTabAccount?.setAttribute("aria-selected", isAccount ? "true" : "false");
    if (chatUiSettingsPanelAccount) {
        chatUiSettingsPanelAccount.hidden = !isAccount;
    }

    chatUiSettingsTabIdeas?.classList.toggle("is-active", isIdeas);
    chatUiSettingsTabIdeas?.setAttribute("aria-selected", isIdeas ? "true" : "false");
    if (chatUiSettingsPanelIdeas) {
        chatUiSettingsPanelIdeas.hidden = !isIdeas;
    }

    chatUiSettingsTabAdmin?.classList.toggle("is-active", isAdmin);
    chatUiSettingsTabAdmin?.setAttribute("aria-selected", isAdmin ? "true" : "false");
    if (chatUiSettingsPanelAdmin) {
        chatUiSettingsPanelAdmin.hidden = !isAdmin;
    }
}

function updateCurrentUsernameUi(newUsername) {
    const normalizedUsername = String(newUsername || "").trim();
    if (!normalizedUsername) {
        return;
    }
    currentSelfUsername = normalizedUsername;
    if (loggedInUsernameElem) {
        loggedInUsernameElem.textContent = normalizedUsername;
    }
    if (settingsCurrentUsername) {
        settingsCurrentUsername.textContent = normalizedUsername;
    }
    if (settingsUsernameInput) {
        settingsUsernameInput.value = normalizedUsername;
    }
    updateSettingsAvatarPreview();
}

function updateSettingsAvatarPreview() {
    if (!settingsAvatarPreview) {
        return;
    }

    settingsAvatarPreview.src = buildAvatarUrl({
        userId: Number(CURRENT_USER_ID || 0),
        username: currentSelfUsername || CURRENT_USER,
        size: 96,
    });
}

function openUiSettingsModal() {
    if (!chatUiSettingsOverlay) {
        return;
    }
    chatUiSettingsOverlay.hidden = false;
    requestAnimationFrame(() => {
        chatUiSettingsOverlay.classList.add("visible");
        applySettingsTabUi(activeSettingsTab);
        if (activeSettingsTab === "admin" && window.AdminPanel) {
            void window.AdminPanel.refreshAdminSettingsData();
        }
        if (activeSettingsTab === "general") {
            void refreshMediaCacheLabelGlobal();
        }
        if (activeSettingsTab === "account") {
            settingsUsernameInput?.focus();
        } else if (activeSettingsTab === "admin") {
            settingsGroupKeyHealthBtn?.focus();
        } else {
            settingThemeMode?.focus();
        }
    });
}

function closeUiSettingsModal({ restoreFocus = true } = {}) {
    if (!chatUiSettingsOverlay) {
        return;
    }
    chatUiSettingsOverlay.classList.remove("visible");
    setTimeout(() => {
        if (!chatUiSettingsOverlay.classList.contains("visible")) {
            chatUiSettingsOverlay.hidden = true;
            if (restoreFocus) {
                openUiSettingsBtn?.focus();
            }
        }
    }, 180);
}

/* ── Announcements Panel ── */

let announcementsCachedList = null;

async function fetchAnnouncements() {
    try {
        const response = await window.ApiService.jsonOk("api/admin/announcements/fetch.php");
        return Array.isArray(response?.announcements) ? response.announcements : [];
    } catch { return []; }
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
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
}

function isAnnouncementNew(dateStr) {
    if (!dateStr) return false;
    const seenTs = (typeof USER_TIPS_SEEN_AT !== "undefined" && USER_TIPS_SEEN_AT)
        ? new Date(USER_TIPS_SEEN_AT).getTime() : 0;
    return new Date(dateStr).getTime() > seenTs;
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
        const isNew = isAnnouncementNew(a.created_at);
        const authorInitial = (a.author || "?")[0].toUpperCase();
        item.innerHTML = `
            ${isNew ? '<span class="announcements-new-badge">NEW</span>' : ''}
            <div class="announcements-item-title">${ChatUtils.escapeHtml(String(a.title || ""))}</div>
            <div class="announcements-item-body">${ChatUtils.escapeHtml(String(a.body || "")).replace(/\n/g, "<br>")}</div>
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
    requestAnimationFrame(() => announcementsOverlay.classList.add("visible"));
    const list = await fetchAnnouncements();
    announcementsCachedList = list;
    renderAnnouncementsPanel(list);
    // Mark as seen — update tips_seen_at
    try {
        await window.ApiService.jsonOk("api/users/dismiss_changelog.php", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...getCsrfHeaders() },
            body: "{}",
        });
    } catch { /* best-effort */ }
    setAnnouncementUnreadState(false);
}

function closeAnnouncementsPanel() {
    if (!announcementsOverlay) return;
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
    if (!list.length) { setAnnouncementUnreadState(false); return; }
    const latestTs = new Date(list[0].created_at).getTime();
    const seenTs = (typeof USER_TIPS_SEEN_AT !== "undefined" && USER_TIPS_SEEN_AT)
        ? new Date(USER_TIPS_SEEN_AT).getTime() : 0;
    setAnnouncementUnreadState(latestTs > seenTs);
}

/* ── Playlist ── */

const PLAYLIST_STORAGE_KEY = "ttc_playlist";

function getPlaylist() {
    try {
        const raw = localStorage.getItem(PLAYLIST_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function savePlaylist(list) {
    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(list));
}

function addToPlaylist(msgId, chatTarget, title, ext) {
    const list = getPlaylist();
    if (list.some((t) => t.msgId === msgId)) {
        setComposerStatus("Already in playlist", "warning");
        return;
    }
    if (list.length >= 200) {
        setComposerStatus("Playlist full (200 tracks max)", "warning");
        return;
    }
    const meta = messageMetaById.get(Number(msgId));
    if (!meta) {
        setComposerStatus("Unable to save track metadata", "error");
        return;
    }
    // Store minimal meta needed for decryption + playback
    const entry = {
        msgId, chatTarget, title, ext,
        addedAt: new Date().toISOString(),
        meta: {
            id: meta.id,
            file_path: meta.file_path,
            media_meta: meta.media_meta,
            message: meta.message,
            message_for_sender: meta.message_for_sender,
            sender_id: meta.sender_id,
            group_id: meta.group_id || 0,
            message_type: meta.message_type,
        },
    };
    list.push(entry);
    savePlaylist(list);
    setComposerStatus("Added to playlist", "success");
}

function removeFromPlaylist(msgId) {
    const list = getPlaylist().filter((t) => t.msgId !== msgId);
    savePlaylist(list);
}

function renderPlaylistPanel() {
    if (!playlistBody) return;
    const list = getPlaylist();
    playlistBody.innerHTML = "";
    if (!list.length) {
        playlistBody.innerHTML = '<div class="playlist-empty"><i class="fas fa-music me-2"></i>No tracks yet. Add music from context menu.</div>';
        return;
    }
    list.forEach((track, idx) => {
        const item = document.createElement("div");
        item.className = "playlist-item";
        item.innerHTML = `
            <button type="button" class="playlist-item-play" title="Play">
                <i class="fas fa-play"></i>
            </button>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${ChatUtils.escapeHtml(String(track.title || "Unknown"))}</div>
                <div class="playlist-item-meta">${ChatUtils.escapeHtml(String(track.ext || "").toUpperCase())}</div>
            </div>
            <button type="button" class="playlist-item-remove" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        `;
        const playEl = item.querySelector(".playlist-item-play");
        playEl?.addEventListener("click", async () => {
            await playPlaylistTrack(track, playEl);
        });
        const removeEl = item.querySelector(".playlist-item-remove");
        removeEl?.addEventListener("click", () => {
            removeFromPlaylist(track.msgId);
            renderPlaylistPanel();
        });
        playlistBody.appendChild(item);
    });
}

let playlistAudio = null;
let playlistCurrentBtn = null;

async function playPlaylistTrack(track, btnEl) {
    // If same track is playing, toggle pause
    if (playlistAudio && playlistCurrentBtn === btnEl && !playlistAudio.paused) {
        playlistAudio.pause();
        btnEl.innerHTML = '<i class="fas fa-play"></i>';
        btnEl.classList.remove("playing");
        return;
    }
    // Stop any existing playlist audio
    if (playlistAudio) {
        playlistAudio.pause();
        playlistAudio.src = "";
        if (playlistCurrentBtn) {
            playlistCurrentBtn.innerHTML = '<i class="fas fa-play"></i>';
            playlistCurrentBtn.classList.remove("playing");
        }
    }
    // Also stop any in-chat audio
    document.querySelectorAll(".voice-play-btn.playing, .music-play-btn.playing").forEach((btn) => {
        const otherAudio = btn.closest(".message")?.querySelector("audio");
        if (otherAudio && !otherAudio.paused) otherAudio.pause();
        btn.classList.remove("playing");
        btn.innerHTML = '<i class="fas fa-play"></i>';
        btn.closest(".voice-player-container")?.classList.remove("is-playing");
        btn.closest(".music-player-container")?.classList.remove("is-playing");
    });

    btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        if (!track.meta) throw new Error("Track metadata missing — re-add from chat");

        const freshMeta = messageMetaById.get(Number(track.meta?.id || track.msgId || 0));
        if ((freshMeta && freshMeta.file_purged_at) || track.meta.file_purged_at) {
            throw new Error("FILE_UNAVAILABLE");
        }

        const mediaResource = await getDecryptedMediaResource(track.meta);

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === "suspended") audioContext.resume();

        playlistAudio = new Audio(mediaResource.objectUrl);
        playlistCurrentBtn = btnEl;

        playlistAudio.addEventListener("ended", () => {
            btnEl.innerHTML = '<i class="fas fa-play"></i>';
            btnEl.classList.remove("playing");
            playlistCurrentBtn = null;
            // Auto-play next track
            autoPlayNextTrack(track);
        });

        playlistAudio.addEventListener("error", () => {
            btnEl.innerHTML = '<i class="fas fa-play"></i>';
            btnEl.classList.remove("playing");
            showModal("Playback Error", "Unable to play this track.", "error");
        });

        await playlistAudio.play();
        btnEl.innerHTML = '<i class="fas fa-pause"></i>';
        btnEl.classList.add("playing");
        showGlobalNowPlaying(playlistAudio, track.title || "Playlist track", "music");
    } catch (error) {
        btnEl.innerHTML = '<i class="fas fa-play"></i>';
        if (error?.message === "FILE_UNAVAILABLE") {
            setComposerStatus(`"${track.title || "Track"}" — file expired, skipping...`, "warning");
            autoPlayNextTrack(track);
        } else {
            showModal("Playback Error", error?.message || "Unable to play track.", "error");
        }
    }
}

function autoPlayNextTrack(currentTrack) {
    const list = getPlaylist();
    const idx = list.findIndex((t) => t.msgId === currentTrack.msgId);
    if (idx >= 0 && idx < list.length - 1) {
        const nextTrack = list[idx + 1];
        // Re-render panel so DOM items stay in sync (handles closed-panel case)
        renderPlaylistPanel();
        const items = playlistBody?.querySelectorAll(".playlist-item");
        const nextBtn = items?.[idx + 1]?.querySelector(".playlist-item-play");
        if (nextBtn) {
            playPlaylistTrack(nextTrack, nextBtn);
        }
    }
}

function openPlaylistPanel() {
    if (!playlistOverlay) return;
    renderPlaylistPanel();
    playlistOverlay.hidden = false;
    requestAnimationFrame(() => playlistOverlay.classList.add("visible"));
}

function closePlaylistPanel() {
    if (!playlistOverlay) return;
    playlistOverlay.classList.remove("visible");
    setTimeout(() => {
        if (!playlistOverlay.classList.contains("visible")) {
            playlistOverlay.hidden = true;
        }
    }, 250);
}

/* ── Saved Messages Info Panel ── */
const savedMessagesInfoPanel = document.getElementById("savedMessagesInfoPanel");
const savedInfoBackBtn = document.getElementById("savedInfoBackBtn");
const savedPlaylistBody = document.getElementById("savedPlaylistBody");
const savedNowPlaying = document.getElementById("savedNowPlaying");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const nowPlayingToggle = document.getElementById("nowPlayingToggle");
const nowPlayingPrev = document.getElementById("nowPlayingPrev");
const nowPlayingNext = document.getElementById("nowPlayingNext");
const nowPlayingProgressWrap = document.getElementById("nowPlayingProgressWrap");
const nowPlayingProgressBar = document.getElementById("nowPlayingProgressBar");
const nowPlayingCurrent = document.getElementById("nowPlayingCurrent");
const nowPlayingDuration = document.getElementById("nowPlayingDuration");
const savedPlaylistCount = document.getElementById("savedPlaylistCount");

let savedPanelPlaylistAudio = null;
let savedPanelCurrentTrackIdx = -1;

function formatTimeShort(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function openSavedMessagesInfoPanel() {
    if (!savedMessagesInfoPanel) return;
    savedMessagesInfoPanel.hidden = false;
    chatAreaElem?.classList.add("saved-panel-open");
    loadSavedMessagesStats();
    renderSavedPlaylistPanel();
    savedInfoBackBtn?.addEventListener("click", closeSavedMessagesInfoPanel);
}

function closeSavedMessagesInfoPanel() {
    if (!savedMessagesInfoPanel) return;
    savedMessagesInfoPanel.hidden = true;
    chatAreaElem?.classList.remove("saved-panel-open");
}

function toggleSavedMessagesInfoPanel() {
    if (savedMessagesInfoPanel && !savedMessagesInfoPanel.hidden) {
        closeSavedMessagesInfoPanel();
    } else {
        openSavedMessagesInfoPanel();
    }
}

function loadSavedMessagesStats() {
    // Count from DOM — reflects all loaded messages
    const msgs = chatMessagesElem?.querySelectorAll(".message") || [];
    const stats = { total: 0, text: 0, voice: 0, image: 0, video: 0, file: 0, sticker: 0 };
    msgs.forEach((el) => {
        stats.total++;
        const type = el.getAttribute("data-message-type") || "text";
        if (type === "voice") stats.voice++;
        else if (type === "image") stats.image++;
        else if (type === "video") stats.video++;
        else if (type === "file") stats.file++;
        else if (type === "sticker") stats.sticker++;
        else stats.text++;
    });
    const el = (id) => document.getElementById(id);
    el("savedStatTotal") && (el("savedStatTotal").textContent = String(stats.total));
    el("savedStatText") && (el("savedStatText").textContent = String(stats.text));
    el("savedStatVoice") && (el("savedStatVoice").textContent = String(stats.voice));
    el("savedStatImage") && (el("savedStatImage").textContent = String(stats.image));
    el("savedStatVideo") && (el("savedStatVideo").textContent = String(stats.video));
    el("savedStatFile") && (el("savedStatFile").textContent = String(stats.file));
    el("savedStatSticker") && (el("savedStatSticker").textContent = String(stats.sticker));
}

function renderSavedPlaylistPanel() {
    if (!savedPlaylistBody) return;
    const list = getPlaylist();
    if (savedPlaylistCount) savedPlaylistCount.textContent = `(${list.length})`;
    savedPlaylistBody.innerHTML = "";
    if (!list.length) {
        savedPlaylistBody.innerHTML = '<div class="playlist-empty"><i class="fas fa-music me-2"></i>No tracks yet. Add music from the context menu.</div>';
        return;
    }
    list.forEach((track, idx) => {
        const item = document.createElement("div");
        const freshMeta = messageMetaById.get(Number(track.meta?.id || track.msgId || 0));
        const isPurged = Boolean((freshMeta && freshMeta.file_purged_at) || track.meta?.file_purged_at);
        item.className = "saved-playlist-item" + (idx === savedPanelCurrentTrackIdx ? " active" : "") + (isPurged ? " playlist-item-purged" : "");
        item.setAttribute("data-playlist-idx", String(idx));
        item.innerHTML = `
            <button type="button" class="saved-pl-play" title="${isPurged ? "File expired" : "Play"}" ${isPurged ? "disabled" : ""}>
                <i class="fas ${isPurged ? "fa-clock" : (idx === savedPanelCurrentTrackIdx && savedPanelPlaylistAudio && !savedPanelPlaylistAudio.paused ? "fa-pause" : "fa-play")}"></i>
            </button>
            <div class="saved-pl-info">
                <div class="saved-pl-title${isPurged ? " file-purged-title" : ""}">${ChatUtils.escapeHtml(String(track.title || "Unknown"))}</div>
                <div class="saved-pl-meta">${isPurged ? '<span class="file-purged-badge" style="font-size:0.6rem;padding:1px 6px;"><i class="fas fa-clock"></i> Expired</span>' : `${ChatUtils.escapeHtml(String(track.ext || "").toUpperCase())}${track.addedAt ? " · added " + new Date(track.addedAt).toLocaleDateString() : ""}`}</div>
            </div>
            <button type="button" class="saved-pl-remove" title="Remove from playlist">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        if (!isPurged) {
            item.querySelector(".saved-pl-play")?.addEventListener("click", () => playSavedPanelTrack(idx));
        }
        item.querySelector(".saved-pl-remove")?.addEventListener("click", () => {
            removeFromPlaylist(track.msgId);
            if (savedPanelCurrentTrackIdx === idx) {
                stopSavedPanelAudio();
            } else if (savedPanelCurrentTrackIdx > idx) {
                savedPanelCurrentTrackIdx--;
            }
            renderSavedPlaylistPanel();
        });
        savedPlaylistBody.appendChild(item);
    });
}

async function playSavedPanelTrack(idx) {
    const list = getPlaylist();
    if (idx < 0 || idx >= list.length) return;
    const track = list[idx];

    // Toggle pause if same track
    if (savedPanelPlaylistAudio && savedPanelCurrentTrackIdx === idx) {
        if (savedPanelPlaylistAudio.paused) {
            savedPanelPlaylistAudio.play();
            updateNowPlayingUi(true);
        } else {
            savedPanelPlaylistAudio.pause();
            updateNowPlayingUi(false);
        }
        renderSavedPlaylistPanel();
        return;
    }

    // Stop current
    stopSavedPanelAudio();

    savedPanelCurrentTrackIdx = idx;
    renderSavedPlaylistPanel();

    try {
        if (!track.meta) throw new Error("Track metadata missing — re-add from chat");

        // Check if file was purged (proactive check from fresh message meta)
        const freshMeta = messageMetaById.get(Number(track.meta?.id || track.msgId || 0));
        if ((freshMeta && freshMeta.file_purged_at) || track.meta.file_purged_at) {
            throw new Error("FILE_UNAVAILABLE");
        }

        const mediaResource = await getDecryptedMediaResource(track.meta);

        if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === "suspended") audioContext.resume();

        // Stop any in-chat audio
        document.querySelectorAll(".voice-play-btn.playing, .music-play-btn.playing").forEach((btn) => {
            const otherAudio = btn.closest(".message")?.querySelector("audio");
            if (otherAudio && !otherAudio.paused) otherAudio.pause();
            btn.classList.remove("playing");
            btn.innerHTML = '<i class="fas fa-play"></i>';
            btn.closest(".voice-player-container")?.classList.remove("is-playing");
            btn.closest(".music-player-container")?.classList.remove("is-playing");
        });

        savedPanelPlaylistAudio = new Audio(mediaResource.objectUrl);

        savedPanelPlaylistAudio.addEventListener("loadedmetadata", () => {
            if (isFinite(savedPanelPlaylistAudio.duration) && nowPlayingDuration) {
                nowPlayingDuration.textContent = formatTimeShort(savedPanelPlaylistAudio.duration);
            }
        });

        savedPanelPlaylistAudio.addEventListener("timeupdate", () => {
            if (!savedPanelPlaylistAudio || !isFinite(savedPanelPlaylistAudio.duration)) return;
            if (nowPlayingCurrent) nowPlayingCurrent.textContent = formatTimeShort(savedPanelPlaylistAudio.currentTime);
            const pct = (savedPanelPlaylistAudio.currentTime / savedPanelPlaylistAudio.duration) * 100;
            if (nowPlayingProgressBar) nowPlayingProgressBar.style.width = `${pct}%`;
        });

        savedPanelPlaylistAudio.addEventListener("ended", () => {
            updateNowPlayingUi(false);
            // Auto-play next
            if (idx < list.length - 1) {
                playSavedPanelTrack(idx + 1);
            } else {
                stopSavedPanelAudio();
                renderSavedPlaylistPanel();
            }
        });

        savedPanelPlaylistAudio.addEventListener("error", () => {
            showModal("Playback Error", "Unable to play this track.", "error");
            stopSavedPanelAudio();
            renderSavedPlaylistPanel();
        });

        await savedPanelPlaylistAudio.play();
        showNowPlaying(track);
        updateNowPlayingUi(true);
        renderSavedPlaylistPanel();
        // Also show global now-playing bar
        showGlobalNowPlaying(savedPanelPlaylistAudio, track.title || "Playlist track", "music");
    } catch (error) {
        const isPurged = error?.message === "FILE_UNAVAILABLE";
        if (isPurged) {
            // Auto-skip to next track instead of blocking
            setComposerStatus(`Skipped "${track.title || "track"}" — file expired`, "warning");
            stopSavedPanelAudio();
            renderSavedPlaylistPanel();
            const list = getPlaylist();
            if (idx < list.length - 1) {
                setTimeout(() => playSavedPanelTrack(idx + 1), 300);
            }
        } else {
            showModal("Playback Error", error?.message || "Unable to play track.", "error");
            stopSavedPanelAudio();
            renderSavedPlaylistPanel();
        }
    }
}

function stopSavedPanelAudio() {
    if (savedPanelPlaylistAudio) {
        savedPanelPlaylistAudio.pause();
        savedPanelPlaylistAudio.src = "";
        savedPanelPlaylistAudio = null;
    }
    savedPanelCurrentTrackIdx = -1;
    if (savedNowPlaying) savedNowPlaying.hidden = true;
}

function showNowPlaying(track) {
    if (!savedNowPlaying) return;
    savedNowPlaying.hidden = false;
    if (nowPlayingTitle) nowPlayingTitle.textContent = track.title || "Unknown";
    if (nowPlayingCurrent) nowPlayingCurrent.textContent = "0:00";
    if (nowPlayingDuration) nowPlayingDuration.textContent = "0:00";
    if (nowPlayingProgressBar) nowPlayingProgressBar.style.width = "0%";
}

function updateNowPlayingUi(isPlaying) {
    if (nowPlayingToggle) {
        nowPlayingToggle.innerHTML = isPlaying
            ? '<i class="fas fa-pause"></i>'
            : '<i class="fas fa-play"></i>';
    }
}

// Bind now-playing controls
nowPlayingToggle?.addEventListener("click", () => {
    if (!savedPanelPlaylistAudio) return;
    if (savedPanelPlaylistAudio.paused) {
        savedPanelPlaylistAudio.play();
        updateNowPlayingUi(true);
    } else {
        savedPanelPlaylistAudio.pause();
        updateNowPlayingUi(false);
    }
    renderSavedPlaylistPanel();
});

nowPlayingPrev?.addEventListener("click", () => {
    if (savedPanelCurrentTrackIdx > 0) {
        playSavedPanelTrack(savedPanelCurrentTrackIdx - 1);
    }
});

nowPlayingNext?.addEventListener("click", () => {
    const list = getPlaylist();
    if (savedPanelCurrentTrackIdx < list.length - 1) {
        playSavedPanelTrack(savedPanelCurrentTrackIdx + 1);
    }
});

// Seek on now-playing progress bar
if (nowPlayingProgressWrap) {
    function seekNowPlaying(clientX) {
        if (!savedPanelPlaylistAudio || !isFinite(savedPanelPlaylistAudio.duration)) return;
        const rect = nowPlayingProgressWrap.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        savedPanelPlaylistAudio.currentTime = ratio * savedPanelPlaylistAudio.duration;
        if (nowPlayingProgressBar) nowPlayingProgressBar.style.width = `${ratio * 100}%`;
    }
    nowPlayingProgressWrap.addEventListener("mousedown", (e) => {
        e.preventDefault();
        seekNowPlaying(e.clientX);
        function onMove(ev) { seekNowPlaying(ev.clientX); }
        function onUp() { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    });
    nowPlayingProgressWrap.addEventListener("touchstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        seekNowPlaying(e.touches[0].clientX);
    });
    nowPlayingProgressWrap.addEventListener("touchmove", (e) => {
        e.preventDefault();
        e.stopPropagation();
        seekNowPlaying(e.touches[0].clientX);
    });
}

function setComposerStatus(message = "", type = "neutral") {
    if (!composerStatusElem) {
        return;
    }
    composerStatusElem.textContent = message;
    composerStatusElem.classList.remove(
        "composer-status-error",
        "composer-status-success",
        "composer-status-warning"
    );
    if (type === "error") {
        composerStatusElem.classList.add("composer-status-error");
    } else if (type === "success") {
        composerStatusElem.classList.add("composer-status-success");
    } else if (type === "warning") {
        composerStatusElem.classList.add("composer-status-warning");
    }
}
// Expose for extracted modules (ideas.js, changelog.js)
window.setComposerStatus = setComposerStatus;

function showTransientComposerSuccessTick(durationMs = 900) {
    setComposerStatus("✓", "success");
    window.setTimeout(() => {
        if (composerStatusElem && composerStatusElem.textContent === "✓") {
            setComposerStatus("");
        }
    }, Math.max(250, Number(durationMs) || 900));
}

function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT_WIDTH;
}

function syncMobileComposerActions() {
    if (!imageUploadBtn || !voiceBtn || !composerToolsToggleBtn || !chatForm) {
        return;
    }

    if (!isMobileViewport()) {
        imageUploadBtn.style.display = "";
        voiceBtn.style.display = "";
        composerToolsToggleBtn.style.display = "none";
        chatForm.classList.remove("mobile-tools-visible");
        return;
    }

    composerToolsToggleBtn.style.display = "inline-flex";
    const showTools = Boolean(appSettings.mobileComposerExpanded);
    imageUploadBtn.style.display = showTools ? "inline-flex" : "none";
    voiceBtn.style.display = showTools ? "inline-flex" : "none";
    chatForm.classList.toggle("mobile-tools-visible", showTools);
    composerToolsToggleBtn.setAttribute("aria-expanded", showTools ? "true" : "false");
    if (!showTools) {
        closeImageSourceMenu();
    }
}


function closeImageSourceMenu({ restoreFocus = false } = {}) {
    if (!imageSourceMenu) {
        return;
    }
    if (imageSourceMenuHideTimer) {
        window.clearTimeout(imageSourceMenuHideTimer);
        imageSourceMenuHideTimer = null;
    }
    imageSourceMenu.classList.remove("is-open");
    imageUploadBtn?.setAttribute("aria-expanded", "false");
    imageSourceMenuHideTimer = window.setTimeout(() => {
        if (!imageSourceMenu.classList.contains("is-open")) {
            imageSourceMenu.hidden = true;
        }
    }, 170);
    if (restoreFocus) {
        imageUploadBtn?.focus();
    }
}

function closeStickerPicker({ restoreFocus = false } = {}) {
    if (!stickerPickerMenu) {
        return;
    }
    stickerPickerMenu.classList.remove("is-open");
    stickerPickerBtn?.setAttribute("aria-expanded", "false");
    window.setTimeout(() => {
        if (!stickerPickerMenu.classList.contains("is-open")) {
            stickerPickerMenu.hidden = true;
        }
    }, 170);
    if (restoreFocus) {
        stickerPickerBtn?.focus();
    }
}

function setStickerPickerState(message = "", { isError = false, hidden = false } = {}) {
    if (!stickerPickerState) {
        return;
    }
    stickerPickerState.textContent = message;
    stickerPickerState.classList.toggle("is-error", Boolean(isError));
    stickerPickerState.hidden = Boolean(hidden);
}

function setStickerPickerProgress(percent = 0, { visible = false } = {}) {
    if (!stickerPickerProgress || !stickerPickerProgressFill) {
        return;
    }
    const safePercent = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
    stickerPickerProgress.hidden = !visible;
    stickerPickerProgressFill.style.width = `${safePercent}%`;
}

function renderStickerPickerItems(stickers) {
    if (!stickerPickerGrid) {
        return;
    }
    stickerPickerGrid.innerHTML = "";

    if (!Array.isArray(stickers) || !stickers.length) {
        setStickerPickerState("No stickers yet. Add your first sticker.");
        return;
    }

    setStickerPickerState("Tap any sticker to send.");
    const fragment = document.createDocumentFragment();
    stickers.forEach((sticker) => {
        const stickerId = Number(sticker?.id || 0);
        if (stickerId <= 0) {
            return;
        }
        const item = document.createElement("button");
        item.type = "button";
        item.className = "sticker-picker-item";
        item.setAttribute("role", "listitem");
        const uploadedBy = String(sticker?.uploaded_by_username || "").trim();
        item.setAttribute(
            "aria-label",
            uploadedBy ? `Send sticker by ${uploadedBy}` : `Send sticker ${stickerId}`
        );
        item.title = uploadedBy ? `Send sticker • by ${uploadedBy}` : "Send sticker";
        item.setAttribute("data-sticker-id", String(stickerId));
        item.innerHTML = `<img src="${escapeHtml(String(sticker?.url || ""))}" alt="Sticker" loading="lazy" decoding="async" />`;
        item.addEventListener("click", async () => {
            await sendStickerMessage(stickerId);
        });
        fragment.appendChild(item);
    });
    stickerPickerGrid.appendChild(fragment);
}

async function loadStickers({ force = false } = {}) {
    if (isStickersLoading) {
        return;
    }
    if (hasLoadedStickers && !force) {
        renderStickerPickerItems(stickersCache);
        return;
    }

    isStickersLoading = true;
    setStickerPickerProgress(0, { visible: false });
    setStickerPickerState("Loading stickers...");
    try {
        const response = await window.ApiService.jsonOk("api/messages/stickers/fetch.php?limit=200");
        stickersCache = Array.isArray(response?.stickers) ? response.stickers : [];
        hasLoadedStickers = true;
        renderStickerPickerItems(stickersCache);
    } catch (error) {
        stickersCache = [];
        setStickerPickerState(String(error?.message || "Failed to load stickers."), { isError: true });
    } finally {
        isStickersLoading = false;
    }
}

function openStickerPicker() {
    if (!stickerPickerMenu) {
        return;
    }
    closeImageSourceMenu();
    stickerPickerMenu.hidden = false;
    stickerPickerBtn?.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(() => {
        stickerPickerMenu.classList.add("is-open");
    });
    void loadStickers();
}

async function sendStickerMessage(stickerId) {
    if (!currentChatUser) {
        showModal(I18N_TEXT.noChatSelectedTitle, I18N_TEXT.noChatSelectedBody, "warning");
        return;
    }

    const normalizedStickerId = Number(stickerId || 0);
    if (normalizedStickerId <= 0) {
        return;
    }

    try {
        const payload = new URLSearchParams();
        const groupId = parseGroupIdFromToken(currentChatUser);
        if (groupId > 0) {
            payload.set("group_id", String(groupId));
        } else {
            payload.set("target", String(currentChatUser));
        }
        payload.set("sticker_id", String(normalizedStickerId));

        await window.ApiService.jsonOk("api/messages/stickers/send.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                ...getCsrfHeaders(),
            },
            body: payload.toString(),
        });

        closeStickerPicker();
        if (!isGroupToken(currentChatUser)) {
            addUserToChatList(currentChatUser);
            updateTypingStatus(false);
        }
        loadCurrentChatsRecentMessages();
        setComposerStatus("");
    } catch (error) {
        setComposerStatus("Unable to send sticker", "error");
        showModal("Sticker Send Error", error?.message || "Failed to send sticker.", "error");
    }
}

async function uploadSticker(file) {
    if (!file) {
        return;
    }
    const type = String(file.type || "").toLowerCase();
    if (type && !type.startsWith("image/")) {
        showModal("Invalid Sticker", "Please choose a valid image file.", "warning");
        return;
    }
    if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
        showModal("Sticker Too Large", "Sticker source image must be 20MB or smaller.", "warning");
        return;
    }

    const shouldRemoveBackground = await chooseStickerBackgroundOption(file);
    if (shouldRemoveBackground === null) {
        setStickerPickerState("Sticker upload cancelled.");
        return;
    }

    let preparedStickerFile = file;
    try {
        setStickerPickerProgress(0, { visible: true });
        setStickerPickerState("Preparing sticker... 0%");
        preparedStickerFile = await normalizeStickerUploadFile(
            file,
            (percent, step) => {
            const safePercent = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
            const safeStep = String(step || "Preparing").trim();
            setStickerPickerState(`${safeStep}... ${safePercent}%`);
            setStickerPickerProgress(Math.min(85, safePercent), { visible: true });
            },
            { removeBackground: shouldRemoveBackground }
        );
    } catch (error) {
        preparedStickerFile = file;
        setStickerPickerState("Sticker optimization unavailable on this browser. Uploading original image...");
        setStickerPickerProgress(30, { visible: true });
    }

    if (preparedStickerFile.size > STICKER_UPLOAD_MAX_BYTES) {
        showModal("Sticker Too Large", "Sticker must be 512KB or smaller.", "warning");
        setStickerPickerProgress(0, { visible: false });
        return;
    }

    const payload = new FormData();
    payload.append("sticker_file", preparedStickerFile);

    try {
        setStickerPickerState("Uploading sticker...");
        setStickerPickerProgress(92, { visible: true });
        await window.ApiService.jsonOk("api/messages/stickers/upload.php", {
            method: "POST",
            headers: getCsrfHeaders(),
            body: payload,
        });
        await loadStickers({ force: true });
        showTransientComposerSuccessTick();
        setStickerPickerState("Tap any sticker to send.");
        setStickerPickerProgress(100, { visible: true });
        window.setTimeout(() => {
            setStickerPickerProgress(0, { visible: false });
        }, 450);
    } catch (error) {
        setStickerPickerState(String(error?.message || "Sticker upload failed."), { isError: true });
        setStickerPickerProgress(0, { visible: false });
        setComposerStatus("Sticker upload failed", "error");
    }
}

// drawStickerImageOnCanvas, buildStickerChoicePreviewDataUrl → chat-sticker-utils.js
const buildStickerChoicePreviewDataUrl = window.StickerUtils.buildStickerChoicePreviewDataUrl;

async function chooseStickerBackgroundOption(file) {
    if (
        !stickerBgChoiceOverlay ||
        !stickerBgChoiceLoading ||
        !stickerBgChoiceGrid ||
        !stickerBgKeepBtn ||
        !stickerBgRemoveBtn ||
        !stickerBgKeepPreview ||
        !stickerBgRemovePreview
    ) {
        return true;
    }

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    stickerBgChoiceOverlay.hidden = false;
    stickerBgChoiceLoading.hidden = false;
    stickerBgChoiceGrid.hidden = true;
    stickerBgKeepPreview.removeAttribute("src");
    stickerBgRemovePreview.removeAttribute("src");

    return new Promise((resolve) => {
        let settled = false;
        let fallbackPreviewUrl = "";

        const finalize = (choice) => {
            if (settled) {
                return;
            }
            settled = true;
            cleanup();
            resolve(choice);
        };

        const onOverlayClick = (event) => {
            if (event.target === stickerBgChoiceOverlay) {
                finalize(null);
            }
        };

        const onEscape = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                finalize(null);
            }
        };

        const cleanup = () => {
            stickerBgChoiceOverlay.hidden = true;
            stickerBgKeepBtn.removeEventListener("click", onKeep);
            stickerBgRemoveBtn.removeEventListener("click", onRemove);
            stickerBgChoiceClose?.removeEventListener("click", onClose);
            stickerBgChoiceOverlay.removeEventListener("click", onOverlayClick);
            document.removeEventListener("keydown", onEscape);
            if (fallbackPreviewUrl) {
                URL.revokeObjectURL(fallbackPreviewUrl);
            }
            if (previousFocus) {
                previousFocus.focus();
            }
        };

        const onKeep = () => finalize(false);
        const onRemove = () => finalize(true);
        const onClose = () => finalize(null);

        stickerBgKeepBtn.addEventListener("click", onKeep);
        stickerBgRemoveBtn.addEventListener("click", onRemove);
        stickerBgChoiceClose?.addEventListener("click", onClose);
        stickerBgChoiceOverlay.addEventListener("click", onOverlayClick);
        document.addEventListener("keydown", onEscape);

        const runPreviewBuild = async () => {
            try {
                await new Promise((resolveFrame) => {
                    requestAnimationFrame(() => resolveFrame());
                });

                const [keepPreviewResult, removePreviewResult] = await Promise.allSettled([
                    buildStickerChoicePreviewDataUrl(file, false),
                    buildStickerChoicePreviewDataUrl(file, true),
                ]);

                if (settled) {
                    return;
                }

                let keepPreview = "";
                let removePreview = "";

                if (keepPreviewResult.status === "fulfilled") {
                    keepPreview = keepPreviewResult.value;
                }
                if (removePreviewResult.status === "fulfilled") {
                    removePreview = removePreviewResult.value;
                }

                if (!keepPreview || !removePreview) {
                    fallbackPreviewUrl = URL.createObjectURL(file);
                    keepPreview = keepPreview || fallbackPreviewUrl;
                    removePreview = removePreview || fallbackPreviewUrl;
                }

                stickerBgKeepPreview.src = keepPreview;
                stickerBgRemovePreview.src = removePreview;
                stickerBgChoiceLoading.hidden = true;
                stickerBgChoiceGrid.hidden = false;
                stickerBgRemoveBtn.focus();
            } catch (error) {
                if (settled) {
                    return;
                }
                fallbackPreviewUrl = URL.createObjectURL(file);
                stickerBgKeepPreview.src = fallbackPreviewUrl;
                stickerBgRemovePreview.src = fallbackPreviewUrl;
                stickerBgChoiceLoading.hidden = true;
                stickerBgChoiceGrid.hidden = false;
                stickerBgKeepBtn.focus();
            }
        };

        void runPreviewBuild();
    });
}

// loadImageElementFromFile, canvasToBlob, removeEdgeBlackWhiteBackground, normalizeStickerUploadFile → chat-sticker-utils.js
const normalizeStickerUploadFile = window.StickerUtils.normalizeStickerUploadFile;

function canUseNativeCameraCapture() {
    if (!imageCaptureInput) {
        return false;
    }
    const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
    const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(String(navigator.userAgent || ""));
    return Boolean(coarsePointer || mobileUserAgent);
}

function canUseBrowserCameraCapture() {
    const secureContext = window.isSecureContext || window.location.hostname === "localhost";
    return Boolean(
        secureContext &&
            navigator.mediaDevices &&
            typeof navigator.mediaDevices.getUserMedia === "function"
    );
}

function canUseBrowserVideoCapture() {
    return canUseBrowserCameraCapture() && typeof window.MediaRecorder !== "undefined";
}

async function detectVideoInputDevice() {
    if (hasVideoInputDevice !== null) {
        return hasVideoInputDevice;
    }
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.enumerateDevices !== "function") {
        hasVideoInputDevice = false;
        return false;
    }
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        hasVideoInputDevice = devices.some((device) => device.kind === "videoinput");
        return hasVideoInputDevice;
    } catch (error) {
        hasVideoInputDevice = null;
        return true;
    }
}

function stopCameraCaptureStream() {
    if (!cameraStream) {
        return;
    }
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    if (cameraCaptureVideo) {
        cameraCaptureVideo.srcObject = null;
    }
}

function stopVideoCaptureStream() {
    if (!videoCaptureStream) {
        return;
    }
    videoCaptureStream.getTracks().forEach((track) => track.stop());
    videoCaptureStream = null;
    if (videoCaptureVideo) {
        videoCaptureVideo.srcObject = null;
    }
}

function stopVideoCaptureTimer() {
    if (videoCaptureTimerIntervalId) {
        window.clearInterval(videoCaptureTimerIntervalId);
        videoCaptureTimerIntervalId = null;
    }
    if (videoCaptureTimer) {
        videoCaptureTimer.textContent = "00:00";
    }
}

function startVideoCaptureTimer() {
    stopVideoCaptureTimer();
    videoCaptureStartedAt = Date.now();
    if (!videoCaptureTimer) {
        return;
    }
    videoCaptureTimerIntervalId = window.setInterval(() => {
        const elapsedMs = Date.now() - videoCaptureStartedAt;
        const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
        const minutes = Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, "0");
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");
        videoCaptureTimer.textContent = `${minutes}:${seconds}`;
    }, 250);
}

function closeCameraCaptureOverlay() {
    if (!cameraCaptureOverlay) {
        return;
    }
    stopCameraCaptureStream();
    cameraCaptureOverlay.hidden = true;
    isCameraCaptureBusy = false;
    if (cameraCaptureTakeBtn) {
        cameraCaptureTakeBtn.disabled = false;
    }
}

function closeVideoCaptureOverlay() {
    stopVideoCaptureTimer();
    shouldSendVideoCapture = false;
    videoCaptureChunks = [];
    videoCaptureRecorder = null;
    stopVideoCaptureStream();
    if (videoCaptureOverlay) {
        videoCaptureOverlay.hidden = true;
    }
    if (videoCaptureStartBtn) {
        videoCaptureStartBtn.disabled = false;
    }
    if (videoCaptureStopBtn) {
        videoCaptureStopBtn.disabled = true;
    }
}

async function openCameraCaptureOverlay() {
    if (!cameraCaptureOverlay || !cameraCaptureVideo || !canUseBrowserCameraCapture()) {
        setComposerStatus("Camera capture is not supported in this browser/device.", "warning");
        return false;
    }

    try {
        const preferRear = { video: { facingMode: { ideal: "environment" } }, audio: false };
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia(preferRear);
        } catch (initialError) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        cameraStream = stream;
        cameraCaptureVideo.srcObject = stream;
        cameraCaptureOverlay.hidden = false;
        await cameraCaptureVideo.play();
        setComposerStatus("Camera ready", "success");
        return true;
    } catch (error) {
        closeCameraCaptureOverlay();
        setComposerStatus("Unable to access camera. Check browser permission settings.", "warning");
        return false;
    }
}

function pickVideoRecordingMimeType() {
    if (typeof window.MediaRecorder === "undefined") {
        return "";
    }
    const candidates = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
    ];
    return candidates.find((type) => window.MediaRecorder.isTypeSupported?.(type)) || "";
}

async function openVideoCaptureOverlay() {
    if (!videoCaptureOverlay || !videoCaptureVideo || !canUseBrowserVideoCapture()) {
        setComposerStatus("Video recording is not supported in this browser/device.", "warning");
        return false;
    }

    try {
        const preferRear = { video: { facingMode: { ideal: "environment" } }, audio: true };
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia(preferRear);
        } catch (initialError) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }

        videoCaptureStream = stream;
        videoCaptureChunks = [];
        shouldSendVideoCapture = false;
        videoCaptureVideo.srcObject = stream;
        videoCaptureOverlay.hidden = false;
        if (videoCaptureStartBtn) {
            videoCaptureStartBtn.disabled = false;
        }
        if (videoCaptureStopBtn) {
            videoCaptureStopBtn.disabled = true;
        }
        await videoCaptureVideo.play();
        setComposerStatus("Video recorder ready", "success");
        return true;
    } catch (error) {
        closeVideoCaptureOverlay();
        setComposerStatus("Unable to access camera/microphone for video recording.", "warning");
        return false;
    }
}

function startVideoCaptureRecording() {
    if (!videoCaptureStream || !canUseBrowserVideoCapture() || videoCaptureRecorder) {
        return;
    }

    try {
        const recordingType = pickVideoRecordingMimeType();
        videoCaptureChunks = [];
        shouldSendVideoCapture = false;
        const recorder = recordingType
            ? new MediaRecorder(videoCaptureStream, { mimeType: recordingType })
            : new MediaRecorder(videoCaptureStream);

        recorder.ondataavailable = (event) => {
            if (event?.data?.size) {
                videoCaptureChunks.push(event.data);
            }
        };

        recorder.onstop = async () => {
            const capturedChunks = videoCaptureChunks.slice();
            const shouldSend = shouldSendVideoCapture;
            const mimeType = recorder.mimeType || "video/webm";

            closeVideoCaptureOverlay();

            if (!shouldSend || !capturedChunks.length) {
                return;
            }

            const extension = mimeType.includes("mp4") ? "mp4" : "webm";
            const videoBlob = new Blob(capturedChunks, { type: mimeType });
            const videoFile = new File([videoBlob], `video_${Date.now()}.${extension}`, {
                type: mimeType,
            });
            await sendFileMessage(videoFile, { asVideo: true });
        };

        recorder.start(300);
        videoCaptureRecorder = recorder;
        startVideoCaptureTimer();
        if (videoCaptureStartBtn) {
            videoCaptureStartBtn.disabled = true;
        }
        if (videoCaptureStopBtn) {
            videoCaptureStopBtn.disabled = false;
        }
    } catch (error) {
        closeVideoCaptureOverlay();
        setComposerStatus("Unable to start video recording.", "error");
    }
}

function stopVideoCaptureRecording({ send = false } = {}) {
    shouldSendVideoCapture = Boolean(send);
    if (!videoCaptureRecorder) {
        closeVideoCaptureOverlay();
        return;
    }
    if (videoCaptureRecorder.state === "recording") {
        videoCaptureRecorder.stop();
        return;
    }
    closeVideoCaptureOverlay();
}

async function captureImageFromCameraAndSend() {
    if (!cameraCaptureVideo || !cameraCaptureCanvas || !cameraStream || isCameraCaptureBusy) {
        return;
    }

    const width = cameraCaptureVideo.videoWidth || 1280;
    const height = cameraCaptureVideo.videoHeight || 720;
    if (!width || !height) {
        setComposerStatus("Camera is still initializing. Please try again.", "warning");
        return;
    }

    isCameraCaptureBusy = true;
    cameraCaptureTakeBtn && (cameraCaptureTakeBtn.disabled = true);

    const context = cameraCaptureCanvas.getContext("2d");
    if (!context) {
        closeCameraCaptureOverlay();
        setComposerStatus("Unable to process captured image.", "error");
        return;
    }

    cameraCaptureCanvas.width = width;
    cameraCaptureCanvas.height = height;
    context.drawImage(cameraCaptureVideo, 0, 0, width, height);

    cameraCaptureCanvas.toBlob(
        (blob) => {
            if (!blob) {
                closeCameraCaptureOverlay();
                setComposerStatus("Camera capture failed.", "error");
                return;
            }
            if (blob.size > IMAGE_UPLOAD_MAX_BYTES) {
                closeCameraCaptureOverlay();
                showModal(I18N_TEXT.fileTooLargeTitle, I18N_TEXT.imageTooLargeBody, "warning");
                return;
            }
            const capturedFile = new File([blob], `camera_${Date.now()}.jpg`, {
                type: "image/jpeg",
            });
            closeCameraCaptureOverlay();
            void sendImageMessage(capturedFile);
        },
        "image/jpeg",
        0.92
    );
}

async function syncImageSourceMenuCapabilities() {
    if (!imageSourceCameraBtn) {
        return;
    }
    const supportsMobileCapture = canUseNativeCameraCapture();
    const supportsWebcam = canUseBrowserCameraCapture();
    const supportsVideoRecording = canUseBrowserVideoCapture();
    let hasCamera = false;
    if (supportsMobileCapture) {
        hasCamera = true;
    } else if (supportsWebcam) {
        hasCamera = await detectVideoInputDevice();
    }
    const supported = supportsMobileCapture || (supportsWebcam && hasCamera);
    imageSourceCameraBtn.disabled = !supported;
    imageSourceCameraBtn.title = supported
        ? "Take a new photo"
        : "No camera available on this device/browser";

    if (imageSourceRecordVideoBtn) {
        const supportsRecordVideo = supportsMobileCapture || (supportsVideoRecording && hasCamera);
        imageSourceRecordVideoBtn.disabled = !supportsRecordVideo;
        imageSourceRecordVideoBtn.title = supportsRecordVideo
            ? "Record new video"
            : "Video recording is unavailable on this device/browser";
    }
}

function openImageSourceMenu() {
    if (!imageSourceMenu) {
        imageUploadInput?.click();
        return;
    }
    closeStickerPicker();
    if (imageSourceMenuHideTimer) {
        window.clearTimeout(imageSourceMenuHideTimer);
        imageSourceMenuHideTimer = null;
    }
    if (imageSourceMenuHint) {
        const imageLimitMb = Math.max(1, Math.round(IMAGE_UPLOAD_MAX_BYTES / (1024 * 1024)));
        const fileLimitMb = Math.max(1, Math.round(FILE_UPLOAD_MAX_BYTES / (1024 * 1024)));
        imageSourceMenuHint.textContent = `Photo up to ${imageLimitMb}MB • Video up to ${fileLimitMb}MB`;
    }

    void syncImageSourceMenuCapabilities();
    imageSourceMenu.hidden = false;
    imageUploadBtn?.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(() => {
        imageSourceMenu.classList.add("is-open");
    });
}

function applySettingsUi() {
    applyUiPreferenceClasses();
    updateCurrentUsernameUi(currentSelfUsername || CURRENT_USER);
    updateSettingsAvatarPreview();
    if (settingThemeMode) {
        settingThemeMode.value = appSettings.themeMode;
    }
    if (settingDensityMode) {
        settingDensityMode.value = appSettings.densityMode;
    }
    if (settingFontScale) {
        settingFontScale.value = appSettings.fontScale;
    }
    if (settingShowTimestamps) {
        settingShowTimestamps.checked = appSettings.showTimestamps;
    }
    if (settingReduceMotion) {
        settingReduceMotion.checked = appSettings.reduceMotion;
    }
    if (settingNotificationSound) {
        settingNotificationSound.checked = appSettings.notificationSoundEnabled;
    }
    if (settingAutoScroll) {
        settingAutoScroll.checked = appSettings.autoScrollEnabled;
    }
    if (settingBrowserNotifications) {
        settingBrowserNotifications.checked = appSettings.browserNotificationsEnabled;
    }
    if (settingSendByEnter) {
        settingSendByEnter.checked = appSettings.sendByEnter;
    }
    if (settingShowSavedMessages) {
        settingShowSavedMessages.checked = appSettings.showSavedMessages;
    }
    syncMobileComposerActions();
}

/* Admin panel, user management, and blocked users moved to chat-admin.js */

function toggleSettingsPanel(forceState = null) {
    if (!settingsPanel || !settingsButton) {
        return;
    }
    const shouldOpen = forceState === null ? settingsPanel.hidden : forceState;
    settingsPanel.hidden = !shouldOpen;
    settingsButton.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
}

function bindSettingsUiEvents() {
    if (settingsButton) {
        settingsButton.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleSettingsPanel();
        });
    }

    quickConversationSearchBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleSettingsPanel(false);
        openConversationSearchBar();
    });

    alertPanelBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleSettingsPanel(false);
        openAnnouncementsPanel();
    });
    announcementsCloseBtn?.addEventListener("click", () => closeAnnouncementsPanel());
    announcementsOverlay?.addEventListener("click", (event) => {
        if (event.target === announcementsOverlay) closeAnnouncementsPanel();
    });

    savedMessagesInfoBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleSavedMessagesInfoPanel();
    });
    playlistCloseBtn?.addEventListener("click", () => closePlaylistPanel());
    playlistOverlay?.addEventListener("click", (event) => {
        if (event.target === playlistOverlay) closePlaylistPanel();
    });

    openUiSettingsBtn?.addEventListener("click", () => {
        toggleSettingsPanel(false);
        openUiSettingsModal();
    });

    chatUiSettingsClose?.addEventListener("click", () => {
        closeUiSettingsModal();
    });

    chatUiSettingsOverlay?.addEventListener("click", (event) => {
        if (event.target === chatUiSettingsOverlay) {
            closeUiSettingsModal();
        }
    });

    settingThemeMode?.addEventListener("change", (event) => {
        appSettings.themeMode = ["system", "light", "dark"].includes(event.target.value)
            ? event.target.value
            : "system";
        persistAppSettings();
        applyUiPreferenceClasses();
    });

    settingDensityMode?.addEventListener("change", (event) => {
        appSettings.densityMode = event.target.value === "compact" ? "compact" : "comfortable";
        persistAppSettings();
        applyUiPreferenceClasses();
    });

    settingFontScale?.addEventListener("change", (event) => {
        appSettings.fontScale = ["sm", "md", "lg", "xl"].includes(event.target.value)
            ? event.target.value
            : "md";
        persistAppSettings();
        applyUiPreferenceClasses();
    });

    settingShowTimestamps?.addEventListener("change", (event) => {
        appSettings.showTimestamps = Boolean(event.target.checked);
        persistAppSettings();
        applyUiPreferenceClasses();
    });

    settingReduceMotion?.addEventListener("change", (event) => {
        appSettings.reduceMotion = Boolean(event.target.checked);
        persistAppSettings();
        applyUiPreferenceClasses();
    });

    if (settingNotificationSound) {
        settingNotificationSound.addEventListener("change", (event) => {
            appSettings.notificationSoundEnabled = Boolean(event.target.checked);
            persistAppSettings();
            setComposerStatus(
                appSettings.notificationSoundEnabled
                    ? "Notification sound enabled"
                    : "Notification sound disabled",
                "success"
            );
        });
    }

    if (settingAutoScroll) {
        settingAutoScroll.addEventListener("change", (event) => {
            appSettings.autoScrollEnabled = Boolean(event.target.checked);
            persistAppSettings();
            setComposerStatus(
                appSettings.autoScrollEnabled
                    ? "Auto-scroll enabled"
                    : "Auto-scroll disabled",
                "success"
            );
        });
    }

    openConversationSearchBtn?.addEventListener("click", () => {
        toggleSettingsPanel(false);
        openConversationSearchBar();
    });

    openAvatarUploadBtn?.addEventListener("click", () => {
        toggleSettingsPanel(false);
        avatarUploadInput?.click();
    });

    document.getElementById("openAnnouncementsBtn")?.addEventListener("click", () => {
        toggleSettingsPanel(false);
        openAnnouncementsPanel();
    });

    settingsAvatarUploadBtn?.addEventListener("click", () => {
        avatarUploadInput?.click();
    });

    avatarUploadInput?.addEventListener("change", async (event) => {
        const selectedFile = event.target?.files?.[0];
        event.target.value = "";

        if (!selectedFile) {
            return;
        }

        if (!String(selectedFile.type || "").startsWith("image/")) {
            showModal("Invalid Avatar", "Please choose an image file.", "warning");
            return;
        }

        if (selectedFile.size > AVATAR_UPLOAD_MAX_BYTES) {
            const avatarLimitMb = Math.max(1, Math.round(AVATAR_UPLOAD_MAX_BYTES / (1024 * 1024)));
            showModal("Avatar Too Large", `Avatar size must be less than ${avatarLimitMb}MB.`, "warning");
            return;
        }

        const payload = new FormData();
        payload.append("avatar_file", selectedFile);

        try {
            await window.ApiService.jsonOk("api/users/upload_avatar.php", {
                method: "POST",
                headers: {
                    ...getCsrfHeaders(),
                },
                body: payload,
            });
            avatarCacheVersion = Date.now();
            refreshVisibleAvatars();
            updateSettingsAvatarPreview();
            setComposerStatus("Profile avatar updated", "success");
            showModal("Avatar Updated", "Your profile avatar was updated successfully.", "success");
        } catch (error) {
            showModal("Avatar Update Failed", error?.message || "Failed to update avatar.", "error");
            setComposerStatus("Unable to update avatar", "error");
        }
    });

    chatUiSettingsTabGeneral?.addEventListener("click", () => {
        applySettingsTabUi("general");
    });

    chatUiSettingsTabAccount?.addEventListener("click", () => {
        applySettingsTabUi("account");
        if (window.AdminPanel) void window.AdminPanel.loadBlockedUsersSettings();
    });

    chatUiSettingsTabAdmin?.addEventListener("click", async () => {
        applySettingsTabUi("admin");
        if (window.AdminPanel) await window.AdminPanel.refreshAdminSettingsData();
    });

    chatUiSettingsTabIdeas?.addEventListener("click", async () => {
        applySettingsTabUi("ideas");
        if (typeof window.loadIdeasList === "function") await window.loadIdeasList();
    });

    if (settingBrowserNotifications) {
        settingBrowserNotifications.addEventListener("change", async (event) => {
            const wantEnabled = Boolean(event.target.checked);
            if (wantEnabled) {
                if (!("Notification" in window)) {
                    event.target.checked = false;
                    showModal("Not Supported", "Browser notifications are not supported in this browser.", "warning");
                    return;
                }
                let permission = Notification.permission;
                if (permission === "default") {
                    permission = await Notification.requestPermission();
                }
                if (permission !== "granted") {
                    event.target.checked = false;
                    showModal("Permission Denied", "Browser notification permission was denied. Enable it in your browser settings.", "warning");
                    return;
                }
            }
            appSettings.browserNotificationsEnabled = wantEnabled;
            persistAppSettings();
            setComposerStatus(
                wantEnabled ? "Browser notifications enabled" : "Browser notifications disabled",
                "success"
            );
        });
    }

    if (settingSendByEnter) {
        settingSendByEnter.addEventListener("change", (event) => {
            appSettings.sendByEnter = Boolean(event.target.checked);
            persistAppSettings();
            setComposerStatus(
                appSettings.sendByEnter ? "Enter sends message" : "Enter adds new line",
                "success"
            );
        });
    }

    if (settingShowSavedMessages) {
        settingShowSavedMessages.addEventListener("change", (event) => {
            appSettings.showSavedMessages = Boolean(event.target.checked);
            persistAppSettings();
            const savedMsgItem = document.getElementById(chatListItemId(CURRENT_USER));
            if (savedMsgItem) {
                savedMsgItem.style.display = appSettings.showSavedMessages ? "" : "none";
            }
            setComposerStatus(
                appSettings.showSavedMessages ? "Saved Messages shown in chat list" : "Saved Messages hidden from chat list",
                "success"
            );
        });
    }

    settingsGroupKeyHealthBtn?.addEventListener("click", async () => {
        await runGroupKeyHealthCheck();
    });

    // Media cache UI
    const clearMediaCacheBtn = document.getElementById("clearMediaCacheBtn");
    const mediaCacheSizeLabel = document.getElementById("mediaCacheSizeLabel");
        const clearCookiesBtn = document.getElementById("clearCookiesBtn");
        if (clearCookiesBtn) {
            clearCookiesBtn.addEventListener("click", async () => {
                const confirmed = window.confirm("Clear all cookies and storage? You will be logged out and get the latest version. Proceed?");
                if (!confirmed) return;
                clearCookiesBtn.disabled = true;
                clearCookiesBtn.textContent = "Clearing…";
                try {
                    // Clear cookies
                    document.cookie.split(";").forEach(function(c) {
                        document.cookie = c.replace(/^\s+/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
                    });
                    // Clear localStorage and sessionStorage
                    localStorage.clear();
                    sessionStorage.clear();
                    setComposerStatus("Cookies and storage cleared", "success");
                } catch (_) {
                    setComposerStatus("Failed to clear cookies/storage", "error");
                }
                clearCookiesBtn.disabled = false;
                clearCookiesBtn.textContent = "Clear";
                // Reload page to ensure logout and fresh version
                setTimeout(() => { window.location.reload(); }, 800);
            });
        }

    refreshMediaCacheLabelGlobal = async function refreshMediaCacheLabel() {
        if (!mediaCacheSizeLabel) return;
        try {
            const stats = await getMediaCacheStats();
            if (stats.count === 0) {
                mediaCacheSizeLabel.textContent = "Empty";
            } else {
                mediaCacheSizeLabel.textContent = `${stats.count} items · ${formatFileSize(stats.totalSize)}`;
            }
        } catch (_) {
            mediaCacheSizeLabel.textContent = "Unavailable";
        }
    }

    if (clearMediaCacheBtn) {
        clearMediaCacheBtn.addEventListener("click", async () => {
            const confirmed = window.confirm("Clear all cached media? Images and videos will need to be re-downloaded.");
            if (!confirmed) return;

            clearMediaCacheBtn.disabled = true;
            clearMediaCacheBtn.textContent = "Clearing…";
            try {
                await clearMediaCache();
                clearDecryptedMediaCache();
                setComposerStatus("Media cache cleared", "success");
            } catch (_) {
                setComposerStatus("Failed to clear media cache", "error");
            }
            clearMediaCacheBtn.disabled = false;
            clearMediaCacheBtn.textContent = "Clear";
            await refreshMediaCacheLabelGlobal();
        });
    }

    // Refresh label when settings panel opens
    void refreshMediaCacheLabelGlobal();

    /* Admin refresh, blocked users, media cleanup events moved to chat-admin.js */

    settingsUsernameForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = String(settingsUsernameInput?.value || "").trim();
        if (!username) {
            showModal("Invalid Username", "Please provide a username.", "warning");
            return;
        }

        try {
            const response = await window.ApiService.jsonOk("api/users/update_profile.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({
                    action: "username",
                    username,
                }),
            });
            const updatedUsername = String(response?.username || username);
            updateCurrentUsernameUi(updatedUsername);
            setComposerStatus("Username updated", "success");
            showModal("Username Updated", "Your username was updated successfully.", "success");
            window.setTimeout(() => {
                window.location.reload();
            }, 260);
        } catch (error) {
            showModal("Username Update Failed", error?.message || "Unable to update username.", "error");
            setComposerStatus("Unable to update username", "error");
        }
    });

    settingsPasswordForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const currentPassword = String(settingsCurrentPasswordInput?.value || "");
        const newPassword = String(settingsNewPasswordInput?.value || "");
        const confirmPassword = String(settingsConfirmPasswordInput?.value || "");

        if (!currentPassword || !newPassword || !confirmPassword) {
            showModal("Missing Password Fields", "Please fill all password fields.", "warning");
            return;
        }

        if (newPassword !== confirmPassword) {
            showModal("Password Mismatch", "New password and confirmation do not match.", "warning");
            return;
        }

        try {
            await window.ApiService.jsonOk("api/users/update_profile.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({
                    action: "password",
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                }),
            });
            if (settingsCurrentPasswordInput) {
                settingsCurrentPasswordInput.value = "";
            }
            if (settingsNewPasswordInput) {
                settingsNewPasswordInput.value = "";
            }
            if (settingsConfirmPasswordInput) {
                settingsConfirmPasswordInput.value = "";
            }
            setComposerStatus("Password updated", "success");
            showModal("Password Updated", "Your password was changed successfully.", "success");
        } catch (error) {
            showModal("Password Update Failed", error?.message || "Unable to update password.", "error");
            setComposerStatus("Unable to update password", "error");
        }
    });

    if (composerToolsToggleBtn) {
        composerToolsToggleBtn.addEventListener("click", () => {
            appSettings.mobileComposerExpanded = !appSettings.mobileComposerExpanded;
            persistAppSettings();
            syncMobileComposerActions();
        });
    }

    document.addEventListener("click", (event) => {
        if (!settingsPanel || settingsPanel.hidden) {
            return;
        }
        if (
            !event.target.closest("#chatSettingsPanel") &&
            !event.target.closest("#chatSettingsBtn") &&
            !event.target.closest("#quickConversationSearchBtn")
        ) {
            toggleSettingsPanel(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && settingsPanel && !settingsPanel.hidden) {
            toggleSettingsPanel(false);
            settingsButton?.focus();
            return;
        }
        if (event.key === "Escape" && chatUiSettingsOverlay && !chatUiSettingsOverlay.hidden) {
            closeUiSettingsModal();
        }
    });

    chatInput?.addEventListener("focus", () => {
        closeStickerPicker();
        if (isMobileViewport()) {
            appSettings.mobileComposerExpanded = false;
            persistAppSettings();
            syncMobileComposerActions();
        }
    });

    window.addEventListener("resize", syncMobileComposerActions);

    userInfoBtn?.addEventListener("click", async () => {
        if (!currentChatUser || isGroupToken(currentChatUser)) {
            return;
        }
        const userId = Number(chatUserIdsByUsername.get(currentChatUser) || 0);
        await openUserProfileModal({ userId, username: currentChatUser });
    });

    chatWithElem?.addEventListener("click", async () => {
        if (!currentChatUser) {
            return;
        }

        if (isGroupToken(currentChatUser)) {
            const groupId = getCurrentGroupId();
            if (!groupId) {
                return;
            }
            await renderGroupInfoPanel(groupId);
            openGroupInfoPanel();
            return;
        }

        const userId = Number(chatUserIdsByUsername.get(currentChatUser) || 0);
        await openUserProfileModal({ userId, username: currentChatUser });
    });

    chatWithElem?.addEventListener("keydown", async (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }
        if (!currentChatUser) {
            return;
        }
        event.preventDefault();

        if (isGroupToken(currentChatUser)) {
            const groupId = getCurrentGroupId();
            if (!groupId) {
                return;
            }
            await renderGroupInfoPanel(groupId);
            openGroupInfoPanel();
            return;
        }

        const userId = Number(chatUserIdsByUsername.get(currentChatUser) || 0);
        await openUserProfileModal({ userId, username: currentChatUser });
    });

    userProfileModalClose?.addEventListener("click", closeUserProfileModal);
    userProfileModalOverlay?.addEventListener("click", (event) => {
        if (event.target === userProfileModalOverlay) {
            closeUserProfileModal();
        }
    });

    avatarViewerClose?.addEventListener("click", closeAvatarViewer);
    avatarViewerOverlay?.addEventListener("click", (event) => {
        if (event.target === avatarViewerOverlay) {
            closeAvatarViewer();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }
        if (avatarViewerOverlay && !avatarViewerOverlay.hidden) {
            closeAvatarViewer();
            return;
        }
        if (userProfileModalOverlay && !userProfileModalOverlay.hidden) {
            closeUserProfileModal();
        }
    });

    chatListElem?.addEventListener("contextmenu", async (event) => {
        const item = event.target.closest("li.chat-user:not(.chat-group)");
        if (!item) {
            return;
        }
        const usernameNode = item.querySelector("span:not(.avatar):not(.chat-item-unread-badge)");
        const username = usernameNode?.textContent?.trim() || "";
        if (!username) {
            return;
        }
        event.preventDefault();
        const userId = Number(chatUserIdsByUsername.get(username) || 0);
        await openUserProfileModal({ userId, username });
    });

    chatMessagesElem?.addEventListener("click", async (event) => {
        const avatarImage = event.target.closest(".group-message-avatar-image");
        const senderName = event.target.closest(".group-message-name");
        if (!avatarImage && !senderName) {
            return;
        }
        event.preventDefault();
        const sourceElement = avatarImage || senderName;
        const messageElement = sourceElement?.closest(".message");
        const userId = Number(messageElement?.getAttribute("data-sender-id") || 0);
        const username = String(messageElement?.getAttribute("data-sender-username") || "");
        if (!userId && !username) {
            return;
        }
        await openUserProfileModal({ userId, username });
    });

    groupInfoMembers?.addEventListener("click", async (event) => {
        const avatarImage = event.target.closest(".group-member-avatar-image");
        if (!avatarImage) {
            return;
        }
        event.preventDefault();
        const memberItem = avatarImage.closest(".group-member-item");
        const userId = Number(memberItem?.getAttribute("data-member-user-id") || 0);
        const username = String(memberItem?.getAttribute("data-member-username") || "");
        if (!userId && !username) {
            return;
        }
        await openUserProfileModal({ userId, username });
    });
}

function bindMessageActionModalEvents() {
    messageActionModalClose?.addEventListener("click", closeMessageActionModal);
    messageActionModalOverlay?.addEventListener("click", (event) => {
        if (event.target === messageActionModalOverlay) {
            closeMessageActionModal();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && messageActionModalOverlay && !messageActionModalOverlay.hidden) {
            event.preventDefault();
            closeMessageActionModal();
            return;
        }
        trapActionModalFocus(event);
    });
}

function bindSelectModeEvents() {
    selectModeCancelBtn?.addEventListener("click", () => {
        exitSelectMode({ clearSelection: true });
    });

    selectModeCopyBtn?.addEventListener("click", async () => {
        await bulkCopySelectedMessages();
    });

    selectModeForwardBtn?.addEventListener("click", async () => {
        await bulkForwardSelectedMessages();
    });

    selectModeDeleteBtn?.addEventListener("click", async () => {
        await bulkDeleteSelectedMessages();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadAppSettings();
    applySettingsUi();
    bindSettingsUiEvents();
    if (window.AdminPanel) window.AdminPanel.init();
    logoutForm?.addEventListener("submit", () => {
        clearPersistedAdminDebugState();
    });
    bindSelectModeEvents();
    bindMessageActionModalEvents();
    bindConversationSearchEvents();
    bindCreateGroupModalEvents();
    notificationPlayer.preloadCustom();
    checkAnnouncementUnread();
});

function getCsrfHeaders() {
    if (window.ApiService?.csrfHeaders) {
        return window.ApiService.csrfHeaders();
    }
    if (typeof CSRF_TOKEN === "string" && CSRF_TOKEN.length) {
        return { "X-CSRF-Token": CSRF_TOKEN };
    }
    return {};
}
// Expose for extracted modules (ideas.js, changelog.js)
window.getCsrfHeaders = getCsrfHeaders;

function closeGroupInfoPanel() {
    if (groupInfoPanel) {
        groupInfoPanel.hidden = true;
    }
    if (groupInfoBtn) {
        groupInfoBtn.setAttribute("aria-expanded", "false");
    }
    chatAreaElem?.classList.remove("group-panel-open");
}

function openGroupInfoPanel() {
    if (groupInfoPanel) {
        groupInfoPanel.hidden = false;
    }
    if (groupInfoBtn) {
        groupInfoBtn.setAttribute("aria-expanded", "true");
    }
    closeConversationSearchBar({ clearInput: false });
    chatAreaElem?.classList.add("group-panel-open");
}

function openCreateGroupModal() {
    if (!createGroupModalOverlay) {
        return;
    }
    createGroupModalOverlay.hidden = false;
    if (createGroupForm) {
        createGroupForm.reset();
    }
    createGroupSubmitBtn && (createGroupSubmitBtn.disabled = false);
    setTimeout(() => {
        createGroupTitleInput?.focus();
    }, 0);
}

function closeCreateGroupModal() {
    if (!createGroupModalOverlay) {
        return;
    }
    createGroupModalOverlay.hidden = true;
    if (createGroupForm) {
        createGroupForm.reset();
    }
    createGroupSubmitBtn && (createGroupSubmitBtn.disabled = false);
}

function bindCreateGroupModalEvents() {
    createGroupModalClose?.addEventListener("click", closeCreateGroupModal);
    createGroupModalOverlay?.addEventListener("click", (event) => {
        if (event.target === createGroupModalOverlay) {
            closeCreateGroupModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && createGroupModalOverlay && !createGroupModalOverlay.hidden) {
            event.preventDefault();
            closeCreateGroupModal();
        }
    });

    createGroupForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = String(createGroupTitleInput?.value || "").trim();
        const description = String(createGroupDetailsInput?.value || "").trim();

        if (!title) {
            createGroupTitleInput?.focus();
            setComposerStatus("Group title is required", "warning");
            return;
        }

        try {
            if (createGroupSubmitBtn) {
                createGroupSubmitBtn.disabled = true;
            }
            await createGroupFlow(title, description);
            closeCreateGroupModal();
        } catch (error) {
            createGroupSubmitBtn && (createGroupSubmitBtn.disabled = false);
            showModal("Create Group Failed", error.message || "Unable to create group", "error");
        }
    });
}

async function fetchAndImportGroupCryptoKey(groupId) {
    const data = await window.ApiService.jsonOk("api/keys/get_group.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getCsrfHeaders(),
        },
        body: JSON.stringify({ group_id: groupId }),
    });
    const encryptedGroupKey = String(data?.encrypted_group_key || "").trim();
    if (!encryptedGroupKey) {
        throw new Error("Group encryption key is unavailable");
    }

    await ensurePrivateKeyLoaded();
    const rawGroupKey = await decryptServerWrappedMessage(encryptedGroupKey);
    if (!rawGroupKey) {
        throw new Error("Failed to decrypt group encryption key");
    }

    const importedKey = await importGroupSymmetricKey(rawGroupKey);
    const keyVersion = Number(data?.key_version || 1) || 1;
    groupKeyVersionCache.set(Number(groupId), Math.max(1, keyVersion));
    return importedKey;
}

async function getGroupCryptoKey(groupId, forceRefresh = false) {
    if (!groupId) {
        throw new Error("Invalid group id");
    }

    if (!forceRefresh && groupTextCryptoKeyCache.has(groupId)) {
        return groupTextCryptoKeyCache.get(groupId);
    }

    if (!forceRefresh && groupTextCryptoKeyInflight.has(groupId)) {
        return groupTextCryptoKeyInflight.get(groupId);
    }

    const request = fetchAndImportGroupCryptoKey(groupId)
        .then((key) => {
            groupTextCryptoKeyCache.set(groupId, key);
            groupTextCryptoKeyInflight.delete(groupId);
            return key;
        })
        .catch((error) => {
            groupTextCryptoKeyInflight.delete(groupId);
            throw error;
        });

    groupTextCryptoKeyInflight.set(groupId, request);
    return request;
}

function showMessageCopiedFeedback() {
    if (window.UIEnhancements?.showSearchNotification) {
        window.UIEnhancements.showSearchNotification(I18N_TEXT.copiedBody, "success");
        return;
    }
    showModal(I18N_TEXT.copiedTitle, I18N_TEXT.copiedBody, "success");
}

function showTransientSuccessToast(message) {
    const toastMessage = String(message || "").trim();
    if (!toastMessage) {
        return;
    }
    if (window.UIEnhancements?.showNotification) {
        window.UIEnhancements.showNotification(toastMessage, "success", 1400);
        return;
    }
    if (window.UIEnhancements?.showSearchNotification) {
        window.UIEnhancements.showSearchNotification(toastMessage, "success");
        return;
    }
    setComposerStatus(toastMessage, "success");
    setTimeout(() => {
        setComposerStatus("");
    }, 1400);
}

async function convertBlobToPng(blob) {
    if (!(blob instanceof Blob)) {
        throw new Error("Invalid image blob.");
    }
    const objectUrl = URL.createObjectURL(blob);
    try {
        const imageElement = new Image();
        const loaded = await new Promise((resolve, reject) => {
            imageElement.onload = () => resolve(true);
            imageElement.onerror = () => reject(new Error("Unable to decode image."));
            imageElement.src = objectUrl;
        });
        if (!loaded) {
            throw new Error("Unable to decode image.");
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Number(imageElement.naturalWidth || imageElement.width || 0));
        canvas.height = Math.max(1, Number(imageElement.naturalHeight || imageElement.height || 0));
        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Canvas not available.");
        }
        context.drawImage(imageElement, 0, 0);

        const pngBlob = await new Promise((resolve, reject) => {
            canvas.toBlob((result) => {
                if (result) {
                    resolve(result);
                    return;
                }
                reject(new Error("Unable to convert image."));
            }, "image/png");
        });
        return pngBlob;
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}

function closeMessageContextMenu() {
    const existing = document.getElementById("messageContextMenu");
    if (existing) {
        existing.remove();
        contextMenuJustClosedAt = Date.now();
    }
    suppressNextContextMenuTapUntil = 0;
    if (lastContextMenuMessageElement) {
        lastContextMenuMessageElement.focus();
        lastContextMenuMessageElement = null;
    }
}

function closeReactionPicker({ restoreFocus = true } = {}) {
    document.getElementById("messageReactionPicker")?.remove();
    if (restoreFocus && lastReactionPickerMessageElement) {
        lastReactionPickerMessageElement.focus();
    }
    lastReactionPickerMessageElement = null;
}

function getActionModalFocusableElements() {
    if (!messageActionModalOverlay || messageActionModalOverlay.hidden) {
        return [];
    }

    const selector = [
        "button:not([disabled])",
        "a[href]",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    return Array.from(messageActionModalOverlay.querySelectorAll(selector)).filter((element) => {
        if (!(element instanceof HTMLElement)) {
            return false;
        }
        if (element.hidden) {
            return false;
        }
        if (element.getClientRects().length > 0) {
            return true;
        }
        return element === document.activeElement;
    });
}

function focusFirstActionModalElement() {
    const focusable = getActionModalFocusableElements();
    if (focusable.length) {
        focusable[0].focus();
        return;
    }
    messageActionModalClose?.focus();
}

function trapActionModalFocus(event) {
    if (!messageActionModalOverlay || messageActionModalOverlay.hidden || event.key !== "Tab") {
        return;
    }

    const focusable = getActionModalFocusableElements();
    if (!focusable.length) {
        event.preventDefault();
        return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
    }

    if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
    }
}

function openMessageActionModal(title, bodyNode) {
    if (!messageActionModalOverlay || !messageActionModalTitle || !messageActionModalBody) {
        return;
    }

    lastFocusedElementBeforeActionModal =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

    messageActionModalTitle.textContent = title;
    messageActionModalBody.innerHTML = "";
    if (bodyNode instanceof Node) {
        messageActionModalBody.appendChild(bodyNode);
    }
    if (messageActionModalAnnouncer) {
        messageActionModalAnnouncer.textContent = formatI18nText(I18N_TEXT.modalOpened, {
            title,
        });
    }
    messageActionModalOverlay.setAttribute("aria-hidden", "false");
    messageActionModalOverlay.hidden = false;
    requestAnimationFrame(() => {
        messageActionModalOverlay.classList.add("visible");
        focusFirstActionModalElement();
    });
}

function closeMessageActionModal() {
    if (!messageActionModalOverlay) {
        return;
    }

    const closedTitle = messageActionModalTitle?.textContent?.trim() || "message action";

    messageActionModalOverlay.classList.remove("visible");
    messageActionModalOverlay.setAttribute("aria-hidden", "true");
    setTimeout(() => {
        if (!messageActionModalOverlay.classList.contains("visible")) {
            messageActionModalOverlay.hidden = true;
            if (messageActionModalBody) {
                messageActionModalBody.innerHTML = "";
            }
            if (
                lastFocusedElementBeforeActionModal &&
                document.contains(lastFocusedElementBeforeActionModal)
            ) {
                lastFocusedElementBeforeActionModal.focus();
            }
            lastFocusedElementBeforeActionModal = null;
            if (messageActionModalAnnouncer) {
                messageActionModalAnnouncer.textContent = formatI18nText(I18N_TEXT.modalClosed, {
                    title: closedTitle,
                });
            }
        }
    }, 180);
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
    if (messageElement.classList.contains("is-music-message")) {
        return "[Music]";
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
    const senderLabel = messageElement.classList.contains("sent")
        ? "You"
        : messageElement.getAttribute("data-sender-username") || getCurrentChatDisplayName();

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

    const senderLabel = Number(msg.reply_sender_id) === Number(CURRENT_USER_ID)
        ? "You"
        : msg.reply_sender_username || getCurrentChatDisplayName();
    const fallbackText = msg.reply_message_type === "text" ? "[Message]" : `[${msg.reply_message_type}]`;
    const previewText = (decryptedReplyText || fallbackText || "[Message]").slice(0, 160);

    return `
        <div class="reply-quote" data-reply-target-id="${msg.reply_message_id}">
            <div class="reply-quote-sender">${escapeHtml(senderLabel)}</div>
            <div class="reply-quote-text">${escapeHtml(previewText)}</div>
        </div>
    `;
}

function buildForwardedPreviewHtml(msg) {
    if (!msg.forwarded_from_message_id) {
        return "";
    }
    const forwardedBy = msg.forwarded_by_username || "Unknown";
    const originalSender = msg.forwarded_original_sender_username || "Unknown";
    return `
        <div class="forwarded-meta" aria-label="Forwarded message metadata">
            <i class="fas fa-share" aria-hidden="true"></i>
            <span>Forwarded</span>
            <span class="forwarded-meta-detail">by ${escapeHtml(forwardedBy)} · from ${escapeHtml(originalSender)}</span>
        </div>
    `;
}

/* ── Global Now Playing bar ── */
const globalNpBar = document.getElementById("globalNowPlayingBar");
const globalNpToggleBtn = document.getElementById("globalNpToggle");
const globalNpCaptionEl = document.getElementById("globalNpCaption");
const globalNpProgressWrap = document.getElementById("globalNpProgressWrap");
const globalNpProgressBar = document.getElementById("globalNpProgressBar");
const globalNpTimeEl = document.getElementById("globalNpTime");
const globalNpCloseBtn = document.getElementById("globalNpClose");

function showGlobalNowPlaying(audio, caption, type) {
    // Clean up previous audio listeners if switching tracks
    if (globalNpAudio && globalNpAudio !== audio) {
        globalNpAudio.removeEventListener("timeupdate", globalNpAudio._gnpTimeUpdate);
        globalNpAudio.removeEventListener("ended", globalNpAudio._gnpEnded);
        globalNpAudio.removeEventListener("pause", globalNpAudio._gnpPause);
        globalNpAudio.removeEventListener("play", globalNpAudio._gnpPlay);
    }
    globalNpAudio = audio;
    globalNpCaption = caption || "Now Playing";
    globalNpType = type || "music";
    if (globalNpBar) globalNpBar.hidden = false;
    if (globalNpCaptionEl) globalNpCaptionEl.textContent = globalNpCaption;
    if (globalNpProgressBar) globalNpProgressBar.style.width = "0%";
    if (globalNpTimeEl) globalNpTimeEl.textContent = "0:00";
    updateGlobalNpToggleIcon(true);

    // Remove any previous listeners by replacing the handler reference
    audio._gnpTimeUpdate = () => {
        if (!isFinite(audio.duration) || audio.duration <= 0) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        if (globalNpProgressBar) globalNpProgressBar.style.width = `${pct}%`;
        if (globalNpTimeEl) globalNpTimeEl.textContent = formatTimeShort(audio.currentTime);
    };
    audio._gnpEnded = () => {
        hideGlobalNowPlaying();
    };
    audio._gnpPause = () => {
        updateGlobalNpToggleIcon(false);
    };
    audio._gnpPlay = () => {
        updateGlobalNpToggleIcon(true);
    };
    audio.addEventListener("timeupdate", audio._gnpTimeUpdate);
    audio.addEventListener("ended", audio._gnpEnded);
    audio.addEventListener("pause", audio._gnpPause);
    audio.addEventListener("play", audio._gnpPlay);
}

function hideGlobalNowPlaying() {
    if (globalNpAudio) {
        globalNpAudio.removeEventListener("timeupdate", globalNpAudio._gnpTimeUpdate);
        globalNpAudio.removeEventListener("ended", globalNpAudio._gnpEnded);
        globalNpAudio.removeEventListener("pause", globalNpAudio._gnpPause);
        globalNpAudio.removeEventListener("play", globalNpAudio._gnpPlay);
    }
    globalNpAudio = null;
    globalNpCaption = "";
    globalNpType = "";
    if (globalNpBar) globalNpBar.hidden = true;
    if (globalNpProgressBar) globalNpProgressBar.style.width = "0%";
}

function updateGlobalNpToggleIcon(isPlaying) {
    if (globalNpToggleBtn) {
        globalNpToggleBtn.innerHTML = isPlaying
            ? '<i class="fas fa-pause"></i>'
            : '<i class="fas fa-play"></i>';
    }
}

// Toggle play/pause
globalNpToggleBtn?.addEventListener("click", () => {
    if (!globalNpAudio) return;
    if (globalNpAudio.paused) {
        globalNpAudio.play();
    } else {
        globalNpAudio.pause();
    }
});

// Stop and close
globalNpCloseBtn?.addEventListener("click", () => {
    if (globalNpAudio && !globalNpAudio.paused) {
        globalNpAudio.pause();
    }
    // Also stop any in-message playing state
    document.querySelectorAll(".voice-play-btn.playing, .music-play-btn.playing").forEach((btn) => {
        btn.classList.remove("playing");
        btn.innerHTML = '<i class="fas fa-play"></i>';
        btn.closest(".voice-player-container")?.classList.remove("is-playing");
        btn.closest(".music-player-container")?.classList.remove("is-playing");
    });
    hideGlobalNowPlaying();
});

// Seek on global progress bar
if (globalNpProgressWrap) {
    function seekGlobalNp(clientX) {
        if (!globalNpAudio || !isFinite(globalNpAudio.duration)) return;
        const rect = globalNpProgressWrap.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        globalNpAudio.currentTime = ratio * globalNpAudio.duration;
        if (globalNpProgressBar) globalNpProgressBar.style.width = `${ratio * 100}%`;
    }
    globalNpProgressWrap.addEventListener("mousedown", (e) => {
        e.preventDefault();
        seekGlobalNp(e.clientX);
        function onMove(ev) { seekGlobalNp(ev.clientX); }
        function onUp() { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    });
    globalNpProgressWrap.addEventListener("touchstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        seekGlobalNp(e.touches[0].clientX);
    });
    globalNpProgressWrap.addEventListener("touchmove", (e) => {
        e.preventDefault();
        e.stopPropagation();
        seekGlobalNp(e.touches[0].clientX);
    });
}

function clearInlineChatState() {
    chatMessagesElem.querySelector(".chat-inline-state")?.remove();
}

function showInlineChatState({
    message,
    kind = "error",
    actionLabel = "Retry",
    onAction = null,
} = {}) {
    clearInlineChatState();

    const wrapper = document.createElement("div");
    wrapper.className = `chat-inline-state chat-inline-state-${kind}`;

    const text = document.createElement("span");
    text.className = "chat-inline-state-text";
    text.textContent = message;
    wrapper.appendChild(text);

    if (typeof onAction === "function") {
        const actionBtn = document.createElement("button");
        actionBtn.type = "button";
        actionBtn.className = "btn btn-sm btn-outline-primary chat-inline-state-action";
        actionBtn.textContent = actionLabel;
        actionBtn.addEventListener("click", onAction);
        wrapper.appendChild(actionBtn);
    }

    chatMessagesElem.appendChild(wrapper);
}

function showEmptyChatState(message = "No messages yet. Start the conversation.") {
    clearInlineChatState();
    showInlineChatState({ message, kind: "info" });
}

async function copyMessageText(messageElement) {
    const messageText = getMessageTextForCopy(messageElement);
    if (!messageText) {
        showModal(I18N_TEXT.copyFailedTitle, I18N_TEXT.copyFailedNoText, "warning");
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
        showModal(I18N_TEXT.copyFailedTitle, I18N_TEXT.copyFailedUnknown, "error");
    }
}

async function copyImageMessageToClipboard(messageElement, messageData = null) {
    const messageType = String(
        messageData?.message_type ?? messageElement?.getAttribute("data-message-type") ?? ""
    );
    if (messageType !== "image") {
        showModal("Copy Failed", "Only image messages can be copied as image.", "warning");
        return;
    }

    if (!(window.isSecureContext && navigator.clipboard?.write && window.ClipboardItem)) {
        showModal("Copy Failed", "Image copy requires a secure browser context.", "warning");
        return;
    }

    try {
        let imageBlob = null;
        if (messageData?.id) {
            try {
                const mediaResource = await getDecryptedMediaResource(messageData);
                if (mediaResource?.blob instanceof Blob) {
                    imageBlob = mediaResource.blob;
                }
            } catch (error) {}
        }

        if (!imageBlob) {
            const imageElement = messageElement?.querySelector(".message-image");
            if (imageElement && imageElement.getAttribute("data-ready") !== "1" && messageData) {
                await hydrateImageMessageElement(messageElement, messageData);
            }

            const imageSource = String(messageElement?.querySelector(".message-image")?.src || "").trim();
            if (!imageSource) {
                showModal("Copy Failed", "Image is not available yet. Try again in a moment.", "warning");
                return;
            }

            const response = await fetch(imageSource);
            imageBlob = await response.blob();
        }

        const mimeType = String(imageBlob?.type || "image/png") || "image/png";
        try {
            await navigator.clipboard.write([new ClipboardItem({ [mimeType]: imageBlob })]);
        } catch (error) {
            const pngBlob = await convertBlobToPng(imageBlob);
            await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
        }
        showTransientSuccessToast("Image copied to clipboard.");
    } catch (error) {
        showModal("Copy Failed", "Unable to copy image.", "error");
    }
}

async function sendEncryptedTextMessage(
    targetUsername,
    text,
    replyToMessageId = null,
    forwardedFromMessageId = null
) {
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
    if (forwardedFromMessageId) {
        formData.append("forwarded_from_message_id", String(forwardedFromMessageId));
    }

    const json = await window.ApiService.jsonOk("api/messages/send_text.php", {
        method: "POST",
        headers: getCsrfHeaders(),
        body: formData,
    });

    return json;
}

async function sendGroupTextMessage(groupId, text, replyToMessageId = null, forwardedFromMessageId = null) {
    let groupKey;
    try {
        groupKey = await getGroupCryptoKey(groupId);
    } catch (error) {
        groupTextCryptoKeyCache.delete(Number(groupId));
        groupTextCryptoKeyInflight.delete(Number(groupId));
        groupKeyVersionCache.delete(Number(groupId));
        groupKey = await getGroupCryptoKey(groupId, true);
    }
    const encryptedGroupMessage = await encryptGroupMessage(text, groupKey);

    const formData = new FormData();
    formData.append("group_id", String(groupId));
    formData.append("message", encryptedGroupMessage);
    formData.append("message_for_sender", encryptedGroupMessage);

    if (replyToMessageId) {
        formData.append("reply_to_message_id", String(replyToMessageId));
    }
    if (forwardedFromMessageId) {
        formData.append("forwarded_from_message_id", String(forwardedFromMessageId));
    }

    const json = await window.ApiService.jsonOk("api/messages/send_text.php", {
        method: "POST",
        headers: getCsrfHeaders(),
        body: formData,
    });

    return json;
}

function createForwardTargetListContent(onSelectUsername) {
    const wrapper = document.createElement("div");
    wrapper.className = "forward-target-list";

    const users = Array.from(chatUsers)
        .filter((username) => username && username !== CURRENT_USER)
        .sort((a, b) => a.localeCompare(b));

    const groups = Array.from(chatGroupsById.values()).sort((a, b) =>
        String(a.title || "").localeCompare(String(b.title || ""))
    );

    if (!users.length && !groups.length) {
        const empty = document.createElement("div");
        empty.className = "forward-target-empty";
        empty.textContent = I18N_TEXT.forwardTargetEmpty;
        wrapper.appendChild(empty);
        return wrapper;
    }

    // Saved Messages always first in forward target list
    let fwdIdx = 0;
    const savedBtn = document.createElement("button");
    savedBtn.type = "button";
    savedBtn.className = "forward-target-item";
    savedBtn.style.setProperty("--i", String(fwdIdx++));
    savedBtn.innerHTML = `
        <span class="forward-target-avatar saved-messages-avatar"><i class="fas fa-bookmark"></i></span>
        <span class="forward-target-name">Saved Messages</span>
    `;
    savedBtn.addEventListener("click", () => onSelectUsername(CURRENT_USER, savedBtn));
    wrapper.appendChild(savedBtn);

    users.forEach((username) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "forward-target-item";
        button.style.setProperty("--i", String(fwdIdx++));
        button.innerHTML = `
            <span class="forward-target-avatar">${escapeHtml((username[0] || "?").toUpperCase())}</span>
            <span class="forward-target-name">${escapeHtml(username)}</span>
        `;
        button.addEventListener("click", () => onSelectUsername(username, button));
        wrapper.appendChild(button);
    });

    groups.forEach((group) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "forward-target-item";
        button.style.setProperty("--i", String(fwdIdx++));
        button.innerHTML = `
            <span class="forward-target-avatar"><i class="fas fa-users"></i></span>
            <span class="forward-target-name">${escapeHtml(group.title || `Group ${group.id}`)}</span>
        `;
        button.addEventListener("click", () => onSelectUsername(buildGroupToken(group.id), button));
        wrapper.appendChild(button);
    });

    return wrapper;
}

function showMessageDetailsModal(messageElement, messageData = null) {
    const messageId = Number(messageElement.getAttribute("data-message-id") || 0);
    const details = messageData || messageMetaById.get(messageId) || {};

    const senderId = Number(details.sender_id ?? messageElement.getAttribute("data-sender-id") ?? 0);
    const senderUsername =
        details.sender_username || messageElement.getAttribute("data-sender-username") || "";
    const senderLabel =
        senderId === Number(CURRENT_USER_ID)
            ? "You"
            : senderUsername || getCurrentChatDisplayName() || "Peer";
    const messageType = String(details.message_type || messageElement.getAttribute("data-message-type") || "text");
    const sentAt = details.created_at || messageElement.getAttribute("data-created-at") || "";
    const seenAt = details.seen_at || messageElement.getAttribute("data-seen-at") || "";
    const groupSeenAt = details.group_seen_at || messageElement.getAttribute("data-group-seen-at") || "";
    const groupSeenByUsername = details.group_seen_by_username || "";
    const editedAt = details.edited_at || messageElement.getAttribute("data-edited-at") || "";
    const fileSize = details.file_size || messageElement.getAttribute("data-file-size") || "";
    const text = getMessageTextForCopy(messageElement);

    const body = document.createElement("div");
    body.className = "message-details-list";

    const rows = [
        ["Message ID", messageId || "-"],
        ["Type", messageType],
        ["Sender", senderLabel],
        ["Sent", formatMessageTimestamp(sentAt)],
        ["Edited", editedAt ? formatMessageTimestamp(editedAt) : "No"],
        [
            "Seen",
            groupSeenAt
                ? `${formatMessageTimestamp(groupSeenAt)}${groupSeenByUsername ? ` by ${groupSeenByUsername}` : ""}`
                : seenAt
                  ? formatMessageTimestamp(seenAt)
                  : "Not seen yet",
        ],
    ];

    if (text) {
        rows.push(["Characters", String(text.length)]);
    }
    if (fileSize) {
        rows.push(["File Size", formatFileSize(Number(fileSize)) || String(fileSize)]);
    }

    rows.forEach(([label, value]) => {
        const row = document.createElement("div");
        row.className = "message-details-row";
        row.innerHTML = `
            <span class="message-details-label">${escapeHtml(String(label))}</span>
            <span class="message-details-value">${escapeHtml(String(value))}</span>
        `;
        body.appendChild(row);
    });

    openMessageActionModal(I18N_TEXT.messageDetailsTitle, body);
}

function getMediaMessageType(messageElement) {
    if (messageElement.classList.contains("is-voice-message")) return "voice";
    if (messageElement.classList.contains("is-image-message")) return "image";
    if (messageElement.classList.contains("is-video-message")) return "video";
    if (messageElement.classList.contains("is-music-message")) return "file";
    if (messageElement.classList.contains("is-file-message")) return "file";
    if (messageElement.classList.contains("is-sticker-message")) return "sticker";
    return null;
}

async function forwardMediaToDestination(messageMeta, mediaType, destination, sourceMessageId) {
    const groupId = isGroupToken(destination) ? parseGroupIdFromToken(destination) : 0;
    const targetUsername = groupId > 0 ? null : destination;

    if (mediaType === "sticker") {
        const stickerId = Number(messageMeta.sticker_id || 0);
        if (stickerId <= 0) throw new Error("Invalid sticker");
        const payload = new URLSearchParams();
        if (groupId > 0) {
            payload.set("group_id", String(groupId));
        } else {
            payload.set("target", targetUsername);
        }
        payload.set("sticker_id", String(stickerId));
        if (sourceMessageId) payload.set("forwarded_from_message_id", String(sourceMessageId));
        await window.ApiService.jsonOk("api/messages/stickers/send.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", ...getCsrfHeaders() },
            body: payload.toString(),
        });
        return;
    }

    // Decrypt the original media
    const mediaResource = await getDecryptedMediaResource(messageMeta);
    const blob = mediaResource.blob;
    const metadata = mediaResource.metadata || {};
    const fileName = metadata.file_name || "attachment";
    const mimeType = metadata.mime_type || "application/octet-stream";

    // Re-encrypt for the destination
    const context = groupId > 0 ? { groupId } : { targetUsername };
    const mediaPayload = await encryptMediaForMessage(
        blob,
        { file_name: fileName, mime_type: mimeType, file_size: Number(blob.size || 0) },
        context
    );

    const formData = new FormData();
    if (groupId > 0) {
        formData.append("group_id", String(groupId));
    } else {
        formData.append("target", targetUsername);
    }
    formData.append("message", mediaPayload.messageForRecipient);
    formData.append("message_for_sender", mediaPayload.messageForSender);
    if (sourceMessageId) formData.append("forwarded_from_message_id", String(sourceMessageId));

    if (mediaType === "voice") {
        formData.append("voice_file", mediaPayload.encryptedBlob, "voice_message.enc");
        await window.ApiService.jsonOk("api/messages/media/send_voice.php", {
            method: "POST", headers: getCsrfHeaders(), body: formData,
        });
    } else if (mediaType === "image") {
        formData.append("image_file", mediaPayload.encryptedBlob, "image.enc");
        await window.ApiService.jsonOk("api/messages/media/send_image.php", {
            method: "POST", headers: getCsrfHeaders(), body: formData,
        });
    } else if (mediaType === "video") {
        formData.append("message_type", "video");
        formData.append("file", mediaPayload.encryptedBlob, "video.enc");
        await window.ApiService.jsonOk("api/messages/media/send_file.php", {
            method: "POST", headers: getCsrfHeaders(), body: formData,
        });
    } else {
        // file (including music)
        formData.append("message_type", "file");
        formData.append("file", mediaPayload.encryptedBlob, "file.enc");
        await window.ApiService.jsonOk("api/messages/media/send_file.php", {
            method: "POST", headers: getCsrfHeaders(), body: formData,
        });
    }
}

async function forwardMessageText(messageElement) {
    const sourceMessageId = Number(messageElement.getAttribute("data-message-id") || 0);
    const messageMeta = messageMetaById.get(sourceMessageId);
    const mediaType = getMediaMessageType(messageElement);
    const messageText = getMessageTextForCopy(messageElement);

    // Must have either text or be a known media type
    if (!messageText && !mediaType) {
        showModal(I18N_TEXT.forwardFailedTitle, I18N_TEXT.forwardFailedOnlyText, "warning");
        return;
    }

    const content = createForwardTargetListContent(async (destination, button) => {
        if (!destination) {
            showModal(I18N_TEXT.forwardFailedTitle, I18N_TEXT.forwardFailedInvalidTarget, "warning");
            return;
        }

        try {
            if (button) {
                button.disabled = true;
                button.classList.add("is-forwarding");
            }

            if (mediaType && messageMeta) {
                // Forward actual media
                await forwardMediaToDestination(messageMeta, mediaType, destination, sourceMessageId || null);
            } else {
                // Forward text
                if (isGroupToken(destination)) {
                    const groupId = parseGroupIdFromToken(destination);
                    await sendGroupTextMessage(groupId, messageText, null, sourceMessageId || null);
                } else {
                    await sendEncryptedTextMessage(destination, messageText, null, sourceMessageId || null);
                }
            }
            if (!isGroupToken(destination)) addUserToChatList(destination);
            closeMessageActionModal();
            const destLabel = isGroupToken(destination)
                ? chatGroupsById.get(parseGroupIdFromToken(destination))?.title || "group"
                : destination;
            setComposerStatus(`Forwarded to ${destLabel}`, "success");
        } catch (error) {
            showModal(I18N_TEXT.forwardFailedTitle, error.message || "Unable to forward message.", "error");
        } finally {
            if (button) {
                button.disabled = false;
                button.classList.remove("is-forwarding");
            }
        }
    });

    openMessageActionModal(I18N_TEXT.forwardTitle, content);
}

async function saveMessageToSavedMessages(messageElement) {
    const msgId = Number(messageElement.getAttribute("data-message-id") || 0);
    if (!msgId) return;

    const messageMeta = messageMetaById.get(msgId);
    const mediaType = getMediaMessageType(messageElement);
    const messageText = getMessageTextForCopy(messageElement);

    try {
        if (mediaType && messageMeta) {
            // Save actual media to self
            await forwardMediaToDestination(messageMeta, mediaType, CURRENT_USER, msgId);
        } else if (messageText) {
            await sendEncryptedTextMessage(CURRENT_USER, messageText, null, msgId || null);
        } else {
            throw new Error("Unable to identify message content");
        }
        addUserToChatList(CURRENT_USER, { userId: CURRENT_USER_ID });
        setComposerStatus("Saved to Saved Messages", "success");
    } catch (error) {
        showModal("Save Failed", error.message || "Unable to save message.", "error");
    }
}

function formatSelectedCountLabel(count) {
    const safeCount = Math.max(0, Number(count) || 0);
    return safeCount === 1 ? "1 selected" : `${safeCount} selected`;
}

function updateSelectModeUi() {
    const selectedCount = selectedMessageIds.size;
    const hasOnlyTextSelection = selectedCount > 0 && areSelectedMessagesTextOnly();
    if (selectModeBar) {
        selectModeBar.hidden = !isSelectModeActive;
    }
    if (selectModeCount) {
        selectModeCount.textContent = formatSelectedCountLabel(selectedCount);
    }
    if (selectModeForwardBtn) {
        selectModeForwardBtn.disabled = selectedCount === 0;
    }
    if (selectModeCopyBtn) {
        selectModeCopyBtn.hidden = !hasOnlyTextSelection;
        selectModeCopyBtn.disabled = !hasOnlyTextSelection;
    }
    if (selectModeDeleteBtn) {
        selectModeDeleteBtn.disabled = selectedCount === 0;
    }
    chatMessagesElem?.classList.toggle("is-select-mode", isSelectModeActive);
}

function setMessageSelectedState(messageElement, selected) {
    if (!messageElement) {
        return;
    }
    messageElement.classList.toggle("is-selected", Boolean(selected));
    messageElement.setAttribute("aria-selected", selected ? "true" : "false");
}

function getVisibleMessageElements() {
    return Array.from(chatMessagesElem?.querySelectorAll(".message") || []);
}

function getSelectedMessageElements() {
    const selectedElements = [];
    selectedMessageIds.forEach((messageId) => {
        const element = getMessageElementById(messageId);
        if (element) {
            selectedElements.push(element);
        }
    });
    return selectedElements;
}

function isTextMessageElement(messageElement) {
    return String(messageElement?.getAttribute("data-message-type") || "") === "text";
}

function areSelectedMessagesTextOnly() {
    const selectedElements = getSelectedMessageElements();
    if (!selectedElements.length) {
        return false;
    }
    return selectedElements.every((messageElement) => isTextMessageElement(messageElement));
}

function toSortableMessageTimestamp(messageElement) {
    const createdAtRaw = String(messageElement?.getAttribute("data-created-at") || "").trim();
    const parsed = createdAtRaw ? new Date(createdAtRaw) : null;
    if (parsed && !Number.isNaN(parsed.getTime())) {
        return parsed.getTime();
    }
    return 0;
}

function getSelectedMessageElementsSortedBySentTime() {
    return getSelectedMessageElements().sort((leftElement, rightElement) => {
        const leftTs = toSortableMessageTimestamp(leftElement);
        const rightTs = toSortableMessageTimestamp(rightElement);
        if (leftTs !== rightTs) {
            return leftTs - rightTs;
        }
        const leftId = Number(leftElement.getAttribute("data-message-id") || 0);
        const rightId = Number(rightElement.getAttribute("data-message-id") || 0);
        return leftId - rightId;
    });
}

function exitSelectMode({ clearSelection = true } = {}) {
    isSelectModeActive = false;
    if (clearSelection) {
        getVisibleMessageElements().forEach((messageElement) => {
            setMessageSelectedState(messageElement, false);
        });
        selectedMessageIds.clear();
    }
    updateSelectModeUi();
}

function enterSelectMode(seedMessageElement = null) {
    if (activeEditMessageId) {
        cancelEditMode();
    }
    isSelectModeActive = true;
    if (seedMessageElement) {
        toggleMessageSelection(seedMessageElement);
    } else {
        updateSelectModeUi();
    }
}

function toggleMessageSelection(messageElement) {
    const messageId = Number(messageElement?.getAttribute("data-message-id") || 0);
    if (!messageId) {
        return;
    }

    if (!isSelectModeActive) {
        isSelectModeActive = true;
    }

    if (selectedMessageIds.has(messageId)) {
        selectedMessageIds.delete(messageId);
        setMessageSelectedState(messageElement, false);
    } else {
        selectedMessageIds.add(messageId);
        setMessageSelectedState(messageElement, true);
    }

    if (!selectedMessageIds.size) {
        exitSelectMode({ clearSelection: true });
        return;
    }

    updateSelectModeUi();
}

async function bulkForwardSelectedMessages() {
    const selectedElements = getSelectedMessageElementsSortedBySentTime();
    if (!selectedElements.length) {
        setComposerStatus("Select at least one message to forward.", "warning");
        return;
    }

    const selectedTextMessages = selectedElements
        .map((messageElement) => ({
            messageElement,
            messageId: Number(messageElement.getAttribute("data-message-id") || 0),
            messageText: getMessageTextForCopy(messageElement),
        }))
        .filter((item) => item.messageId > 0 && item.messageText);

    if (!selectedTextMessages.length) {
        showModal("Forward Failed", "Only selected text messages can be forwarded.", "warning");
        return;
    }

    const skippedCount = Math.max(0, selectedElements.length - selectedTextMessages.length);
    const content = createForwardTargetListContent(async (destination, button) => {
        if (!destination) {
            showModal(I18N_TEXT.forwardFailedTitle, I18N_TEXT.forwardFailedInvalidTarget, "warning");
            return;
        }

        let successCount = 0;
        let failedCount = 0;

        try {
            button.disabled = true;
            button.classList.add("is-forwarding");

            for (const item of selectedTextMessages) {
                try {
                    if (isGroupToken(destination)) {
                        await sendGroupTextMessage(
                            parseGroupIdFromToken(destination),
                            item.messageText,
                            null,
                            item.messageId
                        );
                    } else {
                        await sendEncryptedTextMessage(destination, item.messageText, null, item.messageId);
                        addUserToChatList(destination);
                    }
                    successCount++;
                } catch (error) {
                    failedCount++;
                }
            }

            closeMessageActionModal();
            exitSelectMode({ clearSelection: true });
            const destinationLabel = isGroupToken(destination)
                ? chatGroupsById.get(parseGroupIdFromToken(destination))?.title || "group"
                : destination;
            const summaryParts = [`Forwarded ${successCount}`];
            if (failedCount) {
                summaryParts.push(`${failedCount} failed`);
            }
            if (skippedCount) {
                summaryParts.push(`${skippedCount} skipped (non-text)`);
            }
            showModal(
                "Bulk Forward",
                `${summaryParts.join(", ")} to ${destinationLabel}.`,
                failedCount ? "warning" : "success"
            );
        } finally {
            button.disabled = false;
            button.classList.remove("is-forwarding");
        }
    });

    openMessageActionModal("Forward Selected Messages", content);
}

async function bulkDeleteSelectedMessages() {
    const selectedElements = getSelectedMessageElements();
    if (!selectedElements.length) {
        setComposerStatus("Select at least one message to delete.", "warning");
        return;
    }

    const selectedIds = selectedElements
        .map((messageElement) => Number(messageElement.getAttribute("data-message-id") || 0))
        .filter((messageId) => messageId > 0);
    if (!selectedIds.length) {
        return;
    }

    const confirmed = window.confirm(
        `Delete ${selectedIds.length} selected message${selectedIds.length === 1 ? "" : "s"}?`
    );
    if (!confirmed) {
        return;
    }

    try {
        const deleteResult = await window.ApiService.jsonOk("api/messages/delete.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...getCsrfHeaders(),
            },
            body: JSON.stringify({ messages: selectedIds }),
        });

        const deletedIds = Array.isArray(deleteResult?.message_ids)
            ? deleteResult.message_ids.map((id) => Number(id)).filter((id) => id > 0)
            : [];
        const deletedSet = new Set(deletedIds);
        const deletedCount = deletedIds.length;
        const failedCount = Math.max(0, selectedIds.length - deletedCount);

        selectedElements.forEach((messageElement) => {
            const messageId = Number(messageElement.getAttribute("data-message-id") || 0);
            if (deletedSet.has(messageId)) {
                messageElement.remove();
            }
        });
        deletedIds.forEach((messageId) => {
            pendingSeenMessageIds.delete(messageId);
            messageMetaById.delete(messageId);
        });
        void removeMultipleMediaFromCache(deletedIds);
        if (Array.isArray(currentChatRecentMessages)) {
            currentChatRecentMessages = currentChatRecentMessages.filter(
                (item) => !deletedSet.has(Number(item.id || 0))
            );
        }

        exitSelectMode({ clearSelection: true });
        showModal(
            "Bulk Delete",
            failedCount
                ? `Deleted ${deletedCount} message(s), ${failedCount} could not be deleted.`
                : `Deleted ${deletedCount} message(s).`,
            failedCount ? "warning" : "success"
        );
        rebuildMessageDaySeparators();
    } catch (error) {
        showModal("Bulk Delete Failed", error?.message || "Unable to delete selected messages.", "error");
    }
}

async function bulkCopySelectedMessages() {
    const selectedElements = getSelectedMessageElementsSortedBySentTime();
    if (!selectedElements.length) {
        setComposerStatus("Select at least one message to copy.", "warning");
        return;
    }

    if (!selectedElements.every((messageElement) => isTextMessageElement(messageElement))) {
        setComposerStatus("Copy is available only for text-only selection.", "warning");
        return;
    }

    const copiedTextLines = selectedElements
        .map((messageElement) => {
            const messageText = String(getMessageTextForCopy(messageElement) || "")
                .replace(/\s*\n+\s*/g, " ")
                .trim();
            if (!messageText) {
                return "";
            }
            const senderUsername = String(messageElement.getAttribute("data-sender-username") || "").trim();
            const senderLabel = senderUsername || (messageElement.classList.contains("sent")
                ? String(CURRENT_USER || "You")
                : String(getCurrentChatDisplayName() || "User"));
            return `${senderLabel}: ${messageText}`;
        })
        .filter((line) => line.length > 0);

    if (!copiedTextLines.length) {
        showModal("Copy Failed", "Only selected text messages can be copied.", "warning");
        return;
    }

    const payload = copiedTextLines.join("\n\n");
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(payload);
        } else {
            const helper = document.createElement("textarea");
            helper.value = payload;
            helper.setAttribute("readonly", "true");
            helper.style.position = "absolute";
            helper.style.left = "-9999px";
            document.body.appendChild(helper);
            helper.select();
            document.execCommand("copy");
            helper.remove();
        }
        showTransientSuccessToast(`Copied ${copiedTextLines.length} selected message(s).`);
    } catch (error) {
        showModal("Copy Failed", "Unable to copy selected messages.", "error");
    }
}

function canEditMessage(messageElement, messageData = null) {
    const senderId = Number(
        messageData?.sender_id ?? messageElement?.getAttribute("data-sender-id") ?? 0
    );
    if (senderId !== Number(CURRENT_USER_ID)) {
        return false;
    }
    const messageType = String(
        messageData?.message_type ?? messageElement?.getAttribute("data-message-type") ?? ""
    );
    if (messageType !== "text") {
        return false;
    }
    const forwardedFromMessageId = Number(
        messageData?.forwarded_from_message_id ??
        messageElement?.getAttribute("data-forwarded-from-message-id") ??
        0
    );
    if (forwardedFromMessageId > 0) {
        return false;
    }
    const createdAtRaw =
        messageData?.created_at || messageElement?.getAttribute("data-created-at") || "";
    const createdAt = new Date(createdAtRaw);
    if (Number.isNaN(createdAt.getTime())) {
        return false;
    }
    return Date.now() - createdAt.getTime() <= MESSAGE_EDIT_WINDOW_MS;
}

function cancelEditMode({ restoreFocus = false } = {}) {
    if (!activeEditMessageId) {
        return;
    }
    activeEditMessageId = 0;
    clearReplyState();
    chatInput.value = "";
    chatInput.style.height = "";
    setComposerStatus("", "neutral");
    if (restoreFocus) {
        chatInput.focus();
    }
}

function beginEditMode(messageElement) {
    const messageId = Number(messageElement?.getAttribute("data-message-id") || 0);
    if (!messageId || !canEditMessage(messageElement)) {
        showModal("Edit Not Allowed", "This message can no longer be edited.", "warning");
        return;
    }

    const currentText = getMessageTextForCopy(messageElement);
    if (!currentText) {
        showModal("Edit Not Allowed", "Only text messages can be edited.", "warning");
        return;
    }

    activeEditMessageId = messageId;
    currentReplyTarget = {
        messageId,
        senderLabel: "You",
        snippet: currentText,
    };
    if (replyPreviewElem) {
        replyPreviewElem.innerHTML = `
            <div class="reply-preview-content">
                <div class="reply-preview-title">Editing message</div>
                <div class="reply-preview-text">${escapeHtml(currentText.slice(0, 160))}</div>
            </div>
            <button type="button" class="reply-preview-close" aria-label="Cancel edit">
                <i class="fas fa-times"></i>
            </button>
        `;
        replyPreviewElem.style.display = "flex";
        replyPreviewElem
            .querySelector(".reply-preview-close")
            ?.addEventListener("click", () => cancelEditMode({ restoreFocus: true }));
    }

    chatInput.value = currentText;
    chatInput.focus();
    chatInput.selectionStart = chatInput.value.length;
    chatInput.selectionEnd = chatInput.value.length;
    setComposerStatus("Edit mode: press Enter to save, Esc to cancel.", "warning");
}

async function encryptEditedPayloadForCurrentChat(text) {
    if (isGroupToken(currentChatUser)) {
        const groupId = getCurrentGroupId();
        const groupKey = await getGroupCryptoKey(groupId);
        const encryptedGroupMessage = await encryptGroupMessage(text, groupKey);
        return {
            message: encryptedGroupMessage,
            message_for_sender: encryptedGroupMessage,
        };
    }

    const recipientKey = await getPublicKey(currentChatUser);
    const senderKey = await getPublicKey(CURRENT_USER);
    return {
        message: await encryptLongMessage(text, recipientKey, isTextPersian(text)),
        message_for_sender: await encryptLongMessage(text, senderKey, isTextPersian(text)),
    };
}

async function saveEditedMessage() {
    const messageId = Number(activeEditMessageId || 0);
    if (!messageId) {
        return false;
    }
    const editedText = String(chatInput.value || "").trim();
    if (!editedText) {
        setComposerStatus("Message text cannot be empty.", "error");
        return false;
    }

    try {
        const encrypted = await encryptEditedPayloadForCurrentChat(editedText);
        await window.ApiService.jsonOk("api/messages/edit.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getCsrfHeaders(),
            },
            body: JSON.stringify({
                message_id: messageId,
                message: encrypted.message,
                message_for_sender: encrypted.message_for_sender,
            }),
        });
        const msgEl = getMessageElementById(messageId);
        if (msgEl) {
            const textSpan = msgEl.querySelector(".message-text-content");
            if (textSpan) {
                textSpan.textContent = editedText;
            }
            if (!msgEl.querySelector(".message-edited-marker")) {
                const marker = document.createElement("span");
                marker.className = "message-edited-marker";
                marker.title = "Edited";
                marker.textContent = "edited";
                textSpan?.after(marker);
            }
        }
        cancelEditMode();
        setComposerStatus("Message edited", "success");
        return true;
    } catch (error) {
        showModal("Edit Failed", error?.message || "Unable to edit message.", "error");
        setComposerStatus("Unable to save edits", "error");
        return false;
    }
}

function getMessageElementById(messageId) {
    return chatMessagesElem.querySelector(`.message[data-message-id="${messageId}"]`);
}

function getReactionHostElement(messageElement) {
    if (!messageElement) {
        return null;
    }
    if (messageElement.classList.contains("group-incoming-message")) {
        return messageElement.querySelector(".group-message-content") || messageElement;
    }
    return messageElement;
}

function triggerReactionSubmitBurst(messageElement, emoji, { kind = "add" } = {}) {
    const hostElement = getReactionHostElement(messageElement);
    const normalizedEmoji = String(emoji || "").trim();
    if (!hostElement || !normalizedEmoji) {
        return;
    }

    hostElement.querySelector(".reaction-submit-burst")?.remove();

    const burst = document.createElement("div");
    burst.className = "reaction-submit-burst";
    if (kind === "remove") {
        burst.classList.add("is-remove");
    }
    burst.setAttribute("aria-hidden", "true");
    burst.innerHTML = `
        <span class="reaction-submit-burst-core">${escapeHtml(normalizedEmoji)}</span>
        <span class="reaction-submit-burst-ring"></span>
        <span class="reaction-submit-particle p1">✨</span>
        <span class="reaction-submit-particle p2">⭐</span>
        <span class="reaction-submit-particle p3">💫</span>
        <span class="reaction-submit-particle p4">✨</span>
        <span class="reaction-submit-particle p5">⭐</span>
        <span class="reaction-submit-particle p6">💫</span>
    `;

    hostElement.appendChild(burst);
    window.setTimeout(() => burst.remove(), kind === "remove" ? 980 : 860);
}

function applyMessageReactionsUpdate(
    messageId,
    reactions = [],
    { flashEmoji = "", removedEmoji = "" } = {}
) {
    const normalizedMessageId = Number(messageId || 0);
    if (!normalizedMessageId) {
        return;
    }

    const meta = messageMetaById.get(normalizedMessageId);
    if (meta) {
        meta.reactions = Array.isArray(reactions) ? reactions : [];
        messageMetaById.set(normalizedMessageId, meta);
    }

    if (Array.isArray(currentChatRecentMessages)) {
        currentChatRecentMessages = currentChatRecentMessages.map((item) =>
            Number(item?.id || 0) === normalizedMessageId
                ? { ...item, reactions: Array.isArray(reactions) ? reactions : [] }
                : item
        );
    }

    const messageElement = getMessageElementById(normalizedMessageId);
    if (!messageElement) {
        return;
    }
    const normalizedFlashEmoji = String(flashEmoji || "").trim();
    renderMessageReactions(messageElement, meta || { id: normalizedMessageId, reactions }, {
        flashEmoji: normalizedFlashEmoji,
    });

    const normalizedRemovedEmoji = String(removedEmoji || "").trim();
    if (normalizedFlashEmoji) {
        triggerReactionSubmitBurst(messageElement, normalizedFlashEmoji, { kind: "add" });
    } else if (normalizedRemovedEmoji) {
        triggerReactionSubmitBurst(messageElement, normalizedRemovedEmoji, { kind: "remove" });
    }
}

function getCurrentUserReactionEmoji(messageId) {
    const normalizedMessageId = Number(messageId || 0);
    if (!normalizedMessageId) {
        return "";
    }
    const meta = messageMetaById.get(normalizedMessageId);
    if (!Array.isArray(meta?.reactions)) {
        return "";
    }
    const mine = meta.reactions.find((item) => item?.reacted_by_me && item?.emoji);
    return String(mine?.emoji || "").trim();
}

async function toggleMessageReaction(messageId, reaction) {
    const payload = {
        message_id: Number(messageId || 0),
        reaction: String(reaction || "").trim(),
    };
    const previousReaction = getCurrentUserReactionEmoji(payload.message_id);
    const data = await window.ApiService.jsonOk("api/messages/toggle_reaction.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getCsrfHeaders(),
        },
        body: JSON.stringify(payload),
    });
    const reactions = Array.isArray(data?.reactions) ? data.reactions : [];
    applyMessageReactionsUpdate(payload.message_id, reactions, {
        flashEmoji: payload.reaction,
        removedEmoji: payload.reaction ? "" : previousReaction,
    });
    return reactions;
}

function buildReactionPickerContent(messageElement, messageData = null) {
    const wrapper = document.createElement("div");
    wrapper.className = "reaction-picker-list";

    const messageId = Number(messageElement.getAttribute("data-message-id") || 0);
    const reactions = Array.isArray(messageData?.reactions) ? messageData.reactions : [];

    REACTION_EMOJI_SET.forEach((emoji) => {
        const reactionMeta = reactions.find((item) => item?.emoji === emoji) || null;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reaction-picker-item";
        button.setAttribute("role", "menuitem");
        button.setAttribute("aria-label", `React with ${emoji}`);
        button.innerHTML = `<span class="reaction-picker-emoji">${emoji}</span>`;
        if (reactionMeta?.reacted_by_me) {
            button.classList.add("is-active");
        }

        button.addEventListener("click", async () => {
            try {
                button.disabled = true;
                const nextReaction = reactionMeta?.reacted_by_me ? "" : emoji;
                await toggleMessageReaction(messageId, nextReaction);
                closeReactionPicker({ restoreFocus: false });
            } catch (error) {
                showModal(I18N_TEXT.reactFailedTitle, error.message || I18N_TEXT.reactFailedBody, "error");
            } finally {
                button.disabled = false;
            }
        });
        wrapper.appendChild(button);
    });

    return wrapper;
}

function openReactionPickerFromContext(messageElement, messageData = null) {
    const messageId = Number(messageElement.getAttribute("data-message-id") || 0);
    const latestMeta = messageMetaById.get(messageId) || messageData;
    closeReactionPicker({ restoreFocus: false });

    const picker = document.createElement("div");
    picker.id = "messageReactionPicker";
    picker.className = "message-reaction-picker";
    picker.setAttribute("role", "menu");
    picker.setAttribute("aria-label", I18N_TEXT.reactTitle);

    const content = buildReactionPickerContent(messageElement, latestMeta);
    picker.appendChild(content);
    document.body.appendChild(picker);

    const messageRect = messageElement.getBoundingClientRect();
    const pickerRect = picker.getBoundingClientRect();
    const gap = 8;
    const showAbove = messageRect.top - pickerRect.height - gap >= 8;
    const maxLeft = Math.max(8, window.innerWidth - pickerRect.width - 8);
    const maxTop = Math.max(8, window.innerHeight - pickerRect.height - 8);

    const top = Math.min(
        maxTop,
        Math.max(8, showAbove ? messageRect.top - pickerRect.height - gap : messageRect.bottom + gap)
    );
    const left = Math.min(
        maxLeft,
        Math.max(8, messageRect.left + messageRect.width / 2 - pickerRect.width / 2)
    );

    picker.style.top = `${top}px`;
    picker.style.left = `${left}px`;

    lastReactionPickerMessageElement = messageElement;
    picker.querySelector(".reaction-picker-item")?.focus();
}

async function deleteMessageById(messageId) {
    await window.ApiService.jsonOk("api/messages/delete.php", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...getCsrfHeaders(),
        },
        body: JSON.stringify({ messages: [messageId] }),
    });
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
        selectedMessageIds.delete(messageId);
        if (isSelectModeActive) {
            if (!selectedMessageIds.size) {
                exitSelectMode({ clearSelection: true });
            } else {
                updateSelectModeUi();
            }
        }
        pendingSeenMessageIds.delete(messageId);
        messageMetaById.delete(messageId);
        void removeMediaFromCache(messageId);
        // Clean up playlist if this message was a playlist track
        const playlist = getPlaylist();
        if (playlist.some((t) => Number(t.msgId) === messageId)) {
            removeFromPlaylist(messageId);
        }
    } catch (error) {
        showModal("Delete Failed", error.message || "Unable to delete message.", "error");
    }
}

function addMessageActionHandlers(
    messageElement,
    {
        canReply = true,
        canSelect = true,
        canEdit = false,
        canDelete = true,
        canReact = false,
        canCopy = false,
        canCopyImage = false,
        canForward = false,
        canSave = false,
        canDetails = true,
        messageData = null,
    } = {}
) {
    let longPressTimer = null;
    let longPressTriggered = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTapAt = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    let singleTapTimer = null;
    let suppressClickUntil = 0;
    let desktopClickTimer = null;

    // Swipe gesture state
    const SWIPE_THRESHOLD_PX = 60;
    const SWIPE_VERTICAL_LOCK_PX = 30;
    const SWIPE_MAX_TRANSLATE_PX = 100;
    let swipeActive = false;
    let swipeLocked = false; // true once we committed to scroll (vertical) or swipe (horizontal)
    let swipeDirection = 0; // 0=undecided, 1=right, -1=left

    // Voice bar drag state (drag on waveform bars)
    const isVoiceMessage = messageElement.classList.contains("is-voice-message");
    const isMultimediaMessage = isVoiceMessage ||
        messageElement.classList.contains("is-image-message") ||
        messageElement.classList.contains("is-video-message") ||
        messageElement.classList.contains("is-sticker-message") ||
        messageElement.classList.contains("is-file-message");
    let touchStartedOnBars = false;
    let voiceBarDragActive = false;

    messageElement.tabIndex = 0;
    messageElement.setAttribute("aria-selected", "false");
    messageElement.setAttribute("aria-label", "Chat message actions available");

    const doHeartReaction = () => {
        if (!canReact) return;
        const msgId = Number(messageElement.getAttribute("data-message-id") || 0);
        if (!msgId) return;
        const currentEmoji = getCurrentUserReactionEmoji(msgId);
        const newEmoji = currentEmoji === "\u2764\uFE0F" ? "" : "\u2764\uFE0F";
        toggleMessageReaction(msgId, newEmoji).catch(() => {});
    };

    const openContextMenu = (clientX, clientY, { focusFirstItem = true } = {}) => {
        // If a context menu was just closed (by clicking outside), don't immediately open a new one
        if (Date.now() - contextMenuJustClosedAt < 450) return;
        closeMessageContextMenu();
        closeReactionPicker({ restoreFocus: false });
        lastContextMenuMessageElement = messageElement;

        if (window.getSelection) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                selection.removeAllRanges();
            }
        }

        const menu = document.createElement("div");
        menu.id = "messageContextMenu";
        menu.className = "message-context-menu";
        menu.setAttribute("role", "menu");
        menu.setAttribute("aria-label", "Message actions");

        const appendMenuAction = (element) => {
            element.setAttribute("role", "menuitem");
            element.tabIndex = 0;
            menu.appendChild(element);
        };

        if (canCopy) {
            const copyBtn = document.createElement("button");
            copyBtn.type = "button";
            copyBtn.className = "message-context-menu-item";
            copyBtn.innerHTML = '<i class="fas fa-copy me-2"></i>Copy';
            copyBtn.addEventListener("click", async () => {
                await copyMessageText(messageElement);
                closeMessageContextMenu();
            });
            appendMenuAction(copyBtn);
        }

        if (canCopyImage) {
            const copyImageBtn = document.createElement("button");
            copyImageBtn.type = "button";
            copyImageBtn.className = "message-context-menu-item";
            copyImageBtn.innerHTML = '<i class="fas fa-image me-2"></i>Copy image';
            copyImageBtn.addEventListener("click", async () => {
                await copyImageMessageToClipboard(messageElement, messageData);
                closeMessageContextMenu();
            });
            appendMenuAction(copyImageBtn);
        }

        if (canReply) {
            const replyBtn = document.createElement("button");
            replyBtn.type = "button";
            replyBtn.className = "message-context-menu-item";
            replyBtn.innerHTML = '<i class="fas fa-reply me-2"></i>Reply';
            replyBtn.addEventListener("click", () => {
                setReplyState(messageElement);
                closeMessageContextMenu();
                chatInput.focus();
            });
            appendMenuAction(replyBtn);
        }

        if (canSelect) {
            const selectBtn = document.createElement("button");
            selectBtn.type = "button";
            selectBtn.className = "message-context-menu-item";
            selectBtn.innerHTML = '<i class="fas fa-check-square me-2"></i>Select messages';
            selectBtn.addEventListener("click", () => {
                enterSelectMode(messageElement);
                closeMessageContextMenu();
            });
            appendMenuAction(selectBtn);
        }

        if (canEdit) {
            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.className = "message-context-menu-item";
            editBtn.innerHTML = '<i class="fas fa-pen me-2"></i>Edit';
            editBtn.addEventListener("click", () => {
                beginEditMode(messageElement);
                closeMessageContextMenu();
            });
            appendMenuAction(editBtn);
        }

        if (canForward) {
            const forwardBtn = document.createElement("button");
            forwardBtn.type = "button";
            forwardBtn.className = "message-context-menu-item";
            forwardBtn.innerHTML = '<i class="fas fa-share-from-square me-2"></i>Forward';
            forwardBtn.addEventListener("click", async () => {
                await forwardMessageText(messageElement);
                closeMessageContextMenu();
            });
            appendMenuAction(forwardBtn);
        }

        if (canSave && !isSavedMessagesChat(currentChatUser)) {
            const saveBtn = document.createElement("button");
            saveBtn.type = "button";
            saveBtn.className = "message-context-menu-item";
            saveBtn.innerHTML = '<i class="fas fa-bookmark me-2"></i>Save';
            saveBtn.addEventListener("click", async () => {
                closeMessageContextMenu();
                await saveMessageToSavedMessages(messageElement);
            });
            appendMenuAction(saveBtn);
        }

        if (messageElement.classList.contains("is-music-message")) {
            const addPlaylistBtn = document.createElement("button");
            addPlaylistBtn.type = "button";
            addPlaylistBtn.className = "message-context-menu-item";
            addPlaylistBtn.innerHTML = '<i class="fas fa-list-ul me-2"></i>Add to Playlist';
            addPlaylistBtn.addEventListener("click", () => {
                closeMessageContextMenu();
                const msgId = Number(messageElement.getAttribute("data-message-id") || 0);
                if (!msgId) return;
                const titleEl = messageElement.querySelector(".music-title");
                const title = titleEl?.textContent || "Unknown";
                const formatEl = messageElement.querySelector(".music-format");
                const ext = formatEl?.textContent || "";
                addToPlaylist(msgId, currentChatUser, title, ext);
            });
            appendMenuAction(addPlaylistBtn);
        }

        if (canReact) {
            const reactBtn = document.createElement("button");
            reactBtn.type = "button";
            reactBtn.className = "message-context-menu-item";
            reactBtn.innerHTML = '<i class="fas fa-face-smile me-2"></i>React';
            reactBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                closeMessageContextMenu();
                openReactionPickerFromContext(messageElement, messageData);
            });
            appendMenuAction(reactBtn);
        }

        if (canDelete) {
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "message-context-menu-item";
            deleteBtn.innerHTML = '<i class="fas fa-trash me-2"></i>Delete';
            deleteBtn.addEventListener("click", async () => {
                await deleteMessageFromContext(messageElement);
                closeMessageContextMenu();
            });
            appendMenuAction(deleteBtn);
        }

        if (canDetails) {
            const detailsBtn = document.createElement("button");
            detailsBtn.type = "button";
            detailsBtn.className = "message-context-menu-item";
            detailsBtn.innerHTML = '<i class="fas fa-circle-info me-2"></i>Details';
            detailsBtn.addEventListener("click", () => {
                closeMessageContextMenu();
                showMessageDetailsModal(messageElement, messageData);
            });
            appendMenuAction(detailsBtn);
        }

        if (!menu.children.length) {
            const noActionsItem = document.createElement("div");
            noActionsItem.className = "message-context-menu-item";
            noActionsItem.textContent = "No actions available";
            noActionsItem.style.opacity = "0.7";
            noActionsItem.style.cursor = "default";
            menu.appendChild(noActionsItem);
        }

        document.body.appendChild(menu);

        const menuRect = menu.getBoundingClientRect();
        const maxLeft = Math.max(8, window.innerWidth - menuRect.width - 8);
        const maxTop = Math.max(8, window.innerHeight - menuRect.height - 8);
        menu.style.left = `${Math.min(clientX, maxLeft)}px`;
        menu.style.top = `${Math.min(clientY, maxTop)}px`;

        if (focusFirstItem) {
            const firstMenuButton = menu.querySelector(".message-context-menu-item");
            firstMenuButton?.focus();
        }
    };

    messageElement.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        openContextMenu(event.clientX, event.clientY);
    });

    messageElement.addEventListener("keydown", (event) => {
        if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
            event.preventDefault();
            const rect = messageElement.getBoundingClientRect();
            openContextMenu(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    });

    messageElement.addEventListener(
        "touchstart",
        (event) => {
            if (event.touches?.length !== 1) {
                return;
            }
            clearLongPress();
            longPressTriggered = false;
            voiceBarDragActive = false;
            touchStartedOnBars = false;
            swipeActive = false;
            swipeLocked = false;
            swipeDirection = 0;
            const touch = event.touches[0];
            touchStartX = Number(touch.clientX || 0);
            touchStartY = Number(touch.clientY || 0);

            // Check if touch started on voice waveform bars
            if (isVoiceMessage && event.target.closest(".waveform-bars")) {
                touchStartedOnBars = true;
                // No long-press on bars — only tap (seek) or drag (continuous seek)
                return;
            }

            longPressTimer = setTimeout(() => {
                const touchPoint = event.touches?.[0] || event.changedTouches?.[0];
                if (!touchPoint) {
                    return;
                }
                longPressTriggered = true;

                if (isMultimediaMessage) {
                    // Multimedia messages: long-press opens context menu
                    suppressNextContextMenuTapUntil = Date.now() + 420;
                    openContextMenu(touchPoint.clientX, touchPoint.clientY, { focusFirstItem: false });
                } else {
                    // Text messages: long-press enters select mode
                    if (canSelect) {
                        enterSelectMode(messageElement);
                    }
                }
            }, MESSAGE_LONG_PRESS_MS);
        },
        { passive: true }
    );

    messageElement.addEventListener(
        "touchmove",
        (event) => {
            const touch = event.touches?.[0];
            if (!touch) {
                return;
            }
            const rawDeltaX = Number(touch.clientX || 0) - touchStartX;
            const deltaX = Math.abs(rawDeltaX);
            const deltaY = Math.abs(Number(touch.clientY || 0) - touchStartY);

            // Voice bar drag: if touch started on bars and moved horizontally, enter seek mode
            if (touchStartedOnBars && !voiceBarDragActive && !swipeActive) {
                if (deltaX > LONG_PRESS_MOVE_CANCEL_PX) {
                    voiceBarDragActive = true;
                    messageElement.classList.add("voice-seeking");
                }
            }

            if (voiceBarDragActive) {
                applyVoiceSeek(messageElement, Number(touch.clientX || 0));
                return;
            }

            // Cancel long press on any significant movement
            if (deltaX > LONG_PRESS_MOVE_CANCEL_PX || deltaY > LONG_PRESS_MOVE_CANCEL_PX) {
                clearLongPress();
            }

            // If long press already triggered, don't start a swipe
            if (longPressTriggered) return;

            // Don't start swipe if touch started on bars (handled above)
            if (touchStartedOnBars) return;

            // Decision point: lock into scroll vs swipe
            if (!swipeLocked && (deltaX > 12 || deltaY > 12)) {
                if (deltaY > deltaX) {
                    // User is scrolling vertically — do NOT interfere
                    swipeLocked = true;
                    swipeActive = false;
                    return;
                }
                // Horizontal movement dominates → lock into swipe
                swipeLocked = true;
                swipeActive = true;
                swipeDirection = rawDeltaX > 0 ? 1 : -1;
            }

            if (!swipeActive) return;

            // Clamp the visual displacement
            const clampedDelta = Math.sign(rawDeltaX) * Math.min(deltaX, SWIPE_MAX_TRANSLATE_PX);

            // Only allow swipe in the committed direction
            if ((swipeDirection === 1 && rawDeltaX <= 0) || (swipeDirection === -1 && rawDeltaX >= 0)) {
                messageElement.style.transform = "";
                return;
            }

            messageElement.style.transform = `translateX(${clampedDelta}px)`;
            messageElement.style.transition = "none";

            // Show/hide swipe hint icon
            const progress = deltaX / SWIPE_THRESHOLD_PX;
            messageElement.classList.toggle("swipe-ready", progress >= 1);
        },
        { passive: true }
    );

    const clearLongPress = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };

    const resetSwipeStyles = () => {
        messageElement.style.transition = "transform 0.2s ease-out";
        messageElement.style.transform = "";
        messageElement.classList.remove("swipe-ready");
        const cleanup = () => {
            messageElement.style.transition = "";
            messageElement.style.transform = "";
            messageElement.removeEventListener("transitionend", cleanup);
        };
        messageElement.addEventListener("transitionend", cleanup, { once: true });
        // Fallback cleanup if transitionend doesn't fire
        setTimeout(cleanup, 250);
    };

    messageElement.addEventListener("touchend", (event) => {
        // Animate the message back to its original position
        const wasSwipeActive = swipeActive;
        if (swipeActive) {
            resetSwipeStyles();
        }

        // Voice bar drag end
        if (voiceBarDragActive) {
            voiceBarDragActive = false;
            messageElement.classList.remove("voice-seeking");
            clearLongPress();
            suppressClickUntil = Date.now() + 400;
            return;
        }

        // Voice bar tap (no drag) → seek to tapped position (+ auto-play if not yet loaded)
        if (touchStartedOnBars) {
            touchStartedOnBars = false;
            const touchPoint = event.changedTouches?.[0];
            if (touchPoint) {
                applyVoiceSeek(messageElement, Number(touchPoint.clientX || 0));
                if (!messageElement.querySelector("audio")) {
                    const msgId = Number(messageElement.getAttribute("data-message-id") || 0);
                    if (msgId) playVoiceMessage(msgId);
                }
                suppressClickUntil = Date.now() + 400;
            }
            clearLongPress();
            return;
        }

        if (longPressTriggered) {
            event.preventDefault();
            event.stopPropagation();
            longPressTriggered = false;
            swipeActive = false;
            clearLongPress();
            suppressClickUntil = Date.now() + 400;
            return;
        }

        const touchPoint = event.changedTouches?.[0];

        // Handle swipe action
        if (wasSwipeActive && touchPoint) {
            const finalDeltaX = Number(touchPoint.clientX || 0) - touchStartX;
            const deltaY = Math.abs(Number(touchPoint.clientY || 0) - touchStartY);

            if (Math.abs(finalDeltaX) >= SWIPE_THRESHOLD_PX && deltaY < SWIPE_VERTICAL_LOCK_PX * 3) {
                event.preventDefault();
                event.stopPropagation();

                if (finalDeltaX > 0 && canReply) {
                    // Swipe right → Reply
                    setReplyState(messageElement);
                    chatInput?.focus();
                } else if (finalDeltaX < 0) {
                    // Swipe left
                    const isSent = messageElement.classList.contains("sent");
                    if (isSent && canEdit && canEditMessage(messageElement, messageData)) {
                        beginEditMode(messageElement);
                    } else if (canForward) {
                        forwardMessageText(messageElement);
                    }
                }

                swipeActive = false;
                clearLongPress();
                suppressClickUntil = Date.now() + 400;
                return;
            }
        }

        swipeActive = false;
        clearLongPress();

        // Tap handling: single-tap vs double-tap
        if (touchPoint) {
            const currentX = Number(touchPoint.clientX || 0);
            const currentY = Number(touchPoint.clientY || 0);
            const totalMoveX = Math.abs(currentX - touchStartX);
            const totalMoveY = Math.abs(currentY - touchStartY);
            const wasTap = totalMoveX < LONG_PRESS_MOVE_CANCEL_PX && totalMoveY < LONG_PRESS_MOVE_CANCEL_PX;

            if (!wasTap) {
                // Finger moved significantly — not a tap (e.g. scroll)
                lastTapAt = 0;
                return;
            }

            const now = Date.now();
            const timeSinceLastTap = now - lastTapAt;
            const isNearLastTap =
                Math.abs(currentX - lastTapX) <= LONG_PRESS_MOVE_CANCEL_PX &&
                Math.abs(currentY - lastTapY) <= LONG_PRESS_MOVE_CANCEL_PX;

            if (timeSinceLastTap <= DOUBLE_TAP_MS && isNearLastTap) {
                // Double-tap → heart reaction
                event.preventDefault();
                event.stopPropagation();
                if (singleTapTimer) {
                    clearTimeout(singleTapTimer);
                    singleTapTimer = null;
                }
                doHeartReaction();
                lastTapAt = 0;
                suppressClickUntil = Date.now() + 400;
            } else {
                // Potential single tap — wait to see if double-tap follows
                lastTapAt = now;
                lastTapX = currentX;
                lastTapY = currentY;

                if (!isMultimediaMessage && !isSelectModeActive && !event.target?.closest?.(".reply-quote")) {
                    // Text messages: delayed context menu (cancelled if double-tap follows)
                    if (singleTapTimer) clearTimeout(singleTapTimer);
                    singleTapTimer = setTimeout(() => {
                        singleTapTimer = null;
                        if (isSelectModeActive) return;
                        suppressNextContextMenuTapUntil = Date.now() + 420;
                        openContextMenu(currentX, currentY, { focusFirstItem: false });
                    }, DOUBLE_TAP_MS);
                    suppressClickUntil = Date.now() + 400;
                }
                // Multimedia single tap: don't suppress click — native behavior (play/pause, etc.)
            }
        }
    });
    messageElement.addEventListener("touchcancel", () => {
        clearLongPress();
        longPressTriggered = false;
        if (singleTapTimer) {
            clearTimeout(singleTapTimer);
            singleTapTimer = null;
        }
        if (voiceBarDragActive) {
            voiceBarDragActive = false;
            messageElement.classList.remove("voice-seeking");
        }
        if (swipeActive) {
            resetSwipeStyles();
            swipeActive = false;
        }
    });

    messageElement.addEventListener(
        "click",
        (event) => {
            // Suppress click events that follow touch handling
            if (Date.now() < suppressClickUntil) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            // Select mode — intercept everything
            if (isSelectModeActive) {
                if (!event.target.closest(".message")) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                toggleMessageSelection(messageElement);
                return;
            }

            // Voice bar click → seek to clicked position (+ auto-play if not yet loaded)
            if (isVoiceMessage && event.target.closest(".waveform-bars")) {
                applyVoiceSeek(messageElement, event.clientX);
                if (!messageElement.querySelector("audio")) {
                    const msgId = Number(messageElement.getAttribute("data-message-id") || 0);
                    if (msgId) playVoiceMessage(msgId);
                }
                return;
            }

            // Don't intercept clicks on interactive child elements
            if (event.target.closest("a, button, .message-reaction-chip, .voice-play-btn, .reply-quote")) {
                return;
            }

            // Text messages: delayed context menu (cancelled by double-click → heart)
            if (!isMultimediaMessage) {
                event.preventDefault();
                event.stopPropagation();
                if (!desktopClickTimer) {
                    const cx = event.clientX;
                    const cy = event.clientY;
                    desktopClickTimer = setTimeout(() => {
                        desktopClickTimer = null;
                        openContextMenu(cx, cy, { focusFirstItem: false });
                    }, DOUBLE_TAP_MS);
                }
            }
            // Multimedia: don't intercept — let native handlers work
        },
        true
    );

    // Desktop double-click → heart reaction (cancels pending single-click context menu)
    messageElement.addEventListener("dblclick", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (desktopClickTimer) {
            clearTimeout(desktopClickTimer);
            desktopClickTimer = null;
        }
        doHeartReaction();
    });

    // Mouse drag: swipe (reply/edit/forward) and voice bar seek
    let mouseDragInfo = null;

    messageElement.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return; // left click only
        if (isSelectModeActive) return;

        const onBars = isVoiceMessage && !!event.target.closest(".waveform-bars");
        mouseDragInfo = {
            startX: event.clientX,
            startY: event.clientY,
            onBars,
            swipeActive: false,
            swipeLocked: false,
            swipeDirection: 0,
            barDragActive: false,
            moved: false,
        };

        const onMouseMove = (e) => {
            if (!mouseDragInfo) return;
            const rawDeltaX = e.clientX - mouseDragInfo.startX;
            const deltaX = Math.abs(rawDeltaX);
            const deltaY = Math.abs(e.clientY - mouseDragInfo.startY);

            if (deltaX > 3 || deltaY > 3) mouseDragInfo.moved = true;

            // Voice bar drag
            if (mouseDragInfo.onBars && !mouseDragInfo.barDragActive && !mouseDragInfo.swipeActive) {
                if (deltaX > LONG_PRESS_MOVE_CANCEL_PX) {
                    mouseDragInfo.barDragActive = true;
                    messageElement.classList.add("voice-seeking");
                    e.preventDefault(); // prevent text selection
                }
            }

            if (mouseDragInfo.barDragActive) {
                applyVoiceSeek(messageElement, e.clientX);
                return;
            }

            // Don't start swipe from bars
            if (mouseDragInfo.onBars) return;

            // Swipe decision
            if (!mouseDragInfo.swipeLocked && (deltaX > 12 || deltaY > 12)) {
                if (deltaY > deltaX) {
                    mouseDragInfo.swipeLocked = true;
                    mouseDragInfo.swipeActive = false;
                    return;
                }
                mouseDragInfo.swipeLocked = true;
                mouseDragInfo.swipeActive = true;
                mouseDragInfo.swipeDirection = rawDeltaX > 0 ? 1 : -1;
                e.preventDefault(); // prevent text selection
            }

            if (!mouseDragInfo.swipeActive) return;

            e.preventDefault();
            const clampedDelta = Math.sign(rawDeltaX) * Math.min(deltaX, SWIPE_MAX_TRANSLATE_PX);
            if ((mouseDragInfo.swipeDirection === 1 && rawDeltaX <= 0) || (mouseDragInfo.swipeDirection === -1 && rawDeltaX >= 0)) {
                messageElement.style.transform = "";
                return;
            }
            messageElement.style.transform = `translateX(${clampedDelta}px)`;
            messageElement.style.transition = "none";
            messageElement.classList.toggle("swipe-ready", deltaX / SWIPE_THRESHOLD_PX >= 1);
        };

        const onMouseUp = (e) => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            if (!mouseDragInfo) return;
            const info = mouseDragInfo;
            mouseDragInfo = null;

            if (info.barDragActive) {
                messageElement.classList.remove("voice-seeking");
                suppressClickUntil = Date.now() + 400;
                return;
            }

            if (info.swipeActive) {
                resetSwipeStyles();
                const finalDeltaX = e.clientX - info.startX;
                const finalDeltaY = Math.abs(e.clientY - info.startY);

                if (Math.abs(finalDeltaX) >= SWIPE_THRESHOLD_PX && finalDeltaY < SWIPE_VERTICAL_LOCK_PX * 3) {
                    if (finalDeltaX > 0 && canReply) {
                        setReplyState(messageElement);
                        chatInput?.focus();
                    } else if (finalDeltaX < 0) {
                        const isSent = messageElement.classList.contains("sent");
                        if (isSent && canEdit && canEditMessage(messageElement, messageData)) {
                            beginEditMode(messageElement);
                        } else if (canForward) {
                            forwardMessageText(messageElement);
                        }
                    }
                }
                suppressClickUntil = Date.now() + 400;
            }
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    // Expose actions for horizon (empty space beside messages) clicks
    messageElement._openContextMenu = (x, y) => openContextMenu(x, y, { focusFirstItem: false });
    messageElement._doHeartReaction = doHeartReaction;
}

document.addEventListener(
    "touchend",
    (event) => {
        if (Date.now() < suppressNextContextMenuTapUntil) {
            event.preventDefault();
            event.stopPropagation();
            suppressNextContextMenuTapUntil = 0;
        }
    },
    true
);

document.addEventListener(
    "click",
    (event) => {
        if (Date.now() < suppressNextContextMenuTapUntil) {
            event.preventDefault();
            event.stopPropagation();
            suppressNextContextMenuTapUntil = 0;
            return;
        }
    const menu = document.getElementById("messageContextMenu");
    if (!menu) {
        const picker = document.getElementById("messageReactionPicker");
        if (!picker) {
            return;
        }
        if (!event.target.closest("#messageReactionPicker")) {
            closeReactionPicker({ restoreFocus: false });
        }
        return;
    }
    if (!event.target.closest("#messageContextMenu")) {
        closeMessageContextMenu();
    }

    const picker = document.getElementById("messageReactionPicker");
    if (picker && !event.target.closest("#messageReactionPicker")) {
        closeReactionPicker({ restoreFocus: false });
    }
    },
    true
);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.getElementById("messageReactionPicker")) {
        event.preventDefault();
        closeReactionPicker();
        return;
    }

    const menu = document.getElementById("messageContextMenu");
    if (!menu) {
        return;
    }

    const items = Array.from(menu.querySelectorAll(".message-context-menu-item"));
    if (!items.length) {
        return;
    }

    const currentIndex = items.indexOf(document.activeElement);
    if (event.key === "Escape") {
        event.preventDefault();
        closeMessageContextMenu();
        return;
    }
    if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
        items[nextIndex].focus();
    }
    if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        items[nextIndex].focus();
    }
});

document.addEventListener("scroll", closeMessageContextMenu, true);
document.addEventListener("scroll", () => closeReactionPicker({ restoreFocus: false }), true);

/* ── Message Horizon: clicks on empty space beside messages ── */
(function () {
    let horizonClickTimer = null;
    let horizonLastClickX = 0;
    let horizonLastClickY = 0;

    const HORIZON_RATIO = 0.6;

    function findHorizonMessage(clientX, clientY) {
        const containerRect = chatMessagesElem.getBoundingClientRect();
        const messages = chatMessagesElem.querySelectorAll(".message");
        let closest = null;
        let closestDist = Infinity;
        for (const msg of messages) {
            const rect = msg.getBoundingClientRect();
            if (clientY < rect.top - 4 || clientY > rect.bottom + 4) continue;

            // Check horizontal proximity: only the 60% of free space adjacent to the message
            const isSent = msg.classList.contains("sent");
            if (isSent) {
                // Free space is to the left of the message
                const gapLeft = rect.left - containerRect.left;
                const horizonLeft = rect.left - gapLeft * HORIZON_RATIO;
                if (clientX < horizonLeft) continue;
            } else {
                // Free space is to the right of the message
                const gapRight = containerRect.right - rect.right;
                const horizonRight = rect.right + gapRight * HORIZON_RATIO;
                if (clientX > horizonRight) continue;
            }

            const dist = Math.abs(clientY - (rect.top + rect.height / 2));
            if (dist < closestDist) {
                closestDist = dist;
                closest = msg;
            }
        }
        return closest;
    }

    chatMessagesElem.addEventListener("click", (event) => {
        // Only handle clicks directly on the container background (empty space)
        if (event.target !== chatMessagesElem) return;

        const msg = findHorizonMessage(event.clientX, event.clientY);
        if (!msg?._openContextMenu) return;

        if (horizonClickTimer && Math.abs(event.clientX - horizonLastClickX) < 80 && Math.abs(event.clientY - horizonLastClickY) < 30) {
            // Second click within delay → double-click → heart/unheart
            clearTimeout(horizonClickTimer);
            horizonClickTimer = null;
            msg._doHeartReaction?.();
            return;
        }

        if (horizonClickTimer) {
            clearTimeout(horizonClickTimer);
        }

        horizonLastClickX = event.clientX;
        horizonLastClickY = event.clientY;
        const cx = event.clientX;
        const cy = event.clientY;
        horizonClickTimer = setTimeout(() => {
            horizonClickTimer = null;
            msg._openContextMenu(cx, cy);
        }, DOUBLE_TAP_MS);
    });
})();

window.addEventListener("resize", () => {
    closeReactionPicker({ restoreFocus: false });
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

function addUserToChatList(username, options = {}) {
    if (!username) return false;
    const isSelf = username === CURRENT_USER;
    const unreadCount = Math.max(0, Number(options.unreadCount) || 0);
    const userId = Number(options.userId) || 0;

    if (userId > 0) {
        chatUserIdsByUsername.set(username, userId);
    }

    if (chatUsers.has(username)) {
        const existingItem = document.getElementById(chatListItemId(username));
        if (isSelf && existingItem) {
            existingItem.style.display = appSettings.showSavedMessages ? "" : "none";
        }
        const existingAvatarImage = existingItem?.querySelector(".avatar-image");
        if (existingAvatarImage && userId > 0) {
            existingAvatarImage.setAttribute("data-avatar-user-id", String(userId));
            existingAvatarImage.src = buildAvatarUrl({ userId, username, size: 84 });
        }
        setUserUnreadBadge(username, unreadCount);
        return false;
    }

    chatUsers.add(username);

    const li = document.createElement("li");
    li.tabIndex = 0;
    li.setAttribute("role", "listitem");
    li.style.setProperty("--i", chatListElem.children.length);

    if (isSelf) {
        li.setAttribute("aria-label", "Open Saved Messages");
        li.innerHTML = `<span class="avatar saved-messages-avatar"><i class="fas fa-bookmark"></i></span> <span>Saved Messages</span><span class="chat-item-unread-badge" style="display:none;" aria-label="Unread messages">0</span><span id='${chatListSpinnerId(
            username
        )}' style="display:none" class="spinner-border spinner-border-sm text-primary ms-2" role="status" aria-hidden="true"></span>`;
        if (!appSettings.showSavedMessages) li.style.display = "none";
    } else {
        li.setAttribute("aria-label", `Open chat with ${username}`);
        li.innerHTML = `<span class="avatar">${buildAvatarImageHtml({ userId, username, className: "avatar-image", size: 84 })}</span> <span>${escapeHtml(username)}</span><span class="chat-item-unread-badge" style="display:none;" aria-label="Unread messages">0</span><span id='${chatListSpinnerId(
            username
        )}' style="display:none" class="spinner-border spinner-border-sm text-primary ms-2" role="status" aria-hidden="true"></span>`;
    }
    li.id = chatListItemId(username);
    li.classList.add("chat-user");
    if (isSelf) li.classList.add("saved-messages-item");
    li.addEventListener("click", () => selectChatUser(username));
    li.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectChatUser(username);
        }
    });

    // Saved Messages always at top
    if (isSelf && chatListElem.firstChild) {
        chatListElem.insertBefore(li, chatListElem.firstChild);
    } else {
        chatListElem.appendChild(li);
    }
    setUserUnreadBadge(username, unreadCount);
    return true;
}

function addGroupToChatList(group) {
    const groupId = Number(group?.id || 0);
    if (groupId <= 0) {
        return false;
    }

    chatGroupsById.set(groupId, {
        id: groupId,
        title: String(group.title || `Group ${groupId}`),
        description: String(group.description || ""),
        role: String(group.role || "member"),
        member_count: Number(group.member_count || 0),
        last_message_at: String(group.last_message_at || ""),
        unread_count: Math.max(0, Number(group.unread_count || 0)),
    });

    const token = buildGroupToken(groupId);
    const existing = document.getElementById(chatListItemId(token));
    const title = chatGroupsById.get(groupId).title;
    const role = chatGroupsById.get(groupId).role;

    if (existing) {
        const titleElement = existing.querySelector(".chat-item-title");
        const metaElement = existing.querySelector(".chat-item-meta");
        if (titleElement) titleElement.textContent = title;
        if (metaElement) metaElement.textContent = `Group • ${role}`;
        const unreadCount = Math.max(0, Number(chatGroupsById.get(groupId)?.unread_count || 0));
        setGroupUnreadBadge(token, unreadCount);
        return false;
    }

    const li = document.createElement("li");
    li.tabIndex = 0;
    li.setAttribute("role", "listitem");
    li.setAttribute("aria-label", `Open group ${title}`);
    li.style.setProperty("--i", chatListElem.children.length);

    const initials = title
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    li.innerHTML = `
        <span class="avatar">${initials || "G"}</span>
        <span>
            <span class="chat-item-title">${escapeHtml(title)}</span>
            <span class="chat-item-meta">Group • ${escapeHtml(role)}</span>
        </span>
        <span class="chat-item-unread-badge" style="display:none;" aria-label="Unread group messages">0</span>
        <span id='${chatListSpinnerId(token)}' style="display:none" class="spinner-border spinner-border-sm text-primary ms-2" role="status" aria-hidden="true"></span>
    `;
    li.id = chatListItemId(token);
    li.classList.add("chat-user", "chat-group");
    li.addEventListener("click", () => selectGroupChat(groupId));
    li.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectGroupChat(groupId);
        }
    });

    chatListElem.appendChild(li);
    setGroupUnreadBadge(token, Math.max(0, Number(chatGroupsById.get(groupId)?.unread_count || 0)));
    return true;
}

function updateLoadingSpinnerState(chatTarget, show = false) {
    const loadingSpinnerElement = document.getElementById(chatListSpinnerId(chatTarget));
    if (loadingSpinnerElement) {
        loadingSpinnerElement.style = `display: ${show ? "inline" : "none"}`;
    }
}

async function selectChatTarget(target) {
    const previousChatTarget = currentChatUser;
    if (previousChatTarget && typingStateByTarget.get(previousChatTarget) === true) {
        updateTypingStatus(false, previousChatTarget);
    }

    if (typingStopTimer) {
        clearTimeout(typingStopTimer);
        typingStopTimer = null;
    }

    if (currentChatUser?.length) {
        updateLoadingSpinnerState(currentChatUser, false);
    }

    document.getElementById(chatListItemId(currentChatUser))?.classList.remove("selected-chat");
    currentChatUser = target;
    currentChatRecentMessages = null;
lastRecentPollTime = "";
    document.getElementById(chatListItemId(currentChatUser))?.classList.add("selected-chat");
    chatInput.disabled = false;
    chatWithElem.textContent = getCurrentChatDisplayName();
    chatWithElem.classList.toggle("direct-chat-clickable", Boolean(target));
    chatWithElem.tabIndex = target ? 0 : -1;
    chatInput.value = "";
    chatInput.style.height = "";
    setComposerStatus("");
    cancelEditMode();
    exitSelectMode({ clearSelection: true });
    clearReplyState();
    closeConversationSearchBar({ clearInput: true });
    // Preserve playing audio from being destroyed by innerHTML clear
    if (globalNpAudio && globalNpAudio.parentElement && chatMessagesElem.contains(globalNpAudio)) {
        globalNpAudio.parentElement.removeChild(globalNpAudio);
    }
    chatMessagesElem.innerHTML = "";
    pendingSeenMessageIds.clear();
    messageMetaById.clear();
    clearDecryptedMediaCache();
    toggleSettingsPanel(false);
    closeStickerPicker();
    pendingClipboardImageFile = null;
    setClipboardImageButtonVisibility(false);
    void refreshClipboardImageCandidate();

    messageOffset = 0;
    hasMoreMessages = true;
    isLoadingMessages = false;
    hasLoadedMoreMessages = false; // Reset when selecting a new chat

    const isGroup = isGroupToken(currentChatUser);
    groupInfoBtn.hidden = !isGroup;
    userInfoBtn && (userInfoBtn.hidden = isGroup || !currentChatUser || isSavedMessagesChat(currentChatUser));
    if (savedMessagesInfoBtn) savedMessagesInfoBtn.hidden = !isSavedMessagesChat(currentChatUser);
    if (alertPanelBtn) alertPanelBtn.hidden = true;
    if (groupInfoBtn) {
        groupInfoBtn.setAttribute("aria-expanded", "false");
    }
    closeGroupInfoPanel();
    closeSavedMessagesInfoPanel();
    setTypingIndicator("");
    if (!isGroupToken(target)) {
        setUserUnreadBadge(target, 0);
    }

    [...chatListElem.children].forEach((li) => {
        li.classList.toggle("active", li.id === chatListItemId(target));
    });

    if (typeof window.setMobileChatListOpen === "function") {
        window.setMobileChatListOpen(false);
    }

    await loadMessages(target, true, true);
}

async function selectChatUser(username) {
    return selectChatTarget(username);
}

async function selectGroupChat(groupId) {
    const token = buildGroupToken(groupId);
    setGroupUnreadBadge(token, 0);
    try {
        await getGroupCryptoKey(groupId);
    } catch (error) {
        setComposerStatus("Unable to initialize group encryption key", "warning");
    }
    return selectChatTarget(token);
}

function buildChatQueryParams(target, extra = {}) {
    const params = new URLSearchParams();
    const groupId = parseGroupIdFromToken(target);
    if (groupId > 0) {
        params.set("group_id", String(groupId));
    } else {
        params.set("with", target);
    }

    Object.entries(extra).forEach(([key, value]) => {
        if (value != null) {
            params.set(key, String(value));
        }
    });

    return params;
}

async function updateMessagesStatus(messages) {
    if (isGroupToken(currentChatUser) || isSavedMessagesChat(currentChatUser)) {
        return false;
    }
    const messagesNewlySeen = messages
        ?.filter((msg) => msg.receiver_id == CURRENT_USER_ID && !msg.seen_at)
        .map((msg) => Number(msg.id));
    if (!messagesNewlySeen?.length) {
        return false;
    }
    await window.ApiService.jsonOk("api/messages/see.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getCsrfHeaders(),
        },
        body: JSON.stringify({ messages: messagesNewlySeen }),
    });
    return true;
}

async function loadMessages(chatTarget, showLoading = false, isInitialLoad = false) {
    if (isLoadingMessages) return;

    const loadingSpinnerElement = document.getElementById(chatListSpinnerId(chatTarget));
    try {
        isLoadingMessages = true;

        if (showLoading) {
            loadingSpinnerElement.style = "display: inline";
        }

        const offset = isInitialLoad ? 0 : messageOffset;
        const query = buildChatQueryParams(chatTarget, {
            limit: MESSAGES_PER_PAGE,
            offset,
        });

        const data = await window.ApiService.json(`api/messages/fetch.php?${query.toString()}`);
        clearInlineChatState();
        setComposerStatus("");

        if (isInitialLoad) {
            if (!data.messages.length) {
                chatMessagesElem.innerHTML = "";
                showEmptyChatState(
                    isGroupToken(chatTarget)
                        ? "No messages in this group yet. Start the conversation."
                        : "No messages yet. Start the conversation."
                );
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

        if (isInitialLoad) {
            for (const msg of data.messages) {
                await addMessageToChat(msg);
            }

            if (hasMoreMessages) {
                addLoadMoreButton();
            }

            if (appSettings.autoScrollEnabled) {
                scheduleSnapToBottom();
                removeGoToLatestButton();
            } else {
                addGoToLatestButton();
            }
        } else {
            // Preserve the user's viewport position while prepending older
            // messages. We correct scrollTop after EACH message insertion so
            // the browser never shows an intermediate wrong scroll position —
            // even between async yields (decryption, etc.).
            const savedScrollTop = chatMessagesElem.scrollTop;
            let runningHeightDelta = 0;

            for (let i = data.messages.length - 1; i >= 0; i--) {
                const prevH = chatMessagesElem.scrollHeight;
                await addMessageToChat(data.messages[i], true);
                const addedH = chatMessagesElem.scrollHeight - prevH;
                runningHeightDelta += addedH;
                chatMessagesElem.scrollTop = savedScrollTop + runningHeightDelta;
            }

            hasLoadedMoreMessages = true;
            updateGoToLatestButton();
        }
        updateMessagesStatus(data.messages);
    } catch (err) {
        showInlineChatState({
            message: "Unable to load messages.",
            kind: "error",
            actionLabel: "Retry",
            onAction: () => loadMessages(chatTarget, true, isInitialLoad),
        });
        setComposerStatus("Message loading failed. You can retry.", "error");
    } finally {
        if (loadingSpinnerElement) loadingSpinnerElement.style = "display: none";
        isLoadingMessages = false;
    }
}

async function showBrowserNotification(lastMsg, newCount) {
    try {
        const senderName = lastMsg.sender_username || lastMsg.sender_id || "Someone";
        let body = "";
        if (newCount > 1) {
            body = `${newCount} new messages`;
        } else if (lastMsg.message_type === "text") {
            try {
                const isGroup = Number(lastMsg.group_id || 0) > 0;
                if (isGroup) {
                    const gKey = await getGroupCryptoKey(Number(lastMsg.group_id));
                    const payload = lastMsg.message || lastMsg.message_for_sender || "";
                    body = await decryptGroupMessage(String(payload), gKey);
                } else {
                    body = await decryptLongMessage(lastMsg.message);
                }
                if (body.length > 120) body = body.slice(0, 120) + "...";
            } catch (_) {
                body = "New message";
            }
        } else {
            const typeLabels = { image: "Photo", voice: "Voice message", video: "Video", file: "File", sticker: "Sticker" };
            body = typeLabels[lastMsg.message_type] || "New message";
        }

        const notifOptions = {
            body,
            tag: `tintinchat-${lastMsg.sender_id}`,
            renotify: true,
            silent: true,
        };

        // Prefer Service Worker showNotification for broad mobile support
        if ("serviceWorker" in navigator) {
            const reg = await navigator.serviceWorker.ready;
            if (reg?.showNotification) {
                await reg.showNotification(`${senderName} — TinTinChat`, notifOptions);
                return;
            }
        }
        new Notification(`${senderName} — TinTinChat`, notifOptions);
    } catch (_) {}
}

async function loadCurrentChatsRecentMessages() {
    if (isLoadingMessages || !currentChatUser) return;

    try {
        isLoadingMessages = true;
        const offsetMsgId =
            Array.isArray(currentChatRecentMessages) && currentChatRecentMessages.length
                ? Number(currentChatRecentMessages[currentChatRecentMessages.length - 1].id || 0)
                : 0;
        const query = buildChatQueryParams(currentChatUser, {
            offsetMsgId,
            editedSince: lastRecentPollTime || undefined,
        });
        const data = await window.ApiService.json(
            `api/messages/fetch_recent.php?${query.toString()}`
        );
        if (data?.server_time) lastRecentPollTime = data.server_time;

        if (!data?.messages?.length) {
            // Still process typing status even if no new messages
            if (data?.typing) applyTypingData(data.typing);
            setComposerStatus("");
            return;
        }

        // Apply inline typing status from fetch_recent response
        if (data.typing) {
            applyTypingData(data.typing);
        }

        // Separate new messages from re-fetched edits
        const newMessages = data.messages.filter(m => Number(m.id) > offsetMsgId);
        const lastNew = newMessages.length ? newMessages[newMessages.length - 1] : null;

        if (lastNew && Number(lastNew.sender_id) !== Number(CURRENT_USER_ID)) {
            if (appSettings.notificationSoundEnabled) {
                try { playNotificationSound(); } catch (_) {}
            }
            // Browser Notification API
            if (
                appSettings.browserNotificationsEnabled &&
                document.hidden &&
                "Notification" in window &&
                Notification.permission === "granted"
            ) {
                void showBrowserNotification(lastNew, newMessages.length);
            }
        }

        if (newMessages.length) {
            currentChatRecentMessages = newMessages;
            messageOffset += newMessages.length;
        }
        for (const msg of data.messages) {
            await addMessageToChat(msg, false, true);
        }

        updateMessagesStatus(data.messages);
        setComposerStatus("");

        if (newMessages.length) {
            if (appSettings.autoScrollEnabled && !hasLoadedMoreMessages) {
                scheduleSnapToBottom();
            } else {
                addGoToLatestButton();
            }
        }
    } catch (error) {
        setComposerStatus("Failed to refresh latest messages.", "warning");
    } finally {
        isLoadingMessages = false;
    }
}

async function refreshPendingSeenStates() {
    if (!currentChatUser || !pendingSeenMessageIds.size || !navigator.onLine || isGroupToken(currentChatUser)) {
        return;
    }

    const ids = Array.from(pendingSeenMessageIds).slice(0, 200);
    const query = buildChatQueryParams(currentChatUser, { message_ids: ids.join(",") });

    try {
        const data = await window.ApiService.json(`api/messages/fetch_seen.php?${query.toString()}`, {
            cache: "no-store",
        });
        if (!data || data.status !== "ok") {
            return;
        }
        if (Array.isArray(data.seen_messages) && data.seen_messages.length) {
            data.seen_messages.forEach((item) => {
                const seenId = Number(item?.id || 0);
                if (!seenId) {
                    return;
                }
                const seenAt = typeof item?.seen_at === "string" ? item.seen_at : "";
                updateMessageTickStatus(seenId, true, seenAt);
            });
            return;
        }

        if (!Array.isArray(data.seen_message_ids)) {
            return;
        }

        data.seen_message_ids.forEach((seenId) => {
            updateMessageTickStatus(Number(seenId), true);
        });
    } catch (error) {}
}

function forceFetchCurrentChatMessages() {
    if (currentChatRecentMessages == null) {
        return loadMessages(currentChatUser, false, true);
    }
    return loadCurrentChatsRecentMessages();
}
window.forceFetchCurrentChatMessages = forceFetchCurrentChatMessages;

function generateWaveformBars() {
    const bars = [];
    const barCount = 45;
    for (let i = 0; i < barCount; i++) {
        const height = Math.random() * 65 + 12;
        const normalizedHeight = Math.max(10, Math.round(height));
        bars.push(`<div class="waveform-bar" data-bar-index="${i}" data-base-height="${normalizedHeight}" style="height: ${normalizedHeight}%"></div>`);
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

function highlightReplyTarget(targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    targetElement.classList.add("reply-target-highlight");
    setTimeout(() => targetElement.classList.remove("reply-target-highlight"), 2000);
}

async function scrollToReplyTarget(targetId) {
    // 1. Check if already in DOM
    let targetMessage = chatMessagesElem.querySelector(`[data-message-id="${targetId}"]`);
    if (targetMessage) {
        highlightReplyTarget(targetMessage);
        return;
    }

    // 2. Not loaded — iteratively load older messages until found or exhausted
    if (!currentChatUser || !hasMoreMessages) {
        setComposerStatus("Original message is no longer available.", "warning");
        return;
    }

    setComposerStatus("Loading older messages...", "success");
    let batchesLoaded = 0;
    const maxBatches = 20;

    while (!targetMessage && hasMoreMessages && currentChatUser && batchesLoaded < maxBatches) {
        await loadMessages(currentChatUser, false, false);
        batchesLoaded++;
        targetMessage = chatMessagesElem.querySelector(`[data-message-id="${targetId}"]`);
    }

    if (targetMessage) {
        setComposerStatus("");
        // Small delay to let DOM settle after batch load
        await new Promise((r) => setTimeout(r, 100));
        highlightReplyTarget(targetMessage);
    } else {
        setComposerStatus("Could not find the original message.", "warning");
    }
}

function newDateTag(
    msg,
    { atLeft = true, topSpace = 3, fontSize = 10, strictMargins = false, extraStyles = "" }
) {
    const timeLabel = formatMessageTimeLabel(msg.created_at);
    const margins = strictMargins ? `mt-${topSpace}` : `mt-0 mt-lg-${topSpace} mt-md-${topSpace}`;
    return `<span class="message-meta-time mx-2 ${margins}" style="font-size: ${fontSize}px; float: ${
        atLeft ? "left" : "right"
    };${extraStyles}">${escapeHtml(timeLabel)}</span>`;
}

function formatMessageTimeLabel(createdAt) {
    const createdAtDate = new Date(createdAt);
    if (Number.isNaN(createdAtDate.getTime())) {
        return "--:--";
    }
    return createdAtDate.toLocaleTimeString("default", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function toMessageDayKey(createdAt) {
    if (!createdAt) {
        return "";
    }
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

function formatMessageDayLabel(createdAt) {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    if (target.getTime() === today.getTime()) {
        return "Today";
    }
    if (target.getTime() === yesterday.getTime()) {
        return "Yesterday";
    }

    return target.toLocaleDateString("default", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function rebuildMessageDaySeparators() {
    if (!chatMessagesElem) {
        return;
    }

    chatMessagesElem
        .querySelectorAll(".message-day-separator")
        .forEach((separator) => separator.remove());

    const messageElements = Array.from(chatMessagesElem.querySelectorAll(".message"));
    let previousDayKey = "";

    messageElements.forEach((messageElement) => {
        const createdAt = messageElement.getAttribute("data-created-at") || "";
        const dayKey = toMessageDayKey(createdAt);
        if (!dayKey || dayKey === previousDayKey) {
            return;
        }

        const label = formatMessageDayLabel(createdAt);
        if (!label) {
            return;
        }

        const separator = document.createElement("div");
        separator.className = "message-day-separator";
        separator.innerHTML = `<span class="message-day-separator-label">${escapeHtml(label)}</span>`;
        chatMessagesElem.insertBefore(separator, messageElement);
        previousDayKey = dayKey;
    });
}

function resetConversationSearchHighlights() {
    const textNodes = chatMessagesElem.querySelectorAll(".message-text-content");
    textNodes.forEach((node) => {
        const originalText = node.getAttribute("data-original-text");
        if (originalText !== null) {
            node.textContent = originalText;
            node.removeAttribute("data-original-text");
        }
    });
    conversationSearchResults = [];
    conversationSearchResultIndex = -1;
    if (conversationSearchCount) {
        conversationSearchCount.textContent = "0 / 0";
    }
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

function focusConversationSearchResult(index) {
    if (!conversationSearchResults.length) {
        updateConversationSearchCounter();
        return;
    }
    conversationSearchResults.forEach((node) => node.classList.remove("is-active"));

    const normalizedIndex =
        ((index % conversationSearchResults.length) + conversationSearchResults.length) %
        conversationSearchResults.length;
    conversationSearchResultIndex = normalizedIndex;

    const activeNode = conversationSearchResults[conversationSearchResultIndex];
    activeNode.classList.add("is-active");
    activeNode.scrollIntoView({ behavior: "smooth", block: "center" });
    updateConversationSearchCounter();
}

function runConversationSearch() {
    void runConversationSearchAsync();
}

function highlightConversationSearchHits(query) {
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${safeQuery})`, "gi");
    const messageTextNodes = chatMessagesElem.querySelectorAll(".message-text-content");

    messageTextNodes.forEach((node) => {
        const originalText = node.textContent || "";
        if (!originalText || !regex.test(originalText)) {
            regex.lastIndex = 0;
            return;
        }
        regex.lastIndex = 0;
        node.setAttribute("data-original-text", originalText);
        node.innerHTML = escapeHtml(originalText).replace(regex, '<mark class="chat-search-hit">$1</mark>');
        conversationSearchResults.push(...node.querySelectorAll(".chat-search-hit"));
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

    let resultCount = highlightConversationSearchHits(query);
    let loadedOlderBatches = 0;

    while (
        resultCount === 0 &&
        hasMoreMessages &&
        currentChatUser &&
        String(conversationSearchInput?.value || "").trim() === query &&
        loadedOlderBatches < 8
    ) {
        setComposerStatus("Searching older messages...", "success");
        await loadMessages(currentChatUser, false, false);
        if (token !== conversationSearchToken) {
            return;
        }
        resetConversationSearchHighlights();
        resultCount = highlightConversationSearchHits(query);
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
    focusConversationSearchResult(0);
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
    resetConversationSearchHighlights();
    if (clearInput && conversationSearchInput) {
        conversationSearchInput.value = "";
    }
}

function bindConversationSearchEvents() {
    conversationSearchInput?.addEventListener("input", runConversationSearch);

    conversationSearchInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            focusConversationSearchResult(conversationSearchResultIndex + 1);
        } else if (event.key === "Escape") {
            event.preventDefault();
            closeConversationSearchBar();
        }
    });

    conversationSearchPrevBtn?.addEventListener("click", () => {
        focusConversationSearchResult(conversationSearchResultIndex - 1);
    });

    conversationSearchNextBtn?.addEventListener("click", () => {
        focusConversationSearchResult(conversationSearchResultIndex + 1);
    });

    conversationSearchCloseBtn?.addEventListener("click", () => {
        closeConversationSearchBar();
    });

    document.addEventListener("keydown", (event) => {
        const wantsSearch = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f";
        if (wantsSearch && currentChatUser) {
            event.preventDefault();
            openConversationSearchBar();
        }
        if (event.key === "Escape" && conversationSearchBar && !conversationSearchBar.hidden) {
            closeConversationSearchBar();
        }
    });
}

function renderMessageReactions(messageElement, messageData, { flashEmoji = "" } = {}) {
    if (!messageElement) {
        return;
    }

    messageElement.querySelectorAll(".message-reactions").forEach((node) => node.remove());
    messageElement.classList.remove("message-has-reactions");

    if (!Array.isArray(messageData?.reactions) || !messageData.reactions.length) {
        return;
    }

    const hostElement = getReactionHostElement(messageElement);
    const normalizedFlashEmoji = String(flashEmoji || "").trim();

    const container = document.createElement("div");
    container.className = "message-reactions";

    messageData.reactions.forEach((reactionItem) => {
        const emoji = String(reactionItem?.emoji || "").trim();
        const count = Math.max(0, Number(reactionItem?.count || 0));
        if (!emoji || !count) {
            return;
        }
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "message-reaction-chip";
        chip.setAttribute("aria-label", `Reaction ${emoji} (${count})`);
        chip.innerHTML = `<span class="message-reaction-emoji">${emoji}</span><span class="message-reaction-count">${count}</span>`;
        if (reactionItem?.reacted_by_me) {
            chip.classList.add("is-active");
        }
        if (normalizedFlashEmoji && normalizedFlashEmoji === emoji) {
            chip.classList.add("is-pop");
        }
        chip.addEventListener("click", async (event) => {
            event.stopPropagation();
            const currentEmoji = reactionItem?.reacted_by_me ? "" : emoji;
            try {
                await toggleMessageReaction(Number(messageData?.id || 0), currentEmoji);
            } catch (error) {
                showModal(I18N_TEXT.reactFailedTitle, error.message || I18N_TEXT.reactFailedBody, "error");
            }
        });
        container.appendChild(chip);
    });

    if (!container.children.length) {
        return;
    }
    hostElement.appendChild(container);
    messageElement.classList.add("message-has-reactions");
}

async function addMessageToChat(msg, prepend = false) {
    const normalizedMessageId = Number(msg?.id || 0);
    if (normalizedMessageId > 0) {
        const existingMessageElement = chatMessagesElem.querySelector(
            `.message[data-message-id="${normalizedMessageId}"]`
        );
        if (existingMessageElement) {
            const prevMeta = messageMetaById.get(normalizedMessageId);
            messageMetaById.set(normalizedMessageId, msg);
            renderMessageReactions(existingMessageElement, msg);
            updateMessageTickStatus(
                normalizedMessageId,
                Boolean(msg.seen_at),
                msg.seen_at || ""
            );
            if (msg.edited_at && msg.edited_at !== (prevMeta?.edited_at || "")) {
                try {
                    const isGroup = Number(msg.group_id || 0) > 0;
                    let newText = "";
                    if (isGroup) {
                        const gKey = await getGroupCryptoKey(Number(msg.group_id));
                        const payload = msg.sender_id == CURRENT_USER_ID
                            ? msg.message_for_sender || msg.message || ""
                            : msg.message || msg.message_for_sender || "";
                        newText = await decryptGroupMessage(String(payload), gKey);
                    } else {
                        newText = await decryptLongMessage(
                            msg.sender_id == CURRENT_USER_ID ? msg.message_for_sender : msg.message
                        );
                    }
                    const textSpan = existingMessageElement.querySelector(".message-text-content");
                    if (textSpan) {
                        textSpan.textContent = newText;
                    }
                    if (!existingMessageElement.querySelector(".message-edited-marker")) {
                        const marker = document.createElement("span");
                        marker.className = "message-edited-marker";
                        marker.title = "Edited";
                        marker.textContent = "edited";
                        textSpan?.after(marker);
                    }
                } catch (_) { /* decryption failure — leave existing text */ }
            }
            return;
        }
    }

    let div = document.createElement("div");
    let hasContextActions = false;
    let canCopy = false;
    let canCopyImage = false;
    let canForward = false;
    let canReact = false;
    div.classList.add("message");
    div.classList.add(msg.sender_id == CURRENT_USER_ID ? "sent" : "received");

    const isFilePurged = Boolean(msg.file_purged_at);

    if (msg.message_type === "voice" && msg.voice_file_path) {

        div.classList.add("is-voice-message");
        hasContextActions = true;
        canReact = true;
        canForward = !isFilePurged;

        if (isFilePurged) {
            div.innerHTML = `
              ${buildForwardedPreviewHtml(msg)}
              <div class="voice-player-container file-purged-container">
                <button class="voice-play-btn" disabled style="opacity:0.4">
                  <i class="fas fa-play"></i>
                </button>
                <div class="voice-waveform file-purged-waveform">
                  <div class="waveform-bars">
                    ${generateWaveformBars()}
                  </div>
                </div>
                <div class="file-purged-badge"><i class="fas fa-clock"></i> Expired</div>
              </div>
            ${newDateTag(msg, {
                atLeft: msg.sender_id == CURRENT_USER_ID,
                topSpace: 1,
                fontSize: 8.5,
                extraStyles: "color: var(--text-color); font-weight: 600;",
            })}
            `;
        } else {
            div.innerHTML = `
              ${buildForwardedPreviewHtml(msg)}
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
        }
        div.setAttribute("data-message-id", msg.id);
    } else if (msg.message_type === "image" && msg.image_file_path) {
        div.classList.add("is-image-message");
        hasContextActions = true;
        canReact = true;
        canForward = !isFilePurged;
        canCopyImage = !isFilePurged;

        if (isFilePurged) {
            div.innerHTML = `${buildForwardedPreviewHtml(msg)}<div class="file-purged-media-placeholder">
                    <i class="fas fa-image file-purged-media-icon"></i>
                    <div class="file-purged-badge"><i class="fas fa-clock"></i> File expired</div>
                </div>${newDateTag(msg, {
                    atLeft: msg.sender_id == CURRENT_USER_ID,
                    topSpace: 1,
                    fontSize: 8.5,
                    extraStyles: "color: var(--text-color); font-weight: 600;",
                })}`;
        } else {
            div.innerHTML = `${buildForwardedPreviewHtml(msg)}<a href="#" class="image-message-link" title="View full image">
                    <img src="" class="message-image" alt="Encrypted image" data-ready="0" style="display:none;">
                    <div class="image-message-loading" style="padding: 20px; text-align: center; color: #6c757d;">Decrypting image...</div>
                    </a>${newDateTag(msg, {
                        atLeft: msg.sender_id == CURRENT_USER_ID,
                        topSpace: 1,
                        fontSize: 8.5,
                        extraStyles: "color: var(--text-color); font-weight: 600;",
                    })}`;
        }
        div.setAttribute("data-message-id", msg.id);

    } else if (msg.message_type === "video" && msg.any_file_path) {
        div.classList.add("is-video-message");
        hasContextActions = true;
        canReact = true;
        canForward = !isFilePurged;

        if (isFilePurged) {
            div.innerHTML = `
                ${buildForwardedPreviewHtml(msg)}
                <div class="file-purged-media-placeholder">
                    <i class="fas fa-video file-purged-media-icon"></i>
                    <div class="file-purged-badge"><i class="fas fa-clock"></i> File expired</div>
                </div>
                ${newDateTag(msg, {
                    atLeft: msg.sender_id == CURRENT_USER_ID,
                    topSpace: 1,
                    fontSize: 8.5,
                    extraStyles: "color: var(--text-color); font-weight: 600;",
                })}
            `;
        } else {
            div.innerHTML = `
                ${buildForwardedPreviewHtml(msg)}
                <div class="video-message-container">
                    <video class="message-video" controls playsinline preload="metadata" style="display:none;"></video>
                    <div class="video-message-loading">Decrypting video...</div>
                </div>
                ${newDateTag(msg, {
                    atLeft: msg.sender_id == CURRENT_USER_ID,
                    topSpace: 1,
                    fontSize: 8.5,
                    extraStyles: "color: var(--text-color); font-weight: 600;",
                })}
            `;
        }
        div.setAttribute("data-message-id", msg.id);

    } else if (msg.message_type === "file" && msg.any_file_path) {
        hasContextActions = true;
        canReact = true;
        canForward = !isFilePurged;

        if (isFilePurged) {
            // ── Purged file — try to show name from metadata, fall back gracefully ──
            let fileName = "File";
            try {
                const mediaMeta = await getDecryptedMediaMetadata(msg);
                fileName = sanitizeAttachmentFileName(String(mediaMeta?.file_name || "").trim(), fileName);
            } catch (_) {}
            const safeFileName = escapeHtml(fileName);
            const isAudio = isAudioFileName(fileName);

            if (isAudio) {
                div.classList.add("is-file-message", "is-music-message");
                const musicTitle = safeFileName.replace(/\.[^.]+$/, "");
                div.innerHTML = `
                  ${buildForwardedPreviewHtml(msg)}
                  <div class="music-player-container file-purged-container" data-file-msg-id="${msg.id}">
                    <button class="music-play-btn" disabled style="opacity:0.4" type="button">
                      <i class="fas fa-play"></i>
                    </button>
                    <div class="music-info">
                      <div class="music-title file-purged-title">${musicTitle}</div>
                      <div class="file-purged-badge"><i class="fas fa-clock"></i> Expired</div>
                    </div>
                  </div>
                  ${newDateTag(msg, {
                      atLeft: msg.sender_id == CURRENT_USER_ID,
                      topSpace: 1,
                      fontSize: 8.5,
                      extraStyles: "color: var(--text-color); font-weight: 600;",
                  })}
                `;
            } else {
                div.classList.add("is-file-message");
                div.innerHTML = `
                  ${buildForwardedPreviewHtml(msg)}
                  <div class="file-message-container file-purged-container" data-file-msg-id="${msg.id}">
                    <div class="file-icon" style="opacity:0.4">
                      <i class="fas fa-file"></i>
                    </div>
                    <div class="file-info">
                      <div class="file-name file-purged-title">${safeFileName}</div>
                      <div class="file-purged-badge"><i class="fas fa-clock"></i> File expired</div>
                    </div>
                  </div>
                  ${newDateTag(msg, {
                      atLeft: msg.sender_id == CURRENT_USER_ID,
                      topSpace: 1,
                      fontSize: 8.5,
                      extraStyles: "color: var(--text-color); font-weight: 600;",
                  })}
                `;
            }
        } else {
            let fileName = "Encrypted file";
            try {
                const mediaMeta = await getDecryptedMediaMetadata(msg);
                fileName = sanitizeAttachmentFileName(
                    String(mediaMeta?.file_name || "").trim(),
                    fileName
                );
            } catch (error) {}
            const fileSize = msg.file_size ? formatFileSize(msg.file_size) : "";
            const safeFileName = escapeHtml(fileName);
            const isAudio = isAudioFileName(fileName);

            if (isAudio) {
                // ── Music file: Telegram-style player ──
                div.classList.add("is-file-message", "is-music-message");
                const musicTitle = safeFileName.replace(/\.[^.]+$/, "");
                const ext = getFileExtension(fileName).toUpperCase();

                div.innerHTML = `
                  ${buildForwardedPreviewHtml(msg)}
                  <div class="music-player-container" data-file-msg-id="${msg.id}">
                    <button class="music-play-btn" onclick="playMusicMessage(${msg.id})" type="button">
                      <i class="fas fa-play"></i>
                    </button>
                    <div class="music-info">
                      <div class="music-title">${musicTitle}</div>
                      <div class="music-meta">
                        <span class="music-duration">--:--</span>
                        ${fileSize ? `<span class="music-sep">&middot;</span><span class="music-size">${fileSize}</span>` : ""}
                        <span class="music-sep">&middot;</span><span class="music-format">${ext}</span>
                      </div>
                      <div class="music-progress-wrap">
                        <div class="music-progress-bar"></div>
                      </div>
                    </div>
                    <button class="music-download-btn" onclick="downloadAndOpenFile(${msg.id})" type="button" title="Download">
                      <i class="fas fa-download"></i>
                    </button>
                  </div>
                  ${newDateTag(msg, {
                      atLeft: msg.sender_id == CURRENT_USER_ID,
                      topSpace: 1,
                      fontSize: 8.5,
                      extraStyles: "color: var(--text-color); font-weight: 600;",
                  })}
                `;
            } else {
                // ── Generic file ──
                div.classList.add("is-file-message");
                const isDownloaded = await isFileDownloaded(msg.id);
                const downloadIconClass = isDownloaded ? "fa-check-circle" : "fa-download";
                const downloadIconColor = isDownloaded ? "color: var(--primary-color);" : "";
                const cacheTitle = isDownloaded ? 'title="Click to open cached file"' : "";

                div.innerHTML = `
                  ${buildForwardedPreviewHtml(msg)}
                  <div class="file-message-container" data-file-msg-id="${msg.id}" onclick="downloadAndOpenFile(${msg.id})" ${cacheTitle}>
                    <div class="file-icon">
                      <i class="fas fa-file"></i>
                    </div>
                    <div class="file-info">
                      <div class="file-name">${safeFileName}</div>
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
            }
        }
        div.setAttribute("data-message-id", msg.id);
    } else if (msg.message_type === "sticker" && Number(msg.sticker_id || 0) > 0) {
        div.classList.add("is-sticker-message");
        hasContextActions = true;
        canReact = true;
        canForward = true;

        const stickerId = Number(msg.sticker_id || 0);
        const stickerIsActive = Number(msg.sticker_is_active || 0) === 1;
        if (!stickerIsActive) {
            div.innerHTML = `
                <div class="sticker-message-unavailable">Sticker unavailable</div>
                ${newDateTag(msg, {
                    atLeft: msg.sender_id != CURRENT_USER_ID,
                    topSpace: 1,
                    fontSize: 8.5,
                    extraStyles: "color: var(--text-color); font-weight: 600;",
                })}
            `;
        } else {
            div.innerHTML = `
                ${buildForwardedPreviewHtml(msg)}
                <button type="button" class="sticker-message-button" aria-label="Open sticker" title="Open sticker">
                    <img src="api/messages/stickers/get.php?id=${stickerId}" class="sticker-message-image" alt="Sticker" loading="lazy" decoding="async" />
                </button>
                ${newDateTag(msg, {
                    atLeft: msg.sender_id == CURRENT_USER_ID,
                    topSpace: 1,
                    fontSize: 8.5,
                    extraStyles: "color: var(--text-color); font-weight: 600;",
                })}
            `;
            const stickerButton = div.querySelector(".sticker-message-button");
            const stickerImage = div.querySelector(".sticker-message-image");
            stickerButton?.addEventListener("click", () => {
                if (stickerImage?.src) {
                    openImageModal(stickerImage.src);
                }
            });
        }
        div.setAttribute("data-message-id", msg.id);
    } else {
        const isGroupMessage = Number(msg.group_id || 0) > 0;
        let decryptedText = "[Unable to decrypt message]";
        let decryptedReplyText = "";
        try {
            if (isGroupMessage) {
                const groupId = Number(msg.group_id || 0);
                const groupKey = await getGroupCryptoKey(groupId);
                const groupPayload =
                    msg.sender_id == CURRENT_USER_ID
                        ? msg.message_for_sender || msg.message || ""
                        : msg.message || msg.message_for_sender || "";
                decryptedText = await decryptGroupMessage(String(groupPayload || ""), groupKey);
            } else {
                if (msg.sender_id == CURRENT_USER_ID) {
                    decryptedText = await decryptLongMessage(msg.message_for_sender);
                } else {
                    decryptedText = await decryptLongMessage(msg.message);
                }
            }

            if (msg.reply_message_id && msg.reply_message_type === "text") {
                const replyPayload =
                    isGroupMessage
                        ? msg.reply_message || msg.reply_message_for_sender
                        : msg.reply_sender_id == CURRENT_USER_ID
                          ? msg.reply_message_for_sender
                          : msg.reply_message;
                if (replyPayload) {
                    if (isGroupMessage) {
                        const groupId = Number(msg.group_id || 0);
                        const groupKey = await getGroupCryptoKey(groupId);
                        decryptedReplyText = await decryptGroupMessage(String(replyPayload), groupKey);
                    } else {
                        decryptedReplyText = await decryptLongMessage(replyPayload);
                    }
                }
            }
        } catch (e) {
            decryptedText = isGroupMessage ? String(msg.message || "") : "[Unsupported message]";
        }
        const isPersian = isTextPersian(decryptedText.trim());
        const safeText = escapeHtml(decryptedText);
        const isIncomingGroup = isGroupMessage && msg.sender_id != CURRENT_USER_ID;
        const senderUsername = escapeHtml(String(msg.sender_username || "Member"));
        const groupDateTag = `<span class="message-meta-time group-message-meta-time">${escapeHtml(formatMessageTimeLabel(msg.created_at))}</span>`;
        const editedMarker = msg.edited_at
            ? '<span class="message-edited-marker" title="Edited">edited</span>'
            : "";
        const messageBodyContent = `${buildForwardedPreviewHtml(msg)}${buildReplyPreviewHtml(msg, decryptedReplyText)}<span class="message-text-content">${safeText}</span>${editedMarker}${isIncomingGroup ? groupDateTag : ""}`;
        const outsideDateTag = isIncomingGroup
            ? ""
            : newDateTag(msg, {
                  atLeft: isPersian,
                  strictMargins: true,
                  topSpace: 3,
              });
        div.classList.add("is-text-message");
        if (isIncomingGroup) {
            div.classList.add("group-incoming-message");
            div.classList.add(isPersian ? "group-incoming-rtl" : "group-incoming-ltr");
        }
        hasContextActions = true;
        canCopy = true;
        canForward = true;
        canReact = true;
        div.innerHTML = `<button type="button" class="message-copy-btn" title="Copy message" aria-label="Copy message"><i class="fas fa-copy"></i></button>${isIncomingGroup ? `<div class="group-message-row"><span class="group-message-avatar">${buildAvatarImageHtml({ userId: Number(msg.sender_id || 0), username: String(msg.sender_username || "Member"), className: "group-message-avatar-image", size: 64 })}</span><div class="group-message-content"><span class="group-message-name">${senderUsername}</span>${messageBodyContent}</div></div>` : messageBodyContent}${outsideDateTag}`;
        div.setAttribute("data-message-id", msg.id);
        if (isPersian && !isIncomingGroup) {
            div.dir = "rtl";
        } else {
            div.removeAttribute("dir");
        }

        const copyBtn = div.querySelector(".message-copy-btn");
        if (copyBtn) {
            copyBtn.addEventListener("click", async (event) => {
                event.stopPropagation();
                await copyMessageText(div);
            });
        }

        const replyQuote = div.querySelector(".reply-quote");
        if (replyQuote) {
            replyQuote.addEventListener("click", () => {
                const targetId = replyQuote.getAttribute("data-reply-target-id");
                if (!targetId) {
                    return;
                }
                void scrollToReplyTarget(targetId);
            });
        }
    }

    const isIncomingGroupMediaMessage =
        Number(msg.group_id || 0) > 0 &&
        Number(msg.sender_id || 0) !== Number(CURRENT_USER_ID) &&
        String(msg.message_type || "") !== "text";
    if (isIncomingGroupMediaMessage) {
        const senderUsername = escapeHtml(String(msg.sender_username || "Member"));
        const mediaBodyContent = div.innerHTML;
        div.classList.add("group-incoming-message", "group-incoming-ltr", "group-incoming-media-message");
        div.innerHTML = `
            <div class="group-message-row">
                <span class="group-message-avatar">${buildAvatarImageHtml({ userId: Number(msg.sender_id || 0), username: String(msg.sender_username || "Member"), className: "group-message-avatar-image", size: 64 })}</span>
                <div class="group-message-content group-message-content-media">
                    <span class="group-message-name">${senderUsername}</span>
                    ${mediaBodyContent}
                </div>
            </div>
        `;
    }

    if (msg.message_type === "image" && msg.image_file_path && !isFilePurged) {
        const imageLink = div.querySelector(".image-message-link");
        if (imageLink) {
            imageLink.addEventListener("click", async (e) => {
                e.preventDefault();
                const imageElement = div.querySelector(".message-image");
                if (!imageElement) {
                    return;
                }
                if (imageElement.getAttribute("data-ready") !== "1") {
                    await hydrateImageMessageElement(div, msg);
                }
                if (imageElement.getAttribute("data-ready") === "1") {
                    openImageModal(imageElement.src);
                }
            });
        }
        void hydrateImageMessageElement(div, msg);
    } else if (msg.message_type === "video" && msg.any_file_path && !isFilePurged) {
        void hydrateVideoMessageElement(div, msg);
    }

    const isOwnMessage = Number(msg.sender_id || 0) === Number(CURRENT_USER_ID);
    const isGroupMessageForStatus = Number(msg.group_id || 0) > 0;
    if (isOwnMessage && !isSavedMessagesChat(currentChatUser)) {
        const tickContainer = document.createElement("span");
        const isSeen = isGroupMessageForStatus ? Boolean(msg.group_seen_at) : Boolean(msg.seen_at);
        tickContainer.className = isSeen
            ? "message-status-indicator seen-ticks"
            : "message-status-indicator just-sent-tick";
        div.appendChild(tickContainer);

        if (!isGroupMessageForStatus) {
            if (msg.seen_at) {
                pendingSeenMessageIds.delete(Number(msg.id));
            } else {
                pendingSeenMessageIds.add(Number(msg.id));
            }
        }
    }

    messageMetaById.set(Number(msg.id), msg);
    div.setAttribute("data-message-id", String(msg.id));
    div.setAttribute("data-message-type", String(msg.message_type || "text"));
    div.setAttribute("data-sender-id", String(msg.sender_id));
    div.setAttribute("data-sender-username", String(msg.sender_username || ""));
    div.setAttribute("data-created-at", msg.created_at || "");
    div.setAttribute("data-seen-at", msg.seen_at || "");
    div.setAttribute("data-group-seen-at", msg.group_seen_at || "");
    div.setAttribute("data-forwarded-from-message-id", String(Number(msg.forwarded_from_message_id || 0)));
    div.setAttribute("data-edited-at", msg.edited_at || "");
    if (msg.file_size) {
        div.setAttribute("data-file-size", String(msg.file_size));
    }

    if (hasContextActions) {
        const canEdit = canEditMessage(div, msg);
        addMessageActionHandlers(div, {
            canReply: true,
            canSelect: true,
            canEdit,
            canDelete: true,
            canReact,
            canCopy,
            canCopyImage,
            canForward,
            canSave: true,
            canDetails: true,
            messageData: msg,
        });
    }

    renderMessageReactions(div, msg);

    if (prepend) {
        // Disable entrance animation for older (prepended) messages —
        // they are historical content, not new arrivals.
        div.style.animation = 'none';
        const loadMoreBtn = document.getElementById("loadMoreBtn");
        if (loadMoreBtn) {
            chatMessagesElem.insertBefore(div, loadMoreBtn.nextSibling);
        } else {
            chatMessagesElem.insertBefore(div, chatMessagesElem.firstChild);
        }
    } else {
        chatMessagesElem.appendChild(div);
    }

    rebuildMessageDaySeparators();
    if (
        !isLoadingMessages &&
        conversationSearchBar &&
        !conversationSearchBar.hidden &&
        conversationSearchInput?.value.trim()
    ) {
        runConversationSearch();
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

function snapChatToBottom() {
    chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;
}

function isChatNearBottom(threshold = 100) {
    return (
        chatMessagesElem.scrollTop + chatMessagesElem.clientHeight >=
        chatMessagesElem.scrollHeight - threshold
    );
}

function scheduleSnapToBottom() {
    if (snapToBottomRafId) {
        cancelAnimationFrame(snapToBottomRafId);
        snapToBottomRafId = 0;
    }
    if (snapToBottomTimerIds.length) {
        snapToBottomTimerIds.forEach((timerId) => clearTimeout(timerId));
        snapToBottomTimerIds = [];
    }

    snapChatToBottom();

    snapToBottomRafId = requestAnimationFrame(() => {
        snapToBottomRafId = 0;
        snapChatToBottom();
    });

    snapToBottomTimerIds = [
        setTimeout(snapChatToBottom, 80),
        setTimeout(snapChatToBottom, 220),
        setTimeout(snapChatToBottom, 420),
    ];
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

    const isNearBottom = isChatNearBottom(100);

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
    setTimeout(snapChatToBottom, 120);
    setTimeout(snapChatToBottom, 320);
    setTimeout(() => {
        removeGoToLatestButton();
    }, 100);
}

window.scrollToLatest = scrollToLatest;

function updateMessageTickStatus(messageId, isSeen, seenAtOverride = "") {
    const shouldStickToBottom =
        appSettings.autoScrollEnabled &&
        !hasLoadedMoreMessages &&
        isChatNearBottom(220);

    const messageDiv = getMessageElementById(messageId);

    if (!messageDiv) return;

    const tickIndicator = messageDiv.querySelector(".message-status-indicator");
    if (tickIndicator) {
        tickIndicator.className = isSeen
            ? "message-status-indicator seen-ticks"
            : "message-status-indicator just-sent-tick";
    }

    if (isSeen) {
        pendingSeenMessageIds.delete(Number(messageId));
        const seenAt = seenAtOverride || new Date().toISOString();
        messageDiv.setAttribute("data-seen-at", seenAt);

        const existingMeta = messageMetaById.get(Number(messageId));
        if (existingMeta && typeof existingMeta === "object") {
            existingMeta.seen_at = seenAt;
            messageMetaById.set(Number(messageId), existingMeta);
        }
    } else {
        pendingSeenMessageIds.add(Number(messageId));
    }

    if (shouldStickToBottom) {
        scheduleSnapToBottom();
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

// formatFileSize, initFileCache, all media/file cache functions → chat-media-cache.js
const {
    formatFileSize,
    initFileCache,
    saveDownloadedFile,
    getDownloadedFile,
    isFileDownloaded,
    saveMediaToCache,
    getMediaFromCache,
    removeMediaFromCache,
    removeMultipleMediaFromCache,
    getMediaCacheStats,
    clearMediaCache,
    evictStaleCachedMedia,
} = window.MediaCacheService;

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

async function openCachedFile(messageId) {
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

async function downloadAndOpenFile(messageId) {
    const messageMeta = messageMetaById.get(Number(messageId));
    if (!messageMeta) {
        showModal(I18N_TEXT.downloadErrorTitle, "Message metadata not found.", "error");
        return;
    }

    let fileName = `attachment_${messageId}`;
    try {
        const metadata = await getDecryptedMediaMetadata(messageMeta);
        fileName = sanitizeAttachmentFileName(
            String(metadata?.file_name || metadata?.name || "").trim(),
            fileName
        );
    } catch (error) {}

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

        const opened = await openCachedFile(messageId);
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
        const mediaResource = await getDecryptedMediaResource(messageMeta);
        const fileBlob = mediaResource.blob;

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
        const isUnavailable = error?.message === "FILE_UNAVAILABLE";
        showModal(
            isUnavailable ? "File Unavailable" : I18N_TEXT.downloadErrorTitle,
            isUnavailable ? "This file is no longer available on the server." : formatI18nText(I18N_TEXT.downloadErrorBody, { error: error.message || "Unknown" }),
            isUnavailable ? "warning" : "error"
        );
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
        if (goToLatestRafId) {
            cancelAnimationFrame(goToLatestRafId);
        }
        goToLatestRafId = requestAnimationFrame(() => {
            goToLatestRafId = 0;
            updateGoToLatestButton();
        });
    }
});

function updateVoiceSeekBars(waveformBarsEl, ratio) {
    const bars = waveformBarsEl.querySelectorAll(".waveform-bar");
    const playedCount = Math.floor(ratio * bars.length);
    bars.forEach((bar, idx) => {
        if (idx < playedCount) bar.classList.add("played");
        else bar.classList.remove("played");
    });
}

function applyVoiceSeek(messageElement, clientX) {
    const waveformBarsEl = messageElement.querySelector(".waveform-bars");
    if (!waveformBarsEl) return;
    const rect = waveformBarsEl.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    updateVoiceSeekBars(waveformBarsEl, ratio);
    const audio = messageElement.querySelector("audio");
    if (audio && isFinite(audio.duration)) {
        audio.currentTime = ratio * audio.duration;
    } else {
        messageElement.dataset.pendingVoiceSeekRatio = String(ratio);
    }
}

window.playVoiceMessage = async function (messageId) {
    const messageDiv = getMessageElementById(messageId);
    if (!messageDiv) return;

    const messageMeta = messageMetaById.get(Number(messageId));
    if (!messageMeta) {
        showModal("Audio Error", "Unable to load voice metadata.", "error");
        return;
    }

    const playBtn = messageDiv.querySelector(".voice-play-btn");
    const durationDisplay = messageDiv.querySelector(".voice-duration-display");
    const voiceContainer = messageDiv.querySelector(".voice-player-container");

    let audio = messageDiv.querySelector("audio");
    if (!audio) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        audio = document.createElement("audio");
        try {
            const mediaResource = await getDecryptedMediaResource(messageMeta);
            audio.src = mediaResource.objectUrl;
        } catch (error) {
            const isPurged = error?.message === "FILE_UNAVAILABLE";
            showModal(
                isPurged ? "File Expired" : "Audio Error",
                isPurged ? "This voice message has been removed due to server cleanup." : "Unable to decrypt voice message.",
                isPurged ? "warning" : "error"
            );
            if (playBtn) { playBtn.disabled = true; playBtn.style.opacity = "0.4"; }
            return;
        }
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
                const pendingRatio = parseFloat(messageDiv.dataset.pendingVoiceSeekRatio);
                if (isFinite(pendingRatio) && pendingRatio >= 0 && pendingRatio <= 1) {
                    audio.currentTime = pendingRatio * audio.duration;
                    delete messageDiv.dataset.pendingVoiceSeekRatio;
                }
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
            voiceContainer?.classList.remove("is-playing");

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

        // Waveform seek: clicking on bars seeks audio to that position
        const waveformBarsEl = messageDiv.querySelector(".waveform-bars");
        if (waveformBarsEl) {
            waveformBarsEl.addEventListener("click", function (e) {
                if (!audio || !isFinite(audio.duration)) return;
                const rect = waveformBarsEl.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                audio.currentTime = ratio * audio.duration;

                // Immediately update played bars
                const bars = waveformBarsEl.querySelectorAll(".waveform-bar");
                const playedCount = Math.floor(ratio * bars.length);
                bars.forEach((bar, idx) => {
                    if (idx < playedCount) bar.classList.add("played");
                    else bar.classList.remove("played");
                });
            });
        }
    }

    const { analyser, dataArray } = messageDiv.audioAnalyser;
    const waveformBarsContainer = messageDiv.querySelector(".waveform-bars");

    function draw() {
        if (audio.paused || audio.ended) {
            if (activeAnalyser === analyser) activeAnalyser = null;

            const bars = waveformBarsContainer.children;
            for (let i = 0; i < bars.length; i++) {
                const baseHeight = Number(bars[i].dataset?.baseHeight || 20);
                bars[i].style.height = `${Math.max(10, baseHeight)}%`;
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
            const otherContainer = btn.closest(".voice-player-container");
            const otherAudio = otherContainer?.querySelector("audio");
            if (otherAudio && !otherAudio.paused) {
                otherAudio.pause();
            }
            btn.classList.remove("playing");
            otherContainer?.classList.remove("is-playing");
            const i = btn.querySelector("i");
            i.classList.remove("fa-pause");
            i.classList.add("fa-play");
        });

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        audio.play().catch(function (error) {
            showModal(I18N_TEXT.playbackErrorTitle, I18N_TEXT.playbackErrorBody, "error");
        });
        playBtn.classList.add("playing");
        voiceContainer?.classList.add("is-playing");
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        draw();
        // Show global now-playing bar
        const voiceCaption = (messageMeta.sender_username || "Voice") + " · " + formatMessageTimeLabel(messageMeta.created_at);
        showGlobalNowPlaying(audio, voiceCaption, "voice");
    } else {
        audio.pause();
        playBtn.classList.remove("playing");
        voiceContainer?.classList.remove("is-playing");
        playBtn.innerHTML = `<i class="fas fa-play"></i>`;
    }
};

/* ── Music message player ── */
window.playMusicMessage = async function (messageId) {
    const messageDiv = getMessageElementById(messageId);
    if (!messageDiv) return;

    const messageMeta = messageMetaById.get(Number(messageId));
    if (!messageMeta) {
        showModal("Audio Error", "Unable to load music metadata.", "error");
        return;
    }

    const playBtn = messageDiv.querySelector(".music-play-btn");
    const durationDisplay = messageDiv.querySelector(".music-duration");
    const progressBar = messageDiv.querySelector(".music-progress-bar");
    const container = messageDiv.querySelector(".music-player-container");

    let audio = messageDiv.querySelector("audio");
    if (!audio) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        audio = document.createElement("audio");
        try {
            const mediaResource = await getDecryptedMediaResource(messageMeta);
            audio.src = mediaResource.objectUrl;
        } catch (error) {
            const isPurged = error?.message === "FILE_UNAVAILABLE";
            showModal(
                isPurged ? "File Expired" : "Audio Error",
                isPurged ? "This music file has been removed due to server cleanup." : "Unable to decrypt music file.",
                isPurged ? "warning" : "error"
            );
            if (playBtn) { playBtn.disabled = true; playBtn.style.opacity = "0.4"; }
            return;
        }
        audio.preload = "metadata";
        audio.style.display = "none";
        messageDiv.appendChild(audio);

        audio.addEventListener("loadedmetadata", function () {
            if (isFinite(audio.duration)) {
                const dur = Math.round(audio.duration);
                const m = Math.floor(dur / 60);
                const s = dur % 60;
                durationDisplay.textContent = `${m}:${s.toString().padStart(2, "0")}`;
            }
        });

        audio.addEventListener("timeupdate", function () {
            if (isFinite(audio.duration) && audio.duration > 0) {
                const cur = Math.round(audio.currentTime);
                const m = Math.floor(cur / 60);
                const s = cur % 60;
                durationDisplay.textContent = `${m}:${s.toString().padStart(2, "0")}`;
                const pct = (audio.currentTime / audio.duration) * 100;
                if (progressBar) progressBar.style.width = `${pct}%`;
            }
        });

        audio.addEventListener("ended", function () {
            playBtn.innerHTML = `<i class="fas fa-play"></i>`;
            playBtn.classList.remove("playing");
            container?.classList.remove("is-playing");
            if (progressBar) progressBar.style.width = "100%";
        });

        audio.addEventListener("error", function () {
            showModal("Audio Error", "Unable to play music file.", "error");
            playBtn.disabled = true;
            playBtn.style.opacity = "0.5";
        });

        // Click + drag on progress bar to seek
        const progressWrap = messageDiv.querySelector(".music-progress-wrap");
        if (progressWrap) {
            function seekToPosition(clientX) {
                if (!audio || !isFinite(audio.duration)) return;
                const rect = progressWrap.getBoundingClientRect();
                const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                audio.currentTime = ratio * audio.duration;
                if (progressBar) progressBar.style.width = `${ratio * 100}%`;
            }

            // Mouse drag
            progressWrap.addEventListener("mousedown", function (e) {
                e.preventDefault();
                seekToPosition(e.clientX);
                progressWrap.classList.add("seeking");
                function onMouseMove(ev) { seekToPosition(ev.clientX); }
                function onMouseUp() {
                    progressWrap.classList.remove("seeking");
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                }
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });

            // Touch drag
            progressWrap.addEventListener("touchstart", function (e) {
                e.preventDefault();
                e.stopPropagation();
                seekToPosition(e.touches[0].clientX);
                progressWrap.classList.add("seeking");
            });
            progressWrap.addEventListener("touchmove", function (e) {
                e.preventDefault();
                e.stopPropagation();
                seekToPosition(e.touches[0].clientX);
            });
            progressWrap.addEventListener("touchend", function () {
                progressWrap.classList.remove("seeking");
            });
        }
    }

    if (audio.paused) {
        // Pause any other playing audio (voice or music)
        document.querySelectorAll(".voice-play-btn.playing, .music-play-btn.playing").forEach((btn) => {
            const otherAudio = btn.closest(".message")?.querySelector("audio");
            if (otherAudio && !otherAudio.paused) otherAudio.pause();
            btn.classList.remove("playing");
            btn.innerHTML = `<i class="fas fa-play"></i>`;
            btn.closest(".voice-player-container")?.classList.remove("is-playing");
            btn.closest(".music-player-container")?.classList.remove("is-playing");
        });

        if (audioContext.state === "suspended") audioContext.resume();
        audio.play().catch(() => {
            showModal("Playback Error", "Unable to play this audio.", "error");
        });
        playBtn.classList.add("playing");
        container?.classList.add("is-playing");
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        // Show global now-playing bar
        const musicCaption = messageDiv.querySelector(".music-title")?.textContent || "Music";
        showGlobalNowPlaying(audio, musicCaption, "music");
    } else {
        audio.pause();
        playBtn.classList.remove("playing");
        container?.classList.remove("is-playing");
        playBtn.innerHTML = `<i class="fas fa-play"></i>`;
    }
};

const sendTextMessage = async () => {
    if (!currentChatUser) {
        showModal(I18N_TEXT.noChatSelectedTitle, I18N_TEXT.noChatSelectedBody, "warning");
        return;
    }
    const text = chatInput.value.trim();
    if (!text) return;

    if (!navigator.onLine) {
        setComposerStatus("You are offline. Reconnect and retry.", "warning");
        retryLastSendAction = async () => {
            await sendTextMessage();
        };
        showInlineChatState({
            message: "Message not sent while offline.",
            kind: "error",
            actionLabel: "Retry Send",
            onAction: () => {
                if (retryLastSendAction) {
                    void retryLastSendAction();
                }
            },
        });
        return;
    }

    const sendBtn = chatForm.querySelector('button[type="submit"]');
    sendBtn.disabled = true;
    sendBtn.classList.add("btn-pressed");
    setComposerStatus("");

    try {
        if (activeEditMessageId) {
            const didSave = await saveEditedMessage();
            if (!didSave) {
                return;
            }
            return;
        }

        if (isGroupToken(currentChatUser)) {
            await sendGroupTextMessage(
                getCurrentGroupId(),
                text,
                currentReplyTarget?.messageId || null
            );
        } else {
            await sendEncryptedTextMessage(currentChatUser, text, currentReplyTarget?.messageId || null);
            addUserToChatList(currentChatUser);
        }
        chatInput.value = "";
    chatInput.style.height = "";
        updateSendButtonIcon();
        clearReplyState();
        if (!isGroupToken(currentChatUser)) {
            if (typingStopTimer) {
                clearTimeout(typingStopTimer);
                typingStopTimer = null;
            }
            updateTypingStatus(false);
        }
        setComposerStatus("");
        retryLastSendAction = null;
        clearInlineChatState();
    } catch (err) {
        const errorMessage =
            (err && typeof err === "object" && "message" in err && String(err.message || "").trim())
                ? String(err.message)
                : String(err || "Unknown");
        setComposerStatus("Message failed to send. Try again.", "error");
        retryLastSendAction = async () => {
            await sendTextMessage();
        };
        showInlineChatState({
            message: "Message send failed.",
            kind: "error",
            actionLabel: "Retry Send",
            onAction: () => {
                if (retryLastSendAction) {
                    void retryLastSendAction();
                }
            },
        });
        showModal(
            I18N_TEXT.sendErrorTitle,
            formatI18nText(I18N_TEXT.sendErrorBody, { error: errorMessage }),
            "error"
        );
    } finally {
        sendBtn.disabled = false;
        sendBtn.classList.remove("btn-pressed");
    }
};

function setClipboardImageButtonVisibility(isVisible) {
    if (!pasteClipboardImageBtn) {
        return;
    }
    const shouldShow = Boolean(isVisible && currentChatUser && isChatInputFocused);
    pasteClipboardImageBtn.hidden = !shouldShow;
    pasteClipboardImageBtn.disabled = !shouldShow;
    pasteClipboardImageBtn.classList.toggle("is-visible", shouldShow);
}

function createClipboardImageFile(blob) {
    const mimeType = String(blob?.type || "image/png") || "image/png";
    const extension = mimeType.includes("jpeg")
        ? "jpg"
        : mimeType.includes("webp")
          ? "webp"
          : mimeType.includes("gif")
            ? "gif"
            : "png";
    return new File([blob], `clipboard_${Date.now()}.${extension}`, { type: mimeType });
}

async function refreshClipboardImageCandidate() {
    if (!(window.isSecureContext && navigator.clipboard?.read) || !currentChatUser) {
        pendingClipboardImageFile = null;
        setClipboardImageButtonVisibility(false);
        return null;
    }

    try {
        if (navigator.permissions) {
            try {
                const perm = await navigator.permissions.query({ name: "clipboard-read" });
                if (perm.state === "denied") {
                    pendingClipboardImageFile = null;
                    setClipboardImageButtonVisibility(false);
                    return null;
                }
            } catch (_) {}
        }

        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
            const imageType = (clipboardItem.types || []).find((t) => String(t).startsWith("image/"));
            if (!imageType) {
                continue;
            }
            const imageBlob = await clipboardItem.getType(imageType);
            if (imageBlob && imageBlob.size > 0) {
                pendingClipboardImageFile = createClipboardImageFile(imageBlob);
                setClipboardImageButtonVisibility(true);
                return pendingClipboardImageFile;
            }
        }
    } catch (error) {}

    pendingClipboardImageFile = null;
    setClipboardImageButtonVisibility(false);
    return null;
}

async function sendClipboardImage({ requireConfirm = true } = {}) {
    if (!currentChatUser) {
        showModal(I18N_TEXT.noChatSelectedTitle, I18N_TEXT.noChatSelectedBody, "warning");
        return;
    }

    if (!pendingClipboardImageFile) {
        await refreshClipboardImageCandidate();
    }

    if (!pendingClipboardImageFile) {
        showModal("Clipboard", "No image found in clipboard.", "warning");
        return;
    }

    const shouldSend = !requireConfirm || window.confirm("Send clipboard image to this chat?");
    if (!shouldSend) {
        return;
    }

    await sendImageMessage(pendingClipboardImageFile);
    pendingClipboardImageFile = null;
    setClipboardImageButtonVisibility(false);
}

function extractPastedImageFile(pasteEvent) {
    const clipboardData = pasteEvent?.clipboardData;
    if (!clipboardData) {
        return null;
    }

    const clipboardItems = Array.from(clipboardData.items || []);
    const imageItem = clipboardItems.find((item) => String(item.type || "").startsWith("image/"));
    const imageBlob = imageItem?.getAsFile?.();
    if (imageBlob) {
        return createClipboardImageFile(imageBlob);
    }

    const files = Array.from(clipboardData.files || []);
    const imageFile = files.find((file) => String(file.type || "").startsWith("image/"));
    if (imageFile) {
        return createClipboardImageFile(imageFile);
    }

    return null;
}

const fileUploadInput = document.getElementById("fileUploadInput");
const sendBtn = document.getElementById("sendBtn");

let longPressTimer = null;

sendBtn.addEventListener("mousedown", (e) => {
    longPressTimer = setTimeout(() => {
        e.preventDefault();
        fileUploadInput.click();
        longPressTimer = null;
    }, MESSAGE_LONG_PRESS_MS);
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
    }, MESSAGE_LONG_PRESS_MS);
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

// Send button icon: file when empty, paper-plane when typing
function updateSendButtonIcon() {
    const icon = sendBtn?.querySelector("i");
    if (!icon) return;
    const hasText = Boolean(chatInput.value.trim().length);
    if (hasText) {
        icon.classList.remove("fa-file");
        icon.classList.add("fa-paper-plane");
        sendBtn.title = "Send message";
    } else {
        icon.classList.remove("fa-paper-plane");
        icon.classList.add("fa-file");
        sendBtn.title = "Send file";
    }
}
updateSendButtonIcon();

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!chatInput.value.trim()) {
        fileUploadInput.click();
        return;
    }
    await sendTextMessage();
});

chatInput.addEventListener("keydown", async (e) => {
    // Prevent arrow keys from bubbling to global handlers (chat nav, context menu, etc.)
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.stopPropagation();
        return;
    }
    if (e.key !== "Enter") return;

    // Ctrl/Cmd+Enter always saves edit when in edit mode
    if ((e.ctrlKey || e.metaKey) && activeEditMessageId) {
        e.preventDefault();
        await saveEditedMessage();
        return;
    }

    if (appSettings.sendByEnter) {
        // Enter sends, Shift+Enter adds newline
        if (!e.shiftKey) {
            e.preventDefault();
            await sendTextMessage();
        }
    } else {
        // Enter adds newline, Ctrl/Cmd+Enter sends
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            await sendTextMessage();
        }
    }
});

chatInput.addEventListener("paste", async (event) => {
    const pastedImageFile = extractPastedImageFile(event);
    if (!pastedImageFile) {
        return;
    }

    event.preventDefault();
    pendingClipboardImageFile = pastedImageFile;
    setClipboardImageButtonVisibility(true);
    setComposerStatus("Clipboard image ready. Tap Paste to send.", "info");
});

document.addEventListener("paste", async (event) => {
    if (event.defaultPrevented || !currentChatUser) {
        return;
    }

    const activeElement = document.activeElement;
    const activeTagName = String(activeElement?.tagName || "").toUpperCase();
    const isEditable =
        activeTagName === "INPUT" ||
        activeTagName === "TEXTAREA" ||
        activeElement?.isContentEditable;
    if (isEditable && activeElement !== chatInput) {
        return;
    }

    const pastedImageFile = extractPastedImageFile(event);
    if (!pastedImageFile) {
        return;
    }

    event.preventDefault();
    pendingClipboardImageFile = pastedImageFile;
    setClipboardImageButtonVisibility(true);
    setComposerStatus("Clipboard image ready. Tap Paste to send.", "info");
});

document.addEventListener("keydown", async (event) => {
    if (event.key === "Escape") {
        if (isSelectModeActive) {
            event.preventDefault();
            exitSelectMode({ clearSelection: true });
            return;
        }
        if (activeEditMessageId) {
            event.preventDefault();
            cancelEditMode({ restoreFocus: true });
            return;
        }
    }

    const isSelectAllShortcut =
        (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === "a";
    if (!isSelectAllShortcut || !isSelectModeActive) {
        return;
    }

    const inEditableField = ["INPUT", "TEXTAREA", "SELECT"].includes(
        String(document.activeElement?.tagName || "")
    );
    if (inEditableField) {
        return;
    }

    event.preventDefault();
    getVisibleMessageElements().forEach((messageElement) => {
        const messageId = Number(messageElement.getAttribute("data-message-id") || 0);
        if (messageId > 0) {
            selectedMessageIds.add(messageId);
            setMessageSelectedState(messageElement, true);
        }
    });
    updateSelectModeUi();
});

chatInput.addEventListener("input", () => {
    // Auto-grow textarea to fit content
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + "px";

    chatInput.dir = isTextPersian(chatInput.value) ? "rtl" : "ltr";
    updateSendButtonIcon();

    if (!currentChatUser) {
        return;
    }

    const hasText = Boolean(chatInput.value.trim().length);
    if (hasText) {
        if (typingStateByTarget.get(currentChatUser) !== true) {
            updateTypingStatus(true);
        }
        if (typingStopTimer) {
            clearTimeout(typingStopTimer);
        }
        typingStopTimer = setTimeout(() => {
            updateTypingStatus(false);
        }, TYPING_IDLE_TIMEOUT_MS);
    } else {
        if (typingStopTimer) {
            clearTimeout(typingStopTimer);
            typingStopTimer = null;
        }
        updateTypingStatus(false);
    }
});

chatInput.addEventListener("focus", () => {
    isChatInputFocused = true;
    setClipboardImageButtonVisibility(Boolean(pendingClipboardImageFile));
    void refreshClipboardImageCandidate();
});

chatInput.addEventListener("click", () => {
    if (!pendingClipboardImageFile) {
        void refreshClipboardImageCandidate();
    }
});

chatInput.addEventListener("blur", () => {
    isChatInputFocused = false;
    setClipboardImageButtonVisibility(false);
});

// Long-press magnify: expand textarea for easier editing on mobile
(function () {
    let magnifyTimer = null;
    let isMagnified = false;

    function magnifyInput() {
        if (isMagnified) return;
        isMagnified = true;
        chatInput.classList.add("chat-input-magnified");
        chatInput.style.maxHeight = "300px";
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 300) + "px";
    }

    function shrinkInput() {
        if (!isMagnified) return;
        isMagnified = false;
        chatInput.classList.remove("chat-input-magnified");
        chatInput.style.maxHeight = "";
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + "px";
    }

    chatInput.addEventListener("touchstart", () => {
        magnifyTimer = setTimeout(magnifyInput, 600);
    }, { passive: true });

    chatInput.addEventListener("touchend", () => {
        if (magnifyTimer) { clearTimeout(magnifyTimer); magnifyTimer = null; }
    });

    chatInput.addEventListener("touchmove", () => {
        if (magnifyTimer) { clearTimeout(magnifyTimer); magnifyTimer = null; }
    }, { passive: true });

    // Shrink back when user finishes editing and unfocuses
    chatInput.addEventListener("blur", () => {
        setTimeout(shrinkInput, 200);
    });
})();

pasteClipboardImageBtn?.addEventListener("mousedown", (event) => {
    event.preventDefault();
});

pasteClipboardImageBtn?.addEventListener("click", async () => {
    await sendClipboardImage({ requireConfirm: false });
});

window.addEventListener("focus", () => {
    if (isChatInputFocused) {
        void refreshClipboardImageCandidate();
    }
});

searchUserInput.addEventListener("input", function () {
    const val = this.value.trim();
    const feedback = document.getElementById("searchUserFeedback");

    this.classList.remove("is-invalid", "is-valid");

    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    if (val.length < SEARCH_MIN_QUERY_LENGTH) {
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
        const data = await window.ApiService.json(
            `api/users/check_exists.php?username=${encodeURIComponent(val)}`
        );

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
        showModal(I18N_TEXT.connectionErrorTitle, I18N_TEXT.connectionErrorBody, "error");
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
    if (isSearching || query.length < SEARCH_MIN_QUERY_LENGTH) return;

    isSearching = true;
    showSearchLoading(true);

    if (window.updateSearchState) {
        window.updateSearchState("searching");
    }

    try {
        const data = await window.ApiService.json(
            `api/users/search.php?query=${encodeURIComponent(query)}`
        );

        const users = Array.isArray(data.users) ? data.users : [];
        // Inject Saved Messages if query matches
        const lq = query.toLowerCase();
        if ("saved messages".includes(lq) || CURRENT_USER.toLowerCase().includes(lq)) {
            if (!users.includes(CURRENT_USER)) {
                users.unshift(CURRENT_USER);
            }
        }
        if (users.length > 0) {
            showSuggestions(users);
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

        const isSelf = username === CURRENT_USER;
        const displayName = isSelf ? "Saved Messages" : username;
        const initials = isSelf ? '<i class="fas fa-bookmark"></i>' : username
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

        item.innerHTML = `
            <div class="search-suggestion-avatar${isSelf ? " saved-messages-avatar" : ""}">${initials}</div>
            <div class="search-suggestion-username">${escapeHtml(displayName)}</div>
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
        const label = isSavedMessagesChat(username) ? "Opened Saved Messages" : `Started chat with ${username}`;
        window.UIEnhancements.showSearchNotification(label, "success");
    }
}

function showSearchLoading(show) {
    if (searchLoading) {
        searchLoading.style.display = show ? "block" : "none";
    }
}

chatInput.disabled = true;
chatInput.placeholder = "Select someone to chat...";
fetchAndImportPrivateKey().catch((err) => {
    showModal(
        I18N_TEXT.keyErrorTitle,
        formatI18nText(I18N_TEXT.keyErrorBody, { error: err.message || "Unknown" }),
        "error"
    );
});

function showChatListErrorState() {
    const existing = document.getElementById("chatListRetryItem");
    if (existing) {
        return;
    }
    const li = document.createElement("li");
    li.id = "chatListRetryItem";
    li.className = "chat-list-retry-item";
    li.innerHTML = `<button type="button" class="btn btn-sm btn-outline-primary">Retry loading chats</button>`;
    li.querySelector("button")?.addEventListener("click", () => loadChatList(true));
    chatListElem.appendChild(li);
}

function clearChatListErrorState() {
    document.getElementById("chatListRetryItem")?.remove();
}

async function loadGroupDetails(groupId, force = false) {
    if (!groupId) {
        return null;
    }
    if (!force && groupDetailsCache.has(groupId)) {
        return groupDetailsCache.get(groupId);
    }

    const data = await window.ApiService.json(
        `api/groups/fetch_details.php?group_id=${encodeURIComponent(groupId)}`
    );
    groupDetailsCache.set(groupId, data);
    return data;
}

async function renderGroupInfoPanel(groupId) {
    try {
        const details = await loadGroupDetails(groupId, true);
        const group = details?.group || {};
        const members = Array.isArray(details?.members) ? details.members : [];
        const role = String(details?.role || "member");

        if (groupInfoTitle) groupInfoTitle.textContent = group.title || `Group ${groupId}`;
        if (groupInfoDescription)
            groupInfoDescription.textContent =
                group.description || "No description provided yet.";
        if (groupInfoMemberCount) groupInfoMemberCount.textContent = String(members.length);
        if (groupInfoMembers) {
            groupInfoMembers.innerHTML = "";
            if (!members.length) {
                const empty = document.createElement("li");
                empty.className = "group-member-empty";
                empty.textContent = "No members found.";
                groupInfoMembers.appendChild(empty);
            }
            members.forEach((member) => {
                const li = document.createElement("li");
                li.className = "group-member-item";
                const memberRole = String(member.role || "member");
                const memberUserId = Number(member.user_id || 0);
                const memberUsername = String(member.username || "Unknown");
                const canRemove =
                    details?.can_manage &&
                    memberUserId !== Number(CURRENT_USER_ID) &&
                    memberRole !== "owner" &&
                    !(role === "admin" && memberRole !== "member");
                const canTransfer =
                    Boolean(details?.can_transfer_owner) &&
                    memberUserId !== Number(CURRENT_USER_ID) &&
                    memberRole !== "owner";

                li.innerHTML = `
                    <div class="group-member-contact">
                        <span class="group-member-avatar">${buildAvatarImageHtml({ userId: memberUserId, username: memberUsername, className: "group-member-avatar-image", size: 64 })}</span>
                        <span class="group-member-info">
                            <span class="group-member-name">${escapeHtml(memberUsername)}</span>
                            <span class="group-member-role">${escapeHtml(memberRole)}</span>
                        </span>
                    </div>
                    <span class="group-member-actions">
                        ${canTransfer ? `<button type="button" class="btn btn-outline-warning" data-action="transfer-owner" aria-label="Transfer ownership to ${escapeHtml(memberUsername)}" data-user-id="${memberUserId}" data-username="${escapeHtml(memberUsername)}">Owner</button>` : ""}
                        ${canRemove ? `<button type="button" class="btn btn-outline-danger" data-action="remove-member" aria-label="Remove ${escapeHtml(memberUsername)} from group" data-user-id="${memberUserId}" data-username="${escapeHtml(memberUsername)}">Remove</button>` : ""}
                    </span>
                `;
                li.setAttribute("data-member-user-id", String(memberUserId));
                li.setAttribute("data-member-username", memberUsername);
                groupInfoMembers.appendChild(li);
            });
        }

        if (groupJoinLinkInput) {
            groupJoinLinkInput.value = details?.can_manage && group.join_link ? group.join_link : "";
            groupJoinLinkInput.style.display = details?.can_manage ? "" : "none";
        }
        if (groupCopyJoinLinkBtn) {
            groupCopyJoinLinkBtn.style.display = details?.can_manage ? "" : "none";
        }
        if (groupRotateJoinLinkBtn) {
            groupRotateJoinLinkBtn.style.display = details?.can_manage ? "" : "none";
        }
        if (groupAddMemberBtn) {
            groupAddMemberBtn.hidden = !Boolean(details?.can_manage);
        }
        if (groupTransferOwnerBtn) {
            groupTransferOwnerBtn.hidden = !Boolean(details?.can_transfer_owner);
        }
        if (groupLeaveBtn) {
            groupLeaveBtn.hidden = !Boolean(details?.can_leave);
        }
        groupInfoPanel?.setAttribute(
            "aria-label",
            `Group details for ${group.title || `Group ${groupId}`}`
        );
    } catch (error) {
        showModal("Group Details", error.message || "Failed to load group details", "warning");
    }
}

async function createGroupFlow(title, description = "") {
    const data = await window.ApiService.jsonOk("api/groups/create.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getCsrfHeaders(),
        },
        body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
        }),
    });

    if (data?.group) {
        addGroupToChatList(data.group);
        await selectGroupChat(Number(data.group.id));
        showModal("Group Created", `Created group "${data.group.title}" successfully.`, "success");
    }
}

async function handleJoinGroupFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("join_group");
    if (!token) {
        return;
    }

    try {
        const data = await window.ApiService.jsonOk("api/groups/join.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getCsrfHeaders(),
            },
            body: JSON.stringify({ token }),
        });

        await loadChatList(true);
        if (data?.group?.id) {
            await selectGroupChat(Number(data.group.id));
        }
        showModal("Joined Group", "You have joined the group successfully.", "success");
    } catch (error) {
        showModal("Join Group Failed", error.message || "Invalid join link.", "error");
    } finally {
        params.delete("join_group");
        const cleaned = `${window.location.pathname}${
            params.toString() ? `?${params.toString()}` : ""
        }`;
        window.history.replaceState({}, "", cleaned);
    }
}

async function runGroupKeyHealthCheck() {
    const activeGroupId = getCurrentGroupId();
    const body = activeGroupId ? { group_id: activeGroupId } : {};

    try {
        setComposerStatus("Running group key health check...");
        const data = await window.ApiService.jsonOk("api/keys/group_health.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getCsrfHeaders(),
            },
            body: JSON.stringify(body),
        });

        const groups = Array.isArray(data?.groups) ? data.groups : [];
        if (!groups.length) {
            setComposerStatus("Group key health check finished", "success");
            showModal("Group Key Health", "No groups found.", "info");
            return;
        }

        const unhealthyGroups = groups.filter((group) => !group.is_healthy);
        const modalBody = createGroupKeyHealthModalContent(groups, {
            activeGroupId,
            checkedAt: String(data?.checked_at || ""),
        });

        setComposerStatus(
            unhealthyGroups.length ? "Group key health check found issues" : "Group key health check passed",
            unhealthyGroups.length ? "warning" : "success"
        );
        openMessageActionModal("Group Key Health", modalBody);
    } catch (error) {
        setComposerStatus("Group key health check failed", "error");
        showModal("Group Key Health", error.message || "Unable to run health check.", "error");
    }
}

function createAddMemberPickerContent(groupId, details) {
    const wrapper = document.createElement("div");
    wrapper.className = "forward-target-list";

    const existingUsernames = new Set(
        (Array.isArray(details?.members) ? details.members : []).map((member) =>
            String(member?.username || "").trim().toLowerCase()
        )
    );

    const candidates = Array.from(chatUsers)
        .filter((username) => username && username !== CURRENT_USER)
        .filter((username) => !existingUsernames.has(String(username).toLowerCase()))
        .sort((a, b) => a.localeCompare(b));

    if (!candidates.length) {
        const empty = document.createElement("div");
        empty.className = "forward-target-empty";
        empty.textContent = "No available chat friends to add.";
        wrapper.appendChild(empty);
        return wrapper;
    }

    candidates.forEach((username) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "forward-target-item";
        button.innerHTML = `
            <span class="forward-target-avatar">${escapeHtml((username[0] || "?").toUpperCase())}</span>
            <span class="forward-target-name">${escapeHtml(username)}</span>
        `;

        button.addEventListener("click", async () => {
            try {
                button.disabled = true;
                button.classList.add("is-forwarding");
                setComposerStatus("Adding member...");

                await window.ApiService.jsonOk("api/groups/add_member.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...getCsrfHeaders(),
                    },
                    body: JSON.stringify({ group_id: groupId, username }),
                });

                await renderGroupInfoPanel(groupId);
                closeMessageActionModal();
                setComposerStatus("Member added", "success");
                showModal("Member Added", `${username} added to group.`, "success");
            } catch (error) {
                setComposerStatus("Failed to add member", "error");
                showModal("Add Member Failed", error.message || "Unable to add member", "error");
            } finally {
                button.disabled = false;
                button.classList.remove("is-forwarding");
            }
        });

        wrapper.appendChild(button);
    });

    return wrapper;
}

async function openAddMemberModal() {
    const groupId = getCurrentGroupId();
    if (!groupId) {
        return;
    }

    try {
        const details = await loadGroupDetails(groupId, true);
        if (!details?.can_manage) {
            showModal("Add Member", "You do not have permission to add members.", "warning");
            return;
        }
        const pickerContent = createAddMemberPickerContent(groupId, details);
        openMessageActionModal("Add Group Member", pickerContent);
    } catch (error) {
        showModal("Add Member", error.message || "Unable to load member picker.", "error");
    }
}

function createGroupKeyHealthModalContent(groups, { activeGroupId = 0, checkedAt = "" } = {}) {
    const wrapper = document.createElement("div");
    wrapper.className = "group-health-modal";

    const unhealthyGroups = groups.filter((group) => !group.is_healthy);
    const legacyGroups = groups.filter(
        (group) => Number(group.legacy_plaintext_text_messages_count || 0) > 0
    );

    const summary = document.createElement("div");
    summary.className = "group-health-summary";

    const scopeText = document.createElement("div");
    scopeText.className = "group-health-summary-title";
    scopeText.textContent = activeGroupId
        ? `Checked active group (${activeGroupId}).`
        : `Checked ${groups.length} group(s).`;

    const facts = document.createElement("div");
    facts.className = "group-health-summary-facts";

    const factMissing = document.createElement("span");
    factMissing.textContent = unhealthyGroups.length
        ? `${unhealthyGroups.length} group(s) need attention`
        : "No missing member keys";

    const factLegacy = document.createElement("span");
    factLegacy.textContent = legacyGroups.length
        ? `${legacyGroups.length} group(s) contain legacy plaintext`
        : "No legacy plaintext detected";

    facts.appendChild(factMissing);
    facts.appendChild(factLegacy);

    if (checkedAt) {
        const checkedAtText = document.createElement("div");
        checkedAtText.className = "group-health-summary-meta";
        checkedAtText.textContent = `Checked at: ${checkedAt}`;
        summary.appendChild(scopeText);
        summary.appendChild(facts);
        summary.appendChild(checkedAtText);
    } else {
        summary.appendChild(scopeText);
        summary.appendChild(facts);
    }

    const tableWrap = document.createElement("div");
    tableWrap.className = "group-health-table-wrap";

    const table = document.createElement("table");
    table.className = "group-health-table";
    table.setAttribute("aria-label", "Group key health check results");

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Group", "Missing Keys", "Encrypted Text", "Legacy Plaintext", "Status"].forEach((title) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = title;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    const tbody = document.createElement("tbody");
    groups.forEach((group) => {
        const tr = document.createElement("tr");
        tr.className = "group-health-main-row";

        const titleCell = document.createElement("td");
        titleCell.textContent = group.title || `Group ${group.group_id}`;

        const missingCell = document.createElement("td");
        missingCell.textContent = String(Number(group.missing_member_keys_count || 0));

        const encryptedCell = document.createElement("td");
        encryptedCell.textContent = String(Number(group.encrypted_text_messages_count || 0));

        const legacyCell = document.createElement("td");
        legacyCell.textContent = String(Number(group.legacy_plaintext_text_messages_count || 0));

        const statusCell = document.createElement("td");
        const statusPill = document.createElement("span");
        const isHealthy = Boolean(group.is_healthy);
        statusPill.className = `group-health-status ${isHealthy ? "healthy" : "warning"}`;
        statusPill.textContent = isHealthy ? "Healthy" : "Needs attention";
        statusCell.appendChild(statusPill);

        const missingMembers = Array.isArray(group.missing_member_keys)
            ? group.missing_member_keys
            : [];
        let detailsRow = null;
        if (!isHealthy && missingMembers.length) {
            const toggleBtn = document.createElement("button");
            toggleBtn.type = "button";
            toggleBtn.className = "group-health-toggle-btn";
            toggleBtn.textContent = "Details";
            toggleBtn.setAttribute("aria-expanded", "false");
            statusCell.appendChild(toggleBtn);

            detailsRow = document.createElement("tr");
            detailsRow.className = "group-health-details-row";
            detailsRow.hidden = true;

            const detailsCell = document.createElement("td");
            detailsCell.colSpan = 5;

            const detailsWrap = document.createElement("div");
            detailsWrap.className = "group-health-details-wrap";

            const detailsTitle = document.createElement("div");
            detailsTitle.className = "group-health-details-title";
            detailsTitle.textContent = "Members missing wrapped group key:";
            detailsWrap.appendChild(detailsTitle);

            const detailsList = document.createElement("ul");
            detailsList.className = "group-health-details-list";
            missingMembers.forEach((member) => {
                const item = document.createElement("li");
                const username = String(member?.username || "").trim();
                const memberUserId = Number(member?.user_id || 0);
                item.textContent = username ? `${username} (id: ${memberUserId})` : `User ${memberUserId}`;
                detailsList.appendChild(item);
            });

            detailsWrap.appendChild(detailsList);
            detailsCell.appendChild(detailsWrap);
            detailsRow.appendChild(detailsCell);

            toggleBtn.addEventListener("click", () => {
                const willOpen = detailsRow.hidden;
                detailsRow.hidden = !willOpen;
                toggleBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
                toggleBtn.textContent = willOpen ? "Hide" : "Details";
            });
        }

        tr.appendChild(titleCell);
        tr.appendChild(missingCell);
        tr.appendChild(encryptedCell);
        tr.appendChild(legacyCell);
        tr.appendChild(statusCell);

        tbody.appendChild(tr);
        if (detailsRow) {
            tbody.appendChild(detailsRow);
        }
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableWrap.appendChild(table);

    wrapper.appendChild(summary);
    wrapper.appendChild(tableWrap);
    return wrapper;
}

async function loadChatList(_force = false) {
    try {
        const data = await window.ApiService.json("api/chats/fetch.php");
        const incomingGroups = Array.isArray(data.chatGroups) ? data.chatGroups : [];
        const incomingGroupIds = new Set(incomingGroups.map((group) => Number(group.id || 0)));
        if (Array.isArray(data.chatUserItems) && data.chatUserItems.length) {
            data.chatUserItems.forEach((item) => {
                addUserToChatList(String(item?.username || ""), {
                    unreadCount: Number(item?.unread_count || 0),
                    userId: Number(item?.user_id || 0),
                });
            });
        } else if (data.chatUsers && Array.isArray(data.chatUsers)) {
            data.chatUsers.forEach((username) => addUserToChatList(String(username || "")));
        }
        Array.from(chatGroupsById.keys()).forEach((groupId) => {
            if (!incomingGroupIds.has(Number(groupId))) {
                const token = buildGroupToken(groupId);
                chatGroupsById.delete(groupId);
                groupDetailsCache.delete(groupId);
                groupTextCryptoKeyCache.delete(Number(groupId));
                groupTextCryptoKeyInflight.delete(Number(groupId));
                groupKeyVersionCache.delete(Number(groupId));
                document.getElementById(chatListItemId(token))?.remove();
            }
        });

        incomingGroups.forEach(addGroupToChatList);
        // Always ensure Saved Messages is in the chat list
        addUserToChatList(CURRENT_USER, { userId: CURRENT_USER_ID });
        clearChatListErrorState();
    } catch (e) {
        showChatListErrorState();
    }
}

loadChatList();
handleJoinGroupFromUrl();

createGroupBtn?.addEventListener("click", () => {
    openCreateGroupModal();
});

groupKeyHealthBtn?.addEventListener("click", async () => {
    await runGroupKeyHealthCheck();
});

groupInfoBtn?.addEventListener("click", async () => {
    const groupId = getCurrentGroupId();
    if (!groupId) {
        return;
    }
    await renderGroupInfoPanel(groupId);
    openGroupInfoPanel();
});

groupInfoBackBtn?.addEventListener("click", () => {
    closeGroupInfoPanel();
});

groupAddMemberBtn?.addEventListener("click", async () => {
    await openAddMemberModal();
});

groupCopyJoinLinkBtn?.addEventListener("click", async () => {
    const link = groupJoinLinkInput?.value?.trim();
    if (!link) return;
    try {
        await navigator.clipboard.writeText(link);
        setComposerStatus("Join link copied", "success");
        showTransientSuccessToast("Join link copied to clipboard.");
    } catch (error) {
        setComposerStatus("Unable to copy join link", "warning");
        showModal("Copy Failed", "Unable to copy join link.", "warning");
    }
});

groupRotateJoinLinkBtn?.addEventListener("click", async () => {
    const groupId = getCurrentGroupId();
    if (!groupId) {
        return;
    }
    try {
        setComposerStatus("Rotating join link...");
        const data = await window.ApiService.jsonOk("api/groups/rotate_join_link.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getCsrfHeaders(),
            },
            body: JSON.stringify({ group_id: groupId }),
        });
        if (groupJoinLinkInput) {
            groupJoinLinkInput.value = data.join_link || "";
        }
        setComposerStatus("Join link rotated", "success");
        showModal("Join Link Rotated", "A new join link is now active.", "success");
    } catch (error) {
        setComposerStatus("Unable to rotate join link", "error");
        showModal("Rotate Failed", error.message || "Unable to rotate join link.", "error");
    }
});

groupInfoMembers?.addEventListener("click", async (event) => {
    const target = event.target.closest("button[data-action]");
    if (!target) {
        return;
    }
    const action = target.getAttribute("data-action");
    const userId = Number(target.getAttribute("data-user-id") || 0);
    const username = target.getAttribute("data-username") || "member";
    const groupId = getCurrentGroupId();
    if (!groupId || !userId) {
        return;
    }

    if (action === "remove-member") {
        const confirmed = window.confirm(`Remove ${username} from this group?`);
        if (!confirmed) {
            return;
        }
        try {
            await window.ApiService.jsonOk("api/groups/remove_member.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({ group_id: groupId, user_id: userId }),
            });
            await renderGroupInfoPanel(groupId);
            setComposerStatus("Member removed", "success");
            showModal("Member Removed", `${username} was removed from group.`, "success");
        } catch (error) {
            setComposerStatus("Unable to remove member", "error");
            showModal("Remove Failed", error.message || "Unable to remove member.", "error");
        }
        return;
    }

    if (action === "transfer-owner") {
        const confirmed = window.confirm(`Transfer ownership to ${username}?`);
        if (!confirmed) {
            return;
        }
        try {
            await window.ApiService.jsonOk("api/groups/transfer_owner.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({ group_id: groupId, new_owner_user_id: userId }),
            });
            await renderGroupInfoPanel(groupId);
            await loadChatList(true);
            setComposerStatus("Ownership transferred", "success");
            showModal("Ownership Transferred", `${username} is now the group owner.`, "success");
        } catch (error) {
            setComposerStatus("Unable to transfer ownership", "error");
            showModal("Transfer Failed", error.message || "Unable to transfer ownership.", "error");
        }
    }
});

groupTransferOwnerBtn?.addEventListener("click", () => {
    showModal(
        "Transfer Ownership",
        "Use the Owner button next to a member name to transfer ownership.",
        "info"
    );
});

groupLeaveBtn?.addEventListener("click", async () => {
    const groupId = getCurrentGroupId();
    if (!groupId) {
        return;
    }

    const confirmed = window.confirm(
        "Leave this group? If you are the owner, transfer ownership first unless you are the last member."
    );
    if (!confirmed) {
        return;
    }

    try {
        await window.ApiService.jsonOk("api/groups/leave.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getCsrfHeaders(),
            },
            body: JSON.stringify({ group_id: groupId }),
        });

        closeGroupInfoPanel();
        groupTextCryptoKeyCache.delete(Number(groupId));
        groupTextCryptoKeyInflight.delete(Number(groupId));
        groupKeyVersionCache.delete(Number(groupId));
        groupInfoBtn.hidden = true;
        groupInfoBtn.setAttribute("aria-expanded", "false");
        if (alertPanelBtn) alertPanelBtn.hidden = false;
        currentChatUser = null;
        currentChatRecentMessages = null;
lastRecentPollTime = "";
        chatMessagesElem.innerHTML = "";
        clearDecryptedMediaCache();
        chatWithElem.textContent = "Select a chat";
        chatInput.value = "";
    chatInput.style.height = "";
        chatInput.disabled = true;
        chatInput.placeholder = "Select someone to chat...";

        await loadChatList(true);
        setComposerStatus("Left group", "success");
        showModal("Left Group", "You have left the group.", "success");
    } catch (error) {
        setComposerStatus("Unable to leave group", "error");
        showModal("Leave Failed", error.message || "Unable to leave group.", "error");
    }
});

let chatListTriggerTime = 0;

setInterval(async () => {
    if (isRefreshLoopBusy) {
        return;
    }
    if (!navigator.onLine) {
        return;
    }
    if (document.hidden) {
        if (chatListTriggerTime % 5 === 0) {
            try {
                await Promise.all([
                    loadChatList(),
                    // Fetch messages in background for browser notifications
                    currentChatUser?.length &&
                        appSettings.browserNotificationsEnabled &&
                        forceFetchCurrentChatMessages(),
                ]);
            } catch (error) {}
        }
        chatListTriggerTime = ++chatListTriggerTime % 30;
        return;
    }

    isRefreshLoopBusy = true;
    try {
        await Promise.all([
            currentChatUser?.length && forceFetchCurrentChatMessages(),
            !(chatListTriggerTime % 10) && loadChatList(),
        ]);
        chatListTriggerTime = ++chatListTriggerTime % 10;
    } finally {
        isRefreshLoopBusy = false;
    }
}, CHAT_REFRESH_POLL_MS);

setInterval(async () => {
    if (isSeenLoopBusy || document.hidden) {
        return;
    }
    isSeenLoopBusy = true;
    try {
        await refreshPendingSeenStates();
    } finally {
        isSeenLoopBusy = false;
    }
}, SEEN_STATUS_POLL_MS);

voiceBtn.addEventListener("click", async () => {
    if (!currentChatUser) {
        showModal(I18N_TEXT.noChatSelectedTitle, I18N_TEXT.noChatSelectedBody, "warning");
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
                stream.getTracks().forEach((track) => track.stop());
                resetRecordingState();

                if (shouldSendRecording && audioChunks.length > 0) {
                    const audioBlob = new Blob(audioChunks, {
                        type: "audio/webm",
                    });
                    await sendVoiceMessage(audioBlob);
                }
            };

            mediaRecorder.start();
            isRecording = true;
            setRecordingState(true);

            addRecordingIndicator();
        } catch (err) {
            showModal(I18N_TEXT.microphoneErrorTitle, I18N_TEXT.microphoneErrorBody, "error");
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
            <span class="px-1 px-lg-5 px-md-5">Recording...</span>
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

        const groupId = parseGroupIdFromToken(currentChatUser);
        const mediaPayload = await encryptMediaForMessage(
            audioBlob,
            {
                file_name: "voice_message.webm",
                mime_type: String(audioBlob?.type || "audio/webm"),
                file_size: Number(audioBlob?.size || 0),
            },
            groupId > 0 ? { groupId } : { targetUsername: currentChatUser }
        );

        const formData = new FormData();
        if (groupId > 0) {
            formData.append("group_id", String(groupId));
        } else {
            formData.append("target", currentChatUser);
        }
        formData.append("message", mediaPayload.messageForRecipient);
        formData.append("message_for_sender", mediaPayload.messageForSender);
        formData.append("voice_file", mediaPayload.encryptedBlob, "voice_message.enc");

        await window.ApiService.jsonOk("api/messages/media/send_voice.php", {
            method: "POST",
            headers: getCsrfHeaders(),
            body: formData,
        });

        sendingIndicator.remove();

        if (!isGroupToken(currentChatUser)) {
            addUserToChatList(currentChatUser);
            updateTypingStatus(false);
        }
        loadCurrentChatsRecentMessages();
        setComposerStatus("");
    } catch (err) {
        setComposerStatus("Voice message failed. Try again.", "error");
        showModal(
            I18N_TEXT.voiceSendErrorTitle,
            formatI18nText(I18N_TEXT.voiceSendErrorBody, { error: err.message || "Unknown" }),
            "error"
        );

        const sendingIndicator = document.querySelector(".sending-indicator");
        if (sendingIndicator) sendingIndicator.remove();
    }
}

imageUploadBtn.addEventListener("click", () => {
    if (!currentChatUser) {
        showModal(I18N_TEXT.noChatSelectedTitle, I18N_TEXT.noChatSelectedBody, "warning");
        return;
    }
    if (imageSourceMenu && !imageSourceMenu.hidden && imageSourceMenu.classList.contains("is-open")) {
        closeImageSourceMenu({ restoreFocus: true });
        return;
    }
    openImageSourceMenu();
});

stickerPickerBtn?.addEventListener("click", () => {
    if (!currentChatUser) {
        showModal(I18N_TEXT.noChatSelectedTitle, I18N_TEXT.noChatSelectedBody, "warning");
        return;
    }

    if (stickerPickerMenu && !stickerPickerMenu.hidden && stickerPickerMenu.classList.contains("is-open")) {
        closeStickerPicker({ restoreFocus: true });
        return;
    }

    openStickerPicker();
});

stickerUploadBtn?.addEventListener("click", () => {
    stickerUploadInput?.click();
});

stickerUploadInput?.addEventListener("change", async (event) => {
    const selectedFile = event.target?.files?.[0];
    event.target.value = "";
    if (!selectedFile) {
        return;
    }
    await uploadSticker(selectedFile);
});

function handleSelectedImageFile(e) {
    const file = e.target.files?.[0];
    e.target.value = null;
    if (!file) {
        return;
    }

    if (file) {
        if (!file.type.startsWith("image/")) {
            showModal(I18N_TEXT.invalidFileTypeTitle, I18N_TEXT.invalidFileTypeImageBody, "warning");
            return;
        }

        if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
            showModal(I18N_TEXT.fileTooLargeTitle, I18N_TEXT.imageTooLargeBody, "warning");
            return;
        }

        sendImageMessage(file);
    }
}

function handleSelectedVideoFile(e) {
    const file = e.target.files?.[0];
    e.target.value = null;
    if (!file) {
        return;
    }

    const mimeType = String(file.type || "").toLowerCase();
    if (!mimeType.startsWith("video/")) {
        showModal(I18N_TEXT.invalidFileTypeTitle, "Please select a video file.", "warning");
        return;
    }

    if (file.size > FILE_UPLOAD_MAX_BYTES) {
        showModal(I18N_TEXT.fileTooLargeTitle, I18N_TEXT.fileTooLargeBody, "warning");
        return;
    }

    void sendFileMessage(file, { asVideo: true });
}

imageSourceGalleryBtn?.addEventListener("click", () => {
    closeImageSourceMenu();
    imageUploadInput?.click();
});

imageSourceCameraBtn?.addEventListener("click", () => {
    closeImageSourceMenu();
    if (canUseNativeCameraCapture()) {
        imageCaptureInput?.click();
        return;
    }
    if (canUseBrowserCameraCapture()) {
        void openCameraCaptureOverlay();
        return;
    }
    setComposerStatus("Camera capture is not available on this device/browser.", "warning");
});

imageSourceSelectVideoBtn?.addEventListener("click", () => {
    closeImageSourceMenu();
    videoUploadInput?.click();
});

imageSourceRecordVideoBtn?.addEventListener("click", () => {
    closeImageSourceMenu();
    if (canUseNativeCameraCapture()) {
        videoCaptureInput?.click();
        return;
    }
    if (canUseBrowserVideoCapture()) {
        void openVideoCaptureOverlay();
        return;
    }
    setComposerStatus("Video recording is not available on this device/browser.", "warning");
});

imageUploadInput.addEventListener("change", (e) => {
    handleSelectedImageFile(e);
});

imageCaptureInput?.addEventListener("change", (e) => {
    handleSelectedImageFile(e);
});

videoUploadInput?.addEventListener("change", (e) => {
    handleSelectedVideoFile(e);
});

videoCaptureInput?.addEventListener("change", (e) => {
    handleSelectedVideoFile(e);
});

document.addEventListener("click", (event) => {
    if (imageSourceMenu?.hidden) {
    } else if (!event.target.closest("#imageSourceMenu") && !event.target.closest("#imageUploadBtn")) {
        closeImageSourceMenu();
    }

    if (stickerPickerMenu?.hidden) {
        return;
    }
    if (!event.target.closest("#stickerPickerMenu") && !event.target.closest("#stickerPickerBtn")) {
        closeStickerPicker();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && imageSourceMenu && !imageSourceMenu.hidden) {
        closeImageSourceMenu({ restoreFocus: true });
    }
    if (event.key === "Escape" && stickerPickerMenu && !stickerPickerMenu.hidden) {
        closeStickerPicker({ restoreFocus: true });
    }
    if (event.key === "Escape" && cameraCaptureOverlay && !cameraCaptureOverlay.hidden) {
        closeCameraCaptureOverlay();
    }
    if (event.key === "Escape" && videoCaptureOverlay && !videoCaptureOverlay.hidden) {
        stopVideoCaptureRecording({ send: false });
    }
});

cameraCaptureTakeBtn?.addEventListener("click", () => {
    void captureImageFromCameraAndSend();
});

cameraCaptureCancelBtn?.addEventListener("click", closeCameraCaptureOverlay);
cameraCaptureCloseBtn?.addEventListener("click", closeCameraCaptureOverlay);
videoCaptureStartBtn?.addEventListener("click", startVideoCaptureRecording);
videoCaptureStopBtn?.addEventListener("click", () => stopVideoCaptureRecording({ send: true }));
videoCaptureCancelBtn?.addEventListener("click", () => stopVideoCaptureRecording({ send: false }));
videoCaptureCloseBtn?.addEventListener("click", () => stopVideoCaptureRecording({ send: false }));

cameraCaptureOverlay?.addEventListener("click", (event) => {
    if (event.target === cameraCaptureOverlay) {
        closeCameraCaptureOverlay();
    }
});

videoCaptureOverlay?.addEventListener("click", (event) => {
    if (event.target === videoCaptureOverlay) {
        stopVideoCaptureRecording({ send: false });
    }
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

        const groupId = parseGroupIdFromToken(currentChatUser);
        const mediaPayload = await encryptMediaForMessage(
            imageFile,
            {
                file_name: String(imageFile?.name || "image"),
                mime_type: String(imageFile?.type || "image/jpeg"),
                file_size: Number(imageFile?.size || 0),
            },
            groupId > 0 ? { groupId } : { targetUsername: currentChatUser }
        );

        const formData = new FormData();
        if (groupId > 0) {
            formData.append("group_id", String(groupId));
        } else {
            formData.append("target", currentChatUser);
        }
        formData.append("message", mediaPayload.messageForRecipient);
        formData.append("message_for_sender", mediaPayload.messageForSender);
        formData.append("image_file", mediaPayload.encryptedBlob, "image.enc");

        await window.ApiService.jsonOk("api/messages/media/send_image.php", {
            method: "POST",
            headers: getCsrfHeaders(),
            body: formData,
        });

        sendingIndicator.remove();

        if (!isGroupToken(currentChatUser)) {
            addUserToChatList(currentChatUser);
            updateTypingStatus(false);
        }
        loadCurrentChatsRecentMessages();
        setComposerStatus("");
    } catch (err) {
        setComposerStatus("Image upload failed. Try again.", "error");
        showModal(
            I18N_TEXT.imageSendErrorTitle,
            formatI18nText(I18N_TEXT.imageSendErrorBody, { error: err.message || "Unknown" }),
            "error"
        );

        const sendingIndicator = document.querySelector(".sending-indicator");
        if (sendingIndicator) sendingIndicator.remove();
    } finally {
        imageUploadBtn.disabled = false;
    }
}

async function sendFileMessage(file, { asVideo = false } = {}) {
    if (!currentChatUser) {
        showModal(I18N_TEXT.noChatSelectedTitle, I18N_TEXT.noChatSelectedBody, "warning");
        return;
    }

    if (asVideo) {
        const mimeType = String(file?.type || "").toLowerCase();
        if (!mimeType.startsWith("video/")) {
            showModal(I18N_TEXT.invalidFileTypeTitle, "Please select a valid video file.", "warning");
            return;
        }
    }

    if (file.size > FILE_UPLOAD_MAX_BYTES) {
        showModal(I18N_TEXT.fileTooLargeTitle, I18N_TEXT.fileTooLargeBody, "warning");
        return;
    }

    const extension = getFileExtension(file?.name || "");
    if (extension && BLOCKED_ATTACHMENT_EXTENSIONS.has(extension)) {
        showModal(
            I18N_TEXT.invalidFileTypeTitle,
            "This file type is blocked for security reasons.",
            "warning"
        );
        return;
    }

    try {
        const sendingIndicator = document.createElement("div");
        sendingIndicator.className = "message sent sending-indicator";
        sendingIndicator.innerHTML = `
      <div class="file-message-sending">
        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                <span>${asVideo ? "Sending video..." : "Sending file..."}</span>
      </div>
    `;
        chatMessagesElem.appendChild(sendingIndicator);
        chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;

        setTimeout(() => {
            chatMessagesElem.scrollTop = chatMessagesElem.scrollHeight;
        }, 100);

        const groupId = parseGroupIdFromToken(currentChatUser);
        const mediaPayload = await encryptMediaForMessage(
            file,
            {
                file_name: String(file?.name || "file"),
                mime_type: String(file?.type || "application/octet-stream"),
                file_size: Number(file?.size || 0),
            },
            groupId > 0 ? { groupId } : { targetUsername: currentChatUser }
        );

        const formData = new FormData();
        if (groupId > 0) {
            formData.append("group_id", String(groupId));
        } else {
            formData.append("target", currentChatUser);
        }
        formData.append("message", mediaPayload.messageForRecipient);
        formData.append("message_for_sender", mediaPayload.messageForSender);
        formData.append("message_type", asVideo ? "video" : "file");
        formData.append("file", mediaPayload.encryptedBlob, asVideo ? "video.enc" : "file.enc");

        await window.ApiService.jsonOk("api/messages/media/send_file.php", {
            method: "POST",
            headers: getCsrfHeaders(),
            body: formData,
        });

        sendingIndicator.remove();

        if (!isGroupToken(currentChatUser)) {
            addUserToChatList(currentChatUser);
            updateTypingStatus(false);
        }
        loadCurrentChatsRecentMessages();
        setComposerStatus("");
    } catch (err) {
        setComposerStatus(asVideo ? "Video upload failed. Try again." : "File upload failed. Try again.", "error");
        showModal(asVideo ? "Video Send Error" : "File Send Error", (asVideo ? "Video" : "File") + " send error: " + err.message, "error");

        const sendingIndicator = document.querySelector(".sending-indicator");
        if (sendingIndicator) sendingIndicator.remove();
    }
}

// (Changelog / What's New logic moved to changelog.js)
