// import { D1Database } from '@cloudflare/workers-types';

// export class Database {
//   private db: D1Database;

//   constructor(db: D1Database) {
//     this.db = db;
//   }

//   async init() {
//     await this.db
//       .prepare(
//         `
//         CREATE TABLE IF NOT EXISTS codeAnswers (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           code TEXT NOT NULL,
//           answer TEXT NOT NULL
//         );
//         `,
//       )
//       .run();
//   }

//   async insertCodeAnswer(code: string, answer: string) {
//     await this.db.prepare(`INSERT INTO codeAnswers (code, answer) VALUES (?, ?)`).bind(code, answer).run();
//   }

//   async getCodeAnswers() {
//     const { results } = await this.db.prepare(`SELECT * FROM codeAnswers`).all();
//     return results;
//   }
// }
