//player1 player2両方からリクエストが来た時に送られてきたステータス番号を使ってステータスを取得してステータスをアップデートする
import { statusManagement } from '~/utils/statusManagement';
// import { getStatus, updateStatus } from '#imports';
import { getStatus, updateStatus } from '#imports';
import { db } from '~/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const watchword = getRouterParam(event, 'watchword');
    const body = await readBody<{ player: string; status: number }>(event);
    const player = body.player;
    const statusNumber = body.status;
    console.log(`getPlayer: ${player}`);

    if (!body || typeof player !== 'string' || typeof statusNumber !== 'number') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid request body' });
    }

    // watchword の初期化
    if (!statusManagement[watchword]) {
      statusManagement[watchword] = {};
    }

    // プレイヤーのステータスを更新
    statusManagement[watchword][player] = statusNumber;
    db.prepare(`UPDATE statusManage SET ${player} = ? WHERE watchword = ?`).run(statusNumber, watchword);

    // 両プレイヤーのステータスが揃ったか確認
    if (
      statusManagement[watchword]['player1'] !== undefined &&
      statusManagement[watchword]['player2'] !== undefined
    ) {
      const status = getStatus(statusNumber);
      console.log(`getStatus: ${status}`);
      //ステータスの更新
      updateStatus(watchword, status, statusNumber);

      // 必要に応じてレスポンスを返す
      return { message: "Both players' statuses received", gameStatus: statusManagement[watchword] };
    }

    return { message: "Waiting for the other player's status", gameStatus: statusManagement[watchword] };
  } catch (error) {
    // エラー処理
    return {
      error: error.message || 'An error occurred',
    };
  }
});
//dbに保存できるようにする。保存をしたらそのデータを再接続の時にとってこれるようにする
