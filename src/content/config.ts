import { z, defineCollection } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string(),
  })
});

export const collections = {
  'projects': projects,
};
