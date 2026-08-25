import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

const entrySlug = (id: string) => id.replace(/\.(md|mdx)$/u, '');

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'N/L Foundry Engineering Journal',
    description: 'Engineering decisions, trade-offs and lessons from N/L Foundry products.',
    site: context.site ?? new URL('https://nlfoundry.dev'),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `/journal/${entrySlug(post.id)}/`,
      pubDate: post.data.date,
      categories: post.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
