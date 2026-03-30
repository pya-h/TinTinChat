CREATE TABLE IF NOT EXISTS user_opinions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  author_user_id INT NOT NULL,
  target_user_id INT NOT NULL,
  body VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_opinions_author (author_user_id),
  INDEX idx_opinions_target (target_user_id),
  UNIQUE KEY uq_opinion_author_target (author_user_id, target_user_id),
  FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE
);
