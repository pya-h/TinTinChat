CREATE TABLE IF NOT EXISTS groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(80) NOT NULL,
  description TEXT NULL,
  created_by_user_id INT NOT NULL,
  join_token VARCHAR(128) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_groups_join_token (join_token),
  CONSTRAINT fk_groups_created_by_user
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('owner', 'admin', 'member') NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  invited_by_user_id INT NULL,
  PRIMARY KEY (group_id, user_id),
  KEY idx_group_members_user (user_id),
  KEY idx_group_members_role (group_id, role),
  CONSTRAINT fk_group_members_group
    FOREIGN KEY (group_id) REFERENCES groups(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_group_members_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_group_members_invited_by
    FOREIGN KEY (invited_by_user_id) REFERENCES users(id)
    ON DELETE SET NULL
);

ALTER TABLE messages
  MODIFY COLUMN receiver_id INT NULL;

ALTER TABLE messages
  ADD COLUMN group_id INT NULL AFTER receiver_id,
  ADD CONSTRAINT fk_messages_group_id
    FOREIGN KEY (group_id) REFERENCES groups(id)
    ON DELETE CASCADE;

CREATE INDEX idx_messages_group_created_at ON messages(group_id, created_at);
