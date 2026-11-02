#!/usr/bin/env node
/**
 * Subset the self-hosted fonts.
 *
 * Why: the full Google "latin" cut of DM Sans is ~62KB. On a throttled mobile
 * connection that arrives late enough that the webfont swap re-registers the
 * LCP — the home page measured a bimodal 0.8s / 2.7s depending on whether the
 * swap landed before or after the first paint. The site uses 95 distinct
 * characters, so most of that payload is glyphs nobody will ever see.
 *
 * The character set below is deliberately wider than what the site uses today,
 * so a new blog post cannot silently fall back to a system font. It covers
 * printable ASCII, the Latin-1 letters, and the punctuation this design relies
 * on (curly quotes, en/em dash, arrow, middot).
 *
 * Run after replacing a source font:
 *   node scripts/subset-fonts.mjs
 *
 * Sources live in fonts-src/ and are not served. Output goes to public/fonts/.
 */
import subsetFont from 'subset-font';
import { readFile, writeFile, stat } from 'node:fs/promises';

const ASCII = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) =>
  String.fromCharCode(0x20 + i),
).join('');

const LATIN1 = Array.from({ length: 0xff - 0xa0 + 1 }, (_, i) =>
  String.fromCharCode(0xa0 + i),
).join('');

const EXTRAS = '‘’“”„–—…•·°†‡‰′″€₹→←↑↓≈≠≤≥×÷™©®';

const TEXT = ASCII + LATIN1 + EXTRAS;

const JOBS = [
  {
    from: 'fonts-src/dm-sans-latin.woff2',
    to: 'public/fonts/dm-sans-latin.woff2',
    // Variable font. The design uses 400, 500 and 600 only — nothing is
    // bolder than semibold — so the axis is clipped there rather than 700.
    variationAxes: { wght: { min: 400, max: 600 } },
  },
  {
    // Instrument Serif is static — it has no wght axis, and asking harfbuzz
    // to range one it does not have throws.
    from: 'fonts-src/instrument-serif-italic.woff2',
    to: 'public/fonts/instrument-serif-italic.woff2',
  },
];

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

for (const job of JOBS) {
  const src = await readFile(job.from);
  const out = await subsetFont(src, TEXT, {
    targetFormat: 'woff2',
    ...(job.variationAxes ? { variationAxes: job.variationAxes } : {}),
  });

  await writeFile(job.to, out);

  let before = src.length;
  try {
    before = (await stat(job.from)).size;
  } catch {
    /* use the buffer length */
  }

  const saved = (((before - out.length) / before) * 100).toFixed(0);
  console.log(
    `${job.to.padEnd(42)} ${kb(before)} -> ${kb(out.length)}  (-${saved}%)`,
  );
}
