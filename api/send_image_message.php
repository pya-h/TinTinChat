<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$sender_id = apiRequireAuth();
apiRequireCsrf();
apiGuardOversizedPostBody();
const ALLOWED_IMAGE_MIME_TO_EXT = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/gif' => 'gif',
    'image/webp' => 'webp',
];

$target_username = apiNormalizeUsername($_POST['target'] ?? null, 'INVALID_TARGET_USERNAME');
$message_for_recipient = $_POST['message'] ?? null;
$message_for_sender = $_POST['message_for_sender'] ?? null;
$image_file = apiRequireUploadedFile('image_file');

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$target_username]);
$receiver = $stmt->fetch();

if (!$receiver) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}
$receiver_id = $receiver['id'];

$upload_dir = __DIR__ . '/../uploads/images/';
apiEnsureWritableDirectory($upload_dir, 'images directory');

$detectedMime = apiDetectMimeType($image_file['tmp_name']);
if (!array_key_exists($detectedMime, ALLOWED_IMAGE_MIME_TO_EXT)) {
    apiError('INVALID_IMAGE_TYPE', 'Invalid image type. Only JPG, PNG, GIF, and WEBP are allowed.', 400);
}

if ((int) $image_file['size'] > TTC_UPLOAD_IMAGE_MAX_BYTES) {
    apiError('FILE_TOO_LARGE', 'Image file is too large. Max 5MB allowed.', 400);
}

$file_extension = ALLOWED_IMAGE_MIME_TO_EXT[$detectedMime];
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
