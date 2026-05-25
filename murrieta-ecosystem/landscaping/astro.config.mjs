import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://landscapingmurrieta.com',
  trailingSlash: 'always',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
  ],
});
