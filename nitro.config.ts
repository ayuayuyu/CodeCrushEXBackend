//https://nitro.unjs.io/config
import nitroCloudflareBindings from 'nitro-cloudflare-dev';
export default defineNitroConfig({
  srcDir: 'server',
  modules: [nitroCloudflareBindings],

  experimental: {
    websocket: true,
  },

  compatibilityDate: '2025-02-07',
});