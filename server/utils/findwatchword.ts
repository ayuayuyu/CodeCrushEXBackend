type Watchword = {
    id: number;
    watchword: string;
};

//送られてきた合言葉があるかどうかを探しあるならtrue、ないならfalseを変える関数
export default function findWatchword(watchwords:Watchword[],target: string):boolean{
    return watchwords.some((entry) => entry.watchword === target);
  }