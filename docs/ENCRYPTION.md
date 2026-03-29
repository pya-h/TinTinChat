# TinTinChat Encryption Reference

Last updated: 2026-03-29

---

## Part 1 — Current Encryption Architecture

### 1.1 Overview

- **Private text:** RSA-OAEP chunked encryption (recipient + sender copies).
- **Group text:** shared group AES-GCM key (`gcm1:<iv>:<cipher>`).
- **Private/group media** (`image`, `voice`, `file`, `video`): per-message AES media key + envelope `med1`.
- Server stores encrypted blobs and envelope fields; decryption happens client-side.

### 1.2 Envelope Formats

#### Group text (`gcm1`)

- Payload format: `gcm1:<iv_b64>:<cipher_b64>`
- Stored in both `messages.message` and `messages.message_for_sender` for group rows.

#### Media envelope (`med1`)

Stored in `messages.message` / `messages.message_for_sender`.

- `v`: envelope version (`med1`)
- `k`: wrapped per-message AES media key
- `m`: encrypted metadata payload (`mmd1`)
- `kv`: key version marker (rotation-aware behavior)

### 1.3 Private Text Flow

**Send:**
1. Client fetches recipient and sender public keys.
2. Client encrypts plaintext twice (recipient payload + sender copy).
3. Client posts encrypted fields to `api/messages/send_text.php`.

**Receive:**
1. Client fetches message row.
2. If current user is sender, decrypt `message_for_sender`; else decrypt `message`.
3. Render plaintext.

Notes:
- UTF-8 byte-aware chunking avoids multibyte corruption.
- Text decryption uses private RSA key (OAEP SHA-256 path).

### 1.4 Group Text Flow

**Key distribution:**
Group lifecycle APIs create/maintain per-member wrapped shared keys in `group_member_keys`:
1. Member public key is loaded.
2. Shared group key is wrapped per member.
3. Wrapped value is upserted for `(group_id, user_id)`.

**Send/receive:**
1. Client loads/imports current group key from `api/keys/get_group.php`.
2. Text is encrypted with group AES-GCM key (`gcm1`).
3. On fetch, members decrypt with same group key.

Server-side membership checks gate all group reads/writes.

### 1.5 Private Media Flow

**Send:**
1. Generate fresh AES media key per message.
2. Encrypt binary payload with AES-GCM.
3. Encrypt metadata (filename, MIME, size) with same key.
4. Wrap media key for recipient and sender separately (public-key wrapping).
5. Upload encrypted blob + envelopes via media send endpoint.

**Receive:**
1. Select proper envelope (`message` or `message_for_sender`).
2. Unwrap media key with client private key.
3. Decrypt metadata.
4. Fetch encrypted blob via media get endpoint.
5. Decrypt blob and render/play/download.

### 1.6 Group Media Flow

**Send:**
1. Fetch/import current group key.
2. Generate per-message AES media key.
3. Encrypt blob + metadata.
4. Wrap media key using group key and write `kv` marker.
5. Upload encrypted blob + `med1` envelope with `group_id`.

**Receive:**
1. Parse `med1` envelope from message row.
2. If `kv` differs from cached group key version, refresh group key.
3. Unwrap media key with group key.
4. Decrypt metadata + blob and render.

### 1.7 Key Versioning & Rotation

- Current behavior writes `kv` for media envelopes.
- Direct chats use baseline `kv=1`.
- Group media/text uses active group key version from `api/keys/get_group.php`.
- On decrypt, clients refresh key if envelope `kv` and cache diverge.
- Rotate at group-key level in controlled windows.
- Ensure historical decryptability strategy before aggressive rotation.

### 1.8 Legacy Data Policy

Project decision: legacy unencrypted attachment/text rows are not retained.

Cleanup flow (maintenance windows):
1. Backup DB + uploads.
2. Remove legacy non-envelope rows.
3. Remove orphan files under uploads paths.

### 1.9 Security Guarantees & Caveats

**Guarantees:**
- Server transports/stores ciphertext for encrypted content.
- Non-members cannot decrypt group media/text without group keys.
- Membership enforcement applied for group message and media access.

