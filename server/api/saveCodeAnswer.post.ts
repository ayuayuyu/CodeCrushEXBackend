import db from '~/utils/db';
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ code: string; answer: number }>(event);

    if (!body.code || !body.answer) {
      throw createError({ statusCode: 400, message: 'Watchword is required' });
    }

    // データベースに保存
    const stmt = db.prepare(`
    INSERT INTO CodeAnswers (code,answer) 
    VALUES (?, ?)
  `);
    stmt.run(body.code, body.answer);

    return { success: true };
  } catch (error) {
    // エラー処理
    return {
      error: error.message || 'An error occurred',
    };
  }
});
