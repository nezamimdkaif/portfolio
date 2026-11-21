// src/utils.ts

export function getAssetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!path) return '';
  if (/^(https?:|mailto:|tel:|data:|#)/.test(path) || (basePath && path.startsWith(basePath))) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
