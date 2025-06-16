import React, { useState } from 'react';

const SherryActions: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState('mint');

  const sherryActions = [
    {
      id: 'mint',
      title: '👑 Mint DeFi Hero NFT',
      description: 'Create your unique hero that evolves with your DeFi activities',
      parameters: [
        { name: 'to', label: 'Wallet Address', type: 'address', required: true },
        { name: 'heroClass', label: 'Hero Class', type: 'select', options: ['Knight', 'Wizard', 'Ranger', 'Guardian'], required: false },
        { name: 'username', label: 'Hero Name', type: 'text', required: true }
      ],
      cost: '0.1 AVAX',
      rewards: '500 EXP + Starting Stats'
    },
    {
      id: 'stake',
      title: '🏦 AVAX Staking Quest',
      description: 'Stake AVAX tokens to earn rewards and boost your hero\'s defense',
      parameters: [
        { name: 'amount', label: 'AVAX Amount', type: 'select', options: ['25 AVAX', '50 AVAX', '100 AVAX'], required: true },
        { name: 'duration', label: 'Staking Duration', type: 'select', options: ['30 days', '90 days', '365 days'], required: true }
      ],
      cost: 'Variable AVAX',
      rewards: 'Up to 250 EXP + Defense Boost'
    },
    {
      id: 'liquidity',
      title: '💧 Liquidity Provider Quest',
      description: 'Provide liquidity to AVAX/USDC pool and earn trading fees',
      parameters: [
        { name: 'tokenA', label: 'First Token', type: 'select', options: ['AVAX', 'USDC'], required: true },
        { name: 'tokenB', label: 'Second Token', type: 'select', options: ['USDC', 'USDT'], required: true },
        { name: 'amountA', label: 'First Token Amount', type: 'number', required: true },
        { name: 'amountB', label: 'Second Token Amount', type: 'number', required: true }
      ],
      cost: 'Equal token values',
      rewards: '200 EXP + Magic Boost'
    }
  ];

  const selectedActionData = sherryActions.find(action => action.id === selectedAction)!;

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#f59e0b', margin: '0 0 20px 0' }}>
        🔗 Sherry-Powered Actions
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '30px', margin: '0 0 30px 0' }}>
        Experience the power of Sherry SDK! These blockchain actions are powered by Sherry's 
        social interaction framework, enabling seamless Web3 experiences.
      </p>

      {/* Action Selector */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold' }}>
          Choose Sherry Action:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {sherryActions.map((action) => (
            <div
              key={action.id}
              onClick={() => setSelectedAction(action.id)}
              style={{
                padding: '20px',
                borderRadius: '15px',
                border: selectedAction === action.id 
                  ? '2px solid #f59e0b' 
                  : '1px solid rgba(71, 85, 105, 0.3)',
                background: selectedAction === action.id 
                  ? 'rgba(245, 158, 11, 0.2)' 
                  : 'rgba(71, 85, 105, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedAction === action.id ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{action.title}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>{action.description}</p>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#10b981',
                fontWeight: 'bold'
              }}>
                Cost: {action.cost}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Action Details */}
      <div style={{
        background: 'rgba(71, 85, 105, 0.2)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#f59e0b' }}>
          {selectedActionData.title}
        </h3>
        <p style={{ margin: '0 0 20px 0', color: '#cbd5e1' }}>
          {selectedActionData.description}
        </p>

        {/* Parameters */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#cbd5e1' }}>Action Parameters:</h4>
          <div style={{ display: 'grid', gap: '15px' }}>
            {selectedActionData.parameters.map((param, index) => (
              <div key={index}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  {param.label} {param.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                {param.type === 'select' ? (
                  <select style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}>
                    <option value="">Select {param.label}</option>
                    {param.options?.map((option, optIndex) => (
                      <option key={optIndex} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={param.type}
                    placeholder={`Enter ${param.label}`}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      background: 'rgba(15, 23, 42, 0.8)',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rewards */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px',
          padding: '15px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>Expected Rewards:</h4>
          <p style={{ margin: '0', color: '#cbd5e1' }}>{selectedActionData.rewards}</p>
        </div>
      </div>

      {/* Sherry SDK Features */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🚀 Powered by Sherry SDK</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔗</div>
            <div style={{ fontWeight: 'bold', color: '#a855f7' }}>Blockchain Actions</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Direct smart contract calls</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🎯</div>
            <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>Parameter Validation</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Type-safe interactions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>⚡</div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>Real-time Updates</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Live transaction status</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🛡️</div>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>Secure by Design</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Built-in safety checks</div>
          </div>
        </div>
      </div>

      <button
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: '15px',
          border: 'none',
          background: 'linear-gradient(45deg, #f59e0b, #d97706)',
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        🔗 Execute Sherry Action: {selectedActionData.title}
      </button>

      <div style={{ 
        marginTop: '15px', 
        padding: '15px', 
        background: 'rgba(245, 158, 11, 0.1)', 
        borderRadius: '10px',
        border: '1px solid rgba(245, 158, 11, 0.2)'
      }}>
        <p style={{ margin: '0', fontSize: '0.9rem', color: '#cbd5e1', textAlign: 'center' }}>
          🏆 <strong>Sherry Minithon 2025 Entry:</strong> This demonstrates the power of Sherry SDK 
          for creating seamless Web3 social experiences with blockchain interactions!
        </p>
      </div>
    </div>
  );
};

export default SherryActions;