import rss from '@astrojs/rss';

export function GET(context: { site?: URL }) {
  return rss({
    title: 'N/L Foundry Engineering Journal',
    description: 'Engineering decisions, trade-offs and lessons from N/L Foundry products.',
    site: context.site ?? new URL('https://nlfoundry.dev'),
    items: [
      {
        title: 'Building for real workflows, not idealised ones',
        description:
          'Why N/L Foundry starts with operational behaviour, awkward cases and responsibilities before choosing features or architecture.',
        link: '/journal/building-for-real-workflows/',
        pubDate: new Date('2026-08-04T11:00:00+02:00'),
      },
    ],
    customData: '<language>en</language>',
  });
}
