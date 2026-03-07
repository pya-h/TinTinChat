ALTER TABLE messages
ADD COLUMN forwarded_from_message_id INT NULL AFTER reply_to_message_id,
ADD COLUMN forwarded_by_user_id INT NULL AFTER forwarded_from_message_id,
ADD CONSTRAINT fk_messages_forwarded_from
  FOREIGN KEY (forwarded_from_message_id) REFERENCES messages(id)
  ON DELETE SET NULL,
ADD CONSTRAINT fk_messages_forwarded_by
  FOREIGN KEY (forwarded_by_user_id) REFERENCES users(id)
  ON DELETE SET NULL;

CREATE INDEX idx_messages_forwarded_from ON messages(forwarded_from_message_id);
CREATE INDEX idx_messages_forwarded_by ON messages(forwarded_by_user_id);
