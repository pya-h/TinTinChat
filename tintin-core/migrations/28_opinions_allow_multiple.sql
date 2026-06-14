-- Allow multiple opinions per (author, target) pair
ALTER TABLE user_opinions DROP INDEX uq_opinion_author_target;

-- Add composite index for efficient lookups
ALTER TABLE user_opinions ADD INDEX idx_opinions_author_target (author_user_id, target_user_id);
