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
  receiver_id INT NOT NULL,
  message TEXT,
  message_for_sender TEXT,
  message_type ENUM('text', 'voice', 'image', 'video', 'file') DEFAULT 'text',
  voice_file_path VARCHAR(255),
  image_file_path VARCHAR(255),
  any_file_path VARCHAR(255),
  file_size BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  seen_at TIMESTAMP DEFAULT NULL;
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
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
