// src/examples/L2TestnetExample.tsx
// 🚀 EJEMPLO: Configuración completa para L2 Testnets

import React, { useState } from 'react'
import { useMultichainTransactions } from '../hooks/useMultichainTransactions'
import { NetworkSelector } from '../components/NetworkSelector'
import { GasSelector } from '../components/GasSelector'
import { L2_TESTNET_CONFIG, getL2Faucets, getL2Type, isL2Chain, L2_INFO } from '../config/testnet-configs'

const L2TestnetExample: React.FC = () => {
  const {
    executeTransaction,
    isLoading,
    isPending,
    error,
    result,
    chainId,
    address,
    isConnected,
    getCurrentNetworkInfo,
    resetState
  } = useMultichainTransactions()

  const [selectedTxType, setSelectedTxType] = useState<'transfer' | 'nft' | 'defi'>('transfer')

  // Información de la red actual
  const networkInfo = getCurrentNetworkInfo()
  const isCurrentL2 = chainId ? isL2Chain(chainId) : false
  const l2Type = chainId ? getL2Type(chainId) : null
  const faucets = chainId ? getL2Faucets(chainId) : []

  // Ejemplos de transacciones optimizadas para L2
  const handleL2Transfer = async () => {
    if (!address || !chainId) return
    
    try {
      await executeTransaction({
        to: address, // Self-send
        value: '0.001', // Cantidad pequeña para testnet
        transactionType: 'transfer',
        gasSpeed: isCurrentL2 ? 'fast' : 'standard', // L2s pueden usar fast sin costo extra
      })
    } catch (error: any) {
      console.error('L2 Transfer failed:', error)
    }
  }

  const handleL2NFTMint = async () => {
    try {
      await executeTransaction({
        to: '0x1234567890123456789012345678901234567890', // Contrato NFT ficticio
        value: '0.01',
        transactionType: 'erc721Mint',
        gasSpeed: 'fast', // L2s permiten gas rápido barato
        data: '0x40c10f19' + // mint(address,uint256)
              address?.slice(2).padStart(64, '0') + // to
              Date.now().toString(16).padStart(64, '0') // tokenId único
      })
    } catch (error: any) {
      console.error('L2 NFT mint failed:', error)
    }
  }

  const handleL2DeFiInteraction = async () => {
    try {
      await executeTransaction({
        to: '0xAbCdEf1234567890123456789012345678901234', // Contrato DeFi ficticio
        value: '0.05',
        transactionType: 'complexContract',
        gasSpeed: 'standard', // DeFi puede ser más conservador
      })
    } catch (error: any) {
      console.error('L2 DeFi interaction failed:', error)
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      color: 'white',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🚀 L2 Testnet MultiChain DApp
      </h1>

      {/* Información principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Selector de Red */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ marginBottom: '16px' }}>🌐 Seleccionar Red</h3>
          <NetworkSelector 
            supportedChainIds={L2_TESTNET_CONFIG.supportedChains}
            showTestnets={true}
            onNetworkChange={(chainId) => {
              console.log('Network changed to:', chainId)
              resetState()
            }}
          />
          
          {/* Información de la red actual */}
          {isConnected && networkInfo && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: isCurrentL2 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${isCurrentL2 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              <div><strong>Red:</strong> {networkInfo.chainName}</div>
              <div><strong>Tipo:</strong> {isCurrentL2 ? l2Type : 'Layer 1'}</div>
              <div><strong>Testnet:</strong> {networkInfo.isTestnet ? '✅' : '❌'}</div>
              {isCurrentL2 && (
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                  💰 Gas ultra-barato en L2!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Configuración de Gas */}
        <div>
          <GasSelector 
            transactionType={selectedTxType === 'transfer' ? 'transfer' : selectedTxType === 'nft' ? 'erc721Mint' : 'complexContract'}
          />
        </div>
      </div>

      {/* Faucets para obtener tokens de testnet */}
      {faucets.length > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '12px' }}>
            💧 Faucets para {networkInfo?.chainName}
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {faucets.map((faucet, index) => (
              <a
                key={index}
                href={faucet.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 16px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '6px',
                  color: '#f59e0b',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}
              >
                {faucet.name} 🔗
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Estado de transacción */}
      {(isLoading || isPending || error || result) && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h3>📊 Estado de Transacción</h3>
          
          {isLoading && (
            <div style={{ color: '#3b82f6' }}>
              🔄 Preparando transacción en {networkInfo?.chainName}...
            </div>
          )}
          
          {isPending && (
            <div style={{ color: '#f59e0b' }}>
              ⏳ Esperando confirmación en MetaMask...
              {isCurrentL2 && (
                <div style={{ fontSize: '0.8rem', marginTop: '4px', color: '#10b981' }}>
                  💡 L2 = confirmación rápida y barata!
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div style={{ color: '#ef4444' }}>
              ❌ Error: {error}
              <button 
                onClick={resetState}
                style={{
                  marginLeft: '12px',
                  padding: '4px 8px',
                  background: '#374151',
                  border: '1px solid #6b7280',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Limpiar
              </button>
            </div>
          )}
          
          {result && (
            <div style={{ color: '#10b981' }}>
              ✅ ¡Transacción exitosa en {networkInfo?.chainName}!
              <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                <div>Hash: <code style={{ fontSize: '0.8rem' }}>{result.hash}</code></div>
                <a 
                  href={result.explorerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'none' }}
                >
                  Ver en Explorer 🔗
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ejemplos de transacciones */}
      {isConnected && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3>🧪 Pruebas de Transacciones L2</h3>
          
          {/* Selector de tipo de transacción */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Seleccionar tipo de transacción:</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['transfer', 'nft', 'defi'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedTxType(type)}
                  style={{
                    padding: '8px 16px',
                    background: selectedTxType === type ? '#3b82f6' : 'rgba(71, 85, 105, 0.3)',
                    border: `1px solid ${selectedTxType === type ? '#3b82f6' : 'rgba(71, 85, 105, 0.5)'}`,
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {type === 'transfer' ? '💸 Transfer' : type === 'nft' ? '🎨 NFT' : '🏦 DeFi'}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {/* Transfer L2 */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#10b981' }}>
                💸 Transfer L2
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 12px 0' }}>
                Envía 0.001 tokens usando gas ultra-barato de L2
              </p>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px' }}>
                <div>Red: <strong>{networkInfo?.chainName}</strong></div>
                <div>Costo estimado: <strong>{isCurrentL2 ? '~$0.001' : '~$0.01'}</strong></div>
                <div>Velocidad: <strong>{isCurrentL2 ? '< 30s' : '1-2 min'}</strong></div>
              </div>
              <button
                onClick={handleL2Transfer}
                disabled={isLoading || isPending}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#10b981',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: isLoading || isPending ? 'not-allowed' : 'pointer',
                  opacity: isLoading || isPending ? 0.6 : 1
                }}
              >
                {isLoading || isPending ? 'Procesando...' : 'Enviar Transfer'}
              </button>
            </div>

            {/* NFT Mint L2 */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#8b5cf6' }}>
                🎨 Mint NFT L2
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 12px 0' }}>
                Mintea un NFT aprovechando las bajas fees de L2
              </p>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px' }}>
                <div>Tipo: <strong>ERC721 Mint</strong></div>
                <div>Gas optimizado: <strong>✅</strong></div>
                <div>L2 advantage: <strong>{isCurrentL2 ? '100x cheaper' : 'Use L2!'}</strong></div>
              </div>
              <button
                onClick={handleL2NFTMint}
                disabled={isLoading || isPending}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#8b5cf6',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: isLoading || isPending ? 'not-allowed' : 'pointer',
                  opacity: isLoading || isPending ? 0.6 : 1
                }}
              >
                {isLoading || isPending ? 'Minteando...' : 'Mint NFT'}
              </button>
            </div>

            {/* DeFi L2 */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>
                🏦 DeFi en L2
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 12px 0' }}>
                Interactúa con protocolos DeFi con costos mínimos
              </p>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px' }}>
                <div>Complejidad: <strong>Alta</strong></div>
                <div>Gas bumped: <strong>✅</strong></div>
                <div>L2 benefit: <strong>{isCurrentL2 ? 'Major savings' : 'Switch to L2!'}</strong></div>
              </div>
              <button
                onClick={handleL2DeFiInteraction}
                disabled={isLoading || isPending}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#f59e0b',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: isLoading || isPending ? 'not-allowed' : 'pointer',
                  opacity: isLoading || isPending ? 0.6 : 1
                }}
              >
                {isLoading || isPending ? 'Ejecutando...' : 'DeFi Interaction'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Información sobre L2s */}
      <div style={{
        marginTop: '30px',
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>🔍 Comparación de L2 Testnets</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {Object.entries(L2_INFO).map(([key, info]) => (
            <div
              key={key}
              style={{
                background: 'rgba(71, 85, 105, 0.2)',
                border: '1px solid rgba(71, 85, 105, 0.3)',
                borderRadius: '8px',
                padding: '16px'
              }}
            >
              <h4 style={{ color: '#3b82f6', marginBottom: '8px' }}>
                {info.name}
              </h4>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                <div><strong>Tipo:</strong> {info.type}</div>
                <div><strong>Gas vs Ethereum:</strong> ~{Math.round(info.gasMultiplier * 100)}% del costo</div>
                <div style={{ marginTop: '8px' }}>
                  <strong>Mejor para:</strong>
                  <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                    {info.bestFor.map((use, index) => (
                      <li key={index}>{use}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default L2TestnetExample 