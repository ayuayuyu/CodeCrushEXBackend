const statusInfo = [
  {
    id: 1,
    status: 'read',
  },
  {
    id: 2,
    status: 'delete',
  },
  {
    id: 3,
    status: 'fix',
  },
  {
    id: 4,
    status: 'answer',
  },
];
// player1 と player2どちらともから次への送信が来たらステータスを変更する
//idがなんの時のステータスを送る関数
export default function getStatus(id: number) {
  const statusObj = statusInfo.find((item) => item.id === id);
  return statusObj ? statusObj.status : null; // 一致しない場合は null を返す
}
