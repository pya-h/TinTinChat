CREATE INDEX idx_users_ident ON users(ident);

CREATE INDEX idx_messages_receiver_seen_created_at
  ON messages(receiver_id, seen_at, created_at);
