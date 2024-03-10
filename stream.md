Using the GitHub CLI, the following alias will open the PR related to the current branch on a browser:

`gh pr view --web`

I've aliased it to `pr` in my shell

AWS_CLI_AUTO_PROMPT=on

psql `\e` and `\p`

### Logging nested statements in PostgreSQL:

`alter system set shared_preload_libraries = 'auto_explain';`
`alter system set auto_explain.log_min_duration = 0;`
`alter system set auto_explain.log_nested_statements = true;`

### Does the given PR exist?

gh pr --state all list --head push-qvnqmmtryowz --limit 1 --json id | jq --exit-status ".[0]"
