import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Category, Venue } from '../../types';

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
  const isZh = i18n.language === 'zh';

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isVenueOpen, setIsVenueOpen] = useState(false);

  const selectedCategoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.[isZh ? 'name_tc' : 'name_en'] || ''
    : isZh ? '所有類別' : 'All Categories';

  const selectedVenueName = selectedVenue
    ? venues.find(v => v.id === selectedVenue)?.[isZh ? 'name_tc' : 'name_en'] || ''
    : isZh ? '所有場地' : 'All Venues';

  const hasActiveFilters = selectedCategory || selectedVenue || searchQuery;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isZh ? '搜尋電影名稱、導演或類別...' : 'Search by title, director, or category...'}
            aria-label={isZh ? '搜尋電影' : 'Search films'}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label={isZh ? '清除搜尋' : 'Clear search'}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 text-gray-400"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Category Filter */}
          <div className="relative flex-1 w-full sm:w-auto">
            <button
              data-testid="category-filter"
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsVenueOpen(false);
              }}
              aria-label={isZh ? '選擇類別' : 'Select category'}
              aria-expanded={isCategoryOpen}
              aria-haspopup="listbox"
              className="w-full min-h-[44px] px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-gray-700">{selectedCategoryName}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

          {isCategoryOpen && (
            <div
              role="listbox"
              aria-label={isZh ? '類別選項' : 'Category options'}
              className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              <div
                role="option"
                aria-selected={!selectedCategory}
                data-testid="category-option"
                onClick={() => {
                  onCategoryChange(null);
                  setIsCategoryOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCategoryChange(null);
                    setIsCategoryOpen(false);
                  }
                }}
                tabIndex={0}
                className="min-h-[44px] px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
              >
                {isZh ? '所有類別' : 'All Categories'}
              </div>
              {categories
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((category) => (
                  <div
                    key={category.id}
                    role="option"
                    aria-selected={selectedCategory === category.id}
                    data-testid="category-option"
                    onClick={() => {
                      onCategoryChange(category.id);
                      setIsCategoryOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onCategoryChange(category.id);
                        setIsCategoryOpen(false);
                      }
                    }}
                    tabIndex={0}
                    className={`min-h-[44px] px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                      selectedCategory === category.id ? 'bg-blue-100 font-semibold' : ''
                    }`}
                  >
                    {isZh ? category.name_tc : category.name_en}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Venue Filter */}
        <div className="relative flex-1 w-full sm:w-auto">
          <button
            data-testid="venue-filter"
            onClick={() => {
              setIsVenueOpen(!isVenueOpen);
              setIsCategoryOpen(false);
            }}
            aria-label={isZh ? '選擇場地' : 'Select venue'}
            aria-expanded={isVenueOpen}
            aria-haspopup="listbox"
            className="w-full min-h-[44px] px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="text-gray-700">{selectedVenueName}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isVenueOpen && (
            <div
              role="listbox"
              aria-label={isZh ? '場地選項' : 'Venue options'}
              className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            >
              <div
                role="option"
                aria-selected={!selectedVenue}
                data-testid="venue-option"
                onClick={() => {
                  onVenueChange(null);
                  setIsVenueOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onVenueChange(null);
                    setIsVenueOpen(false);
                  }
                }}
                tabIndex={0}
                className="min-h-[44px] px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
              >
                {isZh ? '所有場地' : 'All Venues'}
              </div>
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  role="option"
                  aria-selected={selectedVenue === venue.id}
                  data-testid="venue-option"
                  onClick={() => {
                    onVenueChange(venue.id);
                    setIsVenueOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onVenueChange(venue.id);
                      setIsVenueOpen(false);
                    }
                  }}
                  tabIndex={0}
                  className={`min-h-[44px] px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center ${
                    selectedVenue === venue.id ? 'bg-blue-100 font-semibold' : ''
                  }`}
                >
                  {isZh ? venue.name_tc : venue.name_en}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            data-testid="clear-filters"
            onClick={onClearFilters}
            aria-label={isZh ? '清除所有篩選' : 'Clear all filters'}
            className="min-h-[44px] px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            {isZh ? '清除篩選' : 'Clear Filters'}
          </button>
        )}
      </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(isCategoryOpen || isVenueOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setIsCategoryOpen(false);
            setIsVenueOpen(false);
          }}
        />
      )}
    </div>
  );
};
