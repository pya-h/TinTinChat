CREATE TABLE IF NOT EXISTS user_blocks (
  blocker_user_id INT NOT NULL,
  blocked_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (blocker_user_id, blocked_user_id),
  KEY idx_user_blocks_blocked (blocked_user_id),
  CONSTRAINT fk_user_blocks_blocker
    FOREIGN KEY (blocker_user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user_blocks_blocked
    FOREIGN KEY (blocked_user_id) REFERENCES users(id)
    ON DELETE CASCADE
);
