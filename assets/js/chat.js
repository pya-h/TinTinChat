const chatListElem = document.getElementById("chatList");
const chatMessagesElem = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const stickerPickerBtn = document.getElementById("stickerPickerBtn");
const stickerPickerMenu = document.getElementById("stickerPickerMenu");
const stickerPickerGrid = document.getElementById("stickerPickerGrid");
const stickerPickerState = document.getElementById("stickerPickerState");
const stickerPickerProgress = document.getElementById("stickerPickerProgress");
const stickerPickerProgressFill = document.getElementById(
    "stickerPickerProgressFill",
);
const stickerUploadBtn = document.getElementById("stickerUploadBtn");
const stickerUploadInput = document.getElementById("stickerUploadInput");
const stickerBgChoiceOverlay = document.getElementById(
    "stickerBgChoiceOverlay",
);
const stickerBgChoiceClose = document.getElementById("stickerBgChoiceClose");
const stickerBgChoiceLoading = document.getElementById(
    "stickerBgChoiceLoading",
);
const stickerBgChoiceGrid = document.getElementById("stickerBgChoiceGrid");
const stickerBgKeepBtn = document.getElementById("stickerBgKeepBtn");
const stickerBgRemoveBtn = document.getElementById("stickerBgRemoveBtn");
const stickerBgKeepPreview = document.getElementById("stickerBgKeepPreview");
const stickerBgRemovePreview = document.getElementById(
    "stickerBgRemovePreview",
);
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
const imageSourceSelectVideoBtn = document.getElementById(
    "imageSourceSelectVideoBtn",
);
const imageSourceRecordVideoBtn = document.getElementById(
    "imageSourceRecordVideoBtn",
);
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
const quickConversationSearchBtn = document.getElementById(
    "quickConversationSearchBtn",
);
const settingsPanel = document.getElementById("chatSettingsPanel");
const openUiSettingsBtn = document.getElementById("openUiSettingsBtn");
const settingNotificationSound = document.getElementById(
    "settingNotificationSound",
);
const settingAutoScroll = document.getElementById("settingAutoScroll");
const settingThemeMode = document.getElementById("settingThemeMode");
const settingDensityMode = document.getElementById("settingDensityMode");
const settingFontScale = document.getElementById("settingFontScale");
const settingShowTimestamps = document.getElementById("settingShowTimestamps");
const settingReduceMotion = document.getElementById("settingReduceMotion");
const settingIosLagFix = document.getElementById("settingIosLagFix");
const settingClassicDesign = document.getElementById("settingClassicDesign");
const settingInteractiveMessageSearch = document.getElementById(
    "settingInteractiveMessageSearch",
);
const chatUiSettingsOverlay = document.getElementById("chatUiSettingsOverlay");
const chatUiSettingsClose = document.getElementById("chatUiSettingsClose");
const chatUiSettingsTabGeneral = document.getElementById(
    "chatUiSettingsTabGeneral",
);
const chatUiSettingsTabAccount = document.getElementById(
    "chatUiSettingsTabAccount",
);
const chatUiSettingsTabSessions = document.getElementById(
    "chatUiSettingsTabSessions",
);
const chatUiSettingsTabIdeas = document.getElementById(
    "chatUiSettingsTabIdeas",
);
const chatUiSettingsTabAdmin = document.getElementById(
    "chatUiSettingsTabAdmin",
);
const chatUiSettingsPanelGeneral = document.getElementById(
    "chatUiSettingsPanelGeneral",
);
const chatUiSettingsPanelAccount = document.getElementById(
    "chatUiSettingsPanelAccount",
);
const chatUiSettingsPanelSessions = document.getElementById(
    "chatUiSettingsPanelSessions",
);
const chatUiSettingsPanelIdeas = document.getElementById(
    "chatUiSettingsPanelIdeas",
);
const chatUiSettingsPanelAdmin = document.getElementById(
    "chatUiSettingsPanelAdmin",
);
const settingBrowserNotifications = document.getElementById(
    "settingBrowserNotifications",
);
const settingSendByEnter = document.getElementById("settingSendByEnter");
const settingShowSavedMessages = document.getElementById(
    "settingShowSavedMessages",
);
const settingsGroupKeyHealthBtn = document.getElementById(
    "settingsGroupKeyHealthBtn",
);
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
const openConversationSearchBtn = document.getElementById(
    "openConversationSearchBtn",
);
const openAvatarUploadBtn = document.getElementById("openAvatarUploadBtn");
const settingsAvatarUploadBtn = document.getElementById(
    "settingsAvatarUploadBtn",
);
const settingsAvatarPreview = document.getElementById("settingsAvatarPreview");
const avatarUploadInput = document.getElementById("avatarUploadInput");
const settingsUsernameForm = document.getElementById("settingsUsernameForm");
const settingsCurrentUsername = document.getElementById(
    "settingsCurrentUsername",
);
const settingsUsernameInput = document.getElementById("settingsUsernameInput");
const settingsBioForm = document.getElementById("settingsBioForm");
const settingsBioInput = document.getElementById("settingsBioInput");
const settingsBioCharCount = document.getElementById("settingsBioCharCount");
const settingsPasswordForm = document.getElementById("settingsPasswordForm");
const settingsCurrentPasswordInput = document.getElementById(
    "settingsCurrentPasswordInput",
);
const settingsNewPasswordInput = document.getElementById(
    "settingsNewPasswordInput",
);
const settingsConfirmPasswordInput = document.getElementById(
    "settingsConfirmPasswordInput",
);
/* Blocked users DOM elements moved to chat-admin.js */
const loggedInUsernameElem = document.getElementById("loggedInUsername");
const logoutForm = document.getElementById("logoutForm");
const selectModeBar = document.getElementById("selectModeBar");
const selectModeCount = document.getElementById("selectModeCount");
const selectModeCancelBtn = document.getElementById("selectModeCancelBtn");
const selectModeCopyBtn = document.getElementById("selectModeCopyBtn");
const selectModeForwardBtn = document.getElementById("selectModeForwardBtn");
const selectModeDeleteBtn = document.getElementById("selectModeDeleteBtn");
const pasteClipboardImageBtn = document.getElementById(
    "pasteClipboardImageBtn",
);
const messageActionModalOverlay = document.getElementById(
    "messageActionModalOverlay",
);
const messageActionModalTitle = document.getElementById(
    "messageActionModalTitle",
);
const messageActionModalBody = document.getElementById(
    "messageActionModalBody",
);
const messageActionModalClose = document.getElementById(
    "messageActionModalClose",
);
const messageActionModalAnnouncer = document.getElementById(
    "messageActionModalAnnouncer",
);
const createGroupBtn = document.getElementById("createGroupBtn");
const groupKeyHealthBtn = document.getElementById("groupKeyHealthBtn");
const privateChatInfoPanel = document.getElementById("privateChatInfoPanel");
const privateChatInfoBackBtn = document.getElementById(
    "privateChatInfoBackBtn",
);
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
const groupRotateJoinLinkBtn = document.getElementById(
    "groupRotateJoinLinkBtn",
);
const groupTransferOwnerBtn = document.getElementById("groupTransferOwnerBtn");
const groupLeaveBtn = document.getElementById("groupLeaveBtn");
const chatAreaElem = document.querySelector(".chat-area");
const typingIndicatorElem = document.getElementById("typingIndicator");
const conversationSearchBar = document.getElementById("conversationSearchBar");
const conversationSearchInput = document.getElementById(
    "conversationSearchInput",
);
const conversationSearchCount = document.getElementById(
    "conversationSearchCount",
);
const conversationSearchRunBtn = document.getElementById(
    "conversationSearchRun",
);
const conversationSearchPrevBtn = document.getElementById(
    "conversationSearchPrev",
);
const conversationSearchNextBtn = document.getElementById(
    "conversationSearchNext",
);
const conversationSearchCloseBtn = document.getElementById(
    "conversationSearchClose",
);
const addChatBtn = document.getElementById("addChatBtn");
const addChatModalOverlay = document.getElementById("addChatModalOverlay");
const addChatModalClose = document.getElementById("addChatModalClose");
const addChatSearchInput = document.getElementById("addChatSearchInput");
const addChatResults = document.getElementById("addChatResults");
const addChatEmpty = document.getElementById("addChatEmpty");
const createGroupModalOverlay = document.getElementById(
    "createGroupModalOverlay",
);
const createGroupModalClose = document.getElementById("createGroupModalClose");
const createGroupForm = document.getElementById("createGroupForm");
const createGroupTitleInput = document.getElementById("createGroupTitleInput");
const createGroupDetailsInput = document.getElementById(
    "createGroupDetailsInput",
);
const createGroupSubmitBtn = document.getElementById("createGroupSubmitBtn");
const userInfoBtn = document.getElementById("userInfoBtn");
const userProfileModalOverlay = document.getElementById(
    "userProfileModalOverlay",
);
const userProfileModalClose = document.getElementById("userProfileModalClose");
const userProfileModalBody = document.getElementById("userProfileModalBody");
const avatarViewerOverlay = document.getElementById("avatarViewerOverlay");
const avatarViewerClose = document.getElementById("avatarViewerClose");
const avatarViewerImage = document.getElementById("avatarViewerImage");
const avatarViewerTitle = document.getElementById("avatarViewerTitle");

const appConstants = window.APP_CONSTANTS || {};

const searchSuggestions = document.getElementById("searchSuggestions");
const searchLoading = document.getElementById("searchLoading");
const IMAGE_UPLOAD_MAX_BYTES =
    Number(appConstants.uploadImageMaxBytes) || 20 * 1024 * 1024;
const FILE_UPLOAD_MAX_BYTES =
    Number(appConstants.uploadFileMaxBytes) || 100 * 1024 * 1024;
const AVATAR_UPLOAD_MAX_BYTES =
    Number(appConstants.uploadAvatarMaxBytes) || 5 * 1024 * 1024;
const STICKER_UPLOAD_MAX_BYTES =
    Number(appConstants.uploadStickerMaxBytes) || 512 * 1024;
const SEARCH_MIN_QUERY_LENGTH = Number(appConstants.usernameMinLength) || 3;
const MESSAGE_LONG_PRESS_MS = 500;
const DOUBLE_TAP_MS = 280;
const LONG_PRESS_MOVE_CANCEL_PX = 12;
const SETTINGS_STORAGE_KEY = "tintinchat.settings.v1";
const MOBILE_BREAKPOINT_WIDTH = 767.98;
const CHAT_REFRESH_POLL_MS = Number(appConstants.chatRefreshPollMs) || 1000;
const TYPING_IDLE_TIMEOUT_MS = 3200;
const TYPING_UPDATE_THROTTLE_MS = 3500;
const MESSAGE_EDIT_WINDOW_MS =
    Number(appConstants.messageEditWindowMs) || 12 * 60 * 60 * 1000;
const REACTION_EMOJI_SET = [
    "\u{1F44D}",
    "\u2764\uFE0F",
    "\u{1F602}",
    "\u{1F62E}",
    "\u{1F622}",
    "\u{1F525}",
    "\u{1F420}",
];
const BLOCKED_ATTACHMENT_EXTENSIONS = new Set([
    "php",
    "phtml",
    "php3",
    "php4",
    "php5",
    "phar",
    "exe",
    "msi",
    "bat",
    "cmd",
    "com",
    "scr",
    "sh",
    "bash",
    "zsh",
    "ps1",
    "js",
    "mjs",
    "cjs",
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
    forwardTargetEmpty:
        "No chats available yet. Start a chat first, then try forwarding.",
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
let isBatchRendering = false; // Skip per-message rebuildMessageDaySeparators during batch loads
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
let reactionPickerRepositionRafId = 0;
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
let suppressReactionPickerAutoCloseUntil = 0;
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
let avatarCacheVersion = Date.now();
let activeUserProfile = null;
let lastFocusedElementBeforeUserProfileModal = null;
let stickersCache = [];
let isStickersLoading = false;
let hasLoadedStickers = false;
let snapToBottomRafId = 0;
let snapToBottomTimerIds = [];
let goToLatestRafId = 0;
let viewportAnchorStabilizeRafId = 0;
let retryLastSendAction = null;
let activeSettingsTab = "general";
let currentSelfUsername = String(CURRENT_USER || "");
let isRefreshLoopBusy = false;
let pendingClipboardImageFile = null;
let isChatInputFocused = false;
let lastViewportHeight = window.innerHeight;
let mobileResizeSnapTimerId = 0;
/* Admin state moved to chat-admin.js */

const chatUserIdsByUsername = new Map();

// ── Background upload tracker with progress + concurrency limit ──
const MAX_CONCURRENT_UPLOADS = 2;
const backgroundUploads = new Map();
let bgUploadIdCounter = 0;
const uploadQueue = []; // { resolve, label }
let activeUploadCount = 0;

function createBgUploadIndicator() {
    let container = document.getElementById("bgUploadIndicator");
    if (!container) {
        container = document.createElement("div");
        container.id = "bgUploadIndicator";
        container.className = "bg-upload-indicator";
        container.hidden = true;
        document.body.appendChild(container);
    }
    return container;
}

function formatUploadSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function updateBgUploadIndicator() {
    const container = createBgUploadIndicator();
    if (backgroundUploads.size === 0) {
        container.hidden = true;
        return;
    }
    const entries = [...backgroundUploads.values()];
    const count = entries.length;
    const activeEntries = entries.filter((e) => !e.queued);
    const queuedCount = entries.length - activeEntries.length;
    const label = count > 1 ? count + " files" : entries[0].label;
    // Aggregate progress: average across all uploads (queued ones count as 0%)
    let totalPct = 0;
    let totalLoaded = 0;
    let totalSize = 0;
    let hasByteInfo = false;
    for (const entry of entries) {
        totalPct += entry.progress || 0;
        if (entry.total > 0) {
            totalLoaded += entry.loaded || 0;
            totalSize += entry.total;
            hasByteInfo = true;
        }
    }
    const avgPct = Math.round(totalPct / count);
    const pctText = avgPct > 0 && avgPct < 100 ? ` ${avgPct}%` : "";
    const queueText =
        queuedCount > 0
            ? ` <span class="bg-upload-queued">(${queuedCount} queued)</span>`
            : "";
    const detailText = hasByteInfo
        ? `<span class="bg-upload-detail">${formatUploadSize(totalLoaded)} / ${formatUploadSize(totalSize)}</span>`
        : "";
    container.innerHTML =
        `<div class="bg-upload-content">` +
        `<span class="bg-upload-label">Sending ${label}…${pctText}${queueText}</span>` +
        detailText +
        `<div class="bg-upload-bar"><div class="bg-upload-bar-fill" style="width:${avgPct}%"></div></div>` +
        `</div>`;
    container.hidden = false;
}

function registerBackgroundUpload(label) {
    const id = ++bgUploadIdCounter;
    backgroundUploads.set(id, { label, progress: 0, queued: true });
    updateBgUploadIndicator();
    return id;
}

/**
 * Wait until a concurrency slot is available. Call before starting the actual upload.
 */
function acquireUploadSlot(bgId) {
    const entry = backgroundUploads.get(bgId);
    if (activeUploadCount < MAX_CONCURRENT_UPLOADS) {
        activeUploadCount++;
        if (entry) entry.queued = false;
        updateBgUploadIndicator();
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        uploadQueue.push({ resolve, bgId });
    });
}

function releaseUploadSlot() {
    activeUploadCount = Math.max(0, activeUploadCount - 1);
    if (uploadQueue.length > 0 && activeUploadCount < MAX_CONCURRENT_UPLOADS) {
        const next = uploadQueue.shift();
        activeUploadCount++;
        const entry = backgroundUploads.get(next.bgId);
        if (entry) entry.queued = false;
        updateBgUploadIndicator();
        next.resolve();
    }
}

function updateBackgroundUploadProgress(id, percent, loaded, total) {
    const entry = backgroundUploads.get(id);
    if (entry) {
        entry.progress = Math.min(100, Math.max(0, percent));
        if (loaded !== undefined && total !== undefined) {
            entry.loaded = loaded;
            entry.total = total;
        }
        updateBgUploadIndicator();
    }
}

function completeBackgroundUpload(id) {
    backgroundUploads.delete(id);
    releaseUploadSlot();
    updateBgUploadIndicator();
}

/**
 * Upload FormData via XHR with progress tracking.
 * Returns a Promise that resolves with the parsed JSON response.
 */
function uploadWithProgress(url, formData, headers, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        if (headers) {
            for (const [key, value] of Object.entries(headers)) {
                xhr.setRequestHeader(key, value);
            }
        }
        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(
                    Math.round((e.loaded / e.total) * 100),
                    e.loaded,
                    e.total,
                );
            }
        });
        xhr.addEventListener("load", () => {
            let payload = null;
            try {
                payload = xhr.responseText
                    ? JSON.parse(xhr.responseText)
                    : null;
            } catch (_) {
                reject(new Error("Invalid server response"));
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                const msg = window.ApiService.extractErrorMessage(
                    payload,
                    `Request failed (${xhr.status})`,
                );
                reject(new Error(msg));
                return;
            }
            if (payload && payload.status === "error") {
                reject(
                    new Error(window.ApiService.extractErrorMessage(payload)),
                );
                return;
            }
            resolve(payload);
        });
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.addEventListener("abort", () =>
            reject(new Error("Upload cancelled")),
        );
        xhr.send(formData);
    });
}

const appSettings = {
    notificationSoundEnabled: true,
    autoScrollEnabled: true,
    mobileComposerExpanded: false,
    themeMode: "system",
    densityMode: "comfortable",
    animationProfile: "calm",
    fontScale: "md",
    showTimestamps: true,
    reduceMotion: false,
    iosLagFix: false,
    classicDesign: false,
    interactiveMessageSearch: false,
    browserNotificationsEnabled: false,
    sendByEnter: true,
    showSavedMessages: true,
};

const UI_BACK_LAYER_KEYS = {
    avatarViewer: "avatar-viewer",
    userProfile: "user-profile",
    uiSettings: "ui-settings",
    announcements: "announcements",
    opinions: "opinions",
    playlist: "playlist",
    savedInfo: "saved-info",
    privateInfo: "private-info",
    groupInfo: "group-info",
    createGroup: "create-group",
    messageAction: "message-action",
    imageModal: "image-modal",
    addChat: "add-chat",
    mobileDrawer: "mobile-drawer",
};

const uiBackLayerStack = [];
let uiBackLayerCounter = 0;
let isHandlingUiBackPopState = false;

function pushUiBackLayer(key, closeHandler) {
    if (!key || typeof closeHandler !== "function") {
        return;
    }
    const topLayer = uiBackLayerStack[uiBackLayerStack.length - 1];
    if (topLayer?.key === key) {
        return;
    }
    const token = `ttc_ui_${Date.now()}_${++uiBackLayerCounter}`;
    uiBackLayerStack.push({ key, token, closeHandler });
    try {
        const nextState = Object.assign({}, window.history.state || {}, {
            ttcUiBackToken: token,
        });
        window.history.pushState(nextState, document.title);
    } catch (_) {}
}

function removeUiBackLayer(key) {
    let layerIndex = -1;
    for (let index = uiBackLayerStack.length - 1; index >= 0; index--) {
        if (uiBackLayerStack[index]?.key === key) {
            layerIndex = index;
            break;
        }
    }
    if (layerIndex < 0) {
        return false;
    }
    uiBackLayerStack.splice(layerIndex, 1);
    return true;
}

function requestUiLayerClose(key, closeNow) {
    const topLayer = uiBackLayerStack[uiBackLayerStack.length - 1];
    if (!isHandlingUiBackPopState && topLayer?.key === key) {
        window.history.back();
        return true;
    }
    removeUiBackLayer(key);
    closeNow?.();
    return false;
}

window.addEventListener("popstate", () => {
    const topLayer = uiBackLayerStack[uiBackLayerStack.length - 1];
    if (!topLayer) {
        return;
    }
    isHandlingUiBackPopState = true;
    uiBackLayerStack.pop();
    try {
        topLayer.closeHandler({ fromHistory: true });
    } finally {
        window.setTimeout(() => {
            isHandlingUiBackPopState = false;
        }, 0);
    }
});

function isLikelyIOSDevice() {
    const ua = String(navigator.userAgent || "");
    const platform = String(navigator.platform || "");
    const maxTouchPoints = Number(navigator.maxTouchPoints || 0);
    const iOSLikeUa = /iPad|iPhone|iPod/i.test(ua);
    const iPadOSDesktopUa = platform === "MacIntel" && maxTouchPoints > 1;
    return iOSLikeUa || iPadOSDesktopUa;
}

function isIosLagFixEnabled() {
    return Boolean(appSettings.iosLagFix);
}

const selectedMessageIds = new Set();
let isSelectModeActive = false;
let activeEditMessageId = 0;

function syncComposerContextFlags() {
    const root = document.documentElement;
    if (!root) {
        return;
    }
    root.classList.toggle(
        "replying-active",
        Boolean(currentReplyTarget && !activeEditMessageId),
    );
    root.classList.toggle("edit-mode-active", Boolean(activeEditMessageId));
}

function ensureEditModeAllowsTextOnly(actionLabel = "send media") {
    if (!activeEditMessageId) {
        return true;
    }
    const message =
        "Edit mode only supports text updates. Save or cancel your edit first.";
    setComposerStatus(message, "warning");
    showModal("Edit Mode Active", `${message} (${actionLabel})`, "warning");
    return false;
}

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
        return /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF]/.test(
            text,
        );
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

function startsWithRtlScriptChars(text, maxChars = 2) {
    const probe = String(text || "")
        .trim()
        .slice(0, Math.max(1, Number(maxChars) || 2));
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
        probe,
    );
}

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

function buildAvatarImageHtml({
    userId = 0,
    username = "",
    className = "avatar-image",
    size = 96,
} = {}) {
    const encodedUsername = encodeURIComponent(String(username || ""));
    const sourceUrl = buildAvatarUrl({ userId, username, size });
    return `<img class="${className}" src="${sourceUrl}" alt="Avatar" loading="lazy" decoding="async" data-avatar-source="1" data-avatar-user-id="${Number(userId) || 0}" data-avatar-username-uri="${encodedUsername}">`;
}

function refreshVisibleAvatars() {
    const avatarImages = document.querySelectorAll(
        "img[data-avatar-source='1']",
    );
    avatarImages.forEach((img) => {
        const userId = Number(img.getAttribute("data-avatar-user-id") || 0);
        const usernameUri = String(
            img.getAttribute("data-avatar-username-uri") || "",
        );
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

    const response = await window.ApiService.json(
        `api/users/get_profile.php?${params.toString()}`,
    );
    if (!response?.user) {
        throw new Error("User profile data is unavailable");
    }
    return response.user;
}

function closeAvatarViewer({ fromHistory = false } = {}) {
    if (!avatarViewerOverlay) {
        return;
    }
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.avatarViewer, () => {
            closeAvatarViewer({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.avatarViewer);
    avatarViewerOverlay.classList.remove("visible");
    avatarViewerOverlay.setAttribute("aria-hidden", "true");
    setTimeout(() => {
        if (!avatarViewerOverlay.classList.contains("visible")) {
            avatarViewerOverlay.hidden = true;
        }
    }, 200);
}

function openAvatarViewer(profile) {
    if (
        !avatarViewerOverlay ||
        !avatarViewerImage ||
        !avatarViewerTitle ||
        !profile
    ) {
        return;
    }
    avatarViewerImage.src = String(profile.avatar_url || "");
    avatarViewerImage.alt = `${String(profile.username || "User")} avatar`;
    avatarViewerTitle.textContent = String(profile.username || "User");

    avatarViewerOverlay.hidden = false;
    avatarViewerOverlay.setAttribute("aria-hidden", "false");
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.avatarViewer,
        ({ fromHistory = false } = {}) => {
            closeAvatarViewer({ fromHistory });
        },
    );
    requestAnimationFrame(() => {
        avatarViewerOverlay.classList.add("visible");
    });
}

function closeUserProfileModal({ fromHistory = false } = {}) {
    if (!userProfileModalOverlay) {
        return;
    }
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.userProfile, () => {
            closeUserProfileModal({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.userProfile);
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
    }, 500);
}

async function openUserProfileModal({ userId = 0, username = "" } = {}) {
    if (!userProfileModalOverlay || !userProfileModalBody) {
        return;
    }

    lastFocusedElementBeforeUserProfileModal =
        document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
    userProfileModalBody.innerHTML =
        '<div class="chat-inline-state chat-inline-state-info"><span class="chat-inline-state-text">Loading user info...</span></div>';
    userProfileModalOverlay.hidden = false;
    userProfileModalOverlay.setAttribute("aria-hidden", "false");
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.userProfile,
        ({ fromHistory = false } = {}) => {
            closeUserProfileModal({ fromHistory });
        },
    );
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
        const memberSince = escapeHtml(
            formatMemberSinceLabel(profile.member_since),
        );
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
        const showAvatarButton = card.querySelector(
            '[data-user-profile-action="show-avatar"]',
        );
        const sendMessageButton = card.querySelector(
            '[data-user-profile-action="send-message"]',
        );
        const deleteChatButton = card.querySelector(
            '[data-user-profile-action="delete-chat"]',
        );
        const toggleBlockButton = card.querySelector(
            '[data-user-profile-action="toggle-block"]',
        );

        avatarButton?.addEventListener("click", () =>
            openAvatarViewer(profile),
        );
        showAvatarButton?.addEventListener("click", () =>
            openAvatarViewer(profile),
        );
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

            const confirmed = await showConfirmModal(
                "Delete Chat",
                `Delete all direct messages between you and ${String(profile.username || "this user")}? This cannot be undone.`,
                { type: "error", confirmLabel: "Delete" },
            );
            if (!confirmed) {
                return;
            }

            const originalLabel = deleteChatButton.innerHTML;
            deleteChatButton.disabled = true;
            deleteChatButton.innerHTML =
                '<i class="fas fa-spinner fa-spin me-1"></i>Deleting...';
            setComposerStatus("Deleting chat history...", "warning");

            try {
                const response = await window.ApiService.jsonOk(
                    "api/chats/delete.php",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...getCsrfHeaders(),
                        },
                        body: JSON.stringify({
                            target_username: String(profile.username || ""),
                        }),
                    },
                );

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
                        await new Promise((resolve) =>
                            setTimeout(resolve, 120),
                        );
                        waitAttempts += 1;
                    }

                    if (!isLoadingMessages) {
                        await loadMessages(currentChatUser, true, true);
                    } else {
                        setTimeout(async () => {
                            if (
                                currentChatUser ===
                                String(profile.username || "")
                            ) {
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
                    "success",
                );
                setComposerStatus("Chat history deleted", "success");
            } catch (error) {
                deleteChatButton.disabled = false;
                deleteChatButton.innerHTML = originalLabel;
                showModal(
                    "Delete Chat Failed",
                    error?.message || "Unable to delete chat history.",
                    "error",
                );
                setComposerStatus("Unable to delete chat history", "error");
            }
        });

        toggleBlockButton?.addEventListener("click", async () => {
            if (isCurrentUser) {
                return;
            }

            const willBlock = !Boolean(profile.is_blocked_by_me);
            const targetUsername = String(profile.username || "this user");
            const confirmed = await showConfirmModal(
                willBlock ? "Block User" : "Unblock User",
                willBlock
                    ? `Block ${targetUsername}? They will not be able to send messages to you.`
                    : `Unblock ${targetUsername}?`,
                {
                    type: "warning",
                    confirmLabel: willBlock ? "Block" : "Unblock",
                },
            );
            if (!confirmed) {
                return;
            }

            const originalLabel = toggleBlockButton.innerHTML;
            toggleBlockButton.disabled = true;
            toggleBlockButton.innerHTML = `<i class="fas fa-spinner fa-spin me-1"></i>${willBlock ? "Blocking..." : "Unblocking..."}`;

            try {
                const endpoint = willBlock
                    ? "api/users/block.php"
                    : "api/users/unblock.php";
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
                    profile.is_blocked_by_me
                        ? "User Blocked"
                        : "User Unblocked",
                    profile.is_blocked_by_me
                        ? `${targetUsername} can no longer send messages to you.`
                        : `${targetUsername} can send messages to you again.`,
                    "success",
                );
            } catch (error) {
                toggleBlockButton.innerHTML = originalLabel;
                toggleBlockButton.disabled = false;
                showModal(
                    willBlock ? "Block Failed" : "Unblock Failed",
                    error?.message || "Unable to update block status.",
                    "error",
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
    "mp3",
    "wav",
    "ogg",
    "flac",
    "aac",
    "m4a",
    "wma",
    "opus",
    "webm",
    "aiff",
    "alac",
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
                metadata: {
                    mime_type: cached.mimeType,
                    file_name: cached.fileName,
                },
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
        const currentKeyVersion = Number(
            groupKeyVersionCache.get(groupId) || 1,
        );
        if (Number(envelope.kv || 1) !== currentKeyVersion) {
            await getGroupCryptoKey(groupId, true);
        }
    }
    const mediaKey = await resolveMediaAesKey(msg, envelope.k);
    const metadata = await decryptMediaMetadata(envelope.m, mediaKey);

    const endpoint = getMediaEndpointForType(
        String(msg.message_type || "file"),
        messageId,
    );
    const response = await fetch(endpoint);
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("FILE_UNAVAILABLE");
        }
        throw new Error(`Failed to fetch media (${response.status})`);
    }

    const encryptedBytes = new Uint8Array(await response.arrayBuffer());
    const decryptedBytes = await decryptBinaryWithAesKey(
        encryptedBytes,
        mediaKey,
    );
    const mimeType =
        String(metadata?.mime_type || metadata?.mime || "").trim() ||
        "application/octet-stream";
    const fileName = sanitizeAttachmentFileName(
        String(metadata?.file_name || metadata?.name || "").trim(),
        `attachment_${messageId}`,
    );

    const blob = new Blob([decryptedBytes], { type: mimeType });
    const objectUrl = URL.createObjectURL(blob);
    const resource = {
        blob,
        objectUrl,
        metadata: { ...metadata, mime_type: mimeType, file_name: fileName },
    };

    // 4. Store in volatile cache
    decryptedMediaCacheByMessageId.set(messageId, resource);

    // 5. Persist to IDB (fire-and-forget, never block render)
    void saveMediaToCache(messageId, blob, {
        mime_type: mimeType,
        file_name: fileName,
    });

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
        const currentKeyVersion = Number(
            groupKeyVersionCache.get(groupId) || 1,
        );
        if (Number(envelope.kv || 1) !== currentKeyVersion) {
            await getGroupCryptoKey(groupId, true);
        }
    }
    const mediaKey = await resolveMediaAesKey(msg, envelope.k);
    return decryptMediaMetadata(envelope.m, mediaKey);
}

