const statusInfo = [
    {
        "id" : 1,
        "status" :  "explanation"
    },
    {
        "id" : 2,
        "status" :  "read"
    },
    {
        "id" : 3,
        "status" :  "crush"
    },
    {
        "id" : 4,
        "status" :  "fix"
    },
    {
        "id" : 6,
        "status" :  "result"
    },
];
// player1 と player2どちらともから次への送信が来たらステータスを変更する
//また、ステータスが変更されたらSSE通信をするようにする 
export default function getStatus(id:number){
    const statusObj = statusInfo.find(item => item.id === id);
    return statusObj ? statusObj.status : null;  // 一致しない場合は null を返す
}