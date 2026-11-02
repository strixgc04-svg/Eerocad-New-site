/**
 * Service page content.
 *
 * Written to be substantive rather than filler — the old service page gave
 * roughly 55 words per service, against the 800+ a competitive UK SERP
 * expects.
 *
 * Deliberately absent: prices, timelines stated as promises, and any client
 * outcome. Those are marked TODO on the page until the business decides them
 * and can evidence them.
 */
export type ServiceContent = {
  /** Shown under the H1. */
  intro: string;
  forWho: string[];
  notForWho: string[];
  included: { title: string; body: string }[];
  process: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  /** Honest framing of how long things take, with the caveat built in. */
  timelineNote: string;
};

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  'web-design-development': {
    intro:
      'We design and build websites for UK businesses that need the site to do a job — take bookings, sell products, or turn visitors into enquiries. Not a brochure that looks nice and converts nobody.',
    forWho: [
      'You have a site that looks dated, loads slowly, or nobody enquires through',
      'You are launching and need the first version done properly',
      'You are on a platform that fights you every time you want to change something',
    ],
    notForWho: [
      'You want the cheapest possible site — there are template services for that, and they are fine',
      'You need a complex web application rather than a marketing site',
    ],
    included: [
      {
        title: 'A build on the right platform',
        body: 'Shopify for product businesses, WordPress where you need a familiar editor, Astro or React where speed and control matter most. We pick based on who maintains it after launch, not on what we prefer to build.',
      },
      {
        title: 'Mobile-first, genuinely',
        body: 'Most UK local search happens on a phone. Every layout is designed at phone width first and tested on real device widths, not just resized in a browser.',
      },
      {
        title: 'Core Web Vitals as a requirement',
        body: 'Largest Contentful Paint under 2.5s, Cumulative Layout Shift under 0.1, Interaction to Next Paint under 200ms — measured on a throttled mobile connection before launch, not assumed.',
      },
      {
        title: 'SEO foundations wired in',
        body: 'Server-rendered HTML, a unique title and description per page, canonical tags pointing at your own domain, an XML sitemap, robots.txt, and structured data. Retrofitting these later costs far more than building them in.',
      },
      {
        title: 'Analytics and conversion tracking',
        body: 'Set up before launch so you can tell which pages produce enquiries, rather than guessing for three months and then trying to reconstruct it.',
      },
      {
        title: 'A handover you actually own',
        body: 'Code, domain, hosting, analytics and any advertising accounts are transferred to you at launch. They stay yours whether or not you keep working with us.',
      },
    ],
    process: [
      {
        title: 'Scope',
        body: 'We agree what the site needs to do, what pages that requires, and what it will cost — in writing, before anything is designed.',
      },
      {
        title: 'Design',
        body: 'Key page templates first, reviewed at phone and desktop width. Once the templates are agreed, the remaining pages are content work rather than new design.',
      },
      {
        title: 'Build',
        body: 'You get a staging link early and watch it come together. One named point of contact throughout.',
      },
      {
        title: 'Launch',
        body: 'Redirects mapped from old URLs, Search Console verified, sitemap submitted, analytics confirmed firing, and a walkthrough of how to edit what you need to edit.',
      },
    ],
    faqs: [
      {
        q: 'Which platform will you build on?',
        a: 'It depends on who maintains the site afterwards and what it has to do. Shopify for product sales, WordPress where a non-technical team needs to edit daily, Astro where speed and search performance matter most. We will tell you the trade-offs before you commit.',
      },
      {
        q: 'Will I be able to edit it myself?',
        a: 'Yes. We agree which parts you need to edit before we build, and the handover includes a walkthrough. If you want us to handle changes instead, that is a separate ongoing arrangement.',
      },
      {
        q: 'What happens to my existing search rankings?',
        a: 'Every old URL is mapped to its new equivalent with a 301 redirect before launch. Done properly, a migration preserves rankings; skipped, it is the most common way sites lose traffic overnight.',
      },
    ],
    timelineNote:
      'Most marketing sites take a few weeks from agreed scope to launch, driven mostly by how quickly content and feedback come back. We give you a specific date at scoping, not a range on a web page.',
  },

  seo: {
    intro:
      'Search visibility that compounds. We fix what is technically broken, build pages that match what people actually search for, and report in terms of enquiries rather than vanity rankings.',
    forWho: [
      'You rank for your own brand name and nothing else',
      'You have been paying for SEO and cannot tell what it bought',
      'You are planning a redesign and want to not lose what you have',
    ],
    notForWho: [
      'You want results next month — SEO does not work that way, and anyone promising it is selling you something else',
      'You are in a market where paid search would simply be cheaper and faster',
    ],
    included: [
      {
        title: 'Technical audit and fixes',
        body: 'Crawlability, indexation, canonical tags, redirects, status codes, sitemaps, structured data and Core Web Vitals. This is where most sites are quietly losing — pages that return errors to crawlers, or canonical tags pointing at the wrong domain.',
      },
      {
        title: 'Keyword and intent research',
        body: 'What your buyers actually type, and crucially what kind of page ranks for it. A service query that returns directory listings needs a different response from one that returns service pages.',
      },
      {
        title: 'On-page and content',
        body: 'Unique titles and descriptions, heading structure, internal linking, and pages written to answer the query rather than to hit a word count.',
      },
      {
        title: 'Local SEO where it applies',
        body: 'Google Business Profile, NAP consistency, local landing pages where there is genuine local presence to write about — never templated city pages, which are a spam risk.',
      },
      {
        title: 'Reporting you can act on',
        body: 'Which queries brought people, which pages converted, and what changed since last month. Not a 40-page PDF of rankings.',
      },
    ],
    process: [
      {
        title: 'Audit',
        body: 'A full technical and content review, with findings ranked by impact rather than by how many we found.',
      },
      {
        title: 'Fix the foundations',
        body: 'Anything blocking indexation first. There is no point writing content for a site search engines cannot crawl properly.',
      },
      {
        title: 'Build the pages that can rank',
        body: 'Service, location and comparison pages matched to real query intent, with the internal linking to support them.',
      },
      {
        title: 'Measure and iterate',
        body: 'Monthly review of what moved, what did not, and what to do next.',
      },
    ],
    faqs: [
      {
        q: 'How long until I see results?',
        a: 'Technical fixes can show within weeks. Content and authority work typically takes several months before it compounds into meaningful traffic. Anyone offering rankings in a month is describing something that will not last.',
      },
      {
        q: 'Do you build links?',
        a: 'We earn mentions through genuinely useful content, directory and review profiles, and digital PR. We do not buy links — it works until it does not, and the recovery costs more than the gain.',
      },
      {
        q: 'Can you guarantee a position?',
        a: 'No, and neither can anyone else. Google does not sell positions in organic results. What we can commit to is the work, the measurement, and honest reporting on what it produced.',
      },
    ],
    timelineNote:
      'An audit and the technical fixes are a defined piece of work. Ongoing SEO is a monthly arrangement, because the work is continuous and so are the results.',
  },

  'performance-marketing': {
    intro:
      'Meta and Google Ads managed against a number you agree up front. Campaigns, landing pages and tracking built as one thing, because ads that send traffic to a page that does not convert are just an expensive way to lose money.',
    forWho: [
      'You are spending on ads and cannot tell which spend produced which sale',
      'You have a product or service with a clear margin and want to scale it',
      'You tried ads once, it did not work, and nobody could explain why',
    ],
    notForWho: [
      'You have no budget to test with — paid media needs enough spend to learn from',
      'Your margin cannot support customer acquisition cost at realistic market rates',
    ],
    included: [
      {
        title: 'Account and tracking setup',
        body: 'Conversion tracking, server-side events where it matters, and GA4 configured so the numbers in the ad platform and the numbers in analytics tell the same story.',
      },
      {
        title: 'Campaign structure',
        body: 'Built so you can see what is working at the level that matters — audience, creative, placement — rather than one undifferentiated blob of spend.',
      },
      {
        title: 'Creative and copy',
        body: 'Multiple angles tested properly rather than one ad run until it fatigues. What we learn feeds back into the landing page.',
      },
      {
        title: 'Landing pages',
        body: 'Built to match the ad. A click that lands on a generic homepage is a click you paid for and wasted.',
      },
      {
        title: 'Honest reporting',
        body: 'Spend, return, cost per acquisition, and what we changed. Including the tests that did not work, because those are how the account improves.',
      },
    ],
    process: [
      {
        title: 'Baseline',
        body: 'What you are spending now, what it returns, and what your margin can actually support. If the numbers do not work, we say so before you spend anything.',
      },
      {
        title: 'Instrument',
        body: 'Tracking first. Running campaigns without reliable conversion data is guessing with a budget attached.',
      },
      {
        title: 'Test',
        body: 'A deliberate learning phase with enough spend and time to produce a signal rather than noise.',
      },
      {
        title: 'Scale what works',
        body: 'Spend moves toward what is producing, and we keep testing at the edges.',
      },
    ],
    faqs: [
      {
        q: 'Who owns the ad accounts?',
        a: 'You do. We work inside your accounts, or set them up in your name. If we stop working together you keep the accounts, the history and the audiences — which is not true of every agency, so ask the question.',
      },
      {
        q: 'How is this priced?',
        a: 'TODO: state the model — a percentage of ad spend, a flat monthly retainer, or a hybrid — and the minimum monthly ad spend that makes the engagement worthwhile. UK buyers compare on exactly this.',
      },
      {
        q: 'Is ad spend included?',
        a: 'No. Ad spend goes directly to Meta or Google from your account. Our fee is separate and covers the management.',
      },
    ],
    timelineNote:
      'Setup and instrumentation take a couple of weeks. Expect a learning phase before the account stabilises — paid media gets better with data, and data takes time to accumulate.',
  },

  'social-media-management': {
    intro:
      'Social that looks like the business you actually are. Strategy, content and scheduling handled, so your profiles stop being three months out of date.',
    forWho: [
      'Your profiles are dormant and it is starting to look like you closed down',
      'You post when you remember, which is not a strategy',
      'You need consistent presence but have nobody internally to own it',
    ],
    notForWho: [
      'You want follower counts rather than customers — we are not a good fit for that',
      'You need a full-time in-house content team, which at some scale is the right answer',
    ],
    included: [
      {
        title: 'Platform strategy',
        body: 'Which platforms are worth your time, based on where your buyers are rather than where everyone else is posting.',
      },
      {
        title: 'Content production',
        body: 'A monthly content plan, designed assets, and captions written in your voice rather than a generic brand voice.',
      },
      {
        title: 'Scheduling and publishing',
        body: 'Consistent cadence, planned in advance, so the account does not go quiet the moment you get busy.',
      },
      {
        title: 'Community management',
        body: 'Comments and messages answered, which for local businesses is often where the actual enquiries arrive.',
      },
    ],
    process: [
      {
        title: 'Audit and plan',
        body: 'What is working, what is not, and what a realistic cadence looks like for your business.',
      },
      {
        title: 'Build the system',
        body: 'Templates, tone guidelines and a content calendar, so output is consistent rather than dependent on inspiration.',
      },
      {
        title: 'Produce and publish',
        body: 'Monthly batches, reviewed by you before they go out.',
      },
      {
        title: 'Review',
        body: 'What got engagement, what drove traffic, and what to do more of.',
      },
    ],
    faqs: [
      {
        q: 'Do you need photography from us?',
        a: 'Usually some. For hospitality and retail especially, real photography of your own product outperforms stock by a wide margin. We will tell you what we need and can advise on getting it.',
      },
      {
        q: 'Will you reply to comments as us?',
        a: 'If you want us to, yes, within guidelines we agree. Anything sensitive gets escalated to you rather than answered on your behalf.',
      },
      {
        q: 'Can you guarantee growth?',
        a: 'No. We can commit to consistent, on-brand output and honest reporting on what it produced. Anyone guaranteeing follower numbers is usually buying them.',
      },
    ],
    timelineNote:
      'Social is an ongoing monthly arrangement. The first month covers the audit, strategy and building the content system; output begins from month one.',
  },
};
