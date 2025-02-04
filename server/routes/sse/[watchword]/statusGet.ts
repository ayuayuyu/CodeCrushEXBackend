import { statusDataEvents, statusSendManager } from '~/utils/updateStatus';

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);
  const watchword = getRouterParam(event, 'watchword');

  if (!watchword) {
    throw createError({ statusCode: 400, message: 'Watchword is required' });
  }

  const interval = setInterval(async () => {
    if (statusData[watchword] !== 'read') return;
    if (statusSendManager[watchword] === 'read') return;

    statusSendManager[watchword] = 'read';
    await eventStream.push(statusData[watchword]);
  }, 1000);

  // クライアントが接続を閉じたときの処理
  eventStream.onClosed(async () => {
    clearInterval(interval);
    await eventStream.close();
  });

  return eventStream.send();
});
