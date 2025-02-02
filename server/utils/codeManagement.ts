import { EventEmitter } from 'events';
interface codeManage {
  [watchword: string]: {
    player1: string;
    player2: string;
  };
}
export const codeManagement: codeManage = {}; // グローバルで管理

export const codeManagementEvents = new EventEmitter();
//ステータスを管理する関数
//プレイヤー1,2が同じステータスなのかの確認をしている
//   export const loadStatusDataFromDB = () => {
//     console.log('データベースからステータスデータをロードします...');
//     const rows = statusDB.prepare('SELECT watchword, player1, player2 FROM statusManage').all();
//     for (const row of rows) {
//       statusManagement[row.watchword] = {
//         player1: row.player1,
//         player2: row.player2,
//       };
//     }
//   };

// アプリケーション初期化時にデータ復元
//   loadStatusDataFromDB();
