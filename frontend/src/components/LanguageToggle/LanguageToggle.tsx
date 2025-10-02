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
      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      aria-label={isZh ? '切換語言至英文' : 'Switch language to Traditional Chinese'}
      title={isZh ? '切換語言' : 'Switch language'}
    >
      {isZh ? 'EN' : '繁'}
    </button>
  );
};
