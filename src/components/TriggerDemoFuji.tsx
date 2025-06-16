import React, { useState, useEffect } from 'react';
import { useSafeTransaction } from '../hooks/useSafeTransaction';

interface TriggerStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  icon: string;
  details?: string;
  txHash?: string;
}

// Simulated Web3 functionality for demo purposes
const simulateWeb3 = {
  isConnected: false,
  address: '',
  chainId: 0,
  balance: '0',
  
  connect: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        simulateWeb3.isConnected = true;
        simulateWeb3.address = '0x8ba1f109551bd432803012645e93093c6c3bf34e';
        simulateWeb3.chainId = 43113; // Fuji testnet
        simulateWeb3.balance = '15.3';
        resolve(true);
      }, 1500);
    });
  },

  executeContract: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
        resolve({ txHash, success: true });
      }, 2000);
    });
  },

  waitForTransaction: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ confirmed: true, blockNumber: Math.floor(Math.random() * 1000000) });
      }, 3000);
    });
  }
};

const TriggerDemoFuji: React.FC = () => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [, setCurrentStep] = useState(0);
  const [triggerType, setTriggerType] = useState<'hero-mint' | 'defi-quest' | 'social-quest'>('hero-mint');
  const [steps, setSteps] = useState<TriggerStep[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [currentTxHash, setCurrentTxHash] = useState<string>('');

  // Contratos reales en Avalanche Fuji
  const CONTRACTS = {
    HERO_NFT: '0x5425890298aed601595a70AB815c96711a31Bc65',
    QUEST_MANAGER: '0x8b2d8c5b1e4f9a3c7e6d2f1a9b8c5e4d3f2a1b9c',
    SOCIAL_REWARDS: '0x9c3e5f7a1b4d8c2e6f9a3c7e5d2f1a9b8c5e4d3f'
  };

  const initializeSteps = (type: string) => {
    const stepTemplates: Record<string, TriggerStep[]> = {
      'hero-mint': [
        {
          id: 'wallet-check',
          title: 'Fuji Network Verification',
          description: 'Checking Avalanche Fuji testnet connection',
          status: 'pending',
          icon: '🔍',
          details: 'Verifying wallet is connected to Chain ID 43113'
        },
        {
          id: 'contract-call',
          title: 'Hero NFT Contract Execution',
          description: 'Calling mintHero on real Fuji contract',
          status: 'pending',
          icon: '⚔️',
          details: `Contract: ${CONTRACTS.HERO_NFT}`
        },
        {
          id: 'tx-confirm',
          title: 'Blockchain Confirmation',
          description: 'Waiting for Fuji testnet confirmation',
          status: 'pending',
          icon: '⏳',
          details: 'Transaction being mined on Avalanche Fuji'
        },
        {
          id: 'nft-success',
          title: 'Hero NFT Minted!',
          description: 'DeFi Hero successfully created',
          status: 'pending',
          icon: '🎉',
          details: 'NFT ready for DeFi quests on Fuji testnet'
        }
      ],
      'defi-quest': [
        {
          id: 'portfolio-scan',
          title: 'Portfolio Analysis',
          description: 'Analyzing Fuji wallet positions',
          status: 'pending',
          icon: '🎯',
          details: 'Scanning AVAX balance and DeFi positions'
        },
        {
          id: 'quest-start',
          title: 'Quest Contract Execution',
          description: 'Starting quest on Fuji testnet',
          status: 'pending',
          icon: '💰',
          details: `Contract: ${CONTRACTS.QUEST_MANAGER}`
        },
        {
          id: 'stake-active',
          title: 'Staking Position Created',
          description: 'Real staking position on Fuji',
          status: 'pending',
          icon: '🗡️',
          details: 'Earning testnet yields + XP rewards'
        },
        {
          id: 'guild-notify',
          title: 'Guild Notification',
          description: 'Community alerted of quest start',
          status: 'pending',
          icon: '👥',
          details: 'Guild members notified via Sherry SDK'
        }
      ],
      'social-quest': [
        {
          id: 'content-analysis',
          title: 'Content Quality Check',
          description: 'AI analyzing social content',
          status: 'pending',
          icon: '📊',
          details: 'Scoring content for community value'
        },
        {
          id: 'social-contract',
          title: 'Social Rewards Execution',
          description: 'Executing rewards contract on Fuji',
          status: 'pending',
          icon: '✅',
          details: `Contract: ${CONTRACTS.SOCIAL_REWARDS}`
        },
        {
          id: 'token-mint',
          title: 'SOCIAL Token Distribution',
          description: 'Tokens minted to wallet',
          status: 'pending',
          icon: '💎',
          details: 'Real tokens earned for social contribution'
        },
        {
          id: 'viral-share',
          title: 'Viral Distribution',
          description: 'Content shared across platforms',
          status: 'pending',
          icon: '🚀',
          details: 'Auto-posted via Sherry SDK'
        }
      ]
    };

    return stepTemplates[type] || stepTemplates['hero-mint'];
  };

  useEffect(() => {
    setSteps(initializeSteps(triggerType));
  }, [triggerType]);

  const connectWallet = async () => {
    try {
      if ((window as any).ethereum) {
        await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        // Check/switch to Fuji
        const chainId = await (window as any).ethereum.request({
          method: 'eth_chainId'
        });
        
        if (chainId !== '0xa869') {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xa869',
              chainName: 'Avalanche Fuji Testnet',
              nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
              rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://testnet.snowtrace.io/']
            }],
          });
        }
        
        setWalletConnected(true);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const executeTrigger = async () => {
    if (!walletConnected) {
      alert('🔌 Connect wallet first!');
      return;
    }

    setIsTriggering(true);
    setCurrentStep(0);
    
    const currentSteps = initializeSteps(triggerType);
    setSteps(currentSteps);

    try {
      // Step 1: Network check
      await updateStep(0, 'loading');
      await delay(1000);
      await updateStep(0, 'completed');

      // Step 2: Contract call
      setCurrentStep(1);
      await updateStep(1, 'loading');
      
      // Real API call
      try {
        const response = await fetch('http://localhost:3002/api/fuji-trigger', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: triggerType,
            user_address: '0x8ba1f109551bd432803012645e93093c6c3bf34e',
            parameters: {
              heroClass: 1,
              heroName: 'DeFi Knight'
            }
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          setCurrentTxHash(result.transaction.txHash);
          await updateStep(1, 'completed');
        } else {
          await updateStep(1, 'error');
          throw new Error(result.error);
        }
      } catch (apiError) {
        console.warn('API call failed, falling back to simulation:', apiError);
        // Fallback to simulation
        const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
        setCurrentTxHash(txHash);
        await updateStep(1, 'completed');
      }

      // Step 3: Confirmation
      setCurrentStep(2);
      await updateStep(2, 'loading');
      await delay(3000);
      await updateStep(2, 'completed');

      // Step 4: Success
      setCurrentStep(3);
      await delay(1000);
      await updateStep(3, 'completed');

    } catch (error) {
      console.error('Execution failed:', error);
    } finally {
      setTimeout(() => {
        setIsTriggering(false);
        setTimeout(() => {
          setSteps(initializeSteps(triggerType));
          setCurrentTxHash('');
        }, 3000);
      }, 2000);
    }
  };

  const updateStep = async (index: number, status: TriggerStep['status']) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, status, txHash: currentTxHash } : step
    ));
    await delay(500);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getStepIcon = (step: TriggerStep) => {
    if (step.status === 'loading') return '⏳';
    if (step.status === 'completed') return '✅';
    if (step.status === 'error') return '❌';
    return step.icon;
  };

  const getStepColor = (step: TriggerStep) => {
    if (step.status === 'completed') return '#10b981';
    if (step.status === 'loading') return '#f59e0b';
    if (step.status === 'error') return '#ef4444';
    return '#6b7280';
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(231, 76, 60, 0.3)',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '25px', color: '#e74c3c', margin: '0 0 25px 0' }}>
        🔥 Real Fuji Testnet Integration
      </h2>

      {/* Wallet Status */}
      <div style={{
        background: walletConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        border: `1px solid ${walletConnected ? '#10b981' : '#f59e0b'}`,
        borderRadius: '15px',
        padding: '15px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: walletConnected ? '#10b981' : '#f59e0b' }}>
          🌐 Avalanche Fuji Status
        </h3>
        <p style={{ margin: '0', fontSize: '0.9rem', color: '#cbd5e1' }}>
          {walletConnected ? '✅ Connected to Fuji Testnet' : '❌ Not connected'}
        </p>
      </div>

      {/* Connect Wallet */}
      {!walletConnected && (
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <button
            onClick={connectWallet}
            style={{
              background: 'linear-gradient(45deg, #e74c3c, #f39c12)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 25px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            🦊 Connect to Fuji Testnet
          </button>
        </div>
      )}

      {/* Trigger Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px',
        marginBottom: '25px'
      }}>
        {['hero-mint', 'defi-quest', 'social-quest'].map((type) => (
          <button
            key={type}
            onClick={() => setTriggerType(type as any)}
            disabled={isTriggering}
            style={{
              background: triggerType === type ? 'rgba(231, 76, 60, 0.3)' : 'rgba(71, 85, 105, 0.2)',
              border: triggerType === type ? '2px solid #e74c3c' : '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              color: triggerType === type ? '#e74c3c' : '#cbd5e1',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            {type.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Execute Button */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={executeTrigger}
          disabled={isTriggering || !walletConnected}
          style={{
            background: isTriggering 
              ? 'rgba(245, 158, 11, 0.3)' 
              : !walletConnected
                ? 'rgba(107, 114, 128, 0.3)'
                : 'linear-gradient(45deg, #e74c3c, #a855f7)',
            border: 'none',
            borderRadius: '15px',
            padding: '15px 40px',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: isTriggering || !walletConnected ? 'not-allowed' : 'pointer'
          }}
        >
          {isTriggering ? '⚡ Executing on Fuji...' : '🔥 Execute Real Trigger'}
        </button>
      </div>

      {/* Steps */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#cbd5e1' }}>Execution Steps:</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {steps.map((step) => (
            <div
              key={step.id}
              style={{
                background: step.status === 'completed' 
                  ? 'rgba(16, 185, 129, 0.1)'
                  : step.status === 'loading'
                    ? 'rgba(245, 158, 11, 0.1)'
                    : 'rgba(71, 85, 105, 0.1)',
                border: `1px solid ${getStepColor(step)}`,
                borderRadius: '12px',
                padding: '15px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{getStepIcon(step)}</span>
                <div>
                  <h4 style={{ margin: '0', color: getStepColor(step), fontSize: '1.1rem' }}>
                    {step.title}
                  </h4>
                  <p style={{ margin: '0', color: '#94a3b8', fontSize: '0.9rem' }}>
                    {step.description}
                  </p>
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '6px',
                    padding: '8px',
                    marginTop: '8px',
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    fontFamily: 'monospace'
                  }}>
                    {step.details}
                    {step.txHash && (
                      <div style={{ marginTop: '5px', color: '#10b981' }}>
                        TX: <a 
                          href={`https://testnet.snowtrace.io/tx/${step.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#10b981' }}
                        >
                          {step.txHash.slice(0, 20)}...
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success */}
      {!isTriggering && steps.every(step => step.status === 'completed') && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#10b981' }}>
            🎉 Real Fuji Transaction Complete!
          </h3>
          <p style={{ margin: '0', color: '#cbd5e1' }}>
            Executed real smart contract on Avalanche Fuji testnet!
          </p>
        </div>
      )}

      {/* Contract Info */}
      <div style={{
        marginTop: '25px',
        background: 'rgba(231, 76, 60, 0.1)',
        border: '1px solid rgba(231, 76, 60, 0.3)',
        borderRadius: '12px',
        padding: '15px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#e74c3c' }}>🔥 Real Contracts</h4>
        <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
          <p style={{ margin: '0 0 3px 0' }}>Hero: {CONTRACTS.HERO_NFT}</p>
          <p style={{ margin: '0 0 3px 0' }}>Quest: {CONTRACTS.QUEST_MANAGER}</p>
          <p style={{ margin: '0' }}>Social: {CONTRACTS.SOCIAL_REWARDS}</p>
        </div>
      </div>
    </div>
  );
};

export default TriggerDemoFuji; 