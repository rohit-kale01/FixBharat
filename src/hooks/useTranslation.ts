import { useApp } from '@/store/AppContext';
import type { Language } from '@/lib/i18n';
import { translations } from '@/lib/i18n';

export function useTranslation() {
  const { language } = useApp();

  const t = (key: string): string => {
    return translations[language as Language]?.[key] ?? translations.en[key] ?? key;
  };

  return { t, language };
}
