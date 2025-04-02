import { EventEmitter } from 'events';
import { db } from './db';

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
  console.log(`updateStatusの実行: ${watchword}`);
  statusData[watchword] = status;
  db.prepare('UPDATE watchwords SET status = ? WHERE watchword = ?').run(status, watchword);
  db.prepare('UPDATE statusData  SET status = ? WHERE watchword = ?').run(status, watchword);
  db.prepare('UPDATE statusManage SET player1 = ? WHERE watchword = ?').run(statusNumber, watchword);
  db.prepare('UPDATE statusManage SET player2 = ? WHERE watchword = ?').run(statusNumber, watchword);
  console.log(`statusDataEventの実行`);
  statusDataEvents.emit(watchword, status); // watchword ごとに変更を通知
};

//データベースからステータスデータをロードして `statusData` に復元
const loadStatusDataFromDB = () => {
  console.log('データベースからステータスデータをロードします...');
  const rows = db.prepare('SELECT watchword, status FROM statusData').all();
  for (const row of rows) {
    statusData[row.watchword] = row.status;
  }
};

// アプリケーション初期化時にデータ復元
loadStatusDataFromDB();
