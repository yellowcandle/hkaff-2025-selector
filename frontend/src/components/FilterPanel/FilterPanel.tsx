import React, { useState, useEffect, useRef } from 'react';
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
  const isZh = i18n.language === 'tc';

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isVenueOpen, setIsVenueOpen] = useState(false);
  const [focusedCategoryIndex, setFocusedCategoryIndex] = useState(-1);
  const [focusedVenueIndex, setFocusedVenueIndex] = useState(-1);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const venueDropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.[isZh ? 'name_tc' : 'name_en'] || ''
    : isZh ? '所有類別' : 'All Categories';

  const selectedVenueName = selectedVenue
    ? venues.find(v => v.id === selectedVenue)?.[isZh ? 'name_tc' : 'name_en'] || ''
    : isZh ? '所有場地' : 'All Venues';

  const hasActiveFilters = selectedCategory || selectedVenue || searchQuery;

  // Auto-scroll focused category option into view
  useEffect(() => {
    if (isCategoryOpen && focusedCategoryIndex >= 0 && categoryDropdownRef.current) {
      const options = categoryDropdownRef.current.querySelectorAll('[role="option"]');
      const focusedOption = options[focusedCategoryIndex] as HTMLElement;
      if (focusedOption) {
        focusedOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedCategoryIndex, isCategoryOpen]);

  // Auto-scroll focused venue option into view
  useEffect(() => {
    if (isVenueOpen && focusedVenueIndex >= 0 && venueDropdownRef.current) {
      const options = venueDropdownRef.current.querySelectorAll('[role="option"]');
      const focusedOption = options[focusedVenueIndex] as HTMLElement;
      if (focusedOption) {
        focusedOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedVenueIndex, isVenueOpen]);

  // Handle category button keyboard navigation
  const handleCategoryButtonKeyDown = (e: React.KeyboardEvent) => {
    const totalOptions = categories.length + 1; // +1 for "All Categories"
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isCategoryOpen) {
        setIsCategoryOpen(true);
        setIsVenueOpen(false);
        // Set focus to selected item or first item
        const selectedIndex = selectedCategory
          ? categories.findIndex(c => c.id === selectedCategory) + 1
          : 0;
        setFocusedCategoryIndex(selectedIndex);
      } else {
        // Move to next option, wrap to first
        setFocusedCategoryIndex((prev) => (prev + 1) % totalOptions);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isCategoryOpen) {
        setIsCategoryOpen(true);
        setIsVenueOpen(false);
        // Set focus to selected item or first item
        const selectedIndex = selectedCategory
          ? categories.findIndex(c => c.id === selectedCategory) + 1
          : 0;
        setFocusedCategoryIndex(selectedIndex);
      } else {
        // Move to previous option, wrap to last
        setFocusedCategoryIndex((prev) => (prev - 1 + totalOptions) % totalOptions);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (isCategoryOpen) {
        setFocusedCategoryIndex(0);
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      if (isCategoryOpen) {
        setFocusedCategoryIndex(totalOptions - 1);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isCategoryOpen && focusedCategoryIndex >= 0) {
        // Select the focused option
        if (focusedCategoryIndex === 0) {
          onCategoryChange(null);
        } else {
          const sortedCategories = [...categories].sort((a, b) => a.sort_order - b.sort_order);
          onCategoryChange(sortedCategories[focusedCategoryIndex - 1].id);
        }
        setIsCategoryOpen(false);
        setFocusedCategoryIndex(-1);
      }
    } else if (e.key === 'Escape') {
      if (isCategoryOpen) {
        setIsCategoryOpen(false);
        setFocusedCategoryIndex(-1);
      }
    }
  };

  // Handle venue button keyboard navigation
  const handleVenueButtonKeyDown = (e: React.KeyboardEvent) => {
    const totalOptions = venues.length + 1; // +1 for "All Venues"
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isVenueOpen) {
        setIsVenueOpen(true);
        setIsCategoryOpen(false);
        // Set focus to selected item or first item
        const selectedIndex = selectedVenue
          ? venues.findIndex(v => v.id === selectedVenue) + 1
          : 0;
        setFocusedVenueIndex(selectedIndex);
      } else {
        // Move to next option, wrap to first
        setFocusedVenueIndex((prev) => (prev + 1) % totalOptions);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isVenueOpen) {
        setIsVenueOpen(true);
        setIsCategoryOpen(false);
        // Set focus to selected item or first item
        const selectedIndex = selectedVenue
          ? venues.findIndex(v => v.id === selectedVenue) + 1
          : 0;
        setFocusedVenueIndex(selectedIndex);
      } else {
        // Move to previous option, wrap to last
        setFocusedVenueIndex((prev) => (prev - 1 + totalOptions) % totalOptions);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (isVenueOpen) {
        setFocusedVenueIndex(0);
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      if (isVenueOpen) {
        setFocusedVenueIndex(totalOptions - 1);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isVenueOpen && focusedVenueIndex >= 0) {
        // Select the focused option
        if (focusedVenueIndex === 0) {
          onVenueChange(null);
        } else {
          onVenueChange(venues[focusedVenueIndex - 1].id);
        }
        setIsVenueOpen(false);
        setFocusedVenueIndex(-1);
      }
    } else if (e.key === 'Escape') {
      if (isVenueOpen) {
        setIsVenueOpen(false);
        setFocusedVenueIndex(-1);
      }
    }
  };

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
                const newOpen = !isCategoryOpen;
                setIsCategoryOpen(newOpen);
                setIsVenueOpen(false);
                if (newOpen) {
                  // Set focus to selected item or first item when opening
                  const selectedIndex = selectedCategory
                    ? categories.findIndex(c => c.id === selectedCategory) + 1
                    : 0;
                  setFocusedCategoryIndex(selectedIndex);
                } else {
                  setFocusedCategoryIndex(-1);
                }
              }}
              onKeyDown={handleCategoryButtonKeyDown}
              aria-label={isZh ? '選擇類別' : 'Select category'}
              aria-expanded={isCategoryOpen}
              aria-haspopup="listbox"
              className="w-full min-h-[44px] max-w-[300px] px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-gray-700">{selectedCategoryName}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

          {isCategoryOpen && (
            <div
              ref={categoryDropdownRef}
              role="listbox"
              aria-label={isZh ? '類別選項' : 'Category options'}
              className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto"
            >
              <div
                role="option"
                aria-selected={!selectedCategory}
                data-testid="category-option"
                onClick={() => {
                  onCategoryChange(null);
                  setIsCategoryOpen(false);
                  setFocusedCategoryIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCategoryChange(null);
                    setIsCategoryOpen(false);
                    setFocusedCategoryIndex(-1);
                  }
                }}
                tabIndex={0}
                className={`min-h-[44px] px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center text-gray-700 transition-colors duration-150 ${
                  focusedCategoryIndex === 0 ? 'bg-blue-100 ring-2 ring-inset ring-blue-500' : ''
                }`}
              >
                {isZh ? '所有類別' : 'All Categories'}
              </div>
              {categories
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((category, index) => {
                  const optionIndex = index + 1; // +1 because "All Categories" is at index 0
                  return (
                    <div
                      key={category.id}
                      role="option"
                      aria-selected={selectedCategory === category.id}
                      data-testid="category-option"
                      onClick={() => {
                        onCategoryChange(category.id);
                        setIsCategoryOpen(false);
                        setFocusedCategoryIndex(-1);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onCategoryChange(category.id);
                          setIsCategoryOpen(false);
                          setFocusedCategoryIndex(-1);
                        }
                      }}
                      tabIndex={0}
                      className={`min-h-[44px] px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center text-gray-700 transition-colors duration-150 ${
                        selectedCategory === category.id ? 'bg-blue-100 font-semibold text-blue-900' : ''
                      } ${focusedCategoryIndex === optionIndex ? 'ring-2 ring-inset ring-blue-500' : ''}`}
                    >
                      {isZh ? category.name_tc : category.name_en}
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Venue Filter */}
        <div className="relative flex-1 w-full sm:w-auto">
          <button
            data-testid="venue-filter"
            onClick={() => {
              const newOpen = !isVenueOpen;
              setIsVenueOpen(newOpen);
              setIsCategoryOpen(false);
              if (newOpen) {
                // Set focus to selected item or first item when opening
                const selectedIndex = selectedVenue
                  ? venues.findIndex(v => v.id === selectedVenue) + 1
                  : 0;
                setFocusedVenueIndex(selectedIndex);
              } else {
                setFocusedVenueIndex(-1);
              }
            }}
            onKeyDown={handleVenueButtonKeyDown}
            aria-label={isZh ? '選擇場地' : 'Select venue'}
            aria-expanded={isVenueOpen}
            aria-haspopup="listbox"
            className="w-full min-h-[44px] max-w-[300px] px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left flex justify-between items-center hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="text-gray-700">{selectedVenueName}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isVenueOpen && (
            <div
              ref={venueDropdownRef}
              role="listbox"
              aria-label={isZh ? '場地選項' : 'Venue options'}
              className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-auto"
            >
              <div
                role="option"
                aria-selected={!selectedVenue}
                data-testid="venue-option"
                onClick={() => {
                  onVenueChange(null);
                  setIsVenueOpen(false);
                  setFocusedVenueIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onVenueChange(null);
                    setIsVenueOpen(false);
                    setFocusedVenueIndex(-1);
                  }
                }}
                tabIndex={0}
                className={`min-h-[44px] px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center text-gray-700 transition-colors duration-150 ${
                  focusedVenueIndex === 0 ? 'bg-blue-100 ring-2 ring-inset ring-blue-500' : ''
                }`}
              >
                {isZh ? '所有場地' : 'All Venues'}
              </div>
              {venues.map((venue, index) => {
                const optionIndex = index + 1; // +1 because "All Venues" is at index 0
                return (
                  <div
                    key={venue.id}
                    role="option"
                    aria-selected={selectedVenue === venue.id}
                    data-testid="venue-option"
                    onClick={() => {
                      onVenueChange(venue.id);
                      setIsVenueOpen(false);
                      setFocusedVenueIndex(-1);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onVenueChange(venue.id);
                        setIsVenueOpen(false);
                        setFocusedVenueIndex(-1);
                      }
                    }}
                    tabIndex={0}
                    className={`min-h-[44px] px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center text-gray-700 transition-colors duration-150 ${
                      selectedVenue === venue.id ? 'bg-blue-100 font-semibold text-blue-900' : ''
                    } ${focusedVenueIndex === optionIndex ? 'ring-2 ring-inset ring-blue-500' : ''}`}
                  >
                    {isZh ? venue.name_tc : venue.name_en}
                  </div>
                );
              })}
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
            setFocusedCategoryIndex(-1);
            setFocusedVenueIndex(-1);
          }}
        />
      )}
    </div>
  );
};
