import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), jsconfigPaths(), svgrPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        rewrite: path => path.replace(/^\/api/, ''),
        changeOrigin: true,
      },
      '/images': {
        target: 'http://localhost:5001',
      },
    },
  },
});
