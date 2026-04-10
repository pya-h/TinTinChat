CREATE TABLE IF NOT EXISTS playlist_tracks (
  user_id    INT NOT NULL,
  message_id INT NOT NULL,
  title      VARCHAR(255) NOT NULL DEFAULT 'Unknown',
  ext        VARCHAR(16)  NOT NULL DEFAULT '',
  added_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, message_id),
  KEY idx_playlist_user_added (user_id, added_at),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (message_id) REFERENCES messages(id)  ON DELETE CASCADE
);


/* Or if you had created the table already: */
ALTER TABLE playlist_tracks 
ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT 'Unknown',
ADD COLUMN ext VARCHAR(16) NOT NULL DEFAULT ''
