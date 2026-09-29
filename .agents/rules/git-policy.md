# Git Policy

- **Do NOT automatically commit or push to Git**: Never run `git commit`, `git push`, or commit files to the git repository automatically under any circumstances.
- **Explicit User Request Only**: Git commits and pushes must only ever be executed when the user explicitly instructs you to do so in the prompt.
- **Inspect Status Only**: Non-destructive commands like `git status`, `git diff`, or `git log` may be used for information gathering if needed, but no automated commits should ever be created.