**Caveats:**
- Private keys currently stored in plaintext in DB — addressed by Phase N upgrade (Part 2 below).
- Server-side group key distribution reads private keys from DB — addressed by Phase N.

### 1.10 Files Involved in Current Crypto

| File | Role |
|------|------|
| `includes/crypto_helper.php` | Server-side RSA keygen + decrypt |
| `includes/group_crypto_helpers.php` | Server-side group key distribution |
| `assets/js/crypto.js` | All client-side crypto (RSA, AES-GCM, key wrapping, envelope) |
| `api/auth/login.php` | Registration: calls OpenSSL keygen, stores keys |
| `api/keys/get_private.php` | Returns plaintext private key PEM |
| `api/keys/get_public.php` | Returns public key PEM |
| `api/keys/get_group.php` | Returns user's encrypted group key |
| `api/keys/group_health.php` | Admin: checks group key coverage |

---

## Part 2 — E2E Encryption Upgrade (Phase N) — Private Key Protection via Password-Derived KEK

**Status:** PLANNED (not yet implemented)
**Version:** 1.0 — Date: 2026-03-27

### 2.1 Problem Statement

**Current vulnerability:** Private RSA keys are stored in plaintext in `users.private_key`. Database read access (SQL injection, backup leak, server breach) exposes all private keys and allows decryption of all messages.

**What this upgrade achieves:** Encrypt each user's private key with a KEK derived from their password via PBKDF2. The server stores only the encrypted blob. Without the user's password, the private key is unrecoverable.

**What this upgrade does NOT achieve:**
- Protection against a fully compromised server with code execution (server still receives raw password during login)
- Forward secrecy (private key compromise decrypts all historical messages)
- These are future phases (see §2.13)

### 2.2 Current Architecture Detail

**Key generation (server-side):** `includes/crypto_helper.php`, called from `api/auth/login.php`
- Server generates 2048-bit RSA keypair via OpenSSL
- Stores `public_key` (PEM) and `private_key` (PEM) in users table, both plaintext

**Key retrieval (client-side):** `assets/js/crypto.js`
- Client fetches plaintext private key PEM from `api/keys/get_private.php`
- Imports into WebCrypto (RSA-OAEP SHA-256 + SHA-1 legacy variant)

**Private chat text:** Client-side RSA-OAEP chunked encryption (190-byte chunks → 344-char base64)

**Group chat text:** Server-side key distribution reads private keys from DB to unwrap/re-wrap group keys for new members

**Media encryption:** Client-side AES-GCM with RSA-wrapped or group-key-wrapped per-message keys

### 2.3 Proposed Solution

**Core idea:** Encrypt the user's private key with a KEK derived from PBKDF2(password, salt). Server never sees the KEK.

**Registration flow (new):**
1. Client generates RSA-OAEP 2048-bit keypair via WebCrypto
2. Client generates random `kek_salt` (16 bytes)
3. Derives KEK = PBKDF2(password, kek_salt, 100k iterations, SHA-256, 256 bits)
4. Encrypts private key with AES-GCM using KEK
5. POSTs: username, password, public_key (PEM), encrypted_private_key (base64), kek_salt (base64)
6. Server stores encrypted blob; `private_key` column holds ciphertext, not PEM

**Login flow (new):**
1. Server verifies password via bcrypt (existing)
2. Client fetches encrypted_private_key + kek_salt
3. Client derives KEK from password, decrypts private key
4. All message crypto works as before

**Password change flow:**
1. Derive old KEK from old password + existing salt
2. Decrypt private key
3. Derive new KEK from new password + new salt
4. Re-encrypt private key
5. Server updates password hash + encrypted key + salt atomically

### 2.4 Crypto Primitives

| Primitive | Algorithm | Parameters |
|-----------|-----------|------------|
| KEK derivation | PBKDF2 | SHA-256, 100,000 iterations, 256-bit output |
| Private key encryption | AES-GCM | 256-bit key, 12-byte IV |
| KEK salt | Random bytes | 16 bytes |
| RSA keypair | RSA-OAEP | 2048-bit, SHA-256 hash |

**Storage format:** `Base64( iv[12 bytes] || AES-GCM-ciphertext || auth-tag[16 bytes] )`

