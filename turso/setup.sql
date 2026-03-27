CREATE TABLE IF NOT EXISTS portfolio_config (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO portfolio_config (id, data, updated_at)
VALUES ('main', '{}', CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;
