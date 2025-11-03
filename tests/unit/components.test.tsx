import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { FilmCard } from '../../frontend/src/components/figma/FilmCard';

describe('FilmCard Component', () => {
  const mockFilm = {
    id: 'film-376',
    title: 'Another World',
    director: 'Wong Kar-wai',
    year: 2025,
    runtime: 105,
    genre: ['Drama', 'Romance'],
    rating: 'PG-13',
    image: 'https://example.com/poster.jpg',
    venue: 'Hong Kong Cultural Centre',
    screenings: [
      {
        id: 'screening-1',
        date: '2025-03-15',
        time: '19:30',
        venue: 'Hong Kong Cultural Centre'
      },
      {
        id: 'screening-2',
        date: '2025-03-16',
        time: '14:00',
        venue: 'Hong Kong Arts Centre'
      }
    ]
  };

  it('should render film title and director', () => {
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    render(
      <FilmCard
        film={mockFilm}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.getByText('Another World')).toBeInTheDocument();
    expect(screen.getByText(/Wong Kar-wai/)).toBeInTheDocument();
  });

  it('should render film genre badges', () => {
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    render(
      <FilmCard
        film={mockFilm}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.getByText('Drama')).toBeInTheDocument();
    expect(screen.getByText('Romance')).toBeInTheDocument();
  });

  it('should display rating badge when provided', () => {
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    render(
      <FilmCard
        film={mockFilm}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.getByText('PG-13')).toBeInTheDocument();
  });

  it('should show runtime and year information', () => {
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    render(
      <FilmCard
        film={mockFilm}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.getByText('105 min')).toBeInTheDocument();
  });

  it('should show screening count', () => {
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    render(
      <FilmCard
        film={mockFilm}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.getByText('2 screenings')).toBeInTheDocument();
  });

  it('should call onToggleSelection when add/remove button clicked', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    render(
      <FilmCard
        film={mockFilm}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    const addButton = screen.getByRole('button', { name: /add to schedule/i });
    await user.click(addButton);

    expect(mockToggle).toHaveBeenCalledOnce();
  });

  it('should show remove button when film is selected', () => {
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    render(
      <FilmCard
        film={mockFilm}
        isSelected={true}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.getByRole('button', { name: /remove from schedule/i })).toBeInTheDocument();
  });

  it('should call onViewDetails when details button clicked', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    render(
      <FilmCard
        film={mockFilm}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    const detailsButton = screen.getByRole('button', { name: /details/i });
    await user.click(detailsButton);

    expect(mockViewDetails).toHaveBeenCalledOnce();
  });

  it('should render image with correct alt text', () => {
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    render(
      <FilmCard
        film={mockFilm}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    const image = screen.getByAltText('Another World');
    expect(image).toBeInTheDocument();
  });

  it('should handle film without rating gracefully', () => {
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();
    const filmWithoutRating = { ...mockFilm, rating: undefined };

    render(
      <FilmCard
        film={filmWithoutRating}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.queryByText('PG-13')).not.toBeInTheDocument();
  });

  it('should handle film with single genre', () => {
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();
    const filmWithSingleGenre = { ...mockFilm, genre: ['Drama'] };

    render(
      <FilmCard
        film={filmWithSingleGenre}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.getByText('Drama')).toBeInTheDocument();
    expect(screen.queryByText('Romance')).not.toBeInTheDocument();
  });
});

describe('FilmCard Selection States', () => {
  const mockFilm = {
    id: 'film-376',
    title: 'Another World',
    director: 'Wong Kar-wai',
    year: 2025,
    runtime: 105,
    genre: ['Drama'],
    image: 'https://example.com/poster.jpg',
    venue: 'Hong Kong Cultural Centre',
    screenings: [
      { id: 'screening-1', date: '2025-03-15', time: '19:30', venue: 'Venue A' }
    ]
  };

  it('should indicate selected state visually', () => {
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    const { rerender } = render(
      <FilmCard
        film={mockFilm}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.getByRole('button', { name: /add to schedule/i })).toBeInTheDocument();

    rerender(
      <FilmCard
        film={mockFilm}
        isSelected={true}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    expect(screen.getByRole('button', { name: /remove from schedule/i })).toBeInTheDocument();
  });

  it('should toggle selection state on button click', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockViewDetails = vi.fn();

    const { rerender } = render(
      <FilmCard
        film={mockFilm}
        isSelected={false}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    const button = screen.getByRole('button', { name: /add to schedule/i });
    await user.click(button);

    expect(mockToggle).toHaveBeenCalledOnce();

    rerender(
      <FilmCard
        film={mockFilm}
        isSelected={true}
        onToggleSelection={mockToggle}
        onViewDetails={mockViewDetails}
      />
    );

    const removeButton = screen.getByRole('button', { name: /remove from schedule/i });
    await user.click(removeButton);

    expect(mockToggle).toHaveBeenCalledTimes(2);
  });
});
