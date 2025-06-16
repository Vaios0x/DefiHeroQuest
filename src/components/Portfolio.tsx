import React from 'react';

const Portfolio: React.FC = () => {
  const portfolioData = {
    totalValue: 25847.32,
    avgAPY: 12.7,
    activePositions: 5,
    totalRewards: 2340.50,
    positions: [
      {
        protocol: 'AAVE',
        type: 'Lending',
        asset: 'USDC',
        amount: 15420.50,
        apy: 6.2,
        rewards: 956.47
      },
      {
        protocol: 'Trader Joe',
        type: 'Liquidity Pool',
        asset: 'AVAX/USDC',
        amount: 7850.75,
        apy: 15.3,
        rewards: 1201.26
      },
      {
        protocol: 'Avalanche',
        type: 'Staking',
        asset: 'AVAX',
        amount: 2576.07,
        apy: 8.5,
        rewards: 182.77
      }
    ],
    heroStats: {
      level: 7,
      experience: 2340,
      nextLevelExp: 3000,
      attack: 45,
      defense: 38,
      magic: 52,
      health: 85,
      mana: 70
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
        📊 Your DeFi Portfolio
      </h2>
      
      {/* Portfolio Overview */}
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
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
            ${portfolioData.totalValue.toLocaleString()}
          </div>
          <div style={{ color: '#cbd5e1' }}>Total Value Locked</div>
        </div>
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7' }}>
            {portfolioData.avgAPY}%
          </div>
          <div style={{ color: '#cbd5e1' }}>Average APY</div>
        </div>
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {portfolioData.activePositions}
          </div>
          <div style={{ color: '#cbd5e1' }}>Active Positions</div>
        </div>
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            ${portfolioData.totalRewards.toLocaleString()}
          </div>
          <div style={{ color: '#cbd5e1' }}>Total Rewards</div>
        </div>
      </div>

      {/* Hero Character Card */}
      <div style={{
        background: 'rgba(71, 85, 105, 0.2)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>Your DeFi Hero</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            👑
          </div>
          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>Legendary DeFi Knight</h4>
            <p style={{ margin: '0', color: '#cbd5e1' }}>Level {portfolioData.heroStats.level} • Yield Farmer</p>
            <div style={{ 
              background: 'rgba(139, 92, 246, 0.2)', 
              borderRadius: '10px', 
              height: '8px', 
              width: '200px', 
              marginTop: '8px',
              position: 'relative'
            }}>
              <div style={{
                background: 'linear-gradient(45deg, #a855f7, #3b82f6)',
                height: '100%',
                borderRadius: '10px',
                width: `${(portfolioData.heroStats.experience / portfolioData.heroStats.nextLevelExp) * 100}%`
              }} />
            </div>
            <small style={{ color: '#94a3b8' }}>
              {portfolioData.heroStats.experience}/{portfolioData.heroStats.nextLevelExp} EXP
            </small>
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '15px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
              {portfolioData.heroStats.attack}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>⚔️ Attack</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {portfolioData.heroStats.defense}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>🛡️ Defense</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>
              {portfolioData.heroStats.magic}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>⚡ Magic</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {portfolioData.heroStats.experience}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>✨ EXP</div>
          </div>
        </div>
      </div>

      {/* Active Positions */}
      <div>
        <h3 style={{ margin: '0 0 20px 0', color: '#f59e0b' }}>Active DeFi Positions</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {portfolioData.positions.map((position, index) => (
            <div key={index} style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#cbd5e1' }}>{position.protocol}</h4>
                <p style={{ margin: '0', color: '#94a3b8', fontSize: '0.9rem' }}>{position.type}</p>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#10b981' }}>{position.asset}</div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                  ${position.amount.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#a855f7' }}>{position.apy}% APY</div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Annual Yield</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                  ${position.rewards.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Rewards Earned</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;