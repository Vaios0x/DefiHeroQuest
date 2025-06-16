import React, { useState, useEffect } from 'react';

interface AIAgent {
  id: string;
  name: string;
  type: 'portfolio' | 'social' | 'trading' | 'yield' | 'bridge';
  status: 'active' | 'idle' | 'executing' | 'paused';
  description: string;
  capabilities: string[];
  lastAction: string;
  performance: {
    successRate: number;
    totalExecutions: number;
    avgProfit: number;
  };
  triggers: string[];
}

const AgentInfrastructure: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);

  useEffect(() => {
    initializeAgents();
    
    // Simulate agent activity
    const interval = setInterval(() => {
      updateAgentActivity();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const initializeAgents = () => {
    const defaultAgents: AIAgent[] = [
      {
        id: 'portfolio-optimizer',
        name: '🤖 Portfolio Optimizer Agent',
        type: 'portfolio',
        status: 'active',
        description: 'AI agent that automatically rebalances portfolios based on market conditions and social sentiment',
        capabilities: [
          'Real-time portfolio analysis',
          'Social sentiment integration',
          'Cross-chain optimization',
          'Risk management',
          'Automated rebalancing'
        ],
        lastAction: 'Rebalanced portfolio for 15% APY improvement',
        performance: {
          successRate: 0.89,
          totalExecutions: 247,
          avgProfit: 12.3
        },
        triggers: ['portfolio-rebalance', 'risk-adjustment', 'yield-optimization']
      },
      {
        id: 'social-yield-agent',
        name: '📱 Social Yield Agent',
        type: 'social',
        status: 'executing',
        description: 'Monitors social platforms for yield opportunities and executes community-validated strategies',
        capabilities: [
          'Social platform monitoring',
          'Community validation',
          'Viral trigger execution',
          'Sentiment analysis',
          'Automated sharing'
        ],
        lastAction: 'Executed viral staking trigger from Discord',
        performance: {
          successRate: 0.92,
          totalExecutions: 156,
          avgProfit: 8.7
        },
        triggers: ['social-stake', 'viral-quest', 'community-action']
      },
      {
        id: 'cross-chain-bridge-agent',
        name: '🌉 Cross-Chain Bridge Agent',
        type: 'bridge',
        status: 'active',
        description: 'Automatically bridges assets across chains based on yield opportunities and user preferences',
        capabilities: [
          'Multi-chain monitoring',
          'Optimal bridge routing',
          'Gas optimization',
          'Yield arbitrage',
          'Automated execution'
        ],
        lastAction: 'Bridged 50 AVAX to Base for 18% APY',
        performance: {
          successRate: 0.94,
          totalExecutions: 89,
          avgProfit: 15.2
        },
        triggers: ['cross-chain-bridge', 'yield-arbitrage', 'gas-optimization']
      },
      {
        id: 'defi-trading-agent',
        name: '📈 DeFi Trading Agent',
        type: 'trading',
        status: 'idle',
        description: 'Executes DeFi trading strategies with social proof validation and community insights',
        capabilities: [
          'Automated trading',
          'Social proof validation',
          'MEV protection',
          'Slippage optimization',
          'Community insights'
        ],
        lastAction: 'Executed profitable swap with 5.2% gain',
        performance: {
          successRate: 0.87,
          totalExecutions: 312,
          avgProfit: 6.8
        },
        triggers: ['defi-swap', 'arbitrage-opportunity', 'social-trade']
      }
    ];

    setAgents(defaultAgents);
  };

  const updateAgentActivity = () => {
    setAgents(prev => prev.map(agent => {
      // Randomly update agent status and performance
      const statuses: AIAgent['status'][] = ['active', 'idle', 'executing'];
      const newStatus = Math.random() > 0.7 ? statuses[Math.floor(Math.random() * statuses.length)] : agent.status;
      
      return {
        ...agent,
        status: newStatus,
        performance: {
          ...agent.performance,
          totalExecutions: agent.performance.totalExecutions + (Math.random() > 0.8 ? 1 : 0),
          avgProfit: agent.performance.avgProfit + (Math.random() - 0.5) * 0.5
        }
      };
    }));
  };

  const createNewAgent = async () => {
    setIsCreatingAgent(true);
    
    try {
      // Simulate agent creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newAgent: AIAgent = {
        id: `agent-${Date.now()}`,
        name: '🆕 Custom Agent',
        type: 'yield',
        status: 'idle',
        description: 'Custom AI agent created for specific DeFi strategies',
        capabilities: ['Custom logic', 'User-defined triggers', 'Adaptive learning'],
        lastAction: 'Agent created and initialized',
        performance: {
          successRate: 0,
          totalExecutions: 0,
          avgProfit: 0
        },
        triggers: ['custom-trigger']
      };
      
      setAgents(prev => [...prev, newAgent]);
      alert('✅ New AI agent created successfully!');
      
    } catch (error) {
      console.error('Agent creation failed:', error);
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const getStatusColor = (status: AIAgent['status']) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'executing': return '#3b82f6';
      case 'idle': return '#6b7280';
      case 'paused': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type: AIAgent['type']) => {
    switch (type) {
      case 'portfolio': return '#a855f7';
      case 'social': return '#10b981';
      case 'trading': return '#ef4444';
      case 'yield': return '#f59e0b';
      case 'bridge': return '#3b82f6';
      default: return '#6b7280';
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
        🤖 Agent-Ready Infrastructure
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '30px', margin: '0 0 30px 0' }}>
        <strong>🏆 WINNING FEATURE:</strong> Reusable triggers designed for bots and AI agents to execute. 
        The future of autonomous DeFi is here - agents that understand social context and execute with precision.
      </p>

      {/* Minithon Agent Features Banner */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        border: '2px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🎯 Sherry Minithon: Agent-Ready Excellence</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🤖</div>
            <div style={{ fontWeight: 'bold', color: '#a855f7' }}>AI Agent Compatible</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Bots can execute triggers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔄</div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>Autonomous Execution</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>No human intervention needed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📱</div>
            <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>Social Context Aware</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Understands social signals</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>⚡</div>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>Reusable Triggers</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Modular and composable</div>
          </div>
        </div>
      </div>

      {/* Agent Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: `1px solid ${getTypeColor(agent.type)}40`,
              borderRadius: '15px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: selectedAgent?.id === agent.id ? 'scale(1.02)' : 'scale(1)',
              borderWidth: selectedAgent?.id === agent.id ? '2px' : '1px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 5px 0', color: getTypeColor(agent.type), fontSize: '1.1rem' }}>
                {agent.name}
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: `${getStatusColor(agent.status)}20`,
                padding: '4px 8px',
                borderRadius: '8px',
                border: `1px solid ${getStatusColor(agent.status)}40`
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: getStatusColor(agent.status),
                  animation: agent.status === 'executing' ? 'pulse 2s infinite' : 'none'
                }} />
                <span style={{
                  fontSize: '0.8rem',
                  color: getStatusColor(agent.status),
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {agent.status}
                </span>
              </div>
            </div>

            <p style={{ margin: '0 0 15px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
              {agent.description}
            </p>

            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#a855f7', marginBottom: '5px' }}>
                Last Action:
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                {agent.lastAction}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>
                  {Math.round(agent.performance.successRate * 100)}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Success Rate</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {agent.performance.totalExecutions}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Executions</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                  {agent.performance.avgProfit.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Avg Profit</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {agent.triggers.slice(0, 3).map((trigger, index) => (
                <span
                  key={index}
                  style={{
                    background: `${getTypeColor(agent.type)}20`,
                    border: `1px solid ${getTypeColor(agent.type)}40`,
                    borderRadius: '8px',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    color: getTypeColor(agent.type)
                  }}
                >
                  {trigger}
                </span>
              ))}
              {agent.triggers.length > 3 && (
                <span style={{
                  background: 'rgba(107, 114, 128, 0.2)',
                  border: '1px solid rgba(107, 114, 128, 0.4)',
                  borderRadius: '8px',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  color: '#6b7280'
                }}>
                  +{agent.triggers.length - 3}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Agent Details */}
      {selectedAgent && (
        <div style={{
          background: 'rgba(71, 85, 105, 0.2)',
          border: `2px solid ${getTypeColor(selectedAgent.type)}`,
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '25px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: getTypeColor(selectedAgent.type) }}>
            Agent Details: {selectedAgent.name}
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Capabilities:</h4>
              <div style={{ display: 'grid', gap: '5px' }}>
                {selectedAgent.capabilities.map((capability, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{capability}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Available Triggers:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedAgent.triggers.map((trigger, index) => (
                  <span
                    key={index}
                    style={{
                      background: `${getTypeColor(selectedAgent.type)}20`,
                      border: `1px solid ${getTypeColor(selectedAgent.type)}40`,
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '0.8rem',
                      color: getTypeColor(selectedAgent.type)
                    }}
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            background: `${getTypeColor(selectedAgent.type)}10`,
            border: `1px solid ${getTypeColor(selectedAgent.type)}30`,
            borderRadius: '10px',
            padding: '15px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: getTypeColor(selectedAgent.type) }}>
              🤖 Agent Execution Model:
            </h4>
            <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div>🔍 <strong>Monitoring:</strong> Continuously scans for trigger conditions</div>
              <div>📊 <strong>Analysis:</strong> Evaluates social context and market conditions</div>
              <div>✅ <strong>Validation:</strong> Confirms trigger parameters and safety checks</div>
              <div>⚡ <strong>Execution:</strong> Automatically executes approved triggers</div>
              <div>📈 <strong>Learning:</strong> Adapts strategy based on performance feedback</div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Agent */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>🆕 Create Custom AI Agent</h3>
        <p style={{ margin: '0 0 15px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
          Deploy your own AI agent with custom triggers and strategies. Agents can execute any Sherry trigger autonomously.
        </p>
        
        <button
          onClick={createNewAgent}
          disabled={isCreatingAgent}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: isCreatingAgent 
              ? 'rgba(71, 85, 105, 0.5)' 
              : 'linear-gradient(45deg, #10b981, #059669)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: isCreatingAgent ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isCreatingAgent ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Creating Agent...
            </>
          ) : (
            <>🤖 Create New AI Agent</>
          )}
        </button>
      </div>

      {/* Agent Infrastructure Benefits */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🚀 Agent-Ready Infrastructure Benefits</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981' }}>✅</span>
            <span style={{ color: '#cbd5e1' }}>24/7 autonomous execution without human intervention</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981' }}>✅</span>
            <span style={{ color: '#cbd5e1' }}>Social context awareness for better decision making</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981' }}>✅</span>
            <span style={{ color: '#cbd5e1' }}>Reusable trigger system for maximum flexibility</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981' }}>✅</span>
            <span style={{ color: '#cbd5e1' }}>Cross-chain execution capabilities</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981' }}>✅</span>
            <span style={{ color: '#cbd5e1' }}>Performance tracking and adaptive learning</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#10b981' }}>✅</span>
            <span style={{ color: '#cbd5e1' }}>Built-in safety mechanisms and risk management</span>
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
            🎯 "Agent-Ready Infrastructure" - The future of DeFi is autonomous. 
            AI agents that understand social context and execute with precision, 24/7.
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default AgentInfrastructure;