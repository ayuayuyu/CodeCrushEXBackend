const clients = new Set();
import { statusDataEvents } from '#imports';

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);
  const watchword = getRouterParam(event, 'watchword');

  if (!watchword) {
    throw createError({ statusCode: 400, message: 'Watchword is required' });
  }
  // `sharedData.status` の変更を監視

  clients.add(eventStream);
  statusDataEvents.on(watchword, async (newStatus) => {
    console.log('changeSSE');
    // await eventStream.push(newStatus);
    // すべてのクライアントにデータを並列送信
    await Promise.all(
      [...clients].map((client) =>
        client.push(newStatus).catch((err) => {
          console.error('Error pushing data to client:', err);
        }),
      ),
    );
  });

  // クライアントが接続を閉じたときの処理
  eventStream.onClosed(async () => {
    await eventStream.close();
  });

  return eventStream.send();
});
