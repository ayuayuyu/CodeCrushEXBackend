export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/sse')) {
      const id = env.SSEMANAGER.idFromName('sse-instance');
      const obj = env.SSEMANAGER.get(id);
      return obj.fetch(request);
    }

    if (url.pathname === '/send') {
      const id = env.SSEMANAGER.idFromName('sse-instance');
      const obj = env.SSEMANAGER.get(id);
      const data = await request.json();
      await obj.sendMessage(data);
      return new Response('Message sent', { status: 200 });
    }

    return new Response('Not Found', { status: 404 });
  },
};
