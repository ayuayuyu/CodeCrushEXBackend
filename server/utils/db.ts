import Database from 'better-sqlite3';

// SQLite データベースを初期化
// export const db = new Database('watchword.db');
export const db = new Database('watchword.db');

//正解判定のコードと答えと入力のデーターベース
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS codeAnswers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    answer TEXT NOT NULL
  );
`,
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS statusData (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    watchword TEXT NOT NULL,
    status TEXT NOT NULL
  );
`,
).run();

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS statusManage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      watchword TEXT NOT NULL,
      player1 NUMBER NOT NULL,
      player2 NUMBER NOT NULL
    );
  `,
).run();

//送られてきたコードの保存
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS codeManagement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      watchword TEXT NOT NULL,
      player1 TEXT NOT NULL,
      player2 TEXT NOT NULL
    );
  `,
).run();

//合言葉とそのルームにプレイヤーが参加しているかのデータベース

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS watchwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    watchword TEXT NOT NULL,
    status TEXT NOT NULL,
    player1 BOOLEAN DEFAULT 0,
    player2 BOOLEAN DEFAULT 0
  );
`,
).run();
