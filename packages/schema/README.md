# @squeezecms/schema

Schema format for Squeeze sites: define your content types in code
(`squeeze.config.ts`) and push them to the API.

```sh
npm i -D @squeezecms/schema
```

ESM-only; needs Node 20.19+ (or 22.12+), where `require()` of ES modules
works for CommonJS projects.

## Defining a schema

```ts
// squeeze.config.ts
import { defineField, defineSchema, defineType } from '@squeezecms/schema';

export default defineSchema({
  types: [
    defineType({
      name: 'post',
      title: 'Blogpost',
      icon: 'article',
      fields: [
        defineField({
          name: 'title',
          title: 'Titel',
          type: 'text',
          required: true
        }),
        defineField({
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          source: 'title'
        })
      ]
    })
  ]
});
```

Field types: `text`, `slug`, `richtext`, `number`, `boolean`, `date`,
`select`, `image`, `file`, `reference`, `array`, `object`, `blocks`.
Every field can be `required` and `translatable`.

`icon` sets the type's icon in the dashboard, one of `TYPE_ICONS`:
`document`, `article`, `page`, `person`, `people`, `box`, `cart`, `tag`,
`folder`, `calendar`, `image`, `star`, `pin`, `chat`, `link`, `gear`. Without
it the dashboard guesses from the type name (`author` → `person`).

## Pushing

```sh
# Once (CI/deploy): idempotent, versioned
npx squeeze-schema push --token $SQUEEZE_TOKEN

# During development: push on every save
npx squeeze-schema watch --token $SQUEEZE_TOKEN
```

The token is a **schema push key** (`sqz_push_`) for the site; create one in
the dashboard under API-sleutels. The key determines the site.

| Flag       | Env var           | Default                      |
| ---------- | ----------------- | ---------------------------- |
| `--token`  | `SQUEEZE_TOKEN`   | required                     |
| `--api`    | `SQUEEZE_API_URL` | `https://api.squeezecms.com` |
| `--config` |                   | `./squeeze.config.ts`        |

The config may be `.ts`, `.mjs`, `.js` or `.json`; TypeScript is loaded with
jiti, no build step needed.

A push that removes a type, or a field, that still has content is refused:
the CLI lists what would be dropped and how many documents are affected.
`push --force` applies it anyway: documents of removed types are unpublished
and kept (they come back as drafts when the type returns, e.g. via a schema
rollback); values of removed fields are stripped from every document for
good. `watch` does not accept `--force`.

## Developing this package

Point the CLI at a local API:

```sh
npm run build --workspace @squeezecms/schema
node packages/schema/dist/cli.js push --api http://localhost:8080 --token sqz_push_...
```

Releases are tagged `schema-v<version>`; see the repository README.
