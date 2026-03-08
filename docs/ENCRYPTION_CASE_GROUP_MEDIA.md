# Group Media Messages (Image/Voice/File): Encryption/Decryption

## Summary

Group media uses per-message AES key for payload, then wraps that media key using the group shared key.

- Blob at rest: encrypted bytes (`.bin`)
- Envelope (`med1`) in DB includes:
  - `k`: group-wrapped media key
  - `m`: encrypted metadata
  - `kv`: group key version marker

## Send Pipeline

```mermaid
sequenceDiagram
    participant A as Sender Client
    participant GK as get_group_key.php
    participant E as crypto.js
    participant S as send_*_message.php
    participant DB as messages

    A->>GK: fetch member-wrapped group key
    A->>E: import/decrypt shared group key
    A->>E: generate media AES key
    A->>E: encrypt media blob + metadata
    A->>E: wrap media AES key with group key
    A->>S: POST group_id + encrypted blob + med1 envelope
    S->>DB: INSERT group_id, message_type=image|voice|file
```

## Receive Pipeline

```mermaid
flowchart TD
    F[fetch_messages.php for group] --> P[Parse med1 envelope]
    P --> V{envelope kv == cached group key version?}
    V -- no --> R1[Refresh group key]
    V -- yes --> R2[Use cached group key]
    R1 --> U
    R2 --> U
    U[Unwrap media key with group key] --> M[Decrypt metadata mmd1]
    U --> B[Fetch encrypted blob get_*]
    B --> D[Decrypt blob AES-GCM]
    D --> X[Display image / play voice / download file]
```

## Security Guarantees

- Non-members cannot decrypt media even if blob is leaked.
- Server-side code enforces membership before serving encrypted blob.
- `kv` supports rotation-aware client behavior.
