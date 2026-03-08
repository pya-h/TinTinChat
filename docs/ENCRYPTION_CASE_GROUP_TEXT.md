# Group Text Messages: Encryption/Decryption

## Summary

Group text uses one shared AES-GCM key per group.

- Encrypted payload format: `gcm1:<iv_b64>:<cipher_b64>`
- Stored in both `message` and `message_for_sender` for group rows.

## Group Key Distribution

```mermaid
sequenceDiagram
    participant C as Group API create/add/join
    participant G as group_crypto_helpers.php
    participant U as users(public keys)
    participant GMK as group_member_keys

    C->>G: ensure member has shared group key
    G->>U: fetch member public key
    G->>G: RSA-OAEP wrap shared key
    G->>GMK: UPSERT encrypted_group_key
```

## Encrypt/Decrypt Runtime

```mermaid
flowchart TD
    A[Sender selects group] --> K[get_group_key.php]
    K --> I[Import group AES key]
    I --> E[AES-GCM encrypt text]
    E --> P[send_message.php message_type='text']
    P --> F[fetch_messages.php]
    F --> D[Client AES-GCM decrypt with group key]
    D --> R[Render text]
```

## Notes

- Membership is enforced on all group read/write operations.
- Client refreshes key cache when needed; failures surface as send/decrypt errors.
