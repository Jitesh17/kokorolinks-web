// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite'; // NEW: Import Vite plugin
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kokorolinks.com', 
  
  // 1. Tailwind v4 lives here now (in Vite plugins)
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // 2. Astro Integrations (Sitemap goes here)
  integrations: [
    sitemap()
  ],
});