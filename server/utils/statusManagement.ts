interface statusManage {
  [watchword: string]: {
    player1: number;
    player2: number;
  };
}
export const statusManagement: statusManage = {}; // グローバルで管理
//ステータスを管理する関数
//プレイヤー1,2が同じステータスなのかの確認をしている
export const loadStatusDataFromDB = () => {
  console.log('データベースからステータスデータをロードします...');
  const rows = statusDB.prepare('SELECT watchword, player1, player2 FROM statusManage').all();
  for (const row of rows) {
    statusManagement[row.watchword] = {
      player1: row.player1,
      player2: row.player2,
    };
  }
};

// アプリケーション初期化時にデータ復元
loadStatusDataFromDB();

//   statusDB
//     .prepare(
//       `
//       CREATE TABLE IF NOT EXISTS statusManage (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         watchword TEXT NOT NULL,
//         player1 NUMBER NOT NULL,
//         player2 NUMBER NOT NULL
//       );
//     `,
//     )
//     .run();
