import { Collection } from "./collection.js";

const isDraft = (weeknote) => weeknote.data.isDraft;

class Entry {
  constructor(entry) {
    Object.assign(this, entry)
  }

  get date() {
    return this.data.date;
  }

  get week() {
    return parseInt(this.slug);
  }

  get title() {
    return this.data.title;
  }

  get titleWithWeek() {
    return `Week ${this.week}: ${this.title}`;
  }
}

class Weeknotes extends Collection {
  static async collection() {
    Object.assign
    return (await this.load("weeknotes")).map((entry) => new Entry(entry));
  }

  get byDate() {
    const result = this.sortBy(w => w.data.date);
    result.reverse();
    return result;
  }
}

export const weeknotes = (await Weeknotes.collection()).byDate.remove(isDraft);
