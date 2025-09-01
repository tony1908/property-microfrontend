# Testing Tutorial: Unit Tests with Vitest and E2E Tests with Playwright

This tutorial covers the complete testing setup for the Property Service micro frontend, including unit tests with Vitest and end-to-end tests with Playwright.

## Table of Contents

1. [Overview](#overview)
2. [Unit Testing with Vitest](#unit-testing-with-vitest)
3. [End-to-End Testing with Playwright](#end-to-end-testing-with-playwright)
4. [Running Tests](#running-tests)
5. [Project Structure](#project-structure)
6. [Key Features Tested](#key-features-tested)
7. [Best Practices](#best-practices)

## Overview

This project implements a comprehensive testing strategy with:
- **Unit Tests**: Testing individual components and utilities in isolation
- **E2E Tests**: Testing complete user workflows across different browsers
- **Cross-browser Support**: Chrome, Firefox, and Safari testing
- **Mock Data**: Realistic test data for consistent testing

## Unit Testing with Vitest

### Setup

Vitest is configured in `vite.config.ts` with the following setup:

```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.ts',
  css: true,
  exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**'],
}
```

### Key Dependencies

```json
{
  "vitest": "^3.2.4",
  "@vitest/ui": "^3.2.4",
  "@vitest/coverage-v8": "^3.2.4",
  "@testing-library/react": "^16.3.0",
  "@testing-library/dom": "^10.4.1",
  "@testing-library/jest-dom": "^6.8.0",
  "jsdom": "^26.1.0"
}
```

### Test Files Structure

#### 1. Component Tests: `PropertyCard.test.tsx`

Tests the individual property card component:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PropertyCard from './PropertyCard';

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard {...mockProperty} />);
    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
  });
  
  it('calls handleCardClick when card is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    // ... test implementation
  });
});
```

**What it tests:**
- Property information rendering
- Image display with correct src
- Click handlers and interactions
- CSS class applications

#### 2. App Container Tests: `PropertyApp.test.tsx`

Tests the main application container:

```typescript
describe('PropertyApp', () => {
  it('renders the main heading', () => {
    render(<PropertyApp properties={mockProperties} />);
    expect(screen.getByText('Popular Destinations')).toBeInTheDocument();
  });
  
  it('renders all properties passed as props', () => {
    // Test that all properties are rendered correctly
  });
});
```

**What it tests:**
- Main heading display
- Property grid rendering
- Props handling
- Empty state handling
- CSS class structure

#### 3. Schema Validation Tests: `types.test.ts`

Tests the Zod schema validation:

```typescript
describe('PropertySchema', () => {
  it('validates a correct property object', () => {
    const result = PropertySchema.safeParse(validProperty);
    expect(result.success).toBe(true);
  });
  
  it('fails validation when id is negative', () => {
    const invalidProperty = { ...validProperty, id: -1 };
    const result = PropertySchema.safeParse(invalidProperty);
    expect(result.success).toBe(false);
  });
});
```

**What it tests:**
- Valid property object validation
- Field validation (ID, image, title, etc.)
- Error message verification
- Edge cases and boundary conditions

## End-to-End Testing with Playwright

### Setup

Playwright is configured in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Suite: `property-app.spec.ts`

#### 1. Basic Rendering Tests

```typescript
test('should display the main heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Popular Destinations');
});
```

#### 2. Property Card Interaction Tests

```typescript
test('should have clickable property cards', async ({ page }) => {
  await page.goto('/');
  const consoleLogs: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'log') {
      consoleLogs.push(msg.text());
    }
  });
  
  await propertyCards.first().click();
  expect(consoleLogs.length).toBeGreaterThan(0);
});
```

#### 3. Responsive Design Tests

```typescript
test('should have proper responsive layout', async ({ page }) => {
  // Test desktop view
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('/');
  
  // Test mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  await page.reload();
});
```

**What E2E tests cover:**
- Main heading display
- Property card rendering and visibility
- Click interactions and console logging
- Responsive design across viewports
- Property information display verification
- Image loading verification
- Cross-browser compatibility

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run unit tests with UI
npm run test:ui

# Run unit tests with coverage
npm run test:coverage
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Show last test report
npx playwright show-report
```

## Project Structure

```
property-service/
├── src/
│   ├── data/
│   │   └── mockData.ts              # Test data for E2E tests
│   ├── model/
│   │   ├── types.ts                 # Zod schemas
│   │   └── types.test.ts            # Schema validation tests
│   ├── ui/
│   │   └── PropertyCard/
│   │       ├── PropertyCard.tsx
│   │       └── PropertyCard.test.tsx # Component unit tests
│   ├── PropertyApp.tsx
│   ├── PropertyApp.test.tsx         # App container tests
│   └── setupTests.ts                # Test setup configuration
├── tests/
│   └── e2e/
│       └── property-app.spec.ts     # E2E test suite
├── playwright.config.ts             # Playwright configuration
├── vite.config.ts                   # Vitest configuration
└── TESTING-TUTORIAL.md             # This file
```

