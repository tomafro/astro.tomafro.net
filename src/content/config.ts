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
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  })
});

const weeknotes = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date().or(z.string().transform(str => new Date(str))),
    draft: z.boolean().optional(),
  })
});

const stream = defineCollection({
  schema: z.object({
    title: z.string(),
    draft: z.boolean().optional(),
  })
});

export const collections = {
  'projects': projects,
  'articles': articles,
  'weeknotes': weeknotes,
  'stream': stream,
};
