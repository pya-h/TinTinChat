<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/includes/group_crypto_helpers.php';
require_once dirname(__DIR__, 2) . '/includes/crypto_helper.php';

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
    'groupGenerateSharedKey returns 32-byte base64 payload' => static function () use ($assertTrue): void {
        $sharedKey = groupGenerateSharedKey();
        $decoded = base64_decode($sharedKey, true);

        $assertTrue(is_string($sharedKey) && $sharedKey !== '', 'shared key should be a non-empty string');
        $assertTrue($decoded !== false, 'shared key must be valid base64');
        $assertTrue(strlen((string) $decoded) === 32, 'shared key decoded length must be 32 bytes');
    },

    'group shared key encryption/decryption roundtrip works' => static function () use ($assertSame, $assertTrue): void {
        [$publicKeyBase64, $privateKeyBase64] = generate_rsa_keypair();
        $publicKeyPem = base64_decode($publicKeyBase64, true);
        $privateKeyPem = base64_decode($privateKeyBase64, true);

        $assertTrue($publicKeyPem !== false && $publicKeyPem !== '', 'public key PEM decode failed');
        $assertTrue($privateKeyPem !== false && $privateKeyPem !== '', 'private key PEM decode failed');

        $rawSharedKey = groupGenerateSharedKey();
        $encrypted = groupEncryptSharedKeyForPublicKey($rawSharedKey, (string) $publicKeyPem);
        $decrypted = groupDecryptSharedKeyForPrivateKey($encrypted, (string) $privateKeyPem);

        $assertTrue($encrypted !== '', 'encrypted shared key should not be empty');
        $assertSame($rawSharedKey, $decrypted, 'roundtrip shared key mismatch');
    },

    'group shared key decryption fails with wrong private key' => static function () use ($assertSame): void {
        [$publicKeyBase64] = generate_rsa_keypair();
        [, $wrongPrivateKeyBase64] = generate_rsa_keypair();

        $publicKeyPem = base64_decode($publicKeyBase64, true);
        $wrongPrivateKeyPem = base64_decode($wrongPrivateKeyBase64, true);

        $rawSharedKey = groupGenerateSharedKey();
        $encrypted = groupEncryptSharedKeyForPublicKey($rawSharedKey, (string) $publicKeyPem);
        $decrypted = groupDecryptSharedKeyForPrivateKey($encrypted, (string) $wrongPrivateKeyPem);

        $assertSame(null, $decrypted, 'decryption with wrong private key should return null');
    },

    'group shared key decryption rejects invalid ciphertext' => static function () use ($assertSame): void {
        [, $privateKeyBase64] = generate_rsa_keypair();
        $privateKeyPem = base64_decode($privateKeyBase64, true);

        $decrypted = groupDecryptSharedKeyForPrivateKey('not-valid-base64', (string) $privateKeyPem);
        $assertSame(null, $decrypted, 'invalid encrypted payload should return null');
    },
];
