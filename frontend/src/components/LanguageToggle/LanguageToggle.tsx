import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const toggleLanguage = () => {
    const newLang = isZh ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = newLang === 'zh' ? 'zh-HK' : 'en';
  };

  return (
    <button
      data-testid="language-toggle"
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      aria-label={isZh ? '切換語言至英文' : 'Switch language to Traditional Chinese'}
    >
      {isZh ? 'EN' : '繁'}
    </button>
  );
};
