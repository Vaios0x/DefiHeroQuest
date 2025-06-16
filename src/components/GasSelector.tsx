import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useMultichainTransactions } from '../hooks/useMultichainTransactions'
import { TransactionType, GasSpeed, GAS_UI_CONFIG } from '../lib/gas-config'

interface GasSelectorProps {
  transactionType?: TransactionType
  onGasChange?: (gasSpeed: GasSpeed, gasPrice: string, gasLimit: string) => void
  compact?: boolean
}

export const GasSelector: React.FC<GasSelectorProps> = ({
  transactionType = 'contractCall',
  onGasChange,
  compact = false
}) => {
  const { chainId } = useAccount()
  const { getGasRecommendations, getGasEstimate } = useMultichainTransactions()
  
  const [selectedSpeed, setSelectedSpeed] = useState<GasSpeed>('standard')

  const recommendations = getGasRecommendations()
  const gasEstimate = getGasEstimate(transactionType, selectedSpeed)

  if (!chainId || !recommendations) {
    return (
      <div style={{
        padding: '12px',
        background: 'rgba(107, 114, 128, 0.2)',
        borderRadius: '8px',
        color: '#9ca3af'
      }}>
        Gas configuration not available
      </div>
    )
  }

  const handleSpeedChange = (speed: GasSpeed) => {
    setSelectedSpeed(speed)
    if (gasEstimate && onGasChange) {
      onGasChange(speed, gasEstimate.gasPrice, gasEstimate.gasLimit)
    }
  }

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(71, 85, 105, 0.3)',
      borderRadius: '12px',
      padding: compact ? '12px' : '16px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: 'white' }}>⛽ Gas Settings</h4>

      {gasEstimate && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '12px',
          fontSize: '0.8rem',
          color: '#cbd5e1'
        }}>
          <div>Network: <strong>{recommendations.network}</strong></div>
          <div>Cost: <strong>{gasEstimate.estimatedCostUSD}</strong></div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '8px' }}>
        {recommendations.recommendations.map((rec) => {
          const isSelected = selectedSpeed === rec.speed
          const color = GAS_UI_CONFIG.colors[rec.speed]
          const icon = GAS_UI_CONFIG.icons[rec.speed]
          
          return (
            <button
              key={rec.speed}
              onClick={() => handleSpeedChange(rec.speed)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: isSelected ? `${color}20` : 'rgba(71, 85, 105, 0.2)',
                border: `1px solid ${isSelected ? color : 'rgba(71, 85, 105, 0.3)'}`,
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{icon}</span>
                <div>
                  <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                    {rec.speed}
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    {rec.description}
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color }}>
                  {rec.gasPrice} gwei
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {rec.timeEstimate}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
} 