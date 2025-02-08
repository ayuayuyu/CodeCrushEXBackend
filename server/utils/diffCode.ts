import { DiffMatchPatch } from 'diff-match-patch-ts';

export default function diffCode(oldCode: string, newCode: string) {
  const dmp = new DiffMatchPatch();
  const diff = dmp.diff_main(oldCode, newCode);
  dmp.diff_cleanupSemantic(diff);

  let modifiedCode = '';

  for (let i = 0; i < diff.length; i++) {
    const [operation, text] = diff[i];

    if (operation === -1) {
      // 削除された部分に `//del` を追加するが、削除内容は表示しない
      modifiedCode += '/*del*/';
    } else {
      // 追加またはそのままの部分は維持
      modifiedCode += text;
    }
  }

  return modifiedCode;
}
