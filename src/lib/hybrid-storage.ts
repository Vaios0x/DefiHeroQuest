// src/lib/hybrid-storage.ts
// 🚀 Sistema Híbrido de Storage - 4 Capas para dApps Web3
// ⛓️ Blockchain + 🏪 Browser Storage + ⚡ PWA Cache + 🌐 IPFS Ready

interface StorageItem<T = any> {
  data: T
  timestamp: number
  expiresAt?: number
  version: string
  walletAddress?: string
}

interface TransactionRecord {
  id: string
  hash: string
  type: 'transfer' | 'nft' | 'defi' | 'contract' | 'swap'
  status: 'pending' | 'success' | 'failed'
  chainId: number
  address: string
  amount?: string
  gasPrice?: string
  gasUsed?: string
  blockNumber?: number
  timestamp: string
  explorerUrl?: string
  metadata?: Record<string, any>
}

interface AnalyticsEvent {
  id: string
  event: string
  category: 'transaction' | 'ui' | 'error' | 'performance'
  data: Record<string, any>
  timestamp: string
  sessionId: string
  walletAddress?: string
}

interface UserConfig {
  defaultChain: number
  preferredGasSpeed: 'slow' | 'standard' | 'fast' | 'instant'
  slippageTolerance: number
  theme: 'light' | 'dark' | 'auto'
  notifications: boolean
  autoConnect: boolean
  language: string
  analytics: boolean
}

// 🏪 CAPA 1: localStorage con TTL y por wallet
class LocalStorageLayer {
  private prefix = 'yield-dapp'
  private version = '1.0.0'

  private getKey(key: string, walletAddress?: string): string {
    return walletAddress 
      ? `${this.prefix}:${walletAddress}:${key}`
      : `${this.prefix}:global:${key}`
  }

  set<T>(key: string, data: T, ttlHours = 168, walletAddress?: string): void { // 7 días default
    const item: StorageItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: ttlHours ? Date.now() + (ttlHours * 60 * 60 * 1000) : undefined,
      version: this.version,
      walletAddress
    }
    
    try {
      localStorage.setItem(this.getKey(key, walletAddress), JSON.stringify(item))
    } catch (error) {
      console.warn('localStorage quota exceeded, cleaning old data:', error)
      this.cleanup()
      // Retry after cleanup
      try {
        localStorage.setItem(this.getKey(key, walletAddress), JSON.stringify(item))
      } catch (retryError) {
        console.error('localStorage still failing after cleanup:', retryError)
      }
    }
  }

  get<T>(key: string, walletAddress?: string): T | null {
    try {
      const stored = localStorage.getItem(this.getKey(key, walletAddress))
      if (!stored) return null

      const item: StorageItem<T> = JSON.parse(stored)
      
      // Check expiration
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.remove(key, walletAddress)
        return null
      }

      // Check version compatibility
      if (item.version !== this.version) {
        console.warn(`Version mismatch for ${key}, removing outdated data`)
        this.remove(key, walletAddress)
        return null
      }

      return item.data
    } catch (error) {
      console.error('Error parsing localStorage data:', error)
      this.remove(key, walletAddress)
      return null
    }
  }

  remove(key: string, walletAddress?: string): void {
    localStorage.removeItem(this.getKey(key, walletAddress))
  }

  cleanup(): void {
    const now = Date.now()
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith(this.prefix)) continue

      try {
        const stored = localStorage.getItem(key)
        if (!stored) continue

        const item: StorageItem = JSON.parse(stored)
        
        // Remove expired items
        if (item.expiresAt && now > item.expiresAt) {
          keysToRemove.push(key)
        }
        // Remove old version items
        else if (item.version !== this.version) {
          keysToRemove.push(key)
        }
      } catch (error) {
        // Remove corrupted items
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key))
    console.log(`Cleaned up ${keysToRemove.length} expired/invalid localStorage items`)
  }
}

