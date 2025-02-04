import { codeManagementEvents } from '~/utils/codeManagement';
import destr from 'destr';

//コードをSSE通信で送るエンドポイント
export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);
  const watchword = getRouterParam(event, 'watchword');
  const id = getRouterParam(event, 'id');
  if (!watchword) {
    throw createError({ statusCode: 400, message: 'Watchword is required' });
  }
  if (!id) {
    throw createError({ statusCode: 400, message: 'id is required' });
  }

  const interval = setInterval(async () => {
    if (!codeManagement[watchword]) {
      console.error(`No data found for watchword: ${watchword}`);
      return;
    }

    if (id === 'player1') {
      const data = codeManagement[watchword]['player2'];
      console.log(`data1:${data}`);
      if (data) {
        await eventStream.push(data);
      }
    } else if (id === 'player2') {
      const data = codeManagement[watchword]['player1'];
      if (data) {
        await eventStream.push(data);
      }
    }
  }, 1000);

  // クライアントが接続を閉じたときの処理
  eventStream.onClosed(async () => {
    clearInterval(interval);
    await eventStream.close();
  });

  return eventStream.send();
});
