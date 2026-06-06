import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://murrietaconcreteworks.com',
  trailingSlash: 'ignore',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
  ],
});
