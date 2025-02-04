interface statusManage {
  [watchword: string]: {
    player1: number;
    player2: number;
  };
}
export const statusManagement: statusManage = {}; // グローバルで管理
//ステータスを管理する関数
//プレイヤー1,2が同じステータスなのかの確認をしている
