import { EventEmitter } from 'events';

// watchword ごとに status を管理するデータ構造
interface statusWatchword {
  [watchword: string]: string; // watchword をキーとして status を文字列で管理
}
// watchword ごとに status を管理するデータ構造
export const statusData: statusWatchword = {};

// 変更を通知するための EventEmitter インスタンスを作成
export const statusDataEvents = new EventEmitter();

// `sharedData` を更新する関数
export const updateStatus = (watchword: string, status: string, statusNumber: number) => {
  statusData[watchword] = status;
  db.prepare('UPDATE watchwords SET status = ? WHERE watchword = ?').run(status, watchword);
  db.prepare('UPDATE statusData  SET status = ? WHERE watchword = ?').run(status, watchword);
  db.prepare('UPDATE statusManage SET player1 = ? WHERE watchword = ?').run(statusNumber, watchword);
  db.prepare('UPDATE statusManage SET player2 = ? WHERE watchword = ?').run(statusNumber, watchword);
  statusDataEvents.emit(watchword, status); // watchword ごとに変更を通知
};

//データベースからステータスデータをロードして `statusData` に復元
const loadStatusDataFromDB = () => {
  console.log('データベースからステータスデータをロードします...');
  const rows = db.prepare('SELECT watchword, status FROM statusData').all();
  for (const row of rows) {
    statusData[row.watchword] = row.status;
    // statusDataEvents.emit(row.watchword, row.status); // 更新イベントを通知
  }
};

// アプリケーション初期化時にデータ復元
loadStatusDataFromDB();
