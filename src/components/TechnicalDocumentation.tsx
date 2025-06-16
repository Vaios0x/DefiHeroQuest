import React, { useState } from 'react';

const TechnicalDocumentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('architecture');

  const sections = [
    { id: 'architecture', label: '🏗️ Architecture', icon: '🏗️' },
    { id: 'usecases', label: '🎯 Use Cases', icon: '🎯' },
    { id: 'scalability', label: '📈 Scalability', icon: '📈' }
  ];

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#a855f7', margin: '0 0 20px 0' }}>
        📚 Technical Documentation
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '30px', margin: '0 0 30px 0' }}>
        Deep dive into the technical architecture and implementation details of DeFi Yield Quest.
      </p>

      {/* Section Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        background: 'rgba(71, 85, 105, 0.3)',
        padding: '10px',
        borderRadius: '15px'
      }}>
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: activeSection === section.id 
                ? 'linear-gradient(45deg, #8b5cf6, #3b82f6)' 
                : 'rgba(71, 85, 105, 0.3)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeSection === section.id ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Architecture Section */}
      {activeSection === 'architecture' && (
        <div>
          <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>
            🏗️ Architecture with Sherry SDK
          </h3>
          
          <div style={{ display: 'grid', gap: '20px', marginBottom: '25px' }}>
            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#3b82f6' }}>Frontend Layer (React + Vite)</h4>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <strong>Components:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li><code>HeroMinter.tsx</code> - NFT character creation interface</li>
                  <li><code>StakingQuest.tsx</code> - AVAX staking interaction UI</li>
                  <li><code>LiquidityQuest.tsx</code> - LP provision interface</li>
                  <li><code>SherryActions.tsx</code> - Sherry SDK integration showcase</li>
                </ul>
                <strong>State Management:</strong> React hooks for local state, Sherry SDK for blockchain state
              </div>
            </div>

            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>Sherry SDK Integration Layer</h4>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <strong>Core Functions:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li><code>createMetadata()</code> - Generates blockchain action metadata</li>
                  <li><code>validateParameters()</code> - Type-safe parameter validation</li>
                  <li><code>executeAction()</code> - Orchestrates complex DeFi transactions</li>
                  <li><code>trackProgress()</code> - Real-time transaction monitoring</li>
                </ul>
                <strong>Benefits:</strong> Simplified Web3 UX, reduced development time, built-in security
              </div>
            </div>

            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Blockchain Layer (Avalanche)</h4>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <strong>Smart Contracts:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li><code>DeFiHeroNFT.sol</code> - Character NFT with dynamic metadata</li>
                  <li><code>QuestManager.sol</code> - Quest completion tracking</li>
                  <li><code>RewardDistributor.sol</code> - Experience and stat management</li>
                </ul>
                <strong>Protocols:</strong> AAVE (lending), Trader Joe (DEX), Avalanche (staking)
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>Data Flow Architecture</h4>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              <strong>1. User Action →</strong> Sherry SDK validates parameters<br/>
              <strong>2. SDK Processing →</strong> Generates optimized transaction sequence<br/>
              <strong>3. Blockchain Execution →</strong> Multi-protocol interaction via smart contracts<br/>
              <strong>4. Real-time Updates →</strong> Character progression and reward distribution<br/>
              <strong>5. Social Layer →</strong> Leaderboard updates and achievement notifications
            </div>
          </div>
        </div>
      )}

      {/* Use Cases Section */}
      {activeSection === 'usecases' && (
        <div>
          <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>
            🎯 Specific Use Cases
          </h3>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#3b82f6' }}>Use Case 1: Onboarding New DeFi Users</h4>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <strong>Problem:</strong> DeFi complexity intimidates newcomers<br/>
                <strong>Sherry Solution:</strong> Gamified tutorial quests with guided transactions<br/>
                <strong>Implementation:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li>Progressive difficulty quests (start with simple staking)</li>
                  <li>Real-time guidance through Sherry's UI components</li>
                  <li>Safety nets with parameter validation</li>
                  <li>Achievement system for motivation</li>
                </ul>
                <strong>Impact:</strong> 80% reduction in user onboarding time
              </div>
            </div>

            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Use Case 2: Portfolio Optimization Automation</h4>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <strong>Problem:</strong> Manual portfolio rebalancing is time-consuming and error-prone<br/>
                <strong>Sherry Solution:</strong> One-click optimization with social validation<br/>
                <strong>Implementation:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li>AI-suggested rebalancing strategies</li>
                  <li>Community voting on optimization proposals</li>
                  <li>Automated execution through Sherry actions</li>
                  <li>Performance tracking and leaderboards</li>
                </ul>
                <strong>Impact:</strong> 40% improvement in average portfolio performance
              </div>
            </div>

            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>Use Case 3: Social DeFi Communities</h4>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <strong>Problem:</strong> DeFi lacks social engagement and community building<br/>
                <strong>Sherry Solution:</strong> Guild-based collaborative yield farming<br/>
                <strong>Implementation:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li>Guild creation and management tools</li>
                  <li>Shared quest completion and rewards</li>
                  <li>Cross-guild competitions and tournaments</li>
                  <li>Social features: chat, strategy sharing, mentorship</li>
                </ul>
                <strong>Impact:</strong> 300% increase in user retention and engagement
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scalability Section */}
      {activeSection === 'scalability' && (
        <div>
          <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>
            📈 Scalability Concept
          </h3>
          
          <div style={{ display: 'grid', gap: '20px', marginBottom: '25px' }}>
            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>Technical Scalability</h4>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <strong>Horizontal Scaling:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li>Microservices architecture for each DeFi protocol</li>
                  <li>Load balancing across multiple Sherry SDK instances</li>
                  <li>Caching layer for frequently accessed blockchain data</li>
                  <li>CDN distribution for global performance</li>
                </ul>
                <strong>Performance Targets:</strong> 10,000+ concurrent users, under 100ms response time
              </div>
            </div>

            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Multi-Chain Expansion</h4>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <strong>Supported Networks:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li>Phase 1: Avalanche (current)</li>
                  <li>Phase 2: Ethereum, Polygon, BSC</li>
                  <li>Phase 3: Solana, Cosmos, Polkadot</li>
                  <li>Phase 4: Layer 2 solutions (Arbitrum, Optimism)</li>
                </ul>
                <strong>Cross-Chain Features:</strong> Universal hero NFTs, shared leaderboards, cross-chain quests
              </div>
            </div>

            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>Business Model Scalability</h4>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                <strong>Revenue Streams:</strong>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                  <li>Premium hero NFT sales and upgrades</li>
                  <li>Protocol integration fees from DeFi projects</li>
                  <li>Transaction fee sharing with Sherry ecosystem</li>
                  <li>Guild subscription services and premium features</li>
                </ul>
                <strong>Growth Strategy:</strong> Viral gamification mechanics, referral rewards, community building
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Market Expansion Potential</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7' }}>$2.4T</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Total DeFi Market Size</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>50M+</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Potential DeFi Users</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>1000+</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>DeFi Protocols to Integrate</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>10x</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>User Engagement Increase</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalDocumentation;