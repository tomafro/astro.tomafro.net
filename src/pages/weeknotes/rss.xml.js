import rss from '@astrojs/rss';
import { weeknotes } from '@/lib/collections';

export async function get(context) {
  return rss({
    title: 'Tom Ward\'s Blog - Weeknotes',
    description: 'My Weeknotes. Unlikely to be weekly.',
    site: context.site,
    stylesheet: '/pretty-feed-v3.xsl',
    items: weeknotes.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.date,
      description: entry.data.description,
      link: entry.path,
    })),
  });
}
