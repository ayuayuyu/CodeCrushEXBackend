import { db } from './db';
interface statusManage {
  [watchword: string]: {
    player1: number;
    player2: number;
  };
}
export const statusManagement: statusManage = {}; // グローバルで管理
//ステータスを管理する関数
//プレイヤー1,2が同じステータスなのかの確認をしている
const loadStatusDataFromDB = () => {
  console.log('データベースからステータスデータをロードします...');
  const rows = db.prepare('SELECT watchword, player1, player2 FROM statusManage').all();
  for (const row of rows) {
    statusManagement[row.watchword] = {
      player1: row.player1,
      player2: row.player2,
    };
  }
};

// アプリケーション初期化時にデータ復元
loadStatusDataFromDB();
