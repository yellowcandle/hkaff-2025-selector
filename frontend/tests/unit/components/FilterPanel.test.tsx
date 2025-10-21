/**
 * Unit Tests for FilterPanel Component (T021)
 *
 * Tests FilterPanel rendering, interactions, dropdowns, and accessibility.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FilterPanel } from '../../../src/components/FilterPanel/FilterPanel';
import type { Category, Venue } from '../../../src/types';

// Mock react-i18next
const mockUseTranslation = vi.fn();
vi.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation()
}));

describe('FilterPanel Component', () => {
  const mockCategories: Category[] = [
    { id: 'cat1', name_tc: '劇情片', name_en: 'Drama', sort_order: 1, description_tc: '', description_en: '' },
    { id: 'cat2', name_tc: '喜劇', name_en: 'Comedy', sort_order: 2, description_tc: '', description_en: '' },
    { id: 'cat3', name_tc: '驚悚片', name_en: 'Thriller', sort_order: 3, description_tc: '', description_en: '' }
  ];

  const mockVenues: Venue[] = [
    { id: 'venue1', name_tc: '會場A', name_en: 'Venue A' },
    { id: 'venue2', name_tc: '會場B', name_en: 'Venue B' }
  ];

  const mockDates = ['2025-03-15', '2025-03-16', '2025-03-17'];

  const mockProps = {
    categories: mockCategories,
    venues: mockVenues,
    dates: mockDates,
    selectedCategory: null,
    selectedVenue: null,
    selectedDate: null,
    searchQuery: '',
    onCategoryChange: vi.fn(),
    onVenueChange: vi.fn(),
    onDateChange: vi.fn(),
    onSearchChange: vi.fn(),
    onClearFilters: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      i18n: { language: 'en' }
    });
  });

  describe('Rendering', () => {
    it('renders search input', () => {
      render(<FilterPanel {...mockProps} />);

      const searchInput = screen.getByLabelText('Search films');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'Search films, directors...');
    });

    it('renders category dropdown', () => {
      render(<FilterPanel {...mockProps} />);

      expect(screen.getByLabelText('Select category')).toBeInTheDocument();
      expect(screen.getByText('All Genres')).toBeInTheDocument();
    });

    it('renders venue dropdown', () => {
      render(<FilterPanel {...mockProps} />);

      expect(screen.getByLabelText('Select venue')).toBeInTheDocument();
      expect(screen.getByText('All Venues')).toBeInTheDocument();
    });

    it('renders date dropdown when dates are provided', () => {
      render(<FilterPanel {...mockProps} />);

      expect(screen.getByLabelText('Select date')).toBeInTheDocument();
      expect(screen.getByText('All Dates')).toBeInTheDocument();
    });

    it('does not render date dropdown when no dates provided', () => {
      render(<FilterPanel {...mockProps} dates={[]} />);

      expect(screen.queryByLabelText('Select date')).not.toBeInTheDocument();
    });

    it('renders search input in Chinese', () => {
      mockUseTranslation.mockReturnValue({
        i18n: { language: 'tc' }
      });

      render(<FilterPanel {...mockProps} />);

      const searchInput = screen.getByLabelText('搜尋影片');
      expect(searchInput).toHaveAttribute('placeholder', '搜尋電影、導演...');
    });
  });

  describe('Search Functionality', () => {
    it('calls onSearchChange when search input changes', () => {
      render(<FilterPanel {...mockProps} />);

      const searchInput = screen.getByLabelText('Search films');
      fireEvent.change(searchInput, { target: { value: 'test search' } });

      expect(mockProps.onSearchChange).toHaveBeenCalledWith('test search');
    });

    it('displays current search query', () => {
      render(<FilterPanel {...mockProps} searchQuery="current search" />);

      const searchInput = screen.getByDisplayValue('current search');
      expect(searchInput).toBeInTheDocument();
    });

    it('applies focus styles when search has value', () => {
      render(<FilterPanel {...mockProps} searchQuery="test" />);

      const searchInput = screen.getByLabelText('Search films');
      expect(searchInput).toHaveClass('border-purple-400');
    });
  });

  describe('Category Dropdown', () => {
    it('opens category dropdown when clicked', async () => {
      render(<FilterPanel {...mockProps} />);

      const categoryButton = screen.getByLabelText('Select category');
      fireEvent.click(categoryButton);

      await waitFor(() => {
        expect(screen.getByText('Drama')).toBeInTheDocument();
        expect(screen.getByText('Comedy')).toBeInTheDocument();
        expect(screen.getByText('Thriller')).toBeInTheDocument();
      });
    });

    it('calls onCategoryChange when category is selected', async () => {
      render(<FilterPanel {...mockProps} />);

      const categoryButton = screen.getByLabelText('Select category');
      fireEvent.click(categoryButton);

      await waitFor(() => {
        const dramaOption = screen.getByText('Drama');
        fireEvent.click(dramaOption);
      });

      expect(mockProps.onCategoryChange).toHaveBeenCalledWith('cat1');
    });

    it('closes dropdown when category is selected', async () => {
      render(<FilterPanel {...mockProps} />);

      const categoryButton = screen.getByLabelText('Select category');
      fireEvent.click(categoryButton);

      await waitFor(() => {
        const dramaOption = screen.getByText('Drama');
        fireEvent.click(dramaOption);
      });

      await waitFor(() => {
        expect(screen.queryByText('Drama')).not.toBeInTheDocument();
      });
    });

    it('displays selected category name', () => {
      render(<FilterPanel {...mockProps} selectedCategory="cat2" />);

      expect(screen.getByText('Comedy')).toBeInTheDocument();
    });

    it('sorts categories by sort_order', async () => {
      render(<FilterPanel {...mockProps} />);

      const categoryButton = screen.getByLabelText('Select category');
      fireEvent.click(categoryButton);

      await waitFor(() => {
        const options = screen.getAllByRole('button').filter(btn =>
          ['Drama', 'Comedy', 'Thriller'].includes(btn.textContent || '')
        );
        expect(options[0]).toHaveTextContent('Drama'); // sort_order: 1
        expect(options[1]).toHaveTextContent('Comedy'); // sort_order: 2
        expect(options[2]).toHaveTextContent('Thriller'); // sort_order: 3
      });
    });
  });

  describe('Venue Dropdown', () => {
    it('opens venue dropdown when clicked', async () => {
      render(<FilterPanel {...mockProps} />);

      const venueButton = screen.getByLabelText('Select venue');
      fireEvent.click(venueButton);

      await waitFor(() => {
        expect(screen.getByText('Venue A')).toBeInTheDocument();
        expect(screen.getByText('Venue B')).toBeInTheDocument();
      });
    });

    it('calls onVenueChange when venue is selected', async () => {
      render(<FilterPanel {...mockProps} />);

      const venueButton = screen.getByLabelText('Select venue');
      fireEvent.click(venueButton);

      await waitFor(() => {
        const venueAOption = screen.getByText('Venue A');
        fireEvent.click(venueAOption);
      });

      expect(mockProps.onVenueChange).toHaveBeenCalledWith('venue1');
    });

    it('displays selected venue name', () => {
      render(<FilterPanel {...mockProps} selectedVenue="venue2" />);

      expect(screen.getByText('Venue B')).toBeInTheDocument();
    });
  });

  describe('Date Dropdown', () => {
    it('opens date dropdown when clicked', async () => {
      render(<FilterPanel {...mockProps} />);

      const dateButton = screen.getByLabelText('Select date');
      fireEvent.click(dateButton);

      await waitFor(() => {
        expect(screen.getByText('2025-03-15')).toBeInTheDocument();
        expect(screen.getByText('2025-03-16')).toBeInTheDocument();
        expect(screen.getByText('2025-03-17')).toBeInTheDocument();
      });
    });

    it('calls onDateChange when date is selected', async () => {
      render(<FilterPanel {...mockProps} />);

      const dateButton = screen.getByLabelText('Select date');
      fireEvent.click(dateButton);

      await waitFor(() => {
        const dateOption = screen.getByText('2025-03-15');
        fireEvent.click(dateOption);
      });

      expect(mockProps.onDateChange).toHaveBeenCalledWith('2025-03-15');
    });

    it('displays selected date', () => {
      render(<FilterPanel {...mockProps} selectedDate="2025-03-16" />);

      expect(screen.getByText('2025-03-16')).toBeInTheDocument();
    });
  });

  describe('Clear Filters', () => {
    it('shows clear button when filters are active', () => {
      render(
        <FilterPanel
          {...mockProps}
          selectedCategory="cat1"
          searchQuery="test"
        />
      );

      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('does not show clear button when no filters are active', () => {
      render(<FilterPanel {...mockProps} />);

      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    it('calls onClearFilters when clear button is clicked', () => {
      render(
        <FilterPanel
          {...mockProps}
          selectedCategory="cat1"
          onClearFilters={mockProps.onClearFilters}
        />
      );

      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      expect(mockProps.onClearFilters).toHaveBeenCalled();
    });
  });

  describe('Dropdown State Management', () => {
    it('closes other dropdowns when one is opened', async () => {
      render(<FilterPanel {...mockProps} />);

      // Open category dropdown
      const categoryButton = screen.getByLabelText('Select category');
      fireEvent.click(categoryButton);

      await waitFor(() => {
        expect(screen.getByText('Drama')).toBeInTheDocument();
      });

      // Open venue dropdown
      const venueButton = screen.getByLabelText('Select venue');
      fireEvent.click(venueButton);

      await waitFor(() => {
        expect(screen.queryByText('Drama')).not.toBeInTheDocument();
        expect(screen.getByText('Venue A')).toBeInTheDocument();
      });
    });

    it('closes dropdowns when pressing escape', async () => {
      render(<FilterPanel {...mockProps} />);

      const categoryButton = screen.getByLabelText('Select category');
      fireEvent.click(categoryButton);

      await waitFor(() => {
        expect(screen.getByText('Drama')).toBeInTheDocument();
      });

      // Press escape key
      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByText('Drama')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for all interactive elements', () => {
      render(<FilterPanel {...mockProps} />);

      expect(screen.getByLabelText('Search films')).toBeInTheDocument();
      expect(screen.getByLabelText('Select category')).toBeInTheDocument();
      expect(screen.getByLabelText('Select venue')).toBeInTheDocument();
      expect(screen.getByLabelText('Select date')).toBeInTheDocument();
    });

    it('has proper ARIA labels in Chinese', () => {
      mockUseTranslation.mockReturnValue({
        i18n: { language: 'tc' }
      });

      render(<FilterPanel {...mockProps} />);

      expect(screen.getByLabelText('搜尋影片')).toBeInTheDocument();
      expect(screen.getByLabelText('選擇類別')).toBeInTheDocument();
      expect(screen.getByLabelText('選擇場地')).toBeInTheDocument();
      expect(screen.getByLabelText('選擇日期')).toBeInTheDocument();
    });

    it('shows backdrop when dropdowns are open', () => {
      render(<FilterPanel {...mockProps} />);

      const categoryButton = screen.getByLabelText('Select category');
      fireEvent.click(categoryButton);

      // Backdrop should exist when dropdown is open
      const backdrop = document.querySelector('.fixed.inset-0.z-10');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies active styles to selected filters', () => {
      render(
        <FilterPanel
          {...mockProps}
          selectedCategory="cat1"
          selectedVenue="venue1"
          selectedDate="2025-03-15"
        />
      );

      const categoryButton = screen.getByLabelText('Select category');
      const venueButton = screen.getByLabelText('Select venue');
      const dateButton = screen.getByLabelText('Select date');

      expect(categoryButton).toHaveClass('bg-purple-600', 'text-white');
      expect(venueButton).toHaveClass('bg-purple-600', 'text-white');
      expect(dateButton).toHaveClass('bg-purple-600', 'text-white');
    });

    it('applies inactive styles to unselected filters', () => {
      render(<FilterPanel {...mockProps} />);

      const categoryButton = screen.getByLabelText('Select category');
      expect(categoryButton).toHaveClass('bg-gray-100', 'text-gray-700');
    });
  });
});