<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/includes/group_helpers.php';

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
    'groupParseId handles invalid and valid values' => static function () use ($assertSame): void {
        $assertSame(0, groupParseId(null), 'null');
        $assertSame(0, groupParseId('abc'), 'alpha');
        $assertSame(0, groupParseId('-7'), 'negative');
        $assertSame(12, groupParseId('12'), 'positive-string');
    },

    'groupGenerateJoinToken produces hex-like token' => static function () use ($assertTrue): void {
        $token = groupGenerateJoinToken();
        $assertTrue(strlen($token) >= 40, 'token length should be reasonably long');
        $assertTrue((bool) preg_match('/^[a-f0-9]+$/i', $token), 'token should be hexadecimal-like');
    },

    'groupBuildJoinLink composes dashboard join URL' => static function () use ($assertTrue): void {
        $_SERVER['HTTPS'] = 'on';
        $_SERVER['HTTP_HOST'] = 'chat.local';
        $_SERVER['SCRIPT_NAME'] = '/api/create_group.php';
        $link = groupBuildJoinLink('abc123');
        $assertTrue($link === 'https://chat.local/dashboard.php?join_group=abc123', 'join link format mismatch');
    },

    'groupStringLength returns expected length' => static function () use ($assertSame): void {
        $assertSame(5, groupStringLength('hello'), 'ascii length');
    },
];
