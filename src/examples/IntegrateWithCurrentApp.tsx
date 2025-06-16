// src/examples/IntegrateWithCurrentApp.tsx
// 🔗 Cómo Integrar el Sistema Híbrido con tu App YIELD Actual

import React, { useEffect, useState } from 'react'
import { useAccount, useChainId, useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { useHybridStorage, useTransactionStorage, useUserPreferences } from '../hooks/useHybridStorage'

// Ejemplo de integración con tu componente actual
const EnhancedYieldApp: React.FC = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  // 🚀 Sistema híbrido integrado
  const { isInitialized, error } = useHybridStorage()
  const { saveTransaction, transactions, getRecentTransactions } = useTransactionStorage()
  const { config, updateConfig } = useUserPreferences()
  
  // Tu lógica actual de transacciones
  const { sendTransaction, data: txHash, isPending: isSending } = useSendTransaction()
  
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  // 🔄 Auto-guardar transacciones cuando se completan
  useEffect(() => {
    if (txHash && address && chainId) {
      // Guardar automáticamente en el sistema híbrido
      saveTransaction({
        hash: txHash,
        type: 'transfer',
        status: 'pending', // Se actualizará cuando se confirme
        amount: amount,
        explorerUrl: `https://testnet.snowtrace.io/tx/${txHash}`,
        metadata: {
          recipient,
          timestamp: Date.now(),
          userInitiated: true
        }
      })
    }
  }, [txHash, address, chainId, amount, recipient])

  // 🎨 Cargar configuración del usuario al conectar
  useEffect(() => {
    if (isInitialized && address && config) {
      // Aplicar configuraciones guardadas
      console.log('Aplicando configuración guardada:', config)
      
      // Ejemplo: aplicar tema guardado
      if (config.theme) {
        document.documentElement.setAttribute('data-theme', config.theme)
      }
      
      // Ejemplo: usar gas speed preferido en futuras transacciones
      if (config.preferredGasSpeed) {
        console.log(`Usando gas speed preferido: ${config.preferredGasSpeed}`)
      }
    }
  }, [isInitialized, address, config])

  // 📱 Función de envío mejorada con storage híbrido
  const handleSend = async () => {
    if (!recipient || !amount || !address) return

    try {
      // 1. Enviar transacción normal
      await sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount)
      })

      // 2. El useEffect de arriba guardará automáticamente la transacción
      
      // 3. Actualizar configuraciones basadas en el uso
      await updateConfig({
        // Actualizar uso reciente
        analytics: true
      })

      console.log('✅ Transacción enviada y guardada en sistema híbrido')
      
    } catch (error: any) {
      console.error('❌ Error en transacción:', error)
      
      // Guardar error para analytics
      await saveTransaction({
        hash: '0x0', // Hash placeholder para errores
        type: 'transfer',
        status: 'failed',
        amount: amount,
        explorerUrl: '',
        metadata: {
          error: error.message,
          recipient,
          timestamp: Date.now()
        }
      })
    }
  }

  // 🎨 Configuraciones rápidas
  const quickConfigs = [
    {
      name: 'Modo Rápido',
      icon: '⚡',
      config: { preferredGasSpeed: 'fast' as const, slippageTolerance: 0.5 }
    },
    {
      name: 'Modo Económico', 
      icon: '💰',
      config: { preferredGasSpeed: 'slow' as const, slippageTolerance: 2 }
    },
    {
      name: 'Tema Oscuro',
      icon: '🌙',
      config: { theme: 'dark' as const }
    },
    {
      name: 'Tema Claro',
      icon: '☀️',
      config: { theme: 'light' as const }
    }
  ]

  if (!isInitialized) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
          <h2>Inicializando Sistema Híbrido...</h2>
          <p>Preparando storage descentralizado para tu dApp</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h2>❌ Error en Sistema Híbrido</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      minHeight: '100vh'
    }}>
      {/* Header con información del sistema */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          margin: '0 0 8px 0',
          background: 'linear-gradient(45deg, #06b6d4, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          YIELD DApp con Sistema Híbrido 🚀
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6ee7b7' }}>
          ⛓️ Blockchain + 🏪 Local Storage + ⚡ PWA + 🌐 IPFS Ready
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {/* Panel de envío de transacciones */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💸 Enviar Transacción
          </h3>

          {isConnected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                  Destinatario:
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#374151',
                    border: '1px solid #6b7280',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                  Cantidad (ETH):
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.1"
                  step="0.001"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#374151',
                    border: '1px solid #6b7280',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={isSending || !recipient || !amount}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: isSending ? '#6b7280' : '#10b981',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: isSending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isSending ? '⏳ Enviando...' : '🚀 Enviar con Auto-Save'}
              </button>

              {config?.preferredGasSpeed && (
                <div style={{
                  fontSize: '0.8rem',
                  color: '#9ca3af',
                  textAlign: 'center',
                  padding: '8px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '4px'
                }}>
                  Gas configurado: <strong>{config.preferredGasSpeed}</strong>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <p>Conecta tu wallet para enviar transacciones</p>
            </div>
          )}
        </div>

        {/* Panel de configuraciones rápidas */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚙️ Configuraciones Rápidas
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {quickConfigs.map((item, index) => (
              <button
                key={index}
                onClick={() => updateConfig(item.config)}
                style={{
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Configuración actual */}
          {config && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '6px',
              fontSize: '0.8rem'
            }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>Configuración Actual:</strong>
              </div>
              <div>Tema: {config.theme || 'auto'}</div>
              <div>Gas: {config.preferredGasSpeed || 'standard'}</div>
              <div>Slippage: {config.slippageTolerance || 1}%</div>
            </div>
          )}
        </div>

        {/* Panel de historial de transacciones */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          gridColumn: 'span 2'
        }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📋 Historial Reciente ({transactions.length} total)
          </h3>

          {transactions.length > 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {getRecentTransactions(5).map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    padding: '16px',
                    background: 'rgba(71, 85, 105, 0.2)',
                    borderRadius: '8px',
                    border: '1px solid rgba(71, 85, 105, 0.3)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '4px 8px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        {tx.type}
                      </span>
                      <span style={{
                        color: tx.status === 'success' ? '#10b981' : 
                               tx.status === 'failed' ? '#ef4444' : '#f59e0b'
                      }}>
                        {tx.status === 'success' ? '✅' : 
                         tx.status === 'failed' ? '❌' : '⏳'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem' }}>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Hash:</strong> 
                      <code style={{ marginLeft: '8px', fontSize: '0.8rem' }}>
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                      </code>
                    </div>
                    {tx.amount && (
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Cantidad:</strong> {tx.amount} ETH
                      </div>
                    )}
                    <div>
                      <strong>Red:</strong> {tx.chainId}
                    </div>
                  </div>

                  {tx.explorerUrl && (
                    <button
                      onClick={() => window.open(tx.explorerUrl, '_blank')}
                      style={{
                        marginTop: '8px',
                        padding: '4px 8px',
                        background: '#374151',
                        border: '1px solid #6b7280',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      🔗 Ver en Explorer
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
              <p>No hay transacciones guardadas aún.</p>
              <p style={{ fontSize: '0.9rem' }}>
                Las transacciones se guardarán automáticamente cuando las realices.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer informativo */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
          🎉 <strong>Sistema Híbrido Activo</strong>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#c4b5fd' }}>
          Todas las transacciones se guardan automáticamente en tu dispositivo de forma privada y segura.
          <br />
          💰 $0 costo | ⚡ Ultra rápido | 🔒 100% privado | 📱 Funciona offline
        </div>
      </div>
    </div>
  )
}

export default EnhancedYieldApp

// 🔧 INSTRUCCIONES DE INTEGRACIÓN:
/*
1. Importa este componente en tu App.tsx principal
2. Reemplaza o modifica tu componente actual de envío de transacciones
3. El sistema híbrido se inicializa automáticamente
4. Las transacciones se guardan automáticamente cuando se envían
5. Las configuraciones persisten entre sesiones
6. Funciona offline con datos cacheados

EJEMPLO DE INTEGRACIÓN EN APP.TSX:

import EnhancedYieldApp from './examples/IntegrateWithCurrentApp'

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        <EnhancedYieldApp />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

¡Tu app YIELD ahora tiene storage híbrido de nueva generación! 🚀
*/ 