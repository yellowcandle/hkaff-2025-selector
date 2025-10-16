import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Category, Venue } from '../../types';
import { SearchBar } from './SearchBar';
import { CategoryDropdown } from './CategoryDropdown';
import { VenueDropdown } from './VenueDropdown';
import { ClearFiltersButton } from './ClearFiltersButton';

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

  const hasActiveFilters = !!(selectedCategory || selectedVenue || searchQuery);

  // Handle category button keyboard navigation
  const handleCategoryButtonKeyDown = (e: React.KeyboardEvent) => {
    const totalOptions = categories.length + 1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isCategoryOpen) {
        setIsCategoryOpen(true);
        setIsVenueOpen(false);
        const selectedIndex = selectedCategory
          ? categories.findIndex(c => c.id === selectedCategory) + 1
          : 0;
        setFocusedCategoryIndex(selectedIndex);
      } else {
        setFocusedCategoryIndex((prev) => (prev + 1) % totalOptions);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isCategoryOpen) {
        setIsCategoryOpen(true);
        setIsVenueOpen(false);
        const selectedIndex = selectedCategory
          ? categories.findIndex(c => c.id === selectedCategory) + 1
          : 0;
        setFocusedCategoryIndex(selectedIndex);
      } else {
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
    const totalOptions = venues.length + 1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isVenueOpen) {
        setIsVenueOpen(true);
        setIsCategoryOpen(false);
        const selectedIndex = selectedVenue
          ? venues.findIndex(v => v.id === selectedVenue) + 1
          : 0;
        setFocusedVenueIndex(selectedIndex);
      } else {
        setFocusedVenueIndex((prev) => (prev + 1) % totalOptions);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isVenueOpen) {
        setIsVenueOpen(true);
        setIsCategoryOpen(false);
        const selectedIndex = selectedVenue
          ? venues.findIndex(v => v.id === selectedVenue) + 1
          : 0;
        setFocusedVenueIndex(selectedIndex);
      } else {
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
        <SearchBar searchQuery={searchQuery} isZh={isZh} onChange={onSearchChange} />

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <CategoryDropdown
            categories={categories}
            selectedCategory={selectedCategory}
            isOpen={isCategoryOpen}
            focusedIndex={focusedCategoryIndex}
            isZh={isZh}
            onToggle={() => {
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
            onSelect={(categoryId) => {
              onCategoryChange(categoryId);
              setIsCategoryOpen(false);
              setFocusedCategoryIndex(-1);
            }}
            onKeyDown={handleCategoryButtonKeyDown}
          />

          <VenueDropdown
            venues={venues}
            selectedVenue={selectedVenue}
            isOpen={isVenueOpen}
            focusedIndex={focusedVenueIndex}
            isZh={isZh}
            onToggle={() => {
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
            onSelect={(venueId) => {
              onVenueChange(venueId);
              setIsVenueOpen(false);
              setFocusedVenueIndex(-1);
            }}
            onKeyDown={handleVenueButtonKeyDown}
          />
        </div>

        <ClearFiltersButton
          isZh={isZh}
          onClick={onClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

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
  );
};
