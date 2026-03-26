# E2E Encryption Upgrade — Private Key Protection via Password-Derived KEK

Version: 1.0
Date: 2026-03-27

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Current Encryption Architecture](#2-current-encryption-architecture)
3. [Proposed Solution](#3-proposed-solution)
4. [Crypto Primitives & Constants](#4-crypto-primitives--constants)
5. [Detailed Flow Diagrams](#5-detailed-flow-diagrams)
6. [Impact Analysis](#6-impact-analysis)
7. [Database Changes](#7-database-changes)
8. [File-by-File Change Map](#8-file-by-file-change-map)
9. [Group Key Distribution Refactor](#9-group-key-distribution-refactor)
10. [Migration Strategy](#10-migration-strategy)
11. [Step-by-Step Implementation Walkthrough](#11-step-by-step-implementation-walkthrough)
12. [Testing Checklist](#12-testing-checklist)
13. [Security Considerations & Known Limitations](#13-security-considerations--known-limitations)
14. [Rollback Plan](#14-rollback-plan)

---

## 1) Problem Statement

### Current vulnerability

Private RSA keys are stored **in plaintext** in the MySQL `users.private_key` column. If an attacker gains read access to the database (SQL injection, backup leak, server breach), they obtain every user's private key and can decrypt all historical and future messages.

### What this upgrade achieves

Encrypt each user's private key with a Key Encryption Key (KEK) derived from their password. The server stores only the encrypted blob. Without the user's password, the private key is unrecoverable — even with full database access.

### What this upgrade does NOT achieve

- Protection against a fully compromised server with code execution (the server still receives the raw password during login via the existing auth flow)
- Forward secrecy (compromise of a private key still decrypts all historical messages for that user)
- These are documented as potential future phases (see Section 13)

---

## 2) Current Encryption Architecture

Understanding the current system is essential before making changes. This section documents every crypto flow.

### 2.1 Key generation (server-side)

**File:** `includes/crypto_helper.php`
**Called from:** `api/auth/login.php` (registration branch, line ~78-103)

```
Registration:
  1. Server generates 2048-bit RSA keypair via OpenSSL
  2. Server stores public_key (PEM) and private_key (PEM) in users table
  3. Both stored as plaintext
```

### 2.2 Key retrieval (client-side)

**File:** `assets/js/crypto.js` (lines 86-99)

```
Session start:
  1. Client calls GET api/keys/get_private.php
  2. Server returns plaintext private key PEM
  3. Client imports into WebCrypto (RSA-OAEP SHA-256 + SHA-1 legacy variant)
  4. Cached in JS memory: privateKey, privateKeySha1
```

**File:** `assets/js/crypto.js` (lines 101-112)

```
Per-recipient:
  1. Client calls GET api/keys/get_public.php?username=X
  2. Server returns public key PEM
  3. Client imports and caches in publicKeyCache Map
```

### 2.3 Private chat text encryption

**File:** `assets/js/crypto.js` (lines 114-191)

```
Send:
  1. Client splits message into 190-byte UTF-8 chunks
  2. Each chunk encrypted with recipient's public key (RSA-OAEP SHA-256)
  3. Sender copy encrypted with sender's own public key
  4. Both ciphertexts POSTed to api/messages/send_text.php
  5. Server stores ciphertexts in messages.message and messages.message_for_sender

Receive:
  1. Client fetches ciphertext from API
  2. Splits into 344-char base64 chunks
  3. Each chunk decrypted with client's private key
  4. Plaintext assembled and rendered
```

### 2.4 Group chat text encryption

**File:** `assets/js/crypto.js` (lines 193-393)

```
Key distribution (SERVER-SIDE — this is what changes):
  File: includes/group_crypto_helpers.php

  1. Server generates 256-bit AES group key (random_bytes(32))
  2. For each member: server encrypts group key with member's PUBLIC key (RSA PKCS1 OAEP)
  3. Stored in group_member_keys table: (group_id, user_id, encrypted_group_key)
  4. On new member join/add: server decrypts group key using ANY existing member's
     PRIVATE KEY from DB, then re-encrypts for new member

Send/Receive (client-side — unchanged):
  1. Client fetches own encrypted_group_key from api/keys/get_group.php
  2. Client decrypts group key with own private key (RSA-OAEP)
  3. Messages encrypted/decrypted with AES-GCM: gcm1:<iv_b64>:<cipher_b64>
```

### 2.5 Private media encryption

**File:** `assets/js/crypto.js` (lines 204-356)

```
Send (client-side):
  1. Generate fresh AES-GCM 256-bit key per message
  2. Encrypt binary payload (voice/image/video/file) with AES-GCM (12-byte IV prepended)
  3. Encrypt metadata (filename, MIME, size) with same key: mmd1:<iv>:<cipher>
  4. Wrap AES key for recipient with recipient's public key (RSA-OAEP)
  5. Wrap AES key for sender with sender's public key
  6. Build envelope: {"v":"med1","k":"<wrapped_key>","m":"<encrypted_meta>","kv":1}
  7. Upload encrypted blob + envelope to server

Receive (client-side):
  1. Parse med1 envelope from message row
  2. Unwrap AES key with own private key
  3. Decrypt metadata
  4. Fetch encrypted blob from server
  5. Decrypt blob with AES key
  6. Render/play/download
```

### 2.6 Group media encryption

Same as private media, except the per-message AES key is wrapped with the group AES key instead of RSA public keys.

### 2.7 Files involved in current crypto

| File | Role |
|------|------|
| `includes/crypto_helper.php` | Server-side RSA keygen + decrypt |
| `includes/group_crypto_helpers.php` | Server-side group key distribution (reads private keys from DB) |
| `assets/js/crypto.js` | All client-side crypto (RSA, AES-GCM, key wrapping, envelope) |
| `api/auth/login.php` | Registration: calls OpenSSL keygen, stores keys |
| `api/keys/get_private.php` | Returns plaintext private key PEM |
| `api/keys/get_public.php` | Returns public key PEM |
| `api/keys/get_group.php` | Returns user's encrypted group key (calls groupEnsureMemberHasSharedKey) |
| `api/groups/create.php` | Calls groupEnsureMemberHasSharedKey for creator |
| `api/groups/add_member.php` | Calls groupEnsureMemberHasSharedKey for new member |
| `api/groups/join.php` | Calls groupEnsureMemberHasSharedKey for joining member |
| `api/keys/group_health.php` | Admin: checks group key coverage |

---

## 3) Proposed Solution

### Core idea

Encrypt the user's private key with a Key Encryption Key (KEK) derived from their password using PBKDF2. The server never sees the KEK — it only stores the encrypted private key blob, the PBKDF2 salt, and the IV used for AES-GCM encryption.

### Registration flow (new)

```
Client:
  1. Generate RSA-OAEP 2048-bit keypair via WebCrypto
  2. Generate random kek_salt (16 bytes)
  3. Derive KEK = PBKDF2(password, kek_salt, 100000 iterations, SHA-256, 256 bits)
  4. Generate random iv (12 bytes)
  5. encrypted_private_key = AES-GCM-encrypt(private_key_pkcs8_bytes, KEK, iv)
  6. Export public key as SPKI PEM

Client → Server (POST):
  - username, password (for auth hash)
  - public_key (PEM, plaintext — this is public)
  - encrypted_private_key (base64 of iv + ciphertext)
  - kek_salt (base64)

Server:
  - password_hash = bcrypt(password) — for authentication
  - Store: public_key, encrypted_private_key, kek_salt
  - private_key column: NULL (no longer used for plaintext)
```

### Login flow (new)

```
Server:
  1. Verify password via bcrypt (existing flow)
  2. Set session (existing flow)

Client (after login, on dashboard load):
  1. Fetch encrypted_private_key + kek_salt from api/keys/get_private.php
  2. Derive KEK = PBKDF2(password, kek_salt, 100000, SHA-256, 256)
     Note: password is still in the login form / available in JS at this point
  3. Decrypt private key with KEK (AES-GCM)
  4. Import into WebCrypto — use exactly as today
  5. Discard KEK and password from memory
```

### Password change flow (new requirement)

```
Client:
  1. Derive old_kek from old_password + existing kek_salt
  2. Decrypt private key with old_kek
  3. Generate new kek_salt
  4. Derive new_kek from new_password + new_kek_salt
  5. Re-encrypt private key with new_kek
  6. POST: new_password_hash, new_encrypted_private_key, new_kek_salt to server
  7. Server updates all three fields atomically
```

---

## 4) Crypto Primitives & Constants

| Primitive | Algorithm | Parameters |
|-----------|-----------|------------|
| KEK derivation | PBKDF2 | SHA-256, 100,000 iterations, 256-bit output |
| Private key encryption | AES-GCM | 256-bit key, 12-byte IV, no additional data |
| KEK salt | Random bytes | 16 bytes, generated once per registration (or password change) |
| RSA keypair | RSA-OAEP | 2048-bit, SHA-256 hash (matches current) |

### Encrypted private key storage format

```
Base64( iv[12 bytes] || AES-GCM-ciphertext || auth-tag[16 bytes] )
```

The IV is prepended to the ciphertext, same pattern as the existing `encryptBinaryWithAesKey()` in `crypto.js` (line 248-260). This keeps the format consistent with the rest of the codebase.

### JS pseudocode for KEK derivation

```javascript
async function deriveKEK(password, kekSaltBase64) {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    const salt = base64ToUint8Array(kekSaltBase64);
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        passwordKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}
```

### JS pseudocode for private key encryption/decryption

```javascript
async function encryptPrivateKeyForStorage(privateKeyCryptoKey, kek) {
    // Export private key as PKCS8 raw bytes
    const pkcs8Bytes = await crypto.subtle.exportKey("pkcs8", privateKeyCryptoKey);
    // Encrypt with KEK (reuse existing encryptBinaryWithAesKey pattern)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        kek,
        pkcs8Bytes
    );
    // Prepend IV (same format as media encryption)
    const cipherBytes = new Uint8Array(encrypted);
    const payload = new Uint8Array(iv.length + cipherBytes.length);
    payload.set(iv, 0);
    payload.set(cipherBytes, iv.length);
    return uint8ArrayToBase64(payload);
}

async function decryptPrivateKeyFromStorage(encryptedBase64, kek) {
    const encryptedBytes = base64ToUint8Array(encryptedBase64);
    const iv = encryptedBytes.slice(0, 12);
    const cipherBytes = encryptedBytes.slice(12);
    const pkcs8Bytes = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        kek,
        cipherBytes
    );
    // Import as RSA-OAEP private key (same as current importRsaPrivateKey but from raw bytes)
    return crypto.subtle.importKey(
        "pkcs8",
        pkcs8Bytes,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,  // extractable: true (needed for export to SHA-1 variant)
        ["decrypt"]
    );
}
```

---

## 5) Detailed Flow Diagrams

### 5.1 Registration

```
  Browser                              Server                         Database
    |                                    |                                |
    |  1. User fills username+password   |                                |
    |                                    |                                |
    |  2. JS: generate RSA keypair       |                                |
    |     (WebCrypto, 2048-bit)          |                                |
    |                                    |                                |
    |  3. JS: kek_salt = randomBytes(16) |                                |
    |     KEK = PBKDF2(pw, salt)         |                                |
    |     enc_privkey = AES-GCM(privkey, |                                |
    |                           KEK, iv) |                                |
    |                                    |                                |
    |  POST: username, password,         |                                |
    |        public_key (PEM),           |                                |
    |        encrypted_private_key (b64),|                                |
    |        kek_salt (b64)              |                                |
    |  --------------------------------> |                                |
    |                                    |  4. bcrypt(password)           |
    |                                    |     INSERT users: username,    |
    |                                    |       password_hash,           |
    |                                    |       public_key,              |
    |                                    |       encrypted_private_key,   |
    |                                    |       kek_salt                 |
    |                                    |  -----------------------------> |
    |                                    |                                |
    |                                    |  5. Set session, ident         |
    |  <-------------------------------- |                                |
    |  Redirect to dashboard             |                                |
```

### 5.2 Login + private key retrieval

```
  Browser                              Server                         Database
    |                                    |                                |
    |  POST: username, password          |                                |
    |  --------------------------------> |                                |
    |                                    |  1. Fetch user row             |
    |                                    |  <-----------------------------|
    |                                    |  2. bcrypt verify password     |
    |                                    |  3. Set session, redirect      |
    |  <-------------------------------- |                                |
    |                                    |                                |
    |  (dashboard loads, JS executes)    |                                |
    |                                    |                                |
    |  GET api/keys/get_private.php      |                                |
    |  --------------------------------> |                                |
    |                                    |  4. Return encrypted_private   |
    |                                    |     _key + kek_salt            |
    |  <-------------------------------- |                                |
    |                                    |                                |
    |  5. JS: KEK = PBKDF2(pw, salt)     |                                |
    |     privkey = AES-GCM-decrypt(     |                                |
    |       encrypted_private_key, KEK)  |                                |
    |     Import into WebCrypto          |                                |
    |                                    |                                |
    |  6. All message crypto works       |                                |
    |     exactly as before              |                                |
```

### 5.3 Password availability on dashboard

The login form POSTs to `api/auth/login.php` which redirects to `dashboard.php`. The password is no longer in JS memory after the redirect. To solve this:

**Option A (simplest):** Change login to an AJAX call. On success, JS still has the password in memory, immediately fetches encrypted private key, derives KEK, decrypts, then discards password and navigates to dashboard.

**Option B:** Store password temporarily in `sessionStorage` during the login→dashboard redirect, use it once for KEK derivation, then immediately delete it. `sessionStorage` is tab-scoped and cleared on tab close.

**Option A is recommended** — it avoids storing the password in any persistent storage, even briefly.

### 5.4 Group key distribution (new client-side flow)

See Section 9 for full details.

---

## 6) Impact Analysis

### Zero impact (no changes needed)

| Feature | Why unaffected |
|---------|----------------|
| Private text send/receive | RSA-OAEP encrypt/decrypt already client-side (crypto.js:114-191) |
| Private media send/receive | AES-GCM + RSA wrapping already client-side (crypto.js:228-281) |
| Group text send/receive | AES-GCM encrypt/decrypt already client-side (crypto.js:358-393) |
| Group media send/receive | Media key wrapping with group key already client-side (crypto.js:238-246) |
| Message forwarding | Uses same encrypt/decrypt paths |
| Reactions, replies, editing | Metadata or same crypto paths |
| Stickers, voice, video, files | All use media encryption path (client-side) |
| UI, animations, features | No crypto involvement |

### Affected components

| Component | Nature of change |
|-----------|-----------------|
| Registration (login.php + JS) | Keypair generation moves to client; server receives encrypted key |
| Login (login.php + JS) | Login becomes AJAX; JS derives KEK + decrypts private key |
| get_private.php | Returns encrypted blob + salt instead of PEM |
| crypto.js | Add: PBKDF2 derivation, keypair generation, key encrypt/decrypt |
| group_crypto_helpers.php | Remove server-side private key usage; add client-side distribution endpoint |
| Group join/add flows | Key distribution deferred to client-side |
| Password change | Must re-encrypt private key with new KEK |

### Performance impact

| Operation | Change | User-visible? |
|-----------|--------|--------------|
| Registration | +500-1000ms (client RSA keygen + PBKDF2) | Barely — one-time, during "creating account" |
| Login | +200-400ms (PBKDF2 derivation + AES-GCM decrypt) | Minimal — before dashboard loads |
| Every message operation | Zero change | No |
| Group member join | Slight delay until online member distributes key | Possible brief wait |

---

## 7) Database Changes

### Migration SQL

```sql
-- Add kek_salt column for PBKDF2 salt storage
ALTER TABLE users ADD COLUMN kek_salt VARCHAR(64) DEFAULT NULL AFTER private_key;

-- Add flag to distinguish migrated vs legacy accounts
ALTER TABLE users ADD COLUMN key_encryption_version TINYINT NOT NULL DEFAULT 0 AFTER kek_salt;
-- 0 = legacy (plaintext private key)
-- 1 = KEK-encrypted private key

-- Add pending_group_key_distributions table for client-side group key distribution
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

### Column semantics after migration

| Column | Legacy (v0) | Upgraded (v1) |
|--------|-------------|---------------|
| `private_key` | Plaintext PEM | Base64(iv + AES-GCM ciphertext) |
| `kek_salt` | NULL | Base64(16 random bytes) |
| `key_encryption_version` | 0 | 1 |
| `public_key` | PEM (unchanged) | PEM (unchanged) |

---

## 8) File-by-File Change Map

### `assets/js/crypto.js` — ADD functions

```
+ deriveKEK(password, kekSaltBase64) → CryptoKey
+ generateRsaKeyPair() → { publicKey, privateKey }
+ exportPublicKeyAsPem(publicKey) → string
+ encryptPrivateKeyForStorage(privateKey, kek) → base64 string
+ decryptPrivateKeyFromStorage(encryptedBase64, kek) → CryptoKey
```

### `assets/js/crypto.js` — MODIFY functions

```
~ fetchAndImportPrivateKey()
  Before: fetch PEM → import
  After:  fetch encrypted blob + salt → derive KEK from password → decrypt → import
  Note:   password must be passed as parameter or available in closure
```

### `assets/js/chat.js` or new `assets/js/auth.js` — MODIFY registration

```
~ Registration submit handler
  Before: POST username + password (server generates keys)
  After:  JS generates keypair, derives KEK, encrypts private key,
          POST username + password + public_key + encrypted_private_key + kek_salt
```

### `assets/js/chat.js` — MODIFY login

```
~ Login submit handler
  Before: Standard form POST → redirect
  After:  AJAX POST → on success, fetch encrypted key, derive KEK, decrypt,
          cache in memory, then navigate to dashboard
```

### `api/auth/login.php` — MODIFY

```
~ Registration branch (new user):
  Before: Server generates RSA keypair, stores plaintext
  After:  Receive public_key, encrypted_private_key, kek_salt from client
          Validate all three are present and non-empty
          Store in DB with key_encryption_version = 1
          Remove OpenSSL keygen code

~ Login branch (existing user):
  Before: Just set session + redirect
  After:  Same — but also support AJAX response (JSON) when Accept: application/json
          Return success JSON instead of redirect when called via AJAX

~ Migration support:
  If key_encryption_version = 0, server still sends plaintext private key
  Client detects this, derives KEK, encrypts, POSTs back the encrypted version
  Server updates DB to v1
```

### `api/keys/get_private.php` — MODIFY

```
~ Before: Return { privateKeyPem: "<plaintext PEM>" }
~ After:  Return { encryptedPrivateKey: "<base64 blob>", kekSalt: "<base64>", keyEncryptionVersion: 1 }
         (or for legacy: { privateKeyPem: "<PEM>", keyEncryptionVersion: 0 })
```

### NEW: `api/keys/update_encrypted_private_key.php`

```
+ POST endpoint for migration and password change
+ Receives: encrypted_private_key, kek_salt
+ Requires: auth + CSRF
+ Updates users table with new encrypted key, salt, key_encryption_version = 1
```

### `includes/crypto_helper.php` — REMOVE/DEPRECATE

```
- generate_rsa_keypair() — no longer needed (client generates keys)
- decrypt_message() — server should never decrypt messages
  Keep file but mark functions as deprecated during migration period
  Remove entirely after migration complete
```

### `includes/group_crypto_helpers.php` — MAJOR REFACTOR

```
- groupTryGetAnyDecryptableSharedKey() — reads private keys from DB, must be removed
- groupDecryptSharedKeyForPrivateKey() — uses plaintext private key, must be removed
~ groupEnsureMemberHasSharedKey() — replace with pending distribution record
~ groupStoreEncryptedSharedKeyForMember() — keep, but called from new client endpoint
+ New function: groupCreatePendingKeyDistribution()
+ New function: groupGetPendingDistributions()
```

### NEW: `api/keys/distribute_group_key.php`

```
+ POST endpoint: existing member submits wrapped group key for a pending member
+ Receives: group_id, target_user_id, encrypted_group_key
+ Requires: auth + CSRF + caller must be group member
+ Stores wrapped key in group_member_keys
+ Marks pending distribution as complete
```

### NEW: `api/keys/get_pending_distributions.php`

```
+ GET endpoint: returns pending group key distributions for groups the caller belongs to
+ Client polls this (or checks on group load) and distributes keys as needed
```

### `api/groups/create.php` — MODIFY

```
~ Group key generation stays server-side (it's a random AES key, not derived from private keys)
~ But wrapping for creator must happen client-side
~ Server generates raw group key, wraps it for creator using creator's PUBLIC key (this already works)
~ Actually: groupEncryptSharedKeyForPublicKey() only uses public keys — NO CHANGE NEEDED for creator
~ Problem is only when distributing to OTHER members (see Section 9)
```

### `api/groups/add_member.php` — MODIFY

```
~ Remove: groupEnsureMemberHasSharedKey() call (server can't do this anymore)
~ Add: groupCreatePendingKeyDistribution() — record that this member needs a key
~ Client-side: after adding member, caller's client distributes the key immediately
```

### `api/groups/join.php` — MODIFY

```
~ Remove: groupEnsureMemberHasSharedKey() call
~ Add: groupCreatePendingKeyDistribution()
~ The joining user's client (or any online member) distributes the key
```

---

## 9) Group Key Distribution Refactor

This is the most complex part of the upgrade. Currently, the server can decrypt any member's group key (because it has plaintext private keys) and re-encrypt it for a new member. After the upgrade, only clients can do this.

### Current flow (server-side)

```
groupEnsureMemberHasSharedKey($pdo, $groupId, $userId):
  1. Check if member already has key → return if yes
  2. groupTryGetAnyDecryptableSharedKey():
     - Iterate through ALL members' (encrypted_group_key, private_key) pairs
     - Decrypt group key using a member's PLAINTEXT private key     ← breaks after upgrade
  3. groupEncryptSharedKeyForPublicKey(rawGroupKey, newMember.publicKey)
  4. Store in group_member_keys
```

### New flow (client-side)

```
When a new member joins/is added:
  1. Server adds member to group_members table
  2. Server creates row in pending_group_key_distributions
  3. Server returns success response with pending_key_distribution: true

  4. The adding client (or any online group member) sees pending distribution
  5. Client already has the decrypted group key in memory (from own group_member_keys)
  6. Client fetches new member's public key via api/keys/get_public.php
  7. Client wraps group key for new member (RSA-OAEP via wrapMediaKeyForPublicKey)
  8. Client POSTs wrapped key to api/keys/distribute_group_key.php
  9. Server stores in group_member_keys, marks pending as complete
```

### Edge case: no online member to distribute

If the adding client goes offline before distributing, the key remains pending. Resolution:

- When any group member's client loads the group, it checks for pending distributions
- The first online member who has the group key distributes it
- Poll `api/keys/get_pending_distributions.php` on group load or periodic fetch

### Edge case: group creation

No issue. When creating a group:
1. Server generates random group AES key
2. Server wraps it with creator's PUBLIC key (groupEncryptSharedKeyForPublicKey — uses public key only)
3. This function does NOT need private keys, so it still works

### Edge case: key health check

`api/keys/group_health.php` currently doesn't use private keys — it only checks counts and missing members. No change needed.

---

## 10) Migration Strategy

### Dual-mode support

The system must support both legacy (v0) and upgraded (v1) accounts simultaneously during the migration window.

### Migration trigger

On login, after session is established:

```
1. Client fetches api/keys/get_private.php
2. Response includes keyEncryptionVersion field

If keyEncryptionVersion === 0 (legacy):
  a. Server sent plaintext PEM (old behavior)
  b. Client imports private key (current flow)
  c. Client generates kek_salt, derives KEK from password
  d. Client encrypts private key with KEK
  e. Client POSTs encrypted_private_key + kek_salt to api/keys/update_encrypted_private_key.php
  f. Server updates DB: private_key = encrypted blob, kek_salt = salt, key_encryption_version = 1
  g. Migration complete for this user

If keyEncryptionVersion === 1 (upgraded):
  a. Server sent encrypted blob + salt
  b. Client derives KEK from password, decrypts, imports
  c. Normal flow
```

### Migration window

- Deploy code with dual support
- All active users migrate on their next login (automatic, transparent)
- After sufficient time (e.g., 2-4 weeks), optionally force-migrate remaining accounts via admin action
- Remove legacy code path after all accounts are at v1

---

## 11) Step-by-Step Implementation Walkthrough

This section is a sequential guide for implementing the upgrade. Each step builds on the previous.

### Step 1: Database migration

Create migration file `migrations/XX_add_kek_support.sql`:

```sql
ALTER TABLE users ADD COLUMN kek_salt VARCHAR(64) DEFAULT NULL AFTER private_key;
ALTER TABLE users ADD COLUMN key_encryption_version TINYINT NOT NULL DEFAULT 0 AFTER kek_salt;

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

Run this migration. All existing users start with `key_encryption_version = 0`.

### Step 2: Add client-side crypto functions

In `assets/js/crypto.js`, add these new functions (see Section 4 for pseudocode):

1. `deriveKEK(password, kekSaltBase64)` — PBKDF2 key derivation
2. `generateRsaKeyPair()` — WebCrypto RSA-OAEP 2048-bit keygen
3. `exportPublicKeyAsPem(publicKeyCryptoKey)` — export as SPKI PEM string
4. `exportPrivateKeyAsPkcs8(privateKeyCryptoKey)` — export as PKCS8 bytes
5. `encryptPrivateKeyForStorage(privateKeyCryptoKey, kek)` — encrypt with KEK
6. `decryptPrivateKeyFromStorage(encryptedBase64, kek)` — decrypt with KEK

### Step 3: Create the key update endpoint

Create `api/keys/update_encrypted_private_key.php`:

- POST, requires auth + CSRF
- Receives: `encrypted_private_key` (base64), `kek_salt` (base64)
- Validates both are non-empty strings
- Updates `users` SET `private_key` = ?, `kek_salt` = ?, `key_encryption_version` = 1

### Step 4: Modify get_private.php for dual-mode

Modify `api/keys/get_private.php`:

```php
// Fetch private_key, kek_salt, key_encryption_version
if ($user['key_encryption_version'] == 1) {
    apiSuccess([
        'encryptedPrivateKey' => $user['private_key'],
        'kekSalt' => $user['kek_salt'],
        'keyEncryptionVersion' => 1,
    ]);
} else {
    // Legacy — send plaintext for migration
    apiSuccess([
        'privateKeyPem' => $user['private_key'],
        'keyEncryptionVersion' => 0,
    ]);
}
```

### Step 5: Modify fetchAndImportPrivateKey() for dual-mode

In `crypto.js`, modify `fetchAndImportPrivateKey()`:

```javascript
async function fetchAndImportPrivateKey(password) {
    const data = await fetchApiJson("api/keys/get_private.php");

    if (data.keyEncryptionVersion === 1) {
        // Upgraded account — derive KEK, decrypt
        const kek = await deriveKEK(password, data.kekSalt);
        privateKey = await decryptPrivateKeyFromStorage(data.encryptedPrivateKey, kek);
        privateKeySha1 = /* re-import same PKCS8 bytes with SHA-1 hash */;
    } else {
        // Legacy account — import plaintext, then migrate
        privateKey = await importRsaPrivateKey(data.privateKeyPem);
        privateKeySha1 = await importRsaPrivateKeySha1(data.privateKeyPem);
        await migratePrivateKeyToEncrypted(password);
    }
    return privateKey;
}
```

Note: `fetchAndImportPrivateKey` now requires the password as parameter. This means the calling code must pass the password — see Step 7.

### Step 6: Add migration helper

```javascript
async function migratePrivateKeyToEncrypted(password) {
    const kekSaltBytes = crypto.getRandomValues(new Uint8Array(16));
    const kekSalt = uint8ArrayToBase64(kekSaltBytes);
    const kek = await deriveKEK(password, kekSalt);
    const encryptedPrivateKey = await encryptPrivateKeyForStorage(privateKey, kek);

    await fetchApiJson("api/keys/update_encrypted_private_key.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
        body: JSON.stringify({ encrypted_private_key: encryptedPrivateKey, kek_salt: kekSalt }),
    });
}
```

### Step 7: Convert login to AJAX (for password availability)

This is the key UX change. Currently `index.php` has a `<form>` that POSTs to `api/auth/login.php` and redirects. Change to:

**index.php (JS):**
```javascript
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    const resp = await fetch("api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password, csrf_token: csrfToken }),
    });

    const result = await resp.json();
    if (result.status === "error") {
        showLoginError(result.error);
        return;
    }

    // For existing users: password still in memory, store temporarily for KEK derivation
    sessionStorage.setItem("_kek_pw", password);
    window.location.href = result.redirect || "dashboard.php";
});
```

**api/auth/login.php:**
- Add JSON response support: when request has `Accept: application/json` or `X-Requested-With: XMLHttpRequest`, return JSON instead of redirect
- Registration branch: accept `public_key`, `encrypted_private_key`, `kek_salt` from client instead of generating keys server-side

**dashboard.php (JS, on load):**
```javascript
const tempPassword = sessionStorage.getItem("_kek_pw");
sessionStorage.removeItem("_kek_pw");  // immediately delete
if (tempPassword) {
    await fetchAndImportPrivateKey(tempPassword);
    // tempPassword goes out of scope, eligible for GC
}
```

### Step 8: Modify registration to generate keys client-side

In `index.php` (or wherever the registration form lives):

```javascript
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Generate keypair client-side
    const keyPair = await generateRsaKeyPair();
    const publicKeyPem = await exportPublicKeyAsPem(keyPair.publicKey);

    // Derive KEK and encrypt private key
    const kekSaltBytes = crypto.getRandomValues(new Uint8Array(16));
    const kekSalt = uint8ArrayToBase64(kekSaltBytes);
    const kek = await deriveKEK(password, kekSalt);
    const encryptedPrivateKey = await encryptPrivateKeyForStorage(keyPair.privateKey, kek);

    const resp = await fetch("api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username, password, csrf_token: csrfToken,
            public_key: publicKeyPem,
            encrypted_private_key: encryptedPrivateKey,
            kek_salt: kekSalt,
        }),
    });

    const result = await resp.json();
    if (result.status === "error") {
        showError(result.error);
        return;
    }

    // Private key already in memory, cache it
    privateKey = keyPair.privateKey;
    window.location.href = "dashboard.php";
});
```

### Step 9: Create group key distribution endpoints

**`api/keys/get_pending_distributions.php`** (GET):
- Returns pending distributions for groups the caller belongs to
- Query: `SELECT * FROM pending_group_key_distributions WHERE group_id IN (user's groups) AND distributed_at IS NULL`

**`api/keys/distribute_group_key.php`** (POST):
- Receives: `group_id`, `target_user_id`, `encrypted_group_key` (wrapped for target's public key)
- Validates: caller is a member of the group
- Stores wrapped key in `group_member_keys`
- Updates `pending_group_key_distributions` SET `distributed_at` = NOW(), `distributed_by_user_id` = caller

### Step 10: Modify group join/add to use pending distributions

In `api/groups/add_member.php` and `api/groups/join.php`:

```php
// Replace:
groupEnsureMemberHasSharedKey($pdo, $groupId, $targetUserId);

// With:
$pendingStmt = $pdo->prepare(
    'INSERT IGNORE INTO pending_group_key_distributions (group_id, target_user_id)
     VALUES (?, ?)'
);
$pendingStmt->execute([$groupId, $targetUserId]);
```

In the client JS, after a successful add_member or join response:

```javascript
// If caller has the group key, distribute immediately
if (groupKeyCache.has(groupId)) {
    const groupKey = groupKeyCache.get(groupId);
    const targetPublicKey = await getPublicKey(targetUsername);
    const wrappedKey = await wrapMediaKeyForPublicKey(groupKey, targetPublicKey);
    await ApiService.json("api/keys/distribute_group_key.php", {
        method: "POST",
        body: JSON.stringify({ group_id: groupId, target_user_id: targetUserId, encrypted_group_key: wrappedKey }),
    });
}
```

### Step 11: Add periodic pending distribution check

In the message polling loop or on group load, check for pending distributions:

```javascript
async function checkAndDistributePendingGroupKeys() {
    const data = await fetchApiJson("api/keys/get_pending_distributions.php");
    for (const pending of data.pending || []) {
        if (groupKeyCache.has(pending.group_id)) {
            const groupKey = groupKeyCache.get(pending.group_id);
            const targetPublicKey = await getPublicKey(pending.target_username);
            const wrappedKey = await wrapMediaKeyForPublicKey(groupKey, targetPublicKey);
            await ApiService.json("api/keys/distribute_group_key.php", {
                method: "POST",
                body: JSON.stringify({
                    group_id: pending.group_id,
                    target_user_id: pending.target_user_id,
                    encrypted_group_key: wrappedKey,
                }),
            });
        }
    }
}
```

### Step 12: Implement password change re-encryption

If a password change feature exists or is added, it must re-encrypt the private key:

```javascript
async function changePassword(oldPassword, newPassword) {
    // 1. Derive old KEK and verify it works (decrypt private key)
    // 2. Generate new kek_salt
    // 3. Derive new KEK from new password
    // 4. Re-encrypt private key with new KEK
    // 5. POST: new password hash + new encrypted_private_key + new kek_salt
    // 6. Server updates all atomically
}
```

### Step 13: Clean up legacy code

After all users have migrated (key_encryption_version = 1):

1. Remove `generate_rsa_keypair()` from `includes/crypto_helper.php`
2. Remove `decrypt_message()` from `includes/crypto_helper.php`
3. Remove `groupTryGetAnyDecryptableSharedKey()` from `includes/group_crypto_helpers.php`
4. Remove `groupDecryptSharedKeyForPrivateKey()` from `includes/group_crypto_helpers.php`
5. Remove legacy branch from `fetchAndImportPrivateKey()`
6. Remove legacy branch from `api/keys/get_private.php`
7. Remove `migratePrivateKeyToEncrypted()` from client
8. Optionally: drop `key_encryption_version` column (all rows are 1)

---

## 12) Testing Checklist

### Registration tests
- [ ] New account creates keypair client-side (no server OpenSSL call)
- [ ] encrypted_private_key and kek_salt stored in DB (not plaintext PEM)
- [ ] key_encryption_version = 1 for new accounts
- [ ] User can send/receive private messages immediately after registration
- [ ] User can create a group and send group messages after registration

### Login + migration tests
- [ ] Legacy user (v0) logs in: receives plaintext key, auto-migrates to v1
- [ ] After migration: DB has encrypted_private_key + kek_salt, key_encryption_version = 1
- [ ] Migrated user logs out, logs back in: KEK derivation works, all messages readable
- [ ] Migrated user on new browser/device: same — all messages readable
- [ ] Wrong password: login fails at bcrypt step (before KEK derivation)

### Message tests (must all pass unchanged)
- [ ] Private text: send, receive, decrypt old messages
- [ ] Private media: send/receive voice, image, video, file
- [ ] Group text: send, receive, decrypt old group messages
- [ ] Group media: send/receive voice, image, video, file in group
- [ ] Forwarding: private→private, private→group, group→private, group→group
- [ ] Reply, edit, delete: all work with encrypted content
- [ ] Message search: works (if client-side search over decrypted content)

### Group key distribution tests
- [ ] Create group: creator gets key immediately (server wraps with public key)
- [ ] Add member: pending distribution created, caller's client distributes immediately
- [ ] Join via link: pending distribution created, distributed by first online member
- [ ] Member joins while all other members offline: pending persists, distributed when someone comes online
- [ ] Multiple pending distributions: all resolved correctly

### Security validation tests
- [ ] DB dump: private_key column contains encrypted blob, not PEM
- [ ] DB dump: kek_salt alone cannot derive KEK (needs password)
- [ ] Plaintext private key no longer appears in any API response (for v1 users)
- [ ] Server logs: no private key or KEK in access/error logs
- [ ] sessionStorage._kek_pw is deleted immediately after use

### Password change tests
- [ ] Change password: private key re-encrypted with new KEK
- [ ] Old password no longer derives working KEK
- [ ] New password derives working KEK, all messages still readable
- [ ] Private key itself is unchanged (same RSA key, different encryption wrapper)

### Edge case tests
- [ ] Browser back button after login: doesn't re-POST credentials
- [ ] Multiple tabs: each tab can independently derive KEK and decrypt
- [ ] Session timeout + re-login: works correctly
- [ ] Very long password: PBKDF2 handles it (no truncation)
- [ ] Network error during migration POST: legacy key still works, migration retries next login

---

## 13) Security Considerations & Known Limitations

### What this upgrade achieves
- **DB-only breach protection**: Attacker with read access to database cannot recover private keys without user passwords
- **Backup leak protection**: Database backups are useless for message decryption
- **SQL injection read protection**: Even if an attacker can read arbitrary DB rows, private keys are encrypted

### What this upgrade does NOT achieve

#### Server sees raw password (Phase 2 fix)
The server still receives the plaintext password during login (`password_verify()`). A compromised server with code execution could intercept passwords and derive KEKs. The fix is split derivation:

```
Client derives two values from password:
  auth_hash = PBKDF2(password, auth_salt)   → sent to server
  kek       = PBKDF2(password, kek_salt)    → never sent
```

This requires changing the auth flow entirely (server stores bcrypt of auth_hash, not password). Recommended as a future phase.

#### No forward secrecy
Compromise of a user's private key (via password breach) decrypts all historical messages. Fix: Double Ratchet protocol (Signal-like). Major architectural change, future phase.

#### No message authentication
Messages are encrypted but not signed. A server could theoretically forge messages. Fix: Digital signatures on messages. Future phase.

#### Group key not rotated on member removal
When a member is removed from a group, they retain the ability to decrypt messages sent with the current group key. Fix: Rotate group key on member removal, re-distribute to remaining members. Can be implemented alongside the client-side distribution mechanism.

### PBKDF2 iteration count
100,000 iterations is the recommended minimum as of 2024 (OWASP). This can be increased in the future by re-encrypting the private key with a higher iteration count on login. Store the iteration count alongside kek_salt for forward compatibility.

---

## 14) Rollback Plan

If issues are discovered after deployment:

1. **Partial rollback (keep dual-mode)**: Revert client changes, server still serves both v0 and v1. Migrated users are stuck until client code is re-deployed.

2. **Full rollback (re-decrypt all keys)**: Run a one-time admin script that:
   - For each user with key_encryption_version = 1: this cannot be done server-side (server doesn't have passwords)
   - Therefore: full rollback requires users to log in with the old client code to migrate back

3. **Safest approach**: Keep the legacy code path (v0 support) for at least one full release cycle after migration. Only remove it when confident all accounts are stable at v1.

### Pre-deployment backup
Before running the migration SQL, take a full backup of the `users` table. This preserves the plaintext private keys as a safety net during the transition period. **Delete this backup** after confirming all migrations are successful and stable.
