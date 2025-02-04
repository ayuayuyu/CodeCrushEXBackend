import { codeManagementEvents } from '~/utils/codeManagement';
import destr from 'destr';

//コードをSSE通信で送るエンドポイント
export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);
  const watchword = getRouterParam(event, 'watchword');
  const player = getRouterParam(event, 'id');
  if (!watchword) {
    throw createError({ statusCode: 400, message: 'Watchword is required' });
  }
  if (!player) {
    throw createError({ statusCode: 400, message: 'id is required' });
  }

  const interval = setTimeout(async () => {
    if (player === 'player1') {
      await eventStream.push(codeManagement[watchword]['player2']); // player1 には player2 のデータを送信
    } else if (player === 'player2') {
      await eventStream.push(codeManagement[watchword]['player1']); // player2 には player1 のデータを送信
    }
  }, 1000);

  // クライアントが接続を閉じたときの処理
  eventStream.onClosed(async () => {
    clearInterval(interval);
    await eventStream.close();
  });

  return eventStream.send();
});
