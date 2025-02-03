import { statusData } from '~/utils/updateStatus';
export default defineEventHandler(async (event) => {
  const stmt = db.prepare('SELECT * FROM watchwords');
  const stmt1 = db.prepare('SELECT * FROM codeAnswers');
  const stmt2 = db.prepare('SELECT * FROM statusData');
  const stmt3 = db.prepare('SELECT * FROM statusManage');
  const stmt4 = db.prepare('SELECT * FROM codeManagement');
  const watchwords = stmt.all();
  const codeAnswers = stmt1.all();
  const statusDatas = stmt2.all();
  const statusManage = stmt3.all();
  const codeManage = stmt4.all();
  return { watchwords, codeAnswers, statusDatas, statusData, statusManage, statusManagement, codeManage };
});
