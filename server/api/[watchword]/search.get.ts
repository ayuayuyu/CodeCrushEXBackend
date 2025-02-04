import findWatchword from '~/utils/findwatchword';
import { Database } from '~/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const { cloudflare } = event.context;
    const db = new Database(cloudflare.env.DB);
    //watchwordを取得
    const watchword = getRouterParam(event, 'watchword');
    //違う場合
    if (!watchword) {
      throw new Error('Watchword parameter is missing');
    }

    // データベースからすべてのデータを取得
    const watchwords = await db.getWatchwords();

    // Watchword を検索
    const search = findWatchword(watchwords, watchword);

    if (search) {
      return { player: 'player2', watchword: search };
    }
    return { watchword: search };
  } catch (error) {
    // エラー処理
    return {
      error: error.message || 'An error occurred',
    };
  }
});
