import React, { useState, useEffect } from 'react';

interface TokenomicsRoadmapProps {
  className?: string;
}

const TokenomicsRoadmap: React.FC<TokenomicsRoadmapProps> = ({ className = '' }) => {
  const [selectedTab, setSelectedTab] = useState('tokenomics');
  const [totalSupply] = useState(1000000000); // 1B tokens
  const [currentPrice] = useState(0.085); // $0.085 USD
  const [marketCap, setMarketCap] = useState(0);
  const [circulatingSupply] = useState(250000000); // 250M tokens

  useEffect(() => {
    setMarketCap(circulatingSupply * currentPrice);
  }, [circulatingSupply, currentPrice]);

  const tokenDistribution = [
    { name: 'Ecosystem & Rewards', percentage: 40, amount: 400000000, color: 'from-green-500 to-emerald-600', description: 'Staking rewards, quest rewards, farming incentives' },
    { name: 'Development Team', percentage: 20, amount: 200000000, color: 'from-blue-500 to-cyan-600', description: 'Core team allocation, vested over 4 years' },
    { name: 'Community Treasury', percentage: 15, amount: 150000000, color: 'from-purple-500 to-violet-600', description: 'Governance decisions, partnerships, grants' },
    { name: 'Public Sale', percentage: 12, amount: 120000000, color: 'from-orange-500 to-red-600', description: 'IDO, DEX listings, liquidity provision' },
    { name: 'Private Investors', percentage: 8, amount: 80000000, color: 'from-pink-500 to-rose-600', description: 'Strategic investors, VCs, angels' },
    { name: 'Advisors & Partners', percentage: 3, amount: 30000000, color: 'from-yellow-500 to-amber-600', description: 'Advisory board, strategic partnerships' },
    { name: 'Marketing & Growth', percentage: 2, amount: 20000000, color: 'from-indigo-500 to-blue-600', description: 'User acquisition, campaigns, events' }
  ];

  const businessModel = [
    {
      category: 'Transaction Fees',
      percentage: 35,
      description: 'Fee sharing from integrated protocols (0.05% on swaps, bridges)',
      revenue: '$420K/month',
      icon: '💰'
    },
    {
      category: 'Premium Features',
      percentage: 25,
      description: 'Advanced AI agents, priority support, exclusive quests',
      revenue: '$300K/month',
      icon: '⭐'
    },
    {
      category: 'NFT & Heroes',
      percentage: 20,
      description: 'Hero sales, equipment, special abilities, cosmetics',
      revenue: '$240K/month',
      icon: '⚔️'
    },
    {
      category: 'Partnerships',
      percentage: 15,
      description: 'Integration fees, white-label solutions, B2B services',
      revenue: '$180K/month',
      icon: '🤝'
    },
    {
      category: 'Staking & Governance',
      percentage: 5,
      description: 'Governance participation fees, validator rewards',
      revenue: '$60K/month',
      icon: '🗳️'
    }
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1: Testnet & MVP',
      quarter: 'Q1 2025',
      status: 'current',
      progress: 85,
      milestones: [
        { task: 'Avalanche Fuji Integration', status: 'completed', icon: '✅' },
        { task: 'Basic Hero System', status: 'completed', icon: '✅' },
        { task: 'Dynamic Actions MVP', status: 'completed', icon: '✅' },
        { task: 'Social Triggers Beta', status: 'in-progress', icon: '🔄' },
        { task: 'Community Testing', status: 'pending', icon: '⏳' }
      ]
    },
    {
      phase: 'Phase 2: Mainnet Launch',
      quarter: 'Q2 2025',
      status: 'upcoming',
      progress: 0,
      milestones: [
        { task: 'Avalanche Mainnet Deploy', status: 'pending', icon: '⏳' },
        { task: 'Token Launch (HERO)', status: 'pending', icon: '⏳' },
        { task: 'Liquidity Mining', status: 'pending', icon: '⏳' },
        { task: 'Advanced AI Agents', status: 'pending', icon: '⏳' },
        { task: 'Governance Launch', status: 'pending', icon: '⏳' }
      ]
    },
    {
      phase: 'Phase 3: Multi-Chain Expansion',
      quarter: 'Q3 2025',
      status: 'planned',
      progress: 0,
      milestones: [
        { task: 'Ethereum Integration', status: 'pending', icon: '⏳' },
        { task: 'Polygon Support', status: 'pending', icon: '⏳' },
        { task: 'Base Chain Integration', status: 'pending', icon: '⏳' },
        { task: 'Cross-Chain Heroes', status: 'pending', icon: '⏳' },
        { task: 'Unified Liquidity', status: 'pending', icon: '⏳' }
      ]
    },
    {
      phase: 'Phase 4: Partnerships & Scale',
      quarter: 'Q4 2025',
      status: 'planned',
      progress: 0,
      milestones: [
        { task: 'Major DeFi Partnerships', status: 'pending', icon: '⏳' },
        { task: 'Mobile App Launch', status: 'pending', icon: '⏳' },
        { task: 'White-Label Platform', status: 'pending', icon: '⏳' },
        { task: 'Institutional Features', status: 'pending', icon: '⏳' },
        { task: '1M+ Active Users', status: 'pending', icon: '⏳' }
      ]
    }
  ];

  const tokenUtility = [
    {
      utility: 'Staking Rewards',
      description: 'Stake HERO tokens to earn yield from protocol fees and quest rewards',
      apy: '15-35%',
      icon: '🌾',
      color: 'from-green-500 to-emerald-600'
    },
    {
      utility: 'Governance Rights',
      description: 'Vote on protocol parameters, new features, and treasury allocations',
      apy: 'Voting Power',
      icon: '🗳️',
      color: 'from-purple-500 to-violet-600'
    },
    {
      utility: 'Premium Access',
      description: 'Access to advanced AI agents, exclusive quests, and priority support',
      apy: 'Exclusive Features',
      icon: '⭐',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      utility: 'Hero Upgrades',
      description: 'Enhance hero abilities, unlock rare equipment, and special powers',
      apy: 'Power Boosts',
      icon: '⚔️',
      color: 'from-orange-500 to-red-600'
    },
    {
      utility: 'Fee Discounts',
      description: 'Reduced transaction fees, bridge costs, and premium feature pricing',
      apy: 'Up to 50% Off',
      icon: '💰',
      color: 'from-yellow-500 to-amber-600'
    }
  ];

  const partnerships = [
    {
      category: 'DeFi Protocols',
      partners: ['Trader Joe', 'BENQI', 'Pangolin', 'Aave', 'Curve'],
      status: 'Active Integration',
      impact: 'Direct protocol access, fee sharing',
      icon: '🏛️'
    },
    {
      category: 'Infrastructure',
      partners: ['Avalanche', 'LayerZero', 'Chainlink', 'The Graph'],
      status: 'Technical Partnership',
      impact: 'Reliable infrastructure, data feeds',
      icon: '⚙️'
    },
    {
      category: 'Gaming & NFTs',
      partners: ['OpenSea', 'Magic Eden', 'Ava Labs Games'],
      status: 'In Discussion',
      impact: 'NFT integration, gaming mechanics',
      icon: '🎮'
    },
    {
      category: 'Institutional',
      partners: ['Jump Crypto', 'Galaxy Digital', 'Three Arrows'],
      status: 'Strategic Investment',
      impact: 'Funding, expertise, network',
      icon: '🏢'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className={className}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#ffffff', 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          💎 Tokenomics & Roadmap
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
          Modelo de negocio sostenible y roadmap claro hacia el éxito
        </p>
      </div>

      {/* Tab Selector */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          display: 'flex', 
          background: 'rgba(31, 41, 55, 0.5)', 
          borderRadius: '12px', 
          padding: '8px',
          border: '1px solid rgba(75, 85, 99, 0.3)'
        }}>
          {[
            { id: 'tokenomics', name: 'Tokenomics', icon: '💰' },
            { id: 'business', name: 'Business Model', icon: '📊' },
            { id: 'roadmap', name: 'Roadmap', icon: '🛣️' },
            { id: 'partnerships', name: 'Partnerships', icon: '🤝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                background: selectedTab === tab.id 
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                  : 'transparent',
                color: selectedTab === tab.id ? '#ffffff' : '#9ca3af',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => {
                if (selectedTab !== tab.id) {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.background = 'rgba(55, 65, 81, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTab !== tab.id) {
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tokenomics Section */}
      {selectedTab === 'tokenomics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Token Overview */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(107, 33, 168, 0.3), rgba(67, 56, 202, 0.3))', 
            borderRadius: '12px', 
            padding: '24px', 
            border: '1px solid rgba(147, 51, 234, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💰 HERO Token Overview
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '24px', 
              marginBottom: '32px' 
            }}>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.4)', 
                borderRadius: '8px', 
                padding: '16px', 
                textAlign: 'center',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <h4 style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '8px' }}>Total Supply</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>{formatNumber(totalSupply)}</div>
              </div>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.4)', 
                borderRadius: '8px', 
                padding: '16px', 
                textAlign: 'center',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <h4 style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '8px' }}>Current Price</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>${currentPrice}</div>
              </div>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.4)', 
                borderRadius: '8px', 
                padding: '16px', 
                textAlign: 'center',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <h4 style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '8px' }}>Market Cap</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>${formatNumber(marketCap)}</div>
              </div>
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.4)', 
                borderRadius: '8px', 
                padding: '16px', 
                textAlign: 'center',
                border: '1px solid rgba(75, 85, 99, 0.3)'
              }}>
                <h4 style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '8px' }}>Circulating</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>{formatNumber(circulatingSupply)}</div>
              </div>
            </div>

            {/* Distribution Chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>Token Distribution</h4>
              {tokenDistribution.map(item => (
                <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>{item.name}</span>
                    <span style={{ color: '#9ca3af' }}>{item.percentage}% ({formatNumber(item.amount)})</span>
                  </div>
                  <div style={{ 
                    background: 'rgba(31, 41, 55, 0.5)', 
                    borderRadius: '999px', 
                    height: '12px',
                    overflow: 'hidden'
                  }}>
                    <div 
                      style={{ 
                        background: item.color.includes('green') ? 'linear-gradient(90deg, #10b981, #059669)' :
                                  item.color.includes('blue') ? 'linear-gradient(90deg, #3b82f6, #0891b2)' :
                                  item.color.includes('purple') ? 'linear-gradient(90deg, #8b5cf6, #7c3aed)' :
                                  item.color.includes('orange') ? 'linear-gradient(90deg, #f97316, #dc2626)' :
                                  item.color.includes('pink') ? 'linear-gradient(90deg, #ec4899, #e11d48)' :
                                  item.color.includes('yellow') ? 'linear-gradient(90deg, #eab308, #d97706)' :
                                  'linear-gradient(90deg, #6366f1, #3b82f6)',
                        height: '12px', 
                        borderRadius: '999px', 
                        transition: 'all 1s ease',
                        width: `${item.percentage}%`
                      }}
                    />
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Token Utility */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(6, 95, 70, 0.3), rgba(5, 150, 105, 0.3))', 
            borderRadius: '12px', 
            padding: '24px', 
            border: '1px solid rgba(34, 197, 94, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🌟 Token Utility
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px' 
            }}>
              {tokenUtility.map(item => (
                <div key={item.utility} style={{ 
                  background: 'rgba(0, 0, 0, 0.4)', 
                  borderRadius: '12px', 
                  padding: '24px', 
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                    <h4 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.125rem' }}>{item.utility}</h4>
                  </div>
                  <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '16px', lineHeight: '1.5' }}>{item.description}</p>
                  <div style={{ 
                    background: item.color.includes('green') ? 'linear-gradient(90deg, #10b981, #059669)' :
                              item.color.includes('purple') ? 'linear-gradient(90deg, #8b5cf6, #7c3aed)' :
                              item.color.includes('blue') ? 'linear-gradient(90deg, #3b82f6, #0891b2)' :
                              item.color.includes('orange') ? 'linear-gradient(90deg, #f97316, #dc2626)' :
                              'linear-gradient(90deg, #eab308, #d97706)',
                    color: '#ffffff', 
                    textAlign: 'center', 
                    padding: '8px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {item.apy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Business Model Section */}
      {selectedTab === 'business' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(8, 145, 178, 0.3))', 
            borderRadius: '12px', 
            padding: '24px', 
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📊 Revenue Streams
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '32px' 
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {businessModel.map(model => (
                  <div key={model.category} style={{ 
                    background: 'rgba(0, 0, 0, 0.4)', 
                    borderRadius: '12px', 
                    padding: '24px', 
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '2rem' }}>{model.icon}</div>
                        <h4 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.125rem' }}>{model.category}</h4>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.125rem' }}>{model.percentage}%</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{model.revenue}</div>
                      </div>
                    </div>
                    <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '16px', lineHeight: '1.5' }}>{model.description}</p>
                    <div style={{ background: 'rgba(31, 41, 55, 0.5)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          background: 'linear-gradient(90deg, #3b82f6, #0891b2)', 
                          height: '8px', 
                          borderRadius: '999px', 
                          transition: 'all 1s ease',
                          width: `${model.percentage}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                background: 'rgba(0, 0, 0, 0.4)', 
                borderRadius: '12px', 
                padding: '24px', 
                border: '1px solid rgba(75, 85, 99, 0.5)'
              }}>
                <h4 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#ffffff', 
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  💰 Proyecciones Financieras
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h5 style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '8px' }}>Revenue Mensual Total</h5>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>$1.2M</div>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>+45% month-over-month</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div style={{ 
                      background: 'rgba(31, 41, 55, 0.5)', 
                      borderRadius: '8px', 
                      padding: '16px', 
                      textAlign: 'center',
                      border: '1px solid rgba(75, 85, 99, 0.3)'
                    }}>
                      <h6 style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '4px' }}>Q1 2025</h6>
                      <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#3b82f6' }}>$3.6M</div>
                    </div>
                    <div style={{ 
                      background: 'rgba(31, 41, 55, 0.5)', 
                      borderRadius: '8px', 
                      padding: '16px', 
                      textAlign: 'center',
                      border: '1px solid rgba(75, 85, 99, 0.3)'
                    }}>
                      <h6 style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '4px' }}>Q2 2025</h6>
                      <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#8b5cf6' }}>$8.1M</div>
                    </div>
                    <div style={{ 
                      background: 'rgba(31, 41, 55, 0.5)', 
                      borderRadius: '8px', 
                      padding: '16px', 
                      textAlign: 'center',
                      border: '1px solid rgba(75, 85, 99, 0.3)'
                    }}>
                      <h6 style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '4px' }}>Q3 2025</h6>
                      <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#10b981' }}>$15.2M</div>
                    </div>
                    <div style={{ 
                      background: 'rgba(31, 41, 55, 0.5)', 
                      borderRadius: '8px', 
                      padding: '16px', 
                      textAlign: 'center',
                      border: '1px solid rgba(75, 85, 99, 0.3)'
                    }}>
                      <h6 style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '4px' }}>Q4 2025</h6>
                      <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#eab308' }}>$28.5M</div>
                    </div>
                  </div>

                  <div style={{ 
                    background: 'linear-gradient(90deg, #059669, #10b981)', 
                    borderRadius: '8px', 
                    padding: '16px', 
                    textAlign: 'center'
                  }}>
                    <h6 style={{ color: '#ffffff', fontSize: '0.875rem', marginBottom: '4px' }}>Projected Annual Revenue</h6>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>$55.4M</div>
                    <div style={{ color: '#bbf7d0', fontSize: '0.875rem' }}>2025 Target</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Section */}
      {selectedTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(194, 65, 12, 0.3), rgba(153, 27, 27, 0.3))', 
            borderRadius: '12px', 
            padding: '24px', 
            border: '1px solid rgba(251, 146, 60, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🛣️ Roadmap to Success
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {roadmapPhases.map((phase, index) => (
                <div key={phase.phase} style={{ position: 'relative' }}>
                  {index < roadmapPhases.length - 1 && (
                    <div style={{ 
                      position: 'absolute', 
                      left: '24px', 
                      top: '64px', 
                      width: '2px', 
                      height: '128px', 
                      background: '#4b5563' 
                    }} />
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid',
                      background: phase.status === 'current' ? '#2563eb' :
                                 phase.status === 'completed' ? '#059669' : '#374151',
                      borderColor: phase.status === 'current' ? '#60a5fa' :
                                  phase.status === 'completed' ? '#34d399' : '#6b7280'
                    }}>
                      <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{index + 1}</span>
                    </div>
                    
                    <div style={{ 
                      flex: '1', 
                      background: 'rgba(0, 0, 0, 0.4)', 
                      borderRadius: '12px', 
                      padding: '24px', 
                      border: '1px solid rgba(107, 114, 128, 0.5)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>{phase.phase}</h4>
                          <p style={{ color: '#9ca3af' }}>{phase.quarter}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600',
                            color: phase.status === 'completed' ? '#34d399' :
                                   phase.status === 'current' ? '#60a5fa' :
                                   phase.status === 'upcoming' ? '#a78bfa' :
                                   '#6b7280'
                          }}>
                            {phase.status.toUpperCase()}
                          </div>
                          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{phase.progress}% Complete</div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        background: 'rgba(31, 41, 55, 0.5)', 
                        borderRadius: '999px', 
                        height: '8px', 
                        marginBottom: '24px',
                        overflow: 'hidden'
                      }}>
                        <div 
                          style={{ 
                            background: 'linear-gradient(90deg, #f97316, #dc2626)', 
                            height: '8px', 
                            borderRadius: '999px', 
                            transition: 'all 1s ease',
                            width: `${phase.progress}%`
                          }}
                        />
                      </div>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '16px' 
                      }}>
                        {phase.milestones.map(milestone => (
                          <div key={milestone.task} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '1.5rem' }}>{milestone.icon}</span>
                            <span style={{
                              fontSize: '0.875rem',
                              color: milestone.status === 'completed' ? '#34d399' :
                                     milestone.status === 'in-progress' ? '#fbbf24' :
                                     '#9ca3af'
                            }}>
                              {milestone.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Partnerships Section */}
      {selectedTab === 'partnerships' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(131, 24, 67, 0.3), rgba(159, 18, 57, 0.3))', 
            borderRadius: '12px', 
            padding: '24px', 
            border: '1px solid rgba(236, 72, 153, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🤝 Strategic Partnerships
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '24px' 
            }}>
              {partnerships.map(partnership => (
                <div key={partnership.category} style={{ 
                  background: 'rgba(0, 0, 0, 0.4)', 
                  borderRadius: '12px', 
                  padding: '24px', 
                  border: '1px solid rgba(107, 114, 128, 0.5)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '2rem' }}>{partnership.icon}</div>
                    <div>
                      <h4 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '4px' }}>{partnership.category}</h4>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{partnership.status}</p>
                    </div>
                  </div>
                  
                  <p style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '16px', lineHeight: '1.5' }}>{partnership.impact}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h5 style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem' }}>Partners:</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {partnership.partners.map(partner => (
                        <span 
                          key={partner}
                          style={{
                            background: 'rgba(31, 41, 55, 0.5)',
                            color: '#d1d5db',
                            padding: '4px 12px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            border: '1px solid rgba(75, 85, 99, 0.3)'
                          }}
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.5), rgba(30, 58, 138, 0.5))', 
        borderRadius: '12px', 
        padding: '32px', 
        border: '1px solid rgba(147, 51, 234, 0.3)', 
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          color: '#ffffff', 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🚀 Join the DeFi Hero Revolution
        </h3>
        <p style={{ color: '#d1d5db', marginBottom: '24px', fontSize: '1.125rem' }}>
          Be part of the next generation of DeFi gaming and earn real rewards while having fun
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.4)', 
            borderRadius: '8px', 
            padding: '16px',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎯</div>
            <h4 style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '4px' }}>Sustainable Model</h4>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Revenue-generating tokenomics</p>
          </div>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.4)', 
            borderRadius: '8px', 
            padding: '16px',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🌐</div>
            <h4 style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '4px' }}>Multi-Chain Future</h4>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Expanding beyond Avalanche</p>
          </div>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.4)', 
            borderRadius: '8px', 
            padding: '16px',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>👥</div>
            <h4 style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '4px' }}>Strong Partnerships</h4>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Backed by top-tier partners</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button style={{
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            color: '#ffffff',
            padding: '12px 32px',
            borderRadius: '12px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)';
          }}
          >
            🏆 Join Sherry Minithon
          </button>
          <button style={{
            background: 'rgba(55, 65, 81, 0.8)',
            color: '#ffffff',
            padding: '12px 32px',
            borderRadius: '12px',
            fontWeight: 'bold',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(75, 85, 99, 0.8)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(55, 65, 81, 0.8)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            📄 Read Whitepaper
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenomicsRoadmap; 