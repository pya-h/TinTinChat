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
