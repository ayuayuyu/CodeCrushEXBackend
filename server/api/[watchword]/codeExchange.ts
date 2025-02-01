import diffCode from '~/utils/diffCode';

const oldCode = 'asdfsadfdsfdsfddffdsfafdsfdsfddsdsd';

const newCode = 'fsdfsadfdsfdsfdsfdsfdsfdsfdsafdsfds';

// 変更したコードを受け取って交換するエンドポイント(newCodeを受け取る)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ player: string; code: string }>(event);

    //それぞれプレイヤーから受け取ったら差分を出したコードをsse通信で送る
    const changeCode = diffCode(oldCode, newCode);
    return { diff: changeCode };
  } catch (error) {
    // エラー処理
    return {
      error: error.message || 'An error occurred',
    };
  }
});
// const oldCode =
//   '#include <stdio.h>\
//   int main() {\
//   // メッセージを出力\
//   printf("Hello, World!");\
//   printf("簡単なC言語プログラムです");\
//   //変数を宣言して値を出力\
//   int number = 42;\
//   printf("数値: %d", number);\
//   return 0;\
//   }';
// const newCode =
//   '#include <stdio.h>\
//   int main() {\
//   // メッセージを出力\
//   printf("Hello, World!");\
//   printf("簡単なC言語プログラムです");\
//   \
//   //変数を宣言して値を出力\
//   int number = ;\
//   printf("数値: %d", );\
//   return 0;\
//   }';
