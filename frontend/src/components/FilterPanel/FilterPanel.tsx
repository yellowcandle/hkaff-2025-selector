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
              className={`group relative w-full min-h-[52px] max-w-[320px] px-6 py-3.5 rounded-2xl text-left flex justify-between items-center transition-all duration-300 ${
                isCategoryOpen 
                  ? 'bg-gradient-to-br from-primary via-primary to-destructive text-white shadow-xl scale-105 ring-4 ring-primary/30' 
                  : selectedCategory
                  ? 'bg-gradient-to-br from-accent/10 via-card to-card border-2 border-accent/30 shadow-lg hover:shadow-xl hover:scale-102 hover:border-accent/50'
                  : 'bg-gradient-to-br from-card via-card to-muted/30 border-2 border-input/50 shadow-md hover:shadow-xl hover:scale-102 hover:border-primary/40'
              } focus:ring-4 focus:ring-primary/50 focus:ring-offset-2`}
            >
              {/* Decorative gradient accent */}
              {!isCategoryOpen && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              )}
              
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isCategoryOpen 
                    ? 'bg-white/20 shadow-inner' 
                    : selectedCategory
                    ? 'bg-gradient-to-br from-accent/20 to-primary/20'
                    : 'bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20'
                }`}>
                  <svg className={`w-5 h-5 ${isCategoryOpen ? 'text-white' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className={`font-bold text-base ${isCategoryOpen ? 'text-white' : selectedCategory ? 'text-accent' : 'text-foreground'}`}>
                  {selectedCategoryName}
                </span>
              </div>
              
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isCategoryOpen 
                  ? 'bg-white/20 rotate-180' 
                  : 'bg-muted/50 group-hover:bg-primary/10'
              }`}>
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${isCategoryOpen ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

          {isCategoryOpen && (
            <div
              ref={categoryDropdownRef}
              role="listbox"
              aria-label={isZh ? '類別選項' : 'Category options'}
              className="absolute z-[60] mt-2 w-full min-w-[320px] max-w-[400px] bg-gradient-to-b from-white to-muted/30 backdrop-blur-xl border-2 border-primary/20 rounded-2xl shadow-2xl max-h-72 overflow-auto ring-1 ring-primary/10"
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
                className={`group min-h-[48px] px-5 py-3.5 mx-1.5 my-1 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 ${
                  !selectedCategory 
                    ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 text-primary font-bold border-l-4 border-primary shadow-sm' 
                    : 'hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent text-foreground hover:text-primary hover:translate-x-1'
                } ${
                  focusedCategoryIndex === 0 ? 'ring-2 ring-inset ring-primary shadow-md' : ''
                }`}
              >
                <span className="font-semibold">{isZh ? '所有類別' : 'All Categories'}</span>
                {!selectedCategory && (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
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
                      className={`group min-h-[48px] px-5 py-3.5 mx-1.5 my-1 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 ${
                        selectedCategory === category.id 
                          ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 text-primary font-bold border-l-4 border-primary shadow-sm' 
                          : 'hover:bg-gradient-to-r hover:from-accent/10 hover:to-transparent text-foreground hover:text-accent hover:translate-x-1 hover:shadow-sm'
                      } ${focusedCategoryIndex === optionIndex ? 'ring-2 ring-inset ring-primary shadow-md' : ''}`}
                    >
                      <span className="font-semibold">{isZh ? category.name_tc : category.name_en}</span>
                      {selectedCategory === category.id && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
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
            className={`group relative w-full min-h-[52px] max-w-[320px] px-6 py-3.5 rounded-2xl text-left flex justify-between items-center transition-all duration-300 ${
              isVenueOpen 
                ? 'bg-gradient-to-br from-secondary via-secondary to-accent text-white shadow-xl scale-105 ring-4 ring-secondary/30' 
                : selectedVenue
                ? 'bg-gradient-to-br from-secondary/10 via-card to-card border-2 border-secondary/30 shadow-lg hover:shadow-xl hover:scale-102 hover:border-secondary/50'
                : 'bg-gradient-to-br from-card via-card to-muted/30 border-2 border-input/50 shadow-md hover:shadow-xl hover:scale-102 hover:border-secondary/40'
            } focus:ring-4 focus:ring-secondary/50 focus:ring-offset-2`}
          >
            {/* Decorative gradient accent */}
            {!isVenueOpen && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-secondary/0 via-secondary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
            
            <div className="flex items-center gap-3 relative z-10">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isVenueOpen 
                  ? 'bg-white/20 shadow-inner' 
                  : selectedVenue
                  ? 'bg-gradient-to-br from-secondary/20 to-accent/20'
                  : 'bg-gradient-to-br from-secondary/10 to-accent/10 group-hover:from-secondary/20 group-hover:to-accent/20'
              }`}>
                <svg className={`w-5 h-5 ${isVenueOpen ? 'text-white' : 'text-secondary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className={`font-bold text-base ${isVenueOpen ? 'text-white' : selectedVenue ? 'text-secondary' : 'text-foreground'}`}>
                {selectedVenueName}
              </span>
            </div>
            
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isVenueOpen 
                ? 'bg-white/20 rotate-180' 
                : 'bg-muted/50 group-hover:bg-secondary/10'
            }`}>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isVenueOpen ? 'text-white' : 'text-muted-foreground group-hover:text-secondary'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {isVenueOpen && (
            <div
              ref={venueDropdownRef}
              role="listbox"
              aria-label={isZh ? '場地選項' : 'Venue options'}
              className="absolute z-[60] mt-2 w-full min-w-[320px] max-w-[400px] bg-gradient-to-b from-white to-muted/30 backdrop-blur-xl border-2 border-secondary/20 rounded-2xl shadow-2xl max-h-72 overflow-auto ring-1 ring-secondary/10"
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
                className={`group min-h-[48px] px-5 py-3.5 mx-1.5 my-1 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 ${
                  !selectedVenue 
                    ? 'bg-gradient-to-r from-secondary/15 via-secondary/10 to-secondary/5 text-secondary font-bold border-l-4 border-secondary shadow-sm' 
                    : 'hover:bg-gradient-to-r hover:from-secondary/5 hover:to-transparent text-foreground hover:text-secondary hover:translate-x-1 hover:shadow-sm'
                } ${
                  focusedVenueIndex === 0 ? 'ring-2 ring-inset ring-secondary shadow-md' : ''
                }`}
              >
                <span className="font-semibold">{isZh ? '所有場地' : 'All Venues'}</span>
                {!selectedVenue && (
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
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
                    className={`group min-h-[48px] px-5 py-3.5 mx-1.5 my-1 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 ${
                      selectedVenue === venue.id 
                        ? 'bg-gradient-to-r from-secondary/15 via-secondary/10 to-secondary/5 text-secondary font-bold border-l-4 border-secondary shadow-sm' 
                        : 'hover:bg-gradient-to-r hover:from-accent/10 hover:to-transparent text-foreground hover:text-accent hover:translate-x-1 hover:shadow-sm'
                    } ${focusedVenueIndex === optionIndex ? 'ring-2 ring-inset ring-secondary shadow-md' : ''}`}
                  >
                    <span className="font-semibold">{isZh ? venue.name_tc : venue.name_en}</span>
                    {selectedVenue === venue.id && (
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
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
            className="group relative min-h-[52px] px-7 py-3.5 rounded-2xl bg-gradient-to-br from-destructive via-destructive to-primary text-white font-bold shadow-lg hover:shadow-2xl hover:scale-105 focus:ring-4 focus:ring-destructive/50 focus:ring-offset-2 transition-all duration-300 whitespace-nowrap overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="relative z-10 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span>{isZh ? '清除篩選' : 'Clear Filters'}</span>
            </div>
          </button>
        )}
      </div>

      {/* Close dropdowns when clicking outside */}
      {(isCategoryOpen || isVenueOpen) && (
        <div
          className="fixed inset-0 z-[55]"
          onClick={() => {
            setIsCategoryOpen(false);
            setIsVenueOpen(false);
            setFocusedCategoryIndex(-1);
            setFocusedVenueIndex(-1);
          }}
        />
      )}
      </div>
    </div>
  );
};
