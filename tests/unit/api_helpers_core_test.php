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
    'apiRedactMessageMediaPaths redacts only matching media columns' => static function () use ($assertSame): void {
        $messages = [
            [
                'message_type' => 'image',
                'image_file_path' => 'abc.bin',
                'voice_file_path' => 'should_be_ignored.bin',
                'any_file_path' => 'should_be_ignored.bin',
            ],
            [
                'message_type' => 'voice',
                'image_file_path' => 'x.bin',
                'voice_file_path' => 'voice.bin',
                'any_file_path' => 'y.bin',
            ],
            [
                'message_type' => 'file',
                'image_file_path' => 'x.bin',
                'voice_file_path' => 'y.bin',
                'any_file_path' => 'file.bin',
            ],
            [
                'message_type' => 'video',
                'image_file_path' => 'x.bin',
                'voice_file_path' => 'y.bin',
                'any_file_path' => 'video.bin',
            ],
            [
                'message_type' => 'text',
                'image_file_path' => 'x.bin',
                'voice_file_path' => 'y.bin',
                'any_file_path' => 'z.bin',
            ],
        ];

        apiRedactMessageMediaPaths($messages);

        $assertSame(1, $messages[0]['image_file_path'], 'image path should be presence flag');
        $assertSame(null, $messages[0]['voice_file_path'], 'image row voice must be nulled');
        $assertSame(null, $messages[0]['any_file_path'], 'image row any must be nulled');

        $assertSame(null, $messages[1]['image_file_path'], 'voice row image must be nulled');
        $assertSame(1, $messages[1]['voice_file_path'], 'voice path should be presence flag');
        $assertSame(null, $messages[1]['any_file_path'], 'voice row any must be nulled');

        $assertSame(null, $messages[2]['image_file_path'], 'file row image must be nulled');
        $assertSame(null, $messages[2]['voice_file_path'], 'file row voice must be nulled');
        $assertSame(1, $messages[2]['any_file_path'], 'file path should be presence flag');

        $assertSame(null, $messages[3]['image_file_path'], 'video row image must be nulled');
        $assertSame(null, $messages[3]['voice_file_path'], 'video row voice must be nulled');
        $assertSame(1, $messages[3]['any_file_path'], 'video path should be presence flag');

        $assertSame(null, $messages[4]['image_file_path'], 'text row image must be nulled');
        $assertSame(null, $messages[4]['voice_file_path'], 'text row voice must be nulled');
        $assertSame(null, $messages[4]['any_file_path'], 'text row any must be nulled');
    },

    'apiIsSuperuserUsername is case-insensitive and trims' => static function () use ($assertTrue): void {
        $prev = $_ENV['SUPERUSER_USERNAME'] ?? null;
        $_ENV['SUPERUSER_USERNAME'] = 'RootBoss';

        try {
            $assertTrue(apiIsSuperuserUsername('rootboss'), 'exact lowercase should match');
            $assertTrue(apiIsSuperuserUsername('  ROOTBOSS  '), 'trimmed uppercase should match');
            $assertTrue(!apiIsSuperuserUsername('rootboss2'), 'different username should not match');
        } finally {
            if ($prev === null) {
                unset($_ENV['SUPERUSER_USERNAME']);
            } else {
                $_ENV['SUPERUSER_USERNAME'] = $prev;
            }
        }
    },

    'apiGetConfiguredSuperuserUsername falls back to default' => static function () use ($assertSame): void {
        $prev = $_ENV['SUPERUSER_USERNAME'] ?? null;
        unset($_ENV['SUPERUSER_USERNAME']);

        try {
            $assertSame('paya', apiGetConfiguredSuperuserUsername(), 'default superuser fallback');
        } finally {
            if ($prev !== null) {
                $_ENV['SUPERUSER_USERNAME'] = $prev;
            }
        }
    },
];
