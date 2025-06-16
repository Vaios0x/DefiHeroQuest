// src/examples/HybridStorageDemo.tsx
// 🚀 Demo del Sistema Híbrido de Storage

import React, { useState } from 'react'
import { useHybridStorage, useTransactionStorage, useUserPreferences, useAnalytics } from '../hooks/useHybridStorage'
import { useAccount, useChainId } from 'wagmi'

const HybridStorageDemo: React.FC = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  // Hooks del sistema híbrido
  const {
    isInitialized,
    isLoading,
    error,
    storageStats,
    updateStorageStats,
    clearData,
    syncData,
    exportData,
    searchTransactions
  } = useHybridStorage()

  const {
    transactions,
    saveTransaction,
    getPendingTransactions,
    getSuccessfulTransactions,
    getFailedTransactions
  } = useTransactionStorage()

  const {
    config: userConfig,
    updateConfig
  } = useUserPreferences()

  const {
    trackUIEvent
  } = useAnalytics()

  // Estado local para demos
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTxType, setSelectedTxType] = useState<'transfer' | 'nft' | 'defi' | 'contract' | 'swap'>('transfer')

  // Demo: Guardar transacción ficticia
  const handleSaveDemo = async () => {
    if (!isConnected || !address) return

    const demoTransaction = {
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      type: selectedTxType,
      status: Math.random() > 0.8 ? 'failed' : 'success',
      amount: (Math.random() * 10).toFixed(4),
      gasPrice: (Math.random() * 50).toFixed(2),
      gasUsed: Math.floor(Math.random() * 100000).toString(),
      blockNumber: Math.floor(Math.random() * 1000000),
      explorerUrl: `https://explorer.example.com/tx/${Math.random().toString(16).substring(2, 66)}`,
      metadata: {
        demo: true,
        timestamp: Date.now()
      }
    } as const

    await saveTransaction(demoTransaction)
    await trackUIEvent('demo_transaction_saved', 'HybridStorageDemo', { type: selectedTxType })
  }

  // Demo: Actualizar configuración
  const handleConfigDemo = async () => {
    const themes = ['light', 'dark', 'auto'] as const
    const gasSpeeds = ['slow', 'standard', 'fast', 'instant'] as const
    
    const randomTheme = themes[Math.floor(Math.random() * themes.length)]
    const randomGasSpeed = gasSpeeds[Math.floor(Math.random() * gasSpeeds.length)]
    
    await updateConfig({
      theme: randomTheme,
      preferredGasSpeed: randomGasSpeed,
      slippageTolerance: Math.floor(Math.random() * 5) + 1,
      notifications: Math.random() > 0.5
    })

    await trackUIEvent('demo_config_updated', 'HybridStorageDemo', { 
      theme: randomTheme, 
      gasSpeed: randomGasSpeed 
    })
  }

  // Filtrar transacciones por búsqueda
  const filteredTransactions = searchQuery 
    ? searchTransactions(searchQuery)
    : transactions

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      color: 'white',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        background: 'linear-gradient(45deg, #06b6d4, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🚀 Sistema Híbrido de Storage - Demo
      </h1>
      
      <p style={{ 
        textAlign: 'center', 
        marginBottom: '40px', 
        color: '#cbd5e1',
        fontSize: '1.1rem'
      }}>
        <strong>⛓️ Blockchain + 🏪 Browser Storage + ⚡ PWA Cache + 🌐 IPFS Ready</strong>
      </p>

      {/* Estado del sistema */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Estado de inicialización */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {isInitialized ? '✅' : '⏳'} Estado del Sistema
          </h3>
          
          <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
            <div>Inicializado: <strong>{isInitialized ? 'Sí' : 'No'}</strong></div>
            <div>Cargando: <strong>{isLoading ? 'Sí' : 'No'}</strong></div>
            <div>Wallet: <strong>{isConnected ? address?.slice(0, 6) + '...' : 'No conectado'}</strong></div>
            <div>Red: <strong>{chainId || 'N/A'}</strong></div>
            {error && (
              <div style={{ color: '#ef4444', marginTop: '8px' }}>
                Error: {error}
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas de storage */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 Estadísticas de Storage
          </h3>
          
          {storageStats ? (
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              <div>localStorage: <strong>{(storageStats.localStorage.used / 1024).toFixed(1)}KB usado</strong></div>
              <div>Transacciones: <strong>{storageStats.indexedDB.transactionCount}</strong></div>
              <div>Analytics: <strong>{storageStats.indexedDB.analyticsCount}</strong></div>
              
              {/* Barra de progreso localStorage */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Uso localStorage:</div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(71, 85, 105, 0.3)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(storageStats.localStorage.used / storageStats.localStorage.available) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: '#6b7280' }}>
              <button
                onClick={updateStorageStats}
                style={{
                  padding: '8px 16px',
                  background: '#374151',
                  border: '1px solid #6b7280',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Cargar Estadísticas
              </button>
            </div>
          )}
        </div>

        {/* Configuración del usuario */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚙️ Configuración Usuario
          </h3>
          
          {userConfig ? (
            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              <div>Tema: <strong>{userConfig.theme}</strong></div>
              <div>Gas: <strong>{userConfig.preferredGasSpeed}</strong></div>
              <div>Red default: <strong>{userConfig.defaultChain}</strong></div>
              <div>Slippage: <strong>{userConfig.slippageTolerance}%</strong></div>
              <div>Notificaciones: <strong>{userConfig.notifications ? 'Sí' : 'No'}</strong></div>
            </div>
          ) : (
            <div style={{ color: '#6b7280' }}>No hay configuración guardada</div>
          )}
        </div>
      </div>

      {/* Controles de demostración */}
      {isConnected && isInitialized && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '20px' }}>🧪 Controles de Demostración</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {/* Demo transacciones */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                Tipo de transacción:
              </label>
              <select
                value={selectedTxType}
                onChange={(e) => setSelectedTxType(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '12px',
                  background: '#374151',
                  border: '1px solid #6b7280',
                  borderRadius: '6px',
                  color: 'white'
                }}
              >
                <option value="transfer">💸 Transfer</option>
                <option value="nft">🎨 NFT</option>
                <option value="defi">🏦 DeFi</option>
                <option value="contract">📄 Contract</option>
                <option value="swap">🔄 Swap</option>
              </select>
              
              <button
                onClick={handleSaveDemo}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#10b981',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                Guardar Transacción Demo
              </button>
            </div>

            {/* Demo configuración */}
            <div>
              <label style={{ display: 'block', marginBottom: '20px', fontSize: '0.9rem' }}>
                Configuración aleatoria:
              </label>
              <button
                onClick={handleConfigDemo}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#8b5cf6',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                Actualizar Config Demo
              </button>
            </div>

            {/* Acciones del sistema */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                Acciones del sistema:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={syncData}
                  style={{
                    padding: '8px',
                    background: '#06b6d4',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  🔄 Sincronizar
                </button>
                <button
                  onClick={exportData}
                  style={{
                    padding: '8px',
                    background: '#f59e0b',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  📁 Exportar
                </button>
              </div>
            </div>

            {/* Zona de peligro */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#ef4444' }}>
                ⚠️ Zona de peligro:
              </label>
              <button
                onClick={() => clearData(true)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                🗑️ Limpiar Mis Datos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de transacciones */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h3>💾 Transacciones Guardadas ({transactions.length})</h3>
          
          {/* Búsqueda */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar transacciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 12px',
                background: '#374151',
                border: '1px solid #6b7280',
                borderRadius: '6px',
                color: 'white',
                minWidth: '200px'
              }}
            />
            
            {/* Filtros rápidos */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                Pending: {getPendingTransactions().length}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#10b981' }}>
                Success: {getSuccessfulTransactions().length}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>
                Failed: {getFailedTransactions().length}
              </span>
            </div>
          </div>
        </div>

        {/* Tabla de transacciones */}
        {filteredTransactions.length > 0 ? (
          <div style={{ 
            overflowX: 'auto',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{ 
                  borderBottom: '2px solid rgba(71, 85, 105, 0.3)',
                  position: 'sticky',
                  top: 0,
                  background: 'rgba(30, 41, 59, 0.9)'
                }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>Tipo</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>Hash</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>Estado</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>Cantidad</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>Red</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.slice(0, 20).map((tx, index) => (
                  <tr 
                    key={tx.id}
                    style={{ 
                      borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
                      backgroundColor: index % 2 === 0 ? 'rgba(71, 85, 105, 0.1)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        fontSize: '0.8rem'
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <code style={{ fontSize: '0.8rem' }}>
                        {tx.hash.slice(0, 10)}...
                      </code>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        color: tx.status === 'success' ? '#10b981' : 
                               tx.status === 'failed' ? '#ef4444' : '#f59e0b'
                      }}>
                        {tx.status === 'success' ? '✅' : 
                         tx.status === 'failed' ? '❌' : '⏳'} {tx.status}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>
                      {tx.amount ? `${tx.amount} ETH` : '-'}
                    </td>
                    <td style={{ padding: '8px' }}>{tx.chainId}</td>
                    <td style={{ padding: '8px', fontSize: '0.8rem' }}>
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280'
          }}>
            {isConnected ? (
              <div>
                <p>No hay transacciones guardadas aún.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                  Conecta tu wallet y usa los controles de demo arriba para probar el sistema.
                </p>
              </div>
            ) : (
              <div>
                <p>Conecta tu wallet para ver las transacciones guardadas.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer con información del sistema */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h4 style={{ color: '#10b981', marginBottom: '12px' }}>
          🎉 Sistema Híbrido Funcionando
        </h4>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          fontSize: '0.9rem'
        }}>
          <div>
            <strong>⛓️ Blockchain:</strong><br />
            Avalanche Fuji (inmutable)
          </div>
          <div>
            <strong>🏪 Browser Storage:</strong><br />
            localStorage + IndexedDB
          </div>
          <div>
            <strong>⚡ PWA Cache:</strong><br />
            Service Worker (offline)
          </div>
          <div>
            <strong>🌐 IPFS:</strong><br />
            Ready for descentralized backup
          </div>
        </div>
        
        <div style={{ 
          marginTop: '16px',
          fontSize: '0.8rem',
          color: '#6ee7b7'
        }}>
          💰 <strong>Costo total: $0</strong> | ⚡ Ultra rápido | 🔒 100% privado | 📱 Offline perfecto
        </div>
      </div>
    </div>
  )
}

export default HybridStorageDemo 