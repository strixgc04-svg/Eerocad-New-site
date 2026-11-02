#!/usr/bin/env node
/**
 * Post-build SEO guard.
 *
 * Every rule here corresponds to a real defect found on the current Framer
 * site (see docs/seo-audit.md). The point is that none of them can come back
 * silently.
 *
 *   pnpm run check:seo            # build-time gate
 *   pnpm run check:seo -- --strict  # also fails on unfinished content
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const ORIGIN = 'https://eerocad.com';
const STRICT = process.argv.includes('--strict');

const errors = [];
const warnings = [];

const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const all = (html, re) => [...html.matchAll(re)];
const one = (html, re) => html.match(re);

function checkPage(file, html) {
  const isNoindex = /<meta[^>]+name="robots"[^>]+noindex/i.test(html);

  /* --- title ------------------------------------------------------------ */
  const titles = all(html, /<title>([\s\S]*?)<\/title>/gi);
  if (titles.length === 0) err(file, 'no <title>');
  else if (titles.length > 1) err(file, `${titles.length} <title> tags`);
  const title = titles[0]?.[1]?.trim();
  if (title !== undefined && title.length === 0) err(file, 'empty <title>');
  if (title && title.length > 65) warn(file, `title is ${title.length} chars (aim <= 60)`);

  /* --- meta description ------------------------------------------------- */
  const descs = all(html, /<meta\s+name="description"\s+content="([^"]*)"/gi);
  if (descs.length === 0) err(file, 'no meta description');
  else if (descs.length > 1) err(file, `${descs.length} meta descriptions`);
  const desc = descs[0]?.[1]?.trim();
  if (desc !== undefined) {
    if (desc.length === 0) err(file, 'empty meta description');
    else if (desc.length > 165) warn(file, `description is ${desc.length} chars (truncates ~160)`);
    else if (desc.length < 50) warn(file, `description is only ${desc.length} chars`);
  }

  /* --- canonical -------------------------------------------------------- */
  const canons = all(html, /<link\s+rel="canonical"\s+href="([^"]*)"/gi);
  if (canons.length === 0) err(file, 'no canonical');
  else if (canons.length > 1) err(file, `${canons.length} canonical tags`);
  const canon = canons[0]?.[1];
  if (canon && !canon.startsWith(ORIGIN)) {
    err(file, `canonical points off-origin: ${canon}`);
  }

  /* --- the Framer leak -------------------------------------------------- */
  // The old site canonicalised every page to eerocad.framer.ai and had 8
  // hardcoded CTA links to that host. That must never recur.
  //
  // Only attribute values count. Editorial prose may legitimately mention
  // framer.ai — the blog post about migrating off Framer does exactly that.
  for (const [, attr, value] of all(
    html,
    /\b(href|src|content|srcset|action)="([^"]*)"/gi,
  )) {
    if (/framer\.ai/i.test(value)) {
      err(file, `${attr} points at framer.ai: ${value.slice(0, 80)}`);
    }
  }

  /* --- headings --------------------------------------------------------- */
  const h1s = all(html, /<h1[\s>]/gi);
  if (h1s.length === 0 && !isNoindex) err(file, 'no <h1>');
  if (h1s.length > 1) err(file, `${h1s.length} <h1> tags (responsive duplicates?)`);

  /* --- landmarks -------------------------------------------------------- */
  if (!/<main[\s>]/i.test(html)) err(file, 'no <main> landmark');

  /* --- images ----------------------------------------------------------- */
  for (const [tag] of all(html, /<img\b[^>]*>/gi)) {
    if (!/\balt=/i.test(tag)) err(file, `<img> without alt: ${tag.slice(0, 90)}`);
  }

  /* --- links need accessible names -------------------------------------- */
  // An unnamed logo link was the current site's only Lighthouse
  // Agentic Browsing failure.
  for (const [tag, inner] of all(html, /<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = tag.slice(0, tag.indexOf('>'));
    const text = inner.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, '').trim();
    const labelled = /aria-label=|aria-labelledby=|title=/i.test(attrs);
    const hasImgAlt = /<img[^>]+alt="[^"]+"/i.test(inner);
    if (!text && !labelled && !hasImgAlt) {
      err(file, `link without accessible name: ${attrs.slice(0, 90)}`);
    }
  }

  /* --- JSON-LD ---------------------------------------------------------- */
  const blocks = all(html, /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi);
  if (blocks.length === 0 && !isNoindex) warn(file, 'no JSON-LD');
  for (const [, raw] of blocks) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      err(file, `invalid JSON-LD: ${e.message}`);
      continue;
    }
    if (data['@context'] !== 'https://schema.org') {
      err(file, `JSON-LD @context is ${JSON.stringify(data['@context'])}`);
    }
    const text = JSON.stringify(data);
    // Catch relative URLs in url/@id/item fields.
    for (const [, key, value] of text.matchAll(/"(@id|url|item|contentUrl)":"([^"]*)"/g)) {
      if (value && !/^https?:\/\//.test(value)) {
        err(file, `JSON-LD ${key} is not absolute: ${value}`);
      }
    }
    if (/"datePublished":"(?!\d{4}-\d{2}-\d{2})/.test(text)) {
      err(file, 'JSON-LD datePublished is not ISO 8601');
    }
  }

  /* --- unfinished content ----------------------------------------------- */
  if (/data-todo/.test(html)) {
    (STRICT ? err : warn)(file, 'contains an unfinished content placeholder');
  }
  for (const marker of ['TODO', 'Lorem ipsum', 'support@landin.com', 'MandroDesign']) {
    if (html.includes(marker)) {
      (STRICT ? err : warn)(file, `contains "${marker}"`);
    }
  }
}

