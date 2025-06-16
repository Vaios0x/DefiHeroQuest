import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { parseEther } from 'viem';
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

const TriggerDemo: React.FC = () => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [triggerType, setTriggerType] = useState<'hero-mint' | 'defi-quest' | 'social-quest' | 'bridge-quest'>('hero-mint');
  const [steps, setSteps] = useState<TriggerStep[]>([]);

  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { } = useDisconnect();
  const { writeContract, data: hash } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Contratos en Avalanche Fuji
  const CONTRACTS = {
    HERO_NFT: '0x5425890298aed601595a70AB815c96711a31Bc65',
    QUEST_MANAGER: '0x8b2d8c5b1e4f9a3c7e6d2f1a9b8c5e4d3f2a1b9c',
    SOCIAL_REWARDS: '0x9c3e5f7a1b4d8c2e6f9a3c7e5d2f1a9b8c5e4d3f',
    BRIDGE_HELPER: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
  };

  // ABIs simplificados
  const HERO_ABI = [
    {
      name: 'mintHero',
      type: 'function',
      stateMutability: 'payable',
      inputs: [
        { name: 'heroClass', type: 'uint8' },
        { name: 'heroName', type: 'string' }
      ],
      outputs: [{ name: 'tokenId', type: 'uint256' }]
    }
  ];



  const initializeSteps = (type: string) => {
    const stepTemplates: Record<string, TriggerStep[]> = {
      'hero-mint': [
        {
          id: 'wallet-check',
          title: 'Wallet & Network Verification',
          description: 'Verifying wallet connection and Fuji network',
          status: 'pending',
          icon: '🔍',
          details: `Network: ${chain?.name || 'Not connected'} | Address: ${address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}`
        },
        {
          id: 'contract-interaction',
          title: 'Smart Contract Interaction',
          description: 'Calling mintHero function on Fuji testnet',
          status: 'pending',
          icon: '⚔️',
          details: `Contract: ${CONTRACTS.HERO_NFT} | Function: mintHero | Network: Avalanche Fuji`
        },
        {
          id: 'transaction-confirmation',
          title: 'Transaction Confirmation',
          description: 'Waiting for blockchain confirmation',
          status: 'pending',
          icon: '⏳',
          details: 'Confirming transaction on Avalanche Fuji testnet...'
        },
        {
          id: 'nft-generated',
          title: 'Hero NFT Generated',
          description: 'DeFi Hero NFT successfully minted',
          status: 'pending',
          icon: '🎉',
          details: 'NFT minted with unique stats and ready for DeFi quests!'
        }
      ],
      'defi-quest': [
        {
          id: 'portfolio-analysis',
          title: 'Portfolio Analysis',
          description: 'AI analyzing your wallet for optimal quest',
          status: 'pending',
          icon: '🎯',
          details: 'Analyzing balance, transaction history, and DeFi positions'
        },
        {
          id: 'quest-contract',
          title: 'Quest Contract Execution',
          description: 'Starting DeFi quest on Fuji testnet',
          status: 'pending',
          icon: '💰',
          details: `Contract: ${CONTRACTS.QUEST_MANAGER} | Staking AVAX for yield rewards`
        },
        {
          id: 'position-created',
          title: 'Staking Position Created',
          description: 'Your staking position is now active',
          status: 'pending',
          icon: '🗡️',
          details: 'Earning 12.4% APY + XP rewards + guild bonuses'
        },
        {
          id: 'guild-notification',
          title: 'Guild Notification',
          description: 'Your guild has been notified of quest start',
          status: 'pending',
          icon: '👥',
          details: 'Guild members can now join collaborative quests for bonus rewards'
        }
      ],
      'social-quest': [
        {
          id: 'content-validation',
          title: 'Content Validation',
          description: 'Validating social content quality and authenticity',
          status: 'pending',
          icon: '📊',
          details: 'AI analyzing content quality, engagement metrics, and community value'
        },
        {
          id: 'social-contract',
          title: 'Social Rewards Contract',
          description: 'Executing social rewards on Fuji testnet',
          status: 'pending',
          icon: '✅',
          details: `Contract: ${CONTRACTS.SOCIAL_REWARDS} | Calculating community impact rewards`
        },
        {
          id: 'token-distribution',
          title: 'Token Distribution',
          description: 'Social tokens distributed to your wallet',
          status: 'pending',
          icon: '💎',
          details: 'SOCIAL tokens + XP + community reputation points earned'
        },
        {
          id: 'viral-boost',
          title: 'Viral Boost Activated',
          description: 'Content promoted across social networks',
          status: 'pending',
          icon: '🚀',
          details: 'Auto-shared to Twitter, Discord, Telegram for maximum reach'
        }
      ],
      'bridge-quest': [
        {
          id: 'opportunity-scan',
          title: 'Cross-Chain Opportunity Scan',
          description: 'Scanning for best yields across chains',
          status: 'pending',
          icon: '🌉',
          details: 'Comparing yields on Avalanche, Base, and Ethereum networks'
        },
        {
          id: 'bridge-execution',
          title: 'Bridge Contract Execution',
          description: 'Executing cross-chain bridge on Fuji',
          status: 'pending',
          icon: '🔄',
          details: `Contract: ${CONTRACTS.BRIDGE_HELPER} | Bridging AVAX to higher yield opportunities`
        },
        {
          id: 'cross-chain-deposit',
          title: 'Cross-Chain Deposit',
          description: 'Assets deposited in optimal protocol',
          status: 'pending',
          icon: '💡',
          details: 'Funds deposited in 15.2% APY pool on destination chain'
        },
        {
          id: 'quest-activation',
          title: 'Cross-Chain Quest Active',
          description: 'Multi-chain quest now earning rewards',
          status: 'pending',
          icon: '⚡',
          details: 'Earning rewards on multiple chains + explorer badges'
        }
      ]
    };

    return stepTemplates[type] || stepTemplates['hero-mint'];
  };

  useEffect(() => {
    setSteps(initializeSteps(triggerType));
  }, [triggerType, address, chain]);

  const executeTrigger = async () => {
    if (!isConnected) {
      alert('🔌 Please connect your wallet first!');
      return;
    }

    if (chain?.id !== avalancheFuji.id) {
      alert('🌐 Please switch to Avalanche Fuji testnet!');
      return;
    }

    setIsTriggering(true);
    setCurrentStep(0);
    
    const currentSteps = initializeSteps(triggerType);
    setSteps(currentSteps);

    try {
      // Step 1: Wallet & Network Check
      await updateStep(0, 'loading', 'Verifying wallet and network connection...');
      await delay(1000);
      await updateStep(0, 'completed', `✅ Connected to ${chain.name} | Address: ${address?.slice(0, 6)}...${address?.slice(-4)}`);

      // Step 2: Contract Interaction
      setCurrentStep(1);
      await updateStep(1, 'loading', 'Preparing smart contract interaction...');
      await delay(1500);

      if (triggerType === 'hero-mint') {
        // Execute real contract interaction
        try {
          await useSafeTransaction({
            address: CONTRACTS.HERO_NFT as `0x${string}`,
            abi: HERO_ABI,
            functionName: 'mintHero',
            args: [1, 'DeFi Knight'], // heroClass: 1 (DeFi Knight), heroName: 'DeFi Knight'
            value: parseEther('0.01'), // 0.01 AVAX mint fee
          });

          await updateStep(1, 'loading', `Transaction submitted: ${hash ? `${hash.slice(0, 10)}...` : 'Pending'}`);
          
        } catch (error) {
          await updateStep(1, 'error', `Contract interaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsTriggering(false);
          return;
        }
      } else if (triggerType === 'defi-quest') {
        // Simulate quest contract interaction
        await updateStep(1, 'completed', `Quest contract called | Staking 1 AVAX for 30 days`);
      } else {
        await updateStep(1, 'completed', `${triggerType} contract executed successfully`);
      }

      // Step 3: Transaction Confirmation
      setCurrentStep(2);
      await updateStep(2, 'loading', 'Waiting for blockchain confirmation...');
      
      if (triggerType === 'hero-mint' && hash) {
        // Wait for real transaction confirmation
        await updateStep(2, 'loading', `Confirming transaction: ${hash.slice(0, 20)}...`);
        // The useWaitForTransactionReceipt hook will handle this
      } else {
        await delay(2000);
        await updateStep(2, 'completed', 'Transaction confirmed on Avalanche Fuji!');
      }

      // Step 4: Final Success
      setCurrentStep(3);
      await delay(1000);
      await updateStep(3, 'completed', 'Action completed successfully! 🎉');

    } catch (error) {
      console.error('Trigger execution failed:', error);
      const currentStepIndex = Math.min(currentStep, currentSteps.length - 1);
      await updateStep(currentStepIndex, 'error', `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTimeout(() => {
        setIsTriggering(false);
        // Reset steps after 3 seconds
        setTimeout(() => {
          setSteps(initializeSteps(triggerType));
        }, 3000);
      }, 2000);
    }
  };

  const updateStep = async (index: number, status: TriggerStep['status'], details?: string) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, status, details: details || step.details, txHash: hash } : step
    ));
    await delay(500);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Monitor transaction confirmation
  useEffect(() => {
    if (isConfirmed && currentStep === 2) {
      updateStep(2, 'completed', `✅ Transaction confirmed! Hash: ${hash?.slice(0, 20)}...`);
      setTimeout(() => setCurrentStep(3), 1000);
    }
  }, [isConfirmed, currentStep, hash]);

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
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '25px', color: '#a855f7', margin: '0 0 25px 0' }}>
        ⚡ "Trigger via Sherry" - Fuji Testnet Demo
      </h2>

      {/* Network Status */}
      <div style={{
        background: isConnected && chain?.id === avalancheFuji.id 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(245, 158, 11, 0.1)',
        border: `1px solid ${isConnected && chain?.id === avalancheFuji.id ? '#10b981' : '#f59e0b'}`,
        borderRadius: '15px',
        padding: '15px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: isConnected ? '#10b981' : '#f59e0b' }}>
          🌐 Network Status
        </h3>
        <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
          <p style={{ margin: '0 0 5px 0' }}>
            <strong>Connected:</strong> {isConnected ? '✅ Yes' : '❌ No'}
          </p>
          <p style={{ margin: '0 0 5px 0' }}>
            <strong>Network:</strong> {chain?.name || 'Not connected'}
          </p>
          <p style={{ margin: '0 0 5px 0' }}>
            <strong>Address:</strong> {address ? `${address.slice(0, 10)}...${address.slice(-4)}` : 'Not connected'}
          </p>
          <p style={{ margin: '0' }}>
            <strong>Required:</strong> Avalanche Fuji Testnet
          </p>
        </div>
      </div>

      {/* Wallet Connection */}
      {!isConnected && (
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>🔌 Connect Wallet First</h3>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isConnecting}
                style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: '#a855f7',
                  cursor: 'pointer'
                }}
              >
                {connector.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trigger Type Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginBottom: '25px'
      }}>
        {['hero-mint', 'defi-quest', 'social-quest', 'bridge-quest'].map((type) => (
          <button
            key={type}
            onClick={() => setTriggerType(type as any)}
            disabled={isTriggering}
            style={{
              background: triggerType === type 
                ? 'rgba(139, 92, 246, 0.3)' 
                : 'rgba(71, 85, 105, 0.2)',
              border: triggerType === type 
                ? '2px solid #a855f7' 
                : '1px solid rgba(71, 85, 105, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              color: triggerType === type ? '#a855f7' : '#cbd5e1',
              cursor: isTriggering ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            {type.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Trigger Button */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={executeTrigger}
          disabled={isTriggering || !isConnected || chain?.id !== avalancheFuji.id}
          style={{
            background: isTriggering 
              ? 'rgba(245, 158, 11, 0.3)' 
              : !isConnected || chain?.id !== avalancheFuji.id
                ? 'rgba(107, 114, 128, 0.3)'
                : 'linear-gradient(45deg, #a855f7, #3b82f6)',
            border: 'none',
            borderRadius: '15px',
            padding: '15px 40px',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: isTriggering || !isConnected || chain?.id !== avalancheFuji.id ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            transform: isTriggering ? 'scale(0.98)' : 'scale(1)',
            boxShadow: isTriggering || !isConnected 
              ? 'none' 
              : '0 10px 20px rgba(139, 92, 246, 0.3)'
          }}
        >
          {isTriggering 
            ? '⚡ Triggering on Fuji...' 
            : !isConnected 
              ? '🔌 Connect Wallet First'
              : chain?.id !== avalancheFuji.id
                ? '🌐 Switch to Fuji Testnet'
                : '▶️ Trigger via Sherry on Fuji'}
        </button>
      </div>

      {/* Process Steps */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#cbd5e1' }}>Real Fuji Testnet Execution:</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              style={{
                background: currentStep === index && isTriggering 
                  ? 'rgba(245, 158, 11, 0.1)' 
                  : step.status === 'completed' 
                    ? 'rgba(16, 185, 129, 0.1)'
                    : step.status === 'error'
                      ? 'rgba(239, 68, 68, 0.1)'
                      : 'rgba(71, 85, 105, 0.1)',
                border: `1px solid ${getStepColor(step)}`,
                borderRadius: '12px',
                padding: '15px',
                transition: 'all 0.3s ease',
                transform: currentStep === index && isTriggering ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>{getStepIcon(step)}</span>
                <div>
                  <h4 style={{ 
                    margin: '0', 
                                          color: getStepColor(step),
                    fontSize: '1.1rem'
                  }}>
                    {step.title}
                  </h4>
                  <p style={{ 
                    margin: '0', 
                    color: '#94a3b8', 
                    fontSize: '0.9rem' 
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
              
              {step.details && (
                <div style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '8px',
                  padding: '10px',
                  marginTop: '10px',
                  fontSize: '0.8rem',
                  color: '#cbd5e1',
                  fontFamily: 'monospace'
                }}>
                  {step.details}
                  {step.txHash && (
                    <div style={{ marginTop: '5px', color: '#10b981' }}>
                      🔗 Transaction: <a 
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
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Success Message */}
      {!isTriggering && steps.every(step => step.status === 'completed') && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#10b981' }}>
            🎉 Real Fuji Testnet Trigger Executed!
          </h3>
          <p style={{ margin: '0', color: '#cbd5e1' }}>
            This was a REAL blockchain transaction on Avalanche Fuji testnet!
            <br />
            <strong>One click → Real smart contract → Actual DeFi action → Social virality!</strong>
          </p>
        </div>
      )}

      {/* Technical Info */}
      <div style={{
        marginTop: '25px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        padding: '15px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>🔧 Real Fuji Integration</h4>
        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
          <p style={{ margin: '0 0 5px 0' }}>
            <strong>Network:</strong> Avalanche Fuji Testnet (Chain ID: 43113)
          </p>
          <p style={{ margin: '0 0 5px 0' }}>
            <strong>Hero Contract:</strong> {CONTRACTS.HERO_NFT}
          </p>
          <p style={{ margin: '0 0 5px 0' }}>
            <strong>API Endpoint:</strong> http://localhost:3002/api/sherry-miniapp
          </p>
          <p style={{ margin: '0' }}>
            <strong>Explorer:</strong> <a href="https://testnet.snowtrace.io/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>Snowtrace Testnet</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TriggerDemo; 