## Changesets

Use `pnpm changeset` to create a release note for publishable changes.

Typical flow:

1. Run `pnpm changeset`
2. Commit the generated markdown file in `.changeset/`
3. Merge to `master`
4. GitHub Actions creates or updates the release PR
5. Merge the release PR to publish the new npm version
