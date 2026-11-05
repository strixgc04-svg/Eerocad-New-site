import { SITE_URL } from './site.js';

export const SITE = SITE_URL;
export const abs = (path = '/') => new URL(path, SITE).href;

export const ID = {
  org: `${SITE}/#organization`,
  site: `${SITE}/#website`,
  logo: `${SITE}/#logo`,
};

/*
 * Dimensions must match the file on disk. They described a 1920x645 canvas
 * that was mostly empty padding around the mark; the file is now trimmed to
 * the artwork, so these moved with it.
 */
export const LOGO = {
  '@type': 'ImageObject',
  '@id': ID.logo,
  url: abs('/brand/eerocad-logo.png'),
  contentUrl: abs('/brand/eerocad-logo.png'),
  width: 1544,
  height: 507,
  caption: 'EeroCad',
};

/*
 * Organization, not LocalBusiness or ProfessionalService.
 *
 * Those types expect a physical address, and EeroCad has none. Inventing one
 * is a Google Business Profile suspension risk and a trust problem. London and
 * New Delhi are declared as `location` with city-level granularity only, which
 * is honest.
 *
 * Upgrade to ProfessionalService ONLY if a real, staffed address exists.
 *
 * Deliberately absent until the facts exist:
 *   legalName, identifier (Companies House number), vatID, foundingDate,
 *   founder, address.
 * There is currently no "EeroCad" registered at Companies House.
 */
export const organization = {
  '@type': 'Organization',
  '@id': ID.org,
  name: 'EeroCad',
  /*
   * The spelling the brand does not use in its logo but does use everywhere
   * it is typed: the domain, the mailbox and the Instagram handle are all
   * `eerocad`, and the previous site wrote it that way throughout. People
   * will search it in that form, so it stays a real alternate name rather
   * than a copy of the one above.
   */
  alternateName: 'Eerocad',
  url: abs('/'),
  logo: LOGO,
  image: LOGO.url,
  slogan: 'Your Vision, Amplified.',
  description:
    'EeroCad is a remote-first digital agency serving clients across the United Kingdom, providing website development, SEO, performance marketing and social media management.',
  email: 'info@eerocad.com',
  knowsAbout: [
    'Website development',
    'Search engine optimisation',
    'Performance marketing',
    'Meta advertising',
    'Google Ads',
    'Social media management',
    'Shopify development',
  ],
  areaServed: [
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'City', name: 'London' },
  ],
  location: [
    {
      '@type': 'Place',
      name: 'London, United Kingdom',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        addressCountry: 'GB',
      },
    },
    {
      '@type': 'Place',
      name: 'New Delhi, India',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'New Delhi',
        addressCountry: 'IN',
      },
    },
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'info@eerocad.com',
      telephone: '+447405327656',
      areaServed: 'GB',
      availableLanguage: 'English',
    },
  ],
  // Add LinkedIn, Clutch and a Google Business Profile here ONLY once they exist.
  sameAs: ['https://www.instagram.com/eerocad'],
};

/** Minimal inline reference. Google does not resolve @id across pages. */
export const orgRef = () => ({
  '@type': 'Organization',
  '@id': ID.org,
  name: 'EeroCad',
  url: abs('/'),
  logo: LOGO.url,
});

export const website = {
  '@type': 'WebSite',
  '@id': ID.site,
  url: abs('/'),
  name: 'EeroCad',
  alternateName: 'Eerocad',
  inLanguage: 'en-GB',
  publisher: { '@id': ID.org },
  // No SearchAction: there is no site search, and Google removed the
  // sitelinks search box in 2024.
};

export const SERVICES = [
  {
    slug: 'web-design-development',
    name: 'Web Design and Development',
    serviceType: 'Website development',
    description:
      'Custom website design and development for UK businesses, including Shopify, WordPress and bespoke builds.',
  },
  {
    slug: 'seo',
    name: 'SEO',
    serviceType: 'Search engine optimisation',
    description:
      'On-page and off-page search engine optimisation to grow organic visibility for UK businesses.',
  },
  {
    slug: 'performance-marketing',
    name: 'Performance Marketing',
    serviceType: 'Performance marketing',
    description:
      'Meta and Google Ads management, conversion funnels and lead handling for UK advertisers.',
  },
  {
    slug: 'social-media-management',
    name: 'Social Media Management',
    serviceType: 'Social media management',
    description:
      'Content production and account management for brand social media presence.',
  },
] as const;

export const serviceNodes = () =>
  SERVICES.map((s) => ({
    '@type': 'Service',
    '@id': `${SITE}/#service-${s.slug}`,
    name: s.name,
    serviceType: s.serviceType,
    description: s.description,
    url: abs(`/services/${s.slug}/`),
    provider: { '@id': ID.org },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
  }));

export type Crumb = { name: string; path: string };

export const breadcrumb = (pagePath: string, crumbs: Crumb[]) => ({
  '@type': 'BreadcrumbList',
  '@id': `${abs(pagePath)}#breadcrumb`,
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: abs(c.path),
  })),
});

export const webPage = (o: {
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';
  path: string;
  name: string;
  description: string;
  hasBreadcrumb?: boolean;
  extra?: Record<string, unknown>;
}) => ({
  '@type': o.type ?? 'WebPage',
  '@id': `${abs(o.path)}#webpage`,
  url: abs(o.path),
  name: o.name,
  description: o.description,
  inLanguage: 'en-GB',
  isPartOf: { '@id': ID.site },
  about: { '@id': ID.org },
  ...(o.hasBreadcrumb ? { breadcrumb: { '@id': `${abs(o.path)}#breadcrumb` } } : {}),
  ...o.extra,
});

export const blogPosting = (o: {
  path: string;
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  author?: { name: string; url?: string };
  images?: string[];
  tags?: string[];
}) => ({
  '@type': 'BlogPosting',
  '@id': `${abs(o.path)}#article`,
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(o.path) },
  headline: o.title,
  description: o.description,
  image: o.images,
  datePublished: o.pubDate.toISOString(),
  // Never the build time - that would mark every post as updated on each deploy.
  dateModified: (o.updatedDate ?? o.pubDate).toISOString(),
  inLanguage: 'en-GB',
  keywords: o.tags?.join(', '),
  author: o.author
    ? { '@type': 'Person', name: o.author.name, ...(o.author.url ? { url: o.author.url } : {}) }
    : orgRef(),
  publisher: orgRef(),
  isPartOf: { '@id': `${SITE}/blog/#blog` },
});
