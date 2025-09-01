import type { Property } from '../model/types';

export const mockProperties: Property[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    title: 'Modern Downtown Apartment',
    type: 'Apartment',
    location: 'New York, NY',
    details: '2 beds, 1 bath',
    host: 'Sarah Johnson',
    price: 150,
    rating: 4.8
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
    title: 'Cozy Suburban House',
    type: 'House',
    location: 'Los Angeles, CA',
    details: '3 beds, 2 baths',
    host: 'Michael Chen',
    price: 200,
    rating: 4.9
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    title: 'Beachfront Condo',
    type: 'Condominium',
    location: 'Miami, FL',
    details: '1 bed, 1 bath',
    host: 'Emma Rodriguez',
    price: 120,
    rating: 4.7
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    title: 'Mountain Cabin Retreat',
    type: 'Cabin',
    location: 'Aspen, CO',
    details: '2 beds, 1 bath',
    host: 'David Wilson',
    price: 180,
    rating: 4.6
  }
];