UPDATE message_reactions
SET reaction = TRIM(reaction)
WHERE reaction <> TRIM(reaction);

DELETE FROM message_reactions
WHERE reaction NOT IN ('like', 'love', 'laugh', 'wow', 'sad', 'fire', 'fish');
