# Private Text Messages: Encryption/Decryption

## Summary

Private text is encrypted per recipient and separately for sender copy.

- Recipient payload -> `messages.message`
- Sender payload -> `messages.message_for_sender`

## Encrypt Flow

```mermaid
sequenceDiagram
    participant A as Sender Client
    participant K as Key API
    participant S as send_message.php
    participant DB as messages

    A->>K: get_public_key(receiver)
    A->>K: get_public_key(sender)
    A->>A: RSA-OAEP chunk encrypt(text) for receiver
    A->>A: RSA-OAEP chunk encrypt(text) for sender
    A->>S: POST target, message, message_for_sender
    S->>DB: INSERT message_type='text'
```

## Decrypt Flow

```mermaid
flowchart TD
    F[fetch_messages.php] --> C[Client gets row]
    C --> D{sender_id == current_user?}
    D -- yes --> S1[Use message_for_sender]
    D -- no --> S2[Use message]
    S1 --> P[Private key RSA decrypt chunks]
    S2 --> P
    P --> R[Render plaintext]
```

## Notes

- Chunking is UTF-8 byte-aware to avoid multibyte breakage.
- Direct RSA key import uses OAEP SHA-256 path for text.