## Key Features Tested

### Unit Tests (19 tests)
- ✅ Property information rendering
- ✅ Image display and attributes
- ✅ Click event handling
- ✅ CSS class applications
- ✅ Main heading display
- ✅ Property grid functionality
- ✅ Props handling and validation
- ✅ Empty state scenarios
- ✅ Zod schema validation (all fields)
- ✅ Error message verification
- ✅ Edge cases and boundary conditions

### E2E Tests (15 tests across 3 browsers)
- ✅ Main heading visibility
- ✅ Property cards rendering
- ✅ Click interactions
- ✅ Console logging verification
- ✅ Responsive design (desktop/mobile)
- ✅ Property information display
- ✅ Image loading verification
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)

## Best Practices

### Unit Testing Best Practices

1. **Test in Isolation**: Each component is tested independently with mock data
2. **User-Centric Testing**: Using `@testing-library/react` focuses on user interactions
3. **Comprehensive Coverage**: Testing rendering, interactions, and edge cases
4. **Mock External Dependencies**: Using `vi.spyOn` for console logging tests

### E2E Testing Best Practices

1. **Real Browser Testing**: Testing across Chrome, Firefox, and Safari
2. **Responsive Testing**: Verifying desktop and mobile viewports
3. **User Journey Testing**: Testing complete user workflows
4. **Graceful Degradation**: Tests handle scenarios with and without data

### Code Organization

1. **Separation of Concerns**: Unit tests alongside components, E2E tests in dedicated folder
2. **Realistic Test Data**: Using mock data that represents real-world scenarios
3. **Configuration Management**: Clear separation of test configurations
4. **Script Organization**: Logical npm script naming for different test types

## Debugging and Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout in playwright.config.ts
2. **CSS not loading**: Ensure `css: true` in vitest config
3. **Image accessibility**: Use `getByAltText('')` for images with empty alt attributes
4. **Console log testing**: Set up proper event listeners before interactions

### Debug Commands

```bash
# Debug specific E2E test
npm run test:e2e:debug -- --grep "should display the main heading"

# Run tests in headed mode
npx playwright test --headed

# Generate test report
npx playwright test --reporter=html
```

This testing setup provides comprehensive coverage ensuring the Property Service micro frontend works correctly across all supported environments and use cases.

## Performance Monitoring with Web Vitals

### Overview

The application includes comprehensive performance monitoring using Google's Web Vitals library to track Core Web Vitals and other performance metrics in real-time.

### Setup and Integration

#### Dependencies

```json
{
  "web-vitals": "^5.1.0"
}
```

#### Core Performance Utilities

The performance monitoring system consists of several key components:

1. **Web Vitals Integration** (`src/utils/webVitals.ts`)
2. **Performance Monitoring Hook** (`src/hooks/usePerformanceMonitor.ts`)
3. **Performance Monitor Component** (`src/components/PerformanceMonitor/`)
4. **Component Performance Tracking** (integrated into components)

#### Key Performance Metrics Tracked

##### Core Web Vitals
- **CLS (Cumulative Layout Shift)**: Measures visual stability (Good: < 0.1)
- **FID (First Input Delay)**: Measures interactivity (Good: < 100ms)
- **FCP (First Contentful Paint)**: Measures loading speed (Good: < 1.8s)
- **LCP (Largest Contentful Paint)**: Measures loading performance (Good: < 2.5s)
- **TTFB (Time to First Byte)**: Measures server response time (Good: < 800ms)

##### Component-Level Metrics
- **Render Time**: Individual component rendering performance
- **Slow Render Detection**: Automatic warnings for renders > 16.67ms (1 frame at 60fps)

### Implementation Details

#### 1. Web Vitals Initialization (`src/main.tsx`)

```typescript
import { initWebVitals } from './utils/webVitals'

// Initialize Web Vitals tracking
if (typeof window !== 'undefined') {
  initWebVitals();
}
```

#### 2. Performance Monitoring Hook

```typescript
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';

function MyComponent() {
  const { metrics, scores, loading, overallScore } = usePerformanceMonitor();
  
  // Use metrics in your component
  return (
    <div>Performance Score: {overallScore}</div>
  );
}
```

#### 3. Component Performance Tracking