**JS pseudocode — KEK derivation:**
```javascript
async function deriveKEK(password, kekSaltBase64) {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
        "raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]
    );
    const salt = base64ToUint8Array(kekSaltBase64);
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        passwordKey,
        { name: "AES-GCM", length: 256 },
        false, ["encrypt", "decrypt"]
    );
}
```

### 2.5 Flow Diagrams

**Registration:**
```
Browser                              Server                         Database
  |  1. User fills username+password   |                                |
  |  2. JS: generate RSA keypair       |                                |
  |  3. JS: KEK = PBKDF2(pw, salt)     |                                |
  |     enc_privkey = AES-GCM(key,KEK) |                                |
  |  POST: username, password,         |                                |
  |        public_key, enc_privkey,    |                                |
  |        kek_salt                    |                                |
  |  --------------------------------> |  4. bcrypt(password)           |
  |                                    |     INSERT users               |
  |                                    |  -----------------------------> |
  |  <---- session + redirect -------- |                                |
```

**Login + key retrieval:**
```
Browser                              Server                         Database
  |  POST: username, password          |                                |
  |  --------------------------------> |  1. bcrypt verify              |
  |  <---- session + redirect -------- |                                |
  |  GET api/keys/get_private.php      |                                |
  |  --------------------------------> |  2. Return enc_privkey + salt  |
  |  <-------------------------------- |                                |
  |  3. KEK = PBKDF2(pw, salt)         |                                |
  |     privkey = AES-GCM-decrypt(     |                                |
  |       enc_privkey, KEK)            |                                |
  |     Import → all crypto works      |                                |
```

### 2.6 Impact Analysis

**Zero impact (no changes needed):**
- Private text send/receive, private media, group text, group media, forwarding, reactions, replies, editing, stickers, voice, video, files, UI

**Affected components:**
- Registration (login.php + JS) — keypair generation moves to client
- Login (login.php + JS) — becomes AJAX; JS derives KEK + decrypts
- get_private.php — returns encrypted blob + salt instead of PEM
- crypto.js — add PBKDF2, keygen, key encrypt/decrypt functions
- group_crypto_helpers.php — remove server-side private key usage
- Group join/add flows — key distribution deferred to client-side
- Password change — must re-encrypt private key with new KEK

### 2.7 Database Changes

