CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    username TEXT NOT NULL,
    attempted_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS music_login_ip ON login_attempts(ip, attempted_at);
CREATE INDEX IF NOT EXISTS music_login_user ON login_attempts(username, attempted_at);
