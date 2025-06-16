import React, { useState } from 'react';

interface TriggerExample {
  id: string;
  name: string;
  description: string;
  type: 'social' | 'defi' | 'cross-chain' | 'agent';
  url: string;
  atomicity: string;
  platforms: string[];
  useCases: string[];
}

const OptimizedTriggers: React.FC = () => {
  const [selectedTrigger, setSelectedTrigger] = useState<string>('hero-mint');

  const triggers: TriggerExample[] = [
    {
      id: 'hero-mint',
      name: '⚔️ Instant Hero Mint',
      description: 'Single-tap NFT minting with immediate DeFi utility',
      type: 'social',
      url: 'http://localhost:3002/api/sherry-miniapp?action=hero-mint',
      atomicity: 'One click → NFT minted → Ready for DeFi quests',
      platforms: ['Twitter', 'Discord', 'Telegram', 'Any social platform'],
      useCases: [
        'Tweet: "Join DeFi adventure!" → Trigger embedded → Instant mint',
        'Discord raid → Group minting → Community building',
        'Telegram channel → Hero drops → Viral growth'
      ]
    },
    {
      id: 'quest-start',
      name: '💰 Lightning Quest Start',
      description: 'Atomic staking action with gamified rewards',
      type: 'defi',
      url: 'http://localhost:3002/api/sherry-miniapp?action=defi-quest',
      atomicity: 'One tap → Stake tokens → Quest active → Earning yield',
      platforms: ['All social platforms', 'Wallet interfaces', 'dApp embeds'],
      useCases: [
        'Social post → "Start earning 12% APY" → Instant staking',
        'Group chat → "Join guild quest" → Collaborative rewards',
        'Influencer content → Follower quests → Community engagement'
      ]
    },
    {
      id: 'cross-bridge',
      name: '🌉 Cross-Chain Bridge',
      description: 'Seamless asset bridging between Avalanche and Base',
      type: 'cross-chain',
      url: 'http://localhost:3002/api/sherry-miniapp?action=bridge-quest',
      atomicity: 'One trigger → Cross-chain transfer → Multi-protocol access',
      platforms: ['Multi-chain wallets', 'Cross-chain dApps', 'Bridge interfaces'],
      useCases: [
        'Avalanche user → Tap trigger → Assets on Base',
        'DeFi strategy → Cross-chain optimization → Max yields',
        'NFT collection → Multi-chain availability → Broader market'
      ]
    },
    {
      id: 'ai-agent',
      name: '🤖 AI Agent Trigger',
      description: 'Bot-executable triggers for automated DeFi strategies',
      type: 'agent',
      url: 'http://localhost:3002/api/sherry-miniapp?action=agent-execute',
      atomicity: 'AI detection → Trigger execution → Autonomous optimization',
      platforms: ['AI bot frameworks', 'Automation platforms', 'Agent ecosystems'],
      useCases: [
        'Market conditions → Auto-rebalance → Optimal yields',
        'Social sentiment → Strategy adjustment → Community-driven DeFi',
        'Cross-protocol opportunities → Automatic execution → Max profits'
      ]
    }
  ];

  const selectedTriggerData = triggers.find(t => t.id === selectedTrigger) || triggers[0];

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#a855f7', margin: '0 0 20px 0' }}>
        ⚡ Optimized Triggers - "Triggers, Not Apps"
      </h2>
      
      <div style={{
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>🎯 Minithon Philosophy Alignment</h3>
        <p style={{ margin: '0', color: '#cbd5e1', fontSize: '0.9rem' }}>
          "The interface is collapsing. Mini-apps are redefining how people interact with crypto — simple, embedded, everywhere."
          Our triggers embody this vision: <strong>atomic actions that work across any platform, any context, any user experience.</strong>
        </p>
      </div>

      {/* Trigger Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
      }}>
        {triggers.map((trigger) => (
          <button
            key={trigger.id}
            onClick={() => setSelectedTrigger(trigger.id)}
            style={{
              background: selectedTrigger === trigger.id 
                ? 'rgba(139, 92, 246, 0.2)' 
                : 'rgba(71, 85, 105, 0.2)',
              border: selectedTrigger === trigger.id 
                ? '2px solid #a855f7' 
                : '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '15px',
              padding: '15px',
              color: selectedTrigger === trigger.id ? '#a855f7' : '#cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
          >
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{trigger.name}</h4>
            <p style={{ margin: '0', fontSize: '0.85rem', opacity: 0.8 }}>
              {trigger.description}
            </p>
            <div style={{
              marginTop: '8px',
              padding: '4px 8px',
              background: getTypeColor(trigger.type),
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              {trigger.type.toUpperCase()}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Trigger Details */}
      <div style={{
        background: 'rgba(71, 85, 105, 0.2)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '25px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>
          {selectedTriggerData.name} - Deep Dive
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Atomicity */}
          <div>
            <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>⚡ Atomic Action Flow</h4>
            <p style={{ margin: '0', color: '#cbd5e1', fontSize: '0.9rem' }}>
              {selectedTriggerData.atomicity}
            </p>
          </div>

          {/* Platforms */}
          <div>
            <h4 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>🌐 Platform Compatibility</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedTriggerData.platforms.map((platform, index) => (
                <span
                  key={index}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    color: '#3b82f6'
                  }}
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h4 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>🎯 Real-World Use Cases</h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            {selectedTriggerData.useCases.map((useCase, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.9rem',
                  color: '#cbd5e1'
                }}
              >
                <strong style={{ color: '#f59e0b' }}>Use Case {index + 1}:</strong> {useCase}
              </div>
            ))}
          </div>
        </div>

        {/* Trigger URL */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '10px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>🔗 Live Trigger URL</h4>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '8px',
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: '#cbd5e1',
            wordBreak: 'break-all'
          }}>
            {selectedTriggerData.url}
          </div>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
            Copy this URL into any social platform, wallet, or dApp to embed the trigger
          </p>
        </div>
      </div>

      {/* Minithon Alignment */}
      <div style={{
        marginTop: '25px',
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🏆 Sherry Minithon Winning Strategy</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>⚡</div>
            <div style={{ fontWeight: 'bold', color: '#a855f7' }}>Atomic Triggers</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Single-action execution</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🌐</div>
            <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>Universal Embedding</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Works everywhere</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔗</div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>Cross-Chain Native</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Avalanche + Base + more</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🤖</div>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>Agent Ready</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>AI bot compatible</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'social': return 'rgba(139, 92, 246, 0.3)';
    case 'defi': return 'rgba(16, 185, 129, 0.3)';
    case 'cross-chain': return 'rgba(59, 130, 246, 0.3)';
    case 'agent': return 'rgba(245, 158, 11, 0.3)';
    default: return 'rgba(71, 85, 105, 0.3)';
  }
};

export default OptimizedTriggers; 