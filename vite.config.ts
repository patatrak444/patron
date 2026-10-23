import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Percorsi relativi: la build funziona sotto /patron/ su GitHub Pages
  base: './',
  build: {
    target: 'es2022',
    // Three.js da solo pesa circa 530 kB: è previsto
    chunkSizeWarningLimit: 800,
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
