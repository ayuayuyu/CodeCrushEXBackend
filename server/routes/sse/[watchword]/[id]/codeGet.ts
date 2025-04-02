import { codeManagementEvents } from '~/utils/codeManagement';

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

  codeManagementEvents.on(watchword, async ({ player1, player2 }) => {
    if (player === 'player1') {
      console.log('player1きたよ');
      await eventStream.push(JSON.stringify(player2)); // player1 には player2 のデータを送信
    } else if (player === 'player2') {
      console.log('player2きたよ');
      await eventStream.push(JSON.stringify(player1)); // player2 には player1 のデータを送信
    }
  });

  // クライアントが接続を閉じたときの処理
  eventStream.onClosed(async () => {
    await eventStream.close();
  });

  return eventStream.send();
});
