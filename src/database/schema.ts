export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS lesson_progress (
  lesson_id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  completed_step INTEGER NOT NULL DEFAULT 0,
  is_completed INTEGER NOT NULL DEFAULT 0,
  prediction_choice_id TEXT,
  prediction_correct INTEGER,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_index INTEGER NOT NULL,
  is_correct INTEGER NOT NULL,
  attempted_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS student_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  step_number INTEGER NOT NULL DEFAULT 1,
  note_text TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS lesson_bookmarks (
  lesson_id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL,
  bookmarked_at INTEGER NOT NULL
);
`;