```typescript
import { useComponentPerformance } from './hooks/usePerformanceMonitor';

function PropertyCard() {
  // Track component render performance
  useComponentPerformance('PropertyCard');
  
  return <div>...</div>;
}
```

#### 4. Visual Performance Monitor

The application includes a toggleable performance monitor accessible via **Ctrl+Shift+P**:

```typescript
// Show/hide performance monitor
const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);

// Keyboard shortcut handler
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'P') {
      setShowPerformanceMonitor(prev => !prev);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
}, []);
```

### Performance Testing

#### Unit Tests for Performance Utils

```typescript
describe('Web Vitals Utils', () => {
  it('should evaluate performance correctly', () => {
    const goodMetrics = {
      cls: 0.05, fid: 50, fcp: 1000, lcp: 2000, ttfb: 500
    };
    const scores = evaluatePerformance(goodMetrics);
    expect(scores.cls).toBe('good');
  });
});
```

#### E2E Performance Testing

```typescript
test('should track web vitals metrics on page load', async ({ page }) => {
  const webVitalsLogs: string[] = [];
  
  page.on('console', msg => {
    if (msg.text().includes('Web Vital:')) {
      webVitalsLogs.push(msg.text());
    }
  });
  
  await page.goto('/');
  expect(webVitalsLogs.length).toBeGreaterThan(0);
});
```

### Performance Monitoring Features

#### 1. Real-time Metrics Collection
- Automatic collection of Core Web Vitals
- Console logging of all metrics
- Configurable analytics endpoint integration

#### 2. Performance Scoring System
- Color-coded performance indicators (Good/Needs Improvement/Poor)
- Overall performance score calculation
- Threshold-based evaluation using Google's recommendations

#### 3. Visual Performance Dashboard
- Real-time metrics display
- Responsive design with mobile support
- Keyboard shortcut toggle (Ctrl+Shift+P)
- Detailed metric explanations

#### 4. Component-Level Monitoring
- Individual component render time tracking
- Slow render detection and warnings
- Performance profiling for optimization

### Usage Instructions

#### Viewing Performance Metrics

1. **During Development**: 
   - Start the application with `npm run dev`
   - Press **Ctrl+Shift+P** to toggle the performance monitor
   - View real-time metrics in the floating panel

2. **In Console**:
   - Open browser developer tools
   - View Web Vitals logs: `Web Vital: {name: 'FCP', value: 1234, ...}`
   - View component logs: `Component PropertyCard render time: 8.5ms`

3. **Analytics Integration**:
   - Modify `sendToAnalytics` function in `src/utils/webVitals.ts`
   - Add your analytics endpoint or Google Analytics integration

#### Performance Optimization Workflow

1. **Identify Issues**:
   ```bash
   # Run performance tests
   npm run test:e2e -- --grep "Performance"
   ```

2. **Monitor in Development**:
   - Use Ctrl+Shift+P to view live metrics
   - Watch for slow render warnings in console

3. **Analyze Metrics**:
   - CLS > 0.1: Check for layout shifts
   - FID > 100ms: Optimize JavaScript execution
   - LCP > 2.5s: Optimize loading performance
   - Component renders > 16.67ms: Check for expensive operations

### Performance Best Practices

1. **Component Optimization**:
   - Use React.memo for expensive components
   - Implement proper dependency arrays in hooks
   - Avoid inline functions in render methods

2. **Loading Performance**:
   - Optimize images (use appropriate formats and sizes)
   - Implement lazy loading for non-critical components
   - Minimize bundle size with proper code splitting

3. **Layout Stability**:
   - Reserve space for dynamic content
   - Use CSS aspect-ratio for images
   - Avoid inserting content above existing content

4. **Monitoring in Production**:
   - Implement analytics integration
   - Set up alerts for performance regressions
   - Regular performance auditing

### Testing Coverage

#### Performance Tests Added (10 additional tests)
- ✅ Web Vitals metrics collection verification
- ✅ Performance monitor keyboard shortcut functionality
- ✅ Metrics display and UI component testing
- ✅ Component render performance tracking
- ✅ Error handling during metrics collection
- ✅ Performance scoring system validation
- ✅ Threshold-based evaluation logic
- ✅ UI state management (show/hide monitor)
- ✅ Cross-browser performance tracking
- ✅ Graceful degradation testing

#### Total Test Coverage
- **Unit Tests**: 29 tests (including 10 performance-related tests)
- **E2E Tests**: 21 tests (including 6 performance monitoring tests)
- **Browsers**: Chrome, Firefox, Safari
- **Performance Metrics**: All Core Web Vitals + component-level tracking

This comprehensive performance monitoring system ensures optimal user experience while providing developers with the tools needed to identify and resolve performance issues proactively.