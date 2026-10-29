# Squeeze SDK

Public developer packages for Squeeze, the schema-driven headless CMS by
UltimateLemon. Published to npm under the `@squeezecms` scope. The API and
dashboard live in the private repo `ultimatelemon/squeeze` (locally
`../squeeze`).

## Layout

```
packages/schema/   @squeezecms/schema: schema DSL (defineType/defineField)
                   and the squeeze-schema CLI (push, watch)
```

New packages go in `packages/<name>` as `@squeezecms/<name>`.

## Package manager

npm workspaces. Node 24 in CI.

## Checks

```bash
npm install
npm run format:check && npm run lint && npm run typecheck && npm test && npm run build
```

CI (`.github/workflows/ci.yml`) runs these on GitHub-hosted runners. The repo is
public, so never use the self-hosted build runner here: fork PRs would run on it.

## Releasing

Bump `version` in the package's `package.json`, commit on `main`, then push a
tag `<package>-v<version>` (e.g. `schema-v0.1.3`). `publish.yml` checks the tag
against the version, builds and publishes through npm trusted publishing (no
token) with provenance. A new package needs a trusted publisher on npmjs.com
first: repo `ultimatelemon/squeeze-sdk`, workflow `publish.yml`.

## Keep in sync with the Squeeze repo

- The schema format in `packages/schema/src/types.ts` mirrors
  `apps/api/internal/schema` (server-side validation). A format change needs
  both sides, API first.
- `TYPE_ICONS` mirrors `typeIcons` in the API and the icons in the dashboard's
  `TypeIcon.tsx`.
- The CLI talks to `PUT /push/v1/schema` with a `sqz_push_` key.

## Language

Everything is English, including CLI output: these are public developer tools.
The dashboard's UI names (e.g. "API-sleutels") stay as they appear there.
