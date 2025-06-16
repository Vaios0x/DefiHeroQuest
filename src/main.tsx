import React from 'react'
import ReactDOM from 'react-dom/client'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { config, chains } from './wagmi'
import App from './App.tsx'
import './index.css'

// Configure QueryClient with better caching and stale time
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000, // Data considered fresh for 5 seconds
      gcTime: 10 * 60 * 1000, // Cache data for 10 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false, // Prevent refetch on window focus
      retry: 1, // Reduce retry attempts
    },
  },
})

// Temporarily simplified to avoid RainbowKit configuration issues
// We'll enable full Web3 functionality once the basic site loads

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            accentColor: '#7b3fe4',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="wide"
          appInfo={{
            appName: 'DeFi Hero Quest',
            learnMoreUrl: 'https://defi-hero-quest.vercel.app',
          }}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  </React.StrictMode>,
)