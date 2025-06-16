import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'stake' | 'liquidity' | 'swap' | 'mint' | 'claim';
  amount: number;
  asset: string;
  txHash: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
  gasPrice?: number;
  rewards?: {
    exp: number;
    coins: number;
    apy?: number;
    heroStats?: any;
  };
  profit?: number;
  currentValue?: number;
  initialValue?: number;
}

interface Benefit {
  id: string;
  type: 'staking_rewards' | 'liquidity_fees' | 'trading_profit' | 'quest_rewards';
  amount: number;
  asset: string;
  source: string;
  timestamp: string;
  apy?: number;
  duration?: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [activeTab, setActiveTab] = useState<'transactions' | 'benefits' | 'analytics'>('transactions');
  const [filter, setFilter] = useState<'all' | 'stake' | 'liquidity' | 'swap' | 'mint'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | '24h' | '7d' | '30d'>('all');

  useEffect(() => {
    loadTransactionHistory();
    loadBenefits();
    
    // Listen for new transactions from localStorage
    const interval = setInterval(() => {
      loadTransactionHistory();
      loadBenefits();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadTransactionHistory = () => {
    // Load from localStorage and generate some demo data
    const savedTransactions = localStorage.getItem('transactionHistory');
    let txHistory: Transaction[] = [];

    if (savedTransactions) {
      txHistory = JSON.parse(savedTransactions);
    }

    // Add some demo transactions if none exist
    if (txHistory.length === 0) {
      txHistory = generateDemoTransactions();
      localStorage.setItem('transactionHistory', JSON.stringify(txHistory));
    }

    setTransactions(txHistory);
  };

  const loadBenefits = () => {
    // Calculate benefits from transactions
    const calculatedBenefits = calculateBenefitsFromTransactions();
    setBenefits(calculatedBenefits);
  };

  const generateDemoTransactions = (): Transaction[] => {
    const now = new Date();
    return [
      {
        id: 'tx-001',
        type: 'stake',
        amount: 25,
        asset: 'AVAX',
        txHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        gasUsed: 21000,
        gasPrice: 25,
        rewards: {
          exp: 150,
          coins: 500,
          apy: 8.5,
          heroStats: { defense: 2 }
        },
        profit: 2.1,
        currentValue: 27.1,
        initialValue: 25
      },
      {
        id: 'tx-002',
        type: 'liquidity',
        amount: 1000,
        asset: 'USDC',
        txHash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
        timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        gasUsed: 85000,
        gasPrice: 28,
        rewards: {
          exp: 200,
          coins: 750,
          apy: 15.3,
          heroStats: { magic: 3 }
        },
        profit: 45.8,
        currentValue: 1045.8,
        initialValue: 1000
      },
      {
        id: 'tx-003',
        type: 'swap',
        amount: 5,
        asset: 'AVAX',
        txHash: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        gasUsed: 45000,
        gasPrice: 22,
        rewards: {
          exp: 50,
          coins: 100,
          heroStats: { attack: 1 }
        },
        profit: 12.5,
        currentValue: 187.5,
        initialValue: 175
      }
    ];
  };

  const calculateBenefitsFromTransactions = (): Benefit[] => {
    const now = new Date();
    return [
      {
        id: 'benefit-001',
        type: 'staking_rewards',
        amount: 2.1,
        asset: 'AVAX',
        source: 'Avalanche Staking',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        apy: 8.5,
        duration: '2 days'
      },
      {
        id: 'benefit-002',
        type: 'liquidity_fees',
        amount: 45.8,
        asset: 'USDC',
        source: 'Trader Joe LP',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        apy: 15.3,
        duration: '1 day'
      },
      {
        id: 'benefit-003',
        type: 'trading_profit',
        amount: 12.5,
        asset: 'USDC',
        source: 'Token Swap',
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'benefit-004',
        type: 'quest_rewards',
        amount: 1350,
        asset: 'EXP',
        source: 'DeFi Quests',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter !== 'all' && tx.type !== filter) return false;
    
    if (timeFilter !== 'all') {
      const txDate = new Date(tx.timestamp);
      const now = new Date();
      const diffHours = (now.getTime() - txDate.getTime()) / (1000 * 60 * 60);
      
      switch (timeFilter) {
        case '24h': return diffHours <= 24;
        case '7d': return diffHours <= 24 * 7;
        case '30d': return diffHours <= 24 * 30;
      }
    }
    
    return true;
  });

  const totalProfit = transactions.reduce((sum, tx) => sum + (tx.profit || 0), 0);
  const totalInvested = transactions.reduce((sum, tx) => sum + (tx.initialValue || tx.amount), 0);
  const totalCurrentValue = transactions.reduce((sum, tx) => sum + (tx.currentValue || tx.amount), 0);
  const totalROI = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stake': return '🏦';
      case 'liquidity': return '💧';
      case 'swap': return '🔄';
      case 'mint': return '🎨';
      case 'claim': return '💰';
      default: return '📊';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stake': return '#3b82f6';
      case 'liquidity': return '#10b981';
      case 'swap': return '#a855f7';
      case 'mint': return '#f59e0b';
      case 'claim': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getBenefitIcon = (type: string) => {
    switch (type) {
      case 'staking_rewards': return '🏦';
      case 'liquidity_fees': return '💧';
      case 'trading_profit': return '📈';
      case 'quest_rewards': return '🎯';
      default: return '💰';
    }
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#a855f7', margin: '0 0 20px 0' }}>
        📊 Historial de Transacciones y Beneficios
      </h2>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981' }}>
            ${totalProfit.toFixed(2)}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Ganancias Totales</div>
        </div>

        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b82f6' }}>
            ${totalCurrentValue.toFixed(2)}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Valor Actual</div>
        </div>

        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {totalROI.toFixed(1)}%
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>ROI Total</div>
        </div>

        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#a855f7' }}>
            {transactions.length}
          </div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Transacciones</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '25px',
        background: 'rgba(71, 85, 105, 0.3)',
        padding: '10px',
        borderRadius: '15px'
      }}>
        {[
          { id: 'transactions', label: '📜 Transacciones' },
          { id: 'benefits', label: '💰 Beneficios' },
          { id: 'analytics', label: '📈 Análisis' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: activeTab === tab.id 
                ? 'linear-gradient(45deg, #8b5cf6, #3b82f6)' 
                : 'rgba(71, 85, 105, 0.3)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {activeTab === 'transactions' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#cbd5e1' }}>
              Tipo de Transacción:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                background: 'rgba(15, 23, 42, 0.8)',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">Todas</option>
              <option value="stake">Staking</option>
              <option value="liquidity">Liquidez</option>
              <option value="swap">Intercambios</option>
              <option value="mint">Mint NFT</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#cbd5e1' }}>
              Período:
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                background: 'rgba(15, 23, 42, 0.8)',
                color: 'white',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">Todo el tiempo</option>
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
            </select>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div style={{ display: 'grid', gap: '15px' }}>
          {filteredTransactions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              background: 'rgba(71, 85, 105, 0.2)',
              borderRadius: '15px',
              border: '1px solid rgba(71, 85, 105, 0.3)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📊</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>No hay transacciones</h3>
              <p style={{ margin: '0', color: '#94a3b8' }}>
                Realiza tu primera transacción en el Live Demo para ver el historial aquí.
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  background: 'rgba(71, 85, 105, 0.2)',
                  border: `1px solid ${getTypeColor(tx.type)}40`,
                  borderRadius: '15px',
                  padding: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ fontSize: '2rem' }}>{getTypeIcon(tx.type)}</div>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: getTypeColor(tx.type), textTransform: 'capitalize' }}>
                        {tx.type} {tx.amount} {tx.asset}
                      </h3>
                      <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    background: tx.status === 'confirmed' 
                      ? 'rgba(16, 185, 129, 0.2)' 
                      : tx.status === 'failed'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(245, 158, 11, 0.2)',
                    color: tx.status === 'confirmed' 
                      ? '#10b981' 
                      : tx.status === 'failed'
                      ? '#ef4444'
                      : '#f59e0b'
                  }}>
                    {tx.status === 'confirmed' ? '✅ Confirmada' : 
                     tx.status === 'failed' ? '❌ Fallida' : '⏳ Pendiente'}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  {tx.profit && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                        +${tx.profit.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Ganancia</div>
                    </div>
                  )}
                  
                  {tx.rewards && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#a855f7' }}>
                        +{tx.rewards.exp} EXP
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Experiencia</div>
                    </div>
                  )}
                  
                  {tx.rewards?.apy && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                        {tx.rewards.apy}%
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>APY</div>
                    </div>
                  )}
                </div>

                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  fontFamily: 'monospace'
                }}>
                  <a 
                    href={`https://testnet.snowtrace.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3b82f6', textDecoration: 'underline' }}
                  >
                    {tx.txHash.substring(0, 20)}...
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div style={{ display: 'grid', gap: '15px' }}>
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              style={{
                background: 'rgba(71, 85, 105, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '15px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '2rem' }}>{getBenefitIcon(benefit.type)}</div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#10b981' }}>
                    +{benefit.amount} {benefit.asset}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                    {benefit.source}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(benefit.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                {benefit.apy && (
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {benefit.apy}% APY
                  </div>
                )}
                {benefit.duration && (
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                    {benefit.duration}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gap: '25px' }}>
          <div style={{
            background: 'rgba(71, 85, 105, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '15px',
            padding: '25px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>📊 Análisis de Rendimiento</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                  {((totalProfit / totalInvested) * 100).toFixed(1)}%
                </div>
                <div style={{ color: '#cbd5e1' }}>Rendimiento Total</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  ${(totalProfit / (transactions.length || 1)).toFixed(2)}
                </div>
                <div style={{ color: '#cbd5e1' }}>Ganancia Promedio</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                  {transactions.filter(tx => tx.type === 'stake').length}
                </div>
                <div style={{ color: '#cbd5e1' }}>Operaciones Staking</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
                  {transactions.filter(tx => tx.type === 'liquidity').length}
                </div>
                <div style={{ color: '#cbd5e1' }}>Operaciones LP</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#10b981' }}>💡 Recomendaciones de Optimización</h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#10b981' }}>✅</span>
                <span style={{ color: '#cbd5e1' }}>Diversifica más en pools de liquidez para mayor APY</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#f59e0b' }}>⚠️</span>
                <span style={{ color: '#cbd5e1' }}>Considera aumentar el staking de AVAX para mejores recompensas</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#3b82f6' }}>💡</span>
                <span style={{ color: '#cbd5e1' }}>Tus transacciones muestran un patrón exitoso, continúa así</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;