async function encryptMediaForMessage(fileOrBlob, metadata, context = {}) {
    // Read file data first — callers should already pass standalone blobs (bytes
    // already in memory), but this serves as defense-in-depth in case a raw File
    // with a content:// URI somehow gets through.
    const sourceBuffer = await fileOrBlob.arrayBuffer();

    const mediaKey = await generateAesGcmKey();
    const encryptedMetadata = await encryptMediaMetadata(metadata, mediaKey);
    const isGroupMessage = Boolean(context.groupId);

    let recipientEnvelopePayload = "";
    let senderEnvelopePayload = "";
    if (isGroupMessage) {
        const groupKey = await getGroupCryptoKey(Number(context.groupId));
        const keyVersion = Number(
            groupKeyVersionCache.get(Number(context.groupId)) || 1,
        );
        const wrappedForGroup = await wrapMediaKeyForGroup(mediaKey, groupKey);
        recipientEnvelopePayload = buildMediaEnvelopePayload(
            wrappedForGroup,
            encryptedMetadata,
            keyVersion,
        );
        senderEnvelopePayload = recipientEnvelopePayload;
    } else {
        const recipientPublicKey = await getPublicKey(
            String(context.targetUsername || ""),
        );
        const senderPublicKey = await getPublicKey(CURRENT_USER);
        const wrappedForRecipient = await wrapMediaKeyForPublicKey(
            mediaKey,
            recipientPublicKey,
        );
        const wrappedForSender = await wrapMediaKeyForPublicKey(
            mediaKey,
            senderPublicKey,
        );
        recipientEnvelopePayload = buildMediaEnvelopePayload(
            wrappedForRecipient,
            encryptedMetadata,
            1,
        );
        senderEnvelopePayload = buildMediaEnvelopePayload(
            wrappedForSender,
            encryptedMetadata,
            1,
        );
    }
    const encryptedBytes = await encryptBinaryWithAesKey(
        sourceBuffer,
        mediaKey,
    );
    const encryptedBlob = new Blob([encryptedBytes], {
        type: "application/octet-stream",
    });

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
        if (
            shouldStickToBottom &&
            appSettings.autoScrollEnabled &&
            !hasLoadedMoreMessages
        ) {
            scheduleSnapToBottom();
        }
    } catch (error) {
        imageElem.style.display = "none";
        if (loadingElem) {
            loadingElem.textContent =
                error?.message === "FILE_UNAVAILABLE"
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
        if (
            shouldStickToBottom &&
            appSettings.autoScrollEnabled &&
            !hasLoadedMoreMessages
        ) {
            scheduleSnapToBottom();
        }
    } catch (error) {
        videoElem.style.display = "none";
        if (loadingElem) {
            loadingElem.textContent =
                error?.message === "FILE_UNAVAILABLE"
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
        return "You";
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
    } catch (error) {
    } finally {
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
            ? typing.typers
                  .map((item) => String(item || "").trim())
                  .filter(Boolean)
            : [];
        if (!typers.length) {
            setTypingIndicator("");
        } else if (typers.length === 1) {
            setTypingIndicator(`${typers[0]} is typing...`);
        } else if (typers.length === 2) {
            setTypingIndicator(`${typers[0]} and ${typers[1]} are typing...`);
        } else {
            setTypingIndicator(
                `${typers[0]} and ${typers.length - 1} others are typing...`,
            );
        }
    } else {
        setTypingIndicator(
            typing.is_typing ? `${currentChatUser} is typing...` : "",
        );
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
            if (!groupId) {
                setTypingIndicator("");
                return;
            }
            data = await window.ApiService.json(
                `api/typing/fetch.php?group_id=${encodeURIComponent(groupId)}`,
                { cache: "no-store" },
            );
        } else {
            data = await window.ApiService.json(
                `api/typing/fetch.php?with=${encodeURIComponent(currentChatUser)}`,
                { cache: "no-store" },
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
            true,
        );
        appSettings.autoScrollEnabled = parseStoredBoolean(
            parsed.autoScrollEnabled,
            true,
        );
        appSettings.mobileComposerExpanded = parseStoredBoolean(
            parsed.mobileComposerExpanded,
            false,
        );
        appSettings.themeMode = ["system", "light", "dark"].includes(
            parsed.themeMode,
        )
            ? parsed.themeMode
            : "system";
        appSettings.densityMode =
            parsed.densityMode === "compact" ? "compact" : "comfortable";
        appSettings.animationProfile =
            parsed.animationProfile === "playful" ? "playful" : "calm";
        appSettings.fontScale = ["sm", "md", "lg", "xl"].includes(
            parsed.fontScale,
        )
            ? parsed.fontScale
            : "md";
        appSettings.showTimestamps = parseStoredBoolean(
            parsed.showTimestamps,
            true,
        );
        appSettings.reduceMotion = parseStoredBoolean(
            parsed.reduceMotion,
            false,
        );
        appSettings.iosLagFix = parseStoredBoolean(parsed.iosLagFix, false);
        appSettings.interactiveMessageSearch = parseStoredBoolean(
            parsed.interactiveMessageSearch,
            false,
        );
        appSettings.browserNotificationsEnabled = parseStoredBoolean(
            parsed.browserNotificationsEnabled,
            false,
        );
        appSettings.sendByEnter = parseStoredBoolean(parsed.sendByEnter, true);
        appSettings.showSavedMessages = parseStoredBoolean(
            parsed.showSavedMessages,
            true,
        );
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
    root.setAttribute(
        "data-anim-profile",
        appSettings.animationProfile === "playful" ? "playful" : "calm",
    );
    root.setAttribute("data-font-scale", appSettings.fontScale);
    root.classList.toggle(
        "reduced-motion-enabled",
        Boolean(appSettings.reduceMotion),
    );
    root.classList.toggle("ios-lag-fix-enabled", isIosLagFixEnabled());
    root.classList.toggle(
        "classic-design-enabled",
        Boolean(appSettings.classicDesign) && isIosLagFixEnabled(),
    );
    window.__TTC_IOS_LAG_FIX_ENABLED__ = isIosLagFixEnabled();
    chatMessagesElem?.classList.toggle(
        "hide-message-timestamps",
        !Boolean(appSettings.showTimestamps),
    );
}

/**
 * Synchronise the disabled/checked state of Classic Design and Reduce Motion
 * checkboxes based on the current Performance mode and Classic Design values.
 *
 *  Normal mode → Classic Design: OFF + locked;  Reduce Motion: unlocked
 *  Perf mode   → Classic Design: unlocked;      Reduce Motion: unlocked
 *  Classic ON  → Reduce Motion: forced ON + locked
 */
function syncPerfModeOptionStates() {
    const perfOn = isIosLagFixEnabled();
    const classicOn = perfOn && appSettings.classicDesign;

    // Classic Design: only changeable when performance mode is on
    if (settingClassicDesign) {
        settingClassicDesign.disabled = !perfOn;
        if (!perfOn) {
            appSettings.classicDesign = false;
            settingClassicDesign.checked = false;
        } else {
            settingClassicDesign.checked = appSettings.classicDesign;
        }
    }

    // Reduce Motion: locked ON when classic design is active
    if (settingReduceMotion) {
        settingReduceMotion.disabled = classicOn;
        if (classicOn) {
            appSettings.reduceMotion = true;
        }
        settingReduceMotion.checked = appSettings.reduceMotion;
    }
}

function setComposerAnimationProfile(profile = "calm") {
    appSettings.animationProfile = profile === "playful" ? "playful" : "calm";
    persistAppSettings();
    applyUiPreferenceClasses();
    return appSettings.animationProfile;
}

window.setComposerAnimationProfile = setComposerAnimationProfile;
window.getComposerAnimationProfile = () => appSettings.animationProfile;

function applySettingsTabUi(tabName = "general") {
    let normalizedTab = "general";
    if (tabName === "account") {
        normalizedTab = "account";
    } else if (
        tabName === "sessions" &&
        chatUiSettingsTabSessions &&
        chatUiSettingsPanelSessions
    ) {
        normalizedTab = "sessions";
    } else if (
        tabName === "ideas" &&
        chatUiSettingsTabIdeas &&
        chatUiSettingsPanelIdeas
    ) {
        normalizedTab = "ideas";
    } else if (
        tabName === "admin" &&
        chatUiSettingsTabAdmin &&
        chatUiSettingsPanelAdmin
    ) {
        normalizedTab = "admin";
    }

    const isGeneral = normalizedTab === "general";
    const isAccount = normalizedTab === "account";
    const isSessions = normalizedTab === "sessions";
    const isIdeas = normalizedTab === "ideas";
    const isAdmin = normalizedTab === "admin";
    activeSettingsTab = normalizedTab;

    chatUiSettingsTabGeneral?.classList.toggle("is-active", isGeneral);
    chatUiSettingsTabGeneral?.setAttribute(
        "aria-selected",
        isGeneral ? "true" : "false",
    );
    if (chatUiSettingsPanelGeneral) {
        chatUiSettingsPanelGeneral.hidden = !isGeneral;
    }

    chatUiSettingsTabAccount?.classList.toggle("is-active", isAccount);
    chatUiSettingsTabAccount?.setAttribute(
        "aria-selected",
        isAccount ? "true" : "false",
    );
    if (chatUiSettingsPanelAccount) {
        chatUiSettingsPanelAccount.hidden = !isAccount;
    }

    chatUiSettingsTabSessions?.classList.toggle("is-active", isSessions);
    chatUiSettingsTabSessions?.setAttribute(
        "aria-selected",
        isSessions ? "true" : "false",
    );
    if (chatUiSettingsPanelSessions) {
        chatUiSettingsPanelSessions.hidden = !isSessions;
    }

    chatUiSettingsTabIdeas?.classList.toggle("is-active", isIdeas);
    chatUiSettingsTabIdeas?.setAttribute(
        "aria-selected",
        isIdeas ? "true" : "false",
    );
    if (chatUiSettingsPanelIdeas) {
        chatUiSettingsPanelIdeas.hidden = !isIdeas;
    }

    chatUiSettingsTabAdmin?.classList.toggle("is-active", isAdmin);
    chatUiSettingsTabAdmin?.setAttribute(
        "aria-selected",
        isAdmin ? "true" : "false",
    );
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
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.uiSettings,
        ({ fromHistory = false } = {}) => {
            closeUiSettingsModal({ restoreFocus: true, fromHistory });
        },
    );
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

function closeUiSettingsModal({
    restoreFocus = true,
    fromHistory = false,
} = {}) {
    if (!chatUiSettingsOverlay) {
        return;
    }
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.uiSettings, () => {
            closeUiSettingsModal({ restoreFocus, fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.uiSettings);
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

/* ── Announcements Panel → chat-announcements.js ──
 * fetchAnnouncements, formatAnnouncementTime, isAnnouncementNew,
 * hasPersianChar, renderAnnouncementsPanel, openAnnouncementsPanel,
 * closeAnnouncementsPanel, setAnnouncementUnreadState,
 * checkAnnouncementUnread */

/* ── Opinions Panel → chat-opinions.js ──
 * openOpinionsPanel, closeOpinionsPanel, renderOpinionsUserList,
 * openOpinionsForUser, renderOpinionsDetailList */

/* ── Playlist (server-backed) ── */

let playlistCache = null;

function normalizeApiPlaylistItem(item) {
    const msgId = Number(item?.message_id || 0);
    if (!msgId) return null;
    return {
        msgId,
        chatTarget: String(item?.chat_target || ""),
        title: String(item?.title || "Unknown"),
        ext: String(item?.ext || ""),
        addedAt: String(item?.added_at || ""),
        meta: {
            id: msgId,
            file_path: item?.file_path || "",
            message: item?.message || "",
            message_for_sender: item?.message_for_sender || "",
            sender_id: Number(item?.sender_id || 0),
            receiver_id: Number(item?.receiver_id || 0),
            group_id: Number(item?.group_id || 0),
            message_type: item?.message_type || "file",
            file_purged_at: item?.file_purged_at || null,
        },
    };
}

async function fetchPlaylist() {
    try {
        const res = await window.ApiService.jsonOk("api/playlist/list.php");
        const items = (res?.items || [])
            .map(normalizeApiPlaylistItem)
            .filter(Boolean);
        playlistCache = items;
        // Populate messageMetaById for decryption/playback
        for (const t of items) {
            if (t.meta) messageMetaById.set(t.msgId, t.meta);
        }
        return items;
    } catch {
        return playlistCache || [];
    }
}

function getPlaylist() {
    return playlistCache || [];
}

async function addToPlaylist(msgId, title, ext) {
    const list = getPlaylist();
    if (list.some((t) => t.msgId === Number(msgId))) {
        setComposerStatus("Already in playlist", "warning");
        return;
    }
    if (list.length >= 200) {
        setComposerStatus("Playlist full (200 tracks max)", "warning");
        return;
    }
    try {
        await window.ApiService.jsonOk("api/playlist/add.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getCsrfHeaders(),
            },
            body: JSON.stringify({
                message_id: Number(msgId),
                title: String(title || ""),
                ext: String(ext || ""),
            }),
        });
        await fetchPlaylist();
        setComposerStatus("Added to playlist", "success");
    } catch (error) {
        setComposerStatus(
            error?.message || "Failed to add to playlist",
            "error",
        );
    }
}

async function removeFromPlaylist(msgId) {
    try {
        await window.ApiService.jsonOk("api/playlist/remove.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getCsrfHeaders(),
            },
            body: JSON.stringify({ message_id: Number(msgId) }),
        });
        if (playlistCache) {
            playlistCache = playlistCache.filter(
                (t) => t.msgId !== Number(msgId),
            );
        }
    } catch {
        /* best-effort */
    }
}

function renderPlaylistPanel() {
    if (!playlistBody) return;
    const list = getPlaylist();
    playlistBody.innerHTML = "";
    if (!list.length) {
        playlistBody.innerHTML =
            '<div class="playlist-empty"><i class="fas fa-music me-2"></i>No tracks yet. Add music from context menu.</div>';
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
        removeEl?.addEventListener("click", async () => {
            await removeFromPlaylist(track.msgId);
            renderPlaylistPanel();
        });
        playlistBody.appendChild(item);
    });
}

let playlistAudio = null;
let playlistCurrentBtn = null;

async function playPlaylistTrack(track, btnEl) {
    // If same track is playing, toggle pause
    if (
        playlistAudio &&
        playlistCurrentBtn === btnEl &&
        !playlistAudio.paused
    ) {
        playlistAudio.pause();
        btnEl.innerHTML = '<i class="fas fa-play"></i>';
        btnEl.classList.remove("playing");
        return;
    }
    // Stop all other audio sources
    stopAllAudio();

    btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        if (!track.meta)
            throw new Error("Track metadata missing — re-add from chat");

        const freshMeta = messageMetaById.get(
            Number(track.meta?.id || track.msgId || 0),
        );
        if (
            (freshMeta && freshMeta.file_purged_at) ||
            track.meta.file_purged_at
        ) {
            throw new Error("FILE_UNAVAILABLE");
        }

        const mediaResource = await getDecryptedMediaResource(track.meta);

        if (!audioContext) {
            audioContext = new (
                window.AudioContext || window.webkitAudioContext
            )();
        }
        if (audioContext.state === "suspended") audioContext.resume();

        playlistAudio = new Audio(mediaResource.objectUrl);
        playlistCurrentBtn = btnEl;

        playlistAudio.addEventListener("ended", function () {
            if (this._stopped) return;
            btnEl.innerHTML = '<i class="fas fa-play"></i>';
            btnEl.classList.remove("playing");
            playlistCurrentBtn = null;
            // Auto-play next track
            autoPlayNextTrack(track);
        });

        playlistAudio.addEventListener("error", function () {
            if (this._stopped) return;
            btnEl.innerHTML = '<i class="fas fa-play"></i>';
            btnEl.classList.remove("playing");
            showModal("Playback Error", "Unable to play this track.", "error");
        });

        await playlistAudio.play();
        btnEl.innerHTML = '<i class="fas fa-pause"></i>';
        btnEl.classList.add("playing");
        showGlobalNowPlaying(
            playlistAudio,
            track.title || "Playlist track",
            "music",
        );
    } catch (error) {
        btnEl.innerHTML = '<i class="fas fa-play"></i>';
        if (error?.message === "FILE_UNAVAILABLE") {
            setComposerStatus(
                `"${track.title || "Track"}" — file expired, skipping...`,
                "warning",
            );
            autoPlayNextTrack(track);
        } else {
            showModal(
                "Playback Error",
                error?.message || "Unable to play track.",
                "error",
            );
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

async function openPlaylistPanel() {
    if (!playlistOverlay) return;
    await fetchPlaylist();
    renderPlaylistPanel();
    playlistOverlay.hidden = false;
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.playlist,
        ({ fromHistory = false } = {}) => {
            closePlaylistPanel({ fromHistory });
        },
    );
    requestAnimationFrame(() => playlistOverlay.classList.add("visible"));
}

function closePlaylistPanel({ fromHistory = false } = {}) {
    if (!playlistOverlay) return;
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.playlist, () => {
            closePlaylistPanel({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.playlist);
    playlistOverlay.classList.remove("visible");
    setTimeout(() => {
        if (!playlistOverlay.classList.contains("visible")) {
            playlistOverlay.hidden = true;
        }
    }, 250);
}

/* ── Saved Messages Info Panel ── */
const savedMessagesInfoPanel = document.getElementById(
    "savedMessagesInfoPanel",
);
const savedInfoBackBtn = document.getElementById("savedInfoBackBtn");
const savedPlaylistBody = document.getElementById("savedPlaylistBody");
const savedNowPlaying = document.getElementById("savedNowPlaying");
const nowPlayingTitle = document.getElementById("nowPlayingTitle");
const nowPlayingToggle = document.getElementById("nowPlayingToggle");
const nowPlayingPrev = document.getElementById("nowPlayingPrev");
const nowPlayingNext = document.getElementById("nowPlayingNext");
const nowPlayingProgressWrap = document.getElementById(
    "nowPlayingProgressWrap",
);
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
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.savedInfo,
        ({ fromHistory = false } = {}) => {
            closeSavedMessagesInfoPanel({ fromHistory });
        },
    );
    chatAreaElem?.classList.add("saved-panel-open");
    void loadSavedMessagesStats();
    fetchPlaylist().then(() => renderSavedPlaylistPanel());
    savedInfoBackBtn?.addEventListener("click", closeSavedMessagesInfoPanel);
}

function closeSavedMessagesInfoPanel({ fromHistory = false } = {}) {
    if (!savedMessagesInfoPanel || savedMessagesInfoPanel.hidden) return;
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.savedInfo, () => {
            closeSavedMessagesInfoPanel({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.savedInfo);
    let done = false;
    const finish = () => {
        if (done) return;
        done = true;
        savedMessagesInfoPanel.classList.remove("panel-closing");
        savedMessagesInfoPanel.hidden = true;
        chatAreaElem?.classList.remove("saved-panel-open");
    };
    savedMessagesInfoPanel.classList.add("panel-closing");
    savedMessagesInfoPanel.addEventListener("animationend", finish, {
        once: true,
    });
    setTimeout(finish, 350);
}

function toggleSavedMessagesInfoPanel() {
    if (savedMessagesInfoPanel && !savedMessagesInfoPanel.hidden) {
        closeSavedMessagesInfoPanel();
    } else {
        openSavedMessagesInfoPanel();
    }
}

// ── Private Chat Info Panel ──────────────────────────────────
function closePrivateChatInfoPanel({ fromHistory = false } = {}) {
    if (!privateChatInfoPanel || privateChatInfoPanel.hidden) return;
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.privateInfo, () => {
            closePrivateChatInfoPanel({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.privateInfo);
    resetPrivateOpinionForm();
    let done = false;
    const finish = () => {
        if (done) return;
        done = true;
        privateChatInfoPanel.classList.remove("panel-closing");
        privateChatInfoPanel.hidden = true;
        chatAreaElem?.classList.remove("private-panel-open");
    };
    privateChatInfoPanel.classList.add("panel-closing");
    privateChatInfoPanel.addEventListener("animationend", finish, {
        once: true,
    });
    setTimeout(finish, 350);
}

function resetPrivateOpinionForm() {
    const formWrap = document.getElementById("privateOpinionFormWrap");
    const input = document.getElementById("privateOpinionInput");
    const cc = document.getElementById("privateOpinionCharCount");
    if (formWrap) formWrap.hidden = true;
    if (input) input.value = "";
    if (cc) cc.textContent = "0";
    privateOpinionEditingId = 0;
}

async function openPrivateChatInfoPanel() {
    if (!privateChatInfoPanel) return;
    resetPrivateOpinionForm();
    privateChatInfoPanel.hidden = false;
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.privateInfo,
        ({ fromHistory = false } = {}) => {
            closePrivateChatInfoPanel({ fromHistory });
        },
    );
    chatAreaElem?.classList.add("private-panel-open");

    const userId = Number(chatUserIdsByUsername.get(currentChatUser) || 0);
    try {
        const profile = await fetchUserProfile({
            userId,
            username: currentChatUser,
        });
        const el = (id) => document.getElementById(id);
        el("privateChatAvatarImg") &&
            (el("privateChatAvatarImg").src = profile.avatar_url || "");
        el("privateChatUsername") &&
            (el("privateChatUsername").textContent = profile.username || "");
        el("privateChatIdent") &&
            (el("privateChatIdent").textContent = profile.public_ident || "");
        el("privateChatBio") &&
            (el("privateChatBio").textContent = profile.bio || "");
        el("privateChatSince") &&
            (el("privateChatSince").textContent = profile.member_since
                ? "Member since " + formatMemberSinceLabel(profile.member_since)
                : "");

        const avatarBtn = document.getElementById("privateChatAvatarBtn");
        avatarBtn?.replaceWith(avatarBtn.cloneNode(true));
        document
            .getElementById("privateChatAvatarBtn")
            ?.addEventListener("click", () => openAvatarViewer(profile));

        setupPrivateChatActions(profile);
    } catch {
        /* ignore profile load error */
    }

    void loadPrivateChatStats();
    loadPrivateChatMusicMessages(true);
    loadPrivateChatOpinion();
}

function setupPrivateChatActions(profile) {
    const blockBtn = document.getElementById("privateChatBlockBtn");
    const deleteBtn = document.getElementById("privateChatDeleteBtn");
    const isCurrentUser = Boolean(profile.is_current_user);
    let isBlocked = Boolean(profile.is_blocked_by_me);

    if (blockBtn) {
        blockBtn.disabled = isCurrentUser;
        blockBtn.querySelector("span").textContent = isBlocked
            ? "Unblock User"
            : "Block User";
        blockBtn.querySelector("i").className = isBlocked
            ? "fas fa-user-check"
            : "fas fa-user-slash";
        if (isBlocked) {
            blockBtn.classList.remove("private-action-block");
            blockBtn.classList.add("private-action-unblock");
        } else {
            blockBtn.classList.remove("private-action-unblock");
            blockBtn.classList.add("private-action-block");
        }
        const freshBtn = blockBtn.cloneNode(true);
        blockBtn.replaceWith(freshBtn);
        if (!isCurrentUser) {
            freshBtn.addEventListener("click", async () => {
                const willBlock = !isBlocked;
                const targetName = String(profile.username || "this user");
                const confirmed = await showConfirmModal(
                    willBlock ? "Block User" : "Unblock User",
                    willBlock
                        ? `Block ${targetName}? They will not be able to send messages to you.`
                        : `Unblock ${targetName}?`,
                    {
                        type: "warning",
                        confirmLabel: willBlock ? "Block" : "Unblock",
                    },
                );
                if (!confirmed) return;

                freshBtn.disabled = true;
                freshBtn.querySelector("span").textContent = willBlock
                    ? "Blocking..."
                    : "Unblocking...";
                try {
                    const endpoint = willBlock
                        ? "api/users/block.php"
                        : "api/users/unblock.php";
                    const res = await window.ApiService.jsonOk(endpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...getCsrfHeaders(),
                        },
                        body: JSON.stringify({
                            target_user_id: Number(profile.user_id || 0),
                        }),
                    });
                    isBlocked = Boolean(res?.is_blocked);
                    profile.is_blocked_by_me = isBlocked;
                    freshBtn.querySelector("span").textContent = isBlocked
                        ? "Unblock User"
                        : "Block User";
                    freshBtn.querySelector("i").className = isBlocked
                        ? "fas fa-user-check"
                        : "fas fa-user-slash";
                    if (isBlocked) {
                        freshBtn.classList.remove("private-action-block");
                        freshBtn.classList.add("private-action-unblock");
                    } else {
                        freshBtn.classList.remove("private-action-unblock");
                        freshBtn.classList.add("private-action-block");
                    }
                    freshBtn.disabled = false;
                    showModal(
                        isBlocked ? "User Blocked" : "User Unblocked",
                        isBlocked
                            ? `${targetName} can no longer send messages to you.`
                            : `${targetName} can send messages to you again.`,
                        "success",
                    );
                } catch (error) {
                    freshBtn.disabled = false;
                    freshBtn.querySelector("span").textContent = isBlocked
                        ? "Unblock User"
                        : "Block User";
                    showModal(
                        "Error",
                        error?.message || "Unable to update block status.",
                        "error",
                    );
                }
            });
        }
    }

    if (deleteBtn) {
        deleteBtn.disabled = isCurrentUser;
        const freshDel = deleteBtn.cloneNode(true);
        deleteBtn.replaceWith(freshDel);
        if (!isCurrentUser) {
            freshDel.addEventListener("click", async () => {
                const targetName = String(profile.username || "this user");
                const confirmed = await showConfirmModal(
                    "Delete Chat",
                    `Delete all direct messages between you and ${targetName}? This cannot be undone.`,
                    { type: "error", confirmLabel: "Delete" },
                );
                if (!confirmed) return;

                freshDel.disabled = true;
                freshDel.querySelector("span").textContent = "Deleting...";
                try {
                    const response = await window.ApiService.jsonOk(
                        "api/chats/delete.php",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                ...getCsrfHeaders(),
                            },
                            body: JSON.stringify({
                                target_username: String(profile.username || ""),
                            }),
                        },
                    );
                    const deletedMessages = Number(
                        response?.messages_deleted || 0,
                    );
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
                            await new Promise((r) => setTimeout(r, 120));
                            waitAttempts++;
                        }
                        if (!isLoadingMessages) {
                            await loadMessages(currentChatUser, true, true);
                        }
                    }
                    await loadChatList(true);
                    closePrivateChatInfoPanel();
                    showModal(
                        "Chat Deleted",
                        `Deleted ${deletedMessages} messages${deletedFiles > 0 ? ` and ${deletedFiles} files` : ""}.`,
                        "success",
                    );
                } catch (error) {
                    freshDel.disabled = false;
                    freshDel.querySelector("span").textContent = "Delete Chat";
                    showModal(
                        "Delete Chat Failed",
                        error?.message || "Unable to delete chat history.",
                        "error",
                    );
                }
            });
        }
    }
}

function togglePrivateChatInfoPanel() {
    if (privateChatInfoPanel && !privateChatInfoPanel.hidden) {
        closePrivateChatInfoPanel();
    } else {
        openPrivateChatInfoPanel();
    }
}

const DETAILS_MUSIC_PAGE_SIZE = 10;
const DETAILS_MUSIC_SCAN_BATCH_SIZE = 40;
const detailsMusicPanelState = new Map();

function buildChatTargetQueryParams(chatTarget) {
    const params = new URLSearchParams();
    const groupId = parseGroupIdFromToken(chatTarget);
    if (groupId > 0) {
        params.set("group_id", String(groupId));
    } else {
        params.set("with", String(chatTarget || CURRENT_USER));
    }
    return params;
}

function setStatsUiByIdMap(stats, ids) {
    const normalized = {
        total: Number(stats?.total || 0),
        text: Number(stats?.text || 0),
        voice: Number(stats?.voice || 0),
        image: Number(stats?.image || 0),
        video: Number(stats?.video || 0),
        file: Number(stats?.file || 0),
        sticker: Number(stats?.sticker || 0),
    };
    Object.entries(ids).forEach(([key, elementId]) => {
        const target = document.getElementById(elementId);
        if (target) {
            target.textContent = String(normalized[key] || 0);
        }
    });
}

async function fetchConversationStats(chatTarget) {
    const params = buildChatTargetQueryParams(chatTarget);
    const data = await window.ApiService.jsonOk(
        `api/messages/stats.php?${params.toString()}`,
    );
    return data?.stats || {};
}

async function loadPrivateChatStats() {
    try {
        const stats = await fetchConversationStats(currentChatUser);
        setStatsUiByIdMap(stats, {
            total: "pvStatTotal",
            text: "pvStatText",
            voice: "pvStatVoice",
            image: "pvStatImage",
            video: "pvStatVideo",
            file: "pvStatFile",
            sticker: "pvStatSticker",
        });
    } catch (_) {}
}

async function loadGroupChatStats() {
    try {
        const stats = await fetchConversationStats(currentChatUser);
        setStatsUiByIdMap(stats, {
            total: "groupStatTotal",
            text: "groupStatText",
            voice: "groupStatVoice",
            image: "groupStatImage",
            video: "groupStatVideo",
            file: "groupStatFile",
            sticker: "groupStatSticker",
        });
    } catch (_) {}
}

let privateMusicAudio = null;
let privateMusicCurrentBtn = null;

function stopPrivateMusicAudio() {
    if (privateMusicAudio) {
        privateMusicAudio._stopped = true;
        privateMusicAudio.pause();
        privateMusicAudio = null;
    }
    if (privateMusicCurrentBtn) {
        privateMusicCurrentBtn.innerHTML = '<i class="fas fa-play"></i>';
        privateMusicCurrentBtn = null;
    }
}

function stopAllAudio() {
    // Stop private music panel audio
    stopPrivateMusicAudio();
    // Stop playlist panel audio
    if (playlistAudio) {
        playlistAudio._stopped = true;
        playlistAudio.pause();
        if (playlistCurrentBtn) {
            playlistCurrentBtn.innerHTML = '<i class="fas fa-play"></i>';
            playlistCurrentBtn.classList.remove("playing");
        }
        playlistAudio = null;
        playlistCurrentBtn = null;
    }
    // Stop saved panel audio
    if (typeof stopSavedPanelAudio === "function") stopSavedPanelAudio();
    // Stop all in-chat voice and music players
    document
        .querySelectorAll(".voice-play-btn.playing, .music-play-btn.playing")
        .forEach((btn) => {
            const otherAudio = btn.closest(".message")?.querySelector("audio");
            if (otherAudio && !otherAudio.paused) otherAudio.pause();
            btn.classList.remove("playing");
            btn.innerHTML = '<i class="fas fa-play"></i>';
            btn.closest(".voice-player-container")?.classList.remove(
                "is-playing",
            );
            btn.closest(".music-player-container")?.classList.remove(
                "is-playing",
            );
        });
    // Hide global now playing bar
    hideGlobalNowPlaying();
}

