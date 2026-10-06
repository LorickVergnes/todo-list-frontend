import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    // En développement local (hors Docker), les appels /api sont redirigés vers le backend
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
