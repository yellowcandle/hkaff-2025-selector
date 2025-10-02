import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Category, Venue } from '../../types';

interface FilterPanelProps {
  categories: Category[];
  venues: Venue[];
  selectedCategory: string | null;
  selectedVenue: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onVenueChange: (venueId: string | null) => void;
  onClearFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories,
  venues,
  selectedCategory,
  selectedVenue,
  onCategoryChange,
  onVenueChange,
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

  const hasActiveFilters = selectedCategory || selectedVenue;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Category Filter */}
        <div className="relative flex-1 w-full sm:w-auto">
          <button
            data-testid="category-filter"
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsVenueOpen(false);
            }}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center hover:bg-gray-50"
          >
            <span className="text-gray-700">{selectedCategoryName}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isCategoryOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div
                data-testid="category-option"
                onClick={() => {
                  onCategoryChange(null);
                  setIsCategoryOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                {isZh ? '所有類別' : 'All Categories'}
              </div>
              {categories
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((category) => (
                  <div
                    key={category.id}
                    data-testid="category-option"
                    onClick={() => {
                      onCategoryChange(category.id);
                      setIsCategoryOpen(false);
                    }}
                    className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${
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
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center hover:bg-gray-50"
          >
            <span className="text-gray-700">{selectedVenueName}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isVenueOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div
                data-testid="venue-option"
                onClick={() => {
                  onVenueChange(null);
                  setIsVenueOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                {isZh ? '所有場地' : 'All Venues'}
              </div>
              {venues.map((venue) => (
                <div
                  key={venue.id}
                  data-testid="venue-option"
                  onClick={() => {
                    onVenueChange(venue.id);
                    setIsVenueOpen(false);
                  }}
                  className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${
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
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
          >
            {isZh ? '清除篩選' : 'Clear Filters'}
          </button>
        )}
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
