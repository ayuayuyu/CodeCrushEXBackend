import Database from "better-sqlite3";

// SQLite データベースを初期化
const db = new Database("deta.db");

// 初回実行時にテーブルを作成
// db.prepare(`
//   CREATE TABLE IF NOT EXISTS watchwords (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     watchword TEXT NOT NULL
//   )
// `).run();
// テーブルの作成（初回のみ実行）
// db.prepare(`
//   CREATE TABLE IF NOT EXISTS watchwords (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     watchword TEXT NOT NULL,
//     player1 BOOLEAN DEFAULT 0,
//     player2 BOOLEAN DEFAULT 0,
//   )
// `).run();
db.prepare(`
  CREATE TABLE IF NOT EXISTS codeAnswers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    answer INTEGER NOT NULL
  );
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS watchwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    watchword TEXT NOT NULL,
    player1 BOOLEAN DEFAULT 0,
    player2 BOOLEAN DEFAULT 0
  );
`).run();


export default db;
