---
title: 'Core Web Vitals for small business websites'
description: 'What LCP, INP and CLS actually measure, the handful of things that usually cause failures, and how to check your own site for free.'
pubDate: 2026-11-02
tags: ['performance', 'seo', 'core web vitals']
draft: false
---

Core Web Vitals get discussed as an SEO checkbox. They are better understood
as a measure of whether your site feels broken on a mid-range Android phone on
a train — which is where a lot of your traffic actually is.

There are three, and most failures come from a short list of causes.

## The three metrics

### LCP — Largest Contentful Paint

**How long until the biggest thing on screen appears.** Usually your hero
image or headline.

- Good: under 2.5s
- Needs work: 2.5–4s
- Poor: over 4s

### INP — Interaction to Next Paint

**How quickly the page responds when someone taps something.** This replaced
First Input Delay in 2024, and it is stricter: FID measured only the first
interaction and only the delay before processing. INP measures every
interaction through to the next frame being painted.

- Good: under 200ms
- Needs work: 200–500ms
- Poor: over 500ms

### CLS — Cumulative Layout Shift

**How much the page jumps around while loading.** The reason you tap the wrong
button because an ad loaded above it.

- Good: under 0.1
- Needs work: 0.1–0.25
- Poor: over 0.25

## Lab data vs field data

This distinction matters and is frequently missed.

- **Lab data** is a simulated test — Lighthouse in your browser. Repeatable,
  useful for debugging, and not what Google uses for ranking.
- **Field data** comes from the Chrome User Experience Report: real Chrome
  users on real devices and connections. This is what counts.

A site can score 100 in Lighthouse and still fail in the field, because real
users are on slower devices than your laptop. Check field data in
[PageSpeed Insights](https://pagespeed.web.dev/) or Search Console's Core Web
Vitals report.

Low-traffic sites may have no field data at all. That is not a failure — there
simply is not enough sample. Use lab data as your guide and fix the obvious
causes.

## What usually causes failures

### Video or huge images in the hero (LCP)

The most common serious failure we see. A hero video is the largest element on
screen, so it becomes the LCP element — and video takes far longer to paint
than text or a still image.

Two specific traps:

- **No poster image.** Without one, LCP waits for the first decoded video
  frame.
- **Shipping both orientations.** Sites that serve a landscape and a portrait
  video often download *both* on every device, wasting several megabytes per
  visit.

The fix: make the LCP element a static image or real text. If you want video,
give it a poster, serve one orientation, and keep it small.

### Images at the wrong size (LCP and bandwidth)

A 4,000px photo displayed in a 400px slot is a common and entirely avoidable
cost. Serve responsive sizes with `srcset`, use AVIF or WebP, and lazy-load
anything below the fold — but **never lazy-load the LCP image**, which delays
exactly the thing you are trying to speed up.

### Missing dimensions (CLS)

Every image and video needs `width` and `height`, or a CSS `aspect-ratio`.
Without them the browser does not know how much space to reserve, so everything
below jumps when the image arrives.

Same for ad slots, embeds and anything injected after load.

### Fonts (CLS and LCP)

Web fonts cause layout shift when the fallback is swapped for the real font.
Mitigations:

- `font-display: swap` so text is never invisible
- **Self-host** rather than loading from a third-party CDN — that is an extra
  DNS lookup, connection and round trip on the critical path
- Preload the one or two faces used above the fold
- Subset to the characters you need

### Too much JavaScript (INP)

INP failures are usually a main thread busy running JavaScript when someone
taps. The common culprits: heavy page builders, a stack of tracking scripts,
chat widgets, and scroll-driven animation that recalculates layout on every
frame.

If you animate on scroll, animate only `transform` and `opacity`. Anything that
triggers layout — `top`, `height`, `margin` — inside a scroll handler is how
you get a janky page.

### Third-party scripts (all three)

Chat widgets, heatmaps, A/B testing tools, multiple analytics platforms. Each
is someone else's JavaScript running on your critical path, and you do not
control when it gets slower.

Audit them honestly. Most sites carry at least one script nobody has looked at
in a year.

## How to check your own site, free

1. **PageSpeed Insights** — paste your URL. Read the field data at the top
   first; the lab score below is diagnostic.
2. **Search Console → Core Web Vitals** — shows which URL *groups* fail, which
   is more actionable than one URL at a time.
3. **Chrome DevTools → Lighthouse** — run it in an incognito window so
   extensions do not distort the result.
4. **Test on a real phone on mobile data.** Not your laptop on office wifi.
   This is the test that tells you the truth.

## A realistic order of work

1. Find your LCP element. If it is a video, fix that first — it is usually the
   single biggest win available.
2. Resize and reformat oversized images.
3. Add dimensions or `aspect-ratio` everywhere.
4. Self-host and preload fonts.
5. Audit third-party scripts and remove what nobody uses.
6. Re-measure, on a real device.

## What this is worth

Be realistic: Core Web Vitals are a modest ranking factor, and fixing them
will not rescue a site with no relevant content. Where they matter
disproportionately is conversion — particularly on paid traffic, where you are
paying for every visitor who abandons a slow page.

The honest case for fixing them is not rankings. It is that you are losing
people you already paid to acquire.

---

We treat these as build requirements rather than a post-launch cleanup — see
[web design and development](/services/web-design-development/), or
[book a call](/contact/) if you want someone to look at your numbers.
