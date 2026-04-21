-- Normalize legacy image_file_path values to basename-only format.
-- Safe/idempotent: only rows with prefix uploads/images/ are touched.

UPDATE messages
SET image_file_path = SUBSTRING_INDEX(REPLACE(image_file_path, '\\', '/'), '/', -1)
WHERE message_type = 'image'
  AND image_file_path LIKE 'uploads/images/%';
