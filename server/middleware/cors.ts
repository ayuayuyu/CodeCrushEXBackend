import { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
  const res = event.node.res;

  // 必要なCORSヘッダーを追加
  res.setHeader('Access-Control-Allow-Origin', '*'); // フロントエンドのURL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflightリクエスト (OPTIONS) に対応
  if (event.node.req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
  }
});
