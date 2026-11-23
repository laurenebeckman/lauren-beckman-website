// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  site: 'https://laurenebeckman.com',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/blog'),
    }),
  ],

  redirects: {
    '/blog': '/',
    '/blog/first-post': '/',
    '/blog/second-post': '/',
    '/blog/third-post': '/',
    '/blog/markdown-style-guide': '/',
    '/blog/using-mdx': '/',
  },

  fonts: [
      {
          provider: fontProviders.google(),
          name: 'Playfair Display',
          cssVariable: '--font-serif',
          weights: ['400', '700'],
      },
      {
          provider: fontProviders.google(),
          name: 'Inter',
          cssVariable: '--font-sans',
          weights: ['400', '500', '600', '700'],
      },
    ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
