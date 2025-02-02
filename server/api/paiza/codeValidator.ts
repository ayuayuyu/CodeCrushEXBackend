interface resultResponses {
  id: string;
  language: string;
  status: string;
  build_stdout: string | null;
  build_stderr: string | null;
  build_exit_code: number | null;
  build_time: number | null;
  build_memory: number | null;
  build_result: string | null;
  stdout: string | null;
  stderr: string | null;
  exit_code: number | null;
  time: number | null;
  memory: number | null;
  result: string | null;
}
//もしdbに問題と答えがあるならそのidをpostで受け取ってその問題の答えと入力を受けとって正解判定をする
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const testCases: Array<{ input: string; expected_output: string }> = [
    { input: '1 2', expected_output: 'Hello, World!簡単なC言語プログラムです2つの整数を入力してください: 3' },
    {
      input: '5 10',
      expected_output: 'Hello, World!簡単なC言語プログラムです2つの整数を入力してください: 15',
    },
    { input: '0 0', expected_output: 'Hello, World!簡単なC言語プログラムです2つの整数を入力してください: 0' },
  ];

  for (const testCase of testCases) {
    const apiUrl = 'https://api.paiza.io/runners/create';
    const response = await $fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        source_code: body.code,
        language: 'c',
        input: testCase.input,
        api_key: 'guest',
      }),
    });

    const jobId: string = response.id;
    console.log(`jobId: ${jobId}`);

    const jobApiUrl: string = 'https://api.paiza.io/runners/get_details';

    // ジョブが完了するまで待機
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    let resultResponse: resultResponses;
    do {
      await sleep(1000);
      resultResponse = await $fetch(jobApiUrl, {
        method: 'GET',
        params: { id: jobId, api_key: 'guest' },
      });
    } while (resultResponse.status !== 'completed');

    const buildErro = resultResponse.build_stderr;
    if (buildErro) {
      console.log(`build_erro: ${buildErro}`);
      return { status: 'build_erro', message: buildErro };
    }

    const erro = resultResponse.stderr;
    if (erro) {
      console.log(`erro: ${erro}`);
      return { status: 'erro', message: erro };
    }
    // stdout が null の場合は空文字列にする
    const output = resultResponse.stdout ? resultResponse.stdout.trim() : '';

    if (!output) {
      return { status: 'NG', message: 'Null' };
    }
    if (output !== testCase.expected_output) {
      return { status: 'NG', message: `Failed on input: ${testCase.input}`, output };
    }
  }
  return { status: 'OK', message: 'All test cases passed' };
});
