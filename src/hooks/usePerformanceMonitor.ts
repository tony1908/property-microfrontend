import { useEffect, useState } from 'react';
import { getPerformanceMetrics, evaluatePerformance } from '../utils/webVitals';

export interface PerformanceMetrics {
  cls: number;
  inp: number;
  fcp: number;
  lcp: number;
  ttfb: number;
}

export interface PerformanceScores {
  [key: string]: 'good' | 'needs-improvement' | 'poor';
}

export interface PerformanceData {
  metrics: PerformanceMetrics | null;
  scores: PerformanceScores | null;
  loading: boolean;
  overallScore: 'good' | 'needs-improvement' | 'poor' | null;
}

export function usePerformanceMonitor(): PerformanceData {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [scores, setScores] = useState<PerformanceScores | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collectMetrics = async () => {
      try {
        const performanceMetrics = await getPerformanceMetrics();
        const performanceScores = evaluatePerformance(performanceMetrics);
        
        setMetrics(performanceMetrics);
        setScores(performanceScores);
      } catch (error) {
        console.error('Failed to collect performance metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    // Collect metrics after a delay to allow for page load completion
    const timer = setTimeout(collectMetrics, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate overall performance score
  const overallScore = scores ? calculateOverallScore(scores) : null;

  return {
    metrics,
    scores,
    loading,
    overallScore,
  };
}

function calculateOverallScore(scores: PerformanceScores): 'good' | 'needs-improvement' | 'poor' {
  const scoreValues = Object.values(scores);
  const goodCount = scoreValues.filter(score => score === 'good').length;
  const poorCount = scoreValues.filter(score => score === 'poor').length;
  
  if (poorCount > 0) return 'poor';
  if (goodCount >= scoreValues.length * 0.8) return 'good';
  return 'needs-improvement';
}

// Hook for component-level performance tracking
export function useComponentPerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Log component render time
      console.log(`Component ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      
      // You can send this to analytics as well
      if (renderTime > 16.67) { // More than 1 frame at 60fps
        console.warn(`Slow render detected for ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
}