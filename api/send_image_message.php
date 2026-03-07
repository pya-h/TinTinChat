<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$sender_id = apiRequireAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($_POST) && empty($_FILES) && $_SERVER['CONTENT_LENGTH'] > 0) {
    $post_max_size = ini_get('post_max_size');
    apiError('UPLOAD_TOO_LARGE', "The uploaded data exceeds the server's configured limit (post_max_size is {$post_max_size}). Please upload a smaller file.", 400);
}

$target_username = $_POST['target'] ?? null;
$message_for_recipient = $_POST['message'] ?? null;
$message_for_sender = $_POST['message_for_sender'] ?? null;
$image_file = $_FILES['image_file'] ?? null;

if (!$target_username) {
    apiError('MISSING_PARAMETERS', 'A required field was missing from the request.', 400);
}

if (!isset($image_file) || $image_file['error'] !== UPLOAD_ERR_OK) {
    $error_message = 'An unknown file upload error occurred.';
    if (isset($image_file['error'])) {
        switch ($image_file['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $error_message = "The uploaded file exceeds the server's maximum file size limit.";
                break;
            case UPLOAD_ERR_PARTIAL:
                $error_message = 'The uploaded file was only partially uploaded.';
                break;
            case UPLOAD_ERR_NO_FILE:
                $error_message = 'No file was uploaded.';
                break;
            case UPLOAD_ERR_NO_TMP_DIR:
                $error_message = 'Server configuration error: Missing a temporary folder.';
                break;
            case UPLOAD_ERR_CANT_WRITE:
                $error_message = 'Server error: Failed to write file to disk.';
                break;
            case UPLOAD_ERR_EXTENSION:
                $error_message = 'A server extension stopped the file upload.';
                break;
        }
    } else {
        $error_message = 'No file was sent with the request or the file was too large.';
    }

    apiError('UPLOAD_FAILED', $error_message, 400);
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$target_username]);
$receiver = $stmt->fetch();

if (!$receiver) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}
$receiver_id = $receiver['id'];

$upload_dir = __DIR__ . '/../uploads/images/';

if (!is_dir($upload_dir)) {
    if (!mkdir($upload_dir, 0755, true)) {
        apiError('DIRECTORY_CREATE_FAILED', 'Failed to create images directory', 500);
    }
}

// Validate MIME type server-side using file contents, not client-provided type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$detectedMime = finfo_file($finfo, $image_file['tmp_name']);
finfo_close($finfo);

$allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!in_array($detectedMime, $allowed_types)) {
    apiError('INVALID_IMAGE_TYPE', 'Invalid image type. Only JPG, PNG, GIF, and WEBP are allowed.', 400);
}

if ($image_file['size'] > 5 * 1024 * 1024) {  // 5 MB limit
    apiError('FILE_TOO_LARGE', 'Image file is too large. Max 5MB allowed.', 400);
}

$file_extension = pathinfo($image_file['name'], PATHINFO_EXTENSION);
$unique_filename = uniqid('img_', true) . '.' . $file_extension;
$upload_path = $upload_dir . $unique_filename;

if (move_uploaded_file($image_file['tmp_name'], $upload_path)) {
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO messages (sender_id, receiver_id, message, message_for_sender, message_type, image_file_path) 
             VALUES (?, ?, ?, ?, 'image', ?)"
        );
        if (
            !$stmt->execute([
                $sender_id,
                $receiver_id,
                $message_for_recipient,
                $message_for_sender,
                'uploads/images/' . $unique_filename
            ])
        ) {
            apiError('SEND_FAILED', 'Something went wrong while sending your message!', 409);
        }

        apiSuccess(['message' => 'Image sent successfully']);
    } catch (PDOException $e) {
        unlink($upload_path);
        apiError('DB_SAVE_FAILED', 'Failed to save image message', 500);
    }
} else {
    apiError('FILE_MOVE_FAILED', 'Failed to move uploaded file.', 500);
}
