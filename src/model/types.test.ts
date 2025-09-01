import { describe, it, expect } from 'vitest';
import { PropertySchema } from './types';

describe('PropertySchema', () => {
  const validProperty = {
    id: 1,
    image: 'https://example.com/image.jpg',
    title: 'Test Property',
    type: 'Apartment',
    location: 'New York',
    details: '2 bed, 1 bath',
    host: 'John Doe',
    price: 150,
    rating: 4
  };

  it('validates a correct property object', () => {
    const result = PropertySchema.safeParse(validProperty);
    expect(result.success).toBe(true);
  });

  it('fails validation when id is negative', () => {
    const invalidProperty = { ...validProperty, id: -1 };
    const result = PropertySchema.safeParse(invalidProperty);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El ID debe ser positivo');
    }
  });

  it('fails validation when id is not an integer', () => {
    const invalidProperty = { ...validProperty, id: 1.5 };
    const result = PropertySchema.safeParse(invalidProperty);
    
    expect(result.success).toBe(false);
  });

  it('fails validation when image is too short', () => {
    const invalidProperty = { ...validProperty, image: 'short.jpg' };
    const result = PropertySchema.safeParse(invalidProperty);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La imagen debe ser al menos de 10 caracteres');
    }
  });

  it('fails validation when image is too long', () => {
    const invalidProperty = { 
      ...validProperty, 
      image: 'a'.repeat(101) 
    };
    const result = PropertySchema.safeParse(invalidProperty);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La imagen no debe ser mayor a 10 carcaters');
    }
  });

  it('fails validation when title is empty', () => {
    const invalidProperty = { ...validProperty, title: '' };
    const result = PropertySchema.safeParse(invalidProperty);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Property title is required');
    }
  });

  it('fails validation when title is too long', () => {
    const invalidProperty = { 
      ...validProperty, 
      title: 'a'.repeat(101) 
    };
    const result = PropertySchema.safeParse(invalidProperty);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Property title must be less than 100 characters');
    }
  });

  it('fails validation when required fields are missing', () => {
    const invalidProperty = { ...validProperty };
    delete (invalidProperty as any).type;
    
    const result = PropertySchema.safeParse(invalidProperty);
    expect(result.success).toBe(false);
  });

  it('fails validation when price is negative', () => {
    const invalidProperty = { ...validProperty, price: -50 };
    const result = PropertySchema.safeParse(invalidProperty);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El ID debe ser positivo');
    }
  });

  it('fails validation when rating is negative', () => {
    const invalidProperty = { ...validProperty, rating: -1 };
    const result = PropertySchema.safeParse(invalidProperty);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El ID debe ser positivo');
    }
  });
});