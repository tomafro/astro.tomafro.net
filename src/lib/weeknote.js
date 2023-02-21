import { CollectionEntry, getCollection } from "astro:content";

export const weeknotes = await getCollection("weeknotes", (weeknote) => {
  return !weeknote.data.isDraft;
});

weeknotes.sort((a, b) => {
  if (a.data.date > b.data.date) {
    return -1;
  } else if (a.data.date < b.data.date) {
    return 1;
  } else {
    return 0;
  }
});
