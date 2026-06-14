ALTER TABLE messages 
ADD COLUMN any_file_path VARCHAR(255) AFTER image_file_path,
ADD COLUMN file_size BIGINT AFTER any_file_path;

