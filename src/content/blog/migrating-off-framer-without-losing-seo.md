---
title: 'Migrating off Framer without losing your SEO'
description: 'The four things that break when you move a Framer site to a custom domain or a new stack, and how to check each one before you lose traffic.'
pubDate: 2026-11-01
tags: ['seo', 'framer', 'migration', 'web design']
draft: false
---

Framer is a genuinely good tool. Where sites get into trouble is the move
off it — or more often, the half-move, where a custom domain is pointed at a
Framer build that was never configured for it.

We rebuilt our own site off Framer recently. These are the four failures worth
checking, in the order they cost you the most traffic.

## 1. Inner pages that return 404 to crawlers

This is the one that does real damage, and it is close to invisible from
inside a browser.

A Framer site ships a client-side router. Click a nav link and the URL changes,
the page renders, and everything looks correct — because the router already has
every route in the bundle. But if the host is only serving the homepage file,
then a *direct* request to `/about` has nothing to return.

The result: visitors who click through are fine. Anyone who refreshes, follows
a shared link, arrives from an ad, or crawls the site gets a 404.

**How to check**, without any tooling:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://yoursite.com/about
```

If that returns `404` while the page loads fine in your browser, every inner
page on your site is invisible to Google. Test each URL in your sitemap, not
just one.

Google does not render pages that return a 404 status. There is no partial
credit here — the content simply does not exist as far as search is concerned.

## 2. Canonical tags pointing at the wrong domain

Framer publishes to a `yourname.framer.ai` subdomain. If you point a custom
domain at a build that still thinks it lives on the subdomain, every page ships
a canonical tag like this:

```html
<link rel="canonical" href="https://yourname.framer.ai/" />
```

That tag tells Google: *this page is a duplicate, index the other one instead.*
Your real domain accumulates no ranking, and search results point at the Framer
subdomain.

**How to check:**

```bash
curl -s https://yoursite.com/ | grep -i canonical
```

The URL in that tag should be your own domain. If it is not, you are actively
instructing search engines to ignore your brand domain.

The same applies to `og:url`, which affects how links render when shared, and
to any hard-coded absolute links in the build — we found CTA buttons pointing
back at the subdomain, quietly sending people off-domain mid-funnel.

## 3. robots.txt and sitemap living on the wrong host

Both are **host-scoped**. A `robots.txt` at `yourname.framer.ai/robots.txt`
says nothing about `yoursite.com`, and a sitemap listing subdomain URLs cannot
be submitted for your domain's Search Console property.

A missing `robots.txt` is not itself harmful — crawlers treat a 404 as "no
restrictions". The real loss is the missing sitemap, plus the fact that the one
that does exist reinforces the subdomain as the canonical home.

## 4. Two live copies of the same site

This is the one people forget at cutover. Once the new site is live, the Framer
version is usually still published, still indexable, and still carrying
self-referencing canonicals.

You now have two complete copies of your content competing with each other, and
Google picks which to show.

**At cutover:**

- Unpublish the Framer site, or set it to be hidden from search engines.
- If you cannot redirect from it (Framer does not generally let you 301 from
  the subdomain), use Search Console's removal tool for that host.
- Check for other copies. A public GitHub repository containing an exported
  build is a third copy — make it private.

## The migration checklist

Work through this in order:

1. **Inventory every URL.** Pull them from the existing sitemap, Search Console
   and your analytics. Include anything with inbound links, even if it is
   orphaned in your navigation.
2. **Map old to new.** Every old URL gets a destination. Where a page has no
   equivalent, send it to the nearest useful parent — not the homepage, which
   Google frequently treats as a soft 404.
3. **Keep slugs where you can.** Every change is a redirect to maintain and a
   small amount of signal diluted. Only rename where there is a clear reason.
4. **Set up 301s, not 302s.** Permanent, not temporary. A 302 asks Google to
   keep the old URL indexed.
5. **Verify the status codes before launch**, on staging if possible.
6. **Check canonicals on the new build** — they should be self-referencing and
   on your own domain.
7. **Submit the new sitemap**, and keep the old one accessible for a short
   while so Google can process the redirects.
8. **Fix the `www` certificate.** A `www` subdomain that fails TLS is a dead
   end for anyone who types it and for any link that uses it. Ours did, and it
   took one DNS record to resolve.
9. **Watch Search Console** for a few weeks. Expect some fluctuation; what you
   are looking for is coverage errors and a sustained drop rather than a
   wobble.

## What we would do differently

Two things.

**Check the status codes much earlier.** We assumed the site was fine because
it worked in a browser. It had been serving 404s on ten of eleven pages for
some time, and nothing in the browsing experience surfaced that. One `curl`
loop would have caught it.

**Decide the canonical domain before anything else.** Most of the problems
above are downstream of a single question nobody answered explicitly: which
hostname is the real site? Answer that first, configure everything to agree
with it, and the rest follows.

---

If you are moving off Framer, WordPress or anything else and want the
redirects done properly, that is part of
[how we build](/services/web-design-development/).
[Book a call](/contact/).
