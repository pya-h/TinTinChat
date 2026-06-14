UPDATE message_reactions SET reaction = 'like' WHERE reaction IN ('👍');
UPDATE message_reactions SET reaction = 'love' WHERE reaction IN ('❤️', '❤');
UPDATE message_reactions SET reaction = 'laugh' WHERE reaction IN ('😂');
UPDATE message_reactions SET reaction = 'wow' WHERE reaction IN ('😮');
UPDATE message_reactions SET reaction = 'sad' WHERE reaction IN ('😢');
UPDATE message_reactions SET reaction = 'fire' WHERE reaction IN ('🔥');
UPDATE message_reactions SET reaction = 'fish' WHERE reaction IN ('🐠');
