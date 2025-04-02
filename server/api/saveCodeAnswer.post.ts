import { db } from '~/utils/db';
interface Answer {
  input: string;
  expected_output: string;
}

interface Answers {
  code: string;
  answer: Answer[];
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Answers>(event);

    if (!body.code || !body.answer) {
      throw createError({ statusCode: 400, message: 'Code and answer are required' });
    }

    // データベースに保存（JSONシリアライズ）
    const stmt = db.prepare(`
      INSERT INTO CodeAnswers (code, answer) 
      VALUES (?, ?)
    `);
    stmt.run(body.code, JSON.stringify(body.answer));

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
});
