import { codeManagement } from '~/utils/codeManagement';
import { getCodeChange } from '~/utils/getCodeChange';
import diffCode from '~/utils/diffCode';
import { Database } from '~/utils/db';

const oldCode =
  '#include <stdio.h>\nint main() {// メッセージを出力printf("Hello, World!\\n");\n return 0;\n}';

// 変更したコードを受け取って交換するエンドポイント(newCodeを受け取る)

export default defineEventHandler(async (event) => {
  try {
    const { cloudflare } = event.context;
    const db = new Database(cloudflare.env.DB);
    const watchword = getRouterParam(event, 'watchword');
    const body = await readBody<{ player: string; code: string }>(event);
    const player = body.player;
    const code = body.code;
    console.log(`codeはこれだよ!: ${code}`);

    if (!body || typeof player !== 'string' || typeof code !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid request body' });
    }

    if (!codeManagement[watchword]) {
      codeManagement[watchword] = {};
    }

    codeManagement[watchword][player] = code;

    await db.updatePlayerCodeManagement(watchword, code, player);

    if (
      codeManagement[watchword]['player1'] !== undefined &&
      codeManagement[watchword]['player2'] !== undefined
    ) {
      console.log(
        `Player1: ${codeManagement[watchword]['player1']}, Player2: ${codeManagement[watchword]['player2']}次のステータスに変更します。`,
      );
      const player1 = diffCode(oldCode, codeManagement[watchword]['player1']);
      const player2 = diffCode(oldCode, codeManagement[watchword]['player2']);
      console.log(`player1: ${player1}`);
      console.log(`player2: ${player2}`);
      //これをreturn { diff: changeCode };で送るようなsse通信のやつを書く
      getCodeChange(watchword, player1, player2, event);
    }

    //それぞれプレイヤーから受け取ったら差分を出したコードをsse通信で送る
    console.log(code);
    return { sendCode: code };
  } catch (error) {
    // エラー処理
    return {
      error: error.message || 'An error occurred',
    };
  }
});
