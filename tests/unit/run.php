<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$testFiles = glob(__DIR__ . '/*_test.php') ?: [];

if (empty($testFiles)) {
    fwrite(STDERR, "No unit tests found in tests/unit\n");
    exit(1);
}

// Color helpers (auto-detect terminal support)
$useColor = (getenv('NO_COLOR') === false && (posix_isatty(STDOUT) || getenv('FORCE_COLOR') !== false));

$color = static function (string $text, string $code) use ($useColor): string {
    return $useColor ? "\033[{$code}m{$text}\033[0m" : $text;
};

$green  = static fn(string $t): string => $color($t, '32');
$red    = static fn(string $t): string => $color($t, '31');
$yellow = static fn(string $t): string => $color($t, '33');
$cyan   = static fn(string $t): string => $color($t, '36');
$bold   = static fn(string $t): string => $color($t, '1');
$dim    = static fn(string $t): string => $color($t, '2');

$totalPassed = 0;
$totalFailed = 0;
$totalSkipped = 0;
$failedTests = [];
$fileSummaries = [];

sort($testFiles);

foreach ($testFiles as $testFile) {
    $fileName = basename($testFile);
    fwrite(STDOUT, "\n" . $bold($cyan("  {$fileName}")) . "\n");

    $filePassed = 0;
    $fileFailed = 0;

    $tests = require $testFile;
    if (!is_array($tests)) {
        fwrite(STDERR, $red("  Invalid test file format: {$testFile}") . "\n");
        $totalFailed++;
        $fileFailed++;
        $failedTests[] = "{$fileName}: invalid format";
        $fileSummaries[] = ['file' => $fileName, 'passed' => 0, 'failed' => 1];
        continue;
    }

    foreach ($tests as $name => $fn) {
        if (!is_callable($fn)) {
            fwrite(STDERR, $red("    ✗ {$name}") . $dim(" (not callable)") . "\n");
            $totalFailed++;
            $fileFailed++;
            $failedTests[] = "{$fileName} > {$name}: not callable";
            continue;
        }

        $startTime = microtime(true);
        try {
            $fn();
            $elapsed = round((microtime(true) - $startTime) * 1000, 1);
            $totalPassed++;
            $filePassed++;
            $timeStr = $elapsed > 100 ? $yellow("{$elapsed}ms") : $dim("{$elapsed}ms");
            fwrite(STDOUT, $green("    ✓ ") . "{$name} " . $timeStr . "\n");
        } catch (Throwable $error) {
            $elapsed = round((microtime(true) - $startTime) * 1000, 1);
            $totalFailed++;
            $fileFailed++;
            $failedTests[] = "{$fileName} > {$name}: {$error->getMessage()}";
            fwrite(STDOUT, $red("    ✗ {$name}") . " " . $dim("{$elapsed}ms") . "\n");
            fwrite(STDOUT, $dim("      {$error->getMessage()}") . "\n");
        }
    }

    $fileSummaries[] = ['file' => $fileName, 'passed' => $filePassed, 'failed' => $fileFailed];
}

// Summary
$totalTests = $totalPassed + $totalFailed;

fwrite(STDOUT, "\n" . str_repeat('─', 60) . "\n");
fwrite(STDOUT, $bold("  Unit Test Results") . "\n");
fwrite(STDOUT, str_repeat('─', 60) . "\n\n");

// Per-file breakdown
foreach ($fileSummaries as $fs) {
    $status = $fs['failed'] > 0 ? $red('FAIL') : $green('PASS');
    $counts = $green("{$fs['passed']} passed");
    if ($fs['failed'] > 0) {
        $counts .= ", " . $red("{$fs['failed']} failed");
    }
    fwrite(STDOUT, "  {$status}  {$fs['file']}  ({$counts})\n");
}

fwrite(STDOUT, "\n");

// Totals
fwrite(STDOUT, "  " . $bold("Total:") . "   {$totalTests} tests\n");
fwrite(STDOUT, "  " . $green($bold("Passed:")) . "  {$totalPassed}\n");

if ($totalFailed > 0) {
    fwrite(STDOUT, "  " . $red($bold("Failed:")) . "  {$totalFailed}\n");
}

if ($totalFailed > 0) {
    fwrite(STDOUT, "\n" . $red($bold("  Failed tests:")) . "\n");
    foreach ($failedTests as $ft) {
        fwrite(STDOUT, $red("    ✗ {$ft}") . "\n");
    }
}

fwrite(STDOUT, "\n");

if ($totalFailed === 0) {
    fwrite(STDOUT, $green($bold("  All {$totalPassed} tests passed ✓")) . "\n\n");
} else {
    fwrite(STDOUT, $red($bold("  {$totalFailed} of {$totalTests} tests failed ✗")) . "\n\n");
}

exit($totalFailed > 0 ? 1 : 0);
