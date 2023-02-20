import { z, defineCollection } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string(),
    private: z.boolean().optional(),
  })
});

const articles = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string().transform(str => new Date(str)),
  })
});

export const collections = {
  'projects': projects,
  'articles': articles,
};
