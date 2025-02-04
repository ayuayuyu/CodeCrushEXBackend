// import { D1Database } from '@cloudflare/workers-types';

// export default defineEventHandler(async (event) => {
//   const { cloudflare } = event.context;
//   const db: D1Database = cloudflare.env.DB; // `await` を削除

//   await db
//     .prepare(
//       `
//       CREATE TABLE IF NOT EXISTS codeAnswers (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         code TEXT NOT NULL,
//         answer TEXT NOT NULL
//       );
//       `,
//     )
//     .run();

//   await db
//     .prepare(
//       `
//       INSERT INTO codeAnswers (code, answer) VALUES ("A", "a")
//       `,
//     )
//     .run();

//   const { results } = await db.prepare(`SELECT * FROM codeAnswers`).all();

//   console.log(results);

//   return results; // `Response.json(results)` ではなく、直接 `results` を返す
// });
import { Database } from '~/utils/db';

export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;
  const db = new Database(cloudflare.env.DB);

  await db.init();
  await db.insertCodeAnswer('A', 'a');
  const results = await db.getCodeAnswers();

  console.log(results);
  return results;
});
