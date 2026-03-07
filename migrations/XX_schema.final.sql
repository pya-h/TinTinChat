CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  public_key TEXT,
  private_key TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ident VARCHAR(128),
  is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT,
  group_id INT,
  message MEDIUMTEXT,
  message_for_sender MEDIUMTEXT,
  message_type ENUM('text', 'voice', 'image', 'video', 'file') DEFAULT 'text',
  voice_file_path VARCHAR(255),
  image_file_path VARCHAR(255),
  any_file_path VARCHAR(255),
  file_size BIGINT,
  reply_to_message_id INT NULL,
  forwarded_from_message_id INT NULL,
  forwarded_by_user_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  seen_at TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  FOREIGN KEY (reply_to_message_id) REFERENCES messages(id) ON DELETE SET NULL,
  FOREIGN KEY (forwarded_from_message_id) REFERENCES messages(id) ON DELETE SET NULL,
  FOREIGN KEY (forwarded_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
);

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

CREATE TABLE IF NOT EXISTS group_member_keys (
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  encrypted_group_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (group_id, user_id),
  CONSTRAINT fk_group_member_keys_member
    FOREIGN KEY (group_id, user_id) REFERENCES group_members(group_id, user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_group_member_keys_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- Speeds up chat lookup between two users
CREATE INDEX idx_sender_receiver_created_at
  ON messages (sender_id, receiver_id, created_at);

CREATE INDEX idx_receiver_sender_created_at
  ON messages (receiver_id, sender_id, created_at);

CREATE INDEX idx_created_at
  ON messages (created_at);

CREATE INDEX idx_message_type
  ON messages (message_type);

CREATE INDEX idx_messages_reply_to ON messages(reply_to_message_id);

CREATE INDEX idx_messages_forwarded_from ON messages(forwarded_from_message_id);
CREATE INDEX idx_messages_forwarded_by ON messages(forwarded_by_user_id);

CREATE INDEX idx_messages_group_created_at ON messages(group_id, created_at);
