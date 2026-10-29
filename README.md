# Squeeze SDK

Developer packages for [Squeeze](https://squeezecms.com), the schema-driven
headless CMS.

| Package                                 | What                                                          |
| --------------------------------------- | ------------------------------------------------------------- |
| [`@squeezecms/schema`](packages/schema) | Define content types in TypeScript and push them with the CLI |

## Development

```sh
npm install
npm run lint && npm run typecheck && npm test && npm run build
```

## Releasing

1. Bump `version` in the package's `package.json` and commit it on `main`.
2. Tag that commit `<package>-v<version>` and push the tag, e.g.
   `git tag schema-v0.1.1 && git push origin schema-v0.1.1`.
3. `.github/workflows/publish.yml` checks, builds and publishes the package
   to npm through trusted publishing (no token), with provenance.

A new package needs a trusted publisher on npmjs.com (package settings →
Trusted publishing: `ultimatelemon/squeeze-sdk`, workflow `publish.yml`).

## License

MIT