/**
 * Every internal link must resolve to something that was actually built.
 *
 * Added after the home page shipped four hard-coded links to case studies
 * that existed only as drafts — four 404s, which is precisely the failure
 * this rebuild exists to fix. A dead internal link should never reach
 * production again.
 */
async function checkInternalLinks(files) {
  const routes = new Set();
  for (const file of files) {
    const rel = '/' + relative(DIST, file).split(sep).join('/');
    routes.add(rel);
    routes.add(rel.replace(/index\.html$/, ''));
  }

  for (const file of files) {
    const rel = relative(DIST, file).split(sep).join('/');
    const html = await readFile(file, 'utf8');

    for (const [, href] of all(html, /href="(\/[^"]*)"/g)) {
      const clean = href.split('#')[0].split('?')[0];
      if (!clean || routes.has(clean)) continue;

      // Static assets: check the file exists on disk.
      try {
        await stat(join(DIST, clean));
        continue;
      } catch {
        /* fall through to the error below */
      }

      err(rel, `dead internal link: ${href}`);
    }
  }
}

async function main() {
  try {
    await stat(DIST);
  } catch {
    console.error(`No ${DIST}/ directory. Run \`pnpm build\` first.`);
    process.exit(1);
  }

  const files = await walk(DIST);
  if (files.length === 0) {
    console.error('No HTML files in dist/.');
    process.exit(1);
  }

  await checkInternalLinks(files);

  const titles = new Map();

  for (const file of files) {
    const rel = relative(DIST, file).split(sep).join('/');
    const html = await readFile(file, 'utf8');
    checkPage(rel, html);

    const t = one(html, /<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    const noindex = /<meta[^>]+name="robots"[^>]+noindex/i.test(html);
    if (t && !noindex) {
      if (!titles.has(t)) titles.set(t, []);
      titles.get(t).push(rel);
    }
  }

  // The current site serves ONE title and ONE description across all 11 pages.
  for (const [title, pages] of titles) {
    if (pages.length > 1) {
      errors.push(`duplicate <title> "${title}" on: ${pages.join(', ')}`);
    }
  }

  for (const required of ['robots.txt', 'sitemap-index.xml']) {
    try {
      await stat(join(DIST, required));
    } catch {
      errors.push(`missing ${required}`);
    }
  }

  console.log(`Checked ${files.length} pages.\n`);

  if (warnings.length) {
    console.log(`Warnings (${warnings.length}):`);
    for (const w of warnings) console.log(`  ! ${w}`);
    console.log('');
  }

  if (errors.length) {
    console.error(`Errors (${errors.length}):`);
    for (const e of errors) console.error(`  x ${e}`);
    console.error('\nSEO check FAILED.');
    process.exit(1);
  }

  console.log('SEO check passed.');
}

main();
