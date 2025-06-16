import React, { useState } from 'react';

interface SherryMiniAppProps {
  isConnected?: boolean;
  walletAddress?: string;
  networkStatus?: string;
}

const SherryMiniApp: React.FC<SherryMiniAppProps> = ({
  isConnected = false,
  walletAddress = '',
  networkStatus = 'unknown'
}) => {
  const [activeAction, setActiveAction] = useState('hero-mint');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // URLs de la mini-app
  const MINIAPP_BASE_URL = 'http://localhost:3002/api/sherry-miniapp';

  const actions = [
    {
      id: 'hero-mint',
      title: '⚔️ Mint Hero NFT',
      description: 'Create your DeFi hero and start your adventure',
      color: '#a855f7'
    },
    {
      id: 'defi-quest',
      title: '🚀 DeFi Staking Quest',
      description: 'Complete staking quests and earn rewards',
      color: '#3b82f6'
    },
    {
      id: 'social-quest',
      title: '👥 Social Quest',
      description: 'Build community and earn social rewards',
      color: '#10b981'
    }
  ];

  const testMiniApp = async (actionType: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      // 1. Obtener metadata de la mini-app
      console.log('🔍 Testing Sherry Mini-App:', actionType);
      
      const metadataResponse = await fetch(`${MINIAPP_BASE_URL}?action=${actionType}`);
      const metadata = await metadataResponse.json();
      
      console.log('📋 Mini-app metadata:', metadata);

      // 2. Simular ejecución de acción
      const testParams = getTestParams(actionType);
      
      const executeResponse = await fetch(`${MINIAPP_BASE_URL}?action=${actionType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testParams)
      });

      const executeResult = await executeResponse.json();
      
      console.log('✅ Mini-app execution result:', executeResult);
      
      setResult({
        metadata,
        execution: executeResult,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Mini-app test failed:', error);
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTestParams = (actionType: string) => {
    switch (actionType) {
      case 'hero-mint':
        return {
          to: walletAddress || '0x742d35Cc6734C0532925a3b8D4ccd306f6F4B26C',
          heroClass: 0, // DeFi Knight
          username: 'TestHero' + Math.floor(Math.random() * 1000)
        };
      
      case 'defi-quest':
        return {
          amount: '100000000000000000', // 0.1 AVAX
          duration: 604800, // 7 days
          guildId: 1 // DeFi Pioneers Guild
        };
      
      case 'social-quest':
        return {
          questId: 1, // Share DeFi Strategy
          heroTokenId: Math.floor(Math.random() * 1000),
          socialProof: 'https://twitter.com/example/status/123456789'
        };
      
      default:
        return {};
    }
  };

  const copyMiniAppURL = (actionType: string) => {
    const url = `${MINIAPP_BASE_URL}?action=${actionType}`;
    navigator.clipboard.writeText(url);
    alert('📋 Mini-app URL copied to clipboard!');
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ 
        fontSize: '2rem', 
        marginBottom: '20px', 
        color: '#a855f7',
        margin: '0 0 20px 0',
        textAlign: 'center'
      }}>
        🏆 Sherry Mini-App Integration
      </h2>
      
      <p style={{ 
        color: '#cbd5e1', 
        marginBottom: '30px', 
        margin: '0 0 30px 0',
        textAlign: 'center'
      }}>
        Embeddable DeFi Hero Quest mini-apps for social media posts
      </p>

      {/* Status de conexión */}
      <div style={{
        background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        borderRadius: '10px',
        padding: '15px',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <div style={{ 
          color: isConnected ? '#10b981' : '#ef4444',
          fontWeight: 'bold'
        }}>
          {isConnected ? '✅ Wallet Connected' : '❌ Wallet Not Connected'}
        </div>
        {isConnected && (
          <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '5px' }}>
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)} | Network: {networkStatus}
          </div>
        )}
      </div>

      {/* Selector de acciones */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#cbd5e1' }}>
          Select Mini-App Action:
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => setActiveAction(action.id)}
              style={{
                background: activeAction === action.id 
                  ? `rgba(${action.color === '#a855f7' ? '168, 85, 247' : action.color === '#3b82f6' ? '59, 130, 246' : '16, 185, 129'}, 0.2)`
                  : 'rgba(71, 85, 105, 0.2)',
                border: `1px solid ${activeAction === action.id ? action.color : 'rgba(71, 85, 105, 0.3)'}`,
                borderRadius: '10px',
                padding: '15px',
                color: activeAction === action.id ? action.color : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {action.title}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                {action.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '25px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => testMiniApp(activeAction)}
          disabled={isLoading}
          style={{
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.5)',
            borderRadius: '10px',
            padding: '12px 24px',
            color: '#a855f7',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? '🔄 Testing...' : '🧪 Test Mini-App'}
        </button>

        <button
          onClick={() => copyMiniAppURL(activeAction)}
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '10px',
            padding: '12px 24px',
            color: '#3b82f6',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📋 Copy URL
        </button>

        <button
          onClick={() => window.open('https://app.sherry.social/debugger', '_blank')}
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '10px',
            padding: '12px 24px',
            color: '#10b981',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔧 Sherry Debugger
        </button>
      </div>

      {/* Resultados */}
      {result && (
        <div style={{
          background: 'rgba(71, 85, 105, 0.2)',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#cbd5e1' }}>
            📊 Mini-App Test Results:
          </h4>
          
          {result.error ? (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '15px',
              color: '#ef4444'
            }}>
              ❌ Error: {result.error}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {/* Metadata */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>
                  📋 Metadata (GET Response):
                </h5>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <div><strong>Title:</strong> {result.metadata?.title}</div>
                  <div><strong>Description:</strong> {result.metadata?.description}</div>
                  <div><strong>Actions:</strong> {result.metadata?.actions?.length || 0}</div>
                </div>
              </div>

              {/* Execution Result */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#10b981' }}>
                  ⚡ Execution (POST Response):
                </h5>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <div><strong>Success:</strong> {result.execution?.success ? '✅' : '❌'}</div>
                  <div><strong>Message:</strong> {result.execution?.message}</div>
                  {result.execution?.data && (
                    <div><strong>Data:</strong> {JSON.stringify(result.execution.data, null, 2).slice(0, 100)}...</div>
                  )}
                  {result.execution?.transactionHash && (
                    <div><strong>TX Hash:</strong> {result.execution.transactionHash.slice(0, 10)}...</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#94a3b8', 
            marginTop: '10px',
            textAlign: 'right'
          }}>
            Tested at: {new Date(result.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {/* Información de integración */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '10px',
        padding: '20px'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>
          🚀 How to Use This Mini-App:
        </h4>
        <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>1. Social Media Integration:</strong> Copy the mini-app URL and paste it in Twitter, Discord, or Telegram posts
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>2. Sherry Debugger:</strong> Use the official Sherry debugger to test and validate your mini-app
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>3. Embed Anywhere:</strong> The mini-app works in any platform that supports Sherry protocol
          </div>
          <div>
            <strong>4. Real Blockchain:</strong> All actions execute real transactions on Avalanche Fuji testnet
          </div>
        </div>
      </div>

      {/* URLs de ejemplo */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>
          Mini-App Endpoints:
        </div>
        <div style={{ 
          background: 'rgba(71, 85, 105, 0.2)', 
          borderRadius: '8px', 
          padding: '10px',
          fontSize: '0.8rem',
          color: '#cbd5e1',
          fontFamily: 'monospace'
        }}>
          <div>GET: {MINIAPP_BASE_URL}?action=hero-mint</div>
          <div>GET: {MINIAPP_BASE_URL}?action=defi-quest</div>
          <div>GET: {MINIAPP_BASE_URL}?action=social-quest</div>
        </div>
      </div>
    </div>
  );
};

export default SherryMiniApp; 