---
title: odb
url: https://github.com/tomafro/odb
private: true
---
A simple CLI tool to query my [Obsidian](https://obsidian.md) documents, built in [rust](https://https://www.rust-lang.org/) with a [SQLite](https://www.sqlite.org/index.html) backend.

```bash
❯ odb --json "Recipe"
```
```json
[
  {
    "title": "Tomato and Fennel Risotto",
    "url": "obsidian://open?%2FTomato%20and%20Fennel%20Risotto.md",
  },
  {
    "title": "Christmas Pudding",
    "url": "obsidian://open?%2FChristmas%20Pudding.md",
  },
  {
    "title": "Gnocchi with Chilli Crisp Oil, Capers, and Parmesan",
    "url": "obsidian://open?%2FGnocchi%20with%20Chilli%20Crisp%20Oil.md",
  },
  ...
]
```
