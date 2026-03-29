<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../../includes/constants.php';

function redirectToApp(string $target): void
{
	$scriptName = (string)($_SERVER['SCRIPT_NAME'] ?? '');
	$basePath = preg_replace('#/api(?:/auth)?/login\.php$#', '', $scriptName);
	if (!is_string($basePath)) {
		$basePath = '';
	}
	$basePath = rtrim($basePath, '/');
	$location = ($basePath === '' ? '' : $basePath) . $target;
	header('Location: ' . $location);
	exit;
}

function isValidUsername($username)
{
	return preg_match('/^[a-zA-Z][a-zA-Z0-9_-]{2,}$/', $username);
}

function isValidPassword($password)
{
	return strlen($password) >= 8 &&
		preg_match('/[0-9]/', $password) &&
		preg_match('/[a-zA-Z]/', $password) &&
		preg_match('/[^a-zA-Z0-9]/', $password);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	redirectToApp('/index.php');
}

// CSRF protection
$csrfToken = $_POST['csrf_token'] ?? '';
if (!verifyCsrfToken($csrfToken)) {
	$_SESSION['login_error'] = 'Invalid request. Please try again.';
	redirectToApp('/index.php');
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (!$username || !$password) {
	$_SESSION['login_error'] = 'Missing username or password';
	redirectToApp('/index.php');
}

if (!isValidUsername($username)) {
	$_SESSION['login_error'] = 'Username must be at least 3 characters, starting a letter & contains only letters, numbers, hyphens, and underscores';
	redirectToApp('/index.php');
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user) {
	// Check username blacklist for new registrations
	$lowerUsername = strtolower($username);
	$lowerNoSep = str_replace(['-', '_'], '', $lowerUsername);
	foreach (TTC_USERNAME_BLACKLIST as $reserved) {
		$reservedClean = str_replace(['-', '_', ' '], '', strtolower($reserved));
		if ($lowerUsername === strtolower($reserved) || $lowerNoSep === $reservedClean) {
			$_SESSION['login_error'] = 'This username is not available';
			redirectToApp('/index.php');
		}
	}

	if (!isValidPassword($password)) {
		$_SESSION['login_error'] = 'Password must be at least 8 characters and contain at least one digit, one letter, and one special character';
		redirectToApp('/index.php');
	}

	$config = [
		'private_key_type' => OPENSSL_KEYTYPE_RSA,
		'private_key_bits' => 2048,
	];

	$res = openssl_pkey_new($config);
	if ($res === false) {
		$_SESSION['login_error'] = 'Unable to initialize account cryptography. Please try again.';
		redirectToApp('/index.php');
	}
	openssl_pkey_export($res, $privatePem);
	if (!$privatePem) {
		$_SESSION['login_error'] = 'Unable to generate private key. Please try again.';
		redirectToApp('/index.php');
	}
	$details = openssl_pkey_get_details($res);
	if (!$details || empty($details['key'])) {
		$_SESSION['login_error'] = 'Unable to generate public key. Please try again.';
		redirectToApp('/index.php');
	}
	$publicPem = $details['key'];

	$passwordHash = password_hash($password, PASSWORD_DEFAULT);

	$stmt = $pdo->prepare('INSERT INTO users (username, password_hash, public_key, private_key) VALUES (?, ?, ?, ?)');
	$stmt->execute([$username, $passwordHash, $publicPem, $privatePem]);

	$user_id = $pdo->lastInsertId();

	$new_ident = setSessionUser(['id' => $user_id, 'username' => $username]);
	if($new_ident) {
	   updateLoginSession($user_id, $new_ident);
	   createUserSession($user_id, $new_ident);
	}
	redirectToApp('/dashboard.php');
}

if (!password_verify($password, $user['password_hash'])) {
	$_SESSION['login_error'] = 'Invalid password';
	redirectToApp('/index.php');
}

if (!empty($user['banned_at'])) {
	$_SESSION['login_error'] = 'Your account has been suspended.';
	redirectToApp('/index.php');
}

$new_ident = setSessionUser($user);
if($new_ident) {
   updateLoginSession($user['id'], $new_ident);
   createUserSession((int)$user['id'], $new_ident);
}
redirectToApp('/dashboard.php');
