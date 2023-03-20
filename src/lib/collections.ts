import { getCollection, CollectionEntry } from "astro:content";

function compare(a: any, b: any): -1 | 0 | 1 {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }

  return 0;
}

interface Constructable {
  new(): Entry;
}

interface Draftable {
  isDraft: boolean;
}

export class Collection<Entry> extends Array<Entry> {
  static async load<C extends "weeknotes" | "articles" | "projects", Entry>(name: "weeknotes" | "articles" | "projects", entryClass: Constructable): Promise<Collection<Entry>> {
    let entries: CollectionEntry<C>[] = await getCollection(name);
    return this.from(entries).map((entry) => Object.assign(new entryClass(), entry)) as Collection<Entry>;
  }

  sortBy(f: (a: any) => any) {
    return this.sort((a, b) => compare(f(a), f(b)));
  }

  remove(f: (a: any) => boolean): Collection<Entry> {
    return this.filter((item) => !f(item)) as Collection<Entry>;
  }

  byMostRecent(): Collection<Entry> {
    const result = this.sortBy(w => w.date);
    result.reverse();
    return result;
  }

  wherePublished(): Collection<Entry> {
    return this.remove((entry: Draftable) => entry.isDraft);
  }

  staticPaths() {
    return this.map((entry) => entry.staticPath);
  }
}

interface Entry {
  slug: string;
  data: any;
  render: any;
}

// interface Page {
//   title: string;
//   path: string;
//   data: any;
//   staticPath: any;
//   isDraft?: boolean;
// }

// class Example implements Page {
//   data: any;
//   isDraft?: boolean;

//   get staticPath() {
//     return {
//       params: { slug: this.data.slug },
//       props: { entry: this },
//     };
//   }

//   get path() {
//     return `/example/${this.staticPath.params.slug}`
//   }

//   get title() {
//     return this.data.title;
//   }
// }

class Entry {
  get staticPath(): any {
    return {
      params: { slug: this.slug },
      props: { entry: this },
    }
  }

  get date() {
    return this.data.date;
  }

  get title() {
    return this.data.title;
  }

  get isDraft() {
    return this.data.draft;
  }
}

class Article extends Entry {
  get staticPath() {
    return {
      params: {
        slug: this.slug.substring(11),
        year: this.date.getFullYear(),
        month: this.formattedMonth,
      },
      props: { article: this },
    }
  }

  get path() {
    const { year, month, slug } = this.staticPath.params;
    return `/${year}/${month}/${slug}`;
  }

  get date() {
    return new Date(this.slug.substring(0, 10));
  }

  get formattedMonth() {
    const month = this.date.getMonth() + 1;
    return month < 10 ? `0${month}` : month;
  }
}

class Weeknote extends Entry {
  get staticPath() {
    return {
      params: { slug: this.slug },
      props: { entry: this },
    }
  };

  get path() {
    const { slug } = this.staticPath.params;
    return `/weeknotes/${slug}`
  }
}

export const weeknotes: Collection<Weeknote> = await Collection.load("weeknotes", Weeknote);
export const articles: Collection<Article> = await Collection.load("articles", Article);
export const projects: Collection<Entry> = await Collection.load("projects", Entry);
