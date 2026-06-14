ALTER TABLE messages ADD COLUMN file_purged_at TIMESTAMP NULL DEFAULT NULL AFTER any_file_path;
