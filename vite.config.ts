import { defineConfig } from 'vite';

export default defineConfig({
  // Pinned to IPv4 so the screenshot tool (which uses 127.0.0.1) always reaches the dev server.
  server: { host: '127.0.0.1', port: 5190, strictPort: true },
});
