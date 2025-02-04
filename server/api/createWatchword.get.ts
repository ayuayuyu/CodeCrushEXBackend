import { customAlphabet } from 'nanoid';
import { Database } from '~/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const { cloudflare } = event.context;
    const db = new Database(cloudflare.env.DB);
    console.log(db);
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

    // await db.init();

    // データベースに保存
    // const stmt = db.prepare("INSERT INTO watchwords (watchword) VALUES (?)");
    // stmt.run(watchword);
    // データベースに保存 (各INSERTをawaitで実行)
    await db.insertWatchwords(watchword, 'waiting', 0, 0);
    console.log(`insertWatchwords`);
    await db.insertStatusData(watchword, 'waiting');
    console.log(`insertStatusData`);
    await db.insertStatusManage(watchword, 0, 0);
    console.log(`insertStatusManage`);
    await db.insertCodeManagement(watchword, 'NULL', 'NULL');
    console.log(`insertCodeManagemen`);
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
