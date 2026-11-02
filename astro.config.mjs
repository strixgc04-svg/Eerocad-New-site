// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import { SITE_URL } from './src/lib/site.js';

// https://astro.build/config
export default defineConfig({
  // Every canonical, sitemap entry and JSON-LD @id is derived from this.
  // It must equal the production origin, or the audit's canonical bug returns.
  site: SITE_URL,

  trailingSlash: 'always',

  // Prefetch on hover makes the multi-page architecture feel like the
  // single-page site the client wanted, without the SEO cost.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  integrations: [
    react(),
    mdx(),
    sitemap({
      // Legal pages carry no search value and dilute the sitemap.
      filter: (page) =>
        !page.includes('/privacy-policy/') && !page.includes('/terms/'),
    }),
  ],

  build: {
    // The stylesheet is ~9KB gzipped, above Astro's 4KB auto-inline threshold,
    // so by default it ships as a separate render-blocking request. Inlining
    // removes a round trip from the critical path, which is what actually
    // gates first paint here.
    inlineStylesheets: 'always',
  },

  image: {
    // Tailwind 4 rules have lower precedence than Astro's responsive styles,
    // so leave these off and let Tailwind own sizing.
    responsiveStyles: false,
    layout: 'constrained',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
