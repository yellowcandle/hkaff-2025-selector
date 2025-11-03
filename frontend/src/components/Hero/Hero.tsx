import React from 'react';
import { useTranslation } from 'react-i18next';
import { Film } from 'lucide-react';

export const Hero: React.FC = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';

  return (
    <header className="bg-gradient-to-br from-purple-50 via-white to-pink-50 border-b border-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-2">
          <Film className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-purple-900 tracking-tight">
            HKAFF scheduler
          </h1>
        </div>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 font-normal max-w-2xl mx-auto">
          {isZh
            ? '你的個人電影節指南和排程器'
            : 'Your personal film festival guide and scheduler'
          }
        </p>
      </div>
    </header>
  );
};