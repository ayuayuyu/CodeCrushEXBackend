import { codeManagement } from '~/utils/codeManagement';
import { getCodeChange } from '~/utils/getCodeChange';
import diffCode from '~/utils/diffCode';
import { db } from '~/utils/db';

const oldCode = `
#include <stdio.h> 
int my_sum(int* ,int); 
int main(){ 
	int ary[5] = {1,2,3,4,5};
	int sum = 0;
	int i;
	sum = my_sum(ary,sizeof(ary) / sizeof(int));
	for(i=0;i<5;i++){
		printf("%d ",ary[i]);
	}
	printf("\\n");
	printf("sum = %d\\n",sum);	
	return 0;
}
int my_sum(int* ary,int size){
	int sum = 0;
	int i;
	
	for(i=0;i<size;i++){
		sum += *(ary + i);
	}
	return sum;
}`;

// 変更したコードを受け取って交換するエンドポイント(newCodeを受け取る)

export default defineEventHandler(async (event) => {
  try {
    const watchword = getRouterParam(event, 'watchword');
    const body = await readBody<{ player: string; code: string }>(event);
    const player = body.player;
    const code = body.code;

    if (!body || typeof player !== 'string' || typeof code !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid request body' });
    }

    if (!codeManagement[watchword]) {
      codeManagement[watchword] = {};
    }

    codeManagement[watchword][player] = code;

    db.prepare(`UPDATE codeManagement SET ${player} = ? WHERE watchword = ?`).run(code, watchword);

    if (
      codeManagement[watchword]['player1'] !== undefined &&
      codeManagement[watchword]['player2'] !== undefined
    ) {
      const player1 = diffCode(oldCode, codeManagement[watchword]['player1']);
      const player2 = diffCode(oldCode, codeManagement[watchword]['player2']);
      // console.log(`\n ---------------------\n player1: ${player1} \n ---------------------\n`);
      // console.log(`player2: ${player2} \n ---------------------\n`);
      //これをreturn { diff: changeCode };で送るようなsse通信のやつを書く
      getCodeChange(watchword, player1, player2);
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
