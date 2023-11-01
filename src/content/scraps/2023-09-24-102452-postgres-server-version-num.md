---
title: "TIL: Postgres version numbering"
---
I wanted to programatically compare postgresql versions on CI, local development, production, etc. You can get a version string with `SHOW server_version` (or `SELECT current_setting('server_version')`), but this can contain extra info. For example, on my development machine the value is `15.4 (Homebrew)`. As well as the string, there's also a version number which seemed more useful.

```sql
SELECT current_setting('server_version_num');
```
On my development machine running postgres 15.4 this returns:
```
current_setting
-----------------
 150004
```
That looked a little bit weird to me, so I looked into it further. It's due to a change in the way postgres versions are numbered. Prior to version `10`, the first two parts of the version number were the major version. So `9.5` and `9.6` are both major versions. A minor release would be something like `9.5.6` or `9.6.2`. Since version `10`, only the first number is the major version. `10.1` and `10.2` are both minor releases of version `10`.

When encoding this as an integer, the postgres team decided the two least significant digits would always be the minor version. [The postgres versioning policy documentation](https://www.postgresql.org/support/versioning/) explains more, as does [this note from Alvaro Herrera](https://www.postgresql.org/message-id/20180122190455.7zpoxjuesi4qk7jt%40alvherre.pgsql). For versions `10` and above, we can split the major and minor version out like so:

```sql
SELECT
  current_setting('server_version_num')::integer / 10000 AS major_version,
  MOD(current_setting('server_version_num')::integer, 100) AS minor_version;
```

```
 major_version | minor_version
---------------+---------------
            15 |             4
```
