import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';

const site = process.env.PUBLIC_SITE_URL ?? 'https://kevindraai.github.io';
const base = process.env.PUBLIC_BASE_PATH ?? '/nlfoundry-site';
const publicUrl = (path) => `${site}${base}${path}`;

export default defineConfig({
  site,
  base,
  integrations: [
    sitemap(),
    starlight({
      title: 'N/L Foundry',
      description: 'Practical software, forged for real environments.',
      favicon: `${base}/favicon.svg`,
      logo: {
        src: './src/assets/brand-mark.svg',
        alt: 'N/L Foundry',
        replacesTitle: false,
      },
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
            content: publicUrl('/social-card.svg'),
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
            content: publicUrl('/social-card.svg'),
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: 'N/L Foundry Engineering Journal',
            href: publicUrl('/rss.xml'),
          },
        },
      ],
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'Products',
          items: [
            { label: 'ExitLane', link: '/projects/exitlane/' },
            { label: 'ClubPOS', link: '/projects/clubpos/' },
          ],
        },
        { label: 'Now', link: '/now/' },
        {
          label: 'Engineering',
          items: [
            { label: 'How we work', link: '/engineering/' },
            { label: 'Journal', link: '/journal/' },
          ],
        },
        { label: 'About', link: '/about/' },
      ],
    }),
  ],
});
