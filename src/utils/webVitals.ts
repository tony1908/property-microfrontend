import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export const sendToAnalytics = (metric: any) => {
    console.log(metric);
    checkPerformance(metric);
}

export const initWebVitals = () => {
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
}

export const PERFORMANCE_THRESHOLDS = {
    CLS: 0.1,
    FCP: 1000,
    INP: 50,
    LCP: 3000,
    TTFB: 3000
}

export const checkPerformance = (metric: any) => {
    const { name, value } = metric;
    const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
    if (value > threshold) {
        console.warn(`Performance metric ${name} exceeded threshold: ${value} > ${threshold}`);
        //send to analytics
        //axios.post("https://example.com/api/web-vitals", metric);
    }
}

    
    