```sql
ALTER TABLE users ADD COLUMN kek_salt VARCHAR(64) DEFAULT NULL AFTER private_key;
ALTER TABLE users ADD COLUMN key_encryption_version TINYINT NOT NULL DEFAULT 0 AFTER kek_salt;
-- 0 = legacy (plaintext), 1 = KEK-encrypted

CREATE TABLE IF NOT EXISTS pending_group_key_distributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    target_user_id INT NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    distributed_at TIMESTAMP NULL DEFAULT NULL,
    distributed_by_user_id INT NULL DEFAULT NULL,
    UNIQUE KEY unique_pending (group_id, target_user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.8 File-by-File Change Map

**`assets/js/crypto.js` — ADD:**
- `deriveKEK(password, kekSaltBase64) → CryptoKey`
- `generateRsaKeyPair() → { publicKey, privateKey }`
- `exportPublicKeyAsPem(publicKey) → string`
- `encryptPrivateKeyForStorage(privateKey, kek) → base64`
- `decryptPrivateKeyFromStorage(encryptedBase64, kek) → CryptoKey`

**`assets/js/crypto.js` — MODIFY:**
- `fetchAndImportPrivateKey()` — dual-mode: derive KEK if v1, import plaintext + migrate if v0

**`api/auth/login.php` — MODIFY:**
- Registration: receive client-generated keys instead of server OpenSSL keygen
- Login: support AJAX JSON response for KEK derivation flow

**`api/keys/get_private.php` — MODIFY:**
- v1: return `{ encryptedPrivateKey, kekSalt, keyEncryptionVersion: 1 }`
- v0: return `{ privateKeyPem, keyEncryptionVersion: 0 }`

**NEW `api/keys/update_encrypted_private_key.php`:**
- POST, auth + CSRF; receives encrypted_private_key + kek_salt; updates to v1

**`includes/crypto_helper.php` — DEPRECATE:**
- `generate_rsa_keypair()` — client generates keys now
- `decrypt_message()` — server should never decrypt

**`includes/group_crypto_helpers.php` — MAJOR REFACTOR:**
- Remove `groupTryGetAnyDecryptableSharedKey()` and `groupDecryptSharedKeyForPrivateKey()`
- Replace `groupEnsureMemberHasSharedKey()` with pending distribution record
- Add `groupCreatePendingKeyDistribution()`, `groupGetPendingDistributions()`

**NEW `api/keys/distribute_group_key.php`:**
- POST: existing member submits wrapped group key for pending member

**NEW `api/keys/get_pending_distributions.php`:**
- GET: returns pending distributions for caller's groups

### 2.9 Group Key Distribution Refactor

**Current (server-side):** Server reads plaintext private key from DB → decrypts group key → re-encrypts for new member.

**New (client-side):**
1. Server adds member + creates pending distribution record
2. Adding client (or any online member) has decrypted group key in memory
3. Client fetches new member's public key, wraps group key
4. Client POSTs wrapped key to `api/keys/distribute_group_key.php`
5. Server stores in `group_member_keys`, marks pending as complete

**Edge cases:**
- No online member → pending persists until someone comes online and distributes
- Group creation → server wraps with creator's public key (no private key needed)
- Key health check → only checks counts, no private key usage

### 2.10 Migration Strategy

**Dual-mode:** System supports both v0 (legacy plaintext) and v1 (KEK-encrypted) simultaneously.

**Trigger:** On login, client fetches key. If `keyEncryptionVersion === 0`: import plaintext, generate salt, derive KEK, encrypt, POST to update endpoint. All transparent to user.

**Window:** Deploy with dual support → active users auto-migrate on next login → after 2-4 weeks, optionally force-migrate remaining → remove legacy code.

### 2.11 Implementation Steps (Summary)

1. Database migration (kek_salt, key_encryption_version, pending distributions table)
2. Add client-side crypto functions (PBKDF2, keygen, encrypt/decrypt key)
3. Create `api/keys/update_encrypted_private_key.php`
4. Modify `get_private.php` for dual-mode response
5. Modify `fetchAndImportPrivateKey()` for dual-mode
6. Add migration helper (`migratePrivateKeyToEncrypted`)
7. Convert login to AJAX (password availability for KEK derivation)
8. Modify registration for client-side keygen
9. Create group key distribution endpoints
10. Modify group join/add to use pending distributions
11. Add periodic pending distribution check in polling loop
12. Implement password change re-encryption
13. Clean up legacy code after full migration

### 2.12 Testing Checklist

**Registration:** Client-side keygen, encrypted storage, send/receive works immediately.
**Login + migration:** Legacy auto-migrates, re-login works, wrong password fails at bcrypt.
**Messages:** All private/group text/media flows unchanged.
**Group distribution:** Creator gets key, add/join creates pending, online members distribute.
**Security:** DB dump shows encrypted blob not PEM, no plaintext in API responses or logs.
**Password change:** Re-encryption works, old password no longer derives working KEK.
**Edge cases:** Browser back button, multiple tabs, session timeout, network errors during migration.

### 2.13 Security Considerations & Known Limitations

**Achieves:**
- DB-only breach protection (private keys encrypted at rest)
- Backup leak protection (backups useless without passwords)
- SQL injection read protection

**Does NOT achieve:**
- Server sees raw password (fix: split derivation — auth_hash + KEK from password, future phase)
- No forward secrecy (fix: Double Ratchet protocol, major future phase)
- No message authentication/signing (future phase)
- Group key not rotated on member removal (can implement alongside client-side distribution)

**PBKDF2 parameters:** 100,000 iterations (OWASP 2024 minimum). Store iteration count with salt for future increases.

### 2.14 Rollback Plan

1. **Partial:** Revert client changes; server still serves both v0/v1.
2. **Full:** Cannot server-side decrypt v1 keys (no passwords); users must log in with old client to migrate back.
3. **Safest:** Keep v0 support for at least one release cycle after migration.
4. **Pre-deployment:** Full backup of `users` table. Delete backup after migration confirmed stable.
