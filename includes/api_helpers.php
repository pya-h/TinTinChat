<?php

require_once __DIR__ . '/constants.php';

function apiJsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit;
}

function apiSuccess(array $data = [], int $statusCode = 200): void
{
    apiJsonResponse(array_merge([
        'status' => 'ok',
    ], $data), $statusCode);
}

function apiError(string $code, string $message, int $statusCode = 400): void
{
    apiJsonResponse([
        'status' => 'error',
        'error' => $message,
        'error_details' => [
            'code' => $code,
            'message' => $message,
        ],
    ], $statusCode);
}

function apiRequireMethod(string $expectedMethod): void
{
    if (!isset($_SERVER['REQUEST_METHOD']) || strtoupper($_SERVER['REQUEST_METHOD']) !== strtoupper($expectedMethod)) {
        apiError('INVALID_METHOD', 'Invalid request method', 405);
    }
}

function apiRequireAuth(): int
{
    if (!isset($_SESSION['user_id'])) {
        apiError('UNAUTHORIZED', 'Not logged in', 401);
    }

    return (int) $_SESSION['user_id'];
}

function apiRequireCsrf(): void
{
    $csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrf_token'] ?? null);

    if (!$csrfToken || !isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $csrfToken)) {
        apiError('INVALID_CSRF', 'Invalid CSRF token', 403);
    }
}

function apiGetJsonBody(): array
{
    $rawBody = file_get_contents('php://input');
    if (!$rawBody) {
        return [];
    }

    $decoded = json_decode($rawBody, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        apiError('INVALID_JSON', 'Invalid JSON payload', 400);
    }

    return $decoded;
}

function apiUploadErrorMessage(int $uploadError): string
{
    switch ($uploadError) {
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            $uploadMaxSize = ini_get('upload_max_filesize');
            $postMaxSize = ini_get('post_max_size');
            return "The uploaded file exceeds the server maximum file size limit (upload_max_filesize: {$uploadMaxSize}, post_max_size: {$postMaxSize}).";
        case UPLOAD_ERR_PARTIAL:
            return 'The uploaded file was only partially uploaded.';
        case UPLOAD_ERR_NO_FILE:
            return 'No file was uploaded.';
        case UPLOAD_ERR_NO_TMP_DIR:
            return 'Server configuration error: missing temporary upload directory.';
        case UPLOAD_ERR_CANT_WRITE:
            return 'Server error: failed to write uploaded file to disk.';
        case UPLOAD_ERR_EXTENSION:
            return 'A server extension blocked the file upload.';
        default:
            return 'Unknown upload error.';
    }
}

function apiRequireUploadedFile(string $fieldName): array
{
    if (!isset($_FILES[$fieldName])) {
        apiError('UPLOAD_MISSING', 'No file was uploaded.', 400);
    }

    $file = $_FILES[$fieldName];
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        apiError('UPLOAD_FAILED', apiUploadErrorMessage((int) $file['error']), 400);
    }

    return $file;
}

function apiDetectMimeType(string $tmpFilePath): string
{
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    if (!$finfo) {
        apiError('MIME_CHECK_FAILED', 'Failed to initialize MIME detection', 500);
    }

    $detectedMime = finfo_file($finfo, $tmpFilePath) ?: '';
    finfo_close($finfo);

    if (!$detectedMime) {
        apiError('MIME_CHECK_FAILED', 'Could not determine uploaded file MIME type', 400);
    }

    return $detectedMime;
}

function apiEnsureWritableDirectory(string $path, string $label): void
{
    if (!is_dir($path)) {
        if (!mkdir($path, 0755, true)) {
            apiError('DIRECTORY_CREATE_FAILED', "Failed to create {$label}", 500);
        }
    }

    if (!is_writable($path)) {
        apiError('DIRECTORY_NOT_WRITABLE', "{$label} is not writable", 500);
    }
}

function apiGuardOversizedPostBody(): void
{
    $contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int) $_SERVER['CONTENT_LENGTH'] : 0;
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($_POST) && empty($_FILES) && $contentLength > 0) {
        $postMaxSize = ini_get('post_max_size');
        $uploadMaxSize = ini_get('upload_max_filesize');
        apiError(
            'UPLOAD_TOO_LARGE',
            "Uploaded data exceeds server limit (post_max_size: {$postMaxSize}, upload_max_filesize: {$uploadMaxSize}). Restart local server with: php -d upload_max_filesize=110M -d post_max_size=120M -S localhost:8080",
            400
        );
    }
}

function apiNormalizeUsername(?string $username, string $errorCode = 'INVALID_USERNAME'): string
{
    $normalized = trim((string) $username);
    if ($normalized === '') {
        apiError('MISSING_USERNAME', 'Missing username', 400);
    }

    $minimumTailLength = max(0, TTC_USERNAME_MIN_LENGTH - 1);
    if (!preg_match('/^[a-zA-Z][a-zA-Z0-9_-]{' . $minimumTailLength . ',}$/', $normalized)) {
        apiError($errorCode, 'Invalid username format', 400);
    }

    return $normalized;
}
