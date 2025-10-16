import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';

  const toggleLanguage = () => {
    const newLang = isZh ? 'en' : 'tc';
    i18n.changeLanguage(newLang);
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = newLang === 'tc' ? 'zh-HK' : 'en';
  };

  return (
    <button
      data-testid="language-toggle"
      onClick={toggleLanguage}
      className="pill-button flex items-center gap-2 px-4 py-2 text-sm font-medium text-festival-black hover:text-festival-red transition-colors duration-200"
      aria-label={isZh ? '切換語言至英文' : 'Switch language to Traditional Chinese'}
      title={isZh ? '切換語言' : 'Switch language'}
    >
      <span className="text-base">
        {isZh ? '🇭🇰' : '🇬🇧'}
      </span>
      <span className="font-semibold">
        {isZh ? '繁' : 'EN'}
      </span>
    </button>
  );
};