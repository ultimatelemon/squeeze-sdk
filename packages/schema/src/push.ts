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
  return n === 1 ? '1 document' : `${n} documenten`;
}

// watch never forces, so its hint points at a one-off push instead.
export function formatConflicts(
  conflicts: SchemaConflict[],
  watching = false
): string[] {
  const lines = [
    '✖ push geweigerd: dit schema verwijdert types of velden die nog content hebben:'
  ];
  for (const c of conflicts) {
    const what = c.field
      ? `veld ${c.type}.${c.field}`
      : `type ${c.type} (met alle documenten)`;
    lines.push(`  - ${what}: ${documentCount(c.documents)}`);
  }
  lines.push(
    watching
      ? 'Pas het schema aan. Wil je dit echt doorvoeren, stop watch en draai eenmalig squeeze-schema push --force.'
      : 'Pas het schema aan, of push opnieuw met --force om het toch door te voeren.',
    'Met --force worden documenten van verwijderde types gedepubliceerd (ze komen als concept terug als het type terugkomt, bijv. via een rollback); waarden van verwijderde velden worden definitief gewist.'
  );
  return lines;
}
