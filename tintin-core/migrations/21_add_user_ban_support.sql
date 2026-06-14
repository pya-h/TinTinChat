ALTER TABLE users ADD COLUMN banned_at TIMESTAMP NULL DEFAULT NULL;

CREATE INDEX idx_users_banned_at ON users(banned_at);
