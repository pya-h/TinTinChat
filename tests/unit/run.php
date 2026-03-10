<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$testFiles = glob(__DIR__ . '/*_test.php') ?: [];

if (empty($testFiles)) {
    fwrite(STDERR, "No unit tests found in tests/unit\n");
    exit(1);
}

$failed = 0;
$passed = 0;

foreach ($testFiles as $testFile) {
    $tests = require $testFile;
    if (!is_array($tests)) {
        fwrite(STDERR, "Invalid test file format: {$testFile}\n");
        $failed++;
        continue;
    }

    foreach ($tests as $name => $fn) {
        if (!is_callable($fn)) {
            fwrite(STDERR, "Test '{$name}' is not callable\n");
            $failed++;
            continue;
        }

        try {
            $fn();
            $passed++;
            fwrite(STDOUT, "✓ {$name}\n");
        } catch (Throwable $error) {
            $failed++;
            fwrite(STDERR, "✗ {$name}: {$error->getMessage()}\n");
        }
    }
}

fwrite(STDOUT, "\nUnit tests summary: {$passed} passed, {$failed} failed\n");
exit($failed > 0 ? 1 : 0);
