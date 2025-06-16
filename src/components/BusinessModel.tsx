import React, { useState } from 'react';

const BusinessModel: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const businessMetrics = {
    revenue: {
      title: 'Revenue Projections',
      data: [
        { period: 'Month 1-3', value: '$50K', description: 'Premium hero NFT sales' },
        { period: 'Month 4-6', value: '$200K', description: 'Protocol integration fees' },
        { period: 'Month 7-12', value: '$1.2M', description: 'Transaction fee sharing' },
        { period: 'Year 2', value: '$5.8M', description: 'Enterprise guild subscriptions' }
      ]
    },
    users: {
      title: 'User Growth Strategy',
      data: [
        { period: 'Launch', value: '1,000', description: 'Alpha testers & early adopters' },
        { period: 'Month 3', value: '25,000', description: 'Viral referral program' },
        { period: 'Month 6', value: '150,000', description: 'Multi-chain expansion' },
        { period: 'Year 1', value: '500,000', description: 'Mainstream DeFi adoption' }
      ]
    },
    market: {
      title: 'Market Opportunity',
      data: [
        { period: 'TAM', value: '$2.4T', description: 'Total DeFi market size' },
        { period: 'SAM', value: '$240B', description: 'Serviceable addressable market' },
        { period: 'SOM', value: '$2.4B', description: 'Serviceable obtainable market' },
        { period: 'Target', value: '$120M', description: '5% market share goal' }
      ]
    }
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#f59e0b', margin: '0 0 20px 0' }}>
        💰 Scalable Business Model
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '30px', margin: '0 0 30px 0' }}>
        Comprehensive business strategy demonstrating real-world viability and massive scale potential.
      </p>

      {/* Metric Selector */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        background: 'rgba(71, 85, 105, 0.3)',
        padding: '10px',
        borderRadius: '15px'
      }}>
        {Object.entries(businessMetrics).map(([key, metric]) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: selectedMetric === key 
                ? 'linear-gradient(45deg, #f59e0b, #d97706)' 
                : 'rgba(71, 85, 105, 0.3)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: selectedMetric === key ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            {metric.title}
          </button>
        ))}
      </div>

      {/* Selected Metric Display */}
      <div style={{
        background: 'rgba(71, 85, 105, 0.2)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#f59e0b' }}>
          {businessMetrics[selectedMetric as keyof typeof businessMetrics].title}
        </h3>
        
        <div style={{ display: 'grid', gap: '15px' }}>
          {businessMetrics[selectedMetric as keyof typeof businessMetrics].data.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'between',
              alignItems: 'center',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '15px',
              borderRadius: '10px',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>{item.period}</div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{item.description}</div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Streams */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#10b981' }}>💎 Multiple Revenue Streams</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{
            background: 'rgba(71, 85, 105, 0.2)',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>🎨 Premium NFT Heroes</h4>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '10px' }}>
              Rare hero classes with enhanced abilities and exclusive features
            </div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>$50-500 per NFT</div>
          </div>

          <div style={{
            background: 'rgba(71, 85, 105, 0.2)',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>🔗 Protocol Integration Fees</h4>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '10px' }}>
              DeFi protocols pay to be featured in our gamified ecosystem
            </div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>$10K-100K per protocol</div>
          </div>

          <div style={{
            background: 'rgba(71, 85, 105, 0.2)',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>💰 Transaction Fee Sharing</h4>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '10px' }}>
              Revenue share from DeFi transactions executed through our platform
            </div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>0.1-0.5% per transaction</div>
          </div>

          <div style={{
            background: 'rgba(71, 85, 105, 0.2)',
            borderRadius: '10px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>🏰 Guild Subscriptions</h4>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '10px' }}>
              Premium guild features, analytics, and automation tools
            </div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>$29-299 per month</div>
          </div>
        </div>
      </div>

      {/* Competitive Moat */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🛡️ Competitive Moat & Network Effects</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🌐</div>
            <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>Network Effects</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>More users = better strategies</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📊</div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>Data Advantage</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Proprietary user behavior data</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔗</div>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>Protocol Partnerships</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Exclusive integration deals</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🎮</div>
            <div style={{ fontWeight: 'bold', color: '#ef4444' }}>Gamification Lock-in</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>High switching costs</div>
          </div>
        </div>
        
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', color: '#a855f7', fontWeight: 'bold' }}>
            🎯 First-mover advantage in social DeFi gaming creates sustainable competitive moat 
            through network effects, data advantages, and high user switching costs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessModel;