import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PropertyApp from './PropertyApp';
import type { Property } from './model/types';

const mockProperties: Property[] = [
  {
    id: 1,
    image: 'https://example.com/property1.jpg',
    title: 'Beautiful Apartment',
    type: 'Apartment',
    location: 'New York, NY',
    details: '2 beds, 1 bath',
    host: 'John Doe',
    price: 150,
    rating: 4.5
  },
  {
    id: 2,
    image: 'https://example.com/property2.jpg',
    title: 'Cozy House',
    type: 'House',
    location: 'Los Angeles, CA',
    details: '3 beds, 2 baths',
    host: 'Jane Smith',
    price: 200,
    rating: 4.8
  }
];

describe('PropertyApp', () => {
  it('renders the main heading', () => {
    render(<PropertyApp properties={mockProperties} />);
    
    expect(screen.getByText('Popular Destinations')).toBeInTheDocument();
  });

  it('renders all properties passed as props', () => {
    render(<PropertyApp properties={mockProperties} />);
    
    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('Cozy House')).toBeInTheDocument();
  });

  it('renders empty grid when no properties provided', () => {
    render(<PropertyApp properties={[]} />);
    
    expect(screen.getByText('Popular Destinations')).toBeInTheDocument();
    const grid = screen.getByRole('heading').nextElementSibling;
    expect(grid?.children).toHaveLength(0);
  });

  it('applies correct CSS classes', () => {
    render(<PropertyApp properties={mockProperties} />);
    
    const container = screen.getByText('Popular Destinations').closest('.property-grid-container');
    expect(container).toHaveClass('property-grid-container');
    
    const grid = screen.getByText('Popular Destinations').nextElementSibling;
    expect(grid).toHaveClass('property-grid');
  });

  it('passes correct props to PropertyCard components', () => {
    render(<PropertyApp properties={mockProperties} />);
    
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles, CA')).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
  });
});