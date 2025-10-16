import React, { useRef, useEffect } from 'react';
import { Category } from '../../types';

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategory: string | null;
  isOpen: boolean;
  focusedIndex: number;
  isZh: boolean;
  onToggle: () => void;
  onSelect: (categoryId: string | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategory,
  isOpen,
  focusedIndex,
  isZh,
  onToggle,
  onSelect,
  onKeyDown,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCategoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.[isZh ? 'name_tc' : 'name_en'] || ''
    : isZh ? '所有類別' : 'All Categories';

  // Auto-scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const options = dropdownRef.current.querySelectorAll('[role="option"]');
      const focusedOption = options[focusedIndex] as HTMLElement;
      if (focusedOption) {
        focusedOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedIndex, isOpen]);

  return (
    <div className="relative flex-1 w-full sm:w-auto">
      <button
        data-testid="category-filter"
        onClick={onToggle}
        onKeyDown={onKeyDown}
        aria-label={isZh ? '選擇類別' : 'Select category'}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`group relative w-full min-h-[52px] max-w-[320px] px-6 py-3.5 rounded-2xl text-left flex justify-between items-center transition-all duration-300 ${
          isOpen
            ? 'bg-gradient-to-br from-primary via-primary to-destructive text-white shadow-xl scale-105 ring-4 ring-primary/30'
            : selectedCategory
            ? 'bg-gradient-to-br from-accent/10 via-card to-card border-2 border-accent/30 shadow-lg hover:shadow-xl hover:scale-102 hover:border-accent/50'
            : 'bg-gradient-to-br from-card via-card to-muted/30 border-2 border-input/50 shadow-md hover:shadow-xl hover:scale-102 hover:border-primary/40'
        } focus:ring-4 focus:ring-primary/50 focus:ring-offset-2`}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? 'bg-white/20 shadow-inner'
                : selectedCategory
                ? 'bg-gradient-to-br from-accent/20 to-primary/20'
                : 'bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20'
            }`}
          >
            <svg
              className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-primary'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <span className={`font-bold text-base ${isOpen ? 'text-white' : selectedCategory ? 'text-accent' : 'text-foreground'}`}>
            {selectedCategoryName}
          </span>
        </div>

        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-white/20 rotate-180' : 'bg-muted/50 group-hover:bg-primary/10'
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              isOpen ? 'text-white' : 'text-muted-foreground group-hover:text-primary'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label={isZh ? '類別選項' : 'Category options'}
          className="absolute z-[60] mt-2 w-full min-w-[320px] max-w-[400px] bg-gradient-to-b from-white to-muted/30 backdrop-blur-xl border-2 border-primary/20 rounded-2xl shadow-2xl max-h-72 overflow-auto ring-1 ring-primary/10"
        >
          <div
            role="option"
            aria-selected={!selectedCategory}
            data-testid="category-option"
            onClick={() => {
              onSelect(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(null);
              }
            }}
            tabIndex={0}
            className={`group min-h-[48px] px-5 py-3.5 mx-1.5 my-1 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 ${
              !selectedCategory
                ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 text-primary font-bold border-l-4 border-primary shadow-sm'
                : 'hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent text-foreground hover:text-primary hover:translate-x-1'
            } ${focusedIndex === 0 ? 'ring-2 ring-inset ring-primary shadow-md' : ''}`}
          >
            <span className="font-semibold">{isZh ? '所有類別' : 'All Categories'}</span>
            {!selectedCategory && (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          {categories
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((category, index) => {
              const optionIndex = index + 1;
              return (
                <div
                  key={category.id}
                  role="option"
                  aria-selected={selectedCategory === category.id}
                  data-testid="category-option"
                  onClick={() => {
                    onSelect(category.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(category.id);
                    }
                  }}
                  tabIndex={0}
                  className={`group min-h-[48px] px-5 py-3.5 mx-1.5 my-1 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 text-primary font-bold border-l-4 border-primary shadow-sm'
                      : 'hover:bg-gradient-to-r hover:from-accent/10 hover:to-transparent text-foreground hover:text-accent hover:translate-x-1 hover:shadow-sm'
                  } ${focusedIndex === optionIndex ? 'ring-2 ring-inset ring-primary shadow-md' : ''}`}
                >
                  <span className="font-semibold">{isZh ? category.name_tc : category.name_en}</span>
                  {selectedCategory === category.id && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
