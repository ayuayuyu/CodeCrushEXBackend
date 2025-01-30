import { EventEmitter } from "events";

// watchword ごとに status を管理するデータ構造
interface statusWatchword {
    [watchword: string]: string; // watchword をキーとして status を文字列で管理
}
// watchword ごとに status を管理するデータ構造
export const statusData: statusWatchword = {};

// 変更を通知するための EventEmitter インスタンスを作成
export const statusDataEvents = new EventEmitter();

// `sharedData` を更新する関数
export const updateStatus = (watchword: string, status: string) => {
    statusData[watchword] = status;
    statusDataEvents.emit(watchword, status); // watchword ごとに変更を通知
};