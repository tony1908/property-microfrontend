import { useState, useEffect } from 'react'
import PropertyApp from './PropertyApp'
import { mockProperties } from './data/mockData'
import PerformanceMonitor from './components/PerformanceMonitor'

function App() {
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)

  // Toggle performance monitor with Ctrl+Shift+P
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setShowPerformanceMonitor(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <PropertyApp properties={mockProperties} />
      <PerformanceMonitor visible={showPerformanceMonitor} />
      {!showPerformanceMonitor && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#f0f0f0',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666',
          fontFamily: 'monospace',
          zIndex: 999
        }}>
          Press Ctrl+Shift+P to show performance metrics
        </div>
      )}
    </>
  )
}

export default App
