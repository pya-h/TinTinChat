CREATE TABLE IF NOT EXISTS playlist_tracks (
  user_id    INT NOT NULL,
  message_id INT NOT NULL,
  added_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, message_id),
  KEY idx_playlist_user_added (user_id, added_at),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES messages(id)  ON DELETE CASCADE
);
