import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api/banana': {
        target: 'https://marcconrad.com/uob/banana/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/banana/, ''),
      },
    },
  },
  
  plugins: [react()],
});

