const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../results.db');
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS responses (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name  TEXT    NOT NULL,
    company_size  TEXT,
    submitted_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    q1  TEXT, q2  TEXT, q3  TEXT, q4  TEXT,
    q5  TEXT, q6  TEXT, q7  TEXT, q8  TEXT,
    q9  TEXT, q10 TEXT, q11 TEXT,
    score_SE REAL, score_BM REAL, score_BP REAL,
    score_DO REAL, score_AD REAL, score_MI REAL,
    winner    TEXT NOT NULL,
    runner_up TEXT,
    gap       REAL
  )
`);

const existingCols = db.pragma('table_info(responses)').map(c => c.name);
if (!existingCols.includes('company_size')) db.exec('ALTER TABLE responses ADD COLUMN company_size TEXT');
if (!existingCols.includes('runner_up'))    db.exec('ALTER TABLE responses ADD COLUMN runner_up TEXT');
if (!existingCols.includes('gap'))          db.exec('ALTER TABLE responses ADD COLUMN gap REAL');

const insertResponse = db.prepare(`
  INSERT INTO responses
    (company_name, company_size, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11,
     score_SE, score_BM, score_BP, score_DO, score_AD, score_MI, winner, runner_up, gap)
  VALUES
    (@company_name, @company_size, @q1, @q2, @q3, @q4, @q5, @q6, @q7, @q8, @q9, @q10, @q11,
     @score_SE, @score_BM, @score_BP, @score_DO, @score_AD, @score_MI, @winner, @runner_up, @gap)
`);

module.exports = { db, insertResponse };
