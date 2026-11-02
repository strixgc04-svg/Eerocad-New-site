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
| Fonts | — | **45 KB** (subset from 76 KB) |
| CLS | < 0.1 | **0.001–0.002** |
| TBT | low | **~0 ms** |
| LCP, observed | — | **50–330 ms** |
| LCP, Lighthouse simulated Slow 4G | < 2.5 s | **0.8 s or 2.6 s**, usually 2.6 s |

Lighthouse mobile: performance 96–100, accessibility 100, best practices 100,
SEO 100.

A note on that LCP row, because it looks worse than it is. The *observed* paint
is 50–330 ms. The 2.6 s figure is Lighthouse's simulated projection onto a
1.6 Mbps / 150 ms-RTT connection, where the font download gates the headline.
It sits just over the 2.5 s threshold, so the performance score lands at 96
rather than 100.

Things already done about it, in order of effect:

- Fonts subset to the character set the site uses: 76 KB -> 45 KB.
  Re-run `node scripts/subset-fonts.mjs` after changing a source font.
- A metric-matched fallback (`DM Sans Fallback` in `global.css`), measured
  against Arial, so the swap barely shifts layout. This is what holds CLS at
  0.001.
- The stylesheet is inlined (`build.inlineStylesheets: 'always'`), removing a
  render-blocking request from the critical path.

Tested and rejected: dropping the font preload. It made no reliable LCP
difference and pushed CLS from 0.001 to 0.018.

What would actually move it next is a smaller brand face, or accepting the
fallback font above the fold. Both are design decisions, not code ones. Field
data from real users is what Google ranks on, and it will reflect real
connections rather than this projection — check Search Console once there is
traffic.

Re-run before any release:

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
