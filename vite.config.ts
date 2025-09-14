// vite.config.ts (project root)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Externalize pdfjs-dist so Rollup/Vite won't try to resolve/bundle it
      external: ['pdfjs-dist'],
    },
  },
});
