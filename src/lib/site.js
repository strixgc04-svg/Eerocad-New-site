/**
 * Single source of truth for the production origin.
 *
 * Imported by astro.config.mjs (which cannot import TypeScript), and re-exported
 * from src/lib/schema.ts for use in components. Changing it here changes the
 * canonicals, the sitemap and every JSON-LD @id at once.
 */
export const SITE_URL = 'https://eerocad.com';