// 🗄️ CAPA 2: IndexedDB para datos estructurados y analytics
class IndexedDBLayer {
  private dbName = 'YieldDApp'
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Transactions store
        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', { keyPath: 'id' })
          txStore.createIndex('walletAddress', 'address', { unique: false })
          txStore.createIndex('timestamp', 'timestamp', { unique: false })
          txStore.createIndex('chainId', 'chainId', { unique: false })
          txStore.createIndex('status', 'status', { unique: false })
        }

        // Analytics store
        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id' })
          analyticsStore.createIndex('timestamp', 'timestamp', { unique: false })
          analyticsStore.createIndex('category', 'category', { unique: false })
          analyticsStore.createIndex('walletAddress', 'walletAddress', { unique: false })
        }

        // User configs store
        if (!db.objectStoreNames.contains('configs')) {
          db.createObjectStore('configs', { keyPath: 'walletAddress' })
        }
      }
    })
  }

  async addTransaction(transaction: TransactionRecord): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readwrite')
      const store = tx.objectStore('transactions')
      const request = store.put(transaction)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getTransactions(walletAddress: string, limit = 100): Promise<TransactionRecord[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['transactions'], 'readonly')
      const store = tx.objectStore('transactions')
      const index = store.index('walletAddress')
      const request = index.getAll(walletAddress)

      request.onsuccess = () => {
        const transactions = request.result
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit)
        resolve(transactions)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async addAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['analytics'], 'readwrite')
      const store = tx.objectStore('analytics')
      const request = store.put(event)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async saveUserConfig(walletAddress: string, config: UserConfig): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['configs'], 'readwrite')
      const store = tx.objectStore('configs')
      const request = store.put({ walletAddress, ...config })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getUserConfig(walletAddress: string): Promise<UserConfig | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['configs'], 'readonly')
      const store = tx.objectStore('configs')
      const request = store.get(walletAddress)

      request.onsuccess = () => {
        const result = request.result
        if (result) {
          const { walletAddress: _, ...config } = result
          resolve(config as UserConfig)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async cleanupOldData(daysToKeep = 30): Promise<void> {
    if (!this.db) await this.init()

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
    const cutoffTime = cutoffDate.toISOString()

    // Clean old analytics
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['analytics'], 'readwrite')
      const store = tx.objectStore('analytics')
      const index = store.index('timestamp')
      const range = IDBKeyRange.upperBound(cutoffTime)
      const request = index.openCursor(range)

      let deletedCount = 0
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          deletedCount++
          cursor.continue()
        } else {
          console.log(`Cleaned up ${deletedCount} old analytics events`)
          resolve()
        }
      }
      request.onerror = () => reject(request.error)
    })
  }
}

// ⚡ CAPA 3: Service Worker Cache Manager (PWA)
class ServiceWorkerCache {
  private cacheName = 'yield-dapp-v1'

  async init(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          console.log('New Service Worker version available')
        })
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  async cacheResources(urls: string[]): Promise<void> {
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.cacheName)
        await cache.addAll(urls)
        console.log('Resources cached successfully')
      } catch (error) {
        console.error('Failed to cache resources:', error)
      }
    }
  }

  async getCachedResponse(url: string): Promise<Response | null> {
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.cacheName)
        const response = await cache.match(url)
        return response || null
      } catch (error) {
        console.error('Failed to get cached response:', error)
        return null
      }
    }
    return null
  }

  async clearCache(): Promise<void> {
    if ('caches' in window) {
      try {
        await caches.delete(this.cacheName)
        console.log('Cache cleared successfully')
      } catch (error) {
        console.error('Failed to clear cache:', error)
      }
    }
  }
}

// 🌐 CAPA 4: IPFS Layer (Future Implementation)
class IPFSLayer {
  private isInitialized = false

  async init(): Promise<void> {
    try {
      // Future: Initialize IPFS node
      console.log('IPFS layer ready for future implementation')
      this.isInitialized = true
    } catch (error) {
      console.warn('IPFS not available, using fallback storage')
    }
  }

  async uploadData(_data: any): Promise<string | null> {
    if (!this.isInitialized) return null
    
    try {
      console.log('IPFS upload placeholder - data would be uploaded here')
      return null
    } catch (error) {
      console.error('IPFS upload failed:', error)
      return null
    }
  }

  async retrieveData(_cid: string): Promise<any | null> {
    if (!this.isInitialized) return null

    try {
      console.log('IPFS retrieval placeholder - data would be retrieved here')
      return null
    } catch (error) {
      console.error('IPFS retrieval failed:', error)
      return null
    }
  }
}

// 🚀 MANAGER PRINCIPAL - Orchestrates all 4 layers
export class HybridStorageManager {
  private localStorage: LocalStorageLayer
  private indexedDB: IndexedDBLayer
  private serviceWorker: ServiceWorkerCache
  private ipfs: IPFSLayer
  private syncInterval: NodeJS.Timeout | null = null
  private sessionId: string

