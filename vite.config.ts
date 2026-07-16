import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    cssMinify: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
