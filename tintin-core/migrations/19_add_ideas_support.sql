CREATE TABLE IF NOT EXISTS ideas (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    body        TEXT NOT NULL,
    admin_reply TEXT DEFAULT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    replied_at  TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_ideas_user (user_id),
    INDEX idx_ideas_created (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS idea_votes (
    id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idea_id  INT UNSIGNED NOT NULL,
    user_id  INT NOT NULL,
    vote     TINYINT NOT NULL COMMENT '1 = like, -1 = dislike',
    voted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_idea_user (idea_id, user_id),
    INDEX idx_votes_idea (idea_id),
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
