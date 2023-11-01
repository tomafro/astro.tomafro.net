import { type CollectionEntry, getCollection } from "astro:content";

interface Entry<T extends "weeknotes" | "articles" | "projects" | "scraps"> {
  collection: T;
  path: string;
  staticPath: any;
  title: string;
  date?: Date;
  isDraft?: boolean;
  render(): Promise<{ Content: any, headings: any }>;
}

export class WeeknoteEntry implements Entry<"weeknotes"> {
  collection: "weeknotes" = "weeknotes";
  entry: CollectionEntry<"weeknotes">;

  static async load(): Promise<Collection<WeeknoteEntry>> {
    let entries = (await getCollection("weeknotes")).map((entry) => new WeeknoteEntry(entry));
    let result = new Collection<WeeknoteEntry>();
    result.push(...entries);
    return result;
  }

  constructor(entry: CollectionEntry<"weeknotes">) {
    this.entry = entry;
  }

  get title() {
    return this.entry.data.title;
  }

  get date() {
    return this.entry.data.date;
  }

  get isDraft() {
    return this.entry.data.draft;
  }

  get path() {
    return `/weeknotes/${this.entry.slug}`;
  }

  get staticPath() {
    return {
      params: { slug: this.entry.slug },
      props: { entry: this.entry },
    };
  }

  async render() {
    return this.entry.render();
  }
}

export class ArticleEntry implements Entry<"articles"> {
  collection: "articles" = "articles";
  entry: CollectionEntry<"articles">;

  static async load(): Promise<Collection<ArticleEntry>> {
    let entries = (await getCollection("articles")).map((entry) => new ArticleEntry(entry));
    let result = new Collection<ArticleEntry>();
    result.push(...entries);
    return result;
  }

  constructor(entry: CollectionEntry<"articles">) {
    this.entry = entry;
  }

  get title() {
    return this.entry.data.title;
  }

  get date() {
    return new Date(this.entry.slug.substring(0, 10));
  }

  get isDraft() {
    return this.entry.data.draft;
  }

  get #formattedMonth() {
    const month = this.date.getMonth() + 1;
    return month < 10 ? `0${month}` : month;
  }

  get staticPath() {
    return {
      params: {
        slug: this.entry.slug.substring(11),
        year: this.date.getFullYear(),
        month: this.#formattedMonth,
      },
      props: { article: this },
    }
  }

  get path() {
    const { year, month, slug } = this.staticPath.params;
    return `/${year}/${month}/${slug}`;
  }

  render() {
    return this.entry.render();
  }
}

export class Scrap implements Entry<"scraps"> {
  collection: "scraps" = "scraps";
  entry: CollectionEntry<"scraps">;

  static async load(): Promise<Collection<Scrap>> {
    let entries = (await getCollection("scraps")).map((entry) => new Scrap(entry));
    let result = new Collection<Scrap>();
    result.push(...entries);
    return result;
  }

  constructor(entry: CollectionEntry<"scraps">) {
    this.entry = entry;
  }

  get title() {
    return this.entry.data.title;
  }

  get date() {
    return new Date(this.entry.slug.substring(0, 10));
  }

  get isDraft() {
    return this.entry.data.draft;
  }

  get hideTitle() {
    return this.entry.data.hideTitle;
  }

  get #formattedMonth() {
    const month = this.date.getMonth() + 1;
    return month < 10 ? `0${month}` : month;
  }

  get staticPath() {
    return {
      params: {
        slug: this.entry.slug.substring(11),
        year: this.date.getFullYear(),
        month: this.#formattedMonth,
      },
      props: { article: this },
    }
  }

  get path() {
    const { year, month, slug } = this.staticPath.params;
    return `/${year}/${month}/${slug}`;
  }

  render() {
    return this.entry.render();
  }
}

export class ProjectEntry implements Entry<"projects"> {
  collection: "projects" = "projects";
  entry: CollectionEntry<"projects">;

  static async load(): Promise<Collection<ProjectEntry>> {
    let entries = (await getCollection("projects")).map((entry) => new ProjectEntry(entry));
    let result = new Collection<ProjectEntry>();
    result.push(...entries);
    return result;
  }

  constructor(entry: CollectionEntry<"projects">) {
    this.entry = entry;
  }

  get title() {
    return this.entry.data.title;
  }

  get url() {
    return this.entry.data.url;
  }

  get isPrivate() {
    return this.entry.data.private;
  }

  get staticPath(): any {
    return {
      params: { slug: this.entry.slug },
      props: { entry: this },
    }
  }

  get path() {
    return `/projects/${this.staticPath.params.slug}`;
  }

  render() {
    return this.entry.render();
  }
}

function compare(a: any, b: any): -1 | 0 | 1 {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }

  return 0;
}

export class Collection<T extends WeeknoteEntry | ArticleEntry | ProjectEntry | Scrap> extends Array<T> {
  sortBy(f: (a: any) => any) {
    return this.sort((a, b) => compare(f(a), f(b)));
  }

  remove(f: (a: any) => boolean) {
    return this.filter(item => !f(item)) as Collection<T>;
  }

  byMostRecent() {
    const result = this.sortBy(w => w.date);
    result.reverse();
    return result;
  }

  wherePublished() {
    return this.remove(entry => entry.isDraft);
  }

  staticPaths() {
    return this.map(entry => entry.staticPath);
  }
}

export const articles: Collection<ArticleEntry> = await ArticleEntry.load();
export const weeknotes: Collection<WeeknoteEntry> = await WeeknoteEntry.load();
export const projects: Collection<ProjectEntry> = await ProjectEntry.load();
export const posts: Collection<WeeknoteEntry | ArticleEntry> = new Collection<WeeknoteEntry | ArticleEntry>();
posts.push(...weeknotes);
posts.push(...articles);

export const scraps: Collection<Scrap> = await Scrap.load();
