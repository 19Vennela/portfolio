import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    allowedHosts: true,
    watch: {
      usePolling: true,
      interval: 300
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  }
});
