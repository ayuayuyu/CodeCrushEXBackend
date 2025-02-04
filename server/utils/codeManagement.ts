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