async function fetchConversationMusicChunk(
    chatTarget,
    offset = 0,
    limit = DETAILS_MUSIC_SCAN_BATCH_SIZE,
) {
    const params = buildChatTargetQueryParams(chatTarget);
    params.set("offset", String(Math.max(0, Number(offset) || 0)));
    params.set(
        "limit",
        String(Math.max(1, Number(limit) || DETAILS_MUSIC_SCAN_BATCH_SIZE)),
    );
    return window.ApiService.jsonOk(
        `api/messages/music_list.php?${params.toString()}`,
    );
}

async function buildMusicTrackFromMessage(messageRow, chatTarget = "") {
    const msg =
        messageRow && typeof messageRow === "object" ? messageRow : null;
    if (!msg || Number(msg.id || 0) <= 0) {
        return null;
    }

    let metadata = null;
    try {
        metadata = await getDecryptedMediaMetadata(msg);
    } catch (_) {
        return null;
    }

    const fileName = sanitizeAttachmentFileName(
        String(metadata?.file_name || metadata?.name || "").trim(),
        `audio_${msg.id}`,
    );
    if (!isAudioFileName(fileName)) {
        return null;
    }

    const ext = getFileExtension(fileName).toUpperCase();
    const title = fileName.replace(/\.[^.]+$/, "") || fileName;
    const senderLabel =
        Number(msg.sender_id || 0) === Number(CURRENT_USER_ID)
            ? "Sent"
            : msg.sender_username
              ? `From ${String(msg.sender_username)}`
              : "Received";

    return {
        id: Number(msg.id),
        title,
        ext,
        chatTarget: String(chatTarget || ""),
        senderLabel,
        isPurged: Boolean(msg.file_purged_at),
        message: msg,
    };
}

function closeDetailsMusicContextMenu({ restoreFocus = true } = {}) {
    const existing = document.getElementById("detailsMusicContextMenu");
    if (!existing) {
        return;
    }
    const anchor = existing.__anchorElement || null;
    existing.remove();
    if (restoreFocus && anchor && typeof anchor.focus === "function") {
        anchor.focus();
    }
}

function normalizeMusicContextTrack(rawTrack) {
    if (!rawTrack || typeof rawTrack !== "object") {
        return null;
    }
    const messageId = Number(
        rawTrack.id ||
            rawTrack.msgId ||
            rawTrack?.message?.id ||
            rawTrack?.meta?.id ||
            0,
    );
    if (messageId <= 0) {
        return null;
    }
    const ext = String(rawTrack.ext || "").trim();
    const messageMeta =
        rawTrack.message && typeof rawTrack.message === "object"
            ? rawTrack.message
            : rawTrack.meta && typeof rawTrack.meta === "object"
              ? Object.assign({ id: messageId }, rawTrack.meta)
              : null;
    return {
        id: messageId,
        title: String(rawTrack.title || "Unknown"),
        ext,
        chatTarget: String(rawTrack.chatTarget || currentChatUser || ""),
        message: messageMeta,
    };
}

async function addMusicTrackToPlaylistFromContext(rawTrack) {
    const track = normalizeMusicContextTrack(rawTrack);
    if (!track) {
        setComposerStatus("Track metadata unavailable.", "warning");
        return;
    }
    if (track.message && typeof track.message === "object") {
        messageMetaById.set(track.id, track.message);
    }
    await addToPlaylist(track.id, track.title, track.ext);
}

async function removeMusicTrackFromPlaylistFromContext(rawTrack) {
    const track = normalizeMusicContextTrack(rawTrack);
    if (!track) {
        setComposerStatus("Track metadata unavailable.", "warning");
        return;
    }

    const list = getPlaylist();
    const removeIdx = list.findIndex(
        (entry) => Number(entry.msgId || 0) === track.id,
    );
    if (removeIdx < 0) {
        setComposerStatus("Track is not in your playlist.", "info");
        return;
    }

    await removeFromPlaylist(track.id);
    if (savedPanelCurrentTrackIdx === removeIdx) {
        stopSavedPanelAudio();
    } else if (savedPanelCurrentTrackIdx > removeIdx) {
        savedPanelCurrentTrackIdx--;
    }
    renderSavedPlaylistPanel();
}

async function goToMusicTrackMessage(rawTrack) {
    const track = normalizeMusicContextTrack(rawTrack);
    if (!track) {
        setComposerStatus("Track message not found.", "warning");
        return;
    }

    if (track.chatTarget && track.chatTarget !== currentChatUser) {
        await selectChatTarget(track.chatTarget);
    }

    let didRequestPanelClose = false;
    try {
        if (savedMessagesInfoPanel && !savedMessagesInfoPanel.hidden) {
            didRequestPanelClose = true;
        }
        if (privateChatInfoPanel && !privateChatInfoPanel.hidden) {
            didRequestPanelClose = true;
        }
        if (groupInfoPanel && !groupInfoPanel.hidden) {
            didRequestPanelClose = true;
        }
        closeSavedMessagesInfoPanel();
        closePrivateChatInfoPanel();
        closeGroupInfoPanel();
    } catch (_) {}

    if (didRequestPanelClose) {
        await new Promise((resolve) => setTimeout(resolve, 380));
    }

    await scrollToReplyTarget(track.id);
}

function openDetailsMusicContextMenu(
    rawTrack,
    { x = 0, y = 0, anchorElement = null, mode = "details" } = {},
) {
    const track = normalizeMusicContextTrack(rawTrack);
    if (!track) {
        return;
    }

    closeMessageContextMenu();
    closeDetailsMusicContextMenu({ restoreFocus: false });

    const menu = document.createElement("div");
    menu.id = "detailsMusicContextMenu";
    menu.className = "message-context-menu";
    menu.setAttribute("role", "menu");
    menu.__anchorElement = anchorElement || null;

    const playlistBtn = document.createElement("button");
    playlistBtn.type = "button";
    playlistBtn.className = "message-context-menu-item";
    if (mode === "playlist") {
        playlistBtn.innerHTML =
            '<i class="fas fa-trash-alt me-2"></i>Remove from Playlist';
        playlistBtn.addEventListener("click", () => {
            removeMusicTrackFromPlaylistFromContext(track);
            closeDetailsMusicContextMenu();
        });
    } else {
        playlistBtn.innerHTML =
            '<i class="fas fa-list-ul me-2"></i>Add to Playlist';
        playlistBtn.addEventListener("click", () => {
            addMusicTrackToPlaylistFromContext(track);
            closeDetailsMusicContextMenu();
        });
    }
    menu.appendChild(playlistBtn);

    const goBtn = document.createElement("button");
    goBtn.type = "button";
    goBtn.className = "message-context-menu-item";
    goBtn.innerHTML = '<i class="fas fa-location-arrow me-2"></i>Go to Message';
    goBtn.addEventListener("click", async () => {
        closeDetailsMusicContextMenu({ restoreFocus: false });
        await goToMusicTrackMessage(track);
    });
    menu.appendChild(goBtn);

    document.body.appendChild(menu);

    const menuRect = menu.getBoundingClientRect();
    const maxLeft = Math.max(8, window.innerWidth - menuRect.width - 8);
    const maxTop = Math.max(8, window.innerHeight - menuRect.height - 8);
    menu.style.left = `${Math.min(Math.max(8, x), maxLeft)}px`;
    menu.style.top = `${Math.min(Math.max(8, y), maxTop)}px`;

    playlistBtn.focus();
}

function bindMusicItemContextMenu(item, rawTrack, options = {}) {
    if (!item || !rawTrack) {
        return;
    }

    const mode = options.mode === "playlist" ? "playlist" : "details";

    const isBlockedTarget = (target) => {
        return Boolean(target?.closest?.(".saved-pl-play, .saved-pl-remove"));
    };

    item.addEventListener("contextmenu", (event) => {
        if (isBlockedTarget(event.target)) {
            return;
        }
        event.preventDefault();
        openDetailsMusicContextMenu(rawTrack, {
            x: Number(event.clientX || 0),
            y: Number(event.clientY || 0),
            anchorElement: item,
            mode,
        });
    });

    let touchLongPressTimer = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    item.addEventListener(
        "touchstart",
        (event) => {
            if (event.touches.length !== 1 || isBlockedTarget(event.target)) {
                return;
            }
            const touch = event.touches[0];
            touchStartX = Number(touch.clientX || 0);
            touchStartY = Number(touch.clientY || 0);
            touchLongPressTimer = window.setTimeout(() => {
                touchLongPressTimer = 0;
                openDetailsMusicContextMenu(rawTrack, {
                    x: touchStartX,
                    y: touchStartY,
                    anchorElement: item,
                    mode,
                });
                suppressNextContextMenuTapUntil = Date.now() + 400;
            }, MESSAGE_LONG_PRESS_MS);
        },
        { passive: true },
    );

    item.addEventListener(
        "touchmove",
        (event) => {
            if (!touchLongPressTimer) {
                return;
            }
            const touch = event.touches[0];
            const deltaX = Math.abs(Number(touch?.clientX || 0) - touchStartX);
            const deltaY = Math.abs(Number(touch?.clientY || 0) - touchStartY);
            if (deltaX > 10 || deltaY > 10) {
                clearTimeout(touchLongPressTimer);
                touchLongPressTimer = 0;
            }
        },
        { passive: true },
    );

    const clearLongPress = () => {
        if (!touchLongPressTimer) {
            return;
        }
        clearTimeout(touchLongPressTimer);
        touchLongPressTimer = 0;
    };

    item.addEventListener("touchend", clearLongPress, { passive: true });
    item.addEventListener("touchcancel", clearLongPress, { passive: true });
}

async function playDetailsMusicTrack(playBtn, track) {
    if (privateMusicAudio && privateMusicCurrentBtn === playBtn) {
        if (privateMusicAudio.paused) {
            privateMusicAudio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            privateMusicAudio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        return;
    }

    stopAllAudio();
    playBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    privateMusicCurrentBtn = playBtn;

    try {
        const mediaResource = await getDecryptedMediaResource(track.message);
        if (privateMusicCurrentBtn !== playBtn) {
            return;
        }

        if (!audioContext) {
            audioContext = new (
                window.AudioContext || window.webkitAudioContext
            )();
        }
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const audio = new Audio(mediaResource.objectUrl);
        privateMusicAudio = audio;

        audio.addEventListener("ended", () => {
            if (privateMusicAudio === audio) {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                privateMusicAudio = null;
                privateMusicCurrentBtn = null;
                hideGlobalNowPlaying();
            }
        });

        audio.addEventListener("error", () => {
            if (privateMusicAudio === audio) {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                privateMusicAudio = null;
                privateMusicCurrentBtn = null;
                hideGlobalNowPlaying();
            }
        });

        await audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        showGlobalNowPlaying(audio, track.title, "music");
    } catch (_) {
        if (privateMusicCurrentBtn === playBtn) {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            privateMusicCurrentBtn = null;
            privateMusicAudio = null;
        }
    }
}

function renderDetailsMusicItems(body, tracks) {
    tracks.forEach((track) => {
        const item = document.createElement("div");
        item.className =
            "saved-playlist-item" +
            (track.isPurged ? " playlist-item-purged" : "");
        item.tabIndex = 0;
        item.innerHTML = `
            <button type="button" class="saved-pl-play" title="${track.isPurged ? "File expired" : "Play"}" ${track.isPurged ? "disabled" : ""}>
                <i class="fas ${track.isPurged ? "fa-clock" : "fa-play"}"></i>
            </button>
            <div class="saved-pl-info">
                <div class="saved-pl-title${track.isPurged ? " file-purged-title" : ""}">${escapeHtml(track.title)}</div>
                <div class="saved-pl-meta">${track.isPurged ? '<span class="file-purged-badge" style="font-size:0.6rem;padding:1px 6px;"><i class="fas fa-clock"></i> Expired</span>' : `${escapeHtml(track.ext)} · ${escapeHtml(track.senderLabel)}`}</div>
            </div>
        `;
        if (!track.isPurged) {
            const playBtn = item.querySelector(".saved-pl-play");
            playBtn?.addEventListener("click", async () => {
                await playDetailsMusicTrack(playBtn, track);
            });
        }
        bindMusicItemContextMenu(item, track);
        body.appendChild(item);
    });
}

function removeMusicShowMoreButton(body) {
    body.querySelector(".music-show-more-wrap")?.remove();
}

function renderMusicShowMoreButton(body, onClick) {
    removeMusicShowMoreButton(body);
    const wrap = document.createElement("div");
    wrap.className = "music-show-more-wrap text-center py-2";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-sm btn-outline-secondary";
    button.innerHTML = '<i class="fas fa-chevron-down me-1"></i>Show More';
    button.addEventListener("click", onClick);
    wrap.appendChild(button);
    body.appendChild(wrap);
}

async function loadDetailsMusicPanelPage({
    panelKey,
    bodyId,
    countId,
    chatTarget,
    emptyHtml,
    reset = false,
}) {
    const body = document.getElementById(bodyId);
    const countEl = document.getElementById(countId);
    if (!body || !chatTarget) {
        return;
    }

    const targetToken = String(chatTarget);
    let state = detailsMusicPanelState.get(panelKey);
    const shouldResetState =
        reset || !state || state.targetToken !== targetToken;
    if (shouldResetState) {
        state = {
            targetToken,
            nextOffset: 0,
            hasMore: true,
            pending: [],
            tracks: [],
            loading: false,
        };
        detailsMusicPanelState.set(panelKey, state);
        body.innerHTML =
            '<div class="playlist-empty"><i class="fas fa-circle-notch fa-spin me-2"></i>Loading music...</div>';
    }

    if (state.loading) {
        return;
    }

    state.loading = true;
    try {
        const pageTracks = [];
        let safety = 0;
        while (pageTracks.length < DETAILS_MUSIC_PAGE_SIZE && safety < 120) {
            safety++;
            if (!state.pending.length) {
                if (!state.hasMore) {
                    break;
                }
                const response = await fetchConversationMusicChunk(
                    targetToken,
                    state.nextOffset,
                    DETAILS_MUSIC_SCAN_BATCH_SIZE,
                );
                const items = Array.isArray(response?.items)
                    ? response.items
                    : [];
                state.nextOffset = Math.max(
                    state.nextOffset,
                    Number(response?.nextOffset || state.nextOffset),
                );
                state.hasMore = Boolean(response?.hasMore);
                if (!items.length && !state.hasMore) {
                    break;
                }
                state.pending.push(...items);
            }

            if (!state.pending.length) {
                break;
            }

            const candidate = state.pending.shift();
            if (!candidate || Number(candidate.id || 0) <= 0) {
                continue;
            }
            messageMetaById.set(Number(candidate.id), candidate);
            const track = await buildMusicTrackFromMessage(
                candidate,
                targetToken,
            );
            if (!track) {
                continue;
            }
            state.tracks.push(track);
            pageTracks.push(track);
        }

        if (shouldResetState) {
            body.innerHTML = "";
        }

        if (pageTracks.length) {
            renderDetailsMusicItems(body, pageTracks);
        }

        removeMusicShowMoreButton(body);

        const hasMoreToScan = state.hasMore || state.pending.length > 0;
        if (!state.tracks.length) {
            body.innerHTML = emptyHtml;
        } else if (hasMoreToScan) {
            renderMusicShowMoreButton(body, () => {
                void loadDetailsMusicPanelPage({
                    panelKey,
                    bodyId,
                    countId,
                    chatTarget,
                    emptyHtml,
                    reset: false,
                });
            });
        }

        if (countEl) {
            countEl.textContent = `(${state.tracks.length}${hasMoreToScan ? "+" : ""})`;
        }
    } finally {
        state.loading = false;
    }
}

function loadPrivateChatMusicMessages(reset = true) {
    void loadDetailsMusicPanelPage({
        panelKey: "private",
        bodyId: "privateMusicBody",
        countId: "privateMusicCount",
        chatTarget: currentChatUser,
        emptyHtml:
            '<div class="playlist-empty"><i class="fas fa-music me-2"></i>No music shared yet.</div>',
        reset,
    });
}

function loadGroupMusicMessages(reset = true) {
    void loadDetailsMusicPanelPage({
        panelKey: "group",
        bodyId: "groupMusicBody",
        countId: "groupMusicCount",
        chatTarget: currentChatUser,
        emptyHtml:
            '<div class="playlist-empty"><i class="fas fa-music me-2"></i>No music shared yet.</div>',
        reset,
    });
}

let privateChatOpinionTargetUserId = 0;
let privateOpinionEditingId = 0;

async function loadPrivateChatOpinion() {
    const body = document.getElementById("privateOpinionBody");
    if (!body) return;
    const userId = Number(chatUserIdsByUsername.get(currentChatUser) || 0);
    privateChatOpinionTargetUserId = userId;
    if (!userId) {
        body.innerHTML = '<div class="opinion-empty">No opinions yet.</div>';
        return;
    }
    try {
        const res = await window.ApiService.jsonOk(
            "api/opinions/fetch.php?target_user_id=" + userId,
        );
        renderPrivateOpinions(res.opinions || []);
    } catch {
        body.innerHTML = '<div class="opinion-empty">No opinions yet.</div>';
    }
}

function renderPrivateOpinions(opinions) {
    const body = document.getElementById("privateOpinionBody");
    if (!body) return;
    body.innerHTML = "";
    if (!opinions.length) {
        body.innerHTML = '<div class="opinion-empty">No opinions yet.</div>';
        return;
    }
    opinions.forEach((op) => {
        const date = op.updated_at || op.created_at || "";
        const dateStr = date ? new Date(date).toLocaleDateString() : "";
        const card = document.createElement("div");
        card.className = "private-opinion-card";
        const bodyDir = startsWithRtlScriptChars(op.body || "", 2)
            ? "rtl"
            : "ltr";
        card.innerHTML = `
            <div class="opinion-text" dir="${bodyDir}">${escapeHtml(op.body)}</div>
            <div class="opinion-date">${dateStr}</div>
            <div class="opinion-actions">
                <button type="button" class="opinion-action-btn edit-btn" title="Edit"><i class="fas fa-pen"></i></button>
                <button type="button" class="opinion-action-btn delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        card.querySelector(".edit-btn")?.addEventListener("click", () => {
            const formWrap = document.getElementById("privateOpinionFormWrap");
            const input = document.getElementById("privateOpinionInput");
            if (formWrap && input) {
                input.value = op.body;
                privateOpinionEditingId = Number(op.id);
                const cc = document.getElementById("privateOpinionCharCount");
                if (cc) cc.textContent = String(input.value.length);
                formWrap.hidden = false;
                input.focus();
            }
        });
        card.querySelector(".delete-btn")?.addEventListener(
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
                    opinionsPanelCache = null;
                    loadPrivateChatOpinion();
                } catch {
                    /* ignore */
                }
            },
        );
        body.appendChild(card);
    });
}

async function loadSavedMessagesStats() {
    try {
        const stats = await fetchConversationStats(
            currentChatUser || CURRENT_USER,
        );
        setStatsUiByIdMap(stats, {
            total: "savedStatTotal",
            text: "savedStatText",
            voice: "savedStatVoice",
            image: "savedStatImage",
            video: "savedStatVideo",
            file: "savedStatFile",
            sticker: "savedStatSticker",
        });
    } catch (_) {}
}

function renderSavedPlaylistPanel() {
    if (!savedPlaylistBody) return;
    const list = getPlaylist();
    if (savedPlaylistCount) savedPlaylistCount.textContent = `(${list.length})`;
    savedPlaylistBody.innerHTML = "";
    if (!list.length) {
        savedPlaylistBody.innerHTML =
            '<div class="playlist-empty"><i class="fas fa-music me-2"></i>No tracks yet. Add music from the context menu.</div>';
        return;
    }
    list.forEach((track, idx) => {
        const item = document.createElement("div");
        const freshMeta = messageMetaById.get(
            Number(track.meta?.id || track.msgId || 0),
        );
        const isPurged = Boolean(
            (freshMeta && freshMeta.file_purged_at) ||
            track.meta?.file_purged_at,
        );
        item.className =
            "saved-playlist-item" +
            (idx === savedPanelCurrentTrackIdx ? " active" : "") +
            (isPurged ? " playlist-item-purged" : "");
        item.setAttribute("data-playlist-idx", String(idx));
        item.tabIndex = 0;
        item.innerHTML = `
            <button type="button" class="saved-pl-play" title="${isPurged ? "File expired" : "Play"}" ${isPurged ? "disabled" : ""}>
                <i class="fas ${isPurged ? "fa-clock" : idx === savedPanelCurrentTrackIdx && savedPanelPlaylistAudio && !savedPanelPlaylistAudio.paused ? "fa-pause" : "fa-play"}"></i>
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
            item.querySelector(".saved-pl-play")?.addEventListener(
                "click",
                () => playSavedPanelTrack(idx),
            );
        }
        item.querySelector(".saved-pl-remove")?.addEventListener(
            "click",
            async () => {
                await removeFromPlaylist(track.msgId);
                if (savedPanelCurrentTrackIdx === idx) {
                    stopSavedPanelAudio();
                } else if (savedPanelCurrentTrackIdx > idx) {
                    savedPanelCurrentTrackIdx--;
                }
                renderSavedPlaylistPanel();
            },
        );
        bindMusicItemContextMenu(
            item,
            {
                id: Number(track.msgId || track.meta?.id || 0),
                msgId: Number(track.msgId || 0),
                title: String(track.title || "Unknown"),
                ext: String(track.ext || ""),
                chatTarget: String(track.chatTarget || currentChatUser || ""),
                message: freshMeta || track.meta || null,
                meta: track.meta || null,
            },
            { mode: "playlist" },
        );
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

    // Stop all other audio sources
    stopAllAudio();

    savedPanelCurrentTrackIdx = idx;
    renderSavedPlaylistPanel();

    try {
        if (!track.meta)
            throw new Error("Track metadata missing — re-add from chat");

        // Check if file was purged (proactive check from fresh message meta)
        const freshMeta = messageMetaById.get(
            Number(track.meta?.id || track.msgId || 0),
        );
        if (
            (freshMeta && freshMeta.file_purged_at) ||
            track.meta.file_purged_at
        ) {
            throw new Error("FILE_UNAVAILABLE");
        }

        const mediaResource = await getDecryptedMediaResource(track.meta);

        if (!audioContext)
            audioContext = new (
                window.AudioContext || window.webkitAudioContext
            )();
        if (audioContext.state === "suspended") audioContext.resume();

        savedPanelPlaylistAudio = new Audio(mediaResource.objectUrl);

        savedPanelPlaylistAudio.addEventListener("loadedmetadata", () => {
            if (
                isFinite(savedPanelPlaylistAudio.duration) &&
                nowPlayingDuration
            ) {
                nowPlayingDuration.textContent = formatTimeShort(
                    savedPanelPlaylistAudio.duration,
                );
            }
        });

        savedPanelPlaylistAudio.addEventListener("timeupdate", () => {
            if (
                !savedPanelPlaylistAudio ||
                !isFinite(savedPanelPlaylistAudio.duration)
            )
                return;
            if (nowPlayingCurrent)
                nowPlayingCurrent.textContent = formatTimeShort(
                    savedPanelPlaylistAudio.currentTime,
                );
            const pct =
                (savedPanelPlaylistAudio.currentTime /
                    savedPanelPlaylistAudio.duration) *
                100;
            if (nowPlayingProgressBar)
                nowPlayingProgressBar.style.width = `${pct}%`;
        });

        savedPanelPlaylistAudio.addEventListener("ended", function () {
            if (this._stopped) return;
            updateNowPlayingUi(false);
            // Auto-play next
            if (idx < list.length - 1) {
                playSavedPanelTrack(idx + 1);
            } else {
                stopSavedPanelAudio();
                renderSavedPlaylistPanel();
            }
        });

        savedPanelPlaylistAudio.addEventListener("error", function () {
            if (this._stopped) return;
            showModal("Playback Error", "Unable to play this track.", "error");
            stopSavedPanelAudio();
            renderSavedPlaylistPanel();
        });

        await savedPanelPlaylistAudio.play();
        showNowPlaying(track);
        updateNowPlayingUi(true);
        renderSavedPlaylistPanel();
        // Also show global now-playing bar
        showGlobalNowPlaying(
            savedPanelPlaylistAudio,
            track.title || "Playlist track",
            "music",
        );
    } catch (error) {
        const isPurged = error?.message === "FILE_UNAVAILABLE";
        if (isPurged) {
            // Auto-skip to next track instead of blocking
            setComposerStatus(
                `Skipped "${track.title || "track"}" — file expired`,
                "warning",
            );
            stopSavedPanelAudio();
            renderSavedPlaylistPanel();
            const list = getPlaylist();
            if (idx < list.length - 1) {
                setTimeout(() => playSavedPanelTrack(idx + 1), 300);
            }
        } else {
            showModal(
                "Playback Error",
                error?.message || "Unable to play track.",
                "error",
            );
            stopSavedPanelAudio();
            renderSavedPlaylistPanel();
        }
    }
}

function stopSavedPanelAudio() {
    if (savedPanelPlaylistAudio) {
        savedPanelPlaylistAudio._stopped = true;
        savedPanelPlaylistAudio.pause();
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
        if (
            !savedPanelPlaylistAudio ||
            !isFinite(savedPanelPlaylistAudio.duration)
        )
            return;
        const rect = nowPlayingProgressWrap.getBoundingClientRect();
        const ratio = Math.max(
            0,
            Math.min(1, (clientX - rect.left) / rect.width),
        );
        savedPanelPlaylistAudio.currentTime =
            ratio * savedPanelPlaylistAudio.duration;
        if (nowPlayingProgressBar)
            nowPlayingProgressBar.style.width = `${ratio * 100}%`;
    }
    nowPlayingProgressWrap.addEventListener("mousedown", (e) => {
        e.preventDefault();
        seekNowPlaying(e.clientX);
        function onMove(ev) {
            seekNowPlaying(ev.clientX);
        }
        function onUp() {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
        }
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
        "composer-status-warning",
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
    window.setTimeout(
        () => {
            if (composerStatusElem && composerStatusElem.textContent === "✓") {
                setComposerStatus("");
            }
        },
        Math.max(250, Number(durationMs) || 900),
    );
}

function isMobileViewport() {
    return window.innerWidth <= MOBILE_BREAKPOINT_WIDTH;
}

function syncMobileComposerActions() {
    if (!imageUploadBtn || !voiceBtn || !composerToolsToggleBtn || !chatForm) {
        return;
    }

    const isEditing = Boolean(activeEditMessageId);
    imageUploadBtn.disabled = isEditing;
    voiceBtn.disabled = isEditing;
    if (stickerPickerBtn) {
        stickerPickerBtn.disabled = isEditing;
        stickerPickerBtn.setAttribute(
            "aria-disabled",
            isEditing ? "true" : "false",
        );
    }

    if (isEditing) {
        appSettings.mobileComposerExpanded = false;
        closeImageSourceMenu();
        closeStickerPicker();
    }

    if (!isMobileViewport()) {
        imageUploadBtn.style.display = "";
        voiceBtn.style.display = "";
        composerToolsToggleBtn.style.display = "none";
        chatForm.classList.remove("mobile-tools-visible");
        return;
    }

    if (isEditing) {
        composerToolsToggleBtn.style.display = "none";
        imageUploadBtn.style.display = "none";
        voiceBtn.style.display = "none";
        chatForm.classList.remove("mobile-tools-visible");
        return;
    }

    composerToolsToggleBtn.style.display = "inline-flex";
    const showTools = Boolean(appSettings.mobileComposerExpanded);
    imageUploadBtn.style.display = showTools ? "inline-flex" : "none";
    voiceBtn.style.display = showTools ? "inline-flex" : "none";
    chatForm.classList.toggle("mobile-tools-visible", showTools);
    composerToolsToggleBtn.setAttribute(
        "aria-expanded",
        showTools ? "true" : "false",
    );
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

function setStickerPickerState(
    message = "",
    { isError = false, hidden = false } = {},
) {
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
    const safePercent = Math.max(
        0,
        Math.min(100, Math.round(Number(percent) || 0)),
    );
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
            uploadedBy
                ? `Send sticker by ${uploadedBy}`
                : `Send sticker ${stickerId}`,
        );
        item.title = uploadedBy
            ? `Send sticker • by ${uploadedBy}`
            : "Send sticker";
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
        const response = await window.ApiService.jsonOk(
            "api/messages/stickers/fetch.php?limit=200",
        );
        stickersCache = Array.isArray(response?.stickers)
            ? response.stickers
            : [];
        hasLoadedStickers = true;
        renderStickerPickerItems(stickersCache);
    } catch (error) {
        stickersCache = [];
        setStickerPickerState(
            String(error?.message || "Failed to load stickers."),
            { isError: true },
        );
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
    if (!ensureEditModeAllowsTextOnly("send sticker")) {
        return;
    }
    if (!currentChatUser) {
        showModal(
            I18N_TEXT.noChatSelectedTitle,
            I18N_TEXT.noChatSelectedBody,
            "warning",
        );
        return;
    }

    const normalizedStickerId = Number(stickerId || 0);
    if (normalizedStickerId <= 0) {
        return;
    }

    const replyToId = currentReplyTarget?.messageId || null;
    try {
        const payload = new URLSearchParams();
        const groupId = parseGroupIdFromToken(currentChatUser);
        if (groupId > 0) {
            payload.set("group_id", String(groupId));
        } else {
            payload.set("target", String(currentChatUser));
        }
        payload.set("sticker_id", String(normalizedStickerId));
        if (replyToId) payload.set("reply_to_message_id", String(replyToId));

        await window.ApiService.jsonOk("api/messages/stickers/send.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                ...getCsrfHeaders(),
            },
            body: payload.toString(),
        });

        closeStickerPicker();
        clearReplyState();
        if (!isGroupToken(currentChatUser)) {
            addUserToChatList(currentChatUser);
            updateTypingStatus(false);
        }
        loadCurrentChatsRecentMessages();
        setComposerStatus("");
    } catch (error) {
        setComposerStatus("Unable to send sticker", "error");
        showModal(
            "Sticker Send Error",
            error?.message || "Failed to send sticker.",
            "error",
        );
    }
}

async function uploadSticker(file) {
    if (!ensureEditModeAllowsTextOnly("upload sticker")) {
        return;
    }
    if (!file) {
        return;
    }
    const type = String(file.type || "").toLowerCase();
    if (type && !type.startsWith("image/")) {
        showModal(
            "Invalid Sticker",
            "Please choose a valid image file.",
            "warning",
        );
        return;
    }
    if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
        showModal(
            "Sticker Too Large",
            "Sticker source image must be 20MB or smaller.",
            "warning",
        );
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
                const safePercent = Math.max(
                    0,
                    Math.min(100, Math.round(Number(percent) || 0)),
                );
                const safeStep = String(step || "Preparing").trim();
                setStickerPickerState(`${safeStep}... ${safePercent}%`);
                setStickerPickerProgress(Math.min(85, safePercent), {
                    visible: true,
                });
            },
            { removeBackground: shouldRemoveBackground },
        );
    } catch (error) {
        preparedStickerFile = file;
        setStickerPickerState(
            "Sticker optimization unavailable on this browser. Uploading original image...",
        );
        setStickerPickerProgress(30, { visible: true });
    }

    if (preparedStickerFile.size > STICKER_UPLOAD_MAX_BYTES) {
        showModal(
            "Sticker Too Large",
            "Sticker must be 512KB or smaller.",
            "warning",
        );
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
        setStickerPickerState(
            String(error?.message || "Sticker upload failed."),
            { isError: true },
        );
        setStickerPickerProgress(0, { visible: false });
        setComposerStatus("Sticker upload failed", "error");
    }
}

