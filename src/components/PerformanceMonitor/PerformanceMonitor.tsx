import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import './PerformanceMonitor.css';

interface PerformanceMonitorProps {
  visible?: boolean;
}

export function PerformanceMonitor({ visible = false }: PerformanceMonitorProps) {
  const { metrics, scores, loading, overallScore } = usePerformanceMonitor();

  if (!visible || loading) return null;

  return (
    <div className="performance-monitor">
      <div className="performance-header">
        <h3>Performance Metrics</h3>
        <div className={`overall-score ${overallScore}`}>
          {overallScore?.toUpperCase()}
        </div>
      </div>
      
      {metrics && scores && (
        <div className="metrics-grid">
          <div className={`metric-item ${scores.cls}`}>
            <label>CLS</label>
            <span className="value">{metrics.cls.toFixed(3)}</span>
            <span className="threshold">{"< 0.1"}</span>
          </div>
          
          <div className={`metric-item ${scores.inp}`}>
            <label>INP</label>
            <span className="value">{Math.round(metrics.inp)}ms</span>
            <span className="threshold">{"< 200ms"}</span>
          </div>
          
          <div className={`metric-item ${scores.fcp}`}>
            <label>FCP</label>
            <span className="value">{Math.round(metrics.fcp)}ms</span>
            <span className="threshold">{"< 1.8s"}</span>
          </div>
          
          <div className={`metric-item ${scores.lcp}`}>
            <label>LCP</label>
            <span className="value">{Math.round(metrics.lcp)}ms</span>
            <span className="threshold">{"< 2.5s"}</span>
          </div>
          
          <div className={`metric-item ${scores.ttfb}`}>
            <label>TTFB</label>
            <span className="value">{Math.round(metrics.ttfb)}ms</span>
            <span className="threshold">{"< 800ms"}</span>
          </div>
        </div>
      )}
      
      <div className="metrics-info">
        <p><strong>CLS:</strong> Cumulative Layout Shift - Visual stability</p>
        <p><strong>INP:</strong> Interaction to Next Paint - Interactivity</p>
        <p><strong>FCP:</strong> First Contentful Paint - Loading speed</p>
        <p><strong>LCP:</strong> Largest Contentful Paint - Loading performance</p>
        <p><strong>TTFB:</strong> Time to First Byte - Server response</p>
      </div>
    </div>
  );
}

export default PerformanceMonitor;