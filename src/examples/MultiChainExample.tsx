// src/examples/MultiChainExample.tsx
// 🎯 EJEMPLO: Cómo usar la configuración multichain

import React from 'react'
import { useMultichainTransactions } from '../hooks/useMultichainTransactions'
import { NetworkSelector } from '../components/NetworkSelector'
import { createWeb3Config, ProjectConfig } from '../lib/web3-config'

// 1️⃣ CONFIGURACIÓN DEL PROYECTO
const projectConfig: ProjectConfig = {
  appName: 'Mi DApp Multichain',
  projectId: 'mi-proyecto-id',
  supportedChains: [
    1,     // Ethereum Mainnet
    43114, // Avalanche Mainnet
    8453,  // Base Mainnet
    137,   // Polygon Mainnet
    // Testnets
    11155111, // Sepolia
    43113,    // Avalanche Fuji
    84532,    // Base Sepolia
    80001     // Polygon Mumbai
  ],
  defaultChain: 43113, // Avalanche Fuji para desarrollo
  testnetMode: true    // Permitir testnets
}

// 2️⃣ CREAR CONFIGURACIÓN DE WAGMI
export const web3Config = createWeb3Config(projectConfig)

// 3️⃣ COMPONENTE PRINCIPAL
const MultiChainDApp: React.FC = () => {
  const {
    // Estado
    isLoading,
    isPending,
    isConfirming,
    error,
    result,
    chainId,
    address,
    isConnected,
    
    // Funciones
    executeTransaction,
    switchToChain,
    resetState,
    getCurrentNetworkInfo
  } = useMultichainTransactions()

  // 🚀 Ejemplos de uso
  
  // Mint NFT en cualquier red
  const handleMintNFT = async (targetChainId: number) => {
    try {
      const result = await executeTransaction({
        to: '0x1234567890123456789012345678901234567890', // Contrato NFT
        value: '0.01', // 0.01 ETH/AVAX/MATIC
        targetChainId,
        data: '0x40c10f19' + // mint(address,uint256)
              address?.slice(2).padStart(64, '0') + // to
              '1'.padStart(64, '0') // tokenId
      })
      
      alert(`🎉 NFT minteado exitosamente!\nHash: ${result.hash}\nExplorer: ${result.explorerUrl}`)
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`)
    }
  }

  // Staking en protocolo específico
  const handleStaking = async (amount: string, targetChainId: number) => {
    try {
      await executeTransaction({
        to: '0xAbCdEf1234567890123456789012345678901234', // Contrato staking
        value: amount,
        targetChainId,
      })
      
      alert(`🏆 Staking exitoso!\nAmount: ${amount} tokens\nNetwork: ${getCurrentNetworkInfo()?.chainName}`)
    } catch (error: any) {
      alert(`❌ Staking failed: ${error.message}`)
    }
  }

  // Bridge cross-chain
  const handleBridge = async (fromChain: number, toChain: number, amount: string) => {
    try {
      // Paso 1: Ejecutar transacción en chain origen
      const bridgeResult = await executeTransaction({
        to: '0xBridgeContract123456789012345678901234567890',
        value: amount,
        targetChainId: fromChain,
        data: `0x12345678${toChain.toString(16).padStart(64, '0')}` // bridge(targetChain)
      })
      
      alert(`🌉 Bridge iniciado!\nFrom: Chain ${fromChain}\nTo: Chain ${toChain}\nHash: ${bridgeResult.hash}`)
      
      // Paso 2: Cambiar a chain destino para monitorear
      await switchToChain(toChain)
      
    } catch (error: any) {
      alert(`❌ Bridge failed: ${error.message}`)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🌐 MultiChain DApp Example</h1>
      
      {/* Selector de Red */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Current Network:</h3>
        <NetworkSelector 
          supportedChainIds={projectConfig.supportedChains}
          showTestnets={projectConfig.testnetMode}
          onNetworkChange={(chainId) => {
            console.log('Network changed to:', chainId)
            resetState() // Limpiar estado de transacciones previas
          }}
        />
      </div>

      {/* Estado de conexión */}
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderRadius: '8px'
      }}>
        <h3>Wallet Status:</h3>
        <p>Connected: {isConnected ? '✅' : '❌'}</p>
        {isConnected && (
          <>
            <p>Address: {address}</p>
            <p>Chain: {getCurrentNetworkInfo()?.chainName} ({chainId})</p>
            <p>Is Testnet: {getCurrentNetworkInfo()?.isTestnet ? '🧪' : '🚀'}</p>
          </>
        )}
      </div>

      {/* Estado de transacción */}
      {(isLoading || isPending || isConfirming || error || result) && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px'
        }}>
          <h3>Transaction Status:</h3>
          
          {isLoading && <p>🔄 Preparing transaction...</p>}
          {isPending && <p>⏳ Waiting for user confirmation...</p>}
          {isConfirming && <p>⏳ Confirming on blockchain...</p>}
          
          {error && (
            <div style={{ color: '#ef4444' }}>
              <p>❌ Error: {error}</p>
              <button onClick={resetState} style={{ marginTop: '8px' }}>
                Clear Error
              </button>
            </div>
          )}
          
          {result && (
            <div style={{ color: '#10b981' }}>
              <p>✅ Transaction Successful!</p>
              <p>Hash: {result.hash}</p>
              <p>
                <a href={result.explorerUrl} target="_blank" rel="noopener noreferrer">
                  View on Explorer 🔗
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Acciones disponibles */}
      {isConnected && (
        <div style={{ display: 'grid', gap: '15px' }}>
          <h3>Available Actions:</h3>
          
          {/* NFT Minting */}
          <div style={{ padding: '15px', background: 'rgba(71, 85, 105, 0.2)', borderRadius: '8px' }}>
            <h4>🎨 Mint NFT</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[1, 43114, 8453, 137].map(targetChain => (
                <button
                  key={targetChain}
                  onClick={() => handleMintNFT(targetChain)}
                  disabled={isLoading || isPending}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: chainId === targetChain ? '#10b981' : '#6b7280',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Chain {targetChain}
                </button>
              ))}
            </div>
          </div>

          {/* Staking */}
          <div style={{ padding: '15px', background: 'rgba(71, 85, 105, 0.2)', borderRadius: '8px' }}>
            <h4>🏆 Stake Tokens</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="number" 
                placeholder="Amount (ETH/AVAX/MATIC)"
                step="0.001"
                min="0"
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const amount = (e.target as HTMLInputElement).value
                    if (amount && chainId) {
                      handleStaking(amount, chainId)
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[type="number"]') as HTMLInputElement
                  const amount = input?.value
                  if (amount && chainId) {
                    handleStaking(amount, chainId)
                  }
                }}
                disabled={isLoading || isPending}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#a855f7',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Stake on Current Chain
              </button>
            </div>
          </div>

          {/* Cross-chain Bridge */}
          <div style={{ padding: '15px', background: 'rgba(71, 85, 105, 0.2)', borderRadius: '8px' }}>
            <h4>🌉 Cross-Chain Bridge</h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '10px' }}>
              Bridge 0.01 tokens from Avalanche (43114) to Base (8453)
            </p>
            <button
              onClick={() => handleBridge(43114, 8453, '0.01')}
              disabled={isLoading || isPending}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(45deg, #e84142, #0052ff)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Bridge AVAX → Base
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiChainDApp 