import { customAlphabet } from 'nanoid';
import { db } from '~/utils/db';

export default defineEventHandler(() => {
  try {
    //あいことばを作成してルームを作成するエンドポイント
    const charactors = '1234567890';
    const length = 6;

    const nanoid = customAlphabet(charactors, 10);
    const watchword = nanoid(length);
    console.log(`create watchword: ${watchword}`);

    if (!watchword) {
      throw createError({ statusCode: 400, message: 'Watchword is required' });
    }

    // データベースに保存
    const stmt = db.prepare(`
      INSERT INTO watchwords (watchword,status, player1, player2) 
      VALUES (?, ? , ?, ?)
    `);
    stmt.run(watchword, 'watting', 0, 0);

    const stmt1 = db.prepare(`
      INSERT INTO statusData (watchword,status) 
      VALUES (?, ?)
    `);
    stmt1.run(watchword, 'watting');

    const stmt2 = db.prepare(`
      INSERT INTO statusManage (watchword, player1, player2) 
      VALUES (?, ?,?)
    `);
    stmt2.run(watchword, 0, 0);

    const stmt3 = db.prepare(`
      INSERT INTO codeManagement (watchword, player1, player2) 
      VALUES (?, ?,?)
    `);
    stmt3.run(watchword, 'NULL', 'NULL');

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