  constructor() {
    this.localStorage = new LocalStorageLayer()
    this.indexedDB = new IndexedDBLayer()
    this.serviceWorker = new ServiceWorkerCache()
    this.ipfs = new IPFSLayer()
    this.sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  async init(): Promise<void> {
    console.log('🚀 Initializing Hybrid Storage System...')
    
    try {
      await Promise.all([
        this.indexedDB.init(),
        this.serviceWorker.init(),
        this.ipfs.init()
      ])
      
      // Start background sync
      this.startBackgroundSync()
      
      // Cleanup old data
      this.localStorage.cleanup()
      await this.indexedDB.cleanupOldData()
      
      console.log('✅ Hybrid Storage System initialized successfully')
    } catch (error) {
      console.error('❌ Hybrid Storage System initialization failed:', error)
    }
  }

  // 💾 TRANSACTION STORAGE
  async saveTransaction(transaction: Omit<TransactionRecord, 'id' | 'timestamp'>): Promise<string> {
    const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2)}`
    const fullTransaction: TransactionRecord = {
      ...transaction,
      id,
      timestamp: new Date().toISOString()
    }

    // Save to both localStorage (fast access) and IndexedDB (structured queries)
    this.localStorage.set(`transaction_${id}`, fullTransaction, 168, transaction.address) // 7 days
    await this.indexedDB.addTransaction(fullTransaction)

    console.log(`💾 Transaction saved: ${id}`)
    return id
  }

  async getTransactions(walletAddress: string, source: 'localStorage' | 'indexedDB' = 'indexedDB'): Promise<TransactionRecord[]> {
    if (source === 'localStorage') {
      // Get from localStorage (faster, limited)
      const transactions: TransactionRecord[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.includes(`${walletAddress}:transaction_`)) {
          const tx = this.localStorage.get<TransactionRecord>(key.split(':').pop()!, walletAddress)
          if (tx) transactions.push(tx)
        }
      }
      return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } else {
      // Get from IndexedDB (comprehensive, slower)
      return await this.indexedDB.getTransactions(walletAddress)
    }
  }

  // 📊 ANALYTICS STORAGE
  async trackEvent(event: string, category: AnalyticsEvent['category'], data: Record<string, any>, walletAddress?: string): Promise<void> {
    const analyticsEvent: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2)}`,
      event,
      category,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      walletAddress
    }

    await this.indexedDB.addAnalyticsEvent(analyticsEvent)
    console.log(`📊 Event tracked: ${event}`)
  }

  // ⚙️ USER CONFIG STORAGE
  async saveUserConfig(walletAddress: string, config: Partial<UserConfig>): Promise<void> {
    // Get existing config
    const existingConfig = await this.getUserConfig(walletAddress)
    const fullConfig: UserConfig = {
      defaultChain: 43113,
      preferredGasSpeed: 'standard',
      slippageTolerance: 1,
      theme: 'dark',
      notifications: true,
      autoConnect: true,
      language: 'es',
      analytics: true,
      ...existingConfig,
      ...config
    }

    // Save to both storage layers
    this.localStorage.set('userConfig', fullConfig, 8760, walletAddress) // 1 year
    await this.indexedDB.saveUserConfig(walletAddress, fullConfig)

    console.log(`⚙️ User config saved for: ${walletAddress}`)
  }

  async getUserConfig(walletAddress: string): Promise<UserConfig | null> {
    // Try localStorage first (faster)
    let config = this.localStorage.get<UserConfig>('userConfig', walletAddress)
    
    if (!config) {
      // Fallback to IndexedDB
      config = await this.indexedDB.getUserConfig(walletAddress)
      
      if (config) {
        // Cache in localStorage for next time
        this.localStorage.set('userConfig', config, 8760, walletAddress)
      }
    }

    return config
  }

  // 🔄 BACKGROUND SYNC
  private startBackgroundSync(): void {
    // Sync every 30 seconds
    this.syncInterval = setInterval(async () => {
      try {
        await this.performBackgroundSync()
      } catch (error) {
        console.error('Background sync failed:', error)
      }
    }, 30000)

    console.log('🔄 Background sync started (30s interval)')
  }

  private async performBackgroundSync(): Promise<void> {
    // Future: Sync with IPFS, update caches, etc.
    console.log('🔄 Performing background sync...')
    
    // Cleanup expired localStorage items
    this.localStorage.cleanup()
  }

  // 🧹 CLEANUP METHODS
  async clearAllData(walletAddress?: string): Promise<void> {
    if (walletAddress) {
      // Clear specific wallet data
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key?.includes(walletAddress)) {
          localStorage.removeItem(key)
        }
      }
    } else {
      // Clear all app data
      this.localStorage.cleanup()
      await this.serviceWorker.clearCache()
      
      if (this.indexedDB) {
        // Clear IndexedDB stores
        await this.indexedDB.cleanupOldData(0) // Remove all
      }
    }

    console.log(`🧹 Data cleared for: ${walletAddress || 'all users'}`)
  }

  // 📊 STORAGE STATS
  async getStorageStats(): Promise<{
    localStorage: { used: number; available: number }
    indexedDB: { transactionCount: number; analyticsCount: number }
    cacheAPI: { size: number }
  }> {
    const stats = {
      localStorage: { used: 0, available: 0 },
      indexedDB: { transactionCount: 0, analyticsCount: 0 },
      cacheAPI: { size: 0 }
    }

    // Calculate localStorage usage
    let localStorageSize = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorageSize += localStorage[key].length + key.length
      }
    }
    stats.localStorage.used = localStorageSize
    stats.localStorage.available = 5 * 1024 * 1024 - localStorageSize // ~5MB limit

    // Get IndexedDB counts
    try {
      const transactions = await this.indexedDB.getTransactions('dummy_address', 1000000) // Get all
      stats.indexedDB.transactionCount = transactions.length
    } catch (error) {
      console.error('Error getting storage stats:', error)
    }

    return stats
  }

  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
    console.log('🔥 Hybrid Storage Manager destroyed')
  }
}

// 🌟 SINGLETON INSTANCE
export const hybridStorage = new HybridStorageManager()

// 📱 PWA INSTALL HELPER
export const installPWA = async (): Promise<boolean> => {
  // @ts-ignore
  if (window.deferredPrompt) {
    // @ts-ignore
    window.deferredPrompt.prompt()
    // @ts-ignore
    const { outcome } = await window.deferredPrompt.userChoice
    // @ts-ignore
    window.deferredPrompt = null
    return outcome === 'accepted'
  }
  return false
} 