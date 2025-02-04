import { EventEmitter } from 'events';
import { Database } from './db';

// watchword ごとに status を管理するデータ構造
interface statusWatchword {
  [watchword: string]: string; // watchword をキーとして status を文字列で管理
}
// watchword ごとに status を管理するデータ構造
export const statusData: statusWatchword = {};

// 変更を通知するための EventEmitter インスタンスを作成
export const statusDataEvents = new EventEmitter();

// `sharedData` を更新する関数
export const updateStatus = async (watchword: string, status: string, statusNumber: number, event) => {
  const { cloudflare } = event.context;
  const db = new Database(cloudflare.env.DB);
  statusData[watchword] = status;
  await db.updateStatusWatchwords(watchword, status);
  await db.updateStatusData(watchword, status);
  await db.updateStatusManage(watchword, statusNumber, 'player1');
  await db.updateStatusManage(watchword, statusNumber, 'player2');
  statusDataEvents.emit(watchword, status); // watchword ごとに変更を通知
};

//データベースからステータスデータをロードして `statusData` に復元
// const loadStatusDataFromDB = () => {
//   console.log('データベースからステータスデータをロードします...');
//   const rows = db.prepare('SELECT watchword, status FROM statusData').all();
//   for (const row of rows) {
//     statusData[row.watchword] = row.status;
//     // statusDataEvents.emit(row.watchword, row.status); // 更新イベントを通知
//   }
// };

// // アプリケーション初期化時にデータ復元
// loadStatusDataFromDB();

// データベースからステータスデータをロードして `statusData` に復元
export const loadStatusDataFromDB = async (cloudflare) => {
  console.log('データベースからステータスデータをロードします...');
  const db = new Database(cloudflare.env.DB);
  const rows = await db.getStatusData(); // 非同期で全データを取得

  // statusData のロード
  for (const row of rows) {
    statusData[row.watchword] = row.status;
    statusDataEvents.emit(row.watchword, row.status); // 更新イベントを通知
  }

  // statusManagement のロード
  const managementRows = await db.getStatusManage(); // 非同期で全データを取得
  for (const row of managementRows) {
    statusManagement[row.watchword] = {
      player1: row.player1,
      player2: row.player2,
    };
  }
  // codeManagement のロード
  const codeRows = await db.getCodeManagement(); // 非同期で全データを取得
  for (const row of codeRows) {
    statusManagement[row.watchword] = {
      player1: row.player1,
      player2: row.player2,
    };
  }
};
