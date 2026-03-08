# TinTinChat Encryption Reference

Last updated: 2026-03-08

This single document consolidates the previous per-case encryption docs and policy notes.

## 1) Overview

- Private text: RSA-OAEP chunked encryption (recipient + sender copies).
- Group text: shared group AES-GCM key (`gcm1:<iv>:<cipher>`).
- Private/group media (`image`, `voice`, `file`): per-message AES media key + envelope `med1`.
- Server stores encrypted blobs and encrypted envelope fields; decrypt happens client-side.

## 2) Envelope Formats

### Group text (`gcm1`)

- Payload format: `gcm1:<iv_b64>:<cipher_b64>`
- Stored in both `messages.message` and `messages.message_for_sender` for group rows.

### Media envelope (`med1`)

Stored in `messages.message` / `messages.message_for_sender`.

- `v`: envelope version (`med1`)
- `k`: wrapped per-message AES media key
- `m`: encrypted metadata payload (`mmd1`)
- `kv`: key version marker (rotation-aware behavior)

## 3) Private Text Flow

### Send

1. Client fetches recipient and sender public keys.
2. Client encrypts plaintext twice (recipient payload + sender copy).
3. Client posts encrypted fields to `api/send_message.php`.

### Receive

1. Client fetches message row.
2. If current user is sender, decrypt `message_for_sender`; else decrypt `message`.
3. Render plaintext.

Notes:
- UTF-8 byte-aware chunking is used to avoid multibyte corruption.
- Text decryption uses private RSA key (OAEP SHA-256 path).

## 4) Group Text Flow

### Key distribution

Group lifecycle APIs create/maintain per-member wrapped shared keys in `group_member_keys`:

1. Member public key is loaded.
2. Shared group key is wrapped per member.
3. Wrapped value is upserted for `(group_id, user_id)`.

### Send/receive

1. Client loads/imports current group key from `api/get_group_key.php`.
2. Text is encrypted with group AES-GCM key (`gcm1`).
3. On fetch, members decrypt with same group key.

Server-side membership checks gate all group reads/writes.

## 5) Private Media Flow

### Send

1. Generate fresh AES media key per message.
2. Encrypt binary payload with AES-GCM.
3. Encrypt metadata (filename, MIME, size) with same key.
4. Wrap media key for recipient and sender separately (public-key wrapping).
5. Upload encrypted blob + envelopes via media send endpoint.

### Receive

1. Select proper envelope (`message` or `message_for_sender`).
2. Unwrap media key with client private key.
3. Decrypt metadata.
4. Fetch encrypted blob via `api/get_image.php`, `api/get_voice_message.php`, or `api/get_file_message.php`.
5. Decrypt blob and render/play/download.

## 6) Group Media Flow

### Send

1. Fetch/import current group key.
2. Generate per-message AES media key.
3. Encrypt blob + metadata.
4. Wrap media key using group key and write `kv` marker.
5. Upload encrypted blob + `med1` envelope to media endpoint with `group_id`.

### Receive

1. Parse `med1` envelope from message row.
2. If `kv` differs from cached group key version, refresh group key.
3. Unwrap media key with group key.
4. Decrypt metadata + blob and render.

## 7) Key Versioning & Rotation Notes

- Current behavior writes `kv` for media envelopes.
- Direct chats currently use baseline `kv=1`.
- Group media/text should use active group key version from `api/get_group_key.php`.
- On decrypt, clients refresh key if envelope `kv` and cache diverge.

Operational guidance:
- Rotate at group-key level in controlled windows.
- Ensure historical decryptability strategy before aggressive rotation.

## 8) Legacy Data Policy

Project decision for this phase: legacy unencrypted attachment/text rows are not retained.

Recommended cleanup flow (non-production, or carefully planned maintenance windows):

1. Backup DB + uploads.
2. Remove legacy non-envelope rows.
3. Remove orphan files under uploads paths.

## 9) Security Guarantees & Caveats

Guarantees:
- Server transports/stores ciphertext for encrypted content.
- Non-members cannot decrypt group media/text without group keys.
- Membership enforcement is applied for group message and media access.

Caveats:
- Private key storage/retrieval architecture remains a known trade-off and should continue to be hardened in future phases.
