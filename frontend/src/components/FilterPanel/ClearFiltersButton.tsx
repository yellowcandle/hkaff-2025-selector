import React from 'react';

interface ClearFiltersButtonProps {
  isZh: boolean;
  onClick: () => void;
  hasActiveFilters: boolean;
}

export const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({
  isZh,
  onClick,
  hasActiveFilters,
}) => {
  if (!hasActiveFilters) return null;

  return (
    <button
      data-testid="clear-filters"
      onClick={onClick}
      aria-label={isZh ? '清除所有篩選' : 'Clear all filters'}
      className="group relative min-h-[52px] px-7 py-3.5 rounded-2xl bg-gradient-to-br from-destructive via-destructive to-primary text-white font-bold shadow-lg hover:shadow-2xl hover:scale-105 focus:ring-4 focus:ring-destructive/50 focus:ring-offset-2 transition-all duration-300 whitespace-nowrap overflow-hidden"
    >
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
  );
};
