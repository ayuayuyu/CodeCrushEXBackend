import db from '~/utils/db';
import findWatchword from '~/utils/findwatchword';

export default defineEventHandler(async (event) => {
  try {
    //watchwordを取得
    const watchword = getRouterParam(event, 'watchword');
    //違う場合
    if (!watchword) {
      throw new Error('Watchword parameter is missing');
    }

    // データベースからすべてのデータを取得
    const stmt = db.prepare('SELECT * FROM watchwords');
    const watchwords = stmt.all();

    // Watchword を検索
    const search = findWatchword(watchwords, watchword);

    return { watchword: search };
  } catch (error) {
    // エラー処理
    return {
      error: error.message || 'An error occurred',
    };
  }
});
