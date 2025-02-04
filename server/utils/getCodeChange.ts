//それぞれのプレイヤーから受け取ったコードを交換するエンドポイント

import { codeManagementEvents } from './codeManagement';
import { Database } from './db';

export const getCodeChange = async (watchword: string, player1: string, player2: string, event) => {
  const { cloudflare } = event.context;
  const db = new Database(cloudflare.env.DB);
  codeManagement[watchword]['player1'] = player1;
  codeManagement[watchword]['player2'] = player2;
  await db.updatePlayerCodeManagement(watchword, player1, 'player1');
  await db.updatePlayerCodeManagement(watchword, player2, 'player2');
};
