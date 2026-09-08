import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

const entrySlug = (id: string) => id.replace(/\.(md|mdx)$/u, '');

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Tuned.pixel — Notities',
    description: 'Notities van Kevin over ontwerp, software en keuzes tijdens het bouwen.',
    site: context.site ?? new URL('https://tunedpixel.nl'),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: `/journal/${entrySlug(post.id)}/`,
      pubDate: post.data.date,
      categories: post.data.tags,
    })),
    customData: '<language>nl</language>',
  });
}
