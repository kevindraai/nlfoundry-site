import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      draft: z.boolean().default(false),
      head: z.array(z.any()).default([]),
    })
    .passthrough(),
});

export const collections = { docs };
