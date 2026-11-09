/**
 * Single source of truth for the production origin.
 *
 * Imported by astro.config.mjs (which cannot import TypeScript), and re-exported
 * from src/lib/schema.ts for use in components. Changing it here changes the
 * canonicals, the sitemap and every JSON-LD @id at once.
 */
export const SITE_URL = 'https://eerocad.com';

/**
 * Google Tag Manager container.
 *
 * Empty string disables it entirely — the layout renders nothing at all,
 * which is what a fork or a staging build without its own container should
 * do rather than report into this one.
 */
export const GTM_ID = 'GTM-MR6H65NB';
