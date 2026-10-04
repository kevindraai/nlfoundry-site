import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

const identity = JSON.parse(readFileSync(new URL('./identity.json', import.meta.url), 'utf8'));
const canonicalSiteUrl = identity.canonical_url;

const normalizeBasePath = (value, fallback) => {
  const raw = typeof value === 'string' ? value.trim() : fallback;
  if (!raw) {
    return fallback;
  }
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`;
  if (withLeadingSlash === '/') {
    return '/';
  }
  return withLeadingSlash.replace(/\/+$/, '');
};

const normalizeSiteUrl = (value, fallback) =>
  typeof value === 'string' && value.trim()
    ? value.trim().replace(/\/+$/, '')
    : fallback;

const base = normalizeBasePath(process.env.PUBLIC_BASE_PATH ?? '/', '/');
const site = normalizeSiteUrl(process.env.PUBLIC_SITE_URL ?? canonicalSiteUrl, canonicalSiteUrl);

const withBasePath = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base === '/' ? '' : base}${normalizedPath}`;
};

const publicUrl = (path) => `${site}${withBasePath(path)}`;
const organizationSchema = JSON.stringify(
  [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Tuned.pixel',
      url: site,
      logo: publicUrl('/brand/tp-mark.svg'),
      sameAs: ['https://github.com/kevindraai'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ExitLane',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Cross-platform',
      url: publicUrl('/projects/exitlane/'),
      description: 'Een VPN-gateway voor je hele netwerk.',
      applicationSubCategory: 'Network tooling',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ClubSolution',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Cross-platform',
      url: publicUrl('/projects/clubsolution/'),
      description: 'Software voor verenigingen met een eigen bar, opgebouwd uit modules.',
      applicationSubCategory: 'Point-of-sale',
    },
  ],
  null,
  2,
);

export default defineConfig({
  site,
  base,
  // ClubPOS heet nu ClubSolution; het oude adres blijft werken voor bestaande links.
  redirects: {
    '/projects/clubpos': withBasePath('/projects/clubsolution/'),
  },
  integrations: [
    sitemap(),
    starlight({
      title: 'Tuned.pixel',
      defaultLocale: 'root',
      locales: { root: { label: 'Nederlands', lang: 'nl' } },
      description: 'Digitale producten van Kevin van der Draai. Ontwerp en development onder de naam Tuned.pixel.',
      disable404Route: true,
      favicon: withBasePath('/favicon.svg'),
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/kevindraai',
        },
      ],
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:site_name', content: 'Tuned.pixel' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:type', content: 'website' },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: publicUrl('/social/og-image.png'),
          },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: publicUrl('/social/og-image.png'),
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'manifest',
            href: withBasePath('/site.webmanifest'),
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: withBasePath('/favicons/favicon-16x16.png'),
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: withBasePath('/favicons/favicon-32x32.png'),
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            href: withBasePath('/favicons/apple-touch-icon.png'),
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'theme-color',
            content: '#020914',
          },
        },
        {
          tag: 'script',
          attrs: {
            type: 'application/ld+json',
          },
          content: organizationSchema,
        },
        {
          tag: 'link',
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'Tuned.pixel — Notities',
          href: publicUrl('/rss.xml'),
        },
      ],
      customCss: ['./src/styles/custom.css', './src/styles/tunedpixel.css'],
      components: {
        Header: './src/components/TunedPixelHeader.astro',
        PageTitle: './src/components/StarlightPageTitle.astro',
        SiteTitle: './src/components/StarlightSiteTitle.astro',
        ThemeProvider: './src/components/StarlightThemeProvider.astro',
        ThemeSelect: './src/components/StarlightThemeSelect.astro',
      },
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'Projecten',
          items: [
            { label: 'ExitLane', link: '/projects/exitlane/' },
            { label: 'ClubSolution', link: '/projects/clubsolution/' },
          ],
        },
        { label: 'Werkwijze', link: '/engineering/' },
        { label: 'Notities', link: '/journal/' },
        { label: 'Nu', link: '/now/' },
        { label: 'Over Kevin', link: '/about/' },
        { label: 'Contact', link: '/contact/' },
      ],
    }),
    mdx(),
  ],
});
