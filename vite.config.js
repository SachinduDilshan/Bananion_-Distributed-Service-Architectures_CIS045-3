import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createProxyMiddleware } from 'http-proxy-middleware';

export default defineConfig({
  server: {
    proxy: {
      '/banana-api': {
        target: 'http://marcconrad.com/uob/banana/api.php',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/banana-api/, '')
      }
    }
  }
});
