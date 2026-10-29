import { describe, expect, it } from 'vitest';
import { DEFAULT_API_URL, resolveApiUrl } from './apiUrl.js';

describe('resolveApiUrl', () => {
  it('defaults to the production API', () => {
    expect(resolveApiUrl()).toBe(DEFAULT_API_URL);
    expect(resolveApiUrl('', '')).toBe(DEFAULT_API_URL);
  });

  it('prefers the flag over the env var', () => {
    expect(
      resolveApiUrl('http://localhost:8080', 'https://staging.example.com')
    ).toBe('http://localhost:8080');
  });

  it('falls back to the env var', () => {
    expect(resolveApiUrl(undefined, 'http://localhost:8080')).toBe(
      'http://localhost:8080'
    );
  });

  it('strips trailing slashes', () => {
    expect(resolveApiUrl('http://localhost:8080//')).toBe(
      'http://localhost:8080'
    );
  });
});
