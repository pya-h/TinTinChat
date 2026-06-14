<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/includes/api_helpers.php';

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
    'apiUploadErrorMessage handles file-size errors' => static function () use ($assertTrue): void {
        $messageIni = apiUploadErrorMessage(UPLOAD_ERR_INI_SIZE);
        $messageForm = apiUploadErrorMessage(UPLOAD_ERR_FORM_SIZE);

        $assertTrue(stripos($messageIni, 'upload_max_filesize') !== false, 'ini-size message should mention upload_max_filesize');
        $assertTrue(stripos($messageForm, 'post_max_size') !== false, 'form-size message should mention post_max_size');
    },

    'apiUploadErrorMessage handles missing/no-file errors' => static function () use ($assertSame): void {
        $assertSame('Server configuration error: missing temporary upload directory.', apiUploadErrorMessage(UPLOAD_ERR_NO_TMP_DIR));
        $assertSame('No file was uploaded.', apiUploadErrorMessage(UPLOAD_ERR_NO_FILE));
    },

    'apiUploadErrorMessage falls back for unknown error codes' => static function () use ($assertSame): void {
        $assertSame('Unknown upload error.', apiUploadErrorMessage(9999));
    },
];