// drawStickerImageOnCanvas, buildStickerChoicePreviewDataUrl → chat-sticker-utils.js
const buildStickerChoicePreviewDataUrl =
    window.StickerUtils.buildStickerChoicePreviewDataUrl;

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

    const previousFocus =
        document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
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

                const [keepPreviewResult, removePreviewResult] =
                    await Promise.allSettled([
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
const normalizeStickerUploadFile =
    window.StickerUtils.normalizeStickerUploadFile;

function canUseNativeCameraCapture() {
    if (!imageCaptureInput) {
        return false;
    }
    const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
    const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(
        String(navigator.userAgent || ""),
    );
    return Boolean(coarsePointer || mobileUserAgent);
}

function canUseBrowserCameraCapture() {
    const secureContext =
        window.isSecureContext || window.location.hostname === "localhost";
    return Boolean(
        secureContext &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function",
    );
}

function canUseBrowserVideoCapture() {
    return (
        canUseBrowserCameraCapture() &&
        typeof window.MediaRecorder !== "undefined"
    );
}

async function detectVideoInputDevice() {
    if (hasVideoInputDevice !== null) {
        return hasVideoInputDevice;
    }
    if (
        !navigator.mediaDevices ||
        typeof navigator.mediaDevices.enumerateDevices !== "function"
    ) {
        hasVideoInputDevice = false;
        return false;
    }
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        hasVideoInputDevice = devices.some(
            (device) => device.kind === "videoinput",
        );
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
    if (
        !cameraCaptureOverlay ||
        !cameraCaptureVideo ||
        !canUseBrowserCameraCapture()
    ) {
        setComposerStatus(
            "Camera capture is not supported in this browser/device.",
            "warning",
        );
        return false;
    }

    try {
        const preferRear = {
            video: { facingMode: { ideal: "environment" } },
            audio: false,
        };
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia(preferRear);
        } catch (initialError) {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
        }
        cameraStream = stream;
        cameraCaptureVideo.srcObject = stream;
        cameraCaptureOverlay.hidden = false;
        await cameraCaptureVideo.play();
        setComposerStatus("Camera ready", "success");
        return true;
    } catch (error) {
        closeCameraCaptureOverlay();
        setComposerStatus(
            "Unable to access camera. Check browser permission settings.",
            "warning",
        );
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
    return (
        candidates.find((type) =>
            window.MediaRecorder.isTypeSupported?.(type),
        ) || ""
    );
}

async function openVideoCaptureOverlay() {
    if (
        !videoCaptureOverlay ||
        !videoCaptureVideo ||
        !canUseBrowserVideoCapture()
    ) {
        setComposerStatus(
            "Video recording is not supported in this browser/device.",
            "warning",
        );
        return false;
    }

    try {
        const preferRear = {
            video: { facingMode: { ideal: "environment" } },
            audio: true,
        };
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia(preferRear);
        } catch (initialError) {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
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
        setComposerStatus(
            "Unable to access camera/microphone for video recording.",
            "warning",
        );
        return false;
    }
}

function startVideoCaptureRecording() {
    if (
        !videoCaptureStream ||
        !canUseBrowserVideoCapture() ||
        videoCaptureRecorder
    ) {
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
            const videoFile = new File(
                [videoBlob],
                `video_${Date.now()}.${extension}`,
                {
                    type: mimeType,
                },
            );
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
    if (
        !cameraCaptureVideo ||
        !cameraCaptureCanvas ||
        !cameraStream ||
        isCameraCaptureBusy
    ) {
        return;
    }

    const width = cameraCaptureVideo.videoWidth || 1280;
    const height = cameraCaptureVideo.videoHeight || 720;
    if (!width || !height) {
        setComposerStatus(
            "Camera is still initializing. Please try again.",
            "warning",
        );
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
                showModal(
                    I18N_TEXT.fileTooLargeTitle,
                    I18N_TEXT.imageTooLargeBody,
                    "warning",
                );
                return;
            }
            const capturedFile = new File([blob], `camera_${Date.now()}.jpg`, {
                type: "image/jpeg",
            });
            closeCameraCaptureOverlay();
            void sendImageMessage(capturedFile);
        },
        "image/jpeg",
        0.92,
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
        const supportsRecordVideo =
            supportsMobileCapture || (supportsVideoRecording && hasCamera);
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
        const imageLimitMb = Math.max(
            1,
            Math.round(IMAGE_UPLOAD_MAX_BYTES / (1024 * 1024)),
        );
        const fileLimitMb = Math.max(
            1,
            Math.round(FILE_UPLOAD_MAX_BYTES / (1024 * 1024)),
        );
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
    if (settingIosLagFix) {
        settingIosLagFix.checked = appSettings.iosLagFix;
    }
    if (settingClassicDesign) {
        settingClassicDesign.checked = appSettings.classicDesign;
    }
    syncPerfModeOptionStates();
    if (settingInteractiveMessageSearch) {
        settingInteractiveMessageSearch.checked =
            appSettings.interactiveMessageSearch;
    }
    if (settingNotificationSound) {
        settingNotificationSound.checked = appSettings.notificationSoundEnabled;
    }
    if (settingAutoScroll) {
        settingAutoScroll.checked = appSettings.autoScrollEnabled;
    }
    if (settingBrowserNotifications) {
        settingBrowserNotifications.checked =
            appSettings.browserNotificationsEnabled;
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
    announcementsCloseBtn?.addEventListener("click", () =>
        closeAnnouncementsPanel(),
    );
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
        appSettings.themeMode = ["system", "light", "dark"].includes(
            event.target.value,
        )
            ? event.target.value
            : "system";
        persistAppSettings();
        applyUiPreferenceClasses();
    });

    settingDensityMode?.addEventListener("change", (event) => {
        appSettings.densityMode =
            event.target.value === "compact" ? "compact" : "comfortable";
        persistAppSettings();
        applyUiPreferenceClasses();
    });

    settingFontScale?.addEventListener("change", (event) => {
        appSettings.fontScale = ["sm", "md", "lg", "xl"].includes(
            event.target.value,
        )
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

    settingIosLagFix?.addEventListener("change", (event) => {
        appSettings.iosLagFix = Boolean(event.target.checked);
        if (!appSettings.iosLagFix && appSettings.classicDesign) {
            // Turning off performance mode resets classic design
            appSettings.classicDesign = false;
        }
        persistAppSettings();
        applyUiPreferenceClasses();
        syncPerfModeOptionStates();
        setComposerStatus(
            appSettings.iosLagFix
                ? "Performance mode enabled"
                : "Performance mode disabled",
            "success",
        );
    });

    settingClassicDesign?.addEventListener("change", (event) => {
        appSettings.classicDesign = Boolean(event.target.checked);
        if (appSettings.classicDesign) {
            // Classic design forces reduce motion ON
            appSettings.reduceMotion = true;
        } else {
            // Disabling classic design also turns reduce motion OFF
            appSettings.reduceMotion = false;
        }
        persistAppSettings();
        applyUiPreferenceClasses();
        syncPerfModeOptionStates();
        setComposerStatus(
            appSettings.classicDesign
                ? "Classic design enabled"
                : "Classic design disabled",
            "success",
        );
    });

    settingInteractiveMessageSearch?.addEventListener("change", (event) => {
        appSettings.interactiveMessageSearch = Boolean(event.target.checked);
        persistAppSettings();
        if (!appSettings.interactiveMessageSearch) {
            cancelConversationSearch();
            setComposerStatus("Interactive message search disabled", "success");
        } else {
            setComposerStatus("Interactive message search enabled", "success");
            runConversationSearch(true);
        }
    });

    if (settingNotificationSound) {
        settingNotificationSound.addEventListener("change", (event) => {
            appSettings.notificationSoundEnabled = Boolean(
                event.target.checked,
            );
            persistAppSettings();
            setComposerStatus(
                appSettings.notificationSoundEnabled
                    ? "Notification sound enabled"
                    : "Notification sound disabled",
                "success",
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
                "success",
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

    document
        .getElementById("openAnnouncementsBtn")
        ?.addEventListener("click", () => {
            toggleSettingsPanel(false);
            openAnnouncementsPanel();
        });

    document
        .getElementById("openOpinionsBtn")
        ?.addEventListener("click", () => {
            toggleSettingsPanel(false);
            openOpinionsPanel();
        });
    document
        .getElementById("opinionsCloseBtn")
        ?.addEventListener("click", () => closeOpinionsPanel());
    opinionsOverlay?.addEventListener("click", (event) => {
        if (event.target === opinionsOverlay) closeOpinionsPanel();
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
            showModal(
                "Invalid Avatar",
                "Please choose an image file.",
                "warning",
            );
            return;
        }

        if (selectedFile.size > AVATAR_UPLOAD_MAX_BYTES) {
            const avatarLimitMb = Math.max(
                1,
                Math.round(AVATAR_UPLOAD_MAX_BYTES / (1024 * 1024)),
            );
            showModal(
                "Avatar Too Large",
                `Avatar size must be less than ${avatarLimitMb}MB.`,
                "warning",
            );
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
            showModal(
                "Avatar Updated",
                "Your profile avatar was updated successfully.",
                "success",
            );
        } catch (error) {
            showModal(
                "Avatar Update Failed",
                error?.message || "Failed to update avatar.",
                "error",
            );
            setComposerStatus("Unable to update avatar", "error");
        }
    });

    chatUiSettingsTabGeneral?.addEventListener("click", () => {
        applySettingsTabUi("general");
    });

    chatUiSettingsTabAccount?.addEventListener("click", async () => {
        applySettingsTabUi("account");
        if (window.AdminPanel)
            void window.AdminPanel.loadBlockedUsersSettings();
        await loadSettingsBio();
    });

    chatUiSettingsTabAdmin?.addEventListener("click", async () => {
        applySettingsTabUi("admin");
        if (window.AdminPanel)
            await window.AdminPanel.refreshAdminSettingsData();
    });

    chatUiSettingsTabSessions?.addEventListener("click", async () => {
        applySettingsTabUi("sessions");
        await loadSessionsList();
    });

    chatUiSettingsTabIdeas?.addEventListener("click", async () => {
        applySettingsTabUi("ideas");
        if (typeof window.loadIdeasList === "function")
            await window.loadIdeasList();
    });

    if (settingBrowserNotifications) {
        settingBrowserNotifications.addEventListener(
            "change",
            async (event) => {
                const wantEnabled = Boolean(event.target.checked);
                if (wantEnabled) {
                    if (!("Notification" in window)) {
                        event.target.checked = false;
                        showModal(
                            "Not Supported",
                            "Browser notifications are not supported in this browser.",
                            "warning",
                        );
                        return;
                    }
                    let permission = Notification.permission;
                    if (permission === "default") {
                        permission = await Notification.requestPermission();
                    }
                    if (permission !== "granted") {
                        event.target.checked = false;
                        showModal(
                            "Permission Denied",
                            "Browser notification permission was denied. Enable it in your browser settings.",
                            "warning",
                        );
                        return;
                    }
                }
                appSettings.browserNotificationsEnabled = wantEnabled;
                persistAppSettings();
                setComposerStatus(
                    wantEnabled
                        ? "Browser notifications enabled"
                        : "Browser notifications disabled",
                    "success",
                );
            },
        );
    }

    if (settingSendByEnter) {
        settingSendByEnter.addEventListener("change", (event) => {
            appSettings.sendByEnter = Boolean(event.target.checked);
            persistAppSettings();
            setComposerStatus(
                appSettings.sendByEnter
                    ? "Enter sends message"
                    : "Enter adds new line",
                "success",
            );
        });
    }

    if (settingShowSavedMessages) {
        settingShowSavedMessages.addEventListener("change", (event) => {
            appSettings.showSavedMessages = Boolean(event.target.checked);
            persistAppSettings();
            const savedMsgItem = document.getElementById(
                chatListItemId(CURRENT_USER),
            );
            if (savedMsgItem) {
                savedMsgItem.style.display = appSettings.showSavedMessages
                    ? ""
                    : "none";
            }
            setComposerStatus(
                appSettings.showSavedMessages
                    ? '"You" shown in chat list'
                    : '"You" hidden from chat list',
                "success",
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
            const confirmed = await showConfirmModal(
                "Clear Data & Logout",
                "",
                {
                    type: "warning",
                    confirmLabel: "Clear & Logout",
                    bodyHtml:
                        '<span style="display:block;margin-bottom:0.75rem">Cookies and session will be cleared. You will be logged out.</span>' +
                        '<label style="display:flex;align-items:center;gap:0.5rem;margin:0.5rem 0 0.15rem;cursor:pointer;font-weight:500">' +
                        '<input type="checkbox" id="confirmClearSiteData" checked> Site data' +
                        "</label>" +
                        '<small style="display:block;margin:0 0 0.6rem 1.5rem;opacity:0.7">IndexedDB, caches, service workers. Enable to get the latest version of the app after login.</small>' +
                        '<label style="display:flex;align-items:center;gap:0.5rem;margin:0.5rem 0 0.15rem;cursor:pointer;font-weight:500">' +
                        '<input type="checkbox" id="confirmClearUserCustoms"> User customizations' +
                        "</label>" +
                        '<small style="display:block;margin:0 0 0 1.5rem;opacity:0.7">Also remove saved preferences (theme, font size, etc.).</small>',
                },
            );
            if (!confirmed) return;

            const clearSiteData = Boolean(
                document.getElementById("confirmClearSiteData")?.checked,
            );
            const clearCustomizations = Boolean(
                document.getElementById("confirmClearUserCustoms")?.checked,
            );

            clearCookiesBtn.disabled = true;
            clearCookiesBtn.textContent = "Clearing\u2026";
            try {
                // 1. Always: clear cookies
                document.cookie.split(";").forEach(function (c) {
                    document.cookie = c
                        .replace(/^\s+/, "")
                        .replace(
                            /=.*/,
                            "=;expires=" +
                                new Date(0).toUTCString() +
                                ";path=/",
                        );
                });

                // 2. Always: clear sessionStorage
                sessionStorage.clear();

                // 3. Conditionally: clear site data (IndexedDB, Cache API, service workers)
                if (clearSiteData) {
                    try {
                        if (window.indexedDB?.databases) {
                            const dbs = await window.indexedDB.databases();
                            for (const db of dbs) {
                                if (db.name)
                                    window.indexedDB.deleteDatabase(db.name);
                            }
                        }
                    } catch (_) {}
                    try {
                        if (window.caches) {
                            const names = await window.caches.keys();
                            for (const name of names)
                                await window.caches.delete(name);
                        }
                    } catch (_) {}
                    try {
                        if (navigator.serviceWorker) {
                            const regs =
                                await navigator.serviceWorker.getRegistrations();
                            for (const reg of regs) await reg.unregister();
                        }
                    } catch (_) {}
                }

                // 4. localStorage: backup settings if customizations should be preserved
                if (clearCustomizations) {
                    localStorage.clear();
                } else {
                    const settingsBackup =
                        localStorage.getItem(SETTINGS_STORAGE_KEY);
                    localStorage.clear();
                    if (settingsBackup) {
                        try {
                            localStorage.setItem(
                                SETTINGS_STORAGE_KEY,
                                settingsBackup,
                            );
                        } catch (_) {}
                    }
                }

                setComposerStatus("Data cleared, logging out\u2026", "success");
            } catch (_) {
                setComposerStatus("Failed to clear data", "error");
            }
            clearCookiesBtn.disabled = false;
            clearCookiesBtn.textContent = "Clear";
            setTimeout(() => {
                window.location.reload();
            }, 800);
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
    };

    if (clearMediaCacheBtn) {
        clearMediaCacheBtn.addEventListener("click", async () => {
            const confirmed = await showConfirmModal(
                "Clear Media Cache",
                "Clear all cached media? Images and videos will need to be re-downloaded.",
                { type: "warning", confirmLabel: "Clear" },
            );
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

    settingsBioInput?.addEventListener("input", () => {
        if (settingsBioCharCount)
            settingsBioCharCount.textContent = String(
                settingsBioInput.value.length,
            );
    });

    settingsBioForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const bio = String(settingsBioInput?.value || "").trim();
        try {
            await window.ApiService.jsonOk("api/users/update_profile.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({ action: "bio", bio }),
            });
            setComposerStatus("Bio updated", "success");
        } catch (error) {
            showModal(
                "Bio Update Failed",
                error?.message || "Unable to update bio.",
                "error",
            );
        }
    });

    settingsUsernameForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = String(settingsUsernameInput?.value || "").trim();
        if (!username) {
            showModal(
                "Invalid Username",
                "Please provide a username.",
                "warning",
            );
            return;
        }

        try {
            const response = await window.ApiService.jsonOk(
                "api/users/update_profile.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...getCsrfHeaders(),
                    },
                    body: JSON.stringify({
                        action: "username",
                        username,
                    }),
                },
            );
            const updatedUsername = String(response?.username || username);
            updateCurrentUsernameUi(updatedUsername);
            setComposerStatus("Username updated", "success");
            showModal(
                "Username Updated",
                "Your username was updated successfully.",
                "success",
            );
            window.setTimeout(() => {
                window.location.reload();
            }, 260);
        } catch (error) {
            showModal(
                "Username Update Failed",
                error?.message || "Unable to update username.",
                "error",
            );
            setComposerStatus("Unable to update username", "error");
        }
    });

    settingsPasswordForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const currentPassword = String(
            settingsCurrentPasswordInput?.value || "",
        );
        const newPassword = String(settingsNewPasswordInput?.value || "");
        const confirmPassword = String(
            settingsConfirmPasswordInput?.value || "",
        );

        if (!currentPassword || !newPassword || !confirmPassword) {
            showModal(
                "Missing Password Fields",
                "Please fill all password fields.",
                "warning",
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            showModal(
                "Password Mismatch",
                "New password and confirmation do not match.",
                "warning",
            );
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
            showModal(
                "Password Updated",
                "Your password was changed successfully.",
                "success",
            );
        } catch (error) {
            showModal(
                "Password Update Failed",
                error?.message || "Unable to update password.",
                "error",
            );
            setComposerStatus("Unable to update password", "error");
        }
    });

    // Sessions tab — refresh button
    const settingsRefreshSessionsBtn = document.getElementById(
        "settingsRefreshSessionsBtn",
    );
    settingsRefreshSessionsBtn?.addEventListener("click", () =>
        loadSessionsList(),
    );

    if (composerToolsToggleBtn) {
        composerToolsToggleBtn.addEventListener("click", () => {
            appSettings.mobileComposerExpanded =
                !appSettings.mobileComposerExpanded;
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
        if (
            event.key === "Escape" &&
            chatUiSettingsOverlay &&
            !chatUiSettingsOverlay.hidden
        ) {
            closeUiSettingsModal();
            return;
        }
        if (
            event.key === "Escape" &&
            opinionsOverlay &&
            !opinionsOverlay.hidden
        ) {
            closeOpinionsPanel();
        }
    });

    chatInput?.addEventListener("focus", () => {
        closeStickerPicker();
        if (isMobileViewport() && appSettings.mobileComposerExpanded) {
            appSettings.mobileComposerExpanded = false;
            queueMicrotask(() => {
                persistAppSettings();
                syncMobileComposerActions();
            });
        }
    });

    window.addEventListener("resize", syncMobileComposerActions);

    userInfoBtn?.addEventListener("click", () => {
        if (
            !currentChatUser ||
            isGroupToken(currentChatUser) ||
            isSavedMessagesChat(currentChatUser)
        )
            return;
        togglePrivateChatInfoPanel();
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

        if (isSavedMessagesChat(currentChatUser)) {
            toggleSavedMessagesInfoPanel();
            return;
        }
        togglePrivateChatInfoPanel();
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

        if (isSavedMessagesChat(currentChatUser)) {
            toggleSavedMessagesInfoPanel();
            return;
        }
        togglePrivateChatInfoPanel();
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
            return;
        }
        if (privateChatInfoPanel && !privateChatInfoPanel.hidden) {
            closePrivateChatInfoPanel();
            return;
        }
    });

    chatListElem?.addEventListener("contextmenu", async (event) => {
        const item = event.target.closest("li.chat-user:not(.chat-group)");
        if (!item) {
            return;
        }
        const usernameNode = item.querySelector(
            "span:not(.avatar):not(.chat-item-unread-badge)",
        );
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
        const userId = Number(
            messageElement?.getAttribute("data-sender-id") || 0,
        );
        const username = String(
            messageElement?.getAttribute("data-sender-username") || "",
        );
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
        const userId = Number(
            memberItem?.getAttribute("data-member-user-id") || 0,
        );
        const username = String(
            memberItem?.getAttribute("data-member-username") || "",
        );
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
        if (
            event.key === "Escape" &&
            messageActionModalOverlay &&
            !messageActionModalOverlay.hidden
        ) {
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

function closeGroupInfoPanel({ fromHistory = false } = {}) {
    if (!groupInfoPanel || groupInfoPanel.hidden) return;
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.groupInfo, () => {
            closeGroupInfoPanel({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.groupInfo);
    if (groupInfoBtn) {
        groupInfoBtn.setAttribute("aria-expanded", "false");
    }
    let done = false;
    const finish = () => {
        if (done) return;
        done = true;
        groupInfoPanel.classList.remove("panel-closing");
        groupInfoPanel.hidden = true;
        chatAreaElem?.classList.remove("group-panel-open");
    };
    groupInfoPanel.classList.add("panel-closing");
    groupInfoPanel.addEventListener("animationend", finish, { once: true });
    setTimeout(finish, 350);
}

function openGroupInfoPanel() {
    if (groupInfoPanel) {
        groupInfoPanel.hidden = false;
    }
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.groupInfo,
        ({ fromHistory = false } = {}) => {
            closeGroupInfoPanel({ fromHistory });
        },
    );
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
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.createGroup,
        ({ fromHistory = false } = {}) => {
            closeCreateGroupModal({ fromHistory });
        },
    );
    if (createGroupForm) {
        createGroupForm.reset();
    }
    createGroupSubmitBtn && (createGroupSubmitBtn.disabled = false);
    setTimeout(() => {
        createGroupTitleInput?.focus();
    }, 0);
}

function closeCreateGroupModal({ fromHistory = false } = {}) {
    if (!createGroupModalOverlay) {
        return;
    }
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.createGroup, () => {
            closeCreateGroupModal({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.createGroup);
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
        if (
            event.key === "Escape" &&
            createGroupModalOverlay &&
            !createGroupModalOverlay.hidden
        ) {
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
            showModal(
                "Create Group Failed",
                error.message || "Unable to create group",
                "error",
            );
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
        window.UIEnhancements.showSearchNotification(
            I18N_TEXT.copiedBody,
            "success",
        );
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
            imageElement.onerror = () =>
                reject(new Error("Unable to decode image."));
            imageElement.src = objectUrl;
        });
        if (!loaded) {
            throw new Error("Unable to decode image.");
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(
            1,
            Number(imageElement.naturalWidth || imageElement.width || 0),
        );
        canvas.height = Math.max(
            1,
            Number(imageElement.naturalHeight || imageElement.height || 0),
        );
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
    if (reactionPickerRepositionRafId) {
        cancelAnimationFrame(reactionPickerRepositionRafId);
        reactionPickerRepositionRafId = 0;
    }
    document.getElementById("messageReactionPicker")?.remove();
    suppressReactionPickerAutoCloseUntil = 0;
    if (restoreFocus && lastReactionPickerMessageElement) {
        lastReactionPickerMessageElement.focus();
    }
    lastReactionPickerMessageElement = null;
}

function repositionReactionPickerForMessage(messageElement, pickerElement) {
    if (!messageElement || !pickerElement) {
        return;
    }

    if (!document.contains(messageElement)) {
        closeReactionPicker({ restoreFocus: false });
        return;
    }

    const messageRect = messageElement.getBoundingClientRect();
    const pickerRect = pickerElement.getBoundingClientRect();
    const gap = 8;
    const showAbove = messageRect.top - pickerRect.height - gap >= 8;
    const maxLeft = Math.max(8, window.innerWidth - pickerRect.width - 8);
    const maxTop = Math.max(8, window.innerHeight - pickerRect.height - 8);

    const top = Math.min(
        maxTop,
        Math.max(
            8,
            showAbove
                ? messageRect.top - pickerRect.height - gap
                : messageRect.bottom + gap,
        ),
    );
    const left = Math.min(
        maxLeft,
        Math.max(
            8,
            messageRect.left + messageRect.width / 2 - pickerRect.width / 2,
        ),
    );

    pickerElement.style.top = `${top}px`;
    pickerElement.style.left = `${left}px`;
}

function scheduleReactionPickerReposition() {
    if (reactionPickerRepositionRafId) {
        return;
    }
    reactionPickerRepositionRafId = requestAnimationFrame(() => {
        reactionPickerRepositionRafId = 0;
        const picker = document.getElementById("messageReactionPicker");
        if (!picker || !lastReactionPickerMessageElement) {
            return;
        }
        repositionReactionPickerForMessage(
            lastReactionPickerMessageElement,
            picker,
        );
    });
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

    return Array.from(
        messageActionModalOverlay.querySelectorAll(selector),
    ).filter((element) => {
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
    if (
        !messageActionModalOverlay ||
        messageActionModalOverlay.hidden ||
        event.key !== "Tab"
    ) {
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
    if (
        !messageActionModalOverlay ||
        !messageActionModalTitle ||
        !messageActionModalBody
    ) {
        return;
    }

    lastFocusedElementBeforeActionModal =
        document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;

    messageActionModalTitle.textContent = title;
    messageActionModalBody.innerHTML = "";
    if (bodyNode instanceof Node) {
        messageActionModalBody.appendChild(bodyNode);
    }
    if (messageActionModalAnnouncer) {
        messageActionModalAnnouncer.textContent = formatI18nText(
            I18N_TEXT.modalOpened,
            {
                title,
            },
        );
    }
    messageActionModalOverlay.setAttribute("aria-hidden", "false");
    messageActionModalOverlay.hidden = false;
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.messageAction,
        ({ fromHistory = false } = {}) => {
            closeMessageActionModal({ fromHistory });
        },
    );
    requestAnimationFrame(() => {
        messageActionModalOverlay.classList.add("visible");
        focusFirstActionModalElement();
    });
}

function closeMessageActionModal({ fromHistory = false } = {}) {
    if (!messageActionModalOverlay) {
        return;
    }
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.messageAction, () => {
            closeMessageActionModal({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.messageAction);

    const closedTitle =
        messageActionModalTitle?.textContent?.trim() || "message action";

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
                messageActionModalAnnouncer.textContent = formatI18nText(
                    I18N_TEXT.modalClosed,
                    {
                        title: closedTitle,
                    },
                );
            }
        }
    }, 500);
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
    syncComposerContextFlags();
}

function setReplyState(messageElement) {
    const messageId = Number(
        messageElement.getAttribute("data-message-id") || 0,
    );
    if (!messageId || !replyPreviewElem) {
        return;
    }

    const snippet = getReplySnippetFromMessageElement(messageElement);
    const senderLabel = messageElement.classList.contains("sent")
        ? "You"
        : messageElement.getAttribute("data-sender-username") ||
          getCurrentChatDisplayName();

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
    syncComposerContextFlags();
}

function buildReplyPreviewHtml(msg, decryptedReplyText) {
    if (!msg.reply_message_id) {
        return "";
    }

    const senderLabel =
        Number(msg.reply_sender_id) === Number(CURRENT_USER_ID)
            ? "You"
            : msg.reply_sender_username || getCurrentChatDisplayName();
    const fallbackText =
        msg.reply_message_type === "text"
            ? "[Message]"
            : `[${msg.reply_message_type}]`;
    const previewText = (
        decryptedReplyText ||
        fallbackText ||
        "[Message]"
    ).slice(0, 160);

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
        globalNpAudio.removeEventListener(
            "timeupdate",
            globalNpAudio._gnpTimeUpdate,
        );
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
        if (globalNpTimeEl)
            globalNpTimeEl.textContent = formatTimeShort(audio.currentTime);
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
        globalNpAudio.removeEventListener(
            "timeupdate",
            globalNpAudio._gnpTimeUpdate,
        );
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
    document
        .querySelectorAll(".voice-play-btn.playing, .music-play-btn.playing")
        .forEach((btn) => {
            btn.classList.remove("playing");
            btn.innerHTML = '<i class="fas fa-play"></i>';
            btn.closest(".voice-player-container")?.classList.remove(
                "is-playing",
            );
            btn.closest(".music-player-container")?.classList.remove(
                "is-playing",
            );
        });
    hideGlobalNowPlaying();
});

// Seek on global progress bar
if (globalNpProgressWrap) {
    function seekGlobalNp(clientX) {
        if (!globalNpAudio || !isFinite(globalNpAudio.duration)) return;
        const rect = globalNpProgressWrap.getBoundingClientRect();
        const ratio = Math.max(
            0,
            Math.min(1, (clientX - rect.left) / rect.width),
        );
        globalNpAudio.currentTime = ratio * globalNpAudio.duration;
        if (globalNpProgressBar)
            globalNpProgressBar.style.width = `${ratio * 100}%`;
    }
    globalNpProgressWrap.addEventListener("mousedown", (e) => {
        e.preventDefault();
        seekGlobalNp(e.clientX);
        function onMove(ev) {
            seekGlobalNp(ev.clientX);
        }
        function onUp() {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
        }
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
        actionBtn.className =
            "btn btn-sm btn-outline-primary chat-inline-state-action";
        actionBtn.textContent = actionLabel;
        actionBtn.addEventListener("click", onAction);
        wrapper.appendChild(actionBtn);
    }

    chatMessagesElem.appendChild(wrapper);
}

function showEmptyChatState(
    message = "No messages yet. Start the conversation.",
) {
    clearInlineChatState();
    showInlineChatState({ message, kind: "info" });
}

async function copyMessageText(messageElement) {
    const messageText = getMessageTextForCopy(messageElement);
    if (!messageText) {
        showModal(
            I18N_TEXT.copyFailedTitle,
            I18N_TEXT.copyFailedNoText,
            "warning",
        );
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
        showModal(
            I18N_TEXT.copyFailedTitle,
            I18N_TEXT.copyFailedUnknown,
            "error",
        );
    }
}

async function copyImageMessageToClipboard(messageElement, messageData = null) {
    const messageType = String(
        messageData?.message_type ??
            messageElement?.getAttribute("data-message-type") ??
            "",
    );
    if (messageType !== "image") {
        showModal(
            "Copy Failed",
            "Only image messages can be copied as image.",
            "warning",
        );
        return;
    }

    if (
        !(
            window.isSecureContext &&
            navigator.clipboard?.write &&
            window.ClipboardItem
        )
    ) {
        showModal(
            "Copy Failed",
            "Image copy requires a secure browser context.",
            "warning",
        );
        return;
    }

    try {
        let imageBlob = null;
        if (messageData?.id) {
            try {
                const mediaResource =
                    await getDecryptedMediaResource(messageData);
                if (mediaResource?.blob instanceof Blob) {
                    imageBlob = mediaResource.blob;
                }
            } catch (error) {}
        }

        if (!imageBlob) {
            const imageElement =
                messageElement?.querySelector(".message-image");
            if (
                imageElement &&
                imageElement.getAttribute("data-ready") !== "1" &&
                messageData
            ) {
                await hydrateImageMessageElement(messageElement, messageData);
            }

            const imageSource = String(
                messageElement?.querySelector(".message-image")?.src || "",
            ).trim();
            if (!imageSource) {
                showModal(
                    "Copy Failed",
                    "Image is not available yet. Try again in a moment.",
                    "warning",
                );
                return;
            }

            const response = await fetch(imageSource);
            imageBlob = await response.blob();
        }

        const mimeType = String(imageBlob?.type || "image/png") || "image/png";
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ [mimeType]: imageBlob }),
            ]);
        } catch (error) {
            const pngBlob = await convertBlobToPng(imageBlob);
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": pngBlob }),
            ]);
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
    forwardedFromMessageId = null,
) {
    const recipientKey = await getPublicKey(targetUsername);
    const senderKey = await getPublicKey(CURRENT_USER);

    const encryptedForRecipient = await encryptLongMessage(
        text,
        recipientKey,
        isTextPersian(text),
    );
    const encryptedForSender = await encryptLongMessage(
        text,
        senderKey,
        isTextPersian(text),
    );

    const formData = new FormData();
    formData.append("target", targetUsername);
    formData.append("message", encryptedForRecipient);
    formData.append("message_for_sender", encryptedForSender);
    if (replyToMessageId) {
        formData.append("reply_to_message_id", String(replyToMessageId));
    }
    if (forwardedFromMessageId) {
        formData.append(
            "forwarded_from_message_id",
            String(forwardedFromMessageId),
        );
    }

    const json = await window.ApiService.jsonOk("api/messages/send_text.php", {
        method: "POST",
        headers: getCsrfHeaders(),
        body: formData,
    });

    return json;
}

async function sendGroupTextMessage(
    groupId,
    text,
    replyToMessageId = null,
    forwardedFromMessageId = null,
) {
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
        formData.append(
            "forwarded_from_message_id",
            String(forwardedFromMessageId),
        );
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
        String(a.title || "").localeCompare(String(b.title || "")),
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
        <span class="forward-target-name">You</span>
    `;
    savedBtn.addEventListener("click", () =>
        onSelectUsername(CURRENT_USER, savedBtn),
    );
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
        button.addEventListener("click", () =>
            onSelectUsername(username, button),
        );
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
        button.addEventListener("click", () =>
            onSelectUsername(buildGroupToken(group.id), button),
        );
        wrapper.appendChild(button);
    });

    return wrapper;
}

function showMessageDetailsModal(messageElement, messageData = null) {
    const messageId = Number(
        messageElement.getAttribute("data-message-id") || 0,
    );
    const details = messageData || messageMetaById.get(messageId) || {};

    const senderId = Number(
        details.sender_id ?? messageElement.getAttribute("data-sender-id") ?? 0,
    );
    const senderUsername =
        details.sender_username ||
        messageElement.getAttribute("data-sender-username") ||
        "";
    const senderLabel =
        senderId === Number(CURRENT_USER_ID)
            ? "You"
            : senderUsername || getCurrentChatDisplayName() || "Peer";
    const messageType = String(
        details.message_type ||
            messageElement.getAttribute("data-message-type") ||
            "text",
    );
    const sentAt =
        details.created_at ||
        messageElement.getAttribute("data-created-at") ||
        "";
    const seenAt =
        details.seen_at || messageElement.getAttribute("data-seen-at") || "";
    const groupSeenAt =
        details.group_seen_at ||
        messageElement.getAttribute("data-group-seen-at") ||
        "";
    const groupSeenByUsername = details.group_seen_by_username || "";
    const editedAt =
        details.edited_at ||
        messageElement.getAttribute("data-edited-at") ||
        "";
    const fileSize =
        details.file_size ||
        messageElement.getAttribute("data-file-size") ||
        "";
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
        rows.push([
            "File Size",
            formatFileSize(Number(fileSize)) || String(fileSize),
        ]);
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
    if (messageElement.classList.contains("is-sticker-message"))
        return "sticker";
    return null;
}

async function forwardMediaToDestination(
    messageMeta,
    mediaType,
    destination,
    sourceMessageId,
) {
    const groupId = isGroupToken(destination)
        ? parseGroupIdFromToken(destination)
        : 0;
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
        if (sourceMessageId)
            payload.set("forwarded_from_message_id", String(sourceMessageId));
        await window.ApiService.jsonOk("api/messages/stickers/send.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                ...getCsrfHeaders(),
            },
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
        {
            file_name: fileName,
            mime_type: mimeType,
            file_size: Number(blob.size || 0),
        },
        context,
    );

    const formData = new FormData();
    if (groupId > 0) {
        formData.append("group_id", String(groupId));
    } else {
        formData.append("target", targetUsername);
    }
    formData.append("message", mediaPayload.messageForRecipient);
    formData.append("message_for_sender", mediaPayload.messageForSender);
    if (sourceMessageId)
        formData.append("forwarded_from_message_id", String(sourceMessageId));

    const fwdBgId = registerBackgroundUpload("forwarded " + mediaType);
    await acquireUploadSlot(fwdBgId);
    try {
        const fwdProgress = (pct, loaded, total) =>
            updateBackgroundUploadProgress(fwdBgId, pct, loaded, total);
        if (mediaType === "voice") {
            formData.append(
                "voice_file",
                mediaPayload.encryptedBlob,
                "voice_message.enc",
            );
            await uploadWithProgress(
                "api/messages/media/send_voice.php",
                formData,
                getCsrfHeaders(),
                fwdProgress,
            );
        } else if (mediaType === "image") {
            formData.append(
                "image_file",
                mediaPayload.encryptedBlob,
                "image.enc",
            );
            await uploadWithProgress(
                "api/messages/media/send_image.php",
                formData,
                getCsrfHeaders(),
                fwdProgress,
            );
        } else if (mediaType === "video") {
            formData.append("message_type", "video");
            formData.append("file", mediaPayload.encryptedBlob, "video.enc");
            await uploadWithProgress(
                "api/messages/media/send_file.php",
                formData,
                getCsrfHeaders(),
                fwdProgress,
            );
        } else {
            formData.append("message_type", "file");
            formData.append("file", mediaPayload.encryptedBlob, "file.enc");
            await uploadWithProgress(
                "api/messages/media/send_file.php",
                formData,
                getCsrfHeaders(),
                fwdProgress,
            );
        }
    } finally {
        completeBackgroundUpload(fwdBgId);
    }
}

async function forwardMessageText(messageElement) {
    const sourceMessageId = Number(
        messageElement.getAttribute("data-message-id") || 0,
    );
    const messageMeta = messageMetaById.get(sourceMessageId);
    const mediaType = getMediaMessageType(messageElement);
    const messageText = getMessageTextForCopy(messageElement);

    // Must have either text or be a known media type
    if (!messageText && !mediaType) {
        showModal(
            I18N_TEXT.forwardFailedTitle,
            I18N_TEXT.forwardFailedOnlyText,
            "warning",
        );
        return;
    }

    const content = createForwardTargetListContent(
        async (destination, button) => {
            if (!destination) {
                showModal(
                    I18N_TEXT.forwardFailedTitle,
                    I18N_TEXT.forwardFailedInvalidTarget,
                    "warning",
                );
                return;
            }

            try {
                if (button) {
                    button.disabled = true;
                    button.classList.add("is-forwarding");
                }

                if (mediaType && messageMeta) {
                    // Forward actual media
                    await forwardMediaToDestination(
                        messageMeta,
                        mediaType,
                        destination,
                        sourceMessageId || null,
                    );
                } else {
                    // Forward text
                    if (isGroupToken(destination)) {
                        const groupId = parseGroupIdFromToken(destination);
                        await sendGroupTextMessage(
                            groupId,
                            messageText,
                            null,
                            sourceMessageId || null,
                        );
                    } else {
                        await sendEncryptedTextMessage(
                            destination,
                            messageText,
                            null,
                            sourceMessageId || null,
                        );
                    }
                }
                if (!isGroupToken(destination)) addUserToChatList(destination);
                closeMessageActionModal();
                const destLabel = isGroupToken(destination)
                    ? chatGroupsById.get(parseGroupIdFromToken(destination))
                          ?.title || "group"
                    : destination;
                setComposerStatus(`Forwarded to ${destLabel}`, "success");
            } catch (error) {
                showModal(
                    I18N_TEXT.forwardFailedTitle,
                    error.message || "Unable to forward message.",
                    "error",
                );
            } finally {
                if (button) {
                    button.disabled = false;
                    button.classList.remove("is-forwarding");
                }
            }
        },
    );

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
            await forwardMediaToDestination(
                messageMeta,
                mediaType,
                CURRENT_USER,
                msgId,
            );
        } else if (messageText) {
            await sendEncryptedTextMessage(
                CURRENT_USER,
                messageText,
                null,
                msgId || null,
            );
        } else {
            throw new Error("Unable to identify message content");
        }
        addUserToChatList(CURRENT_USER, { userId: CURRENT_USER_ID });
        setComposerStatus("Saved to your messages", "success");
    } catch (error) {
        showModal(
            "Save Failed",
            error.message || "Unable to save message.",
            "error",
        );
    }
}

function formatSelectedCountLabel(count) {
    const safeCount = Math.max(0, Number(count) || 0);
    return safeCount === 1 ? "1 selected" : `${safeCount} selected`;
}

function updateSelectModeUi() {
    const selectedCount = selectedMessageIds.size;
    const hasOnlyTextSelection =
        selectedCount > 0 && areSelectedMessagesTextOnly();
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
    return (
        String(messageElement?.getAttribute("data-message-type") || "") ===
        "text"
    );
}

function areSelectedMessagesTextOnly() {
    const selectedElements = getSelectedMessageElements();
    if (!selectedElements.length) {
        return false;
    }
    return selectedElements.every((messageElement) =>
        isTextMessageElement(messageElement),
    );
}

function toSortableMessageTimestamp(messageElement) {
    const createdAtRaw = String(
        messageElement?.getAttribute("data-created-at") || "",
    ).trim();
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
        const rightId = Number(
            rightElement.getAttribute("data-message-id") || 0,
        );
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
    const messageId = Number(
        messageElement?.getAttribute("data-message-id") || 0,
    );
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
            messageId: Number(
                messageElement.getAttribute("data-message-id") || 0,
            ),
            messageText: getMessageTextForCopy(messageElement),
        }))
        .filter((item) => item.messageId > 0 && item.messageText);

    if (!selectedTextMessages.length) {
        showModal(
            "Forward Failed",
            "Only selected text messages can be forwarded.",
            "warning",
        );
        return;
    }

    const skippedCount = Math.max(
        0,
        selectedElements.length - selectedTextMessages.length,
    );
    const content = createForwardTargetListContent(
        async (destination, button) => {
            if (!destination) {
                showModal(
                    I18N_TEXT.forwardFailedTitle,
                    I18N_TEXT.forwardFailedInvalidTarget,
                    "warning",
                );
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
                                item.messageId,
                            );
                        } else {
                            await sendEncryptedTextMessage(
                                destination,
                                item.messageText,
                                null,
                                item.messageId,
                            );
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
                    ? chatGroupsById.get(parseGroupIdFromToken(destination))
                          ?.title || "group"
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
                    failedCount ? "warning" : "success",
                );
            } finally {
                button.disabled = false;
                button.classList.remove("is-forwarding");
            }
        },
    );

    openMessageActionModal("Forward Selected Messages", content);
}

async function bulkDeleteSelectedMessages() {
    const selectedElements = getSelectedMessageElements();
    if (!selectedElements.length) {
        setComposerStatus("Select at least one message to delete.", "warning");
        return;
    }

    const selectedIds = selectedElements
        .map((messageElement) =>
            Number(messageElement.getAttribute("data-message-id") || 0),
        )
        .filter((messageId) => messageId > 0);
    if (!selectedIds.length) {
        return;
    }

    const confirmed = await showConfirmModal(
        "Delete Messages",
        `Delete ${selectedIds.length} selected message${selectedIds.length === 1 ? "" : "s"}?`,
        { type: "warning", confirmLabel: "Delete" },
    );
    if (!confirmed) {
        return;
    }

    try {
        const deleteResult = await window.ApiService.jsonOk(
            "api/messages/delete.php",
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({ messages: selectedIds }),
            },
        );

        const deletedIds = Array.isArray(deleteResult?.message_ids)
            ? deleteResult.message_ids
                  .map((id) => Number(id))
                  .filter((id) => id > 0)
            : [];
        const deletedSet = new Set(deletedIds);
        const deletedCount = deletedIds.length;
        const failedCount = Math.max(0, selectedIds.length - deletedCount);

        selectedElements.forEach((messageElement) => {
            const messageId = Number(
                messageElement.getAttribute("data-message-id") || 0,
            );
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
                (item) => !deletedSet.has(Number(item.id || 0)),
            );
        }

        exitSelectMode({ clearSelection: true });
        showModal(
            "Bulk Delete",
            failedCount
                ? `Deleted ${deletedCount} message(s), ${failedCount} could not be deleted.`
                : `Deleted ${deletedCount} message(s).`,
            failedCount ? "warning" : "success",
        );
        rebuildMessageDaySeparators();
    } catch (error) {
        showModal(
            "Bulk Delete Failed",
            error?.message || "Unable to delete selected messages.",
            "error",
        );
    }
}

async function bulkCopySelectedMessages() {
    const selectedElements = getSelectedMessageElementsSortedBySentTime();
    if (!selectedElements.length) {
        setComposerStatus("Select at least one message to copy.", "warning");
        return;
    }

    if (
        !selectedElements.every((messageElement) =>
            isTextMessageElement(messageElement),
        )
    ) {
        setComposerStatus(
            "Copy is available only for text-only selection.",
            "warning",
        );
        return;
    }

    const copiedTextLines = selectedElements
        .map((messageElement) => {
            const messageText = String(
                getMessageTextForCopy(messageElement) || "",
            )
                .replace(/\s*\n+\s*/g, " ")
                .trim();
            if (!messageText) {
                return "";
            }
            const senderUsername = String(
                messageElement.getAttribute("data-sender-username") || "",
            ).trim();
            const senderLabel =
                senderUsername ||
                (messageElement.classList.contains("sent")
                    ? String(CURRENT_USER || "You")
                    : String(getCurrentChatDisplayName() || "User"));
            return `${senderLabel}: ${messageText}`;
        })
        .filter((line) => line.length > 0);

    if (!copiedTextLines.length) {
        showModal(
            "Copy Failed",
            "Only selected text messages can be copied.",
            "warning",
        );
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
        showTransientSuccessToast(
            `Copied ${copiedTextLines.length} selected message(s).`,
        );
    } catch (error) {
        showModal("Copy Failed", "Unable to copy selected messages.", "error");
    }
}

function canEditMessage(messageElement, messageData = null) {
    const senderId = Number(
        messageData?.sender_id ??
            messageElement?.getAttribute("data-sender-id") ??
            0,
    );
    if (senderId !== Number(CURRENT_USER_ID)) {
        return false;
    }
    const messageType = String(
        messageData?.message_type ??
            messageElement?.getAttribute("data-message-type") ??
            "",
    );
    if (messageType !== "text") {
        return false;
    }
    const forwardedFromMessageId = Number(
        messageData?.forwarded_from_message_id ??
            messageElement?.getAttribute("data-forwarded-from-message-id") ??
            0,
    );
    if (forwardedFromMessageId > 0) {
        return false;
    }
    const createdAtRaw =
        messageData?.created_at ||
        messageElement?.getAttribute("data-created-at") ||
        "";
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
    syncMobileComposerActions();
    syncComposerContextFlags();
    if (restoreFocus) {
        chatInput.focus();
    }
}

function beginEditMode(messageElement) {
    const messageId = Number(
        messageElement?.getAttribute("data-message-id") || 0,
    );
    if (!messageId || !canEditMessage(messageElement)) {
        showModal(
            "Edit Not Allowed",
            "This message can no longer be edited.",
            "warning",
        );
        return;
    }

    const currentText = getMessageTextForCopy(messageElement);
    if (!currentText) {
        showModal(
            "Edit Not Allowed",
            "Only text messages can be edited.",
            "warning",
        );
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
            ?.addEventListener("click", () =>
                cancelEditMode({ restoreFocus: true }),
            );
    }

    chatInput.value = currentText;
    chatInput.focus();
    chatInput.selectionStart = 0;
    chatInput.selectionEnd = chatInput.value.length;
    setComposerStatus(
        "Edit mode: press Enter to save, Esc to cancel.",
        "warning",
    );
    syncMobileComposerActions();
    syncComposerContextFlags();
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
        message: await encryptLongMessage(
            text,
            recipientKey,
            isTextPersian(text),
        ),
        message_for_sender: await encryptLongMessage(
            text,
            senderKey,
            isTextPersian(text),
        ),
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
                textSpan.innerHTML = buildMessageTextHtmlWithLinks(editedText);
            }
            const editedAt = new Date().toISOString();
            msgEl.setAttribute("data-edited-at", editedAt);
            ensureEditedMarkerPlacement(msgEl, editedAt);
        }
        cancelEditMode();
        setComposerStatus("Message edited", "success");
        return true;
    } catch (error) {
        showModal(
            "Edit Failed",
            error?.message || "Unable to edit message.",
            "error",
        );
        setComposerStatus("Unable to save edits", "error");
        return false;
    }
}

function getMessageElementById(messageId) {
    return chatMessagesElem.querySelector(
        `.message[data-message-id="${messageId}"]`,
    );
}

function ensureEditedMarkerPlacement(messageElement, editedAt = "") {
    if (!messageElement) {
        return;
    }
    const messageMetaTimes =
        messageElement.querySelectorAll(".message-meta-time");
    if (!messageMetaTimes.length) {
        return;
    }

    messageMetaTimes.forEach((timeEl) => {
        const currentMarker = timeEl.querySelector(".message-edited-marker");
        if (currentMarker) {
            currentMarker.remove();
        }
        timeEl.insertAdjacentHTML("beforeend", buildEditedMarkerHtml(editedAt));
    });

    messageElement
        .querySelectorAll(".message-edited-marker")
        .forEach((markerEl) => {
            if (!markerEl.closest(".message-meta-time")) {
                markerEl.remove();
            }
        });
}

function getReactionHostElement(messageElement) {
    if (!messageElement) {
        return null;
    }
    if (messageElement.classList.contains("group-incoming-message")) {
        return (
            messageElement.querySelector(".group-message-content") ||
            messageElement
        );
    }
    return messageElement;
}

function triggerReactionSubmitBurst(
    messageElement,
    emoji,
    { kind = "add" } = {},
) {
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
    { flashEmoji = "", removedEmoji = "" } = {},
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
                ? {
                      ...item,
                      reactions: Array.isArray(reactions) ? reactions : [],
                  }
                : item,
        );
    }

    const messageElement = getMessageElementById(normalizedMessageId);
    if (!messageElement) {
        return;
    }
    const normalizedFlashEmoji = String(flashEmoji || "").trim();
    renderMessageReactions(
        messageElement,
        meta || { id: normalizedMessageId, reactions },
        {
            flashEmoji: normalizedFlashEmoji,
        },
    );

    const normalizedRemovedEmoji = String(removedEmoji || "").trim();
    if (normalizedFlashEmoji) {
        triggerReactionSubmitBurst(messageElement, normalizedFlashEmoji, {
            kind: "add",
        });
    } else if (normalizedRemovedEmoji) {
        triggerReactionSubmitBurst(messageElement, normalizedRemovedEmoji, {
            kind: "remove",
        });
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
    const mine = meta.reactions.find(
        (item) => item?.reacted_by_me && item?.emoji,
    );
    return String(mine?.emoji || "").trim();
}

async function toggleMessageReaction(messageId, reaction) {
    const payload = {
        message_id: Number(messageId || 0),
        reaction: String(reaction || "").trim(),
    };
    const previousReaction = getCurrentUserReactionEmoji(payload.message_id);
    const data = await window.ApiService.jsonOk(
        "api/messages/toggle_reaction.php",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getCsrfHeaders(),
            },
            body: JSON.stringify(payload),
        },
    );
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

    const messageId = Number(
        messageElement.getAttribute("data-message-id") || 0,
    );
    const reactions = Array.isArray(messageData?.reactions)
        ? messageData.reactions
        : [];

    REACTION_EMOJI_SET.forEach((emoji) => {
        const reactionMeta =
            reactions.find((item) => item?.emoji === emoji) || null;
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
                showModal(
                    I18N_TEXT.reactFailedTitle,
                    error.message || I18N_TEXT.reactFailedBody,
                    "error",
                );
            } finally {
                button.disabled = false;
            }
        });
        wrapper.appendChild(button);
    });

    return wrapper;
}

function openReactionPickerFromContext(messageElement, messageData = null) {
    const messageId = Number(
        messageElement.getAttribute("data-message-id") || 0,
    );
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

    lastReactionPickerMessageElement = messageElement;
    repositionReactionPickerForMessage(messageElement, picker);
    suppressReactionPickerAutoCloseUntil = Date.now() + 450;
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
    const messageId = Number(
        messageElement.getAttribute("data-message-id") || 0,
    );
    if (!messageId) {
        showModal("Delete Failed", "Invalid message id.", "warning");
        return;
    }

    const confirmed = await showConfirmModal(
        "Delete Message",
        "Delete this message?",
        { type: "warning", confirmLabel: "Delete" },
    );
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
                (item) => Number(item.id) !== messageId,
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
        // Update local playlist cache (DB CASCADE removes the row server-side)
        if (playlistCache) {
            playlistCache = playlistCache.filter(
                (t) => Number(t.msgId) !== messageId,
            );
        }
    } catch (error) {
        showModal(
            "Delete Failed",
            error.message || "Unable to delete message.",
            "error",
        );
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
    } = {},
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
    const isVoiceMessage =
        messageElement.classList.contains("is-voice-message");
    const isMultimediaMessage =
        isVoiceMessage ||
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
        const msgId = Number(
            messageElement.getAttribute("data-message-id") || 0,
        );
        if (!msgId) return;
        const currentEmoji = getCurrentUserReactionEmoji(msgId);
        const newEmoji = currentEmoji === "\u2764\uFE0F" ? "" : "\u2764\uFE0F";
        toggleMessageReaction(msgId, newEmoji).catch(() => {});
    };

    const openContextMenu = (
        clientX,
        clientY,
        { focusFirstItem = true } = {},
    ) => {
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
            copyImageBtn.innerHTML =
                '<i class="fas fa-image me-2"></i>Copy image';
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
            selectBtn.innerHTML =
                '<i class="fas fa-check-square me-2"></i>Select messages';
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
            forwardBtn.innerHTML =
                '<i class="fas fa-share-from-square me-2"></i>Forward';
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
            addPlaylistBtn.innerHTML =
                '<i class="fas fa-list-ul me-2"></i>Add to Playlist';
            addPlaylistBtn.addEventListener("click", async () => {
                closeMessageContextMenu();
                const msgId = Number(
                    messageElement.getAttribute("data-message-id") || 0,
                );
                if (!msgId) return;
                const titleEl = messageElement.querySelector(".music-title");
                const title = titleEl?.textContent || "Unknown";
                const formatEl = messageElement.querySelector(".music-format");
                const ext = formatEl?.textContent || "";
                await addToPlaylist(msgId, title, ext);
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
            detailsBtn.innerHTML =
                '<i class="fas fa-circle-info me-2"></i>Details';
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
            const firstMenuButton = menu.querySelector(
                ".message-context-menu-item",
            );
            firstMenuButton?.focus();
        }
    };

    messageElement.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        openContextMenu(event.clientX, event.clientY);
    });

    messageElement.addEventListener("keydown", (event) => {
        if (
            event.key === "ContextMenu" ||
            (event.shiftKey && event.key === "F10")
        ) {
            event.preventDefault();
            const rect = messageElement.getBoundingClientRect();
            openContextMenu(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
            );
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
                const touchPoint =
                    event.touches?.[0] || event.changedTouches?.[0];
                if (!touchPoint) {
                    return;
                }
                longPressTriggered = true;

                if (isMultimediaMessage) {
                    // Multimedia messages: long-press opens context menu
                    suppressNextContextMenuTapUntil = Date.now() + 420;
                    openContextMenu(touchPoint.clientX, touchPoint.clientY, {
                        focusFirstItem: false,
                    });
                } else {
                    // Text messages: long-press enters select mode
                    if (canSelect) {
                        enterSelectMode(messageElement);
                    }
                }
            }, MESSAGE_LONG_PRESS_MS);
        },
        { passive: true },
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
            if (
                deltaX > LONG_PRESS_MOVE_CANCEL_PX ||
                deltaY > LONG_PRESS_MOVE_CANCEL_PX
            ) {
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
            const clampedDelta =
                Math.sign(rawDeltaX) * Math.min(deltaX, SWIPE_MAX_TRANSLATE_PX);

            // Only allow swipe in the committed direction
            if (
                (swipeDirection === 1 && rawDeltaX <= 0) ||
                (swipeDirection === -1 && rawDeltaX >= 0)
            ) {
                messageElement.style.transform = "";
                return;
            }

            messageElement.style.transform = `translateX(${clampedDelta}px)`;
            messageElement.style.transition = "none";

            // Show/hide swipe hint icon
            const progress = deltaX / SWIPE_THRESHOLD_PX;
            messageElement.classList.toggle("swipe-ready", progress >= 1);
        },
        { passive: true },
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
        messageElement.addEventListener("transitionend", cleanup, {
            once: true,
        });
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
                    const msgId = Number(
                        messageElement.getAttribute("data-message-id") || 0,
                    );
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
            const deltaY = Math.abs(
                Number(touchPoint.clientY || 0) - touchStartY,
            );

            if (
                Math.abs(finalDeltaX) >= SWIPE_THRESHOLD_PX &&
                deltaY < SWIPE_VERTICAL_LOCK_PX * 3
            ) {
                event.preventDefault();
                event.stopPropagation();

                if (finalDeltaX > 0 && canReply) {
                    // Swipe right → Reply
                    setReplyState(messageElement);
                    chatInput?.focus();
                } else if (finalDeltaX < 0) {
                    // Swipe left
                    const isSent = messageElement.classList.contains("sent");
                    if (
                        isSent &&
                        canEdit &&
                        canEditMessage(messageElement, messageData)
                    ) {
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
            const wasTap =
                totalMoveX < LONG_PRESS_MOVE_CANCEL_PX &&
                totalMoveY < LONG_PRESS_MOVE_CANCEL_PX;

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

                if (
                    !isMultimediaMessage &&
                    !isSelectModeActive &&
                    !event.target?.closest?.(".reply-quote")
                ) {
                    // Text messages: delayed context menu (cancelled if double-tap follows)
                    if (singleTapTimer) clearTimeout(singleTapTimer);
                    singleTapTimer = setTimeout(() => {
                        singleTapTimer = null;
                        if (isSelectModeActive) return;
                        suppressNextContextMenuTapUntil = Date.now() + 420;
                        openContextMenu(currentX, currentY, {
                            focusFirstItem: false,
                        });
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
                    const msgId = Number(
                        messageElement.getAttribute("data-message-id") || 0,
                    );
                    if (msgId) playVoiceMessage(msgId);
                }
                return;
            }

            // Don't intercept clicks on interactive child elements
            if (
                event.target.closest(
                    "a, button, .message-reaction-chip, .voice-play-btn, .reply-quote",
                )
            ) {
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
        true,
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

        const onBars =
            isVoiceMessage && !!event.target.closest(".waveform-bars");
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
            if (
                mouseDragInfo.onBars &&
                !mouseDragInfo.barDragActive &&
                !mouseDragInfo.swipeActive
            ) {
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
            const clampedDelta =
                Math.sign(rawDeltaX) * Math.min(deltaX, SWIPE_MAX_TRANSLATE_PX);
            if (
                (mouseDragInfo.swipeDirection === 1 && rawDeltaX <= 0) ||
                (mouseDragInfo.swipeDirection === -1 && rawDeltaX >= 0)
            ) {
                messageElement.style.transform = "";
                return;
            }
            messageElement.style.transform = `translateX(${clampedDelta}px)`;
            messageElement.style.transition = "none";
            messageElement.classList.toggle(
                "swipe-ready",
                deltaX / SWIPE_THRESHOLD_PX >= 1,
            );
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

                if (
                    Math.abs(finalDeltaX) >= SWIPE_THRESHOLD_PX &&
                    finalDeltaY < SWIPE_VERTICAL_LOCK_PX * 3
                ) {
                    if (finalDeltaX > 0 && canReply) {
                        setReplyState(messageElement);
                        chatInput?.focus();
                    } else if (finalDeltaX < 0) {
                        const isSent =
                            messageElement.classList.contains("sent");
                        if (
                            isSent &&
                            canEdit &&
                            canEditMessage(messageElement, messageData)
                        ) {
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
    messageElement._openContextMenu = (x, y) =>
        openContextMenu(x, y, { focusFirstItem: false });
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
    true,
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
        if (Date.now() < suppressReactionPickerAutoCloseUntil) {
            return;
        }
        const detailsMenu = document.getElementById("detailsMusicContextMenu");
        const menu = document.getElementById("messageContextMenu");
        if (!menu) {
            const picker = document.getElementById("messageReactionPicker");
            if (!picker && !detailsMenu) {
                return;
            }
            if (!event.target.closest("#messageReactionPicker")) {
                closeReactionPicker({ restoreFocus: false });
            }
            if (!event.target.closest("#detailsMusicContextMenu")) {
                closeDetailsMusicContextMenu({ restoreFocus: false });
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
        if (detailsMenu && !event.target.closest("#detailsMusicContextMenu")) {
            closeDetailsMusicContextMenu({ restoreFocus: false });
        }
    },
    true,
);

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        document.getElementById("detailsMusicContextMenu")
    ) {
        event.preventDefault();
        closeDetailsMusicContextMenu();
        return;
    }

    if (
        event.key === "Escape" &&
        document.getElementById("messageReactionPicker")
    ) {
        event.preventDefault();
        closeReactionPicker();
        return;
    }

    const menu = document.getElementById("messageContextMenu");
    if (!menu) {
        return;
    }

    const items = Array.from(
        menu.querySelectorAll(".message-context-menu-item"),
    );
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
        const nextIndex =
            currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
        items[nextIndex].focus();
    }
    if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex =
            currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        items[nextIndex].focus();
    }
});

document.addEventListener(
    "scroll",
    () => {
        if (document.getElementById("messageReactionPicker")) {
            scheduleReactionPickerReposition();
        }
        if (document.getElementById("detailsMusicContextMenu")) {
            closeDetailsMusicContextMenu({ restoreFocus: false });
        }
    },
    true,
);

window.addEventListener("resize", () => {
    if (document.getElementById("messageReactionPicker")) {
        scheduleReactionPickerReposition();
    }
    if (document.getElementById("detailsMusicContextMenu")) {
        closeDetailsMusicContextMenu({ restoreFocus: false });
    }
});

document.addEventListener("scroll", closeMessageContextMenu, true);

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

        if (
            horizonClickTimer &&
            Math.abs(event.clientX - horizonLastClickX) < 80 &&
            Math.abs(event.clientY - horizonLastClickY) < 30
        ) {
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
        const heightDifference = lastViewportHeight - window.innerHeight;
        const shouldStickToBottomOnResize =
            appSettings.autoScrollEnabled &&
            !hasLoadedMoreMessages &&
            (isChatInputFocused || isChatNearBottom(140));
        if (Math.abs(heightDifference) > 150) {
            const chatContainer = document.querySelector(".chat-container");
            if (chatContainer) {
                chatContainer.style.height = `calc(100vh - 60px)`;
            }

            if (shouldStickToBottomOnResize) {
                if (mobileResizeSnapTimerId) {
                    clearTimeout(mobileResizeSnapTimerId);
                    mobileResizeSnapTimerId = 0;
                }
                mobileResizeSnapTimerId = setTimeout(() => {
                    if (chatMessagesElem) {
                        chatMessagesElem.scrollTop =
                            chatMessagesElem.scrollHeight;
                    }
                    mobileResizeSnapTimerId = 0;
                }, 300);
            }
        }
    }
    lastViewportHeight = window.innerHeight;
});

window.addEventListener("load", () => {
    initialViewportHeight = window.innerHeight;
    lastViewportHeight = window.innerHeight;
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
            existingItem.style.display = appSettings.showSavedMessages
                ? ""
                : "none";
        }
        const existingAvatarImage =
            existingItem?.querySelector(".avatar-image");
        if (existingAvatarImage && userId > 0) {
            existingAvatarImage.setAttribute(
                "data-avatar-user-id",
                String(userId),
            );
            existingAvatarImage.src = buildAvatarUrl({
                userId,
                username,
                size: 84,
            });
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
        li.setAttribute("aria-label", "Open your messages");
        li.innerHTML = `<span class="avatar saved-messages-avatar"><i class="fas fa-bookmark"></i></span> <span>You</span><span class="chat-item-unread-badge" style="display:none;" aria-label="Unread messages">0</span><span id='${chatListSpinnerId(
            username,
        )}' style="display:none" class="spinner-border spinner-border-sm text-primary ms-2" role="status" aria-hidden="true"></span>`;
        if (!appSettings.showSavedMessages) li.style.display = "none";
    } else {
        li.setAttribute("aria-label", `Open chat with ${username}`);
        li.innerHTML = `<span class="avatar">${buildAvatarImageHtml({ userId, username, className: "avatar-image", size: 84 })}</span> <span>${escapeHtml(username)}</span><span class="chat-item-unread-badge" style="display:none;" aria-label="Unread messages">0</span><span id='${chatListSpinnerId(
            username,
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
        const unreadCount = Math.max(
            0,
            Number(chatGroupsById.get(groupId)?.unread_count || 0),
        );
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
    setGroupUnreadBadge(
        token,
        Math.max(0, Number(chatGroupsById.get(groupId)?.unread_count || 0)),
    );
    return true;
}

function updateLoadingSpinnerState(chatTarget, show = false) {
    const loadingSpinnerElement = document.getElementById(
        chatListSpinnerId(chatTarget),
    );
    if (loadingSpinnerElement) {
        loadingSpinnerElement.style = `display: ${show ? "inline" : "none"}`;
    }
}

async function selectChatTarget(target) {
    const previousChatTarget = currentChatUser;
    if (
        previousChatTarget &&
        typingStateByTarget.get(previousChatTarget) === true
    ) {
        updateTypingStatus(false, previousChatTarget);
    }

    if (typingStopTimer) {
        clearTimeout(typingStopTimer);
        typingStopTimer = null;
    }

    if (currentChatUser?.length) {
        updateLoadingSpinnerState(currentChatUser, false);
    }

    document
        .getElementById(chatListItemId(currentChatUser))
        ?.classList.remove("selected-chat");
    currentChatUser = target;
    currentChatRecentMessages = null;
    lastRecentPollTime = "";
    document
        .getElementById(chatListItemId(currentChatUser))
        ?.classList.add("selected-chat");
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
    if (
        globalNpAudio &&
        globalNpAudio.parentElement &&
        chatMessagesElem.contains(globalNpAudio)
    ) {
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
    userInfoBtn &&
        (userInfoBtn.hidden =
            isGroup ||
            !currentChatUser ||
            isSavedMessagesChat(currentChatUser));
    if (savedMessagesInfoBtn)
        savedMessagesInfoBtn.hidden = !isSavedMessagesChat(currentChatUser);
    if (alertPanelBtn) alertPanelBtn.hidden = Boolean(currentChatUser);
    if (groupInfoBtn) {
        groupInfoBtn.setAttribute("aria-expanded", "false");
    }
    closeGroupInfoPanel();
    closeSavedMessagesInfoPanel();
    closePrivateChatInfoPanel();
    setTypingIndicator("");
    if (!isGroupToken(target)) {
        setUserUnreadBadge(target, 0);
    }

    [...chatListElem.children].forEach((li) => {
        li.classList.toggle("active", li.id === chatListItemId(target));
    });

    if (typeof window.setMobileChatSelected === "function") {
        window.setMobileChatSelected(Boolean(target));
    }
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
        setComposerStatus(
            "Unable to initialize group encryption key",
            "warning",
        );
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

async function loadMessages(
    chatTarget,
    showLoading = false,
    isInitialLoad = false,
) {
    if (isLoadingMessages) return;

    const loadingSpinnerElement = document.getElementById(
        chatListSpinnerId(chatTarget),
    );
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

        const data = await window.ApiService.json(
            `api/messages/fetch.php?${query.toString()}`,
        );
        clearInlineChatState();
        setComposerStatus("");

        if (isInitialLoad) {
            if (!data.messages.length) {
                chatMessagesElem.innerHTML = "";
                showEmptyChatState(
                    isGroupToken(chatTarget)
                        ? "No messages in this group yet. Start the conversation."
                        : "No messages yet. Start the conversation.",
                );
                currentChatRecentMessages = [];
                messageOffset = 0;
                return;
            }
            if (currentChatRecentMessages?.length) {
                const lastMessage = data.messages?.[data.messages.length - 1],
                    previosLastMessageId =
                        currentChatRecentMessages?.[
                            currentChatRecentMessages.length - 1
                        ]?.id;
                if (
                    lastMessage &&
                    previosLastMessageId &&
                    lastMessage.id <= previosLastMessageId
                ) {
                    return;
                }
            }
            chatMessagesElem.innerHTML = "";
            messageOffset = 0;
            currentChatRecentMessages = data?.messages ?? [];
        }
        messageOffset += data.messages?.length ?? 0;
        hasMoreMessages = data.hasMore;

        if (isInitialLoad) {
            isBatchRendering = true;
            for (const msg of data.messages) {
                await addMessageToChat(msg);
            }
            isBatchRendering = false;
            rebuildMessageDaySeparators();

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
            const topVisibleAnchorBeforePrepend = captureViewportAnchor();
            const scrollTopBeforePrepend = chatMessagesElem.scrollTop;
            const scrollHeightBeforePrepend = chatMessagesElem.scrollHeight;
            const previousInlineScrollBehavior =
                chatMessagesElem.style.scrollBehavior;
            chatMessagesElem.style.scrollBehavior = "auto";
            const loadMoreBtn = document.getElementById("loadMoreBtn");
            const insertBeforeNode = loadMoreBtn
                ? loadMoreBtn.nextSibling
                : chatMessagesElem.firstChild;
            const prependFragment = document.createDocumentFragment();
            try {
                isBatchRendering = true;
                for (let i = data.messages.length - 1; i >= 0; i--) {
                    const messageNode = await addMessageToChat(
                        data.messages[i],
                        true,
                        { deferInsert: true },
                    );
                    if (messageNode instanceof HTMLElement) {
                        messageNode.style.animation = "none";
                        prependFragment.appendChild(messageNode);
                    }
                }
                chatMessagesElem.insertBefore(
                    prependFragment,
                    insertBeforeNode || null,
                );
                isBatchRendering = false;
                rebuildMessageDaySeparators();
                if (hasMoreMessages) {
                    addLoadMoreButton();
                } else {
                    document.getElementById("loadMoreBtn")?.remove();
                }

                if (topVisibleAnchorBeforePrepend?.id) {
                    restoreViewportAnchor(topVisibleAnchorBeforePrepend);
                    stabilizeViewportAnchor(topVisibleAnchorBeforePrepend, 28);
                } else {
                    const finalHeightDelta =
                        chatMessagesElem.scrollHeight -
                        scrollHeightBeforePrepend;
                    chatMessagesElem.scrollTop =
                        scrollTopBeforePrepend + finalHeightDelta;
                }
            } finally {
                isBatchRendering = false;
                chatMessagesElem.style.scrollBehavior =
                    previousInlineScrollBehavior;
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
        if (loadingSpinnerElement)
            loadingSpinnerElement.style = "display: none";
        isLoadingMessages = false;
    }
}

async function showBrowserNotification(lastMsg, newCount) {
    try {
        const senderName =
            lastMsg.sender_username || lastMsg.sender_id || "Someone";
        let body = "";
        if (newCount > 1) {
            body = `${newCount} new messages`;
        } else if (lastMsg.message_type === "text") {
            try {
                const isGroup = Number(lastMsg.group_id || 0) > 0;
                if (isGroup) {
                    const gKey = await getGroupCryptoKey(
                        Number(lastMsg.group_id),
                    );
                    const payload =
                        lastMsg.message || lastMsg.message_for_sender || "";
                    body = await decryptGroupMessage(String(payload), gKey);
                } else {
                    body = await decryptLongMessage(lastMsg.message);
                }
                if (body.length > 120) body = body.slice(0, 120) + "...";
            } catch (_) {
                body = "New message";
            }
        } else {
            const typeLabels = {
                image: "Photo",
                voice: "Voice message",
                video: "Video",
                file: "File",
                sticker: "Sticker",
            };
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
                await reg.showNotification(
                    `${senderName} — TinTinChat`,
                    notifOptions,
                );
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
            Array.isArray(currentChatRecentMessages) &&
            currentChatRecentMessages.length
                ? Number(
                      currentChatRecentMessages[
                          currentChatRecentMessages.length - 1
                      ].id || 0,
                  )
                : 0;
        const query = buildChatQueryParams(currentChatUser, {
            offsetMsgId,
            editedSince: lastRecentPollTime || undefined,
        });
        const data = await window.ApiService.json(
            `api/messages/fetch_recent.php?${query.toString()}`,
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
        const newMessages = data.messages.filter(
            (m) => Number(m.id) > offsetMsgId,
        );
        const lastNew = newMessages.length
            ? newMessages[newMessages.length - 1]
            : null;

        if (lastNew && Number(lastNew.sender_id) !== Number(CURRENT_USER_ID)) {
            if (appSettings.notificationSoundEnabled) {
                try {
                    playNotificationSound();
                } catch (_) {}
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

        const editedMessages = data.messages.filter(
            (msg) => Number(msg.id) <= offsetMsgId,
        );

        for (const msg of newMessages) {
            await addMessageToChat(msg, false, true);
        }

        for (const msg of editedMessages) {
            const editedMessageId = Number(msg?.id || 0);
            if (editedMessageId <= 0) {
                continue;
            }
            if (!getMessageElementById(editedMessageId)) {
                continue;
            }
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
    if (
        !currentChatUser ||
        !pendingSeenMessageIds.size ||
        !navigator.onLine ||
        isGroupToken(currentChatUser)
    ) {
        return;
    }

    const ids = Array.from(pendingSeenMessageIds).slice(0, 200);
    const query = buildChatQueryParams(currentChatUser, {
        message_ids: ids.join(","),
    });

    try {
        const data = await window.ApiService.json(
            `api/messages/fetch_seen.php?${query.toString()}`,
            {
                cache: "no-store",
            },
        );
        if (!data || data.status !== "ok") {
            return;
        }
        if (Array.isArray(data.seen_messages) && data.seen_messages.length) {
            data.seen_messages.forEach((item) => {
                const seenId = Number(item?.id || 0);
                if (!seenId) {
                    return;
                }
                const seenAt =
                    typeof item?.seen_at === "string" ? item.seen_at : "";
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
window.__ttcPushUiBackLayer = pushUiBackLayer;
window.__ttcRemoveUiBackLayer = removeUiBackLayer;
window.__ttcRequestUiLayerClose = requestUiLayerClose;
window.__ttcUiBackLayerKeys = UI_BACK_LAYER_KEYS;

function generateWaveformBars() {
    const bars = [];
    const barCount = 45;
    for (let i = 0; i < barCount; i++) {
        const height = Math.random() * 65 + 12;
        const normalizedHeight = Math.max(10, Math.round(height));
        bars.push(
            `<div class="waveform-bar" data-bar-index="${i}" data-base-height="${normalizedHeight}" style="height: ${normalizedHeight}%"></div>`,
        );
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
        btn.innerHTML =
            '<i class="fas fa-chevron-up me-1"></i>Load More Messages';
    }

    updateGoToLatestButton();
}

function targetElement_playHighlight(el) {
    el.classList.remove("reply-target-highlight");
    // Clear any inline animation override (prepended messages set animation:none)
    el.style.animation = "";
    void el.offsetWidth; // force reflow to restart animation if re-triggered
    el.classList.add("reply-target-highlight");
    setTimeout(() => el.classList.remove("reply-target-highlight"), 2500);
}

function scrollToMessageAndHighlight(targetElement) {
    // Step 1: Scroll to the element (smooth)
    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    // Step 2: Wait for scroll to finish, THEN play highlight animation
    // Use IntersectionObserver to detect when element is actually in view
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                // Small extra delay so the scroll fully settles visually
                setTimeout(
                    () => targetElement_playHighlight(targetElement),
                    150,
                );
            }
        },
        { root: chatMessagesElem, threshold: 0.5 },
    );
    observer.observe(targetElement);
    // Safety: if observer never fires (edge case), highlight after 2s
    setTimeout(() => {
        observer.disconnect();
        if (!targetElement.classList.contains("reply-target-highlight")) {
            targetElement_playHighlight(targetElement);
        }
    }, 2000);
}

async function scrollToReplyTarget(targetId) {
    const normalizedTargetId = Number(targetId || 0);
    if (!normalizedTargetId) {
        setComposerStatus(
            "Original message is no longer available.",
            "warning",
        );
        return;
    }

    // 1. Check if already in DOM
    let targetMessage = chatMessagesElem.querySelector(
        `[data-message-id="${normalizedTargetId}"]`,
    );
    if (targetMessage) {
        scrollToMessageAndHighlight(targetMessage);
        return;
    }

    // 2. Not loaded — try targeted fetch and then incremental loading fallback
    if (!currentChatUser) {
        setComposerStatus(
            "Original message is no longer available.",
            "warning",
        );
        return;
    }

    setComposerStatus("Loading messages...", "success");
    try {
        const centerTargetMessage = async (targetElement) => {
            if (!(targetElement instanceof HTMLElement) || !chatMessagesElem) {
                return;
            }
            const containerRect = chatMessagesElem.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            const idealTop =
                containerRect.top +
                chatMessagesElem.clientHeight / 2 -
                targetRect.height / 2;
            const delta = targetRect.top - idealTop;
            if (Math.abs(delta) > 0.5) {
                chatMessagesElem.scrollTop += delta;
            }
            await new Promise((r) =>
                requestAnimationFrame(() => requestAnimationFrame(r)),
            );
        };

        const query = buildChatQueryParams(currentChatUser, {
            offset: 0,
            target_id: normalizedTargetId,
        });
        const data = await window.ApiService.json(
            `api/messages/fetch.php?${query.toString()}`,
        );

        if (Array.isArray(data?.messages) && data.messages.length) {
            const existingLoadMore = document.getElementById("loadMoreBtn");
            if (existingLoadMore) existingLoadMore.remove();

            const viewportAnchor = captureViewportAnchor();
            let addedCount = 0;

            isBatchRendering = true;
            for (let i = data.messages.length - 1; i >= 0; i--) {
                const incoming = data.messages[i];
                const incomingId = Number(incoming?.id || 0);
                if (
                    incomingId > 0 &&
                    chatMessagesElem.querySelector(
                        `.message[data-message-id="${incomingId}"]`,
                    )
                ) {
                    messageMetaById.set(incomingId, incoming);
                    continue;
                }
                await addMessageToChat(incoming, true);
                addedCount++;
            }
            isBatchRendering = false;

            restoreViewportAnchor(viewportAnchor);

            if (addedCount > 0) {
                messageOffset += addedCount;
            }
            hasMoreMessages = Boolean(data?.hasMore) || hasMoreMessages;
            if (hasMoreMessages) addLoadMoreButton();
            updateGoToLatestButton();
        }

        // Now find the target — wait for layout to settle, then scroll once + highlight
        targetMessage = chatMessagesElem.querySelector(
            `[data-message-id="${normalizedTargetId}"]`,
        );
        let safety = 0;
        while (!targetMessage && safety < 180) {
            safety++;
            const beforeOffset = Number(messageOffset || 0);
            const beforeHasMore = Boolean(hasMoreMessages);
            await loadMessages(currentChatUser, false, false);
            targetMessage = chatMessagesElem.querySelector(
                `[data-message-id="${normalizedTargetId}"]`,
            );
            if (targetMessage) {
                break;
            }
            if (!beforeHasMore && Number(messageOffset || 0) === beforeOffset) {
                break;
            }
            if (
                !hasMoreMessages &&
                Number(messageOffset || 0) === beforeOffset
            ) {
                break;
            }
        }

        if (!targetMessage) {
            setComposerStatus(
                "Could not find the original message.",
                "warning",
            );
            return;
        }

        setComposerStatus("");
        await new Promise((r) => setTimeout(r, 220));
        await centerTargetMessage(targetMessage);
        await centerTargetMessage(targetMessage);
        targetElement_playHighlight(targetMessage);
    } catch {
        setComposerStatus("Failed to load messages.", "error");
    }
}

function newDateTag(
    msg,
    {
        atLeft = true,
        topSpace = 3,
        fontSize = 10,
        strictMargins = false,
        extraStyles = "",
        editedAt = "",
    },
) {
    const timeLabel = formatMessageTimeLabel(msg.created_at);
    const margins = strictMargins
        ? `mt-${topSpace}`
        : `mt-0 mt-lg-${topSpace} mt-md-${topSpace}`;
    const editedMarker = editedAt ? buildEditedMarkerHtml(editedAt) : "";
    return `<span class="message-meta-time mx-2 ${margins}" style="font-size: ${fontSize}px; float: ${
        atLeft ? "left" : "right"
    };${extraStyles}">${escapeHtml(timeLabel)}${editedMarker}</span>`;
}

function buildEditedMarkerHtml(editedAt = "") {
    const title = editedAt
        ? `Edited at ${formatMessageTimestamp(editedAt)}`
        : "Edited";
    return `<span class="message-edited-marker" title="${escapeHtml(title)}" aria-label="Edited"><i class="fas fa-pen" aria-hidden="true"></i></span>`;
}

function buildMessageTextHtmlWithLinks(text) {
    const rawText = String(text || "");
    if (!rawText.length) {
        return "";
    }

    const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
    let html = "";
    let lastIndex = 0;

    const splitTrailingPunctuation = (url) => {
        let value = String(url || "").trim();
        const trailingMatch = value.match(/[),.!?;:]+$/);
        const trailing = trailingMatch ? trailingMatch[0] : "";
        if (trailing) {
            value = value.slice(0, -trailing.length);
        }
        return { core: value, trailing };
    };

    let match;
    while ((match = urlRegex.exec(rawText)) !== null) {
        const fullMatch = String(match[0] || "");
        const start = Number(match.index || 0);
        const end = start + fullMatch.length;

        if (start > lastIndex) {
            html += escapeHtml(rawText.slice(lastIndex, start));
        }

        const { core, trailing } = splitTrailingPunctuation(fullMatch);
        if (!core.length) {
            html += escapeHtml(fullMatch);
            lastIndex = end;
            continue;
        }

        const href = core.toLowerCase().startsWith("www.")
            ? `https://${core}`
            : core;
        html += `<a class="message-text-link" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(core)}</a>${escapeHtml(trailing)}`;
        lastIndex = end;
    }

    if (lastIndex < rawText.length) {
        html += escapeHtml(rawText.slice(lastIndex));
    }

    return html;
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

    const messageElements = Array.from(
        chatMessagesElem.querySelectorAll(".message"),
    );
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

/* ── Conversation Search → chat-conversation-search.js ──
 * resetConversationSearchHighlights, cancelConversationSearch,
 * updateConversationSearchCounter, focusConversationSearchResult,
 * runConversationSearch, highlightConversationSearchHits,
 * runConversationSearchAsync, navigateConversationSearch,
 * openConversationSearchBar, closeConversationSearchBar,
 * bindConversationSearchEvents */

function renderMessageReactions(
    messageElement,
    messageData,
    { flashEmoji = "" } = {},
) {
    if (!messageElement) {
        return;
    }

    messageElement
        .querySelectorAll(".message-reactions")
        .forEach((node) => node.remove());
    messageElement.classList.remove("message-has-reactions");

    if (
        !Array.isArray(messageData?.reactions) ||
        !messageData.reactions.length
    ) {
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
                await toggleMessageReaction(
                    Number(messageData?.id || 0),
                    currentEmoji,
                );
            } catch (error) {
                showModal(
                    I18N_TEXT.reactFailedTitle,
                    error.message || I18N_TEXT.reactFailedBody,
                    "error",
                );
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

async function addMessageToChat(msg, prepend = false, options = {}) {
    const deferInsert = Boolean(options?.deferInsert);
    const normalizedMessageId = Number(msg?.id || 0);
    if (normalizedMessageId > 0) {
        const existingMessageElement = chatMessagesElem.querySelector(
            `.message[data-message-id="${normalizedMessageId}"]`,
        );
        if (existingMessageElement) {
            const prevMeta = messageMetaById.get(normalizedMessageId);
            messageMetaById.set(normalizedMessageId, msg);
            renderMessageReactions(existingMessageElement, msg);
            updateMessageTickStatus(
                normalizedMessageId,
                Boolean(msg.seen_at),
                msg.seen_at || "",
            );
            if (
                msg.edited_at &&
                msg.edited_at !== (prevMeta?.edited_at || "")
            ) {
                try {
                    const isGroup = Number(msg.group_id || 0) > 0;
                    let newText = "";
                    if (isGroup) {
                        const gKey = await getGroupCryptoKey(
                            Number(msg.group_id),
                        );
                        const payload =
                            msg.sender_id == CURRENT_USER_ID
                                ? msg.message_for_sender || msg.message || ""
                                : msg.message || msg.message_for_sender || "";
                        newText = await decryptGroupMessage(
                            String(payload),
                            gKey,
                        );
                    } else {
                        newText = await decryptLongMessage(
                            msg.sender_id == CURRENT_USER_ID
                                ? msg.message_for_sender
                                : msg.message,
                        );
                    }
                    const textSpan = existingMessageElement.querySelector(
                        ".message-text-content",
                    );
                    if (textSpan) {
                        textSpan.innerHTML =
                            buildMessageTextHtmlWithLinks(newText);
                    }
                    existingMessageElement.setAttribute(
                        "data-edited-at",
                        msg.edited_at || "",
                    );
                    ensureEditedMarkerPlacement(
                        existingMessageElement,
                        msg.edited_at || "",
                    );
                } catch (_) {
                    /* decryption failure — leave existing text */
                }
            }
            return existingMessageElement;
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

    // Pre-compute reply quote HTML for all message types (text branch handles its own)
    let replyHtml = "";
    if (msg.reply_message_id && msg.message_type !== "text") {
        let decryptedReplyText = "";
        if (msg.reply_message_type === "text") {
            try {
                const isGroup = Number(msg.group_id || 0) > 0;
                const replyPayload = isGroup
                    ? msg.reply_message || msg.reply_message_for_sender
                    : msg.reply_sender_id == CURRENT_USER_ID
                      ? msg.reply_message_for_sender
                      : msg.reply_message;
                if (replyPayload) {
                    if (isGroup) {
                        const gk = await getGroupCryptoKey(
                            Number(msg.group_id),
                        );
                        decryptedReplyText = await decryptGroupMessage(
                            String(replyPayload),
                            gk,
                        );
                    } else {
                        decryptedReplyText =
                            await decryptLongMessage(replyPayload);
                    }
                }
            } catch (_) {}
        }
        replyHtml = buildReplyPreviewHtml(msg, decryptedReplyText);
    }

    if (msg.message_type === "voice" && msg.voice_file_path) {
        div.classList.add("is-voice-message");
        hasContextActions = true;
        canReact = true;
        canForward = !isFilePurged;

        if (isFilePurged) {
            div.innerHTML = `
              ${buildForwardedPreviewHtml(msg)}${replyHtml}
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
                atLeft: msg.sender_id != CURRENT_USER_ID,
                topSpace: 1,
                fontSize: 8.5,
                extraStyles: "color: var(--text-color); font-weight: 600;",
            })}
            `;
        } else {
            div.innerHTML = `
              ${buildForwardedPreviewHtml(msg)}${replyHtml}
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
                atLeft: msg.sender_id != CURRENT_USER_ID,
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
            div.innerHTML = `${buildForwardedPreviewHtml(msg)}${replyHtml}<div class="file-purged-media-placeholder">
                    <i class="fas fa-image file-purged-media-icon"></i>
                    <div class="file-purged-badge"><i class="fas fa-clock"></i> File expired</div>
                </div>${newDateTag(msg, {
                    atLeft: msg.sender_id != CURRENT_USER_ID,
                    topSpace: 1,
                    fontSize: 8.5,
                    extraStyles: "color: var(--text-color); font-weight: 600;",
                })}`;
        } else {
            div.innerHTML = `${buildForwardedPreviewHtml(msg)}${replyHtml}<a href="#" class="image-message-link" title="View full image">
                    <img src="" class="message-image" alt="Encrypted image" data-ready="0" style="display:none;">
                    <div class="image-message-loading" style="padding: 20px; text-align: center; color: #6c757d;">Decrypting image...</div>
                    </a>${newDateTag(msg, {
                        atLeft: msg.sender_id != CURRENT_USER_ID,
                        topSpace: 1,
                        fontSize: 8.5,
                        extraStyles:
                            "color: var(--text-color); font-weight: 600;",
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
                ${buildForwardedPreviewHtml(msg)}${replyHtml}
                <div class="file-purged-media-placeholder">
                    <i class="fas fa-video file-purged-media-icon"></i>
                    <div class="file-purged-badge"><i class="fas fa-clock"></i> File expired</div>
                </div>
                ${newDateTag(msg, {
                    atLeft: msg.sender_id != CURRENT_USER_ID,
                    topSpace: 1,
                    fontSize: 8.5,
                    extraStyles: "color: var(--text-color); font-weight: 600;",
                })}
            `;
        } else {
            div.innerHTML = `
                ${buildForwardedPreviewHtml(msg)}${replyHtml}
                <div class="video-message-container">
                    <video class="message-video" controls playsinline preload="metadata" style="display:none;"></video>
                    <div class="video-message-loading">Decrypting video...</div>
                </div>
                ${newDateTag(msg, {
                    atLeft: msg.sender_id != CURRENT_USER_ID,
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
                fileName = sanitizeAttachmentFileName(
                    String(mediaMeta?.file_name || "").trim(),
                    fileName,
                );
            } catch (_) {}
            const safeFileName = escapeHtml(fileName);
            const isAudio = isAudioFileName(fileName);

            if (isAudio) {
                div.classList.add("is-file-message", "is-music-message");
                const musicTitle = safeFileName.replace(/\.[^.]+$/, "");
                div.innerHTML = `
                  ${buildForwardedPreviewHtml(msg)}${replyHtml}
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
                      atLeft: msg.sender_id != CURRENT_USER_ID,
                      topSpace: 1,
                      fontSize: 8.5,
                      extraStyles:
                          "color: var(--text-color); font-weight: 600;",
                  })}
                `;
            } else {
                div.classList.add("is-file-message");
                div.innerHTML = `
                  ${buildForwardedPreviewHtml(msg)}${replyHtml}
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
                      atLeft: msg.sender_id != CURRENT_USER_ID,
                      topSpace: 1,
                      fontSize: 8.5,
                      extraStyles:
                          "color: var(--text-color); font-weight: 600;",
                  })}
                `;
            }
        } else {
            let fileName = "Encrypted file";
            try {
                const mediaMeta = await getDecryptedMediaMetadata(msg);
                fileName = sanitizeAttachmentFileName(
                    String(mediaMeta?.file_name || "").trim(),
                    fileName,
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
                  ${buildForwardedPreviewHtml(msg)}${replyHtml}
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
                      atLeft: msg.sender_id != CURRENT_USER_ID,
                      topSpace: 1,
                      fontSize: 8.5,
                      extraStyles:
                          "color: var(--text-color); font-weight: 600;",
                  })}
                `;
            } else {
                // ── Generic file ──
                div.classList.add("is-file-message");
                const isDownloaded = await isFileDownloaded(msg.id);
                const downloadIconClass = isDownloaded
                    ? "fa-check-circle"
                    : "fa-download";
                const downloadIconColor = isDownloaded
                    ? "color: var(--primary-color);"
                    : "";
                const cacheTitle = isDownloaded
                    ? 'title="Click to open cached file"'
                    : "";

                div.innerHTML = `
                  ${buildForwardedPreviewHtml(msg)}${replyHtml}
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
                      atLeft: msg.sender_id != CURRENT_USER_ID,
                      topSpace: 1,
                      fontSize: 8.5,
                      extraStyles:
                          "color: var(--text-color); font-weight: 600;",
                  })}
                `;
            }
        }
        div.setAttribute("data-message-id", msg.id);
    } else if (
        msg.message_type === "sticker" &&
        Number(msg.sticker_id || 0) > 0
    ) {
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
                ${buildForwardedPreviewHtml(msg)}${replyHtml}
                <button type="button" class="sticker-message-button" aria-label="Open sticker" title="Open sticker">
                    <img src="api/messages/stickers/get.php?id=${stickerId}" class="sticker-message-image" alt="Sticker" loading="lazy" decoding="async" />
                </button>
                ${newDateTag(msg, {
                    atLeft: msg.sender_id != CURRENT_USER_ID,
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
                decryptedText = await decryptGroupMessage(
                    String(groupPayload || ""),
                    groupKey,
                );
            } else {
                if (msg.sender_id == CURRENT_USER_ID) {
                    decryptedText = await decryptLongMessage(
                        msg.message_for_sender,
                    );
                } else {
                    decryptedText = await decryptLongMessage(msg.message);
                }
            }

            if (msg.reply_message_id && msg.reply_message_type === "text") {
                const replyPayload = isGroupMessage
                    ? msg.reply_message || msg.reply_message_for_sender
                    : msg.reply_sender_id == CURRENT_USER_ID
                      ? msg.reply_message_for_sender
                      : msg.reply_message;
                if (replyPayload) {
                    if (isGroupMessage) {
                        const groupId = Number(msg.group_id || 0);
                        const groupKey = await getGroupCryptoKey(groupId);
                        decryptedReplyText = await decryptGroupMessage(
                            String(replyPayload),
                            groupKey,
                        );
                    } else {
                        decryptedReplyText =
                            await decryptLongMessage(replyPayload);
                    }
                }
            }
        } catch (e) {
            decryptedText = isGroupMessage
                ? String(msg.message || "")
                : "[Unsupported message]";
        }
        const isPersian = isTextPersian(decryptedText.trim());
        const safeText = buildMessageTextHtmlWithLinks(decryptedText);
        const isIncomingGroup =
            isGroupMessage && msg.sender_id != CURRENT_USER_ID;
        const senderUsername = escapeHtml(
            String(msg.sender_username || "Member"),
        );
        const groupDateTag = `<span class="message-meta-time group-message-meta-time">${escapeHtml(formatMessageTimeLabel(msg.created_at))}${msg.edited_at ? buildEditedMarkerHtml(msg.edited_at) : ""}</span>`;
        const messageBodyContent = `${buildForwardedPreviewHtml(msg)}${buildReplyPreviewHtml(msg, decryptedReplyText)}<span class="message-text-content">${safeText}</span>${isIncomingGroup ? groupDateTag : ""}`;
        const outsideDateTag = isIncomingGroup
            ? ""
            : newDateTag(msg, {
                  atLeft: msg.sender_id != CURRENT_USER_ID,
                  strictMargins: true,
                  topSpace: 3,
                  editedAt: msg.edited_at || "",
              });
        div.classList.add("is-text-message");
        if (isIncomingGroup) {
            div.classList.add("group-incoming-message");
            div.classList.add(
                isPersian ? "group-incoming-rtl" : "group-incoming-ltr",
            );
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
                const targetId = replyQuote.getAttribute(
                    "data-reply-target-id",
                );
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
        const senderUsername = escapeHtml(
            String(msg.sender_username || "Member"),
        );
        const mediaBodyContent = div.innerHTML;
        div.classList.add(
            "group-incoming-message",
            "group-incoming-ltr",
            "group-incoming-media-message",
        );
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

    // Wire up reply quote click handler for non-text messages
    if (msg.message_type !== "text" && msg.reply_message_id) {
        const replyQuote = div.querySelector(".reply-quote");
        if (replyQuote) {
            replyQuote.addEventListener("click", () => {
                const targetId = replyQuote.getAttribute(
                    "data-reply-target-id",
                );
                if (targetId) void scrollToReplyTarget(targetId);
            });
        }
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
    } else if (
        msg.message_type === "video" &&
        msg.any_file_path &&
        !isFilePurged
    ) {
        void hydrateVideoMessageElement(div, msg);
    }

    const isOwnMessage = Number(msg.sender_id || 0) === Number(CURRENT_USER_ID);
    const isGroupMessageForStatus = Number(msg.group_id || 0) > 0;
    if (isOwnMessage && !isSavedMessagesChat(currentChatUser)) {
        const tickContainer = document.createElement("span");
        const isSeen = isGroupMessageForStatus
            ? Boolean(msg.group_seen_at)
            : Boolean(msg.seen_at);
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
    div.setAttribute(
        "data-forwarded-from-message-id",
        String(Number(msg.forwarded_from_message_id || 0)),
    );
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

    if (!deferInsert) {
        if (prepend) {
            // Disable entrance animation for older (prepended) messages —
            // they are historical content, not new arrivals.
            div.style.animation = "none";
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

    if (!isBatchRendering) {
        if (
            !isLoadingMessages &&
            conversationSearchBar &&
            !conversationSearchBar.hidden &&
            conversationSearchInput?.value.trim()
        ) {
            runConversationSearch();
        }
    }

    return div;
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

function captureViewportAnchor() {
    if (!chatMessagesElem) {
        return null;
    }

    const containerRect = chatMessagesElem.getBoundingClientRect();
    const messageElements = Array.from(
        chatMessagesElem.querySelectorAll(".message"),
    );
    const anchorElement = messageElements.find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.bottom >= containerRect.top;
    });

    if (!anchorElement) {
        return null;
    }

    const anchorId = Number(anchorElement.getAttribute("data-message-id") || 0);
    if (!anchorId) {
        return null;
    }

    return {
        id: anchorId,
        offsetTop:
            anchorElement.getBoundingClientRect().top - containerRect.top,
    };
}

function restoreViewportAnchor(anchor) {
    if (!anchor || !chatMessagesElem) {
        return;
    }

    const target = chatMessagesElem.querySelector(
        `[data-message-id="${anchor.id}"]`,
    );
    if (!target) {
        return;
    }

    const containerRect = chatMessagesElem.getBoundingClientRect();
    const currentOffsetTop =
        target.getBoundingClientRect().top - containerRect.top;
    chatMessagesElem.scrollTop +=
        currentOffsetTop - Number(anchor.offsetTop || 0);
}

function stabilizeViewportAnchor(anchor, frameBudget = 24) {
    if (!anchor || !chatMessagesElem || frameBudget <= 0) {
        return;
    }

    if (viewportAnchorStabilizeRafId) {
        cancelAnimationFrame(viewportAnchorStabilizeRafId);
        viewportAnchorStabilizeRafId = 0;
    }

    let remainingFrames = Math.max(1, Number(frameBudget) || 1);
    let stableFrames = 0;

    const tick = () => {
        if (!chatMessagesElem) {
            viewportAnchorStabilizeRafId = 0;
            return;
        }

        const target = chatMessagesElem.querySelector(
            `[data-message-id="${anchor.id}"]`,
        );
        if (!(target instanceof HTMLElement)) {
            viewportAnchorStabilizeRafId = 0;
            return;
        }

        const containerRect = chatMessagesElem.getBoundingClientRect();
        const currentOffsetTop =
            target.getBoundingClientRect().top - containerRect.top;
        const delta = currentOffsetTop - Number(anchor.offsetTop || 0);

        if (Math.abs(delta) > 0.5) {
            chatMessagesElem.scrollTop += delta;
            stableFrames = 0;
        } else {
            stableFrames++;
        }

        remainingFrames--;
        if (remainingFrames <= 0 || stableFrames >= 2) {
            viewportAnchorStabilizeRafId = 0;
            return;
        }

        viewportAnchorStabilizeRafId = requestAnimationFrame(tick);
    };

    viewportAnchorStabilizeRafId = requestAnimationFrame(tick);
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

    snapToBottomTimerIds = [setTimeout(snapChatToBottom, 120)];
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

/* ── Image Modal / Zoom System → chat-image-modal.js ──
 * openImageModal, closeImageModal, zoom controls, pinch-to-zoom, wheel zoom
 */

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
        console.warn(
            "File System Access API not available or permission denied:",
            error,
        );
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
                const fileHandle = await dirHandle.getFileHandle(
                    cachedFile.fileName,
                    {
                        create: true,
                    },
                );
                const writable = await fileHandle.createWritable();
                await writable.write(cachedFile.fileBlob);
                await writable.close();

                if ("launchQueue" in window) {
                    window.open(fileHandle);
                } else {
                    showModal(
                        "File Saved",
                        `File saved to your downloads folder:\n${cachedFile.fileName}`,
                        "success",
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
        showModal(
            I18N_TEXT.downloadErrorTitle,
            "Message metadata not found.",
            "error",
        );
        return;
    }

    let fileName = `attachment_${messageId}`;
    try {
        const metadata = await getDecryptedMediaMetadata(messageMeta);
        fileName = sanitizeAttachmentFileName(
            String(metadata?.file_name || metadata?.name || "").trim(),
            fileName,
        );
    } catch (error) {}

    // Check if file was previously downloaded
    const fileDownloaded = await isFileDownloaded(messageId);
    const fileIcon = document.querySelector(
        `[data-file-msg-id="${messageId}"] .file-download-icon i`,
    );
    const container = document.querySelector(
        `[data-file-msg-id="${messageId}"]`,
    );

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
            isUnavailable
                ? "This file is no longer available on the server."
                : formatI18nText(I18N_TEXT.downloadErrorBody, {
                      error: error.message || "Unknown",
                  }),
            isUnavailable ? "warning" : "error",
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

/* ── Voice & Music Message Players → chat-audio-players.js ──
 * updateVoiceSeekBars, applyVoiceSeek, playVoiceMessage, playMusicMessage
 */

const sendTextMessage = async () => {
    if (!currentChatUser) {
        showModal(
            I18N_TEXT.noChatSelectedTitle,
            I18N_TEXT.noChatSelectedBody,
            "warning",
        );
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
                currentReplyTarget?.messageId || null,
            );
        } else {
            await sendEncryptedTextMessage(
                currentChatUser,
                text,
                currentReplyTarget?.messageId || null,
            );
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
            err &&
            typeof err === "object" &&
            "message" in err &&
            String(err.message || "").trim()
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
            "error",
        );
    } finally {
        sendBtn.disabled = false;
    }
};

function setClipboardImageButtonVisibility(isVisible) {
    if (!pasteClipboardImageBtn) {
        return;
    }
    const shouldShow = Boolean(
        isVisible && currentChatUser && isChatInputFocused,
    );
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
    return new File([blob], `clipboard_${Date.now()}.${extension}`, {
        type: mimeType,
    });
}

async function refreshClipboardImageCandidate() {
    if (!currentChatUser) {
        pendingClipboardImageFile = null;
        setClipboardImageButtonVisibility(false);
        return null;
    }

    if (!(window.isSecureContext && navigator.clipboard?.read)) {
        setClipboardImageButtonVisibility(Boolean(pendingClipboardImageFile));
        return pendingClipboardImageFile;
    }

    try {
        if (navigator.permissions) {
            try {
                const perm = await navigator.permissions.query({
                    name: "clipboard-read",
                });
                if (perm.state === "denied") {
                    pendingClipboardImageFile = null;
                    setClipboardImageButtonVisibility(false);
                    return null;
                }
            } catch (_) {}
        }

        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
            const imageType = (clipboardItem.types || []).find((t) =>
                String(t).startsWith("image/"),
            );
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
    if (!ensureEditModeAllowsTextOnly("send clipboard image")) {
        return;
    }
    if (!currentChatUser) {
        showModal(
            I18N_TEXT.noChatSelectedTitle,
            I18N_TEXT.noChatSelectedBody,
            "warning",
        );
        return;
    }

    if (!pendingClipboardImageFile) {
        await refreshClipboardImageCandidate();
    }

    if (!pendingClipboardImageFile) {
        showModal("Clipboard", "No image found in clipboard.", "warning");
        return;
    }

    const shouldSend =
        !requireConfirm ||
        (await showConfirmModal(
            "Send Image",
            "Send clipboard image to this chat?",
            { type: "info", confirmLabel: "Send" },
        ));
    if (!shouldSend) {
        return;
    }

    await sendImageMessage(pendingClipboardImageFile);
    pendingClipboardImageFile = null;
    setClipboardImageButtonVisibility(false);
}

function extractClipboardImageFileFromDataTransfer(dataTransfer) {
    if (!dataTransfer) {
        return null;
    }

    const clipboardItems = Array.from(dataTransfer.items || []);
    const imageItem = clipboardItems.find((item) =>
        String(item.type || "").startsWith("image/"),
    );
    const imageBlob = imageItem?.getAsFile?.();
    if (imageBlob) {
        return createClipboardImageFile(imageBlob);
    }

    const files = Array.from(dataTransfer.files || []);
    const imageFile = files.find((file) =>
        String(file.type || "").startsWith("image/"),
    );
    if (imageFile) {
        return createClipboardImageFile(imageFile);
    }

    return null;
}

function extractPastedImageFile(pasteEvent) {
    return extractClipboardImageFileFromDataTransfer(
        pasteEvent?.clipboardData || null,
    );
}

const fileUploadInput = document.getElementById("fileUploadInput");
const sendBtn = document.getElementById("sendBtn");

let longPressTimer = null;

sendBtn.addEventListener("mousedown", (e) => {
    longPressTimer = setTimeout(() => {
        e.preventDefault();
        if (!ensureEditModeAllowsTextOnly("attach file")) {
            return;
        }
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
        if (!ensureEditModeAllowsTextOnly("attach file")) {
            return;
        }
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

fileUploadInput.addEventListener("change", async (e) => {
    if (!ensureEditModeAllowsTextOnly("send file")) {
        e.target.value = null;
        return;
    }
    const file = e.target.files[0];
    if (!file) {
        e.target.value = null;
        return;
    }

    // Read bytes NOW while the content:// URI grant is still active.
    let buffer;
    try {
        buffer = await file.arrayBuffer();
    } catch (_readErr) {
        e.target.value = null;
        showModal(
            "File Send Error",
            "Unable to read the selected file. Please try again.",
            "error",
        );
        return;
    }
    const fileName = file.name;
    const fileType = file.type;
    e.target.value = null;

    const standaloneFile = new File([buffer], fileName, { type: fileType });
    void sendFileMessage(standaloneFile);
});

// ── Bio settings loader ──────────────────────────────────────
async function loadSettingsBio() {
    if (!settingsBioInput) return;
    try {
        const profile = await fetchUserProfile({ username: CURRENT_USER });
        settingsBioInput.value = profile.bio || "";
        if (settingsBioCharCount)
            settingsBioCharCount.textContent = String(
                settingsBioInput.value.length,
            );
    } catch {
        /* ignore */
    }
}

// ── Sessions tab ──────────────────────────────────────────────
async function loadSessionsList() {
    const container = document.getElementById("settingsSessionsList");
    if (!container) return;
    container.innerHTML =
        '<div class="chat-ui-admin-empty"><i class="fas fa-spinner fa-spin me-1"></i>Loading sessions...</div>';
    try {
        const data = await window.ApiService.jsonOk(
            "api/users/list_sessions.php",
        );
        renderSessionsList(data.sessions || [], container);
    } catch (err) {
        container.innerHTML = `<div class="chat-ui-admin-empty" style="color:var(--error-color)">Failed to load sessions.</div>`;
    }
}

function parseUserAgent(ua) {
    if (!ua) return { device: "Unknown", os: "Unknown", browser: "Unknown" };

    let os = "Unknown";
    if (/Windows/i.test(ua)) os = "Windows";
    else if (/Macintosh|Mac OS/i.test(ua)) os = "macOS";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
    else if (/Linux/i.test(ua)) os = "Linux";
    else if (/CrOS/i.test(ua)) os = "ChromeOS";

    let browser = "Unknown";
    if (/Edg\//i.test(ua)) browser = "Edge";
    else if (/OPR\//i.test(ua)) browser = "Opera";
    else if (/Chrome\//i.test(ua)) browser = "Chrome";
    else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Firefox\//i.test(ua)) browser = "Firefox";

    let device = "Desktop";
    if (/Mobile|Android.*Mobile|iPhone|iPod/i.test(ua)) device = "Mobile";
    else if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) device = "Tablet";

    return { device, os, browser };
}

function deviceIcon(device) {
    if (device === "Mobile") return "fa-mobile-alt";
    if (device === "Tablet") return "fa-tablet-alt";
    return "fa-desktop";
}

function formatSessionTime(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr.replace(" ", "T") + "Z");
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d ago`;
    return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function renderSessionsList(sessions, container) {
    if (!sessions.length) {
        container.innerHTML =
            '<div class="chat-ui-admin-empty">No active sessions found.</div>';
        return;
    }
    let html = "";
    sessions.forEach((s, i) => {
        const info = parseUserAgent(s.user_agent);
        const isCurrent = s.is_current;
        const canRevoke = s.can_revoke;
        html += `<div class="session-item${isCurrent ? " session-current" : ""}" style="animation-delay:${i * 60}ms">
            <div class="session-icon"><i class="fas ${deviceIcon(info.device)}"></i></div>
            <div class="session-details">
                <div class="session-device">
                    ${info.browser} on ${info.os}
                    ${isCurrent ? '<span class="session-badge-current">This device</span>' : ""}
                </div>
                <div class="session-meta">
                    <span><i class="fas fa-clock me-1"></i>Login: ${formatSessionTime(s.created_at)}</span>
                    <span><i class="fas fa-signal me-1"></i>Active: ${formatSessionTime(s.last_active_at)}</span>
                    ${s.ip_address ? `<span><i class="fas fa-globe me-1"></i>${s.ip_address}</span>` : ""}
                </div>
            </div>
            <div class="session-actions">
                ${
                    canRevoke
                        ? `<button type="button" class="btn btn-sm btn-outline-danger session-revoke-btn" data-session-id="${s.id}"><i class="fas fa-sign-out-alt me-1"></i>Revoke</button>`
                        : isCurrent
                          ? ""
                          : `<span class="session-hint">< 12h</span>`
                }
            </div>
        </div>`;
    });
    container.innerHTML = html;

    container.querySelectorAll(".session-revoke-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const sessionId = Number(btn.dataset.sessionId);
            if (!sessionId) return;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            try {
                await window.ApiService.jsonOk("api/users/revoke_session.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...getCsrfHeaders(),
                    },
                    body: JSON.stringify({ session_id: sessionId }),
                });
                const item = btn.closest(".session-item");
                if (item) {
                    item.style.animation = "sessionSlideOut 0.3s ease forwards";
                    item.addEventListener("animationend", () => item.remove(), {
                        once: true,
                    });
                }
                setComposerStatus("Session revoked", "success");
            } catch (err) {
                showModal(
                    "Revoke Failed",
                    err?.message || "Unable to revoke session.",
                    "error",
                );
                btn.disabled = false;
                btn.innerHTML =
                    '<i class="fas fa-sign-out-alt me-1"></i>Revoke';
            }
        });
    });
}

function playComposerButtonTap(btn, { variant = "default" } = {}) {
    if (!btn) return;
    const iconEl = btn.querySelector("i");
    const target = iconEl || btn;
    target.classList.remove("composer-action-icon-shake");
    target.classList.remove("composer-action-icon-soft");
    target.classList.remove("composer-sticker-icon-cute");
    void target.offsetWidth;
    if (btn.id === "stickerPickerBtn") {
        target.classList.add("composer-sticker-icon-cute");
    } else if (variant === "soft") {
        target.classList.add("composer-action-icon-soft");
    } else {
        target.classList.add("composer-action-icon-shake");
    }
    target.addEventListener(
        "animationend",
        () => {
            target.classList.remove("composer-action-icon-shake");
            target.classList.remove("composer-action-icon-soft");
            target.classList.remove("composer-sticker-icon-cute");
        },
        { once: true },
    );
}

// Animates the swap with a vertical slide (old icon exits up, new enters from below)
let _sendBtnIconState = null; // track current icon to avoid redundant swaps
let _iconSwapAbort = null; // abort controller for in-flight animation
function updateSendButtonIcon() {
    const icon = sendBtn?.querySelector("i");
    if (!icon) return;
    const wantPlane = Boolean(chatInput.value.trim().length);
    const nextState = wantPlane ? "plane" : "file";
    if (nextState === _sendBtnIconState) return; // no change needed

    // If a swap animation is in progress, cancel it and jump to final state
    if (_iconSwapAbort) {
        _iconSwapAbort.abort();
        _iconSwapAbort = null;
        icon.classList.remove("icon-exit", "icon-enter");
        icon.getAnimations().forEach((a) => a.cancel());
    }

    const isFirstCall = _sendBtnIconState === null;
    _sendBtnIconState = nextState;

    // Apply the correct icon immediately (animation or not)
    const applyIcon = () => {
        icon.classList.remove("fa-file", "fa-paper-plane");
        icon.classList.add(wantPlane ? "fa-paper-plane" : "fa-file");
        sendBtn.title = wantPlane ? "Send message" : "Send file";
    };

    if (isIosLagFixEnabled()) {
        icon.classList.remove("icon-exit", "icon-enter");
        applyIcon();
        return;
    }

    if (isFirstCall) {
        icon.classList.remove("icon-exit", "icon-enter");
        applyIcon();
        return;
    }

    // Animate: exit current icon up, enter new icon from below
    const ac = new AbortController();
    _iconSwapAbort = ac;

    icon.classList.add("icon-exit");
    icon.addEventListener(
        "animationend",
        () => {
            if (ac.signal.aborted) return;
            icon.classList.remove("icon-exit");
            applyIcon();
            void icon.offsetWidth; // force reflow
            icon.classList.add("icon-enter");
            icon.addEventListener(
                "animationend",
                () => {
                    if (ac.signal.aborted) return;
                    icon.classList.remove("icon-enter");
                    _iconSwapAbort = null;
                },
                { once: true, signal: ac.signal },
            );
        },
        { once: true, signal: ac.signal },
    );
}
updateSendButtonIcon();

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!chatInput.value.trim()) {
        if (!ensureEditModeAllowsTextOnly("attach file")) {
            return;
        }
        playComposerButtonTap(sendBtn, { variant: "soft" });
        fileUploadInput.click();
        return;
    }
    await sendTextMessage();
});

chatInput.addEventListener("keydown", async (e) => {
    // Prevent arrow keys from bubbling to global handlers (chat nav, context menu, etc.)
    if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
    ) {
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

chatInput.addEventListener("beforeinput", (event) => {
    if (String(event?.inputType || "") !== "insertFromPaste") {
        return;
    }
    const pastedImageFile = extractClipboardImageFileFromDataTransfer(
        event?.dataTransfer || null,
    );
    if (!pastedImageFile) {
        return;
    }
    if (!ensureEditModeAllowsTextOnly("paste image")) {
        event.preventDefault();
        return;
    }
    event.preventDefault();
    pendingClipboardImageFile = pastedImageFile;
    setClipboardImageButtonVisibility(true);
    setComposerStatus("Clipboard image ready. Tap Paste to send.", "info");
});

chatInput.addEventListener("paste", async (event) => {
    const pastedImageFile = extractPastedImageFile(event);
    if (!pastedImageFile) {
        return;
    }

    if (!ensureEditModeAllowsTextOnly("paste image")) {
        event.preventDefault();
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

    if (!ensureEditModeAllowsTextOnly("paste image")) {
        event.preventDefault();
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
        (event.ctrlKey || event.metaKey) &&
        !event.shiftKey &&
        event.key.toLowerCase() === "a";
    if (!isSelectAllShortcut || !isSelectModeActive) {
        return;
    }

    const inEditableField = ["INPUT", "TEXTAREA", "SELECT"].includes(
        String(document.activeElement?.tagName || ""),
    );
    if (inEditableField) {
        return;
    }

    event.preventDefault();
    getVisibleMessageElements().forEach((messageElement) => {
        const messageId = Number(
            messageElement.getAttribute("data-message-id") || 0,
        );
        if (messageId > 0) {
            selectedMessageIds.add(messageId);
            setMessageSelectedState(messageElement, true);
        }
    });
    updateSelectModeUi();
});

chatInput.addEventListener("input", () => {
    // Auto-grow textarea to fit content (skip in iOS perf mode)
    if (!isIosLagFixEnabled()) {
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + "px";
    }

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
    // Defer clipboard read so it doesn't block keyboard on iOS
    setTimeout(() => {
        void refreshClipboardImageCandidate();
    }, 800);
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

document.addEventListener("visibilitychange", () => {
    if (!document.hidden && isChatInputFocused) {
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
            "error",
        );
        searchUserInput.value = "";
        return;
    }

    const originalPlaceholder = searchUserInput.placeholder;
    searchUserInput.placeholder = "Checking user...";
    searchUserInput.disabled = true;

    try {
        const data = await window.ApiService.json(
            `api/users/check_exists.php?username=${encodeURIComponent(val)}`,
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
                "warning",
            );
            searchUserInput.value = "";
        }
    } catch (error) {
        showModal(
            I18N_TEXT.connectionErrorTitle,
            I18N_TEXT.connectionErrorBody,
            "error",
        );
        searchUserInput.value = "";
    } finally {
        searchUserInput.placeholder = originalPlaceholder;
        searchUserInput.disabled = false;
    }
}
searchUserInput.addEventListener("keydown", async function (e) {
    const suggestions = searchSuggestions.querySelectorAll(
        ".search-suggestion-item",
    );

    switch (e.key) {
        case "ArrowDown":
            e.preventDefault();
            selectedSuggestionIndex = Math.min(
                selectedSuggestionIndex + 1,
                suggestions.length - 1,
            );
            updateSuggestionSelection(suggestions);
            break;

        case "ArrowUp":
            e.preventDefault();
            selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
            updateSuggestionSelection(suggestions);
            break;

        case "Enter":
            e.preventDefault();
            if (
                selectedSuggestionIndex >= 0 &&
                suggestions[selectedSuggestionIndex]
            ) {
                await selectSuggestion(
                    suggestions[selectedSuggestionIndex].dataset.username,
                );
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
            `api/users/search.php?query=${encodeURIComponent(query)}`,
        );

        const users = Array.isArray(data.users) ? data.users : [];
        // Inject Saved Messages if query matches
        const lq = query.toLowerCase();
        if (
            "you".includes(lq) ||
            "saved messages".includes(lq) ||
            CURRENT_USER.toLowerCase().includes(lq)
        ) {
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
        const displayName = isSelf ? "You" : username;
        const initials = isSelf
            ? '<i class="fas fa-bookmark"></i>'
            : username
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
                searchSuggestions.querySelectorAll(".search-suggestion-item"),
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
        const label = isSavedMessagesChat(username)
            ? "Opened your messages"
            : `Started chat with ${username}`;
        window.UIEnhancements.showSearchNotification(label, "success");
    }
}

function showSearchLoading(show) {
    if (searchLoading) {
        searchLoading.style.display = show ? "block" : "none";
    }
}

chatInput.disabled = true;
chatInput.placeholder = "...";
fetchAndImportPrivateKey().catch((err) => {
    showModal(
        I18N_TEXT.keyErrorTitle,
        formatI18nText(I18N_TEXT.keyErrorBody, {
            error: err.message || "Unknown",
        }),
        "error",
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
    li.querySelector("button")?.addEventListener("click", () =>
        loadChatList(true),
    );
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
        `api/groups/fetch_details.php?group_id=${encodeURIComponent(groupId)}`,
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

        if (groupInfoTitle)
            groupInfoTitle.textContent = group.title || `Group ${groupId}`;
        if (groupInfoDescription)
            groupInfoDescription.textContent =
                group.description || "No description provided yet.";
        if (groupInfoMemberCount)
            groupInfoMemberCount.textContent = String(members.length);
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
            groupJoinLinkInput.value =
                details?.can_manage && group.join_link ? group.join_link : "";
            groupJoinLinkInput.style.display = details?.can_manage
                ? ""
                : "none";
        }
        if (groupCopyJoinLinkBtn) {
            groupCopyJoinLinkBtn.style.display = details?.can_manage
                ? ""
                : "none";
        }
        if (groupRotateJoinLinkBtn) {
            groupRotateJoinLinkBtn.style.display = details?.can_manage
                ? ""
                : "none";
        }
        if (groupAddMemberBtn) {
            groupAddMemberBtn.hidden = !Boolean(details?.can_manage);
        }
        if (groupTransferOwnerBtn) {
            groupTransferOwnerBtn.hidden = !Boolean(
                details?.can_transfer_owner,
            );
        }
        if (groupLeaveBtn) {
            groupLeaveBtn.hidden = !Boolean(details?.can_leave);
        }
        groupInfoPanel?.setAttribute(
            "aria-label",
            `Group details for ${group.title || `Group ${groupId}`}`,
        );

        void loadGroupChatStats();
        loadGroupMusicMessages(true);
    } catch (error) {
        showModal(
            "Group Details",
            error.message || "Failed to load group details",
            "warning",
        );
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
        showModal(
            "Group Created",
            `Created group "${data.group.title}" successfully.`,
            "success",
        );
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
        showModal(
            "Joined Group",
            "You have joined the group successfully.",
            "success",
        );
    } catch (error) {
        showModal(
            "Join Group Failed",
            error.message || "Invalid join link.",
            "error",
        );
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
        const data = await window.ApiService.jsonOk(
            "api/keys/group_health.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify(body),
            },
        );

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
            unhealthyGroups.length
                ? "Group key health check found issues"
                : "Group key health check passed",
            unhealthyGroups.length ? "warning" : "success",
        );
        openMessageActionModal("Group Key Health", modalBody);
    } catch (error) {
        setComposerStatus("Group key health check failed", "error");
        showModal(
            "Group Key Health",
            error.message || "Unable to run health check.",
            "error",
        );
    }
}

function createAddMemberPickerContent(groupId, details) {
    const wrapper = document.createElement("div");
    wrapper.className = "forward-target-list";

    const existingUsernames = new Set(
        (Array.isArray(details?.members) ? details.members : []).map((member) =>
            String(member?.username || "")
                .trim()
                .toLowerCase(),
        ),
    );

    const candidates = Array.from(chatUsers)
        .filter((username) => username && username !== CURRENT_USER)
        .filter(
            (username) =>
                !existingUsernames.has(String(username).toLowerCase()),
        )
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
                showModal(
                    "Member Added",
                    `${username} added to group.`,
                    "success",
                );
            } catch (error) {
                setComposerStatus("Failed to add member", "error");
                showModal(
                    "Add Member Failed",
                    error.message || "Unable to add member",
                    "error",
                );
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
            showModal(
                "Add Member",
                "You do not have permission to add members.",
                "warning",
            );
            return;
        }
        const pickerContent = createAddMemberPickerContent(groupId, details);
        openMessageActionModal("Add Group Member", pickerContent);
    } catch (error) {
        showModal(
            "Add Member",
            error.message || "Unable to load member picker.",
            "error",
        );
    }
}

function createGroupKeyHealthModalContent(
    groups,
    { activeGroupId = 0, checkedAt = "" } = {},
) {
    const wrapper = document.createElement("div");
    wrapper.className = "group-health-modal";

    const unhealthyGroups = groups.filter((group) => !group.is_healthy);
    const legacyGroups = groups.filter(
        (group) => Number(group.legacy_plaintext_text_messages_count || 0) > 0,
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
    [
        "Group",
        "Missing Keys",
        "Encrypted Text",
        "Legacy Plaintext",
        "Status",
    ].forEach((title) => {
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
        missingCell.textContent = String(
            Number(group.missing_member_keys_count || 0),
        );

        const encryptedCell = document.createElement("td");
        encryptedCell.textContent = String(
            Number(group.encrypted_text_messages_count || 0),
        );

        const legacyCell = document.createElement("td");
        legacyCell.textContent = String(
            Number(group.legacy_plaintext_text_messages_count || 0),
        );

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
                item.textContent = username
                    ? `${username} (id: ${memberUserId})`
                    : `User ${memberUserId}`;
                detailsList.appendChild(item);
            });

            detailsWrap.appendChild(detailsList);
            detailsCell.appendChild(detailsWrap);
            detailsRow.appendChild(detailsCell);

            toggleBtn.addEventListener("click", () => {
                const willOpen = detailsRow.hidden;
                detailsRow.hidden = !willOpen;
                toggleBtn.setAttribute(
                    "aria-expanded",
                    willOpen ? "true" : "false",
                );
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
        const incomingGroups = Array.isArray(data.chatGroups)
            ? data.chatGroups
            : [];
        const incomingGroupIds = new Set(
            incomingGroups.map((group) => Number(group.id || 0)),
        );
        if (Array.isArray(data.chatUserItems) && data.chatUserItems.length) {
            data.chatUserItems.forEach((item) => {
                addUserToChatList(String(item?.username || ""), {
                    unreadCount: Number(item?.unread_count || 0),
                    userId: Number(item?.user_id || 0),
                });
            });
        } else if (data.chatUsers && Array.isArray(data.chatUsers)) {
            data.chatUsers.forEach((username) =>
                addUserToChatList(String(username || "")),
            );
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

// --- Add Chat modal ---
(function initAddChatModal() {
    if (!addChatModalOverlay || !addChatSearchInput) return;

    let addChatDebounce = null;
    let addChatSearching = false;

    function openAddChatModal() {
        addChatModalOverlay.hidden = false;
        pushUiBackLayer(
            UI_BACK_LAYER_KEYS.addChat,
            ({ fromHistory = false } = {}) => {
                closeAddChatModal({ fromHistory });
            },
        );
        addChatSearchInput.value = "";
        addChatResults.innerHTML = "";
        if (addChatEmpty) addChatEmpty.hidden = false;
        setTimeout(() => addChatSearchInput.focus(), 60);
    }

    function closeAddChatModal({ fromHistory = false } = {}) {
        if (
            !fromHistory &&
            requestUiLayerClose(UI_BACK_LAYER_KEYS.addChat, () => {
                closeAddChatModal({ fromHistory: true });
            })
        ) {
            return;
        }
        removeUiBackLayer(UI_BACK_LAYER_KEYS.addChat);
        addChatModalOverlay.hidden = true;
        addChatSearchInput.value = "";
        addChatResults.innerHTML = "";
        if (addChatEmpty) addChatEmpty.hidden = false;
    }

    addChatBtn?.addEventListener("click", openAddChatModal);
    addChatModalClose?.addEventListener("click", closeAddChatModal);
    addChatModalOverlay?.addEventListener("click", (e) => {
        if (e.target === addChatModalOverlay) closeAddChatModal();
    });
    document.addEventListener("keydown", (e) => {
        if (
            e.key === "Escape" &&
            addChatModalOverlay &&
            !addChatModalOverlay.hidden
        ) {
            closeAddChatModal();
        }
    });

    addChatSearchInput.addEventListener("input", () => {
        clearTimeout(addChatDebounce);
        const q = addChatSearchInput.value.trim();
        if (q.length < 2) {
            addChatResults.innerHTML = "";
            if (addChatEmpty) addChatEmpty.hidden = false;
            return;
        }
        addChatDebounce = setTimeout(() => searchAddChat(q), 280);
    });

    async function searchAddChat(query) {
        if (addChatSearching) return;
        addChatSearching = true;
        try {
            const data = await window.ApiService.json(
                `api/users/search.php?query=${encodeURIComponent(query)}`,
            );
            const users = Array.isArray(data.users) ? data.users : [];
            renderAddChatResults(users);
        } catch (_) {
            addChatResults.innerHTML = `<div class="add-chat-no-results">Search failed</div>`;
        } finally {
            addChatSearching = false;
        }
    }

    function renderAddChatResults(users) {
        addChatResults.innerHTML = "";
        if (addChatEmpty) addChatEmpty.hidden = users.length > 0;

        if (!users.length) {
            addChatResults.innerHTML = `<div class="add-chat-no-results">No users found</div>`;
            return;
        }

        users.forEach((username) => {
            const isSelf = username === CURRENT_USER;
            const displayName = isSelf ? "Saved Messages" : username;
            const initials = isSelf
                ? '<i class="fas fa-bookmark"></i>'
                : username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();

            const item = document.createElement("div");
            item.className = "add-chat-result-item";
            item.innerHTML = `
                <div class="add-chat-result-avatar${isSelf ? " saved-messages-avatar" : ""}">${initials}</div>
                <span class="add-chat-result-name">${escapeHtml(displayName)}</span>
                <i class="fas fa-comment-dots add-chat-result-action"></i>
            `;
            item.addEventListener("click", async () => {
                closeAddChatModal();
                addUserToChatList(username);
                await selectChatUser(username);
            });
            addChatResults.appendChild(item);
        });
    }
})();

groupKeyHealthBtn?.addEventListener("click", async () => {
    await runGroupKeyHealthCheck();
});

groupInfoBtn?.addEventListener("click", async () => {
    const groupId = getCurrentGroupId();
    if (!groupId) {
        return;
    }
    // Toggle: re-click closes the panel
    if (groupInfoPanel && !groupInfoPanel.hidden) {
        closeGroupInfoPanel();
        return;
    }
    await renderGroupInfoPanel(groupId);
    openGroupInfoPanel();
});

groupInfoBackBtn?.addEventListener("click", () => {
    closeGroupInfoPanel();
});

privateChatInfoBackBtn?.addEventListener("click", () => {
    closePrivateChatInfoPanel();
});

// Opinion form handlers
document
    .getElementById("privateOpinionAddBtn")
    ?.addEventListener("click", () => {
        const formWrap = document.getElementById("privateOpinionFormWrap");
        const input = document.getElementById("privateOpinionInput");
        if (formWrap) {
            // Always reset for a new opinion when clicking add
            privateOpinionEditingId = 0;
            if (input) input.value = "";
            const cc = document.getElementById("privateOpinionCharCount");
            if (cc) cc.textContent = "0";
            formWrap.hidden = !formWrap.hidden;
            if (!formWrap.hidden && input) input.focus();
        }
    });

document
    .getElementById("privateOpinionInput")
    ?.addEventListener("input", () => {
        const cc = document.getElementById("privateOpinionCharCount");
        const input = document.getElementById("privateOpinionInput");
        if (cc && input) cc.textContent = String(input.value.length);
    });

document
    .getElementById("privateOpinionCancelBtn")
    ?.addEventListener("click", () => {
        resetPrivateOpinionForm();
    });

document
    .getElementById("privateOpinionSaveBtn")
    ?.addEventListener("click", async () => {
        const input = document.getElementById("privateOpinionInput");
        const body = String(input?.value || "").trim();
        if (!body || !privateChatOpinionTargetUserId) return;
        try {
            const payload = {
                target_user_id: privateChatOpinionTargetUserId,
                body,
            };
            if (privateOpinionEditingId > 0)
                payload.opinion_id = privateOpinionEditingId;
            await window.ApiService.jsonOk("api/opinions/save.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify(payload),
            });
            opinionsPanelCache = null;
            resetPrivateOpinionForm();
            loadPrivateChatOpinion();
        } catch (error) {
            showModal(
                "Opinion Error",
                error?.message || "Failed to save opinion.",
                "error",
            );
        }
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
        const data = await window.ApiService.jsonOk(
            "api/groups/rotate_join_link.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({ group_id: groupId }),
            },
        );
        if (groupJoinLinkInput) {
            groupJoinLinkInput.value = data.join_link || "";
        }
        setComposerStatus("Join link rotated", "success");
        showModal(
            "Join Link Rotated",
            "A new join link is now active.",
            "success",
        );
    } catch (error) {
        setComposerStatus("Unable to rotate join link", "error");
        showModal(
            "Rotate Failed",
            error.message || "Unable to rotate join link.",
            "error",
        );
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
        const confirmed = await showConfirmModal(
            "Remove Member",
            `Remove ${username} from this group?`,
            { type: "warning", confirmLabel: "Remove" },
        );
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
            showModal(
                "Member Removed",
                `${username} was removed from group.`,
                "success",
            );
        } catch (error) {
            setComposerStatus("Unable to remove member", "error");
            showModal(
                "Remove Failed",
                error.message || "Unable to remove member.",
                "error",
            );
        }
        return;
    }

    if (action === "transfer-owner") {
        const confirmed = await showConfirmModal(
            "Transfer Ownership",
            `Transfer ownership to ${username}?`,
            { type: "warning", confirmLabel: "Transfer" },
        );
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
                body: JSON.stringify({
                    group_id: groupId,
                    new_owner_user_id: userId,
                }),
            });
            await renderGroupInfoPanel(groupId);
            await loadChatList(true);
            setComposerStatus("Ownership transferred", "success");
            showModal(
                "Ownership Transferred",
                `${username} is now the group owner.`,
                "success",
            );
        } catch (error) {
            setComposerStatus("Unable to transfer ownership", "error");
            showModal(
                "Transfer Failed",
                error.message || "Unable to transfer ownership.",
                "error",
            );
        }
    }
});

groupTransferOwnerBtn?.addEventListener("click", () => {
    showModal(
        "Transfer Ownership",
        "Use the Owner button next to a member name to transfer ownership.",
        "info",
    );
});

groupLeaveBtn?.addEventListener("click", async () => {
    const groupId = getCurrentGroupId();
    if (!groupId) {
        return;
    }

    const confirmed = await showConfirmModal(
        "Leave Group",
        "Leave this group? If you are the owner, transfer ownership first unless you are the last member.",
        { type: "warning", confirmLabel: "Leave" },
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
        chatInput.placeholder = "...";
        if (typeof window.setMobileChatSelected === "function") {
            window.setMobileChatSelected(false);
        }

        await loadChatList(true);
        setComposerStatus("Left group", "success");
        showModal("Left Group", "You have left the group.", "success");
    } catch (error) {
        setComposerStatus("Unable to leave group", "error");
        showModal(
            "Leave Failed",
            error.message || "Unable to leave group.",
            "error",
        );
    }
});

// ── Unified main polling loop ──────────────────────────────────
// Single 1-second base interval; per-job counters fire at their own cadence.
// Normal mode:       messages 1s, seen 3s, chat list 10s
// Performance mode:  messages 1.7s, seen 5s, chat list 30s
let lastMsgPollTime = 0;
let pollSeenCounter = 0;
let pollChatListCounter = 0;
let pollBgCounter = 0;
let prevDayString = new Date().toDateString();

setInterval(async () => {
    if (isRefreshLoopBusy || !navigator.onLine) return;

    const perfMode = isIosLagFixEnabled();
    const msgIntervalMs = perfMode ? 1700 : 1000;
    const seenInterval = perfMode ? 5 : 3;
    const chatListInterval = perfMode ? 30 : 10;

    // Day-boundary separator check (normal mode only)
    if (!perfMode) {
        const nowDay = new Date().toDateString();
        if (nowDay !== prevDayString) {
            prevDayString = nowDay;
            rebuildMessageDaySeparators();
        }
    }

    const now = Date.now();
    const doMessages = now - lastMsgPollTime >= msgIntervalMs;
    const doSeen = pollSeenCounter === 0;
    const doChatList = pollChatListCounter === 0;

    if (doMessages) lastMsgPollTime = now;
    pollSeenCounter = (pollSeenCounter + 1) % seenInterval;
    pollChatListCounter = (pollChatListCounter + 1) % chatListInterval;

    if (document.hidden) {
        // Background: only fetch chat list (+ messages for notifications) at
        // the chat-list cadence so background tabs remain lightweight.
        pollBgCounter = (pollBgCounter + 1) % chatListInterval;
        if (pollBgCounter === 0) {
            isRefreshLoopBusy = true;
            try {
                await Promise.all([
                    loadChatList(),
                    currentChatUser?.length &&
                        appSettings.browserNotificationsEnabled &&
                        forceFetchCurrentChatMessages(),
                ]);
            } catch (_) {
            } finally {
                isRefreshLoopBusy = false;
            }
        }
        return;
    }

    isRefreshLoopBusy = true;
    try {
        const tasks = [];
        if (doMessages && currentChatUser?.length)
            tasks.push(forceFetchCurrentChatMessages());
        if (doChatList) tasks.push(loadChatList());
        if (doSeen) tasks.push(refreshPendingSeenStates());
        if (tasks.length) await Promise.all(tasks);
    } finally {
        isRefreshLoopBusy = false;
    }
}, CHAT_REFRESH_POLL_MS);

voiceBtn.addEventListener("click", async () => {
    playComposerButtonTap(voiceBtn);
    if (!ensureEditModeAllowsTextOnly("record voice message")) {
        return;
    }
    if (!currentChatUser) {
        showModal(
            I18N_TEXT.noChatSelectedTitle,
            I18N_TEXT.noChatSelectedBody,
            "warning",
        );
        return;
    }
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48000,
                    channelCount: 1,
                },
            });
            const preferredMimeTypes = [
                "audio/webm;codecs=opus",
                "audio/webm",
                "audio/mp4",
                "audio/ogg;codecs=opus",
                "audio/ogg",
            ];
            let selectedMimeType = "";
            for (const mime of preferredMimeTypes) {
                if (
                    typeof MediaRecorder.isTypeSupported === "function" &&
                    MediaRecorder.isTypeSupported(mime)
                ) {
                    selectedMimeType = mime;
                    break;
                }
            }

            const recorderOptions = selectedMimeType
                ? { mimeType: selectedMimeType, audioBitsPerSecond: 64000 }
                : { audioBitsPerSecond: 64000 };
            mediaRecorder = new MediaRecorder(stream, recorderOptions);
            const actualMimeType =
                mediaRecorder.mimeType || selectedMimeType || "audio/webm";
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
                    const blobMimeType =
                        actualMimeType.split(";")[0] || "audio/webm";
                    const audioBlob = new Blob(audioChunks, {
                        type: blobMimeType,
                    });
                    await sendVoiceMessage(audioBlob);
                }
            };

            mediaRecorder.start();
            isRecording = true;
            setRecordingState(true);

            addRecordingIndicator();
        } catch (err) {
            showModal(
                I18N_TEXT.microphoneErrorTitle,
                I18N_TEXT.microphoneErrorBody,
                "error",
            );
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
    if (!ensureEditModeAllowsTextOnly("send voice message")) {
        return;
    }
    // Capture context before any async work
    const capturedTarget = currentChatUser;
    const replyToId = currentReplyTarget?.messageId || null;
    const groupId = parseGroupIdFromToken(capturedTarget);
    clearReplyState();

    const bgId = registerBackgroundUpload("voice message");
    await acquireUploadSlot(bgId);
    try {
        const voiceMimeType = String(audioBlob?.type || "audio/webm");
        const voiceExtMap = {
            "audio/mp4": "m4a",
            "audio/ogg": "ogg",
            "audio/webm": "webm",
        };
        const voiceExt = voiceExtMap[voiceMimeType] || "webm";
        const mediaPayload = await encryptMediaForMessage(
            audioBlob,
            {
                file_name: `voice_message.${voiceExt}`,
                mime_type: voiceMimeType,
                file_size: Number(audioBlob?.size || 0),
            },
            groupId > 0 ? { groupId } : { targetUsername: capturedTarget },
        );

        const formData = new FormData();
        if (groupId > 0) {
            formData.append("group_id", String(groupId));
        } else {
            formData.append("target", capturedTarget);
        }
        formData.append("message", mediaPayload.messageForRecipient);
        formData.append("message_for_sender", mediaPayload.messageForSender);
        formData.append(
            "voice_file",
            mediaPayload.encryptedBlob,
            `voice_message.enc`,
        );
        if (replyToId)
            formData.append("reply_to_message_id", String(replyToId));

        await uploadWithProgress(
            "api/messages/media/send_voice.php",
            formData,
            getCsrfHeaders(),
            (pct, loaded, total) =>
                updateBackgroundUploadProgress(bgId, pct, loaded, total),
        );

        if (!isGroupToken(capturedTarget)) {
            addUserToChatList(capturedTarget);
        }
        // Refresh messages only if user is still viewing the same chat
        if (currentChatUser === capturedTarget) {
            loadCurrentChatsRecentMessages();
            setComposerStatus("");
        }
    } catch (err) {
        // Show error only if user is still on the same chat
        if (currentChatUser === capturedTarget) {
            setComposerStatus("Voice message failed. Try again.", "error");
        }
        showModal(
            I18N_TEXT.voiceSendErrorTitle,
            formatI18nText(I18N_TEXT.voiceSendErrorBody, {
                error: err.message || "Unknown",
            }),
            "error",
        );
    } finally {
        completeBackgroundUpload(bgId);
    }
}

