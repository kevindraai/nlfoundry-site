import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

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
const site = normalizeSiteUrl(process.env.PUBLIC_SITE_URL ?? 'https://nlfoundry.dev', 'https://nlfoundry.dev');

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
      name: 'N/L Foundry',
      url: site,
      logo: publicUrl('/brand/nlf-monogram.svg'),
      sameAs: ['https://github.com/kevindraai'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ExitLane',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Cross-platform',
      url: publicUrl('/projects/exitlane/'),
      description: 'Practical software for whole-network routing.',
      applicationSubCategory: 'Network tooling',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ClubPOS',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Cross-platform',
      url: publicUrl('/projects/clubpos/'),
      description: 'Modern point-of-sale platform for clubs and associations.',
      applicationSubCategory: 'Point-of-sale',
    },
  ],
  null,
  2,
);

export default defineConfig({
  site,
  base,
  integrations: [
    sitemap(),
    starlight({
      title: 'N/L Foundry',
      description: 'Practical software, forged for real environments.',
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
          attrs: { property: 'og:site_name', content: 'N/L Foundry' },
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
          title: 'N/L Foundry Engineering Journal',
          href: publicUrl('/rss.xml'),
        },
      ],
      customCss: ['./src/styles/custom.css', './src/styles/foundry.css'],
      components: {
        Header: './src/components/FoundryHeader.astro',
        PageTitle: './src/components/StarlightPageTitle.astro',
        SiteTitle: './src/components/StarlightSiteTitle.astro',
        ThemeProvider: './src/components/StarlightThemeProvider.astro',
        ThemeSelect: './src/components/StarlightThemeSelect.astro',
      },
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'Products',
          items: [
            { label: 'ExitLane', link: '/projects/exitlane/' },
            { label: 'ClubPOS', link: '/projects/clubpos/' },
          ],
        },
        { label: 'Engineering', link: '/engineering/' },
        { label: 'Journal', link: '/journal/' },
        { label: 'Now', link: '/now/' },
        { label: 'About', link: '/about/' },
        { label: 'Contact', link: '/contact/' },
      ],
    }),
    mdx(),
  ],
});
