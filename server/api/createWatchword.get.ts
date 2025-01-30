import { v4 as uuidv4 } from 'uuid';
import { customAlphabet } from 'nanoid';
import db from '~/utils/db';

export default defineEventHandler(() => {
  try {
    //あいことばを作成してルームを作成するエンドポイント
    // 生成時に使う文字の種類
    const charactors = '1234567890';
    // 生成する文字の長さ
    const length = 6;

    const nanoid = customAlphabet(charactors, 10);
    const watchword = nanoid(length);
    // const watchword:string = uuidv4();
    console.log(`create watchword: ${watchword}`);

    if (!watchword) {
      throw createError({ statusCode: 400, message: 'Watchword is required' });
    }

    // データベースに保存
    // const stmt = db.prepare("INSERT INTO watchwords (watchword) VALUES (?)");
    // stmt.run(watchword);
    const stmt = db.prepare(`
      INSERT INTO watchwords (watchword, player1, player2) 
      VALUES (?, ?, ?)
    `);
    stmt.run(watchword, 0, 0);

    return {
      id: 'player1',
      watchword: watchword,
    };
  } catch (error) {
    // エラー処理
    return {
      error: error.message || 'An error occurred',
    };
  }
});
