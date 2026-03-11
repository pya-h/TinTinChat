ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS group_seen_at TIMESTAMP NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS group_seen_by_user_id INT NULL;

CREATE INDEX idx_messages_group_seen_lookup
  ON messages(group_id, group_seen_at, sender_id, id);

CREATE TABLE IF NOT EXISTS group_member_reads (
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  last_read_message_id INT NOT NULL DEFAULT 0,
  last_read_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (group_id, user_id),
  KEY idx_group_member_reads_user_group (user_id, group_id),
  CONSTRAINT fk_group_member_reads_group
    FOREIGN KEY (group_id) REFERENCES groups(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_group_member_reads_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);