imageUploadBtn.addEventListener("click", () => {
    playComposerButtonTap(imageUploadBtn);
    if (!ensureEditModeAllowsTextOnly("send image or media")) {
        return;
    }
    if (!currentChatUser) {
        showModal(
            I18N_TEXT.noChatSelectedTitle,
            I18N_TEXT.noChatSelectedBody,
            "warning",
        );
        return;
    }
    if (
        imageSourceMenu &&
        !imageSourceMenu.hidden &&
        imageSourceMenu.classList.contains("is-open")
    ) {
        closeImageSourceMenu({ restoreFocus: true });
        return;
    }
    openImageSourceMenu();
});

stickerPickerBtn?.addEventListener("click", () => {
    playComposerButtonTap(stickerPickerBtn);
    if (!ensureEditModeAllowsTextOnly("send sticker")) {
        return;
    }
    if (!currentChatUser) {
        showModal(
            I18N_TEXT.noChatSelectedTitle,
            I18N_TEXT.noChatSelectedBody,
            "warning",
        );
        return;
    }

    if (
        stickerPickerMenu &&
        !stickerPickerMenu.hidden &&
        stickerPickerMenu.classList.contains("is-open")
    ) {
        closeStickerPicker({ restoreFocus: true });
        return;
    }

    openStickerPicker();
});
stickerUploadBtn?.addEventListener("click", () => {
    stickerUploadInput?.click();
});

