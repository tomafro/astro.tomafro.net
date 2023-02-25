import { getCollection } from "astro:content";

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
  new(): any;
}

interface Draftable {
  isDraft: boolean;
}

export class Collection extends Array {
  static async load(name: "weeknotes" | "articles" | "projects", entryClass: Constructable) {
    return this.from(await getCollection(name)).map((entry) => Object.assign(new entryClass(), entry));
  }

  sortBy(f: (a: any) => any) {
    return this.sort((a, b) => compare(f(a), f(b)));
  }

  remove(f: (a: any) => boolean): any[] {
    return this.filter((item) => !f(item));
  }

  byMostRecent(): any[] {
    const result = this.sortBy(w => w.date);
    result.reverse();
    return result;
  }

  wherePublished(): any[] {
    return this.remove((entry: Draftable) => entry.isDraft);
  }
}

interface Entry {
  slug: string;
  data: any;
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
  get date() {
    return new Date(this.slug.substring(0, 10));
  }

  get formattedMonth() {
    const month = this.date.getMonth() + 1;
    return month < 10 ? `0${month}` : month;
  }
}

class Weeknote extends Entry {
  get week() {
    return parseInt(this.slug);
  }

  get titleWithWeek() {
    return `Week ${this.week}: ${this.title}`;
  }
}

export const weeknotes = await Collection.load("weeknotes", Weeknote);
export const articles = await Collection.load("articles", Article);
export const projects = await Collection.load("projects", Entry);
