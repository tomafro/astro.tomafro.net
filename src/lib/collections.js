import { getCollection } from "astro:content";

function compare(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }

  return 0;
}

export class Collection extends Array {
  static async load(name, entryClass) {
    return this.from(await getCollection(name)).map((entry) => Object.assign(new entryClass(), entry));
  }

  sortBy(f) {
    return this.sort((a, b) => compare(f(a), f(b)));
  }

  remove(f) {
    return this.filter((item) => !f(item));
  }

  byDate() {
    const result = this.sortBy(w => w.date);
    result.reverse();
    return result;
  }

  wherePublished() {
    return this.remove((entry) => entry.isDraft);
  }
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

class Weeknote extends Entry {
  get week() {
    return parseInt(this.slug);
  }

  get titleWithWeek() {
    return `Week ${this.week}: ${this.title}`;
  }
}

export const weeknotes = await Collection.load("weeknotes", Weeknote);
