import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PropertyCard from './PropertyCard';
import type { Property } from '../../model/types';

const mockProperty: Property = {
  id: 1,
  image: 'https://example.com/property1.jpg',
  title: 'Beautiful Apartment',
  type: 'Apartment',
  location: 'New York, NY',
  details: '2 beds, 1 bath',
  host: 'John Doe',
  price: 150,
  rating: 4.5
};

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard {...mockProperty} />);
    
    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('2 beds, 1 bath')).toBeInTheDocument();
    expect(screen.getByText('Hosted by John Doe')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
    expect(screen.getByText('per night')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('★')).toBeInTheDocument();
  });

  it('renders property image with correct src', () => {
    render(<PropertyCard {...mockProperty} />);
    
    const image = screen.getByAltText('');
    expect(image).toHaveAttribute('src', 'https://example.com/property1.jpg');
  });

  it('calls handleCardClick when card is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    render(<PropertyCard {...mockProperty} />);
    
    const card = screen.getByText('Beautiful Apartment').closest('.property-card');
    fireEvent.click(card!);
    
    expect(consoleSpy).toHaveBeenCalledWith(1);
    consoleSpy.mockRestore();
  });

  it('applies correct CSS classes', () => {
    render(<PropertyCard {...mockProperty} />);
    
    const card = screen.getByText('Beautiful Apartment').closest('.property-card');
    expect(card).toHaveClass('property-card');
    
    const image = screen.getByAltText('');
    expect(image).toHaveClass('property-image');
    
    const title = screen.getByText('Beautiful Apartment');
    expect(title).toHaveClass('property-title');
  });
});