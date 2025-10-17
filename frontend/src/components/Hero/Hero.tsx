import React from 'react';
import { useTranslation } from 'react-i18next';
import { Film } from 'lucide-react';

export const Hero: React.FC = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';

  return (
    <header className="hero-gradient text-white border-b border-gray-700" data-version="v3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Film className="w-10 h-10" />
          <h1 className="text-4xl md:text-5xl font-bold">
            HKAFF 2025
          </h1>
        </div>
        <p className="text-sm md:text-base lg:text-lg text-white/90 font-light">
          {isZh
            ? '你的個人電影節指南和排程器'
            : 'Your personal film festival guide and scheduler'
          }
        </p>
      </div>
    </header>
  );
};