import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

/*
 * Frontmatter is validated at build time, so a post cannot ship without the
 * fields the BlogPosting schema needs. The old site had no dates and no
 * authors anywhere, which is an E-E-A-T problem as much as a schema one.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().max(110),
    description: z.string().min(50).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Optional, but when absent the BlogPosting falls back to the Organization
    // as author. Prefer a real named person: a byline is an E-E-A-T signal and
    // the old site had none anywhere.
    author: z
      .object({
        name: z.string(),
        url: z.url().optional(),
      })
      .optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    client: z.string(),
    title: z.string().max(110),
    description: z.string().min(50).max(160),
    sector: z.string(),
    services: z.array(z.string()),
    liveUrl: z.url().optional(),
    /*
     * Outcomes must carry a source and a date range, or they do not go on the
     * site. Every statistic on the old site was unsourced, several contradicted
     * their own case study, and unsubstantiated performance claims carry
     * ASA/CAP Code exposure in the UK.
     */
    outcomes: z
      .array(
        z.object({
          metric: z.string(),
          value: z.string(),
          period: z.string(),
          source: z.string(),
        }),
      )
      .default([]),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, work };
