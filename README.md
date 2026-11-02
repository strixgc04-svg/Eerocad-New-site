# Eerocad

Marketing site for Eerocad, a remote-first UK digital agency.

Astro 7 (static), Tailwind 4, shadcn/ui on React islands, GSAP + Lenis.

## Commands

```bash
pnpm dev            # dev server on :4321
pnpm build          # build + SEO check (warnings allowed)
pnpm build:strict   # build + SEO check, fails on unfinished content — use before launch
pnpm check          # astro type check
pnpm check:seo      # re-run the SEO check against an existing dist/
```

## Why it is built this way

Every architectural choice here answers a specific defect in the previous
Framer site. See [docs/seo-audit.md](docs/seo-audit.md) and
[docs/build-plan.md](docs/build-plan.md).

| Decision | Reason |
| --- | --- |
| Static output, every route pre-rendered | Ten of the old site's eleven URLs returned a hard 404 on direct fetch |
| `site` in `astro.config.mjs` drives all canonicals | The old site canonicalised every page to `eerocad.framer.ai` |
| Per-page title and description are required props | The old site served one title and one description across all 11 pages |
| `scripts/seo-check.mjs` runs on every build | So none of the above can come back silently |
| shadcn components render static unless hydrated | React + Radix is a ~120 KB floor; the home page currently ships ~49 KB gzipped |
| FAQ is native `<details>` | The old FAQ answers were injected on click and existed in no crawler's view |
| White base, not the old near-black | A rebrand that keeps the old background keeps the old identity. White also lets one red serve as both fill and type (4.98:1 either way) |
| DM Sans + Instrument Serif italic | The italic accent on one or two words per heading is what stops a white page reading as a template. Both self-hosted; a Google Fonts `<link>` is a render-blocking cross-origin request |
| Intro curtain is pure CSS | Triggered by a class an inline script sets. It never blocks LCP (the hero paints beneath it), runs once per session, is skipped under reduced motion, and deliberately does **not** lock scroll — a lock would need JS to release it |
| Hero animation has a 2.5s completion guard | SplitText hides the headline while it animates. If rAF stalls, the guard snaps it visible — invisible copy is never acceptable |

## Structure

```
src/
  content.config.ts     blog + work collections, validated at build time
  content/blog/         posts (markdown/MDX)
  content/work/         case studies
  lib/site.js           the production origin — single source of truth
  lib/schema.ts         JSON-LD builders
  layouts/              BaseLayout (head, landmarks), PageLayout (simple pages)
  components/           Header, Footer, SeoHead, JsonLd, Breadcrumbs, Section, Todo
  components/ui/        shadcn components
  scripts/motion.ts     GSAP reveals + Lenis, both reduced-motion gated
  pages/                routes
scripts/seo-check.mjs   post-build guard
vercel.json             301s from old URLs, security headers
```

## Performance budget

Enforced by review, not tooling — check before merging anything heavy.

| Metric | Budget | Measured (mobile, production build) |
| --- | --- | --- |
| Home page JS | < 90 KB gzipped | **52 KB** |
| Home page total weight | < 2 MB | **207 KB** |
| LCP | < 2.5 s | **0.8–1.7 s** |
| CLS | < 0.1 | **0** |
| TBT | low | **0 ms** |
| Hero video, if added | ~0.5 MB, one orientation, poster required | not used |

Lighthouse mobile on the production build: performance 100, accessibility 100,
best practices 100, SEO 100. Re-run before any release:

```bash
pnpm build && pnpm preview --port 4330
npx lighthouse http://localhost:4330/ --form-factor=mobile --screenEmulation.mobile --view
```

## Animation rules

In `src/scripts/motion.ts`. Only `transform` and `opacity` animate. Nothing
above the fold animates into position. All copy is in the HTML and revealed by
CSS class, never rendered by JS. Everything is wrapped in `gsap.matchMedia()`
so `prefers-reduced-motion` gets a working page. Lenis is desktop-only.

## Before launch

Run `pnpm build:strict` — it fails on any remaining placeholder. Then work
through §7 of the build plan, which is mostly business decisions rather than
code: company registration details, verified statistics, real team members,
published pricing, and legal pages.

The `Todo` component marks everything still needed; each instance names what is
required and what it is blocked on.
