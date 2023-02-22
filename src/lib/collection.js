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
  static async load(name) {
    return this.from(await getCollection(name));
  }

  sortBy(f) {
    return this.sort((a, b) => compare(f(a), f(b)));
  }

  remove(f) {
    return this.filter((item) => !f(item));
  }
}
