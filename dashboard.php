<?php
require_once __DIR__ . '/includes/session.php';
configSession();

if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}
$username = $_SESSION['username'];
$user_id = $_SESSION['user_id'];
$user_ident = isset($_SESSION['ident']) ? $_SESSION['ident'] : null;
$csrfToken = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TinTinChat Dashboard</title>
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
                <span class="me-3 logged-in-as">Logged in as <strong><?= htmlspecialchars($username) ?></strong></span>
                <a href="api/logout.php" class="btn btn-logout btn-sm">
                    <i class="fas fa-sign-out-alt me-1"></i>Logout
                </a>
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
                </div>
            </aside>

            <section class="chat-area d-flex flex-column">
                <div class="chat-header">
                    <h5 id="chatWith">Select a chat</h5>
                    <div class="chat-header-actions ms-auto">
                        <button type="button" id="chatSettingsBtn" class="btn btn-sm btn-outline-secondary" aria-label="Chat settings" aria-haspopup="true" aria-expanded="false" title="Chat settings">
                            <i class="fas fa-sliders-h"></i>
                        </button>
                        <div id="chatSettingsPanel" class="chat-settings-panel" hidden>
                            <label class="chat-setting-item">
                                <input type="checkbox" id="settingNotificationSound" checked>
                                <span>Notification sound</span>
                            </label>
                            <label class="chat-setting-item">
                                <input type="checkbox" id="settingAutoScroll" checked>
                                <span>Auto-scroll to latest</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div id="messageActionsHint" class="message-actions-hint" aria-live="polite">
                    Tip: Right-click (desktop) or long-press (mobile) any message to open actions.
                </div>
                <div class="chat-messages" id="chatMessages" role="log" aria-live="polite" aria-relevant="additions"></div>
                <div class="chat-input p-3">
                    <div id="replyPreview" class="reply-preview" style="display: none;"></div>
                    <div id="composerStatus" class="composer-status" aria-live="polite"></div>
                    <form id="chatForm" class="d-flex w-100 align-items-center">
                        <textarea id="chatInput" class="form-control" placeholder="Type a message..." rows="1" aria-label="Message input"></textarea>
                        
                        <input type="file" id="imageUploadInput" accept="image/*" style="display: none;">
                        <input type="file" id="fileUploadInput" style="display: none;">

                        <button type="button" id="composerToolsToggle" class="btn btn-secondary ms-2" title="Show or hide media actions" aria-label="Toggle media actions">
                            <i class="fas fa-plus"></i>
                        </button>

                        <button type="button" id="imageUploadBtn" class="btn btn-secondary ms-2" title="Send an image" aria-label="Send image">
                            <i class="fas fa-image"></i>
                        </button>

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

    <?php require_once __DIR__ . '/includes/modal.php' ?>
    <script src="assets/js/ext/bootstrap.bundle.min.js"></script>
    <script src="assets/js/ext/jquery-3.6.1.min.js"></script>
    <script>
        const CURRENT_USER = <?= json_encode($username) ?>;
        const CURRENT_USER_ID = <?= json_encode($user_id) ?>;
        const CSRF_TOKEN = <?= json_encode($csrfToken) ?>;
        const currentUserIdent = <?= json_encode($user_ident) ?>;
        if(currentUserIdent?.length) {
            localStorage.setItem('ident', currentUserIdent);
        }
        const searchUserElement = document.getElementById('searchUser');

        let isMobileDevice = () => $(window).width() < 850
        const chatListWrapperElement = document.getElementById('chatListWrapper');

        searchUserElement.addEventListener('focus', function() {
            if(chatListWrapperElement.style.display !== 'block') {
                chatListWrapperElement.style.display = 'block';
            }
        });
        searchUserElement.addEventListener('blur', function() {
            if(isMobileDevice()) {
                setTimeout(() => {
                    chatListWrapperElement.style.display = 'none';
                }, 100); // Allowing the click event to happen if user selects a chat
            }
        });

    </script>

    <script src="assets/js/ui-enhancements.js"></script>
    <script src="assets/js/crypto.js"></script>
    <script src="assets/js/chat.js"></script>
</body>

</html>