interface codeExecutionRequest {
  source_code: string;
  language: string;
  input: string;
  api_key: string;
  longpoll: boolean;
}
const apiUrl = 'https://api.paiza.io/runners/create';
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<codeExecutionRequest>(event);
    if (
      !body ||
      typeof body.source_code !== 'string' ||
      typeof body.language !== 'string' ||
      typeof body.input !== 'string' ||
      typeof body.api_key !== 'string' ||
      typeof body.longpoll !== 'boolean'
    ) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid request body' });
    }
    const response = await $fetch(apiUrl, {
      method: 'POST',
      body: body, // リクエストボディをそのまま送信
    });
    console.log(`response_run:  ${response}`);
    return response; // JSONレスポンスを返す
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: String(error) });
  }
});
