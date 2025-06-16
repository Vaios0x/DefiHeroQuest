// src/examples/GasConfigExample.tsx
// 🔥 EJEMPLO: Configuración de Gas para Transacciones

import React, { useState } from 'react'
import { useMultichainTransactions } from '../hooks/useMultichainTransactions'
import { NetworkSelector } from '../components/NetworkSelector'
import { GasSelector } from '../components/GasSelector'
import { GasSpeed } from '../lib/gas-config'

const GasConfigExample: React.FC = () => {
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

  const [selectedGasSpeed, setSelectedGasSpeed] = useState<GasSpeed>('standard')
  const [customGasPrice, setCustomGasPrice] = useState('')
  const [customGasLimit, setCustomGasLimit] = useState('')

  // Manejar cambios en la configuración de gas
  const handleGasChange = (gasSpeed: GasSpeed, gasPrice: string, gasLimit: string) => {
    setSelectedGasSpeed(gasSpeed)
    setCustomGasPrice(gasPrice)
    setCustomGasLimit(gasLimit)
  }

  // Ejemplo 1: Transferencia simple con gas personalizado
  const handleSimpleTransfer = async () => {
    if (!address) return
    
    try {
      await executeTransaction({
        to: address, // Self-send
        value: '0.001', // 0.001 ETH/AVAX/etc
        transactionType: 'transfer',
        gasSpeed: selectedGasSpeed,
        // Opcional: usar valores personalizados
        gasPrice: customGasPrice,
        gasLimit: customGasLimit
      })
    } catch (error: any) {
      console.error('Transfer failed:', error)
    }
  }

  // Ejemplo 2: Mint NFT con gas optimizado
  const handleMintNFT = async () => {
    try {
      await executeTransaction({
        to: '0x1234567890123456789012345678901234567890', // Contrato NFT ficticio
        value: '0.01',
        transactionType: 'erc721Mint',
        gasSpeed: selectedGasSpeed,
        data: '0x40c10f19' + // mint(address,uint256)
              address?.slice(2).padStart(64, '0') + // to
              '1'.padStart(64, '0') // tokenId
      })
    } catch (error: any) {
      console.error('NFT mint failed:', error)
    }
  }

  // Ejemplo 3: Interacción compleja con contrato
  const handleComplexContract = async () => {
    try {
      await executeTransaction({
        to: '0xAbCdEf1234567890123456789012345678901234', // Contrato DeFi ficticio
        value: '0.05',
        transactionType: 'complexContract',
        // Para contratos complejos, usar gas speed más rápido
        gasSpeed: selectedGasSpeed === 'slow' ? 'standard' : selectedGasSpeed
      })
    } catch (error: any) {
      console.error('Complex contract call failed:', error)
    }
  }

  const networkInfo = getCurrentNetworkInfo()

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '900px', 
      margin: '0 auto',
      color: 'white'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🔥 Configuración de Gas Inteligente
      </h1>

      {/* Estado de conexión */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Red actual */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <h3>🌐 Red Actual</h3>
          <NetworkSelector 
            supportedChainIds={[1, 43114, 43113, 8453, 137]}
            showTestnets={true}
          />
          
          {isConnected && networkInfo && (
            <div style={{ marginTop: '12px', fontSize: '0.9rem' }}>
              <div>Chain ID: <strong>{chainId}</strong></div>
              <div>Network: <strong>{networkInfo.chainName}</strong></div>
              <div>Is Testnet: <strong>{networkInfo.isTestnet ? '🧪 Yes' : '🚀 No'}</strong></div>
            </div>
          )}
        </div>

        {/* Configuración de Gas */}
        <div>
          <GasSelector 
            transactionType="contractCall"
            onGasChange={handleGasChange}
          />
        </div>
      </div>

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
              🔄 Preparando transacción con gas {selectedGasSpeed}...
            </div>
          )}
          
          {isPending && (
            <div style={{ color: '#f59e0b' }}>
              ⏳ Esperando confirmación del usuario...
              <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                Gas Price: {customGasPrice} gwei | Gas Limit: {customGasLimit}
              </div>
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
              ✅ Transacción exitosa!
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
          <h3>🚀 Ejemplos de Transacciones con Gas Optimizado</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginTop: '16px'
          }}>
            {/* Transferencia Simple */}
            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#10b981' }}>
                💸 Transferencia Simple
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 12px 0' }}>
                Envía 0.001 tokens a tu propia wallet usando configuración de gas actual
              </p>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px' }}>
                <div>Tipo: <strong>Transfer</strong></div>
                <div>Gas: <strong>{selectedGasSpeed}</strong></div>
                <div>Precio: <strong>{customGasPrice} gwei</strong></div>
              </div>
              <button
                onClick={handleSimpleTransfer}
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

            {/* Mint NFT */}
            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>
                🎨 Mint NFT
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 12px 0' }}>
                Mint un NFT usando gas optimizado para este tipo de transacción
              </p>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px' }}>
                <div>Tipo: <strong>ERC721 Mint</strong></div>
                <div>Gas: <strong>{selectedGasSpeed}</strong></div>
                <div>Optimizado: <strong>✅</strong></div>
              </div>
              <button
                onClick={handleMintNFT}
                disabled={isLoading || isPending}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#3b82f6',
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

            {/* Contrato Complejo */}
            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>
                🏗️ Contrato Complejo
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 12px 0' }}>
                Interactúa con contrato DeFi usando gas extra para evitar fallos
              </p>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px' }}>
                <div>Tipo: <strong>Complex Contract</strong></div>
                <div>Gas: <strong>Auto-bumped</strong></div>
                <div>Seguridad: <strong>🛡️ Alta</strong></div>
              </div>
              <button
                onClick={handleComplexContract}
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
                {isLoading || isPending ? 'Ejecutando...' : 'Ejecutar Contrato'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Información sobre gas */}
      <div style={{
        marginTop: '20px',
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <h3 style={{ color: '#10b981' }}>💡 Ventajas de la Configuración Inteligente de Gas</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>🎯 Estimación Automática</div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Gas limits optimizados por tipo de transacción
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>⚡ Velocidad Inteligente</div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Precios por red actualizados y recomendaciones
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>💰 Control de Costos</div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Estimaciones de costo en USD y validación de límites
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>🔄 Multichain</div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Configuraciones específicas para cada red
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GasConfigExample 