import React, { Suspense, memo, useMemo } from 'react'
import { useHybridStorage } from './hooks/useHybridStorage'
import './styles/animations.css'
import UnifiedLiveDemo from './components/UnifiedLiveDemo';

// Memoize child components to prevent unnecessary re-renders
const LoadingSpinner = memo(() => (
  <div className="loading-wrapper animate-fade-in">
    <div className="loading-spinner"></div>
    <p>Cargando...</p>
  </div>
))

const ErrorMessage = memo(({ message }: { message: string }) => (
  <div className="error-wrapper animate-fade-in">
    <p className="error-message">{message}</p>
  </div>
))

// Main App component
const App: React.FC = memo(() => {
  const { isInitialized, isLoading, error } = useHybridStorage()

  // Memoize styles to prevent re-renders
  const containerStyle = useMemo(() => ({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: 'white'
  }), [])

  // Prevent content shift during loading
  if (!isInitialized) {
    return (
      <div className="app-container no-flicker">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-container no-flicker">
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <Suspense fallback={<LoadingSpinner />}>
        <main className="content-wrapper real-time-update">
          <UnifiedLiveDemo />
        </main>
      </Suspense>
    </div>
  )
})

export default App