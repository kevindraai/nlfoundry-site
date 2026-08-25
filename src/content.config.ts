import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(true),
    tags: z.array(z.string().min(1)).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(['active', 'in-development', 'maintenance', 'archived']),
    startDate: z.coerce.date(),
    tags: z.array(z.string().min(1)).default([]),
    links: z
      .array(
        z.object({
          label: z.string().min(1),
          url: z.url(),
        }),
      )
      .default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
    product: z.enum(['exitlane', 'clubpos']),
    deliveryModel: z.enum(['open-source', 'hosted-product']),
    focus: z.string().min(1),
  }),
});

export const collections = { docs, posts, projects };
