//それぞれのプレイヤーから受け取ったコードを交換するエンドポイント

import { codeManagementEvents } from './codeManagement';

export const getCodeChange = (watchword: string, player1: string, player2: string) => {
  codeManagement[watchword]['player1'] = player1;
  codeManagement[watchword]['player2'] = player2;
  codeDB.prepare(`UPDATE codeManagement SET player1 = ? WHERE watchword = ?`).run(player1, watchword);
  codeDB.prepare(`UPDATE codeManagement SET player2 = ? WHERE watchword = ?`).run(player2, watchword);
  codeManagementEvents.emit(watchword, { player1: player1, player2: player2 });
};
