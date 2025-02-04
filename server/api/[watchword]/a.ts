import { statusData } from '~/utils/updateStatus';
import { Database } from '~/utils/db';

export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;
  const db = new Database(cloudflare.env.DB);
  const codeAnswers = await db.getCodeAnswers();
  const statusDatas = await db.getStatusData();
  const statusManage = await db.getStatusManage();
  const codeManage = await db.getCodeManagement();
  const watchwords = await db.getWatchwords();
  return { watchwords, codeAnswers, statusDatas, statusData, statusManage, statusManagement, codeManage };
});
