import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Murrieta Concrete Pros'),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
