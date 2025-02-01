import { statusDataEvents } from '~/utils/updateStatus';
import { destr, safeDestr } from 'destr';

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);
  const watchword = getRouterParam(event, 'watchword');

  if (!watchword) {
    throw createError({ statusCode: 400, message: 'Watchword is required' });
  }
  // `sharedData.status` の変更を監視
  statusDataEvents.on(watchword, async (newStatus) => {
    await eventStream.push(destr({ status: newStatus }));
  });

  // クライアントが接続を閉じたときの処理
  eventStream.onClosed(async () => {
    await eventStream.close();
  });

  return eventStream.send();
});
