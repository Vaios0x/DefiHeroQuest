// src/hooks/useHybridStorage.ts
// 🚀 Hook React para Sistema Híbrido de Storage

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { hybridStorage } from '../lib/hybrid-storage'

interface TransactionData {
  hash: string
  type: 'transfer' | 'nft' | 'defi' | 'contract' | 'swap'
  status: 'pending' | 'success' | 'failed'
  amount?: string
  gasPrice?: string
  gasUsed?: string
  blockNumber?: number
  explorerUrl?: string
  metadata?: Record<string, any>
}

interface UserPreferences {
  defaultChain?: number
  preferredGasSpeed?: 'slow' | 'standard' | 'fast' | 'instant'
  slippageTolerance?: number
  theme?: 'light' | 'dark' | 'auto'
  notifications?: boolean
  autoConnect?: boolean
  language?: string
  analytics?: boolean
}

interface StorageStats {
  localStorage: { used: number; available: number }
  indexedDB: { transactionCount: number; analyticsCount: number }
  cacheAPI: { size: number }
}

export const useHybridStorage = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  
  const [state, setState] = useState({
    isInitialized: false,
    isLoading: false,
    error: null as string | null,
    transactions: [] as any[],
    userConfig: null as UserPreferences | null,
    storageStats: null as StorageStats | null
  })

  // 🚀 Inicializar sistema híbrido - Solo una vez al montar
  useEffect(() => {
    let mounted = true;

    const initStorage = async () => {
      if (!mounted) return;
      
      try {
        setState(prev => ({ ...prev, isLoading: true }))
        await hybridStorage.init()
        
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            isInitialized: true,
            isLoading: false 
          }))
          console.log('✅ Hybrid Storage initialized')
        }
      } catch (err) {
        if (mounted) {
          console.error('❌ Failed to initialize hybrid storage:', err)
          setState(prev => ({
            ...prev,
            error: 'Failed to initialize storage system',
            isLoading: false
          }))
        }
      }
    }

    initStorage()

    return () => {
      mounted = false
      hybridStorage.destroy()
    }
  }, []) // Solo se ejecuta al montar

  // 📱 Cargar datos del usuario - Solo cuando cambia address y está inicializado
  useEffect(() => {
    let mounted = true;

    const loadUserData = async () => {
      if (!state.isInitialized || !address || !mounted) return;

      try {
        setState(prev => ({ ...prev, isLoading: true }))
        
        const [newTransactions, newConfig, newStats] = await Promise.all([
          loadTransactions(),
          loadUserConfig(),
          updateStorageStats()
        ])

        if (mounted) {
          setState(prev => ({
            ...prev,
            transactions: newTransactions || [],
            userConfig: newConfig,
            storageStats: newStats,
            isLoading: false
          }))
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to load user data:', err)
          setState(prev => ({
            ...prev,
            error: 'Failed to load user data',
            isLoading: false
          }))
        }
      }
    }

    loadUserData()

    return () => {
      mounted = false
    }
  }, [state.isInitialized, address])

  // 💾 GUARDAR TRANSACCIÓN
  const saveTransaction = useCallback(async (transactionData: TransactionData): Promise<string | null> => {
    if (!state.isInitialized || !address || !chainId) return null

    try {
      setState(prev => ({ ...prev, isLoading: true }))
      setState(prev => ({ ...prev, error: null }))

      const txId = await hybridStorage.saveTransaction({
        ...transactionData,
        chainId,
        address
      })

      // Actualizar lista local
      await loadTransactions()
      
      // Track analytics event
      await hybridStorage.trackEvent('transaction_saved', 'transaction', {
        type: transactionData.type,
        status: transactionData.status,
        chainId
      }, address)

      console.log(`💾 Transaction saved with ID: ${txId}`)
      return txId
    } catch (err) {
      console.error('Error saving transaction:', err)
      setState(prev => ({ ...prev, error: 'Failed to save transaction' }))
      return null
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.isInitialized, address, chainId])

  // 📋 CARGAR TRANSACCIONES
  const loadTransactions = useCallback(async (source: 'localStorage' | 'indexedDB' = 'indexedDB') => {
    if (!state.isInitialized || !address) return

    try {
      setState(prev => ({ ...prev, isLoading: true }))
      const txs = await hybridStorage.getTransactions(address, source)
      setState(prev => ({ ...prev, transactions: txs }))
      console.log(`📋 Loaded ${txs.length} transactions from ${source}`)
    } catch (err) {
      console.error('Error loading transactions:', err)
      setState(prev => ({ ...prev, error: 'Failed to load transactions' }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.isInitialized, address])

  // ⚙️ GUARDAR CONFIGURACIÓN
  const saveUserConfig = useCallback(async (config: UserPreferences): Promise<boolean> => {
    if (!state.isInitialized || !address) return false

    try {
      setState(prev => ({ ...prev, isLoading: true }))
      setState(prev => ({ ...prev, error: null }))

      await hybridStorage.saveUserConfig(address, config)
      setState(prev => ({ ...prev, userConfig: { ...prev.userConfig, ...config } }))

      // Track analytics
      await hybridStorage.trackEvent('config_updated', 'ui', {
        changes: Object.keys(config)
      }, address)

      console.log('⚙️ User config saved successfully')
      return true
    } catch (err) {
      console.error('Error saving user config:', err)
      setState(prev => ({ ...prev, error: 'Failed to save configuration' }))
      return false
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.isInitialized, address])

  // 📖 CARGAR CONFIGURACIÓN
  const loadUserConfig = useCallback(async () => {
    if (!state.isInitialized || !address) return

    try {
      const config = await hybridStorage.getUserConfig(address)
      setState(prev => ({ ...prev, userConfig: config }))
      console.log('📖 User config loaded')
    } catch (err) {
      console.error('Error loading user config:', err)
      setState(prev => ({ ...prev, error: 'Failed to load configuration' }))
    }
  }, [state.isInitialized, address])

  // 📊 TRACK EVENT
  const trackEvent = useCallback(async (
    event: string, 
    category: 'transaction' | 'ui' | 'error' | 'performance',
    data: Record<string, any>
  ): Promise<boolean> => {
    if (!state.isInitialized) return false

    try {
      await hybridStorage.trackEvent(event, category, {
        ...data,
        chainId,
        timestamp: new Date().toISOString()
      }, address)
      
      console.log(`📊 Event tracked: ${event}`)
      return true
    } catch (err) {
      console.error('Error tracking event:', err)
      return false
    }
  }, [state.isInitialized, address, chainId])

  // 📊 OBTENER ESTADÍSTICAS
  const updateStorageStats = useCallback(async () => {
    if (!state.isInitialized) return

    try {
      const stats = await hybridStorage.getStorageStats()
      setState(prev => ({ ...prev, storageStats: stats }))
      console.log('📊 Storage stats updated:', stats)
    } catch (err) {
      console.error('Error getting storage stats:', err)
    }
  }, [state.isInitialized])

  // 🧹 LIMPIAR DATOS
  const clearData = useCallback(async (walletOnly = true): Promise<boolean> => {
    if (!state.isInitialized) return false

    try {
      setState(prev => ({ ...prev, isLoading: true }))
      setState(prev => ({ ...prev, error: null }))

      await hybridStorage.clearAllData(walletOnly ? address : undefined)
      
      if (walletOnly && address) {
        setState(prev => ({ ...prev, transactions: [], userConfig: null }))
        console.log(`🧹 Data cleared for wallet: ${address}`)
      } else {
        setState(prev => ({ ...prev, transactions: [], userConfig: null }))
        setState(prev => ({ ...prev, storageStats: null }))
        console.log('🧹 All data cleared')
      }

      await updateStorageStats()
      return true
    } catch (err) {
      console.error('Error clearing data:', err)
      setState(prev => ({ ...prev, error: 'Failed to clear data' }))
      return false
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [state.isInitialized, address])

  // 🔄 SINCRONIZAR DATOS - Memoizado para evitar recreaciones
  const syncData = useCallback(async (): Promise<boolean> => {
    if (!state.isInitialized || !address) return false

    try {
      setState(prev => ({ ...prev, isLoading: true }))

      const [newTransactions, newConfig, newStats] = await Promise.all([
        loadTransactions(),
        loadUserConfig(),
        updateStorageStats()
      ])

      setState(prev => ({
        ...prev,
        transactions: newTransactions || [],
        userConfig: newConfig,
        storageStats: newStats,
        isLoading: false
      }))

      await trackEvent('data_sync', 'performance', {
        source: 'manual',
        transactionCount: newTransactions?.length || 0
      })

      console.log('🔄 Data synchronized successfully')
      return true
    } catch (err) {
      console.error('Error syncing data:', err)
      setState(prev => ({
        ...prev,
        error: 'Failed to sync data',
        isLoading: false
      }))
      return false
    }
  }, [state.isInitialized, address])

  // 💾 EXPORTAR DATOS (backup local)
  const exportData = useCallback(async (): Promise<string | null> => {
    if (!state.isInitialized || !address) return null

    try {
      const exportData = {
        wallet: address,
        chainId,
        timestamp: new Date().toISOString(),
        transactions: await hybridStorage.getTransactions(address),
        config: await hybridStorage.getUserConfig(address),
        version: '1.0.0'
      }

      const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(dataBlob)
      
      // Create download link
      const a = document.createElement('a')
      a.href = url
      a.download = `yield-backup-${address.slice(0, 6)}-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      
      URL.revokeObjectURL(url)

      await trackEvent('data_export', 'ui', {
        transactionCount: exportData.transactions.length,
        hasConfig: !!exportData.config
      })

      console.log('💾 Data exported successfully')
      return url
    } catch (err) {
      console.error('Error exporting data:', err)
      setState(prev => ({ ...prev, error: 'Failed to export data' }))
      return null
    }
  }, [state.isInitialized, address, chainId])

  // 🔍 BUSCAR TRANSACCIONES
  const searchTransactions = useCallback((
    query: string,
    filters?: {
      type?: string
      status?: string
      chainId?: number
      dateFrom?: Date
      dateTo?: Date
    }
  ) => {
    if (!state.transactions.length) return []

    return state.transactions.filter(tx => {
      // Text search
      if (query) {
        const searchFields = [tx.hash, tx.type, tx.status, tx.amount].join(' ').toLowerCase()
        if (!searchFields.includes(query.toLowerCase())) return false
      }

      // Filters
      if (filters?.type && tx.type !== filters.type) return false
      if (filters?.status && tx.status !== filters.status) return false
      if (filters?.chainId && tx.chainId !== filters.chainId) return false
      
      if (filters?.dateFrom || filters?.dateTo) {
        const txDate = new Date(tx.timestamp)
        if (filters.dateFrom && txDate < filters.dateFrom) return false
        if (filters.dateTo && txDate > filters.dateTo) return false
      }

      return true
    })
  }, [state.transactions])

  return {
    ...state,
    syncData,
    saveTransaction,
    loadTransactions,
    saveUserConfig,
    loadUserConfig,
    trackEvent,
    updateStorageStats,
    clearData,
    exportData,
    searchTransactions,
    
    // Utils
    getTransactionById: useCallback((id: string) => 
      state.transactions.find(tx => tx.id === id), [state.transactions]
    ),
    
    getTransactionsByType: useCallback((type: string) => 
      state.transactions.filter(tx => tx.type === type), [state.transactions]
    ),
    
    getRecentTransactions: useCallback((limit = 10) => 
      state.transactions.slice(0, limit), [state.transactions]
    )
  }
}

// 🎯 Hook específico para transacciones
export const useTransactionStorage = () => {
  const { 
    saveTransaction, 
    transactions, 
    getTransactionById, 
    getTransactionsByType,
    getRecentTransactions,
    searchTransactions,
    isLoading 
  } = useHybridStorage()

  return {
    saveTransaction,
    transactions,
    getTransactionById,
    getTransactionsByType,
    getRecentTransactions,
    searchTransactions,
    isLoading,
    
    // Shortcuts específicos
    getPendingTransactions: useCallback(() => 
      transactions.filter(tx => tx.status === 'pending'), [transactions]
    ),
    
    getSuccessfulTransactions: useCallback(() => 
      transactions.filter(tx => tx.status === 'success'), [transactions]
    ),
    
    getFailedTransactions: useCallback(() => 
      transactions.filter(tx => tx.status === 'failed'), [transactions]
    )
  }
}

// 🎨 Hook específico para configuración de usuario
export const useUserPreferences = () => {
  const { 
    userConfig, 
    saveUserConfig, 
    loadUserConfig, 
    isLoading 
  } = useHybridStorage()

  return {
    config: userConfig,
    updateConfig: saveUserConfig,
    reloadConfig: loadUserConfig,
    isLoading,
    
    // Shortcuts para configuraciones comunes
    setTheme: useCallback((theme: 'light' | 'dark' | 'auto') => 
      saveUserConfig({ theme }), [saveUserConfig]
    ),
    
    setDefaultChain: useCallback((chainId: number) => 
      saveUserConfig({ defaultChain: chainId }), [saveUserConfig]
    ),
    
    setGasSpeed: useCallback((gasSpeed: 'slow' | 'standard' | 'fast' | 'instant') => 
      saveUserConfig({ preferredGasSpeed: gasSpeed }), [saveUserConfig]
    ),
    
    toggleNotifications: useCallback(() => 
      saveUserConfig({ notifications: !userConfig?.notifications }), [saveUserConfig, userConfig]
    )
  }
}

// 📊 Hook específico para analytics
export const useAnalytics = () => {
  const { trackEvent, isInitialized } = useHybridStorage()

  return {
    track: trackEvent,
    isEnabled: isInitialized,
    
    // Shortcuts para eventos comunes
    trackTransaction: useCallback((type: string, status: string, extra?: Record<string, any>) =>
      trackEvent('transaction', 'transaction', { type, status, ...extra }), [trackEvent]
    ),
    
    trackUIEvent: useCallback((action: string, component: string, extra?: Record<string, any>) =>
      trackEvent(action, 'ui', { component, ...extra }), [trackEvent]
    ),
    
    trackError: useCallback((error: string, context: string, extra?: Record<string, any>) =>
      trackEvent('error', 'error', { error, context, ...extra }), [trackEvent]
    ),
    
    trackPerformance: useCallback((metric: string, value: number, extra?: Record<string, any>) =>
      trackEvent(metric, 'performance', { value, ...extra }), [trackEvent]
    )
  }
} 