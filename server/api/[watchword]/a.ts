import { statusData } from '~/utils/updateStatus';
export default defineEventHandler(async (event) => {
  const stmt = db.prepare('SELECT * FROM watchwords');
  const stmt1 = ansDB.prepare('SELECT * FROM codeAnswers');
  const stmt2 = statusDB.prepare('SELECT * FROM statusData');
  const watchwords = stmt.all();
  const codeAnswers = stmt1.all();
  const statusDatas = stmt2.all();
  return { watchwords, codeAnswers, statusDatas, statusData };
});
