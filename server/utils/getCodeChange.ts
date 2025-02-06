// //それぞれのプレイヤーから受け取ったコードを交換するエンドポイント

// import { Database } from './db';

// export const getCodeChange = async (watchword: string, player1: string, player2: string, event) => {
//   const { cloudflare } = event.context;
//   const db = new Database(cloudflare.env.DB);
//   codeManagement[watchword]['player1'] = player1;
//   codeManagement[watchword]['player2'] = player2;
//   await db.updatePlayerCodeManagement(watchword, player1, 'player1');
//   await db.updatePlayerCodeManagement(watchword, player2, 'player2');
// };
//それぞれのプレイヤーから受け取ったコードを交換するエンドポイント
import { db } from './db';
import { codeManagementEvents } from './codeManagement';

export const getCodeChange = (watchword: string, player1: string, player2: string) => {
  codeManagement[watchword]['player1'] = player1;
  codeManagement[watchword]['player2'] = player2;
  db.prepare(`UPDATE codeManagement SET player1 = ? WHERE watchword = ?`).run(player1, watchword);
  db.prepare(`UPDATE codeManagement SET player2 = ? WHERE watchword = ?`).run(player2, watchword);
  codeManagementEvents.emit(watchword, { player1: player1, player2: player2 });
};
