import React, { useRef, useEffect } from 'react';
import { Venue } from '../../types';

interface VenueDropdownProps {
  venues: Venue[];
  selectedVenue: string | null;
  isOpen: boolean;
  focusedIndex: number;
  isZh: boolean;
  onToggle: () => void;
  onSelect: (venueId: string | null) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const VenueDropdown: React.FC<VenueDropdownProps> = ({
  venues,
  selectedVenue,
  isOpen,
  focusedIndex,
  isZh,
  onToggle,
  onSelect,
  onKeyDown,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedVenueName = selectedVenue
    ? venues.find(v => v.id === selectedVenue)?.[isZh ? 'name_tc' : 'name_en'] || ''
    : isZh ? '所有場地' : 'All Venues';

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
        data-testid="venue-filter"
        onClick={onToggle}
        onKeyDown={onKeyDown}
        aria-label={isZh ? '選擇場地' : 'Select venue'}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`group relative w-full min-h-[52px] max-w-[320px] px-6 py-3.5 rounded-2xl text-left flex justify-between items-center transition-all duration-300 ${
          isOpen
            ? 'bg-gradient-to-br from-secondary via-secondary to-accent text-white shadow-xl scale-105 ring-4 ring-secondary/30'
            : selectedVenue
            ? 'bg-gradient-to-br from-secondary/10 via-card to-card border-2 border-secondary/30 shadow-lg hover:shadow-xl hover:scale-102 hover:border-secondary/50'
            : 'bg-gradient-to-br from-card via-card to-muted/30 border-2 border-input/50 shadow-md hover:shadow-xl hover:scale-102 hover:border-secondary/40'
        } focus:ring-4 focus:ring-secondary/50 focus:ring-offset-2`}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-secondary/0 via-secondary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? 'bg-white/20 shadow-inner'
                : selectedVenue
                ? 'bg-gradient-to-br from-secondary/20 to-accent/20'
                : 'bg-gradient-to-br from-secondary/10 to-accent/10 group-hover:from-secondary/20 group-hover:to-accent/20'
            }`}
          >
            <svg
              className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-secondary'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <span
            className={`font-bold text-base ${isOpen ? 'text-white' : selectedVenue ? 'text-secondary' : 'text-foreground'}`}
          >
            {selectedVenueName}
          </span>
        </div>

        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-white/20 rotate-180' : 'bg-muted/50 group-hover:bg-secondary/10'
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              isOpen ? 'text-white' : 'text-muted-foreground group-hover:text-secondary'
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
          aria-label={isZh ? '場地選項' : 'Venue options'}
          className="absolute z-[60] mt-2 w-full min-w-[320px] max-w-[400px] bg-gradient-to-b from-white to-muted/30 backdrop-blur-xl border-2 border-secondary/20 rounded-2xl shadow-2xl max-h-72 overflow-auto ring-1 ring-secondary/10"
        >
          <div
            role="option"
            aria-selected={!selectedVenue}
            data-testid="venue-option"
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
              !selectedVenue
                ? 'bg-gradient-to-r from-secondary/15 via-secondary/10 to-secondary/5 text-secondary font-bold border-l-4 border-secondary shadow-sm'
                : 'hover:bg-gradient-to-r hover:from-secondary/5 hover:to-transparent text-foreground hover:text-secondary hover:translate-x-1 hover:shadow-sm'
            } ${focusedIndex === 0 ? 'ring-2 ring-inset ring-secondary shadow-md' : ''}`}
          >
            <span className="font-semibold">{isZh ? '所有場地' : 'All Venues'}</span>
            {!selectedVenue && (
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          {venues.map((venue, index) => {
            const optionIndex = index + 1;
            return (
              <div
                key={venue.id}
                role="option"
                aria-selected={selectedVenue === venue.id}
                data-testid="venue-option"
                onClick={() => {
                  onSelect(venue.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(venue.id);
                  }
                }}
                tabIndex={0}
                className={`group min-h-[48px] px-5 py-3.5 mx-1.5 my-1 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 ${
                  selectedVenue === venue.id
                    ? 'bg-gradient-to-r from-secondary/15 via-secondary/10 to-secondary/5 text-secondary font-bold border-l-4 border-secondary shadow-sm'
                    : 'hover:bg-gradient-to-r hover:from-accent/10 hover:to-transparent text-foreground hover:text-accent hover:translate-x-1 hover:shadow-sm'
                } ${focusedIndex === optionIndex ? 'ring-2 ring-inset ring-secondary shadow-md' : ''}`}
              >
                <span className="font-semibold">{isZh ? venue.name_tc : venue.name_en}</span>
                {selectedVenue === venue.id && (
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
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
