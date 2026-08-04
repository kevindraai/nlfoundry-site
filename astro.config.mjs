import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://nlfoundry.dev',
  integrations: [
    starlight({
      title: 'N/L Foundry',
      description: 'Practical software, forged for real environments.',
      favicon: '/favicon.svg',
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
