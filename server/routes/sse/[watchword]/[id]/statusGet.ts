// export default defineEventHandler(async (event) => {
//   const eventStream = createEventStream(event);
//   const watchword = getRouterParam(event, 'watchword');

//   if (!watchword) {
//     throw createError({ statusCode: 400, message: 'Watchword is required' });
//   }

//   const interval = setInterval(async () => {
//     if (
//       statusData[watchword] !== 'read' &&
//       statusData[watchword] !== 'crush' &&
//       statusData[watchword] !== 'fix' &&
//       statusData[watchword] !== 'result'
//     )
//       return;
//     if (statusSendManager[watchword] === statusData[watchword]) return;
//     statusSendManager[watchword] = statusData[watchword];
//     await eventStream.push(statusData[watchword]);
//   }, 1000);

//   // クライアントが接続を閉じたときの処理
//   eventStream.onClosed(async () => {
//     clearInterval(interval);
//     await eventStream.close();
//   });

//   return eventStream.send();
// });

const clients = new Set();
import { statusCheck } from '~/utils/updateStatus';

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);
  const watchword = getRouterParam(event, 'watchword');
  const player = getRouterParam(event, 'id');
  if (!watchword) {
    throw createError({ statusCode: 400, message: 'Watchword is required' });
  }

  // クライアントを接続リストに追加
  clients.add(eventStream);
  if (player === 'player1' || player === 'player2') {
    const interval = setInterval(async () => {
      if (
        statusData[watchword] !== 'read' &&
        statusData[watchword] !== 'crush' &&
        statusData[watchword] !== 'fix' &&
        statusData[watchword] !== 'result'
      )
        return;

      if (statusSendManager[watchword] === statusData[watchword]) return;

      if (statusCheck[watchword]['player1'] === statusCheck[watchword]['player2']) {
        statusSendManager[watchword] = statusData[watchword];
      }

      statusCheck[watchword][player] = statusData[watchword];

      // すべてのクライアントにデータを送信
      for (const client of clients) {
        try {
          await client.push(statusData[watchword]);
        } catch (error) {
          console.error('Error pushing data to client:', error);
        }
      }
    }, 1000);

    // クライアントが接続を閉じたときの処理
    eventStream.onClosed(async () => {
      clearInterval(interval);
      clients.delete(eventStream);
      await eventStream.close();
    });
  }

  return eventStream.send();
});

// const clients = new Set();

// export default defineEventHandler(async (event) => {
//   const eventStream = createEventStream(event);
//   const watchword = getRouterParam(event, 'watchword');
//   const player = getRouterParam(event, 'id');
//   console.log(`SSE通信が来ているよ:${watchword}, ${player}`);

//   if (!watchword) {
//     throw createError({ statusCode: 400, message: 'Watchword is required' });
//   }

//   console.log('動いたよ');
//   // クライアントを接続リストに追加
//   clients.add(eventStream);

//   // if (player === 'player1' || player === 'player2') {
//   const interval = setInterval(async () => {
//     if (!['read', 'crush', 'fix', 'result'].includes(statusData[watchword])) {
//       return;
//     }

//     if (statusSendManager[watchword] === statusData[watchword]) return;

//     if (statusCheck[watchword]['player1'] === statusCheck[watchword]['player2']) {
//       statusSendManager[watchword] = statusData[watchword];
//     }

//     statusCheck[watchword][player] = statusData[watchword];

//     // すべてのクライアントにデータを並列送信
//     await Promise.all(
//       [...clients].map((client) =>
//         client.push(statusData[watchword]).catch((err) => {
//           console.error('Error pushing data to client:', err);
//         }),
//       ),
//     );
//   }, 1000);

//   // クライアントが接続を閉じたときの処理
//   eventStream.onClosed(async () => {
//     clearInterval(interval);
//     clients.delete(eventStream);
//     await eventStream.close();
//   });
//   // }

//   return eventStream.send();
// });

// const clients = new Set();

// export default defineEventHandler(async (event) => {
//   const eventStream = createEventStream(event);
//   const watchword = getRouterParam(event, 'watchword');
//   console.log(`SSEのwatchword: ${watchword}`);

//   if (!watchword) {
//     throw createError({ statusCode: 400, message: 'Watchword is required' });
//   }

//   // クライアントを接続リストに追加
//   clients.add(eventStream);

//   const interval = setInterval(async () => {
//     if (
//       statusData[watchword] !== 'read' &&
//       statusData[watchword] !== 'crush' &&
//       statusData[watchword] !== 'fix' &&
//       statusData[watchword] !== 'result'
//     )
//       return;

//     if (statusSendManager[watchword] === statusData[watchword]) return;

//     statusSendManager[watchword] = statusData[watchword];

//     // すべてのクライアントにデータを送信
//     for (const client of clients) {
//       try {
//         await client.push(statusData[watchword]);
//       } catch (error) {
//         console.error('Error pushing data to client:', error);
//       }
//     }
//   }, 1000);

//   // クライアントが接続を閉じたときの処理
//   eventStream.onClosed(async () => {
//     clearInterval(interval);
//     clients.delete(eventStream);
//     await eventStream.close();
//   });

//   return eventStream.send();
// });
