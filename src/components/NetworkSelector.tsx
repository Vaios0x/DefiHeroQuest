import React, { useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { getNetworkConfig, NETWORK_CONFIGS, NETWORK_COLORS, isTestnet } from '../lib/web3-config'

interface NetworkSelectorProps {
  supportedChainIds?: number[]
  showTestnets?: boolean
  onNetworkChange?: (chainId: number) => void
  compact?: boolean
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  supportedChainIds,
  showTestnets = true,
  onNetworkChange,
  compact = false
}) => {
  const { chainId, isConnected } = useAccount()
  const { switchChainAsync, isPending } = useSwitchChain()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Filtrar redes según configuración
  const availableNetworks = Object.entries(NETWORK_CONFIGS)
    .filter(([chainIdStr, config]) => {
      const id = parseInt(chainIdStr)
      
      // Filtrar por IDs soportados si se especifica
      if (supportedChainIds && !supportedChainIds.includes(id)) return false
      
      // Filtrar testnets si no se permiten
      if (!showTestnets && config.testnet) return false
      
      return true
    })
    .sort(([, a], [, b]) => {
      // Ordenar: mainnets primero, luego testnets
      if (a.testnet !== b.testnet) return a.testnet ? 1 : -1
      return a.chainName.localeCompare(b.chainName)
    })

  const currentNetwork = chainId ? getNetworkConfig(chainId) : null

  const handleNetworkSwitch = async (targetChainId: number) => {
    if (!isConnected) return

    try {
      await switchChainAsync({ chainId: targetChainId })
      onNetworkChange?.(targetChainId)
      setIsDropdownOpen(false)
    } catch (error: any) {
      // Si la red no está añadida, intentar añadirla
      if (error.code === 4902) {
        const networkConfig = getNetworkConfig(targetChainId)
        if (networkConfig) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [networkConfig],
            })
            onNetworkChange?.(targetChainId)
            setIsDropdownOpen(false)
          } catch (addError) {
            console.error('Failed to add network:', addError)
          }
        }
      }
    }
  }

  const getNetworkIcon = (chainIdStr: string) => {
    const icons = {
      // Ethereum
      '1': '⟠',         // Ethereum
      '11155111': '🧪', // Sepolia
      
      // Avalanche
      '43114': '🔺',    // Avalanche
      '43113': '🧪',    // Avalanche Fuji
      
      // Base
      '8453': '🔵',     // Base
      '84532': '🧪',    // Base Sepolia
      
      // Polygon
      '137': '🟣',      // Polygon
      '80001': '🧪',    // Polygon Mumbai
      
      // Arbitrum
      '42161': '🔷',    // Arbitrum One
      '421614': '🧪',   // Arbitrum Sepolia
      
      // Optimism
      '10': '🔴',       // Optimism
      '11155420': '🧪', // Optimism Sepolia
      
      // Scroll
      '534351': '📜',   // Scroll Sepolia
      
      // Linea
      '59141': '📏',    // Linea Sepolia
      
      // Zora
      '999999999': '🎨', // Zora Sepolia
    }
    return icons[chainIdStr as keyof typeof icons] || '🌐'
  }

  if (!isConnected) {
    return (
      <div style={{
        padding: compact ? '8px 12px' : '12px 16px',
        background: 'rgba(107, 114, 128, 0.2)',
        borderRadius: '8px',
        color: '#9ca3af',
        fontSize: compact ? '0.8rem' : '0.9rem'
      }}>
        Not Connected
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Botón principal */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isPending}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: compact ? '8px 12px' : '12px 16px',
          background: currentNetwork 
            ? `linear-gradient(45deg, ${NETWORK_COLORS[chainId?.toString() as keyof typeof NETWORK_COLORS] || '#6b7280'}, rgba(107, 114, 128, 0.2))`
            : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${currentNetwork ? (NETWORK_COLORS[chainId?.toString() as keyof typeof NETWORK_COLORS] || '#6b7280') : '#ef4444'}`,
          borderRadius: '8px',
          color: 'white',
          cursor: isPending ? 'not-allowed' : 'pointer',
          fontSize: compact ? '0.8rem' : '0.9rem',
          fontWeight: 'bold',
          opacity: isPending ? 0.6 : 1
        }}
      >
        {isPending ? (
          <>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Switching...
          </>
        ) : currentNetwork ? (
          <>
            <span>{getNetworkIcon(chainId?.toString() || '')}</span>
            <span>{compact ? currentNetwork.nativeCurrency.symbol : currentNetwork.chainName}</span>
            {isTestnet(chainId || 0) && <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>TESTNET</span>}
          </>
        ) : (
          <>
            <span>⚠️</span>
            <span>Unsupported Network</span>
          </>
        )}
        <span style={{ fontSize: '0.7rem' }}>▼</span>
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <>
          {/* Overlay para cerrar */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 998
            }}
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Lista de redes */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {availableNetworks.map(([chainIdStr, config]) => {
              const id = parseInt(chainIdStr)
              const isActive = chainId === id
              const isTestnetNetwork = config.testnet
              
              return (
                <button
                  key={chainIdStr}
                  onClick={() => handleNetworkSwitch(id)}
                  disabled={isActive}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: isActive 
                      ? `linear-gradient(45deg, ${NETWORK_COLORS[chainIdStr as keyof typeof NETWORK_COLORS] || '#6b7280'}, rgba(107, 114, 128, 0.2))`
                      : 'transparent',
                    border: 'none',
                    color: isActive ? 'white' : '#cbd5e1',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    cursor: isActive ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    borderBottom: '1px solid rgba(71, 85, 105, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(71, 85, 105, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>
                    {getNetworkIcon(chainIdStr)}
                  </span>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {config.chainName}
                      {isTestnetNetwork && (
                        <span style={{ 
                          marginLeft: '8px',
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#f59e0b',
                          borderRadius: '4px'
                        }}>
                          TESTNET
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {config.nativeCurrency.symbol} • Chain ID: {chainIdStr}
                    </div>
                  </div>
                  
                  {isActive && (
                    <span style={{ color: '#10b981' }}>✓</span>
                  )}
                </button>
              )
            })}
            
            {/* Información sobre faucets */}
            {showTestnets && (
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(71, 85, 105, 0.3)',
                background: 'rgba(59, 130, 246, 0.1)'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 'bold' }}>
                  💧 Need testnet tokens?
                </div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Most testnets have faucets for free tokens
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
} 