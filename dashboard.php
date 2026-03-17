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
$is_superuser = false;

try {
    $adminStmt = $pdo->prepare('SELECT is_admin FROM users WHERE id = ? LIMIT 1');
    $adminStmt->execute([$user_id]);
    $is_admin = (bool) $adminStmt->fetchColumn();
} catch (Throwable $ex) {
    $is_admin = false;
}

if ($is_admin && $superuser_username !== '') {
    $is_superuser = strcasecmp((string) $username, $superuser_username) === 0;
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
    <link href="assets/css/ext/bootstrap.min.css" rel="stylesheet" />
    <link href="assets/css/ext/fontawesome.min.css" rel="stylesheet" />
    <link href="assets/css/dashboard.css" rel="stylesheet" />
    <link href="assets/css/style.css" rel="stylesheet" />
    
</head>

<body>
    <div id="app">
        <nav class="navbar navbar-expand-lg px-3">
            <a class="navbar-brand" href="#">TinTinChat</a>
            <div class="ms-auto d-flex align-items-center">
                <span class="me-3 logged-in-as">Logged in as <strong id="loggedInUsername"><?= htmlspecialchars($username) ?></strong></span>
                <form method="post" action="api/auth/logout.php" class="m-0">
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>" />
                    <button type="submit" class="btn btn-logout btn-sm">
                        <i class="fas fa-sign-out-alt me-1"></i>Logout
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
                        <button type="button" id="createGroupBtn" class="btn btn-primary create-group-fab" aria-label="Create group" title="Create group">
                            <i class="fas fa-users"></i>
                        </button>
                    </div>
                </div>
                <button type="button" id="mobileChatListPullHandle" class="mobile-chatlist-pull-handle" aria-label="Expand chats" aria-expanded="false">
                    <i class="fas fa-angle-down mobile-chatlist-pull-icon" aria-hidden="true"></i>
                </button>
                <div id="mobileChatListBackdrop" class="mobile-chatlist-backdrop" hidden></div>
            </aside>

            <section class="chat-area d-flex flex-column">
                <div class="chat-header">
                    <div class="chat-title-stack">
                        <h5 id="chatWith">Select a chat</h5>
                        <div id="typingIndicator" class="typing-indicator" aria-live="polite" aria-atomic="true" hidden></div>
                    </div>
                    <div class="chat-header-actions ms-auto">
                        <button type="button" id="userInfoBtn" class="btn btn-sm btn-outline-secondary" aria-label="User info" title="User info" hidden>
                            <i class="fas fa-user"></i>
                        </button>
                        <button type="button" id="groupInfoBtn" class="btn btn-sm btn-outline-secondary" aria-label="Group details" title="Group details" hidden>
                            <i class="fas fa-users"></i>
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
                            <button type="button" id="openConversationSearchBtn" class="chat-setting-item chat-setting-button" aria-label="Search inside current conversation">
                                <i class="fas fa-search"></i>
                                <span>Search in this chat</span>
                            </button>
                            <button type="button" id="openAvatarUploadBtn" class="chat-setting-item chat-setting-button" aria-label="Update profile avatar">
                                <i class="fas fa-user-circle"></i>
                                <span>Update profile avatar</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div id="conversationSearchBar" class="conversation-search-bar" hidden>
                    <i class="fas fa-search" aria-hidden="true"></i>
                    <input type="text" id="conversationSearchInput" class="form-control" placeholder="Search this conversation" aria-label="Search inside current conversation">
                    <span id="conversationSearchCount" class="conversation-search-count" aria-live="polite">0 / 0</span>
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
                <div id="messageActionsHint" class="message-actions-hint is-hidden" aria-live="polite" hidden>
                    Tip: Right-click/double-click (desktop) or long-press/double-tap (mobile) any message to open actions.
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
                        
                        <input type="file" id="imageUploadInput" accept="image/*" style="display: none;">
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
                        <?php if ($is_admin): ?>
                        <button type="button" id="chatUiSettingsTabAdmin" class="chat-ui-settings-tab" role="tab" aria-selected="false" aria-controls="chatUiSettingsPanelAdmin">Admin</button>
                        <?php endif; ?>
                    </div>

                    <section id="chatUiSettingsPanelGeneral" class="chat-ui-settings-panel" role="tabpanel" aria-labelledby="chatUiSettingsTabGeneral">
                        <div class="chat-ui-settings-list">
                            <label class="chat-ui-settings-item" for="settingThemeMode">
                                <span>Theme mode</span>
                                <select id="settingThemeMode" class="form-select form-select-sm" aria-label="Theme mode">
                                    <option value="system">System</option>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </label>

                            <label class="chat-ui-settings-item" for="settingDensityMode">
                                <span>Message density</span>
                                <select id="settingDensityMode" class="form-select form-select-sm" aria-label="Message density">
                                    <option value="comfortable">Comfortable</option>
                                    <option value="compact">Compact</option>
                                </select>
                            </label>

                            <label class="chat-ui-settings-item" for="settingFontScale">
                                <span>Font size</span>
                                <select id="settingFontScale" class="form-select form-select-sm" aria-label="Font size">
                                    <option value="sm">Small</option>
                                    <option value="md">Default</option>
                                    <option value="lg">Large</option>
                                    <option value="xl">Extra large</option>
                                </select>
                            </label>

                            <label class="chat-ui-settings-item">
                                <input type="checkbox" id="settingShowTimestamps" checked>
                                <span>Show message timestamps</span>
                            </label>

                            <label class="chat-ui-settings-item">
                                <input type="checkbox" id="settingReduceMotion">
                                <span>Reduce motion</span>
                            </label>

                            <label class="chat-ui-settings-item">
                                <input type="checkbox" id="settingNotificationSound" checked>
                                <span>Notification sound</span>
                            </label>

                            <label class="chat-ui-settings-item">
                                <input type="checkbox" id="settingAutoScroll" checked>
                                <span>Auto-scroll to latest</span>
                            </label>
                        </div>
                    </section>

                    <section id="chatUiSettingsPanelAccount" class="chat-ui-settings-panel" role="tabpanel" aria-labelledby="chatUiSettingsTabAccount" hidden>
                        <div class="chat-ui-account-section">
                            <div class="chat-ui-account-row">
                                <div>
                                    <div class="chat-ui-account-title">Profile avatar</div>
                                    <div class="chat-ui-account-subtitle">Upload a new profile image.</div>
                                </div>
                                <button type="button" id="settingsAvatarUploadBtn" class="btn btn-sm btn-outline-secondary">Change avatar</button>
                            </div>
                        </div>

                        <form id="settingsUsernameForm" class="chat-ui-account-section">
                            <div class="chat-ui-account-title">Username</div>
                            <div class="chat-ui-account-subtitle">Current: <strong id="settingsCurrentUsername"><?= htmlspecialchars($username) ?></strong></div>
                            <label class="chat-ui-settings-field" for="settingsUsernameInput">
                                <span>New username</span>
                                <input type="text" id="settingsUsernameInput" class="form-control form-control-sm" minlength="3" maxlength="50" value="<?= htmlspecialchars($username) ?>" autocomplete="username" required>
                            </label>
                            <button type="submit" class="btn btn-sm btn-primary">Save username</button>
                        </form>

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
                            <button type="submit" class="btn btn-sm btn-primary">Change password</button>
                        </form>
                    </section>

                    <?php if ($is_admin): ?>
                    <section id="chatUiSettingsPanelAdmin" class="chat-ui-settings-panel" role="tabpanel" aria-labelledby="chatUiSettingsTabAdmin" hidden>
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

                        <?php if ($is_superuser): ?>
                        <div class="chat-ui-admin-section">
                            <div class="chat-ui-admin-row">
                                <div>
                                    <div class="chat-ui-account-title">Admin users</div>
                                    <div class="chat-ui-account-subtitle">Promote or demote admin users.</div>
                                </div>
                                <button type="button" id="settingsAdminRefreshUsersBtn" class="btn btn-sm btn-outline-secondary">Refresh</button>
                            </div>
                            <div id="settingsAdminUsersList" class="chat-ui-admin-list" aria-live="polite">
                                <div class="chat-ui-admin-empty">Loading users...</div>
                            </div>
                        </div>
                        <?php else: ?>
                        <div class="chat-ui-admin-section">
                            <div class="chat-ui-admin-empty">Only the configured superuser can manage admin roles.</div>
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
    <script src="assets/js/ext/bootstrap.bundle.min.js"></script>
    <script>
        const CURRENT_USER = <?= json_encode($username) ?>;
        const CURRENT_USER_ID = <?= json_encode($user_id) ?>;
        const CSRF_TOKEN = <?= json_encode($csrfToken) ?>;
        const APP_CONSTANTS = <?= json_encode(tintinchatFrontendConstants()) ?>;
        const CURRENT_USER_IS_ADMIN = <?= json_encode($is_admin) ?>;
        const CURRENT_USER_IS_SUPERUSER = <?= json_encode($is_superuser) ?>;
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
        const sidebarElement = document.querySelector('.sidebar');
        const MOBILE_DRAWER_BREAKPOINT = 767.98;
        let isMobileDrawerOpen = false;

        function isMobileDrawerViewport() {
            return window.innerWidth <= MOBILE_DRAWER_BREAKPOINT;
        }

        function setCompactChatListVisible(visible) {
            if (!chatListWrapperElement) {
                return;
            }

            if (!isMobileDrawerViewport()) {
                chatListWrapperElement.style.display = 'block';
                if (mobileChatListPullHandle) {
                    mobileChatListPullHandle.style.display = 'none';
                }
                return;
            }

            const shouldShow = Boolean(visible);
            chatListWrapperElement.style.display = shouldShow ? 'block' : 'none';
            if (mobileChatListPullHandle) {
                mobileChatListPullHandle.style.display = shouldShow ? 'flex' : 'none';
            }
        }

        function applyMobileDrawerState(open) {
            if (!sidebarElement) {
                return;
            }

            if (!isMobileDrawerViewport()) {
                isMobileDrawerOpen = false;
                sidebarElement.classList.remove('mobile-chatlist-drawer-open');
                mobileChatListBackdrop?.setAttribute('hidden', 'hidden');
                setCompactChatListVisible(true);
                return;
            }

            const shouldOpen = Boolean(open);
            isMobileDrawerOpen = shouldOpen;
            sidebarElement.classList.toggle('mobile-chatlist-drawer-open', shouldOpen);
            mobileChatListPullHandle?.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
            setCompactChatListVisible(
                shouldOpen || document.activeElement === searchUserElement
            );
            if (mobileChatListBackdrop) {
                if (shouldOpen) {
                    mobileChatListBackdrop.removeAttribute('hidden');
                } else {
                    mobileChatListBackdrop.setAttribute('hidden', 'hidden');
                }
            }
        }

        window.setMobileChatListOpen = function (open) {
            applyMobileDrawerState(Boolean(open));
        };

        window.toggleMobileChatList = function () {
            if (!isMobileDrawerViewport()) {
                return;
            }
            applyMobileDrawerState(!isMobileDrawerOpen);
        };

        mobileChatListBackdrop?.addEventListener('click', function () {
            if (!isMobileDrawerViewport()) {
                return;
            }
            applyMobileDrawerState(false);
        });

        mobileChatListPullHandle?.addEventListener('click', function () {
            if (!isMobileDrawerViewport()) {
                return;
            }
            window.toggleMobileChatList();
        });

        searchUserElement?.addEventListener('focus', function () {
            if (isMobileDrawerViewport()) {
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
                const shouldShowCompact =
                    isMobileDrawerOpen ||
                    document.activeElement === searchUserElement ||
                    Boolean(searchUserElement?.value?.trim().length);
                setCompactChatListVisible(shouldShowCompact);
                return;
            }
            applyMobileDrawerState(false);
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

    </script>

    <script src="assets/js/ui-enhancements.js"></script>
    <script src="assets/js/pwa.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/pwa.js')); ?>"></script>
    <script src="assets/js/api-service.js"></script>
    <script src="assets/js/chat-utils.js"></script>
    <script src="assets/js/chat-notifications.js"></script>
    <script src="assets/js/crypto.js"></script>
    <script src="assets/js/chat.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/chat.js')); ?>"></script>
</body>

</html>