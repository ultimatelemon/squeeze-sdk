import { describe, expect, it } from 'vitest';
import { formatConflicts, parseCliArgs, pushUrl } from './push.js';

describe('parseCliArgs', () => {
  it('defaults force to false', () => {
    const args = parseCliArgs(['push', '--token', 'sqz_push_x']);
    expect(args).toMatchObject({
      command: 'push',
      token: 'sqz_push_x',
      config: './squeeze.config.ts',
      force: false,
      help: false
    });
  });

  it('reads --force and --api', () => {
    const args = parseCliArgs([
      'push',
      '--force',
      '--api',
      'http://localhost:8080'
    ]);
    expect(args.force).toBe(true);
    expect(args.api).toBe('http://localhost:8080');
  });

  it('rejects unknown flags', () => {
    expect(() => parseCliArgs(['push', '--allow-destructive'])).toThrow();
  });
});

describe('pushUrl', () => {
  it('adds force=true only when forcing', () => {
    expect(pushUrl('http://localhost:8080', false)).toBe(
      'http://localhost:8080/push/v1/schema'
    );
    expect(pushUrl('http://localhost:8080', true)).toBe(
      'http://localhost:8080/push/v1/schema?force=true'
    );
  });
});

describe('formatConflicts', () => {
  it('lists removed types and fields with document counts', () => {
    const out = formatConflicts([
      { type: 'author', documents: 3 },
      { type: 'post', field: 'author', documents: 1 }
    ]).join('\n');
    expect(out).toContain('type author (met alle documenten): 3 documenten');
    expect(out).toContain('veld post.author: 1 document');
    expect(out).toContain('push opnieuw met --force');
  });

  it('does not tell watch to retry with --force', () => {
    const out = formatConflicts([{ type: 'author', documents: 1 }], true).join(
      '\n'
    );
    expect(out).not.toContain('push opnieuw met --force');
    expect(out).toContain('stop watch');
  });
});
