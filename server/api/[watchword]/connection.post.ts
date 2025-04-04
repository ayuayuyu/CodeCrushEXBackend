import getStatus from '~/utils/getStatus';
import { updateStatus } from '~/utils/updateStatus';
export default defineEventHandler(async (event) => {
  try {
    //watchwordを取得
    const watchword = getRouterParam(event, 'watchword');
    const body = await readBody<{ player: string }>(event);

    // バリデーション: player が指定されていない場合
    if (!body?.player || (body.player !== 'player1' && body.player !== 'player2')) {
      throw createError({ statusCode: 400, message: 'Player must be 1 or 2' });
    }

    // バリデーション: watchword が存在しない場合
    if (!watchword) {
      throw createError({ statusCode: 400, message: 'Watchword parameter is missing' });
    }

    // プレイヤー情報を更新または挿入
    const existing = db.prepare('SELECT * FROM watchwords WHERE watchword = ?').get(watchword);

    if (existing) {
      // すでに両方のプレイヤーが登録されている場合はエラー
      if (existing.player1 && existing.player2) {
        throw createError({ statusCode: 400, message: 'Both players are already registered' });
      }
      // 既存の行がある場合、対応するプレイヤーの列を更新
      if (body.player === 'player1') {
        db.prepare('UPDATE watchwords SET player1 = 1 WHERE watchword = ?').run(watchword);
      } else if (body.player === 'player2') {
        db.prepare('UPDATE watchwords SET player2 = 1 WHERE watchword = ?').run(watchword);
      }
    } else {
      throw createError({ statusCode: 400, message: 'Watchword Not Found' });
    }

    console.log(`Player ${body.player} を watchword: ${watchword}に登録`);

    // 両方のプレイヤーが登録済みか確認
    const updated = db.prepare('SELECT * FROM watchwords WHERE watchword = ?').get(watchword);
    if (updated?.player1 && updated?.player2) {
      // 両プレイヤーが登録済みならステータスを変更してSSE送信
      console.log(`watchword: ${watchword}の準備完了！`);
      //SSE通信を開始、ステータスをexplanationに変更する。
      const status = getStatus(1);
      db.prepare('UPDATE statusManage SET player1 = ? WHERE watchword = ?').run(1, watchword);
      db.prepare('UPDATE statusManage SET player2 = ? WHERE watchword = ?').run(1, watchword);
      console.log(`getStatus: ${status}`);
      //ステータスの更新
      updateStatus(watchword, status, 1);
    }

    return { connection: true };
  } catch (error) {
    // エラー処理
    return {
      error: error.message || 'An error occurred',
    };
  }
});
