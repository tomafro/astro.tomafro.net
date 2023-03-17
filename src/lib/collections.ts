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

export class Collection<T> extends Array<T> {
  static async load<C extends "weeknotes" | "articles" | "projects", Entry>(name: "weeknotes" | "articles" | "projects", entryClass: Constructable): Promise<Collection<Entry>> {
    let entries: CollectionEntry<C>[] = await getCollection(name);
    return this.from(entries).map((entry) => Object.assign(new entryClass(), entry)) as Collection<Entry>;
  }

  sortBy(f: (a: any) => any) {
    return this.sort((a, b) => compare(f(a), f(b)));
  }

  remove(f: (a: any) => boolean): Collection<T> {
    return this.filter((item) => !f(item)) as Collection<T>;
  }

  byMostRecent(): Collection<T> {
    const result = this.sortBy(w => w.date);
    result.reverse();
    return result;
  }

  wherePublished(): Collection<T> {
    return this.remove((entry: Draftable) => entry.isDraft);
  }
}

interface Entry {
  slug: string;
  data: any;
  render: any;
}

class Entry {
  get staticPath() {
    return {
      params: { slug: this.slug },
      props: { entry: this },
    }
  };

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
  get path() {
    const year = this.date.getFullYear();
    const month = (this.date.getMonth() + 1) < 10 ? `0${this.date.getMonth() + 1}` : this.date.getMonth() + 1;
    return `/${year}/${month}/${this.slug.substring(11)}`;
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
  get path() {
    return `/weeknotes/${this.slug}`
  }

  get week() {
    return parseInt(this.slug);
  }
}

export const weeknotes: Collection<Weeknote> = await Collection.load("weeknotes", Weeknote);
export const articles: Collection<Article> = await Collection.load("articles", Article);
export const projects: Collection<Entry> = await Collection.load("projects", Entry);
