-- Add grouped_with column for photo album grouping.
-- When multiple photos are sent together, they share the same grouped_with value
-- (set to the first message's id). NULL = standalone message.

ALTER TABLE messages
    ADD COLUMN grouped_with INT NULL DEFAULT NULL AFTER forwarded_by_user_id;

ALTER TABLE messages
    ADD INDEX idx_messages_grouped_with (grouped_with);
