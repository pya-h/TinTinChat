<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/includes/db.php';

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
    'envGet returns default for unset variable' => static function () use ($assertSame): void {
        $unique = '__TTCTEST_MISSING_' . mt_rand();
        $assertSame('fallback', envGet($unique, 'fallback'), 'should return default');
    },

    'envGet reads from putenv' => static function () use ($assertSame): void {
        $key = '__TTCTEST_PUTENV_' . mt_rand();
        putenv("{$key}=hello_world");
        $assertSame('hello_world', envGet($key), 'should read from putenv');
        putenv($key); // cleanup
    },

    'envGet reads from $_ENV' => static function () use ($assertSame): void {
        $key = '__TTCTEST_ENV_' . mt_rand();
        $_ENV[$key] = 'from_env';
        $assertSame('from_env', envGet($key), 'should read from $_ENV');
        unset($_ENV[$key]); // cleanup
    },

    'envGet prefers $_ENV over getenv' => static function () use ($assertSame): void {
        $key = '__TTCTEST_PRIORITY_' . mt_rand();
        $_ENV[$key] = 'env_value';
        putenv("{$key}=getenv_value");
        $assertSame('env_value', envGet($key), '$_ENV should take precedence');
        unset($_ENV[$key]);
        putenv($key); // cleanup
    },

    'envGet treats empty string as unset' => static function () use ($assertSame): void {
        $key = '__TTCTEST_EMPTY_' . mt_rand();
        $_ENV[$key] = '';
        putenv("{$key}=");
        $assertSame('default', envGet($key, 'default'), 'empty should fall through to default');
        unset($_ENV[$key]);
        putenv($key);
    },

    'loadEnv does not override shell env vars' => static function () use ($assertSame, $assertTrue): void {
        // Create a temp .env file
        $tmpFile = tempnam(sys_get_temp_dir(), 'ttctest_');
        file_put_contents($tmpFile, "TTCTEST_LOADENV_VAR=from_file\n");

        // Pre-set via putenv (simulates shell export)
        putenv("TTCTEST_LOADENV_VAR=from_shell");

        loadEnv($tmpFile);

        // Shell value should win
        $assertSame('from_shell', envGet('TTCTEST_LOADENV_VAR'), 'shell value should take precedence over file');
        // But it should be mirrored into $_ENV
        $assertTrue(isset($_ENV['TTCTEST_LOADENV_VAR']), '$_ENV should be populated');
        $assertSame('from_shell', $_ENV['TTCTEST_LOADENV_VAR'], '$_ENV should have shell value');

        // Cleanup
        unset($_ENV['TTCTEST_LOADENV_VAR']);
        putenv('TTCTEST_LOADENV_VAR');
        unlink($tmpFile);
    },

    'loadEnv loads from file when env var is absent' => static function () use ($assertSame): void {
        $key = 'TTCTEST_FILEONLY_' . mt_rand();
        $tmpFile = tempnam(sys_get_temp_dir(), 'ttctest_');
        file_put_contents($tmpFile, "{$key}=loaded_from_file\n");

        loadEnv($tmpFile);

        $assertSame('loaded_from_file', envGet($key), 'should load from file');
        $assertSame('loaded_from_file', $_ENV[$key] ?? '', '$_ENV should be set');

        // Cleanup
        unset($_ENV[$key]);
        putenv($key);
        unlink($tmpFile);
    },

    'loadEnv skips comments and empty lines' => static function () use ($assertSame): void {
        $key = 'TTCTEST_COMMENT_' . mt_rand();
        $tmpFile = tempnam(sys_get_temp_dir(), 'ttctest_');
        file_put_contents($tmpFile, "# comment\n\n{$key}=valid_value\n# another comment\n");

        loadEnv($tmpFile);

        $assertSame('valid_value', envGet($key), 'should skip comments and load value');

        unset($_ENV[$key]);
        putenv($key);
        unlink($tmpFile);
    },

    'loadEnv strips quotes from values' => static function () use ($assertSame): void {
        $key1 = 'TTCTEST_QUOTED1_' . mt_rand();
        $key2 = 'TTCTEST_QUOTED2_' . mt_rand();
        $tmpFile = tempnam(sys_get_temp_dir(), 'ttctest_');
        file_put_contents($tmpFile, "{$key1}=\"double_quoted\"\n{$key2}='single_quoted'\n");

        loadEnv($tmpFile);

        $assertSame('double_quoted', envGet($key1), 'double quotes should be stripped');
        $assertSame('single_quoted', envGet($key2), 'single quotes should be stripped');

        unset($_ENV[$key1], $_ENV[$key2]);
        putenv($key1);
        putenv($key2);
        unlink($tmpFile);
    },

    'loadEnv ignores missing file' => static function () use ($assertTrue): void {
        // Should not throw
        loadEnv('/tmp/__ttctest_nonexistent_' . mt_rand() . '.env');
        $assertTrue(true, 'loadEnv should silently ignore missing files');
    },
];
