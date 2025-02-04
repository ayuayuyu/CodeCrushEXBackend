import { D1Database } from '@cloudflare/workers-types';
export class Database {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }
  async init() {
    await this.db
      .prepare(
        `
        CREATE TABLE IF NOT EXISTS codeAnswers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT NOT NULL,
          answer TEXT NOT NULL
        );
        `,
      )
      .run();
    await this.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS statusData (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      watchword TEXT NOT NULL,
      status TEXT NOT NULL
    );`,
      )
      .run();

    await this.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS statusManage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      watchword TEXT NOT NULL,
      player1 INTEGER NOT NULL,
      player2 INTEGER NOT NULL
    );`,
      )
      .run();

    await this.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS codeManagement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      watchword TEXT NOT NULL,
      player1 TEXT NOT NULL,
      player2 TEXT NOT NULL
    );`,
      )
      .run();

    await this.db
      .prepare(
        `CREATE TABLE IF NOT EXISTS watchwords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      watchword TEXT NOT NULL,
      status TEXT NOT NULL,
      player1 BOOLEAN DEFAULT 0,
      player2 BOOLEAN DEFAULT 0
    );`,
      )
      .run();
  }
  async insertCodeAnswer(code: string, answer: string) {
    await this.db.prepare(`INSERT INTO codeAnswers (code, answer) VALUES (?, ?)`).bind(code, answer).run();
  }
  async insertStatusData(watchword: string, status: string) {
    await this.db
      .prepare(`INSERT INTO statusData (watchword, status) VALUES (?, ?)`)
      .bind(watchword, status)
      .run();
  }
  async insertStatusManage(watchword: string, player1: number, player2: number) {
    await this.db
      .prepare(`INSERT INTO statusManage (watchword, player1, player2) VALUES (?, ?, ?)`)
      .bind(watchword, player1, player2)
      .run();
  }
  async insertCodeManagement(watchword: string, player1: string, player2: string) {
    await this.db
      .prepare(`INSERT INTO codeManagement (watchword, player1, player2) VALUES (?, ?, ?)`)
      .bind(watchword, player1, player2)
      .run();
  }
  async insertWatchwords(watchword: string, status: string, player1: number, player2: number) {
    await this.db
      .prepare(`INSERT INTO watchwords (watchword, status, player1, player2) VALUES (?, ?, ?, ?)`)
      .bind(watchword, status, player1, player2)
      .run();
  }

  // async updateWatchwords(watchword: string, status: string, player1: number, player2: number) {
  //   await this.db
  //     .prepare(`INSERT INTO watchwords (watchword, status, player1, player2) VALUES (?, ?, ?, ?)`)
  //     .bind(watchword, status, player1, player2)
  //     .run();
  // }

  async updatePlayerCodeManagement(watchword: string, player1: string, player: string) {
    await this.db
      .prepare(`UPDATE codeManagement SET ${player} = ? WHERE watchword = ?`)
      .bind(player1, watchword)
      .run();
  }

  // async updatePlayer2CodeManagement(watchword: string, player2: string) {
  //   await this.db
  //     .prepare(`UPDATE codeManagement SET player2 = ? WHERE watchword = ?`)
  //     .bind(player2, watchword)
  //     .run();
  // }

  async updateStatusData(watchword: string, status: string) {
    await this.db
      .prepare(`UPDATE statusData  SET status = ? WHERE watchword = ?`)
      .bind(status, watchword)
      .run();
  }

  async updateStatusManage(watchword: string, status: number, player: string) {
    await this.db
      .prepare(`UPDATE statusManage SET ${player} = ? WHERE watchword = ?`)
      .bind(status, watchword)
      .run();
  }

  async updateStatusWatchwords(watchword: string, status: string) {
    await this.db
      .prepare(`UPDATE watchwords SET status = ? WHERE watchword = ?`)
      .bind(status, watchword)
      .run();
  }

  async updatePlayerWatchwords(watchword: string, player: string) {
    await this.db.prepare(`UPDATE watchwords SET ${player} = 1 WHERE watchword = ?`).bind(watchword).run();
  }
  async getWatchword(watchword: string) {
    const res = await this.db.prepare(`SELECT * FROM watchwords WHERE watchword = ?`).bind(watchword).first();
    return res || null;
  }

  async getCodeAnswers() {
    const { results } = await this.db.prepare(`SELECT * FROM codeAnswers`).all();
    return results;
  }
  async getStatusData() {
    const { results } = await this.db.prepare(`SELECT * FROM statusData`).all();
    return results;
  }
  async getStatusManage() {
    const { results } = await this.db.prepare(`SELECT * FROM statusManage`).all();
    return results;
  }
  async getCodeManagement() {
    const { results } = await this.db.prepare(`SELECT * FROM codeManagement`).all();
    return results;
  }
  async getWatchwords() {
    const { results } = await this.db.prepare(`SELECT * FROM watchwords`).all();
    return results;
  }

  async resetDatabase() {
    await this.db.batch([
      this.db.prepare(`DROP TABLE IF EXISTS codeAnswers`),
      this.db.prepare(`DROP TABLE IF EXISTS statusData`),
      this.db.prepare(`DROP TABLE IF EXISTS statusManage`),
      this.db.prepare(`DROP TABLE IF EXISTS codeManagement`),
      this.db.prepare(`DROP TABLE IF EXISTS watchwords`),
    ]);
    await this.init(); // テーブルを再作成
  }
}
