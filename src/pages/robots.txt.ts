import type { APIRoute } from 'astro';

/*
 * Generated from `site` so it can never point at the wrong host.
 *
 * Content-Signal is Cloudflare's voluntary signal. There is no confirmed
 * Google support, so treat it as declaring a preference, not access control.
 *
 * `ai-train` is a business decision. It is set to `yes` because the larger
 * risk for an agency nobody has heard of is invisibility, not content reuse.
 * Change it if the owner decides otherwise.
 *
 * Note: a bot with its own group ignores the `*` group entirely (RFC 9309),
 * so any named group added here must repeat the Content-Signal line.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;

  const body = `User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
