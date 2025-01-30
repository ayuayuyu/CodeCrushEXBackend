export default defineEventHandler(async (event) => {
  const apiUrl: string = 'https://api.paiza.io/runners/get_details';
  try {
    //watchwordを取得
    const jobId = getRouterParam(event, 'jobId');
    //違う場合
    if (!jobId) {
      throw new Error('job_id parameter is missing');
    }
    const response = await $fetch(apiUrl, {
      method: 'GET',
      params: { id: jobId, api_key: 'guest' },
    });
    console.log(`response_jobId:  ${JSON.stringify(response)}`);
    return response;
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: String(error) });
  }
});
