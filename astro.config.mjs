// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['@jsquash/avif', '@jsquash/oxipng'],
    },
    worker: {
      format: 'es',
    },
  },
  site: 'https://resize.kojin.works',
  server: {
    host: true,
  },
});
