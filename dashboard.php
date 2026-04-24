<?php
require_once __DIR__ . '/includes/session.php';
require_once __DIR__ . '/includes/constants.php';
require_once __DIR__ . '/includes/db.php';
configSession();

if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}
$username = $_SESSION['username'];
$user_id = $_SESSION['user_id'];
$user_ident = isset($_SESSION['ident']) ? $_SESSION['ident'] : null;
$is_admin = false;
$superuser_username = trim((string) ($_ENV['SUPERUSER_USERNAME'] ?? 'paya'));
$is_superuser = ($superuser_username !== '' && strcasecmp((string) $username, $superuser_username) === 0);
$tips_seen_at = null;
$last_read_announcement_id = 0;

try {
    $adminStmt = $pdo->prepare('SELECT is_admin, banned_at, tips_seen_at, last_read_announcement_id FROM users WHERE id = ? LIMIT 1');
    $adminStmt->execute([$user_id]);
    $adminRow = $adminStmt->fetch(PDO::FETCH_ASSOC);
    if (!empty($adminRow['banned_at'])) {
        $_SESSION = [];
        session_destroy();
        header('Location: index.php');
        exit;
    }
    $is_admin = (bool) ($adminRow['is_admin'] ?? false);
    $tips_seen_at = $adminRow['tips_seen_at'] ?? null;
    $last_read_announcement_id = (int) ($adminRow['last_read_announcement_id'] ?? 0);
    if ($tips_seen_at !== null) {
        $ts = strtotime($tips_seen_at);
        if ($ts !== false) {
            $tips_seen_at = gmdate('Y-m-d\TH:i:s\Z', $ts);
        }
    }
} catch (Throwable $ex) {
    $is_admin = false;
}

$csrfToken = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#6a11cb" />
    <title>TinTinChat Dashboard</title>
    <link rel="manifest" href="manifest.webmanifest" />
    <link rel="icon" href="assets/pwa/icon-192.svg" type="image/svg+xml" />
    <link href="assets/css/ext/bootstrap.min.css?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/css/ext/bootstrap.min.css')); ?>" rel="stylesheet" />
    <link href="assets/css/ext/fontawesome.min.css?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/css/ext/fontawesome.min.css')); ?>" rel="stylesheet" />
    <link href="assets/css/dashboard.css?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/css/dashboard.css')); ?>" rel="stylesheet" />
    <link href="assets/css/style.css?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/css/style.css')); ?>" rel="stylesheet" />
    
</head>

