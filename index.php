<?php
require_once __DIR__ . '/includes/session.php';
configSession();

if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}
$error = $_SESSION['login_error'] ?? '';
unset($_SESSION['login_error']);
$csrfToken = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#6a11cb" />
    <title>TinTinChat Login</title>
    <link rel="manifest" href="manifest.webmanifest" />
    <link rel="icon" href="assets/pwa/icon-192.svg" type="image/svg+xml" />
    <link href="assets/css/ext/bootstrap.min.css" rel="stylesheet" />
    <link href="assets/css/ext/fontawesome.min.css" rel="stylesheet" />
    <link href="assets/css/auth.css" rel="stylesheet" />
    <link href="assets/css/style.css" rel="stylesheet" />
</head>

<body>
    <div class="login-container">
        <div class="login-header">
            <div class="login-logo">
                <i class="fas fa-comments"></i>
            </div>
            <h1 class="login-title">TinTinChat</h1>
            <p class="login-subtitle">Secure messaging, beautifully simple</p>
        </div>

        <?php if ($error): ?>
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="post" action="api/auth/login.php" novalidate id="loginForm">
            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>" />
            <div class="form-group">
                <label for="username" class="form-label">Username</label>
                <input id="username" name="username" class="form-control" required placeholder="Enter your username" />
                <i class="fas fa-user input-icon"></i>
                <div id="usernameError" class="invalid-feedback">
                    Must start with a letter and contain only letters, numbers, hyphens, and underscores
                </div>
            </div>

            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input id="password" name="password" type="password" class="form-control" required placeholder="Enter your password" />
                <i class="fas fa-lock input-icon"></i>
                <div id="passwordRequirements" class="password-strength" style="display: none;">
                    <div class="requirement" id="req-length">
                        <span class="req-icon">○</span> At least 8 characters
                    </div>
                    <div class="requirement" id="req-letter">
                        <span class="req-icon">○</span> At least one letter
                    </div>
                    <div class="requirement" id="req-digit">
                        <span class="req-icon">○</span> At least one digit
                    </div>
                    <div class="requirement" id="req-special">
                        <span class="req-icon">○</span> At least one special character
                    </div>
                </div>
                <div id="passwordError" class="invalid-feedback">
                    Password does not meet requirements
                </div>
            </div>

            <button type="submit" class="btn-login" id="loginBtn">
                <i class="fas fa-sign-in-alt me-2"></i>
                Sign In
            </button>
        </form>
    </div>

    <script>
        const PWA_SW_VERSION = <?= json_encode((string) @filemtime(__DIR__ . '/service-worker.js')) ?>;
    </script>
    <script src="assets/js/ext/bootstrap.bundle.min.js"></script>
    <script src="assets/js/pwa.js?v=<?php echo urlencode((string) @filemtime(__DIR__ . '/assets/js/pwa.js')); ?>"></script>
    <script src="assets/js/ui-enhancements.js"></script>
    <script>
        const RESERVED_USERNAMES = <?php require_once __DIR__ . '/includes/constants.php'; echo json_encode(array_map('strtolower', array_map(function($n) { return str_replace(['-', '_', ' '], '', strtolower($n)); }, TTC_USERNAME_BLACKLIST))); ?>;
        function isValidUsername(username) {
            if (!/^[a-zA-Z][a-zA-Z0-9_-]{2,}$/.test(username)) return false;
            const clean = username.toLowerCase().replace(/[-_]/g, '');
            return !RESERVED_USERNAMES.includes(clean);
        }

        function isValidPassword(password) {
            return password.length >= 8 && 
                   /[0-9]/.test(password) && 
                   /[a-zA-Z]/.test(password) && 
                   /[^a-zA-Z0-9]/.test(password);
        }

        function checkPasswordStrength(password) {
            const requirements = {
                length: password.length >= 8,
                letter: /[a-zA-Z]/.test(password),
                digit: /[0-9]/.test(password),
                special: /[^a-zA-Z0-9]/.test(password)
            };

            Object.keys(requirements).forEach(req => {
                const element = document.getElementById(`req-${req}`);
                if (element) {
                    element.className = `requirement ${requirements[req] ? 'met' : 'unmet'}`;
                    const icon = element.querySelector('.req-icon');
                    if (icon) {
                        icon.textContent = requirements[req] ? '✓' : '○';
                    }
                }
            });

            return requirements;
        }

        const usernameInput = document.getElementById('username');
        const usernameError = document.getElementById('usernameError');
        const passwordInput = document.getElementById('password');
        const passwordError = document.getElementById('passwordError');
        const passwordRequirements = document.getElementById('passwordRequirements');
        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');

        usernameInput.addEventListener('input', function() {
            const username = this.value.trim();
            if (username && !isValidUsername(username)) {
                this.classList.add('is-invalid');
                usernameError.style.display = 'block';
            } else {
                this.classList.remove('is-invalid');
                usernameError.style.display = 'none';
            }
        });

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            
            if (password.length > 0) {
                passwordRequirements.style.display = 'block';
                const requirements = checkPasswordStrength(password);
                
                if (isValidPassword(password)) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                    passwordError.style.display = 'none';
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                    passwordError.style.display = 'block';
                }
            } else {
                passwordRequirements.style.display = 'none';
                this.classList.remove('is-valid', 'is-invalid');
                passwordError.style.display = 'none';
            }
        });

        loginForm.addEventListener('submit', function(e) {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            
            let hasError = false;
            
            if (!isValidUsername(username)) {
                usernameInput.classList.add('is-invalid');
                usernameError.style.display = 'block';
                hasError = true;
            }
            
            if (!isValidPassword(password)) {
                passwordInput.classList.add('is-invalid');
                passwordError.style.display = 'block';
                passwordRequirements.style.display = 'block';
                hasError = true;
            }
            
            if (hasError) {
                e.preventDefault();
                if (!isValidUsername(username)) {
                    usernameInput.focus();
                } else if (!isValidPassword(password)) {
                    passwordInput.focus();
                }
            } else {
                loginBtn.classList.add('btn-loading');
                loginBtn.disabled = true;
            }
        });

        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
    </script>
</body>

</html>