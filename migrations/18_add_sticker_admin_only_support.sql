ALTER TABLE stickers
    ADD COLUMN is_admin_only TINYINT(1) NOT NULL DEFAULT 0 AFTER is_active,
    ADD INDEX idx_stickers_admin_only (is_admin_only);
