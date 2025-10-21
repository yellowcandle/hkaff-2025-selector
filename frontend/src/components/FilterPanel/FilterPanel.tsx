import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Category, Venue } from '../../types';

interface FilterPanelProps {
  categories: Category[];
  venues: Venue[];
  dates?: string[];
  selectedCategory: string | null;
  selectedVenue: string | null;
  selectedDate: string | null;
  searchQuery: string;
  onCategoryChange: (categoryId: string | null) => void;
  onVenueChange: (venueId: string | null) => void;
  onDateChange: (date: string | null) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  venues,
  dates = [],
  selectedCategory,
  selectedVenue,
  selectedDate,
  searchQuery,
  onCategoryChange,
  onVenueChange,
  onDateChange,
  onSearchChange,
  onClearFilters,
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isVenueOpen, setIsVenueOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const hasActiveFilters = !!(selectedCategory || selectedVenue || selectedDate || searchQuery);
  const anyDropdownOpen = isCategoryOpen || isVenueOpen || isDateOpen;

  // Handle escape key to close dropdowns
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && anyDropdownOpen) {
        setIsCategoryOpen(false);
        setIsVenueOpen(false);
        setIsDateOpen(false);
      }
    };

    if (anyDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [anyDropdownOpen]);

  return (
    <div className="bg-white border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isZh ? '搜尋電影、導演...' : 'Search films, directors...'}
              className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg outline-none transition-all placeholder:text-gray-400 font-inter ${
                searchQuery
                  ? 'border-purple-400 ring-2 ring-purple-200 focus:ring-purple-300'
                  : 'border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-transparent'
              }`}
              aria-label={isZh ? '搜尋影片' : 'Search films'}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className={`flex flex-wrap items-center justify-center gap-3 relative ${anyDropdownOpen ? 'z-20' : ''}`}>
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsVenueOpen(false);
                setIsDateOpen(false);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors font-inter ${
                selectedCategory
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isCategoryOpen ? 'relative z-30' : ''}`}
              aria-label={isZh ? '選擇類別' : 'Select category'}
            >
              <span>
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
              <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-80 overflow-y-auto animate-dropdown">
                <button
                  onClick={() => {
                    onCategoryChange(null);
                    setIsCategoryOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors font-inter"
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
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors font-inter"
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
                setIsDateOpen(false);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors font-inter ${
                selectedVenue
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isVenueOpen ? 'relative z-30' : ''}`}
              aria-label={isZh ? '選擇場地' : 'Select venue'}
            >
              <span>
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
              <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-80 overflow-y-auto animate-dropdown">
                <button
                  onClick={() => {
                    onVenueChange(null);
                    setIsVenueOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors font-inter"
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
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors font-inter"
                  >
                    {isZh ? venue.name_tc : venue.name_en}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Dropdown */}
          {dates.length > 0 && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsDateOpen(!isDateOpen);
                  setIsCategoryOpen(false);
                  setIsVenueOpen(false);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors font-inter ${
                  selectedDate
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isDateOpen ? 'relative z-30' : ''}`}
                aria-label={isZh ? '選擇日期' : 'Select date'}
              >
                <span>
                  {selectedDate || (isZh ? '所有日期' : 'All Dates')}
                </span>
                <svg className={`w-4 h-4 transition-transform ${isDateOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDateOpen && (
                <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-80 overflow-y-auto animate-dropdown">
                  <button
                    onClick={() => {
                      onDateChange(null);
                      setIsDateOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors font-inter"
                  >
                    {isZh ? '所有日期' : 'All Dates'}
                  </button>
                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        onDateChange(date);
                        setIsDateOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors font-inter"
                    >
                      {date}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-inter"
            >
              {isZh ? '清除' : 'Clear'}
            </button>
          )}
        </div>
      </div>

      {/* Backdrop for dropdowns */}
      {anyDropdownOpen && (
        <div className="fixed inset-0 z-10" />
      )}
    </div>
  );
};

FilterPanel.displayName = 'FilterPanel';
