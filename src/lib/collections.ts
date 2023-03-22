import { CollectionEntry, getCollection } from "astro:content";

interface Page<T extends "weeknotes" | "articles" | "projects"> {
  collection: T;
  path: string;
  staticPath: any;
  title: string;
  date?: Date;
  isDraft?: boolean;
  render(): Promise<{ Content: any, headings: any }>;
}

export class Weeknote implements Page<"weeknotes"> {
  collection: "weeknotes" = "weeknotes";
  entry: CollectionEntry<"weeknotes">;

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

export class Article implements Page<"articles"> {
  collection: "articles" = "articles";
  entry: CollectionEntry<"articles">;

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

export class Project implements Page<"projects"> {
  collection: "projects" = "projects";
  entry: CollectionEntry<"projects">;

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

export class Collection<T extends Weeknote | Article | Project> extends Array<T> {
  static async load(name: "weeknotes"): Promise<Collection<Weeknote>>;
  static async load(name: "articles"): Promise<Collection<Article>>;
  static async load(name: "projects"): Promise<Collection<Project>>;

  static async load(name: "weeknotes" | "articles" | "projects"): Promise<unknown> {
    let entries = (await getCollection(name));
    let pages = entries.map((entry) => new (name === "weeknotes" ? Weeknote : name === "articles" ? Article : Project)(entry));
    let result = new Collection<Weeknote | Article | Project>();
    result.push(...pages);
    return result;
  }

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

export const articles: Collection<Article> = await Collection.load("articles");
export const weeknotes: Collection<Weeknote> = await Collection.load("weeknotes");
export const projects: Collection<Project> = await Collection.load("projects");
export const posts: Collection<Weeknote | Article> = new Collection<Weeknote | Article>();
posts.push(...weeknotes);
posts.push(...articles);
