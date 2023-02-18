---
title: htmlq
url: https://github.com/tomafro/htmlq
---
A very quick rust command line tool to query html, in a similar way to `jq`.

```shell
$ http https://tomafro.net | htmlq "li:nth-child(2) i.fab"
<i class="fab fa-github-square"></i>
```
