'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { LimelightNav } from './LimelightNav';

const SHORT_CODES: Record<string, string> = { en: 'EN', es: 'ES', ca: 'CAT' };

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { currentLanguage, changeLanguage, getLanguageDisplayName, availableLanguages } = useLanguage();

  const items = availableLanguages.map(lang => ({
    id: lang,
    label: compact ? SHORT_CODES[lang] ?? lang.toUpperCase() : getLanguageDisplayName(lang),
  }));

  const activeIndex = availableLanguages.indexOf(currentLanguage);

  return (
    <LimelightNav
      items={items}
      activeIndex={activeIndex}
      onItemClick={(_, id) => changeLanguage(id as 'en' | 'es' | 'ca')}
      size={compact ? 'sm' : 'md'}
    />
  );
}
