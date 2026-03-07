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
                    <input type="text" id="searchUser" class="form-control mb-1" placeholder="Enter username to chat" />
                    <div id="searchUserFeedback" class="invalid-feedback" style="display: none; font-size: 0.875em;">
                        Invalid username format
                    </div>
                    <div id="searchLoading" class="search-loading" style="display: none;">
                        <div class="spinner"></div>
                    </div>
                    <div id="searchSuggestions" class="search-suggestions" style="display: none;"></div>
                </div>
                <div id='chatListWrapper' class="chat-list-wrapper">
                    <ul class="chat-list" id="chatList"></ul>
                </div>
            </aside>

            <section class="chat-area d-flex flex-column">
                <div class="chat-header">
                    <h5 id="chatWith">Select a chat</h5>
                </div>
                <div class="chat-messages" id="chatMessages"></div>
                <div class="chat-input p-3">
                    <form id="chatForm" class="d-flex w-100 align-items-center">
                        <textarea id="chatInput" class="form-control" placeholder="Type a message..." rows="1"></textarea>
                        
                        <input type="file" id="imageUploadInput" accept="image/*" style="display: none;">
                        <input type="file" id="fileUploadInput" style="display: none;">

                        <button type="button" id="imageUploadBtn" class="btn btn-secondary ms-2" title="Send an image">
                            <i class="fas fa-image"></i>
                        </button>

                        <button type="button" id="voiceBtn" class="btn btn-secondary ms-2" title="Record voice message">
                            <i class="fas fa-microphone"></i>
                        </button>

                        <button type="submit" id="sendBtn" class="btn btn-primary ms-2" title="Send message (long press for file upload)">
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

        const textMessageInput = document.getElementById('chatInput');
        const imageMessageButton = document.getElementById('imageUploadBtn');
        const voiceMessageButton = document.getElementById('voiceBtn');

        textMessageInput.addEventListener('focus', function() {
            if(isMobileDevice()) {
                imageMessageButton.style.display = 'none';
                voiceMessageButton.style.display = 'none';
            }
        });
        textMessageInput.addEventListener('blur', function() {
            if(isMobileDevice()) {
                imageMessageButton.style.display = 'block';
                voiceMessageButton.style.display = 'block';
            }
        });
    </script>

    <script src="assets/js/ui-enhancements.js"></script>
    <script src="assets/js/crypto.js"></script>
    <script src="assets/js/chat.js"></script>
</body>

</html>