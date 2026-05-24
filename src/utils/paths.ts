// Utility function to handle asset paths for GitHub Pages
export function getAssetPath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/portfolio' : '';
  return `${basePath}${path}`;
}

export const ASSET_PREFIX = process.env.NODE_ENV === 'production' ? '/portfolio' : '';

export type ResumeLanguage = 'en' | 'es' | 'ca';

const RESUME_FILE_SUFFIX: Record<ResumeLanguage, string> = {
  en: 'EN',
  es: 'ES',
  ca: 'CAT',
};

export function getResumeFileName(language: ResumeLanguage): string {
  return `ArnauSala_Resume_${RESUME_FILE_SUFFIX[language]}.pdf`;
}