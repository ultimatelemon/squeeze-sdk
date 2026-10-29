export const DEFAULT_API_URL = 'https://api.squeezecms.com';

export function resolveApiUrl(flag?: string, env?: string): string {
  const url = flag || env || DEFAULT_API_URL;
  return url.replace(/\/+$/, '');
}
