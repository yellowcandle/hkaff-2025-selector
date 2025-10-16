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

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isVenueOpen, setIsVenueOpen] = useState(false);

  const hasActiveFilters = !!(selectedCategory || selectedVenue || searchQuery);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isZh ? '搜尋片名、導演或國家...' : 'Search by title, director, or country...'}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            aria-label={isZh ? '搜尋影片' : 'Search films'}
          />
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {isZh ? '篩選' : 'Filters'}:
          </span>

          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsVenueOpen(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-[140px] justify-between"
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
              <div className="absolute top-full mt-2 w-full min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    onCategoryChange(null);
                    setIsCategoryOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
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
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    {isZh ? cat.name_tc : cat.name_en}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Venue Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsVenueOpen(!isVenueOpen);
                setIsCategoryOpen(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-[140px] justify-between"
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
              <div className="absolute top-full mt-2 w-full min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    onVenueChange(null);
                    setIsVenueOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
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
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    {isZh ? venue.name_tc : venue.name_en}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Dropdown (placeholder for future) */}
          <div className="relative">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-[140px] justify-between"
              aria-label={isZh ? '選擇日期' : 'Select date'}
              disabled
            >
              <span>{isZh ? '所有日期' : 'All Dates'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="ml-auto text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              {isZh ? '清除篩選' : 'Clear'}
            </button>
          )}
        </div>
      </div>

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