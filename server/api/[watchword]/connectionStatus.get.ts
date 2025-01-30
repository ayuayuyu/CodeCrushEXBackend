// player1  true && player2 true　ならば　status.tsからステータスを変更してSSE通信でステータスを送る!

export default defineEventHandler(async (event) => {
  try {
    //watchwordを取得
    const watchword = getRouterParam(event, 'watchword');
    //違う場合
    if (!watchword) {
      throw new Error('Watchword parameter is missing');
    }
  } catch (error) {
    // エラー処理
    return {
      error: error.message || 'An error occurred',
    };
  }
});
