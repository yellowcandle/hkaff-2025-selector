import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface HeroProps {
  onSearch?: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <header className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Logo - Add your logo here */}
        <img src="/favicon.svg" alt="HKAFF 2025 Logo" className="h-16 w-auto hidden lg:block" />
        
        {/* Title & Subtitle */}
        <div className="text-center lg:text-left flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-inter">
            HKAFF 2025
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed font-inter">
            {isZh 
              ? '香港亞洲電影節 2025 您的專屬選片指南與時間表'
              : 'Hong Kong Asian Film Festival 2025 Your Personal Film Guide & Scheduler'
            }
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
          <input
            type="search"
            placeholder={isZh ? '搜尋電影...' : 'Search films...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 font-inter text-base focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent shadow-lg"
            aria-label={isZh ? '搜尋電影' : 'Search films'}
          />
        </form>
      </div>

      {/* Stats */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-wrap justify-center gap-8 text-white/80 text-sm font-inter">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span>{isZh ? '75 部電影' : '75 Films'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span>{isZh ? '14 個場地' : '14 Venues'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span>{isZh ? '10 天活動' : '10 Days'}</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
        <button
          onClick={() => {
            const element = document.getElementById('main-content');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl font-inter"
        >
          <span>{isZh ? '開始探索' : 'Start Exploring'}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </header>
  );
};