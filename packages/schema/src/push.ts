import { parseArgs } from 'node:util';

export interface CliArgs {
  command?: string;
  config: string;
  api?: string;
  token?: string;
  force: boolean;
  help: boolean;
}

export interface SchemaConflict {
  type: string;
  field?: string;
  documents: number;
}

export function parseCliArgs(argv: string[]): CliArgs {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      config: { type: 'string', default: './squeeze.config.ts' },
      api: { type: 'string' },
      token: { type: 'string' },
      force: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false }
    }
  });
  return {
    command: positionals[0],
    config: values.config,
    api: values.api,
    token: values.token,
    force: values.force,
    help: values.help
  };
}

export function pushUrl(apiUrl: string, force: boolean): string {
  return `${apiUrl}/push/v1/schema${force ? '?force=true' : ''}`;
}

function documentCount(n: number): string {
  return n === 1 ? '1 document' : `${n} documents`;
}

// watch never forces, so its hint points at a one-off push instead.
export function formatConflicts(
  conflicts: SchemaConflict[],
  watching = false
): string[] {
  const lines = [
    '✖ push refused: this schema removes types or fields that still have content:'
  ];
  for (const c of conflicts) {
    const what = c.field
      ? `field ${c.type}.${c.field}`
      : `type ${c.type} (with all its documents)`;
    lines.push(`  - ${what}: ${documentCount(c.documents)}`);
  }
  lines.push(
    watching
      ? 'Fix the schema. To apply it anyway, stop watch and run squeeze-schema push --force once.'
      : 'Fix the schema, or push again with --force to apply it anyway.',
    'With --force, documents of removed types are unpublished (they come back as drafts when the type returns, e.g. through a rollback); values of removed fields are deleted for good.'
  );
  return lines;
}
