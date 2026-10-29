#!/usr/bin/env node
import { existsSync, watch, type FSWatcher } from 'node:fs';
import { resolve } from 'node:path';
import { createJiti } from 'jiti';
import { DEFAULT_API_URL, resolveApiUrl } from './apiUrl.js';
import {
  formatConflicts,
  type CliArgs,
  parseCliArgs,
  pushUrl,
  type SchemaConflict
} from './push.js';

const HELP = `Gebruik: squeeze-schema <push|watch> [opties]

Opties:
  --config <pad>   Pad naar squeeze.config.ts (default: ./squeeze.config.ts)
  --api <url>      API-url (of env SQUEEZE_API_URL, default ${DEFAULT_API_URL})
  --token <key>    sqz_push_ API-sleutel (of env SQUEEZE_TOKEN)
  --force          Push ook als types of velden met content verdwijnen
                   (alleen bij push). Documenten van verwijderde types
                   worden gedepubliceerd en komen als concept terug als
                   het type terugkomt; waarden van verwijderde velden
                   worden definitief gewist.
`;

interface PushResponse {
  changed?: boolean;
  version?: number;
  hash?: string;
  unpublished?: number;
  message?: string;
  errors?: { path: string; message: string }[];
  conflicts?: SchemaConflict[];
}

interface ConfigModule {
  default?: unknown;
  schema?: unknown;
}

function fail(message: string): never {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

let values: CliArgs;
try {
  values = parseCliArgs(process.argv.slice(2));
} catch (err) {
  fail(`${errorMessage(err)}\n\n${HELP}`);
}

const command = values.command;
if (values.help || (command !== 'push' && command !== 'watch')) {
  console.info(HELP);
  process.exit(command && !values.help ? 1 : 0);
}

// Forcing on every save would let a half-edited config wipe field values.
if (values.force && command === 'watch') {
  fail('--force kan alleen met push, niet met watch');
}

const apiUrl = resolveApiUrl(values.api, process.env.SQUEEZE_API_URL);
const token = values.token ?? process.env.SQUEEZE_TOKEN;

if (!token) {
  fail('--token (of SQUEEZE_TOKEN) is verplicht: een sqz_push_ API-sleutel');
}

const configPath = resolve(process.cwd(), values.config);
if (!existsSync(configPath)) {
  fail(`config niet gevonden: ${configPath}`);
}

const jiti = createJiti(import.meta.url, { moduleCache: false });

async function loadSchema(): Promise<object> {
  const mod = await jiti.import<ConfigModule>(configPath);
  const schema = mod.default ?? mod.schema;
  if (!schema || typeof schema !== 'object') {
    throw new Error('config moet een schema als default export hebben');
  }
  return schema;
}

async function push(): Promise<boolean> {
  const schema = await loadSchema();
  const response = await fetch(pushUrl(apiUrl, values.force), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(schema)
  });

  const body = (await response
    .json()
    .catch((): PushResponse => ({}))) as PushResponse;
  if (response.status === 422 && Array.isArray(body.errors)) {
    console.error('✖ schema-validatie mislukt:');
    for (const err of body.errors) {
      console.error(`  ${err.path}: ${err.message}`);
    }
    return false;
  }
  if (response.status === 409 && Array.isArray(body.conflicts)) {
    for (const line of formatConflicts(body.conflicts, command === 'watch')) {
      console.error(line);
    }
    return false;
  }
  if (!response.ok) {
    console.error(
      `✖ push mislukt (${response.status}): ${body.message ?? 'onbekende fout'}`
    );
    return false;
  }
  if (body.changed) {
    console.info(
      `✔ schema gepusht: versie ${body.version} (${(body.hash ?? '').slice(0, 12)})`
    );
    if (body.unpublished) {
      console.info(
        `  ${body.unpublished} document(en) van verwijderde types gedepubliceerd`
      );
    }
  } else {
    console.info(`= schema ongewijzigd (versie ${body.version})`);
  }
  return true;
}

async function safePush(): Promise<boolean> {
  try {
    return await push();
  } catch (err) {
    console.error(`✖ ${errorMessage(err)}`);
    return false;
  }
}

if (command === 'push') {
  process.exit((await safePush()) ? 0 : 1);
}

console.info(`👀 watching ${configPath}`);
await safePush();

let timer: NodeJS.Timeout | undefined;
let watcher: FSWatcher | undefined;

// Atomic saves show up as rename events on some platforms, which detach the
// watcher from the file; re-arming after every push keeps it attached.
function arm(): void {
  watcher?.close();
  watcher = watch(configPath, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      void safePush().then(arm);
    }, 150);
  });
}
arm();
