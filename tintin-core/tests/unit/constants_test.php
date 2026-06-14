<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/includes/constants.php';

$assertSame = static function ($expected, $actual, string $label = ''): void {
    if ($expected !== $actual) {
        $prefix = $label !== '' ? "{$label}: " : '';
        throw new RuntimeException($prefix . 'Expected ' . var_export($expected, true) . ' but got ' . var_export($actual, true));
    }
};

$assertTrue = static function (bool $condition, string $label = 'Assertion failed'): void {
    if (!$condition) {
        throw new RuntimeException($label);
    }
};

return [
    'username min length is positive integer' => static function () use ($assertTrue): void {
        $assertTrue(TTC_USERNAME_MIN_LENGTH >= 1, 'min length must be at least 1');
        $assertTrue(TTC_USERNAME_MIN_LENGTH <= 30, 'min length should be reasonable');
    },

    'message fetch limits are consistent' => static function () use ($assertTrue): void {
        $assertTrue(TTC_FETCH_MESSAGES_MIN_LIMIT >= 1, 'min limit must be at least 1');
        $assertTrue(TTC_FETCH_MESSAGES_MAX_LIMIT >= TTC_FETCH_MESSAGES_MIN_LIMIT, 'max must be >= min');
        $assertTrue(
            TTC_FETCH_MESSAGES_DEFAULT_LIMIT >= TTC_FETCH_MESSAGES_MIN_LIMIT
            && TTC_FETCH_MESSAGES_DEFAULT_LIMIT <= TTC_FETCH_MESSAGES_MAX_LIMIT,
            'default must be within [min, max]'
        );
    },

    'upload limits are positive and ordered sensibly' => static function () use ($assertTrue): void {
        $assertTrue(TTC_UPLOAD_STICKER_MAX_BYTES > 0, 'sticker limit > 0');
        $assertTrue(TTC_UPLOAD_AVATAR_MAX_BYTES > 0, 'avatar limit > 0');
        $assertTrue(TTC_UPLOAD_VOICE_MAX_BYTES > 0, 'voice limit > 0');
        $assertTrue(TTC_UPLOAD_IMAGE_MAX_BYTES > 0, 'image limit > 0');
        $assertTrue(TTC_UPLOAD_FILE_MAX_BYTES > 0, 'file limit > 0');
        // File should be the largest allowed upload
        $assertTrue(TTC_UPLOAD_FILE_MAX_BYTES >= TTC_UPLOAD_IMAGE_MAX_BYTES, 'file >= image');
        $assertTrue(TTC_UPLOAD_IMAGE_MAX_BYTES >= TTC_UPLOAD_VOICE_MAX_BYTES, 'image >= voice');
        $assertTrue(TTC_UPLOAD_STICKER_MAX_BYTES <= TTC_UPLOAD_AVATAR_MAX_BYTES, 'sticker <= avatar');
    },

    'group title limits are consistent' => static function () use ($assertTrue): void {
        $assertTrue(TTC_GROUP_TITLE_MIN_LENGTH >= 1, 'group title min >= 1');
        $assertTrue(TTC_GROUP_TITLE_MAX_LENGTH > TTC_GROUP_TITLE_MIN_LENGTH, 'max > min');
        $assertTrue(TTC_GROUP_DESCRIPTION_MAX_LENGTH > 0, 'description max > 0');
    },

    'sticker canvas size is positive' => static function () use ($assertTrue): void {
        $assertTrue(TTC_STICKER_CANVAS_SIZE > 0 && TTC_STICKER_CANVAS_SIZE <= 2048, 'canvas size in sane range');
    },

    'username blacklist is non-empty and contains expected entries' => static function () use ($assertTrue): void {
        $assertTrue(count(TTC_USERNAME_BLACKLIST) > 0, 'blacklist should not be empty');
        $lower = array_map('strtolower', TTC_USERNAME_BLACKLIST);
        $assertTrue(in_array('admin', $lower, true), 'blacklist should include admin');
        $assertTrue(in_array('system', $lower, true), 'blacklist should include system');
        $assertTrue(in_array('root', $lower, true), 'blacklist should include root');
        $assertTrue(in_array('test', $lower, true), 'blacklist should include test');
    },

    'tintinchatFrontendConstants returns expected keys' => static function () use ($assertTrue): void {
        $constants = tintinchatFrontendConstants();
        $requiredKeys = [
            'usernameMinLength', 'messagesPerPage', 'messagePageMaxLimit',
            'seenStatusMaxIds', 'uploadImageMaxBytes', 'uploadFileMaxBytes',
            'uploadVoiceMaxBytes', 'uploadAvatarMaxBytes', 'uploadStickerMaxBytes',
            'stickerCanvasSize', 'chatRefreshPollMs', 'seenStatusPollMs',
            'messageEditWindowMs',
        ];
        foreach ($requiredKeys as $key) {
            $assertTrue(array_key_exists($key, $constants), "missing key: {$key}");
            $assertTrue(is_int($constants[$key]), "{$key} must be integer");
            $assertTrue($constants[$key] > 0, "{$key} must be positive");
        }
    },

    'polling intervals are in milliseconds and reasonable' => static function () use ($assertTrue): void {
        $assertTrue(TTC_CHAT_REFRESH_POLL_MS >= 500, 'chat poll should be at least 500ms');
        $assertTrue(TTC_CHAT_REFRESH_POLL_MS <= 30000, 'chat poll should not exceed 30s');
        $assertTrue(TTC_SEEN_STATUS_POLL_MS >= 1000, 'seen poll should be at least 1s');
        $assertTrue(TTC_SEEN_STATUS_POLL_MS <= 60000, 'seen poll should not exceed 60s');
    },

    'seen status limits are positive' => static function () use ($assertTrue): void {
        $assertTrue(TTC_SEEN_STATUS_MAX_IDS > 0, 'max ids > 0');
        $assertTrue(TTC_SEEN_STATUS_MAX_RAW_IDS_LENGTH > 0, 'max raw length > 0');
    },
];
