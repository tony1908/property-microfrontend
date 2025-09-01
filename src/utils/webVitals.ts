import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

// Function to send metrics to analytics endpoint (replace with your actual endpoint)
function sendToAnalytics(metric: any) {
  // In a real application, you would send this to your analytics service
  // For this example, we'll just log to console
  console.log('Web Vital:', metric);
  
  // Example of sending to Google Analytics 4
  // if (window.gtag) {
  //   window.gtag('event', metric.name, {
  //     value: Math.round(metric.value),
  //     metric_id: metric.id,
  //     metric_value: metric.value,
  //     metric_delta: metric.delta,
  //   });
  // }
  
  // Example of sending to a custom analytics endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(metric),
  // }).catch(console.error);
}

// Initialize web vitals tracking
export function initWebVitals() {
  // Cumulative Layout Shift (CLS)
  // Measures visual stability - good score is < 0.1
  onCLS(sendToAnalytics);

  // Interaction to Next Paint (INP) - replaces FID
  // Measures interactivity - good score is < 200ms
  onINP(sendToAnalytics);

  // First Contentful Paint (FCP)
  // Measures loading performance - good score is < 1.8s
  onFCP(sendToAnalytics);

  // Largest Contentful Paint (LCP)
  // Measures loading performance - good score is < 2.5s
  onLCP(sendToAnalytics);

  // Time to First Byte (TTFB)
  // Measures server response time - good score is < 800ms
  onTTFB(sendToAnalytics);
}

// Function to get performance metrics summary
export function getPerformanceMetrics(): Promise<{
  cls: number;
  inp: number;
  fcp: number;
  lcp: number;
  ttfb: number;
}> {
  return new Promise((resolve) => {
    const metrics: any = {};
    let metricsCount = 0;
    const totalMetrics = 5;

    const handleMetric = (metric: any) => {
      metrics[metric.name.toLowerCase()] = metric.value;
      metricsCount++;
      
      if (metricsCount === totalMetrics) {
        resolve({
          cls: metrics.cls || 0,
          inp: metrics.inp || 0,
          fcp: metrics.fcp || 0,
          lcp: metrics.lcp || 0,
          ttfb: metrics.ttfb || 0,
        });
      }
    };

    onCLS(handleMetric);
    onINP(handleMetric);
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);

    // Timeout after 5 seconds if not all metrics are collected
    setTimeout(() => {
      resolve({
        cls: metrics.cls || 0,
        inp: metrics.inp || 0,
        fcp: metrics.fcp || 0,
        lcp: metrics.lcp || 0,
        ttfb: metrics.ttfb || 0,
      });
    }, 5000);
  });
}

// Performance thresholds based on web.dev recommendations
export const PERFORMANCE_THRESHOLDS = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  INP: { good: 200, needsImprovement: 500 },
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

// Function to evaluate performance score
export function evaluatePerformance(metrics: { [key: string]: number }) {
  const scores: { [key: string]: 'good' | 'needs-improvement' | 'poor' } = {};
  
  Object.entries(metrics).forEach(([key, value]) => {
    const thresholds = PERFORMANCE_THRESHOLDS[key.toUpperCase() as keyof typeof PERFORMANCE_THRESHOLDS];
    if (thresholds) {
      if (value <= thresholds.good) {
        scores[key] = 'good';
      } else if (value <= thresholds.needsImprovement) {
        scores[key] = 'needs-improvement';
      } else {
        scores[key] = 'poor';
      }
    }
  });
  
  return scores;
}