stickerUploadInput?.addEventListener("change", async (event) => {
    if (!ensureEditModeAllowsTextOnly("upload sticker")) {
        event.target.value = "";
        return;
    }
    const selectedFile = event.target?.files?.[0];
    if (!selectedFile) {
        event.target.value = "";
        return;
    }

    // Read bytes NOW while the content:// URI grant is still active.
    let buffer;
    try {
        buffer = await selectedFile.arrayBuffer();
    } catch (_readErr) {
        event.target.value = "";
        showModal(
            "Sticker Upload Error",
            "Unable to read the selected file. Please try again.",
            "error",
        );
        return;
    }
    const fileName = selectedFile.name;
    const fileType = selectedFile.type;
    event.target.value = "";

    const standaloneFile = new File([buffer], fileName, { type: fileType });
    await uploadSticker(standaloneFile);
});

async function handleSelectedImageFile(e) {
    if (!ensureEditModeAllowsTextOnly("send image")) {
        e.target.value = null;
        return;
    }
    const file = e.target.files?.[0];
    if (!file) {
        e.target.value = null;
        return;
    }

    if (!file.type.startsWith("image/")) {
        e.target.value = null;
        showModal(
            I18N_TEXT.invalidFileTypeTitle,
            I18N_TEXT.invalidFileTypeImageBody,
            "warning",
        );
        return;
    }

    if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
        e.target.value = null;
        showModal(
            I18N_TEXT.fileTooLargeTitle,
            I18N_TEXT.imageTooLargeBody,
            "warning",
        );
        return;
    }

    // Read bytes NOW while the content:// URI grant is still active (Android revokes
    // it as soon as the input is cleared, causing "permission denied" on later reads).
    let buffer;
    try {
        buffer = await file.arrayBuffer();
    } catch (_readErr) {
        e.target.value = null;
        showModal(
            I18N_TEXT.imageSendErrorTitle,
            "Unable to read the selected file. Please try again.",
            "error",
        );
        return;
    }
    const fileName = file.name;
    const fileType = file.type;
    e.target.value = null;

    const standaloneFile = new File([buffer], fileName, { type: fileType });
    void sendImageMessage(standaloneFile);
}

