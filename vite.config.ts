import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // 👇 Must match your repo name exactly
  base: '/birthday-website/',

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // safer alias for imports
    },
  },

  build: {
    outDir: 'dist', // GitHub Pages deploys this folder
  },

  server: {
    hmr: true, // keep hot reload simple
  },
});
