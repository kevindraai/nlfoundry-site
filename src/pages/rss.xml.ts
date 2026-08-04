import rss from '@astrojs/rss';

export function GET(context: { site?: URL }) {
  return rss({
    title: 'N/L Foundry Engineering Journal',
    description: 'Engineering decisions, trade-offs and lessons from N/L Foundry products.',
    site: context.site ?? new URL('https://nlfoundry.dev'),
    items: [
      {
        title: 'Engineering Journal',
        description:
          'The public home for practical engineering notes about ExitLane, ClubPOS and the systems behind them.',
        link: '/journal/',
        pubDate: new Date('2026-08-04T00:00:00+02:00'),
      },
    ],
    customData: '<language>en</language>',
  });
}