async function handleSelectedVideoFile(e) {
    if (!ensureEditModeAllowsTextOnly("send video")) {
        e.target.value = null;
        return;
    }
    const file = e.target.files?.[0];
    if (!file) {
        e.target.value = null;
        return;
    }

    const mimeType = String(file.type || "").toLowerCase();
    if (!mimeType.startsWith("video/")) {
        e.target.value = null;
        showModal(
            I18N_TEXT.invalidFileTypeTitle,
            "Please select a video file.",
            "warning",
        );
        return;
    }

    if (file.size > FILE_UPLOAD_MAX_BYTES) {
        e.target.value = null;
        showModal(
            I18N_TEXT.fileTooLargeTitle,
            I18N_TEXT.fileTooLargeBody,
            "warning",
        );
        return;
    }

    // Read bytes NOW while the content:// URI grant is still active.
    let buffer;
    try {
        buffer = await file.arrayBuffer();
    } catch (_readErr) {
        e.target.value = null;
        showModal(
            "Video Send Error",
            "Unable to read the selected file. Please try again.",
            "error",
        );
        return;
    }
    const fileName = file.name;
    const fileType = file.type;
    e.target.value = null;

    const standaloneFile = new File([buffer], fileName, { type: fileType });
    void sendFileMessage(standaloneFile, { asVideo: true });
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
    setComposerStatus(
        "Camera capture is not available on this device/browser.",
        "warning",
    );
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
    setComposerStatus(
        "Video recording is not available on this device/browser.",
        "warning",
    );
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
    } else if (
        !event.target.closest("#imageSourceMenu") &&
        !event.target.closest("#imageUploadBtn")
    ) {
        closeImageSourceMenu();
    }

    if (stickerPickerMenu?.hidden) {
        return;
    }
    if (
        !event.target.closest("#stickerPickerMenu") &&
        !event.target.closest("#stickerPickerBtn")
    ) {
        closeStickerPicker();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && imageSourceMenu && !imageSourceMenu.hidden) {
        closeImageSourceMenu({ restoreFocus: true });
    }
    if (
        event.key === "Escape" &&
        stickerPickerMenu &&
        !stickerPickerMenu.hidden
    ) {
        closeStickerPicker({ restoreFocus: true });
    }
    if (
        event.key === "Escape" &&
        cameraCaptureOverlay &&
        !cameraCaptureOverlay.hidden
    ) {
        closeCameraCaptureOverlay();
    }
    if (
        event.key === "Escape" &&
        videoCaptureOverlay &&
        !videoCaptureOverlay.hidden
    ) {
        stopVideoCaptureRecording({ send: false });
    }
});

