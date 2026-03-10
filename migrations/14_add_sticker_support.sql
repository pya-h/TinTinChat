CREATE TABLE IF NOT EXISTS stickers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_path VARCHAR(255) NOT NULL,
  file_mime VARCHAR(64) NOT NULL,
  file_hash CHAR(64) NOT NULL,
  width SMALLINT UNSIGNED NOT NULL,
  height SMALLINT UNSIGNED NOT NULL,
  uploaded_by_user_id INT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_stickers_file_hash (file_hash),
  KEY idx_stickers_active_created (is_active, created_at),
  CONSTRAINT fk_stickers_uploaded_by_user
    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

ALTER TABLE messages
  MODIFY COLUMN message_type ENUM('text', 'voice', 'image', 'video', 'file', 'sticker') DEFAULT 'text';

ALTER TABLE messages
  ADD COLUMN sticker_id INT NULL AFTER file_size,
  ADD CONSTRAINT fk_messages_sticker_id
    FOREIGN KEY (sticker_id) REFERENCES stickers(id)
    ON DELETE SET NULL;

CREATE INDEX idx_messages_sticker_id ON messages(sticker_id);
