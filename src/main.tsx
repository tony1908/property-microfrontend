import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { initWebVitals } from './utils/webVitals'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize Web Vitals tracking
if (typeof window !== 'undefined') {
  initWebVitals();
}
