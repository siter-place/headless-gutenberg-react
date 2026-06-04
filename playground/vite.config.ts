import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/wp-json': {
        target: 'https://lovable-wp-integration.local',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
