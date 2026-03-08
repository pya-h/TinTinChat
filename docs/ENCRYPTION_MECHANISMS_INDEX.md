# Encryption & Decryption Mechanisms (Index)

Last updated: 2026-03-08

This documentation set describes how encryption/decryption works in TinTinChat for each message case.

## Cases

- [Private Text Messages](docs/ENCRYPTION_CASE_PRIVATE_TEXT.md)
- [Group Text Messages](docs/ENCRYPTION_CASE_GROUP_TEXT.md)
- [Private Media Messages (Image/Voice/File)](docs/ENCRYPTION_CASE_PRIVATE_MEDIA.md)
- [Group Media Messages (Image/Voice/File)](docs/ENCRYPTION_CASE_GROUP_MEDIA.md)

## Shared Concepts

- Direct text uses RSA-OAEP chunked encryption.
- Group text uses AES-GCM with a shared group key (`gcm1:*`).
- Media uses per-message AES-GCM keys and envelope `med1`:
  - `k`: wrapped media key
  - `m`: encrypted metadata (`mmd1`)
  - `kv`: key version marker
- Media blobs are stored and served as encrypted `application/octet-stream` and decrypted on client.
