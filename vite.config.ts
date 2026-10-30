import { defineConfig } from 'vite';

export default defineConfig({
  // Relative, so the built demo works from any folder (GitHub Pages serves it under /brush3d-renderer/main/ and /pr-<n>/).
  base: './',
  // Pinned to IPv4 so the screenshot tool (which uses 127.0.0.1) always reaches the dev server.
  server: { host: '127.0.0.1', port: 5190, strictPort: true },
});
