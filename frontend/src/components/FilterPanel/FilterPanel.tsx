import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Category, Venue } from '../../types';

interface FilterPanelProps {
  categories: Category[];
  venues: Venue[];
  selectedCategory: string | null;
  selectedVenue: string | null;
  searchQuery: string;
  onCategoryChange: (categoryId: string | null) => void;
  onVenueChange: (venueId: string | null) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  venues,
  selectedCategory,
  selectedVenue,
  searchQuery,
  onCategoryChange,
  onVenueChange,
  onSearchChange,
  onClearFilters,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';
  const [activeTab, setActiveTab] = useState<'all' | 'category' | 'venue'>('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isVenueOpen, setIsVenueOpen] = useState(false);

  const hasActiveFilters = !!(selectedCategory || selectedVenue || searchQuery);

  return (
    <div className="glass-panel p-6 mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-festival-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isZh ? '搜尋電影、導演、類型...' : 'Search films, directors, genres...'}
              className="w-full pl-10 pr-4 py-3 bg-festival-black/5 border border-festival-black/10 rounded-xl focus:ring-2 focus:ring-festival-red/20 focus:border-festival-red/50 outline-none transition-all placeholder:text-festival-black/40"
              aria-label={isZh ? '搜尋影片' : 'Search films'}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Segmented Control */}
          <div className="segmented-control">
            <button
              onClick={() => setActiveTab('all')}
              className={`${activeTab === 'all' ? 'active' : ''} text-festival-black/70 hover:text-festival-black`}
            >
              {isZh ? '全部' : 'All'}
            </button>
            <button
              onClick={() => setActiveTab('category')}
              className={`${activeTab === 'category' ? 'active' : ''} text-festival-black/70 hover:text-festival-black`}
            >
              {isZh ? '類型' : 'Category'}
            </button>
            <button
              onClick={() => setActiveTab('venue')}
              className={`${activeTab === 'venue' ? 'active' : ''} text-festival-black/70 hover:text-festival-black`}
            >
              {isZh ? '場地' : 'Venue'}
            </button>
          </div>

          {/* Dropdowns */}
          <div className="flex gap-3">
            {(activeTab === 'all' || activeTab === 'category') && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCategoryOpen(!isCategoryOpen);
                    setIsVenueOpen(false);
                  }}
                  className="pill-button px-4 py-2 text-sm font-medium text-festival-black hover:text-festival-red transition-colors flex items-center gap-2 min-w-[140px] justify-between"
                  aria-label={isZh ? '選擇類別' : 'Select category'}
                >
                  <span className="truncate">
                    {selectedCategory
                      ? categories.find(c => c.id === selectedCategory)?.[isZh ? 'name_tc' : 'name_en']
                      : (isZh ? '所有類別' : 'All Genres')
                    }
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full mt-2 w-full min-w-[200px] glass-panel z-50 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        onCategoryChange(null);
                        setIsCategoryOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-festival-red/10 transition-colors rounded-lg"
                    >
                      {isZh ? '所有類別' : 'All Genres'}
                    </button>
                    {categories.sort((a, b) => a.sort_order - b.sort_order).map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onCategoryChange(cat.id);
                          setIsCategoryOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-festival-red/10 transition-colors rounded-lg"
                      >
                        {isZh ? cat.name_tc : cat.name_en}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'venue') && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsVenueOpen(!isVenueOpen);
                    setIsCategoryOpen(false);
                  }}
                  className="pill-button px-4 py-2 text-sm font-medium text-festival-black hover:text-festival-red transition-colors flex items-center gap-2 min-w-[140px] justify-between"
                  aria-label={isZh ? '選擇場地' : 'Select venue'}
                >
                  <span className="truncate">
                    {selectedVenue
                      ? venues.find(v => v.id === selectedVenue)?.[isZh ? 'name_tc' : 'name_en']
                      : (isZh ? '所有場地' : 'All Venues')
                    }
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${isVenueOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isVenueOpen && (
                  <div className="absolute top-full mt-2 w-full min-w-[200px] glass-panel z-50 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        onVenueChange(null);
                        setIsVenueOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-festival-plum/10 transition-colors rounded-lg"
                    >
                      {isZh ? '所有場地' : 'All Venues'}
                    </button>
                    {venues.map((venue) => (
                      <button
                        key={venue.id}
                        onClick={() => {
                          onVenueChange(venue.id);
                          setIsVenueOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-festival-plum/10 transition-colors rounded-lg"
                      >
                        {isZh ? venue.name_tc : venue.name_en}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="pill-button px-4 py-2 text-sm font-medium text-festival-red hover:text-festival-black transition-colors"
            >
              {isZh ? '清除篩選' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-festival-black/10">
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-festival-red/10 text-festival-red rounded-full text-sm font-medium">
                {categories.find(c => c.id === selectedCategory)?.[isZh ? 'name_tc' : 'name_en']}
                <button
                  onClick={() => onCategoryChange(null)}
                  className="ml-1 hover:text-festival-black"
                >
                  ×
                </button>
              </span>
            )}
            {selectedVenue && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-festival-plum/10 text-festival-plum rounded-full text-sm font-medium">
                {venues.find(v => v.id === selectedVenue)?.[isZh ? 'name_tc' : 'name_en']}
                <button
                  onClick={() => onVenueChange(null)}
                  className="ml-1 hover:text-festival-black"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-festival-lilac/10 text-festival-lilac rounded-full text-sm font-medium">
                "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:text-festival-black"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Backdrop for dropdowns */}
      {(isCategoryOpen || isVenueOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsCategoryOpen(false);
            setIsVenueOpen(false);
          }}
        />
      )}
    </div>
  );
};