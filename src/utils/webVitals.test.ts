import { describe, it, expect } from 'vitest';
import { evaluatePerformance, PERFORMANCE_THRESHOLDS } from './webVitals';

describe('Web Vitals Utils', () => {
  describe('evaluatePerformance', () => {
    it('should return "good" scores for metrics within good thresholds', () => {
      const goodMetrics = {
        cls: 0.05,
        inp: 150,
        fcp: 1000,
        lcp: 2000,
        ttfb: 500
      };

      const scores = evaluatePerformance(goodMetrics);

      expect(scores.cls).toBe('good');
      expect(scores.inp).toBe('good');
      expect(scores.fcp).toBe('good');
      expect(scores.lcp).toBe('good');
      expect(scores.ttfb).toBe('good');
    });

    it('should return "needs-improvement" scores for metrics in middle range', () => {
      const needsImprovementMetrics = {
        cls: 0.15,
        inp: 350,
        fcp: 2500,
        lcp: 3500,
        ttfb: 1200
      };

      const scores = evaluatePerformance(needsImprovementMetrics);

      expect(scores.cls).toBe('needs-improvement');
      expect(scores.inp).toBe('needs-improvement');
      expect(scores.fcp).toBe('needs-improvement');
      expect(scores.lcp).toBe('needs-improvement');
      expect(scores.ttfb).toBe('needs-improvement');
    });

    it('should return "poor" scores for metrics exceeding thresholds', () => {
      const poorMetrics = {
        cls: 0.5,
        inp: 800,
        fcp: 4000,
        lcp: 5000,
        ttfb: 2500
      };

      const scores = evaluatePerformance(poorMetrics);

      expect(scores.cls).toBe('poor');
      expect(scores.inp).toBe('poor');
      expect(scores.fcp).toBe('poor');
      expect(scores.lcp).toBe('poor');
      expect(scores.ttfb).toBe('poor');
    });

    it('should handle mixed performance metrics correctly', () => {
      const mixedMetrics = {
        cls: 0.05,    // good
        inp: 350,     // needs-improvement
        fcp: 4000,    // poor
        lcp: 2000,    // good
        ttfb: 500     // good
      };

      const scores = evaluatePerformance(mixedMetrics);

      expect(scores.cls).toBe('good');
      expect(scores.inp).toBe('needs-improvement');
      expect(scores.fcp).toBe('poor');
      expect(scores.lcp).toBe('good');
      expect(scores.ttfb).toBe('good');
    });

    it('should ignore unknown metrics', () => {
      const metricsWithUnknown = {
        cls: 0.05,
        unknownMetric: 1000
      };

      const scores = evaluatePerformance(metricsWithUnknown);

      expect(scores.cls).toBe('good');
      expect(scores.unknownMetric).toBeUndefined();
    });
  });

  describe('PERFORMANCE_THRESHOLDS', () => {
    it('should have correct thresholds for CLS', () => {
      expect(PERFORMANCE_THRESHOLDS.CLS.good).toBe(0.1);
      expect(PERFORMANCE_THRESHOLDS.CLS.needsImprovement).toBe(0.25);
    });

    it('should have correct thresholds for INP', () => {
      expect(PERFORMANCE_THRESHOLDS.INP.good).toBe(200);
      expect(PERFORMANCE_THRESHOLDS.INP.needsImprovement).toBe(500);
    });

    it('should have correct thresholds for FCP', () => {
      expect(PERFORMANCE_THRESHOLDS.FCP.good).toBe(1800);
      expect(PERFORMANCE_THRESHOLDS.FCP.needsImprovement).toBe(3000);
    });

    it('should have correct thresholds for LCP', () => {
      expect(PERFORMANCE_THRESHOLDS.LCP.good).toBe(2500);
      expect(PERFORMANCE_THRESHOLDS.LCP.needsImprovement).toBe(4000);
    });

    it('should have correct thresholds for TTFB', () => {
      expect(PERFORMANCE_THRESHOLDS.TTFB.good).toBe(800);
      expect(PERFORMANCE_THRESHOLDS.TTFB.needsImprovement).toBe(1800);
    });
  });
});