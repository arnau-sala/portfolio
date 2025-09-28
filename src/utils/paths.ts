// Utility function to handle asset paths for GitHub Pages
export function getAssetPath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/portfolio' : '';
  return `${basePath}${path}`;
}

export const ASSET_PREFIX = process.env.NODE_ENV === 'production' ? '/portfolio' : '';