cameraCaptureTakeBtn?.addEventListener("click", () => {
    void captureImageFromCameraAndSend();
});

cameraCaptureCancelBtn?.addEventListener("click", closeCameraCaptureOverlay);
cameraCaptureCloseBtn?.addEventListener("click", closeCameraCaptureOverlay);
videoCaptureStartBtn?.addEventListener("click", startVideoCaptureRecording);
videoCaptureStopBtn?.addEventListener("click", () =>
    stopVideoCaptureRecording({ send: true }),
);
videoCaptureCancelBtn?.addEventListener("click", () =>
    stopVideoCaptureRecording({ send: false }),
);
videoCaptureCloseBtn?.addEventListener("click", () =>
    stopVideoCaptureRecording({ send: false }),
);

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
    if (!ensureEditModeAllowsTextOnly("send image")) {
        return;
    }
    // Capture context before any async work
    const capturedTarget = currentChatUser;
    const replyToId = currentReplyTarget?.messageId || null;
    const groupId = parseGroupIdFromToken(capturedTarget);
    clearReplyState();

    const bgId = registerBackgroundUpload("image");
    await acquireUploadSlot(bgId);
    try {
        const mediaPayload = await encryptMediaForMessage(
            imageFile,
            {
                file_name: String(imageFile?.name || "image"),
                mime_type: String(imageFile?.type || "image/jpeg"),
                file_size: Number(imageFile?.size || 0),
            },
            groupId > 0 ? { groupId } : { targetUsername: capturedTarget },
        );

        const formData = new FormData();
        if (groupId > 0) {
            formData.append("group_id", String(groupId));
        } else {
            formData.append("target", capturedTarget);
        }
        formData.append("message", mediaPayload.messageForRecipient);
        formData.append("message_for_sender", mediaPayload.messageForSender);
        formData.append("image_file", mediaPayload.encryptedBlob, "image.enc");
        if (replyToId)
            formData.append("reply_to_message_id", String(replyToId));

        await uploadWithProgress(
            "api/messages/media/send_image.php",
            formData,
            getCsrfHeaders(),
            (pct, loaded, total) =>
                updateBackgroundUploadProgress(bgId, pct, loaded, total),
        );

        if (!isGroupToken(capturedTarget)) {
            addUserToChatList(capturedTarget);
        }
        if (currentChatUser === capturedTarget) {
            loadCurrentChatsRecentMessages();
            setComposerStatus("");
        }
    } catch (err) {
        if (currentChatUser === capturedTarget) {
            setComposerStatus("Image upload failed. Try again.", "error");
        }
        showModal(
            I18N_TEXT.imageSendErrorTitle,
            formatI18nText(I18N_TEXT.imageSendErrorBody, {
                error: err.message || "Unknown",
            }),
            "error",
        );
    } finally {
        completeBackgroundUpload(bgId);
    }
}

async function sendFileMessage(file, { asVideo = false } = {}) {
    if (!ensureEditModeAllowsTextOnly(asVideo ? "send video" : "send file")) {
        return;
    }
    if (!currentChatUser) {
        showModal(
            I18N_TEXT.noChatSelectedTitle,
            I18N_TEXT.noChatSelectedBody,
            "warning",
        );
        return;
    }

    if (asVideo) {
        const mimeType = String(file?.type || "").toLowerCase();
        if (!mimeType.startsWith("video/")) {
            showModal(
                I18N_TEXT.invalidFileTypeTitle,
                "Please select a valid video file.",
                "warning",
            );
            return;
        }
    }

    if (file.size > FILE_UPLOAD_MAX_BYTES) {
        showModal(
            I18N_TEXT.fileTooLargeTitle,
            I18N_TEXT.fileTooLargeBody,
            "warning",
        );
        return;
    }

    const extension = getFileExtension(file?.name || "");
    if (extension && BLOCKED_ATTACHMENT_EXTENSIONS.has(extension)) {
        showModal(
            I18N_TEXT.invalidFileTypeTitle,
            "This file type is blocked for security reasons.",
            "warning",
        );
        return;
    }

    // Capture context before any async work
    const capturedTarget = currentChatUser;
    const replyToId = currentReplyTarget?.messageId || null;
    const groupId = parseGroupIdFromToken(capturedTarget);
    clearReplyState();

    const uploadLabel = asVideo ? "video" : "file";
    const bgId = registerBackgroundUpload(uploadLabel);
    await acquireUploadSlot(bgId);
    try {
        const mediaPayload = await encryptMediaForMessage(
            file,
            {
                file_name: String(file?.name || "file"),
                mime_type: String(file?.type || "application/octet-stream"),
                file_size: Number(file?.size || 0),
            },
            groupId > 0 ? { groupId } : { targetUsername: capturedTarget },
        );

        const formData = new FormData();
        if (groupId > 0) {
            formData.append("group_id", String(groupId));
        } else {
            formData.append("target", capturedTarget);
        }
        formData.append("message", mediaPayload.messageForRecipient);
        formData.append("message_for_sender", mediaPayload.messageForSender);
        formData.append("message_type", asVideo ? "video" : "file");
        formData.append(
            "file",
            mediaPayload.encryptedBlob,
            asVideo ? "video.enc" : "file.enc",
        );
        if (replyToId)
            formData.append("reply_to_message_id", String(replyToId));

        await uploadWithProgress(
            "api/messages/media/send_file.php",
            formData,
            getCsrfHeaders(),
            (pct, loaded, total) =>
                updateBackgroundUploadProgress(bgId, pct, loaded, total),
        );

        if (!isGroupToken(capturedTarget)) {
            addUserToChatList(capturedTarget);
        }
        if (currentChatUser === capturedTarget) {
            loadCurrentChatsRecentMessages();
            setComposerStatus("");
        }
    } catch (err) {
        if (currentChatUser === capturedTarget) {
            setComposerStatus(
                asVideo
                    ? "Video upload failed. Try again."
                    : "File upload failed. Try again.",
                "error",
            );
        }
        showModal(
            asVideo ? "Video Send Error" : "File Send Error",
            (asVideo ? "Video" : "File") + " send error: " + err.message,
            "error",
        );
    } finally {
        completeBackgroundUpload(bgId);
    }
}

// (Changelog / What's New logic moved to changelog.js)
