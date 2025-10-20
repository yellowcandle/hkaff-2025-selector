import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Category } from '../types';
import './FilterControls.css';

interface FilterControlsProps {
  categories: Category[];
  selectedCategory: string | null;
  selectedDateRange: { start: string | null; end: string | null };
  onCategoryChange: (categoryId: string | null) => void;
  onDateRangeChange: (dateRange: { start: string | null; end: string | null }) => void;
  onClearFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  categories,
  selectedCategory,
  selectedDateRange,
  onCategoryChange,
  onDateRangeChange,
  onClearFilters,
}) => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'tc';
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const dateRangeRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = !!(selectedCategory || selectedDateRange.start || selectedDateRange.end);
  const anyDropdownOpen = isCategoryOpen || isDateRangeOpen;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target as Node)) {
        setIsDateRangeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    } else if (event.key === 'Escape') {
      setIsCategoryOpen(false);
      setIsDateRangeOpen(false);
    }
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const newRange = { ...selectedDateRange };
    if (value === '') {
      newRange[type] = null;
    } else {
      newRange[type] = value;
    }
    onDateRangeChange(newRange);
  };

  return (
    <div className="filter-controls">
      <div className="filter-controls__container">
        {/* Filter Controls */}
        <div className={`filter-controls__filters ${anyDropdownOpen ? 'filter-controls__filters--dropdown-open' : ''}`}>
          {/* Category Dropdown */}
          <div ref={categoryRef} className="filter-controls__dropdown">
            <button
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsDateRangeOpen(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, () => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsDateRangeOpen(false);
              })}
              className={`filter-controls__button ${
                selectedCategory
                  ? 'filter-controls__button--active'
                  : ''
              } ${isCategoryOpen ? 'filter-controls__button--dropdown-open' : ''}`}
              aria-expanded={isCategoryOpen}
              aria-haspopup="listbox"
              aria-label={t('filter.selectCategory')}
            >
              <span>
                {selectedCategory
                  ? categories.find(c => c.id === selectedCategory)?.[isZh ? 'name_tc' : 'name_en']
                  : t('filter.allGenres')
                }
              </span>
              <svg
                className={`filter-controls__button-icon ${isCategoryOpen ? 'filter-controls__button-icon--rotated' : ''}`}
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
                className="filter-controls__dropdown-menu"
                role="listbox"
                aria-label={t('filter.categoryOptions')}
              >
                <button
                  onClick={() => {
                    onCategoryChange(null);
                    setIsCategoryOpen(false);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, () => {
                    onCategoryChange(null);
                    setIsCategoryOpen(false);
                  })}
                  className="filter-controls__dropdown-option"
                  role="option"
                  aria-selected={!selectedCategory}
                >
                  {t('filter.allGenres')}
                </button>
                {categories.sort((a, b) => a.sort_order - b.sort_order).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onCategoryChange(cat.id);
                      setIsCategoryOpen(false);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, () => {
                      onCategoryChange(cat.id);
                      setIsCategoryOpen(false);
                    })}
                    className="filter-controls__dropdown-option"
                    role="option"
                    aria-selected={selectedCategory === cat.id}
                  >
                    {isZh ? cat.name_tc : cat.name_en}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Picker */}
          <div ref={dateRangeRef} className="filter-controls__dropdown">
            <button
              onClick={() => {
                setIsDateRangeOpen(!isDateRangeOpen);
                setIsCategoryOpen(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, () => {
                setIsDateRangeOpen(!isDateRangeOpen);
                setIsCategoryOpen(false);
              })}
              className={`filter-controls__button ${
                selectedDateRange.start || selectedDateRange.end
                  ? 'filter-controls__button--active'
                  : ''
              } ${isDateRangeOpen ? 'filter-controls__button--dropdown-open' : ''}`}
              aria-expanded={isDateRangeOpen}
              aria-haspopup="dialog"
              aria-label={t('filter.selectDateRange')}
            >
              <span>
                {selectedDateRange.start || selectedDateRange.end
                  ? `${selectedDateRange.start || '...'} - ${selectedDateRange.end || '...'}`
                  : t('filter.allDates')
                }
              </span>
              <svg
                className={`filter-controls__button-icon ${isDateRangeOpen ? 'filter-controls__button-icon--rotated' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDateRangeOpen && (
              <div
                className="filter-controls__date-range-picker"
                role="dialog"
                aria-label={t('filter.dateRangePicker')}
              >
                <div className="space-y-3">
                  <div className="filter-controls__date-field">
                    <label
                      htmlFor="start-date"
                      className="filter-controls__date-label"
                    >
                      {t('filter.startDate')}
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      value={selectedDateRange.start || ''}
                      onChange={(e) => handleDateRangeChange('start', e.target.value)}
                      className="filter-controls__date-input"
                      aria-describedby="start-date-help"
                    />
                    <div id="start-date-help" className="sr-only">
                      {t('filter.startDateHelp')}
                    </div>
                  </div>
                  <div className="filter-controls__date-field">
                    <label
                      htmlFor="end-date"
                      className="filter-controls__date-label"
                    >
                      {t('filter.endDate')}
                    </label>
                    <input
                      id="end-date"
                      type="date"
                      value={selectedDateRange.end || ''}
                      onChange={(e) => handleDateRangeChange('end', e.target.value)}
                      className="filter-controls__date-input"
                      aria-describedby="end-date-help"
                    />
                    <div id="end-date-help" className="sr-only">
                      {t('filter.endDateHelp')}
                    </div>
                  </div>
                  <div className="filter-controls__date-actions">
                    <button
                      onClick={() => setIsDateRangeOpen(false)}
                      className="filter-controls__date-action filter-controls__date-action--cancel"
                      aria-label={t('filter.cancel')}
                    >
                      {t('filter.cancel')}
                    </button>
                    <button
                      onClick={() => setIsDateRangeOpen(false)}
                      className="filter-controls__date-action filter-controls__date-action--apply"
                      aria-label={t('filter.apply')}
                    >
                      {t('filter.apply')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              onKeyDown={(e) => handleKeyDown(e, onClearFilters)}
              className="filter-controls__clear-button"
              aria-label={t('filter.clearAllFilters')}
            >
              {t('filter.clear')}
            </button>
          )}
        </div>

        {/* Backdrop for dropdowns */}
        {anyDropdownOpen && (
          <div
            className="filter-controls__backdrop"
            onClick={() => {
              setIsCategoryOpen(false);
              setIsDateRangeOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsCategoryOpen(false);
                setIsDateRangeOpen(false);
              }
            }}
            role="button"
            aria-label={t('filter.closeMenu')}
            tabIndex={-1}
          />
        )}
      </div>
    </div>
  );
};