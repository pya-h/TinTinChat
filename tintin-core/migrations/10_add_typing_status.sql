CREATE TABLE IF NOT EXISTS chat_typing_status (
  typer_user_id INT NOT NULL,
  target_user_id INT NOT NULL,
  is_typing TINYINT(1) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (typer_user_id, target_user_id),
  KEY idx_typing_target_updated (target_user_id, updated_at),
  CONSTRAINT fk_typing_typer_user
    FOREIGN KEY (typer_user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_typing_target_user
    FOREIGN KEY (target_user_id) REFERENCES users(id)
    ON DELETE CASCADE
);
