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
        {/* Search Bar - Enhanced with better focus states */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-muted-foreground"
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
            placeholder={isZh ? '搜尋電影...' : 'Search films...'}
            aria-label={isZh ? '搜尋電影' : 'Search films'}
            className="w-full pl-10 pr-10 py-3 border-2 border-input rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder-muted-foreground transition-all duration-200 hover:border-primary/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label={isZh ? '清除搜尋' : 'Clear search'}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-foreground text-muted-foreground transition-colors"
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
              className={`w-full min-h-[44px] max-w-[300px] px-4 py-3 rounded-xl shadow-sm text-left flex justify-between items-center transition-all duration-200 ${
                isCategoryOpen 
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary shadow-md' 
                  : 'bg-card border-2 border-input hover:border-primary/50 hover:shadow-md'
              } focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              <span className="font-medium">{selectedCategoryName}</span>
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
              >
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
                className={`min-h-[44px] px-4 py-3 cursor-pointer flex items-center justify-between transition-all duration-150 ${
                  !selectedCategory 
                    ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary' 
                    : 'hover:bg-accent/50 text-foreground'
                } ${
                  focusedCategoryIndex === 0 ? 'ring-2 ring-inset ring-primary' : ''
                }`}
              >
                <span>{isZh ? '所有類別' : 'All Categories'}</span>
                {!selectedCategory && (
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
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
                      className={`min-h-[44px] px-4 py-3 cursor-pointer flex items-center justify-between transition-all duration-150 ${
                        selectedCategory === category.id 
                          ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary' 
                          : 'hover:bg-accent/50 text-foreground'
                      } ${focusedCategoryIndex === optionIndex ? 'ring-2 ring-inset ring-primary' : ''}`}
                    >
                      <span>{isZh ? category.name_tc : category.name_en}</span>
                      {selectedCategory === category.id && (
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
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
            className={`w-full min-h-[44px] max-w-[300px] px-4 py-3 rounded-xl shadow-sm text-left flex justify-between items-center transition-all duration-200 ${
              isVenueOpen 
                ? 'bg-primary text-primary-foreground ring-2 ring-primary shadow-md' 
                : 'bg-card border-2 border-input hover:border-primary/50 hover:shadow-md'
            } focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            <span className="font-medium">{selectedVenueName}</span>
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${isVenueOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              aria-hidden="true"
            >
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
                className={`min-h-[44px] px-4 py-3 cursor-pointer flex items-center justify-between transition-all duration-150 ${
                  !selectedVenue 
                    ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary' 
                    : 'hover:bg-accent/50 text-foreground'
                } ${
                  focusedVenueIndex === 0 ? 'ring-2 ring-inset ring-primary' : ''
                }`}
              >
                <span>{isZh ? '所有場地' : 'All Venues'}</span>
                {!selectedVenue && (
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
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
                    className={`min-h-[44px] px-4 py-3 cursor-pointer flex items-center justify-between transition-all duration-150 ${
                      selectedVenue === venue.id 
                        ? 'bg-primary/10 text-primary font-semibold border-l-4 border-primary' 
                        : 'hover:bg-accent/50 text-foreground'
                    } ${focusedVenueIndex === optionIndex ? 'ring-2 ring-inset ring-primary' : ''}`}
                  >
                    <span>{isZh ? venue.name_tc : venue.name_en}</span>
                    {selectedVenue === venue.id && (
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
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
            className="min-h-[44px] px-6 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 hover:shadow-md focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all duration-200 whitespace-nowrap"
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
