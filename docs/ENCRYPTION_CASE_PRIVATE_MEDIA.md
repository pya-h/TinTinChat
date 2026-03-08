# Private Media Messages (Image/Voice/File): Encryption/Decryption

## Summary

Private media is encrypted with a fresh per-message AES key, then that key is wrapped separately for recipient and sender.

- Blob at rest: encrypted bytes (`uploads/*/*.bin`)
- Envelope in DB (`message` / `message_for_sender`):
  - `v='med1'`
  - `k` wrapped media key
  - `m` encrypted metadata (`mmd1`)
  - `kv=1`

## Send Pipeline

```mermaid
sequenceDiagram
    participant A as Sender Client
    participant K as Public Keys API
    participant E as crypto.js
    participant S as send_*_message.php
    participant DB as messages
    participant FS as uploads

    A->>E: generate AES-256 media key
    A->>E: AES-GCM encrypt media blob
    A->>E: AES-GCM encrypt metadata JSON
    A->>K: get_public_key(receiver), get_public_key(sender)
    A->>E: RSA wrap media key for receiver/sender
    A->>S: POST encrypted blob + envelopes
    S->>FS: store .bin file
    S->>DB: INSERT message_type=image|voice|file
```

## Receive Pipeline

```mermaid
flowchart TD
    F[fetch_messages.php] --> M[Choose envelope field by sender/receiver]
    M --> U[Unwrap media key with private RSA key]
    U --> DM[Decrypt metadata mmd1]
    U --> DBL[GET encrypted blob from get_* endpoint]
    DBL --> D[AES-GCM decrypt blob]
    D --> R[Render image/play voice/download file]
```

## Notes

- Server cannot decrypt payload; it stores/transports ciphertext.
- File name and MIME are taken from decrypted metadata on client.
