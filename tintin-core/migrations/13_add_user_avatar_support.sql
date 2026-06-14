ALTER TABLE users
  ADD COLUMN avatar_path VARCHAR(255) NULL AFTER private_key,
  ADD COLUMN avatar_mime VARCHAR(100) NULL AFTER avatar_path,
  ADD COLUMN avatar_updated_at TIMESTAMP NULL DEFAULT NULL AFTER avatar_mime;

CREATE INDEX idx_users_avatar_path ON users(avatar_path);
