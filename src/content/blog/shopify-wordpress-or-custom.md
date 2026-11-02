---
title: 'Shopify, WordPress or a custom build: how to choose'
description: 'A straight comparison of the three realistic platform choices for a UK business website, and the question that usually settles it.'
pubDate: 2026-10-27
tags: ['web design', 'shopify', 'wordpress', 'platforms']
draft: false
---

Most platform arguments are really arguments about what the person arguing
enjoys building. Here is a more useful frame: the right platform is the one
that is cheapest to *own* for the next three years, given who will be looking
after it.

## The question that usually settles it

**Who edits this site after launch, and how often?**

- **Daily, by a non-technical team** → WordPress, usually.
- **You sell products** → Shopify, almost always.
- **Rarely, and speed or search performance matters a lot** → a static build.

Everything below is detail on top of that.

## Shopify

**Choose it if you sell physical products.** Shopify handles the things that
are genuinely hard and genuinely boring: payments, tax, inventory, shipping
rules, checkout security, PCI compliance. Rebuilding that on another platform
is a bad use of money.

**Strengths**

- Checkout is the most optimised part of the platform, and you cannot easily
  break it
- Hosting, security and PCI are handled
- A large app ecosystem for the things you have not thought of yet
- Scales through traffic spikes without you doing anything

**Trade-offs**

- Monthly platform fee plus transaction fees, plus app subscriptions that
  accumulate quietly
- Content and blogging are weaker than WordPress
- Deep checkout customisation is restricted below Shopify Plus
- URL structure is partly fixed — `/products/`, `/collections/` — which
  constrains some SEO approaches

**Watch out for:** app creep. Ten apps at £15 a month is £1,800 a year and a
measurable hit to page speed. Audit them twice a year.

## WordPress

**Choose it if content is the engine and a non-technical team publishes
often.** It still powers a large share of the web for good reasons: the editing
experience is familiar, and you can hire for it anywhere.

**Strengths**

- Best-in-class content management and editorial workflow
- Enormous plugin ecosystem
- Easy to hire for, which matters when you change supplier
- Mature SEO tooling

**Trade-offs**

- Security is your responsibility. Most WordPress compromises come through
  out-of-date plugins rather than core
- Performance needs active management — caching, image optimisation, plugin
  discipline
- Plugin conflicts are a real maintenance cost
- "WordPress is free" is not true once you add hosting, premium plugins and
  maintenance

**Watch out for:** page builders. They speed up the first build and slow down
every page afterwards. If you go this route, budget for performance work.

## A custom or static build

Modern static frameworks — Astro, Next, and similar — build to HTML at deploy
time and ship very little JavaScript. We use Astro for this.

**Choose it if the site is primarily marketing, speed matters, and content
changes in batches rather than hourly.**

**Strengths**

- Fastest option by a wide margin, which matters for Core Web Vitals and for
  paid landing pages
- Minimal attack surface — no database, no plugin layer
- Total control over markup, structured data and URL structure
- Hosting is cheap or free on a CDN

**Trade-offs**

- Editing requires either a developer or a headless CMS on top
- Smaller hiring pool than WordPress
- Dynamic features need a service behind them
- Less "just install a plugin" convenience

**Watch out for:** shipping it without a CMS when the client needs to edit
weekly. That is how a fast site becomes an expensive bottleneck.

## Side by side

| | Shopify | WordPress | Static build |
| --- | --- | --- | --- |
| Best for | Product sales | Content-heavy sites | Marketing sites, landing pages |
| Non-technical editing | Good | Best | Needs a CMS layer |
| Speed out of the box | Fair | Needs work | Best |
| Security burden | Shopify's | Yours | Minimal |
| Ongoing cost | Platform + apps | Hosting + plugins + maintenance | Hosting, often minimal |
| Hiring pool | Large | Largest | Smaller |

## A few honest notes

**"Headless Shopify" is not automatically better.** It is a real option for
large catalogues with specific needs, and it roughly doubles the complexity.
For most UK SMEs a well-built standard Shopify theme outperforms a headless
build that nobody can maintain.

**Your platform is not why you are not ranking.** All three can rank well. If
a site is invisible in search, the cause is almost always content, site
structure or technical configuration — not the CMS.

**Migrating later is normal and survivable**, provided the redirects are done
properly. Do not over-engineer the first build to avoid a migration you may
never need.

## How we decide

We ask three questions:

1. **Do you sell products online?** If yes, Shopify unless there is a strong
   reason otherwise.
2. **Who publishes content, how often, and how technical are they?** Frequent
   non-technical publishing points to WordPress.
3. **Is this primarily a marketing site where speed and search performance are
   the point?** That points to a static build.

If the answers conflict, the maintenance question wins. A slightly slower site
your team can actually update beats a faster one they cannot touch.

---

If you want a straight recommendation for your situation,
[book a 30-minute call](/contact/) or read how we approach
[web design and development](/services/web-design-development/).
