ALTER TABLE users
    ADD COLUMN last_read_announcement_id INT UNSIGNED NULL DEFAULT NULL AFTER tips_seen_at;
