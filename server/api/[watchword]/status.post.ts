//player1 player2両方からリクエストが来た時に送られてきたステータス番号を使ってステータスを取得してステータスをアップデートする
import { statusManagement } from '~/utils/statusManagement';

export default defineEventHandler(async (event) => {
  try {
    const watchword = getRouterParam(event, 'watchword');
    const body = await readBody<{ player: string; status: number }>(event);
    const player = body.player;
    console.log(`getPlayer: ${player}`);

    if (!body || typeof player !== 'string' || typeof body.status !== 'number') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid request body' });
    }

    // watchword の初期化
    if (!statusManagement[watchword]) {
      statusManagement[watchword] = {};
    }

    // プレイヤーのステータスを更新
    statusManagement[watchword][player] = body.status;

    // 両プレイヤーのステータスが揃ったか確認
    if (statusManagement[watchword]['player1'] !== undefined && statusManagement[watchword]['player2'] !== undefined) {
      console.log(
        `Player1: ${statusManagement[watchword][1]}, Player2: ${statusManagement[watchword][2]}次のステータスに変更します。`,
      );

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
