import React from 'react';
import { useTranslation } from 'react-i18next';
import { Film } from 'lucide-react';

export const Hero: React.FC = () => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';

  return (
    <header className="hero-gradient text-white border-b border-transparent" data-version="v4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <Film className="w-12 h-12 text-purple-200" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            HKAFF scheduler
          </h1>
        </div>
        <p className="text-base md:text-lg text-white/95 font-medium max-w-2xl mx-auto">
          {isZh
            ? '你的個人電影節指南和排程器'
            : 'Your personal film festival guide and scheduler'
          }
        </p>
      </div>
    </header>
  );
};