<body>
    <div id="app">
        <nav class="navbar navbar-expand-lg px-3">
            <a class="navbar-brand" href="#">TinTinChat</a>
            <div class="ms-auto d-flex align-items-center">
                <form id="logoutForm" method="post" action="api/auth/logout.php" class="m-0">
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>" />
                    <button type="button" id="logoutBtn" class="btn btn-logout btn-sm">
                        <i class="fas fa-sign-out-alt"></i>
                        <span id="loggedInUsername"><?= htmlspecialchars($username) ?></span>
                    </button>
                </form>
            </div>
        </nav>

        <div class="chat-container">
            <aside class="sidebar">
                <div class="search-container">
                    <input type="text" id="searchUser" class="form-control mb-1" placeholder="Enter username to chat" aria-label="Search username" autocomplete="off" />
                    <div id="searchUserFeedback" class="invalid-feedback" style="display: none; font-size: 0.875em;">
                        Invalid username format
                    </div>
                    <div id="searchLoading" class="search-loading" style="display: none;">
                        <div class="spinner"></div>
                    </div>
                    <div id="searchSuggestions" class="search-suggestions" style="display: none;" role="listbox" aria-label="User suggestions"></div>
                </div>
                <div id='chatListWrapper' class="chat-list-wrapper">
                    <ul class="chat-list" id="chatList" role="list" aria-label="Chats"></ul>

                    <div class="group-actions" aria-hidden="false">
                        <button type="button" id="addChatBtn" class="btn btn-primary add-chat-fab" aria-label="New chat" title="New chat">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button type="button" id="createGroupBtn" class="btn btn-primary create-group-fab" aria-label="Create group" title="Create group">
                            <i class="fas fa-users"></i>
                        </button>
                    </div>
                </div>
                <div id="drawerBottomGrabBar" class="drawer-bottom-grab-bar" aria-hidden="true">
                    <span class="drawer-bottom-grab-pill"></span>
                </div>
            </aside>
            <div id="mobileChatListBackdrop" class="mobile-chatlist-backdrop" hidden></div>

            <section class="chat-area d-flex flex-column">
                <div class="chat-header">
                    <div class="chat-title-stack">
                        <h5 id="chatWith">Select a chat</h5>
                        <div id="typingIndicator" class="typing-indicator" aria-live="polite" aria-atomic="true" hidden></div>
                    </div>
                    <button type="button" id="mobileChatListPullHandle" class="mobile-chatlist-pull-handle" aria-label="Expand chats" aria-expanded="false">
                        <span class="mobile-chatlist-pull-bar" aria-hidden="true"></span>
                    </button>
                    <div class="chat-header-actions ms-auto">
                        <button type="button" id="userInfoBtn" class="btn btn-sm btn-outline-secondary" aria-label="User info" title="User info" hidden>
                            <i class="fas fa-user"></i>
                        </button>
                        <button type="button" id="groupInfoBtn" class="btn btn-sm btn-outline-secondary" aria-label="Group details" title="Group details" hidden>
                            <i class="fas fa-users"></i>
                        </button>
                        <button type="button" id="savedMessagesInfoBtn" class="btn btn-sm btn-outline-secondary" aria-label="Your messages details" title="Your messages details" hidden>
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button type="button" id="alertPanelBtn" class="btn btn-sm btn-outline-secondary alert-panel-btn" aria-label="Announcements" title="Announcements">
                            <i class="fas fa-bullhorn"></i>
                            <span id="alertUnreadDot" class="alert-unread-dot" hidden></span>
                        </button>
                        <button type="button" id="quickConversationSearchBtn" class="btn btn-sm btn-outline-secondary" aria-label="Search in this chat" title="Search in this chat">
                            <i class="fas fa-search"></i>
                        </button>
                        <button type="button" id="chatSettingsBtn" class="btn btn-sm btn-outline-secondary" aria-label="Chat settings" aria-haspopup="true" aria-expanded="false" title="Chat settings">
                            <i class="fas fa-sliders-h"></i>
                        </button>
                        <div id="chatSettingsPanel" class="chat-settings-panel" hidden>
                            <button type="button" id="openUiSettingsBtn" class="chat-setting-item chat-setting-button" aria-label="Open settings modal">
                                <i class="fas fa-sliders-h"></i>
                                <span>Open settings</span>
                            </button>
                            <button type="button" id="installAppBtn" class="chat-setting-item chat-setting-button" aria-label="Install app" hidden>
                                <i class="fas fa-download"></i>
                                <span>Install app</span>
                            </button>
                            <button type="button" id="openGuideBtn" class="chat-setting-item chat-setting-button" aria-label="Open guide">
                                <i class="fas fa-question-circle"></i>
                                <span>Guide</span>
                            </button>
                            <button type="button" id="openConversationSearchBtn" class="chat-setting-item chat-setting-button" aria-label="Search inside current conversation">
                                <i class="fas fa-search"></i>
                                <span>Search in this chat</span>
                            </button>
                            <button type="button" id="openAvatarUploadBtn" class="chat-setting-item chat-setting-button" aria-label="Update profile avatar">
                                <i class="fas fa-user-circle"></i>
                                <span>Update profile avatar</span>
                            </button>
                            <button type="button" id="openAnnouncementsBtn" class="chat-setting-item chat-setting-button" aria-label="Announcements">
                                <i class="fas fa-bullhorn"></i>
                                <span>Announcements</span>
                                <span id="announcementsMenuDot" class="alert-unread-dot announcement-menu-dot" hidden></span>
                            </button>
                            <button type="button" id="openOpinionsBtn" class="chat-setting-item chat-setting-button" aria-label="Your opinions">
                                <i class="fas fa-pen-fancy"></i>
                                <span>Opinions</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="conversationSearchBar" class="conversation-search-bar" hidden>
                    <i class="fas fa-search" aria-hidden="true"></i>
                    <input type="text" id="conversationSearchInput" class="form-control" placeholder="Search this conversation" aria-label="Search inside current conversation">
                    <span id="conversationSearchCount" class="conversation-search-count" aria-live="polite">0 / 0</span>
                    <button type="button" id="conversationSearchRun" class="btn btn-sm btn-outline-secondary" aria-label="Run message search">
                        <i class="fas fa-search"></i>
                    </button>
                    <button type="button" id="conversationSearchPrev" class="btn btn-sm btn-outline-secondary" aria-label="Previous result">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <button type="button" id="conversationSearchNext" class="btn btn-sm btn-outline-secondary" aria-label="Next result">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <button type="button" id="conversationSearchClose" class="btn btn-sm btn-outline-secondary" aria-label="Close conversation search">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <!-- Global Now Playing bar -->
                <div id="globalNowPlayingBar" class="global-now-playing-bar" hidden>
                    <button type="button" id="globalNpToggle" class="global-np-toggle" title="Play/Pause">
                        <i class="fas fa-pause"></i>
                    </button>
                    <div class="global-np-info">
                        <span id="globalNpCaption" class="global-np-caption">Now Playing</span>
                        <div class="global-np-progress-wrap" id="globalNpProgressWrap">
                            <div class="global-np-progress-bar" id="globalNpProgressBar"></div>
                        </div>
                    </div>
                    <span id="globalNpTime" class="global-np-time">0:00</span>
                    <button type="button" id="globalNpClose" class="global-np-close" title="Stop">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="groupInfoPanel" class="group-info-panel" role="region" aria-label="Group details" hidden>
                    <div class="group-page-header">
                        <button type="button" id="groupInfoBackBtn" class="btn btn-sm btn-outline-secondary" aria-label="Back to group chat" title="Back to group chat">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            <h6 id="groupInfoTitle" class="mb-1">Group</h6>
                            <p id="groupInfoDescription" class="mb-0 text-muted"></p>
                        </div>
                    </div>

                    <div class="group-info-meta">
                        <div><strong>Members:</strong> <span id="groupInfoMemberCount">0</span></div>
                    </div>

                    <div class="group-info-members">
                        <ul id="groupInfoMembers" class="mb-2" role="list" aria-label="Group members"></ul>
                    </div>

                    <div class="group-info-stats" id="groupInfoStats">
                        <div class="saved-stats-grid">
                            <div class="saved-stat-item saved-stat-total"><span class="saved-stat-count" id="groupStatTotal">0</span><span class="saved-stat-label">Total</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="groupStatText">0</span><span class="saved-stat-label"><i class="fas fa-comment"></i> Text</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="groupStatVoice">0</span><span class="saved-stat-label"><i class="fas fa-microphone"></i> Voice</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="groupStatImage">0</span><span class="saved-stat-label"><i class="fas fa-image"></i> Image</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="groupStatVideo">0</span><span class="saved-stat-label"><i class="fas fa-video"></i> Video</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="groupStatFile">0</span><span class="saved-stat-label"><i class="fas fa-file"></i> File</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="groupStatSticker">0</span><span class="saved-stat-label"><i class="fas fa-smile"></i> Sticker</span></div>
                        </div>
                    </div>

                    <div class="group-info-music">
                        <div class="group-music-header">
                            <h6 class="mb-0"><i class="fas fa-music me-1"></i>Shared Music <span id="groupMusicCount" class="text-muted">(0)</span></h6>
                        </div>
                        <div class="group-music-body" id="groupMusicBody">
                            <div class="playlist-empty"><i class="fas fa-music me-2"></i>No music shared yet.</div>
                        </div>
                    </div>

                    <div class="group-info-actions">
                        <div class="input-group input-group-sm">
                            <input type="text" id="groupJoinLinkInput" class="form-control" readonly aria-label="Group join link">
                            <button type="button" id="groupCopyJoinLinkBtn" class="btn btn-outline-secondary">Copy</button>
                            <button type="button" id="groupRotateJoinLinkBtn" class="btn btn-outline-secondary">Rotate</button>
                        </div>
                        <div class="group-management-actions mt-2 d-flex gap-2">
                            <button type="button" id="groupAddMemberBtn" class="btn btn-sm btn-outline-primary" hidden>Add Member</button>
                            <button type="button" id="groupTransferOwnerBtn" class="btn btn-sm btn-outline-warning" hidden>Transfer Ownership</button>
                            <button type="button" id="groupLeaveBtn" class="btn btn-sm btn-outline-danger">Leave Group</button>
                        </div>
                    </div>
                </div>
                <div id="savedMessagesInfoPanel" class="saved-messages-info-panel" role="region" aria-label="Your messages details" hidden>
                    <div class="saved-info-header">
                        <button type="button" id="savedInfoBackBtn" class="btn btn-sm btn-outline-secondary" aria-label="Back" title="Back">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            <h6 class="mb-0"><i class="fas fa-bookmark me-1"></i>You</h6>
                        </div>
                    </div>
                    <div class="saved-info-stats" id="savedInfoStats">
                        <div class="saved-stats-grid">
                            <div class="saved-stat-item saved-stat-total"><span class="saved-stat-count" id="savedStatTotal">0</span><span class="saved-stat-label">Total</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="savedStatText">0</span><span class="saved-stat-label"><i class="fas fa-comment"></i> Text</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="savedStatVoice">0</span><span class="saved-stat-label"><i class="fas fa-microphone"></i> Voice</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="savedStatImage">0</span><span class="saved-stat-label"><i class="fas fa-image"></i> Image</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="savedStatVideo">0</span><span class="saved-stat-label"><i class="fas fa-video"></i> Video</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="savedStatFile">0</span><span class="saved-stat-label"><i class="fas fa-file"></i> File</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="savedStatSticker">0</span><span class="saved-stat-label"><i class="fas fa-smile"></i> Sticker</span></div>
                        </div>
                    </div>
                    <div class="saved-info-playlist">
                        <div class="saved-playlist-header">
                            <h6 class="mb-0"><i class="fas fa-music me-1"></i>Playlist <span id="savedPlaylistCount" class="text-muted">(0)</span></h6>
                        </div>
                        <div class="saved-playlist-body" id="savedPlaylistBody">
                            <div class="playlist-empty"><i class="fas fa-music me-2"></i>No tracks yet. Add music from context menu.</div>
                        </div>
                        <div class="saved-playlist-now-playing" id="savedNowPlaying" hidden>
                            <div class="now-playing-info">
                                <span class="now-playing-label"><i class="fas fa-volume-up me-1"></i>Now Playing</span>
                                <span class="now-playing-title" id="nowPlayingTitle"></span>
                            </div>
                            <div class="now-playing-controls">
                                <button type="button" id="nowPlayingPrev" class="now-playing-btn" title="Previous"><i class="fas fa-step-backward"></i></button>
                                <button type="button" id="nowPlayingToggle" class="now-playing-btn now-playing-main" title="Play/Pause"><i class="fas fa-play"></i></button>
                                <button type="button" id="nowPlayingNext" class="now-playing-btn" title="Next"><i class="fas fa-step-forward"></i></button>
                            </div>
                            <div class="now-playing-progress-wrap" id="nowPlayingProgressWrap">
                                <div class="now-playing-progress-bar" id="nowPlayingProgressBar"></div>
                            </div>
                            <div class="now-playing-time">
                                <span id="nowPlayingCurrent">0:00</span> / <span id="nowPlayingDuration">0:00</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="privateChatInfoPanel" class="private-chat-info-panel" role="region" aria-label="Chat details" hidden>
                    <div class="private-info-header">
                        <button type="button" id="privateChatInfoBackBtn" class="btn btn-sm btn-outline-secondary" aria-label="Back" title="Back">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            <h6 class="mb-0">Chat Details</h6>
                        </div>
                    </div>

                    <div class="private-info-profile">
                        <button type="button" id="privateChatAvatarBtn" class="private-info-avatar-btn" aria-label="Show enlarged avatar">
                            <img id="privateChatAvatarImg" src="" alt="User avatar">
                        </button>
                        <div class="private-info-username" id="privateChatUsername"></div>
                        <div class="private-info-ident" id="privateChatIdent"></div>
                        <div class="private-info-bio" id="privateChatBio"></div>
                        <div class="private-info-since" id="privateChatSince"></div>
                    </div>

                    <div class="private-info-stats" id="privateChatStats">
                        <div class="saved-stats-grid">
                            <div class="saved-stat-item saved-stat-total"><span class="saved-stat-count" id="pvStatTotal">0</span><span class="saved-stat-label">Total</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="pvStatText">0</span><span class="saved-stat-label"><i class="fas fa-comment"></i> Text</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="pvStatVoice">0</span><span class="saved-stat-label"><i class="fas fa-microphone"></i> Voice</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="pvStatImage">0</span><span class="saved-stat-label"><i class="fas fa-image"></i> Image</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="pvStatVideo">0</span><span class="saved-stat-label"><i class="fas fa-video"></i> Video</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="pvStatFile">0</span><span class="saved-stat-label"><i class="fas fa-file"></i> File</span></div>
                            <div class="saved-stat-item"><span class="saved-stat-count" id="pvStatSticker">0</span><span class="saved-stat-label"><i class="fas fa-smile"></i> Sticker</span></div>
                        </div>
                    </div>

                    <div class="private-info-music">
                        <div class="private-music-header">
                            <h6 class="mb-0"><i class="fas fa-music me-1"></i>Shared Music <span id="privateMusicCount" class="text-muted">(0)</span></h6>
                        </div>
                        <div class="private-music-body" id="privateMusicBody">
                            <div class="playlist-empty"><i class="fas fa-music me-2"></i>No music shared yet.</div>
                        </div>
                    </div>

                    <div class="private-info-opinion">
                        <div class="private-opinion-header">
                            <h6 class="mb-0"><i class="fas fa-pen-fancy me-1"></i>Your Notes</h6>
                            <button type="button" id="privateOpinionAddBtn" class="private-opinion-add-btn" title="Add a note">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div id="privateOpinionBody" class="private-opinion-body">
                            <div class="opinion-empty">No opinions yet.</div>
                        </div>
                        <div id="privateOpinionFormWrap" class="private-opinion-form-wrap" hidden>
                            <textarea id="privateOpinionInput" class="form-control form-control-sm" maxlength="500" rows="2" placeholder="Write a note about this person..."></textarea>
                            <div class="private-opinion-form-actions">
                                <span class="private-opinion-char-count"><span id="privateOpinionCharCount">0</span>/500</span>
                                <div class="d-flex gap-2">
                                    <button type="button" id="privateOpinionCancelBtn" class="btn btn-sm btn-polished btn-polished-secondary">Cancel</button>
                                    <button type="button" id="privateOpinionSaveBtn" class="btn btn-sm btn-polished btn-polished-primary">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="private-info-actions" id="privateChatActions">
                        <button type="button" id="privateChatBlockBtn" class="private-action-btn private-action-block">
                            <i class="fas fa-user-slash"></i>
                            <span>Block User</span>
                        </button>
                        <button type="button" id="privateChatDeleteBtn" class="private-action-btn private-action-delete">
                            <i class="fas fa-trash-alt"></i>
                            <span>Delete Chat</span>
                        </button>
                    </div>
                </div>

                <div id="selectModeBar" class="select-mode-bar" role="region" aria-label="Selected messages actions" hidden>
                    <div class="select-mode-meta">
                        <span id="selectModeCount" class="select-mode-count">0 selected</span>
                    </div>
                    <div class="select-mode-actions">
                        <button type="button" id="selectModeCancelBtn" class="btn btn-sm btn-outline-secondary" aria-label="Cancel selection">Cancel</button>
                        <button type="button" id="selectModeCopyBtn" class="btn btn-sm btn-outline-info" aria-label="Copy selected messages">Copy</button>
                        <button type="button" id="selectModeForwardBtn" class="btn btn-sm btn-outline-primary" aria-label="Forward selected messages">Forward</button>
                        <button type="button" id="selectModeDeleteBtn" class="btn btn-sm btn-outline-danger" aria-label="Delete selected messages">Delete</button>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages" role="log" aria-live="polite" aria-relevant="additions"></div>
                <div class="chat-input p-3">
                    <div id="replyPreview" class="reply-preview" style="display: none;"></div>
                    <div id="composerStatus" class="composer-status" aria-live="polite"></div>
                    <form id="chatForm" class="d-flex w-100 align-items-center">
                        <div class="composer-sticker-source">
                            <button type="button" id="stickerPickerBtn" class="btn btn-secondary" title="Open sticker picker" aria-label="Open sticker picker" aria-haspopup="dialog" aria-expanded="false">
                                <i class="fas fa-smile"></i>
                            </button>
                            <div id="stickerPickerMenu" class="sticker-picker-menu" role="dialog" aria-label="Sticker picker" hidden>
                                <div class="sticker-picker-header">
                                    <span>Stickers</span>
                                    <button type="button" id="stickerUploadBtn" class="sticker-picker-upload" aria-label="Add sticker">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                <div id="stickerPickerState" class="sticker-picker-state" aria-live="polite">Loading stickers...</div>
                                <div id="stickerPickerProgress" class="sticker-picker-progress" hidden>
                                    <div id="stickerPickerProgressFill" class="sticker-picker-progress-fill"></div>
                                </div>
                                <div id="stickerPickerGrid" class="sticker-picker-grid" role="list"></div>
                            </div>
                        </div>
                        <textarea id="chatInput" class="form-control" placeholder="Type a message..." rows="1" aria-label="Message input"></textarea>
                        <button type="button" id="pasteClipboardImageBtn" class="btn btn-secondary" title="Paste image from clipboard" aria-label="Paste image from clipboard" hidden>
                            <i class="fas fa-paste"></i>
                        </button>
                        
                        <input type="file" id="imageUploadInput" accept="image/*" multiple style="display: none;">
                        <input type="file" id="imageCaptureInput" accept="image/*" capture="environment" style="display: none;">
                        <input type="file" id="videoUploadInput" accept="video/*" style="display: none;">
                        <input type="file" id="videoCaptureInput" accept="video/*" capture="environment" style="display: none;">
                        <input type="file" id="fileUploadInput" style="display: none;">
                        <input type="file" id="avatarUploadInput" accept="image/jpeg,image/png,image/webp,image/gif" style="display: none;">
                        <input type="file" id="stickerUploadInput" accept="image/*" style="display: none;">

                        <button type="button" id="composerToolsToggle" class="btn btn-secondary ms-2" title="Show or hide media actions" aria-label="Toggle media actions">
                            <i class="fas fa-plus"></i>
                        </button>

                        <div class="composer-image-source">
                            <button type="button" id="imageUploadBtn" class="btn btn-secondary ms-2" title="Send media" aria-label="Send media" aria-haspopup="menu" aria-expanded="false">
                                <i class="fas fa-image"></i>
                            </button>
                            <div id="imageSourceMenu" class="image-source-menu" role="menu" aria-label="Choose media source" hidden>
                                <button type="button" id="imageSourceCameraBtn" class="image-source-menu-item" role="menuitem">
                                    <i class="fas fa-camera"></i>
                                    <span>Take new photo</span>
                                </button>
                                <button type="button" id="imageSourceGalleryBtn" class="image-source-menu-item" role="menuitem">
                                    <i class="fas fa-images"></i>
                                    <span>Select photo</span>
                                </button>
                                <button type="button" id="imageSourceRecordVideoBtn" class="image-source-menu-item" role="menuitem">
                                    <i class="fas fa-video"></i>
                                    <span>Record new video</span>
                                </button>
                                <button type="button" id="imageSourceSelectVideoBtn" class="image-source-menu-item" role="menuitem">
                                    <i class="fas fa-film"></i>
                                    <span>Select video</span>
                                </button>
                                <div id="imageSourceMenuHint" class="image-source-menu-hint" aria-live="polite"></div>
                            </div>
                        </div>

                        <button type="button" id="voiceBtn" class="btn btn-secondary ms-2" title="Record voice message" aria-label="Record voice message">
                            <i class="fas fa-microphone"></i>
                        </button>

                        <button type="submit" id="sendBtn" class="btn btn-primary ms-2" title="Send message (long press for file upload)" aria-label="Send message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                </form>
                </div>
            </section>
        </div>
    </div>

    <div id="messageActionModalOverlay" class="message-action-modal-overlay" hidden>
        <div class="message-action-modal" role="dialog" aria-modal="true" aria-labelledby="messageActionModalTitle">
            <div class="message-action-modal-header">
                <h5 id="messageActionModalTitle" class="message-action-modal-title">Message Action</h5>
                <button type="button" id="messageActionModalClose" class="message-action-modal-close" aria-label="Close action modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="messageActionModalBody" class="message-action-modal-body"></div>
        </div>
    </div>
    <div id="messageActionModalAnnouncer" class="visually-hidden" role="status" aria-live="polite" aria-atomic="true"></div>

    <div id="chatUiSettingsOverlay" class="message-action-modal-overlay" hidden>
        <div class="message-action-modal" role="dialog" aria-modal="true" aria-labelledby="chatUiSettingsTitle">
            <div class="message-action-modal-header">
                <h5 id="chatUiSettingsTitle" class="message-action-modal-title">Settings</h5>
                <button type="button" id="chatUiSettingsClose" class="message-action-modal-close" aria-label="Close settings">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="message-action-modal-body">
                <div class="chat-ui-settings-shell">
                    <div class="chat-ui-settings-tabs" role="tablist" aria-label="Settings sections">
                        <button type="button" id="chatUiSettingsTabGeneral" class="chat-ui-settings-tab is-active" role="tab" aria-selected="true" aria-controls="chatUiSettingsPanelGeneral">General</button>
                        <button type="button" id="chatUiSettingsTabAccount" class="chat-ui-settings-tab" role="tab" aria-selected="false" aria-controls="chatUiSettingsPanelAccount">Account</button>
                        <button type="button" id="chatUiSettingsTabSessions" class="chat-ui-settings-tab" role="tab" aria-selected="false" aria-controls="chatUiSettingsPanelSessions">Sessions</button>
                        <button type="button" id="chatUiSettingsTabIdeas" class="chat-ui-settings-tab" role="tab" aria-selected="false" aria-controls="chatUiSettingsPanelIdeas">Ideas</button>
                        <?php if ($is_admin): ?>
                        <button type="button" id="chatUiSettingsTabAdmin" class="chat-ui-settings-tab" role="tab" aria-selected="false" aria-controls="chatUiSettingsPanelAdmin">Admin</button>
                        <?php endif; ?>
                    </div>

                    <section id="chatUiSettingsPanelGeneral" class="chat-ui-settings-panel" role="tabpanel" aria-labelledby="chatUiSettingsTabGeneral">
                        <div class="chat-ui-settings-list">
                            <label class="chat-ui-settings-item" for="settingThemeMode">
                                <span>Theme mode</span>
                                <span class="chat-ui-settings-control">
                                    <select id="settingThemeMode" class="form-select form-select-sm" aria-label="Theme mode">
                                        <option value="system">System</option>
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </span>
                            </label>

                            <label class="chat-ui-settings-item" for="settingDensityMode">
                                <span>Message density</span>
                                <span class="chat-ui-settings-control">
                                    <select id="settingDensityMode" class="form-select form-select-sm" aria-label="Message density">
                                        <option value="comfortable">Comfortable</option>
                                        <option value="compact">Compact</option>
                                    </select>
                                </span>
                            </label>

                            <label class="chat-ui-settings-item" for="settingFontScale">
                                <span>Font size</span>
                                <span class="chat-ui-settings-control">
                                    <select id="settingFontScale" class="form-select form-select-sm" aria-label="Font size">
                                        <option value="sm">Small</option>
                                        <option value="md">Default</option>
                                        <option value="lg">Large</option>
                                        <option value="xl">Extra large</option>
                                    </select>
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>Show message timestamps</span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingShowTimestamps" checked>
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>Reduce motion</span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingReduceMotion">
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>
                                    <span>Performance mode</span>
                                    <small class="chat-ui-settings-hint">Reduces animations and polling frequency. Recommended for iOS devices.</small>
                                </span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingIosLagFix">
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>
                                    <span>Classic design</span>
                                    <small class="chat-ui-settings-hint">Removes visual effects for maximum performance. Requires Performance mode.</small>
                                </span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingClassicDesign" disabled>
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>Interactive message searching</span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingInteractiveMessageSearch">
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>
                                    <span>Search placeholders</span>
                                    <small class="chat-ui-settings-hint">Enables <code>%</code> (any text) and <code>_</code> (any single character) wildcards in message search.</small>
                                </span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingSearchWildcards">
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>Notification sound</span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingNotificationSound" checked>
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>Auto-scroll to latest</span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingAutoScroll" checked>
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>Send by Enter</span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingSendByEnter" checked>
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>Show "You" in chat list</span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingShowSavedMessages" checked>
                                </span>
                            </label>

                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>Browser notifications</span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingBrowserNotifications">
                                </span>
                            </label>

                            <?php if ($is_admin): ?>
                            <label class="chat-ui-settings-item chat-ui-settings-item-check">
                                <span>
                                    <span>Compress images</span>
                                    <small class="chat-ui-settings-hint">Compresses photo messages before upload to reduce file size.</small>
                                </span>
                                <span class="chat-ui-settings-control">
                                    <input type="checkbox" id="settingCompressImages" checked>
                                </span>
                            </label>
                            <?php endif; ?>

                            <div class="chat-ui-settings-item chat-ui-settings-item-action">
                                <span>
                                    <span>Media cache</span>
                                    <small id="mediaCacheSizeLabel" class="chat-ui-settings-hint">Calculating…</small>
                                </span>
                                <span class="chat-ui-settings-control">
                                    <button type="button" id="clearMediaCacheBtn" class="btn btn-sm btn-polished btn-polished-danger">Clear</button>
                                </span>
                            </div>
                                <div class="chat-ui-settings-item chat-ui-settings-item-action">
                                    <span>
                                        <span>Clear Data &amp; Logout</span>
                                        <small class="chat-ui-settings-hint">Clears cookies and session. You will be logged out.</small>
                                    </span>
                                    <span class="chat-ui-settings-control">
                                        <button type="button" id="clearCookiesBtn" class="btn btn-sm btn-polished btn-polished-danger">Clear</button>
                                    </span>
                                </div>
                        </div>
                    </section>

                    <section id="chatUiSettingsPanelAccount" class="chat-ui-settings-panel" role="tabpanel" aria-labelledby="chatUiSettingsTabAccount" hidden>
                        <div class="chat-ui-account-section">
                            <div class="chat-ui-account-row">
                                <div class="chat-ui-account-avatar-wrap">
                                    <img id="settingsAvatarPreview" class="chat-ui-account-avatar-preview" src="" alt="Current profile avatar" />
                                </div>
                                <div class="chat-ui-account-row-content">
                                    <div class="chat-ui-account-title">Profile avatar</div>
                                    <div class="chat-ui-account-subtitle">Upload a new profile image.</div>
                                </div>
                                <button type="button" id="settingsAvatarUploadBtn" class="btn btn-sm btn-outline-secondary">Change avatar</button>
                            </div>
                        </div>

                        <form id="settingsBioForm" class="chat-ui-account-section">
                            <div class="chat-ui-account-title">Bio</div>
                            <div class="chat-ui-account-subtitle">A short description about yourself.</div>
                            <label class="chat-ui-settings-field" for="settingsBioInput">
                                <span>Your bio</span>
                                <textarea id="settingsBioInput" class="form-control form-control-sm" maxlength="255" rows="3" placeholder="Tell others a bit about yourself..."></textarea>
                            </label>
                            <div class="settings-bio-counter"><span id="settingsBioCharCount">0</span> / 255</div>
                            <button type="submit" class="btn btn-sm btn-polished btn-polished-primary">Save bio</button>
                        </form>

                        <form id="settingsUsernameForm" class="chat-ui-account-section">
                            <div class="chat-ui-account-title">Username</div>
                            <div class="chat-ui-account-subtitle">Current: <strong id="settingsCurrentUsername"><?= htmlspecialchars($username) ?></strong></div>
                            <label class="chat-ui-settings-field" for="settingsUsernameInput">
                                <span>New username</span>
                                <input type="text" id="settingsUsernameInput" class="form-control form-control-sm" minlength="3" maxlength="50" value="<?= htmlspecialchars($username) ?>" autocomplete="username" required>
                            </label>
                            <button type="submit" class="btn btn-sm btn-polished btn-polished-primary">Save username</button>
                        </form>

                        <div class="chat-ui-account-section">
                            <div class="chat-ui-account-row">
                                <div class="chat-ui-account-row-content">
                                    <div class="chat-ui-account-title">Blocked users</div>
                                    <div class="chat-ui-account-subtitle">Users you've blocked cannot message you.</div>
                                </div>
                                <button type="button" id="settingsRefreshBlockedBtn" class="btn btn-sm btn-outline-secondary">
                                    <i class="fas fa-sync-alt me-1"></i>Refresh
                                </button>
                            </div>
                            <div id="settingsBlockedUsersList" class="chat-ui-blocked-list" aria-live="polite">
                                <div class="chat-ui-admin-empty">Click refresh to load blocked users.</div>
                            </div>
                        </div>

                        <form id="settingsPasswordForm" class="chat-ui-account-section">
                            <div class="chat-ui-account-title">Password</div>
                            <label class="chat-ui-settings-field" for="settingsCurrentPasswordInput">
                                <span>Current password</span>
                                <input type="password" id="settingsCurrentPasswordInput" class="form-control form-control-sm" autocomplete="current-password" required>
                            </label>
                            <label class="chat-ui-settings-field" for="settingsNewPasswordInput">
                                <span>New password</span>
                                <input type="password" id="settingsNewPasswordInput" class="form-control form-control-sm" minlength="8" autocomplete="new-password" required>
                            </label>
                            <label class="chat-ui-settings-field" for="settingsConfirmPasswordInput">
                                <span>Confirm new password</span>
                                <input type="password" id="settingsConfirmPasswordInput" class="form-control form-control-sm" minlength="8" autocomplete="new-password" required>
                            </label>
                            <button type="submit" class="btn btn-sm btn-polished btn-polished-primary">Change password</button>
                        </form>
                    </section>

                    <section id="chatUiSettingsPanelSessions" class="chat-ui-settings-panel" role="tabpanel" aria-labelledby="chatUiSettingsTabSessions" hidden>
                        <div class="chat-ui-account-section">
                            <div class="chat-ui-account-row">
                                <div class="chat-ui-account-row-content">
                                    <div class="chat-ui-account-title">Active sessions</div>
                                    <div class="chat-ui-account-subtitle">Devices where you're currently logged in.</div>
                                </div>
                                <button type="button" id="settingsRefreshSessionsBtn" class="btn btn-sm btn-outline-secondary">
                                    <i class="fas fa-sync-alt me-1"></i>Refresh
                                </button>
                            </div>
                            <div id="settingsSessionsList" class="chat-ui-sessions-list" aria-live="polite">
                                <div class="chat-ui-admin-empty">Loading sessions...</div>
                            </div>
                        </div>
                    </section>

                    <section id="chatUiSettingsPanelIdeas" class="chat-ui-settings-panel" role="tabpanel" aria-labelledby="chatUiSettingsTabIdeas" hidden>
                        <div class="ideas-hint">
                            Here you can write Ideas/Problems related to this app; Not that I care or give a fuck, I just like giving false hope to people.
                        </div>

                        <?php if (!$is_superuser): ?>
                        <form id="ideasSubmitForm" class="ideas-compose">
                            <textarea id="ideasBodyInput" class="form-control" rows="3" maxlength="2000" placeholder="Describe your idea, feature request, or bug report..."></textarea>
                            <button type="submit" class="btn btn-sm btn-polished btn-polished-primary ideas-submit-btn">
                                <i class="fas fa-paper-plane me-1"></i>Post Idea
                            </button>
                        </form>
                        <?php endif; ?>

                        <div id="ideasList" class="ideas-list" aria-live="polite">
                            <div class="chat-ui-admin-empty">Loading ideas...</div>
                        </div>
                    </section>

                    <?php if ($is_admin): ?>
                    <section id="chatUiSettingsPanelAdmin" class="chat-ui-settings-panel" role="tabpanel" aria-labelledby="chatUiSettingsTabAdmin" hidden>

                        <div class="chat-ui-admin-group">
                            <div class="chat-ui-admin-group-header"><i class="fas fa-tools me-2"></i>Tools</div>
                            <div class="chat-ui-admin-section">
                                <div class="chat-ui-admin-row">
                                    <div>
                                        <div class="chat-ui-account-title">Group key health</div>
                                        <div class="chat-ui-account-subtitle">Run encryption health checks for your groups.</div>
                                    </div>
                                    <button type="button" id="settingsGroupKeyHealthBtn" class="btn btn-sm btn-outline-secondary">
                                        <i class="fas fa-shield-alt me-1"></i>Run Check
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="chat-ui-admin-group">
                            <div class="chat-ui-admin-group-header"><i class="fas fa-icons me-2"></i>Content</div>
                            <div class="chat-ui-admin-section">
                                <div class="chat-ui-admin-row">
                                    <div>
                                        <div class="chat-ui-account-title">Stickers</div>
                                        <div class="chat-ui-account-subtitle">Toggle admin-only visibility for each sticker.</div>
                                    </div>
                                    <button type="button" id="settingsAdminRefreshStickersBtn" class="btn btn-sm btn-outline-secondary">Refresh</button>
                                </div>
                                <div id="settingsAdminStickerList" class="chat-ui-admin-list" aria-live="polite">
                                    <div class="chat-ui-admin-empty">Loading stickers...</div>
                                </div>
                            </div>
                        </div>

                        <?php if ($is_superuser): ?>
                        <div class="chat-ui-admin-group">
                            <div class="chat-ui-admin-group-header"><i class="fas fa-users-cog me-2"></i>User Management</div>
                            <div class="chat-ui-admin-section">
                                <div class="chat-ui-admin-row">
                                    <div>
                                        <div class="chat-ui-account-title">Users</div>
                                        <div class="chat-ui-account-subtitle">Manage admin roles and ban users.</div>
                                    </div>
                                    <div class="chat-ui-admin-row-tools">
                                        <button type="button" id="settingsAdminRefreshUsersBtn" class="btn btn-sm btn-outline-secondary">Refresh</button>
                                    </div>
                                </div>
                                <div id="settingsAdminUsersList" class="chat-ui-admin-list" aria-live="polite">
                                    <div class="chat-ui-admin-empty">Loading users...</div>
                                </div>
                            </div>
                        </div>

                        <div class="chat-ui-admin-group">
                            <div class="chat-ui-admin-group-header"><i class="fas fa-bullhorn me-2"></i>Announcements</div>
                            <div class="chat-ui-admin-section">
                                <div class="chat-ui-admin-row">
                                    <div>
                                        <div class="chat-ui-account-title">Global Notices</div>
                                        <div class="chat-ui-account-subtitle">Post announcements visible to all users.</div>
                                    </div>
                                </div>
                                <div class="announcement-create-form">
                                    <div class="announcement-create-form-header">
                                        <i class="fas fa-pen-fancy"></i>
                                        <span>New Announcement</span>
                                    </div>
                                    <div class="announcement-input-wrap">
                                        <input type="text" id="announcementTitleInput" class="form-control form-control-sm" placeholder="Announcement title..." maxlength="200">
                                        <span class="announcement-char-count" id="announcementTitleCharCount">0/200</span>
                                    </div>
                                    <div class="announcement-input-wrap">
                                        <textarea id="announcementBodyInput" class="form-control form-control-sm" placeholder="Write your announcement..." rows="3" maxlength="5000"></textarea>
                                        <span class="announcement-char-count" id="announcementBodyCharCount">0/5000</span>
                                    </div>
                                    <div class="announcement-create-form-actions">
                                        <span class="announcement-form-hint"><i class="fas fa-globe me-1"></i>Visible to all users</span>
                                        <button type="button" id="announcementCreateBtn" class="btn btn-sm announcement-post-btn">
                                            <i class="fas fa-paper-plane me-1"></i>Publish
                                        </button>
                                    </div>
                                </div>
                                <div class="announcement-admin-list-header">
                                    <span>Previous Announcements</span>
                                    <button type="button" id="settingsAdminRefreshAnnouncementsBtn" class="announcement-refresh-btn" title="Refresh"><i class="fas fa-sync-alt"></i></button>
                                </div>
                                <div id="settingsAdminAnnouncementsList" class="chat-ui-admin-list" aria-live="polite">
                                    <div class="chat-ui-admin-empty">Loading announcements...</div>
                                </div>
                            </div>
                        </div>

                        <div class="chat-ui-admin-group">
                            <div class="chat-ui-admin-group-header"><i class="fas fa-database me-2"></i>Storage</div>
                            <div class="chat-ui-admin-section">
                                <div class="chat-ui-admin-row">
                                    <div>
                                        <div class="chat-ui-account-title">Media cleanup</div>
                                        <div class="chat-ui-account-subtitle">Delete old large media files to free disk space.</div>
                                    </div>
                                </div>
                                <div class="media-cleanup-form">
                                    <label class="chat-ui-settings-field" for="mediaCleanupDays">
                                        <span>Older than (days)</span>
                                        <input type="number" id="mediaCleanupDays" class="form-control form-control-sm" min="1" value="90" style="max-width:120px">
                                    </label>
                                    <label class="chat-ui-settings-field" for="mediaCleanupMaxSize">
                                        <span>Larger than (MB)</span>
                                        <input type="number" id="mediaCleanupMaxSize" class="form-control form-control-sm" min="1" value="5" step="0.5" style="max-width:120px">
                                    </label>
                                    <label class="form-check form-switch media-cleanup-switch" for="mediaCleanupIncludeSaved">
                                        <input class="form-check-input" type="checkbox" id="mediaCleanupIncludeSaved">
                                        <span class="form-check-label">Include Saved Messages</span>
                                    </label>
                                    <label class="form-check form-switch media-cleanup-switch" for="mediaCleanupIncludePlaylists">
                                        <input class="form-check-input" type="checkbox" id="mediaCleanupIncludePlaylists">
                                        <span class="form-check-label">Include Playlists</span>
                                    </label>
                                    <button type="button" id="mediaAnalyzeBtn" class="btn btn-sm btn-polished btn-polished-info">
                                        <i class="fas fa-chart-bar me-1"></i>Analyze
                                    </button>
                                    <button type="button" id="mediaCleanupBtn" class="btn btn-sm btn-polished btn-polished-danger">
                                        <i class="fas fa-broom me-1"></i>Clean up
                                    </button>
                                </div>
                                <div id="mediaCleanupResult" class="chat-ui-admin-empty" style="display:none"></div>
                            </div>
                        </div>

                        <?php else: ?>
                        <div class="chat-ui-admin-section">
                            <div class="chat-ui-admin-empty">Only the developer can manage admin roles and storage.</div>
                        </div>
                        <?php endif; ?>
                    </section>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <div id="userProfileModalOverlay" class="user-profile-modal-overlay" hidden aria-hidden="true">
        <div class="user-profile-modal" role="dialog" aria-modal="true" aria-labelledby="userProfileModalTitle">
            <div class="user-profile-modal-header">
                <h5 id="userProfileModalTitle" class="user-profile-modal-title">User Info</h5>
                <button type="button" id="userProfileModalClose" class="user-profile-modal-close" aria-label="Close user info">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="userProfileModalBody" class="user-profile-modal-body"></div>
        </div>
    </div>

    <div id="avatarViewerOverlay" class="avatar-viewer-overlay" hidden aria-hidden="true">
        <div class="avatar-viewer-content" role="dialog" aria-modal="true" aria-labelledby="avatarViewerTitle">
            <button type="button" id="avatarViewerClose" class="avatar-viewer-close" aria-label="Close avatar viewer">
                <i class="fas fa-times"></i>
            </button>
            <img id="avatarViewerImage" class="avatar-viewer-image" src="" alt="User avatar" />
            <div id="avatarViewerTitle" class="avatar-viewer-title"></div>
        </div>
    </div>

    <div id="addChatModalOverlay" class="add-chat-modal-overlay" hidden>
        <div class="add-chat-modal" role="dialog" aria-modal="true" aria-labelledby="addChatModalTitle">
            <div class="add-chat-modal-header">
                <h5 id="addChatModalTitle" class="add-chat-modal-title">New Chat</h5>
                <button type="button" id="addChatModalClose" class="add-chat-modal-close" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="add-chat-modal-body">
                <div class="add-chat-search-wrap">
                    <i class="fas fa-search add-chat-search-icon"></i>
                    <input type="text" id="addChatSearchInput" class="form-control" placeholder="Search username..." autocomplete="off" maxlength="60" />
                </div>
                <div id="addChatResults" class="add-chat-results"></div>
                <div id="addChatEmpty" class="add-chat-empty" hidden>
                    <i class="fas fa-user-plus"></i>
                    <p>Type a username to find someone</p>
                </div>
            </div>
        </div>
    </div>

    <div id="createGroupModalOverlay" class="create-group-modal-overlay" hidden>
        <div class="create-group-modal" role="dialog" aria-modal="true" aria-labelledby="createGroupModalTitle">
            <div class="create-group-modal-header">
                <h5 id="createGroupModalTitle" class="create-group-modal-title">Create Group</h5>
                <button type="button" id="createGroupModalClose" class="create-group-modal-close" aria-label="Close create group modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="createGroupForm" class="create-group-modal-body">
                <label class="create-group-field" for="createGroupTitleInput">
                    <span>Title</span>
                    <input type="text" id="createGroupTitleInput" class="form-control" maxlength="120" required>
                </label>
                <label class="create-group-field" for="createGroupDetailsInput">
                    <span>Details</span>
                    <textarea id="createGroupDetailsInput" class="form-control" rows="3" maxlength="500"></textarea>
                </label>
                <div class="create-group-modal-actions">
                    <button type="submit" id="createGroupSubmitBtn" class="btn btn-primary">Create Group</button>
                </div>
            </form>
        </div>
    </div>

    <div id="cameraCaptureOverlay" class="camera-capture-overlay" hidden>
        <div class="camera-capture-modal" role="dialog" aria-modal="true" aria-labelledby="cameraCaptureTitle">
            <div class="camera-capture-header">
                <h5 id="cameraCaptureTitle" class="camera-capture-title">Take a new image</h5>
                <button type="button" id="cameraCaptureClose" class="camera-capture-close" aria-label="Close camera capture">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="camera-capture-body">
                <video id="cameraCaptureVideo" class="camera-capture-video" autoplay playsinline muted></video>
                <canvas id="cameraCaptureCanvas" class="camera-capture-canvas" hidden></canvas>
            </div>
            <div class="camera-capture-actions">
                <button type="button" id="cameraCaptureTake" class="btn btn-primary">Capture & Send</button>
                <button type="button" id="cameraCaptureCancel" class="btn btn-outline-secondary">Cancel</button>
            </div>
        </div>
    </div>

    <div id="videoCaptureOverlay" class="camera-capture-overlay" hidden>
        <div class="camera-capture-modal" role="dialog" aria-modal="true" aria-labelledby="videoCaptureTitle">
            <div class="camera-capture-header">
                <h5 id="videoCaptureTitle" class="camera-capture-title">Record new video</h5>
                <button type="button" id="videoCaptureClose" class="camera-capture-close" aria-label="Close video recorder">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="camera-capture-body">
                <video id="videoCaptureVideo" class="camera-capture-video" autoplay playsinline muted></video>
            </div>
            <div class="camera-capture-actions">
                <span id="videoCaptureTimer" class="video-capture-timer">00:00</span>
                <button type="button" id="videoCaptureStart" class="btn btn-primary">Start recording</button>
                <button type="button" id="videoCaptureStop" class="btn btn-danger" disabled>Stop &amp; Send</button>
                <button type="button" id="videoCaptureCancel" class="btn btn-outline-secondary">Cancel</button>
            </div>
        </div>
    </div>

    <div id="stickerBgChoiceOverlay" class="sticker-bg-choice-overlay" hidden>
        <div class="sticker-bg-choice-modal" role="dialog" aria-modal="true" aria-labelledby="stickerBgChoiceTitle">
            <div class="sticker-bg-choice-header">
                <h5 id="stickerBgChoiceTitle" class="sticker-bg-choice-title">Sticker background</h5>
                <button type="button" id="stickerBgChoiceClose" class="sticker-bg-choice-close" aria-label="Close background choice">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p class="sticker-bg-choice-subtitle">Choose how this sticker should be uploaded.</p>
            <div id="stickerBgChoiceLoading" class="sticker-bg-choice-loading">Preparing previews...</div>
            <div id="stickerBgChoiceGrid" class="sticker-bg-choice-grid" hidden>
                <button type="button" id="stickerBgKeepBtn" class="sticker-bg-choice-card" aria-label="Keep original sticker image">
                    <span class="sticker-bg-choice-label">Keep original</span>
                    <img id="stickerBgKeepPreview" class="sticker-bg-choice-preview" alt="Sticker preview without background removal" />
                </button>
                <button type="button" id="stickerBgRemoveBtn" class="sticker-bg-choice-card" aria-label="Remove black and white background around sticker">
                    <span class="sticker-bg-choice-label">Remove background</span>
                    <img id="stickerBgRemovePreview" class="sticker-bg-choice-preview" alt="Sticker preview with background removal" />
                </button>
            </div>
        </div>
    </div>

    <?php require_once __DIR__ . '/includes/modal.php' ?>

    <!-- Changelog / What's New tip modal -->
    <div id="changelogOverlay" class="changelog-overlay" style="display:none;">
        <div class="changelog-modal">
            <div class="changelog-header">
                <span class="changelog-badge">What's New</span>
                <button type="button" class="changelog-close" id="changelogCloseBtn" aria-label="Close"><i class="fas fa-times"></i></button>
            </div>
            <div class="changelog-body" id="changelogBody">
                <!-- Content injected by JS -->
            </div>
            <div class="changelog-footer">
                <button type="button" class="btn btn-primary changelog-dismiss-btn" id="changelogDismissBtn">
                    <i class="fas fa-check me-1"></i>Got it!
                </button>
            </div>
        </div>
    </div>

    <!-- Playlist panel -->
    <div id="playlistOverlay" class="playlist-overlay" hidden>
        <div class="playlist-panel" role="dialog" aria-modal="true" aria-labelledby="playlistPanelTitle">
            <div class="playlist-header">
                <span class="playlist-badge"><i class="fas fa-music me-1"></i>Playlist</span>
                <button type="button" class="playlist-close" id="playlistCloseBtn" aria-label="Close"><i class="fas fa-times"></i></button>
            </div>
            <div class="playlist-body" id="playlistBody">
                <div class="playlist-empty"><i class="fas fa-music me-2"></i>No tracks yet. Add music from context menu.</div>
            </div>
        </div>
    </div>

    <!-- Announcements / Alerts panel -->
    <div id="announcementsOverlay" class="announcements-overlay" hidden>
        <div class="announcements-panel" role="dialog" aria-modal="true" aria-labelledby="announcementsPanelTitle">
            <div class="announcements-header">
                <div class="announcements-header-left">
                    <span class="announcements-icon-wrap"><i class="fas fa-bullhorn"></i></span>
                    <div>
                        <span class="announcements-badge" id="announcementsPanelTitle">Announcements</span>
                        <span class="announcements-count" id="announcementsCount"></span>
                    </div>
                </div>
                <button type="button" class="announcements-close" id="announcementsCloseBtn" aria-label="Close"><i class="fas fa-times"></i></button>
            </div>
            <div class="announcements-body" id="announcementsBody">
                <div class="announcements-loading"><i class="fas fa-circle-notch fa-spin"></i><span>Loading...</span></div>
            </div>
        </div>
    </div>

    <!-- Opinions panel -->
    <div id="opinionsOverlay" class="opinions-overlay" hidden>
        <div class="opinions-panel" role="dialog" aria-modal="true" aria-labelledby="opinionsPanelTitle">
            <div class="opinions-header">
                <div class="opinions-header-left">
                    <span class="opinions-icon-wrap"><i class="fas fa-pen-fancy"></i></span>
                    <div>
                        <span class="opinions-badge" id="opinionsPanelTitle">Your Opinions</span>
                        <span class="opinions-count" id="opinionsCount"></span>
                    </div>
                </div>
                <button type="button" class="opinions-close" id="opinionsCloseBtn" aria-label="Close"><i class="fas fa-times"></i></button>
            </div>
            <div class="opinions-hint">
                <i class="fas fa-lock"></i>
                Opinions are private notes you keep for yourself. No one else can see or read them.
            </div>
            <div class="opinions-body" id="opinionsBody">
                <div class="opinions-loading"><i class="fas fa-circle-notch fa-spin"></i><span>Loading...</span></div>
            </div>
        </div>
    </div>

    <div id="guideOverlay" class="guide-overlay" style="display:none;">
        <div class="guide-modal">
            <div class="guide-header">
                <span class="guide-badge"><i class="fas fa-compass me-1"></i>Guide</span>
                <button type="button" class="guide-close" id="guideCloseBtn" aria-label="Close"><i class="fas fa-times"></i></button>
            </div>
            <div class="guide-body" id="guideBody"></div>
            <div class="guide-footer">
                <button type="button" class="btn btn-primary guide-dismiss-btn" id="guideDismissBtn">
                    <i class="fas fa-check me-1"></i>Got it!
                </button>
            </div>
        </div>
    </div>

    <script src="assets/js/ext/bootstrap.bundle.min.js"></script>
    <script>
        const CURRENT_USER = <?= json_encode($username) ?>;
        const CURRENT_USER_ID = <?= json_encode($user_id) ?>;
        const CSRF_TOKEN = <?= json_encode($csrfToken) ?>;
        const APP_CONSTANTS = <?= json_encode(tintinchatFrontendConstants()) ?>;
        const CURRENT_USER_IS_ADMIN = <?= json_encode($is_admin) ?>;
        const CURRENT_USER_IS_SUPERUSER = <?= json_encode($is_superuser) ?>;
        window.CURRENT_USER_IS_ADMIN = CURRENT_USER_IS_ADMIN;
        window.CURRENT_USER_IS_SUPERUSER = CURRENT_USER_IS_SUPERUSER;
        const USER_TIPS_SEEN_AT = <?= json_encode($tips_seen_at) ?>;
        const LAST_READ_ANNOUNCEMENT_ID = <?= json_encode($last_read_announcement_id) ?>;
        const PWA_SW_VERSION = <?= json_encode((string) @filemtime(__DIR__ . '/service-worker.js')) ?>;
        const currentUserIdent = <?= json_encode($user_ident) ?>;
        if(currentUserIdent?.length) {
            localStorage.setItem('ident', currentUserIdent);
        }
        const searchUserElement = document.getElementById('searchUser');
        const searchSuggestionsElement = document.getElementById('searchSuggestions');
        const chatListWrapperElement = document.getElementById('chatListWrapper');
        const mobileChatListPullHandle = document.getElementById('mobileChatListPullHandle');
        const mobileChatListBackdrop = document.getElementById('mobileChatListBackdrop');
        const drawerBottomGrabBar = document.getElementById('drawerBottomGrabBar');
        const sidebarElement = document.querySelector('.sidebar');
        const MOBILE_DRAWER_BREAKPOINT = 767.98;
        let isMobileDrawerOpen = false;
        let mobileChatSelected = false;

        function isMobileDrawerViewport() {
            return window.innerWidth <= MOBILE_DRAWER_BREAKPOINT;
        }

        // Hide/show entire sidebar on mobile when a chat is selected/deselected
        function updateMobileSidebarVisibility() {
            if (!sidebarElement) return;
            if (!isMobileDrawerViewport()) {
                sidebarElement.style.display = '';
                return;
            }
            if (mobileChatSelected && !isMobileDrawerOpen) {
                sidebarElement.style.display = 'none';
            } else {
                sidebarElement.style.display = '';
            }
        }

        window.setMobileChatSelected = function (selected) {
            mobileChatSelected = Boolean(selected);
            if (isMobileDrawerViewport()) {
                updateMobileSidebarVisibility();
            }
        };

        function setCompactChatListVisible(visible) {
            if (!chatListWrapperElement) return;
            if (!isMobileDrawerViewport()) {
                chatListWrapperElement.style.display = 'block';
                return;
            }
            chatListWrapperElement.style.display = Boolean(visible) ? 'block' : 'none';
        }

        // --- Drawer state machine ---
        // States: hidden (no list) → compact (horizontal list) → expanded (full-screen drawer)
        let drawerDragState = null;
        let drawerDragJustEnded = false;
        let drawerTransitionCleanup = 0;
        let drawerSpacer = null; // placeholder to prevent layout jump
        let drawerCompactHeight = 0; // cached compact sidebar height for pull-up

        function drawerCancelPendingCleanup() {
            if (drawerTransitionCleanup) {
                clearTimeout(drawerTransitionCleanup);
                drawerTransitionCleanup = 0;
            }
        }

        function drawerResetInlineStyles() {
            if (!sidebarElement) return;
            sidebarElement.style.transform = '';
            sidebarElement.style.transition = '';
            sidebarElement.style.animation = '';
            if (mobileChatListBackdrop) {
                mobileChatListBackdrop.style.transition = '';
                mobileChatListBackdrop.style.opacity = '';
            }
        }

        function ensureDrawerSpacer() {
            if (drawerSpacer || !sidebarElement) return;
            drawerSpacer = document.createElement('div');
            drawerSpacer.style.height = sidebarElement.offsetHeight + 'px';
            drawerSpacer.style.flexShrink = '0';
            drawerSpacer.style.pointerEvents = 'none';
            sidebarElement.insertAdjacentElement('afterend', drawerSpacer);
        }

        function removeDrawerSpacer() {
            if (drawerSpacer) {
                drawerSpacer.remove();
                drawerSpacer = null;
            }
        }

        function showBackdrop(opacity) {
            if (!mobileChatListBackdrop) return;
            mobileChatListBackdrop.classList.add('is-visible');
            mobileChatListBackdrop.removeAttribute('hidden');
            if (opacity !== undefined) mobileChatListBackdrop.style.opacity = String(opacity);
        }

        function hideBackdrop() {
            if (!mobileChatListBackdrop) return;
            mobileChatListBackdrop.classList.remove('is-visible');
            mobileChatListBackdrop.setAttribute('hidden', 'hidden');
            mobileChatListBackdrop.style.opacity = '';
            mobileChatListBackdrop.style.transition = '';
        }

        function applyMobileDrawerState(open, animate = true, { fromHistory = false } = {}) {
            if (!sidebarElement) return;

            drawerCancelPendingCleanup();
            drawerDragState = null;
            drawerResetInlineStyles();

            if (!isMobileDrawerViewport()) {
                isMobileDrawerOpen = false;
                sidebarElement.classList.remove('mobile-chatlist-drawer-open', 'mobile-chatlist-drawer-closing');
                removeDrawerSpacer();
                hideBackdrop();
                setCompactChatListVisible(true);
                sidebarElement.style.display = '';
                window.__ttcRemoveUiBackLayer?.("mobile-drawer");
                return;
            }

            const shouldOpen = Boolean(open);

            // Back-layer history integration
            if (shouldOpen) {
                window.__ttcPushUiBackLayer?.("mobile-drawer", function () {
                    applyMobileDrawerState(false, true, { fromHistory: true });
                });
            } else if (!fromHistory) {
                // Closing from UI action (backdrop click, escape, etc.) — pop history entry
                const keys = window.__ttcUiBackLayerKeys;
                if (keys && window.__ttcRequestUiLayerClose?.("mobile-drawer", function () {
                    applyMobileDrawerState(false, true, { fromHistory: true });
                })) {
                    return; // history.back() will trigger the close via popstate
                }
            } else {
                // Closing from popstate — just remove the layer record
                window.__ttcRemoveUiBackLayer?.("mobile-drawer");
            }

            isMobileDrawerOpen = shouldOpen;
            sidebarElement.classList.remove('mobile-chatlist-drawer-closing');

            if (shouldOpen) {
                // Show navbar when drawer opens
                document.querySelector('nav.navbar')?.classList.remove('navbar-hidden');
                // Cache compact height before going fixed
                if (!mobileChatSelected && sidebarElement.offsetHeight > 0) {
                    drawerCompactHeight = sidebarElement.offsetHeight;
                }
                // Show sidebar for drawer regardless of chat selection state
                sidebarElement.style.display = '';
                ensureDrawerSpacer();
                sidebarElement.classList.add('mobile-chatlist-drawer-open');
                if (animate) {
                    sidebarElement.style.transform = 'translateY(-100%)';
                    void sidebarElement.offsetHeight;
                    sidebarElement.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    sidebarElement.style.transform = 'translateY(0)';
                }
                showBackdrop(animate ? 0 : 1);
                if (animate && mobileChatListBackdrop) {
                    mobileChatListBackdrop.style.transition = 'opacity 0.3s ease';
                    void mobileChatListBackdrop.offsetHeight;
                    mobileChatListBackdrop.style.opacity = '1';
                }
                drawerTransitionCleanup = setTimeout(() => {
                    drawerTransitionCleanup = 0;
                    drawerResetInlineStyles();
                }, 320);
            } else {
                const wasDrawerOpen = sidebarElement.classList.contains('mobile-chatlist-drawer-open');
                if (animate && wasDrawerOpen) {
                    sidebarElement.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 1, 1)';
                    sidebarElement.style.transform = 'translateY(-100%)';
                    if (mobileChatListBackdrop) {
                        mobileChatListBackdrop.style.transition = 'opacity 0.25s ease';
                        mobileChatListBackdrop.style.opacity = '0';
                    }
                    drawerTransitionCleanup = setTimeout(() => {
                        drawerTransitionCleanup = 0;
                        sidebarElement.classList.remove('mobile-chatlist-drawer-open', 'mobile-chatlist-drawer-closing');
                        drawerResetInlineStyles();
                        removeDrawerSpacer();
                        hideBackdrop();
                        updateMobileSidebarVisibility();
                    }, 270);
                } else {
                    sidebarElement.classList.remove('mobile-chatlist-drawer-open', 'mobile-chatlist-drawer-closing');
                    removeDrawerSpacer();
                    hideBackdrop();
                    updateMobileSidebarVisibility();
                }
            }

            mobileChatListPullHandle?.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            if (shouldOpen) {
                setCompactChatListVisible(true);
            }
        }

        window.setMobileChatListOpen = function (open) {
            applyMobileDrawerState(Boolean(open));
        };

        window.toggleMobileChatList = function () {
            if (!isMobileDrawerViewport()) return;
            // When chat selected, toggle always goes to expanded (full drawer) or closes
            applyMobileDrawerState(!isMobileDrawerOpen);
        };

        mobileChatListBackdrop?.addEventListener('click', function () {
            if (!isMobileDrawerViewport()) return;
            applyMobileDrawerState(false);
        });

        // --- Drag gesture ---
        // Handle in chat-header: finger drags down → drawer slides down from top.
        // Grab bar at bottom of expanded drawer: finger drags up → drawer collapses.

        function startDrawerDrag(startY) {
            drawerCancelPendingCleanup();
            const h = window.innerHeight;

            let anchor;
            if (isMobileDrawerOpen) {
                // When expanded, anchor = compact sidebar height for snap target
                // We need to measure BEFORE layout changes, but sidebar is fixed so
                // we use a cached or fallback value (compact height ≈ search + list row)
                anchor = drawerCompactHeight || 150;
            } else if (mobileChatSelected) {
                anchor = 0;
            } else {
                anchor = sidebarElement ? sidebarElement.offsetHeight : 150;
                drawerCompactHeight = anchor; // cache for pull-up from expanded
            }

            drawerDragState = {
                startY,
                currentY: startY,
                startTime: Date.now(),
                lastY: startY,
                lastTime: Date.now(),
                wasOpen: isMobileDrawerOpen,
                drawerHeight: h,
                anchor,
                moved: false,
                chatSelected: mobileChatSelected,
            };

            // Make sidebar visible for drag
            sidebarElement.style.display = '';

            if (!isMobileDrawerOpen) {
                if (!mobileChatSelected) ensureDrawerSpacer();
                sidebarElement.classList.add('mobile-chatlist-drawer-open');
                sidebarElement.style.animation = 'none';
                sidebarElement.style.transition = 'none';
                // Position drawer: bottom edge at anchor position
                sidebarElement.style.transform = `translateY(${anchor - h}px)`;
                setCompactChatListVisible(true);
                showBackdrop(Math.max(0, anchor / h));
            } else {
                sidebarElement.style.animation = 'none';
                sidebarElement.style.transition = 'none';
                sidebarElement.style.transform = 'translateY(0)';
            }
        }

        function moveDrawerDrag(clientY) {
            if (!drawerDragState) return;
            drawerDragState.currentY = clientY;
            const dy = clientY - drawerDragState.startY;

            if (Math.abs(dy) < 6 && !drawerDragState.moved) return;
            drawerDragState.moved = true;

            const now = Date.now();
            if (now - drawerDragState.lastTime > 50) {
                drawerDragState.lastY = clientY;
                drawerDragState.lastTime = now;
            }

            const h = drawerDragState.drawerHeight;
            const anchor = drawerDragState.anchor;

            let translateY;
            if (drawerDragState.wasOpen) {
                // Expanded → pull up; clamp at hidden (-h) when chat selected, compact when not
                const minTy = drawerDragState.chatSelected ? -h : (anchor - h);
                translateY = Math.min(0, Math.max(minTy, dy));
            } else {
                // Compact → pull down toward 0, pull up toward hide
                const base = anchor - h;
                const minTy = Math.max(-h, base - 60);
                translateY = Math.min(0, Math.max(minTy, base + dy));
            }

            sidebarElement.style.transform = `translateY(${translateY}px)`;

            if (mobileChatListBackdrop) {
                const openRatio = 1 - Math.abs(translateY) / h;
                mobileChatListBackdrop.style.opacity = String(Math.max(0, Math.min(1, openRatio)));
            }
        }

        function endDrawerDrag() {
            if (!drawerDragState) return;
            const ds = drawerDragState;
            drawerDragState = null;

            if (!ds.moved) {
                // Tap — revert to pre-drag state; let click handler fire
                if (!ds.wasOpen) {
                    sidebarElement.classList.remove('mobile-chatlist-drawer-open');
                    removeDrawerSpacer();
                    hideBackdrop();
                    updateMobileSidebarVisibility();
                }
                drawerResetInlineStyles();
                return;
            }

            drawerDragJustEnded = true;
            setTimeout(() => { drawerDragJustEnded = false; }, 80);

            const recentDy = ds.currentY - ds.lastY;
            const recentDt = Math.max(1, Date.now() - ds.lastTime);
            const velocity = recentDy / recentDt;

            const totalDy = ds.currentY - ds.startY;
            const VEL_THRESH = 0.3;
            const EXPAND_DIST = ds.drawerHeight * 0.2;
            const HIDE_DIST = 35;

            let target;
            if (ds.wasOpen) {
                // From expanded: pull up → hidden (when chat selected) or compact (when not)
                if (totalDy < -EXPAND_DIST || velocity < -VEL_THRESH) {
                    target = ds.chatSelected ? 'hidden' : 'compact';
                } else {
                    target = 'expanded';
                }
            } else {
                if (totalDy > EXPAND_DIST || velocity > VEL_THRESH) target = 'expanded';
                else if (totalDy < -HIDE_DIST || velocity < -VEL_THRESH) target = 'hidden';
                else target = ds.chatSelected ? 'hidden' : 'compact';
            }

            isMobileDrawerOpen = (target === 'expanded');
            mobileChatListPullHandle?.setAttribute('aria-expanded', isMobileDrawerOpen ? 'true' : 'false');

            // Sync back-layer for drag gesture results
            if (isMobileDrawerOpen) {
                window.__ttcPushUiBackLayer?.("mobile-drawer", function () {
                    applyMobileDrawerState(false, true, { fromHistory: true });
                });
            } else if (window.__ttcRemoveUiBackLayer?.("mobile-drawer")) {
                // Layer was present — pop the matching history.pushState entry so the
                // user's next Back press isn't silently consumed by a phantom entry.
                // The popstate handler will find an empty/mismatched stack and return.
                try { window.history.back(); } catch (_) {}
            }

            const spring = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
            sidebarElement.style.transition = spring;

            if (target === 'expanded') {
                sidebarElement.style.transform = 'translateY(0)';
                if (mobileChatListBackdrop) {
                    mobileChatListBackdrop.style.transition = 'opacity 0.3s ease';
                    mobileChatListBackdrop.style.opacity = '1';
                }
                drawerTransitionCleanup = setTimeout(() => {
                    drawerTransitionCleanup = 0;
                    drawerResetInlineStyles();
                }, 320);

            } else if (target === 'compact') {
                const compactTy = ds.anchor - ds.drawerHeight;
                sidebarElement.style.transform = `translateY(${compactTy}px)`;
                if (mobileChatListBackdrop) {
                    mobileChatListBackdrop.style.transition = 'opacity 0.3s ease';
                    mobileChatListBackdrop.style.opacity = '0';
                }
                drawerTransitionCleanup = setTimeout(() => {
                    drawerTransitionCleanup = 0;
                    sidebarElement.classList.remove('mobile-chatlist-drawer-open', 'mobile-chatlist-drawer-closing');
                    drawerResetInlineStyles();
                    removeDrawerSpacer();
                    setCompactChatListVisible(true);
                    hideBackdrop();
                }, 320);

            } else {
                sidebarElement.style.transform = `translateY(-${ds.drawerHeight + 20}px)`;
                if (mobileChatListBackdrop) {
                    mobileChatListBackdrop.style.transition = 'opacity 0.3s ease';
                    mobileChatListBackdrop.style.opacity = '0';
                }
                drawerTransitionCleanup = setTimeout(() => {
                    drawerTransitionCleanup = 0;
                    sidebarElement.classList.remove('mobile-chatlist-drawer-open', 'mobile-chatlist-drawer-closing');
                    drawerResetInlineStyles();
                    removeDrawerSpacer();
                    setCompactChatListVisible(false);
                    hideBackdrop();
                    updateMobileSidebarVisibility();
                }, 320);
            }
        }

        // --- Touch listeners ---
        mobileChatListPullHandle?.addEventListener('touchstart', function (e) {
            if (!isMobileDrawerViewport()) return;
            startDrawerDrag(e.touches[0].clientY);
        }, { passive: true });

        // Bottom grab bar in expanded drawer — touch + mouse
        drawerBottomGrabBar?.addEventListener('touchstart', function (e) {
            if (!isMobileDrawerViewport() || !isMobileDrawerOpen) return;
            e.preventDefault();
            startDrawerDrag(e.touches[0].clientY);
        }, { passive: false });

        drawerBottomGrabBar?.addEventListener('mousedown', function (e) {
            if (!isMobileDrawerViewport() || !isMobileDrawerOpen) return;
            e.preventDefault();
            startDrawerDrag(e.clientY);
        });

        document.addEventListener('touchmove', function (e) {
            if (!drawerDragState) return;
            if (e.cancelable) e.preventDefault();
            moveDrawerDrag(e.touches[0].clientY);
        }, { passive: false });

        document.addEventListener('touchend', function () {
            if (!drawerDragState) return;
            endDrawerDrag();
        }, { passive: true });

        document.addEventListener('touchcancel', function () {
            if (!drawerDragState) return;
            endDrawerDrag();
        }, { passive: true });

        // --- Mouse listeners ---
        mobileChatListPullHandle?.addEventListener('mousedown', function (e) {
            if (!isMobileDrawerViewport()) return;
            e.preventDefault();
            startDrawerDrag(e.clientY);
        });

        document.addEventListener('mousemove', function (e) {
            if (!drawerDragState) return;
            e.preventDefault();
            moveDrawerDrag(e.clientY);
        });

        document.addEventListener('mouseup', function () {
            if (!drawerDragState) return;
            endDrawerDrag();
        });

        // Click — only fires when no drag occurred
        mobileChatListPullHandle?.addEventListener('click', function () {
            if (!isMobileDrawerViewport() || drawerDragJustEnded) return;
            window.toggleMobileChatList();
        });

        searchUserElement?.addEventListener('focus', function () {
            if (isMobileDrawerViewport() && !mobileChatSelected) {
                setCompactChatListVisible(true);
            }
        });

        searchUserElement?.addEventListener('blur', function () {
            if (!isMobileDrawerViewport()) {
                return;
            }
            setTimeout(function () {
                if (isMobileDrawerOpen) {
                    return;
                }
                const activeInsideSidebar = Boolean(sidebarElement?.contains(document.activeElement));
                const suggestionsOpen = Boolean(
                    searchSuggestionsElement &&
                    searchSuggestionsElement.style.display !== 'none' &&
                    searchSuggestionsElement.childElementCount > 0
                );
                if (!activeInsideSidebar && !suggestionsOpen) {
                    setCompactChatListVisible(false);
                }
            }, 120);
        });

        chatListWrapperElement?.addEventListener('focusout', function () {
            if (!isMobileDrawerViewport()) {
                return;
            }
            setTimeout(function () {
                if (isMobileDrawerOpen) {
                    return;
                }
                const activeInsideSidebar = Boolean(sidebarElement?.contains(document.activeElement));
                const suggestionsOpen = Boolean(
                    searchSuggestionsElement &&
                    searchSuggestionsElement.style.display !== 'none' &&
                    searchSuggestionsElement.childElementCount > 0
                );
                if (!activeInsideSidebar && !suggestionsOpen && document.activeElement !== searchUserElement) {
                    setCompactChatListVisible(false);
                }
            }, 120);
        });

        window.addEventListener('resize', function () {
            if (isMobileDrawerViewport()) {
                updateMobileSidebarVisibility();
                if (!mobileChatSelected) {
                    const shouldShowCompact =
                        isMobileDrawerOpen ||
                        document.activeElement === searchUserElement ||
                        Boolean(searchUserElement?.value?.trim().length);
                    setCompactChatListVisible(shouldShowCompact);
                }
                return;
            }
            applyMobileDrawerState(false);
            sidebarElement.style.display = '';
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && isMobileDrawerOpen) {
                applyMobileDrawerState(false);
            }
        });

        if (isMobileDrawerViewport()) {
            setCompactChatListVisible(false);
        } else {
            setCompactChatListVisible(true);
        }

        // --- Auto-hide navbar on mobile scroll ---
        (function initNavbarAutoHide() {
            const navbarEl = document.querySelector('nav.navbar');
            const chatMessagesEl = document.getElementById('chatMessages');
            if (!navbarEl || !chatMessagesEl) return;

            let lastScrollTop = 0;
            const SCROLL_THRESHOLD = 12; // minimum px delta to trigger hide/show
            const TOGGLE_COOLDOWN_MS = 180;
            const TOUCH_GRACE_MS = 140;
            let navbarIsHidden = false;
            let lastToggleAt = 0;
            let isTouchScrollActive = false;
            let touchGraceTimer = 0;

            function setNavbarHidden(hidden) {
                const shouldHide = Boolean(hidden);
                if (navbarIsHidden === shouldHide) {
                    return;
                }
                navbarIsHidden = shouldHide;
                navbarEl.classList.toggle('navbar-hidden', shouldHide);
            }

            function keepTouchScrollActive() {
                isTouchScrollActive = true;
                if (touchGraceTimer) {
                    clearTimeout(touchGraceTimer);
                }
                touchGraceTimer = setTimeout(function () {
                    isTouchScrollActive = false;
                    touchGraceTimer = 0;
                }, TOUCH_GRACE_MS);
            }

            chatMessagesEl.addEventListener('touchstart', keepTouchScrollActive, { passive: true });
            chatMessagesEl.addEventListener('touchmove', keepTouchScrollActive, { passive: true });
            chatMessagesEl.addEventListener('touchend', keepTouchScrollActive, { passive: true });
            chatMessagesEl.addEventListener('touchcancel', function () {
                isTouchScrollActive = false;
                if (touchGraceTimer) {
                    clearTimeout(touchGraceTimer);
                    touchGraceTimer = 0;
                }
            }, { passive: true });

            chatMessagesEl.addEventListener('scroll', function () {
                if (!isMobileDrawerViewport() || !mobileChatSelected) {
                    // Ensure navbar is visible on desktop or when no chat selected
                    setNavbarHidden(false);
                    return;
                }

                const st = chatMessagesEl.scrollTop;
                if (!isTouchScrollActive) {
                    lastScrollTop = Math.max(0, st);
                    return;
                }

                const delta = st - lastScrollTop;
                const now = Date.now();
                if (Math.abs(delta) <= SCROLL_THRESHOLD || (now - lastToggleAt) < TOGGLE_COOLDOWN_MS) {
                    lastScrollTop = Math.max(0, st);
                    return;
                }

                if (delta < -SCROLL_THRESHOLD) {
                    // Scrolling up (toward older messages) → hide navbar for more space
                    setNavbarHidden(true);
                    lastToggleAt = now;
                } else if (delta > SCROLL_THRESHOLD) {
                    // Scrolling down (toward newer messages) → show navbar
                    setNavbarHidden(false);
                    lastToggleAt = now;
                }
                lastScrollTop = Math.max(0, st);
            }, { passive: true });

            // Always show navbar when drawer opens or chat deselected;
            // also toggle announcement button visibility
            const alertPanelBtn = document.getElementById('alertPanelBtn');
            const origSetMobileChatSelected = window.setMobileChatSelected;
            window.setMobileChatSelected = function (selected) {
                origSetMobileChatSelected(selected);
                if (!selected) {
                    setNavbarHidden(false);
                }
                if (alertPanelBtn && isMobileDrawerViewport()) {
                    alertPanelBtn.style.display = selected ? 'none' : '';
                }
            };

            // Show navbar & restore announcement btn when window resizes to desktop
            window.addEventListener('resize', function () {
                if (!isMobileDrawerViewport()) {
                    setNavbarHidden(false);
                    if (alertPanelBtn) alertPanelBtn.style.display = '';
                } else if (alertPanelBtn && mobileChatSelected) {
                    alertPanelBtn.style.display = 'none';
                }
            });
        })();

        // --- Logout confirmation ---
        (function initLogoutConfirm() {
            const logoutBtn = document.getElementById('logoutBtn');
            const logoutForm = document.getElementById('logoutForm');
            if (!logoutBtn || !logoutForm) return;

            logoutBtn.addEventListener('click', function () {
                showModal('Logout', 'Are you sure you want to log out?', 'warning');
                // Replace the OK button in the footer with a red Logout button
                const footer = document.querySelector('#modalOverlay .modal-footer');
                if (footer) {
                    footer.innerHTML = '<button type="button" class="btn btn-logout" id="logoutConfirmBtn"><i class="fas fa-sign-out-alt me-1"></i>Logout</button>';
                    document.getElementById('logoutConfirmBtn').addEventListener('click', function () {
                        closeModal();
                        logoutForm.submit();
                    });
                }
            });
        })();

    </script>

    <script src="assets/js/ui-enhancements.js"></script>
    <script src="assets/js/pwa.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/pwa.js')); ?>"></script>
    <script src="assets/js/api-service.js"></script>
    <script src="assets/js/chat-utils.js"></script>
    <script src="assets/js/chat-notifications.js"></script>
    <script src="assets/js/crypto.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/crypto.js')); ?>"></script>
    <script src="assets/js/chat-sticker-utils.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat-sticker-utils.js')); ?>"></script>
    <script src="assets/js/chat-media-cache.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat-media-cache.js')); ?>"></script>
    <script src="assets/js/chat.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat.js')); ?>"></script>
    <script src="assets/js/chat-bg-upload.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat-bg-upload.js')); ?>"></script>
    <script src="assets/js/chat-announcements.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat-announcements.js')); ?>"></script>
    <script src="assets/js/chat-opinions.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat-opinions.js')); ?>"></script>
    <script src="assets/js/chat-conversation-search.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat-conversation-search.js')); ?>"></script>
    <script src="assets/js/chat-image-modal.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat-image-modal.js')); ?>"></script>
    <script src="assets/js/chat-audio-players.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat-audio-players.js')); ?>"></script>
    <script src="assets/js/chat-admin.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat-admin.js')); ?>"></script>
    <script src="assets/js/ideas.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/ideas.js')); ?>"></script>
    <script src="assets/js/guide.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/guide.js')); ?>"></script>
    <script src="assets/js/changelog.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/changelog.js')); ?>"></script>
</body>

</html>