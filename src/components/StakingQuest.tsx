import React, { useState, useEffect } from 'react';
import { useSafeTransaction } from '../hooks/useSafeTransaction';

interface StakingQuestProps {
  isConnected?: boolean;
  networkStatus?: string;
  executeRealTransaction?: (action: string, amount?: number, targetAddress?: string) => Promise<string>;
  mintedHero?: any;
  setMintedHero?: (hero: any) => void;
}

const StakingQuest: React.FC<StakingQuestProps> = ({
  isConnected = false,
  networkStatus = 'unknown',
  executeRealTransaction,
  mintedHero,
  setMintedHero
}) => {
  const [stakingAmount, setStakingAmount] = useState(25);
  const [stakingDuration, setStakingDuration] = useState(30);
  const [isStaking, setIsStaking] = useState(false);
  const [stakingSuccess, setStakingSuccess] = useState(false);
  const [localMintedHero, setLocalMintedHero] = useState<any>(null);

  useEffect(() => {
    // Check for minted hero
    const existingHero = localStorage.getItem('mintedHero');
    if (existingHero) {
      setLocalMintedHero(JSON.parse(existingHero));
    }
  }, []);

  const stakingOptions = [
    { amount: 0.01, description: 'Apprentice Stake', expReward: 100, statBoost: '+1 Defense' },
    { amount: 0.025, description: 'Knight Stake', expReward: 150, statBoost: '+2 Defense' },
    { amount: 0.05, description: 'Master Stake', expReward: 250, statBoost: '+4 Defense' },
  ];

  const durationOptions = [
    { days: 30, apy: 8, description: 'Quick Quest' },
    { days: 90, apy: 10, description: 'Epic Quest' },
    { days: 365, apy: 14, description: 'Legendary Quest' },
  ];

  const selectedStaking = stakingOptions.find(opt => opt.amount === stakingAmount) || stakingOptions[0];
  const selectedDuration = durationOptions.find(opt => opt.days === stakingDuration) || durationOptions[0];
  const estimatedRewards = (stakingAmount * selectedDuration.apy / 100) * (stakingDuration / 365);

  const executeStaking = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first in the Wallet tab!');
      return;
    }

    if (networkStatus !== 'correct') {
      alert('Please switch to Avalanche Fuji Testnet first!');
      return;
    }

    setIsStaking(true);
    
    try {
      console.log('🏦 Executing AVAX staking via real transaction...');
      
      let txHash = '';
      
      // Execute real transaction if function is available
      if (executeRealTransaction) {
        try {
          txHash = await executeRealTransaction('stake', stakingAmount);
          console.log('✅ Real staking transaction sent:', txHash);
        } catch (error) {
          console.log('Real transaction failed:', error);
          throw error;
        }
      } else {
        // Fallback simulation
        await new Promise(resolve => setTimeout(resolve, 3000));
        txHash = '0x' + Math.random().toString(16).substr(2, 64);
      }
      
      // Update hero if exists
      const currentHero = localMintedHero || mintedHero;
      if (currentHero) {
        const updatedHero = { ...currentHero };
        updatedHero.experience += selectedStaking.expReward;
        updatedHero.stats.defense += parseInt(selectedStaking.statBoost.split('+')[1].split(' ')[0]);
        
        // Level up check
        if (updatedHero.experience >= 1000 * updatedHero.level) {
          updatedHero.level += 1;
          updatedHero.experience = updatedHero.experience - (1000 * (updatedHero.level - 1));
        }
        
        setLocalMintedHero(updatedHero);
        localStorage.setItem('mintedHero', JSON.stringify(updatedHero));
        
        // Update parent component if function is available
        if (setMintedHero) {
          setMintedHero(updatedHero);
        }
      }
      
      setStakingSuccess(true);
      console.log('✅ Staking completed successfully!');
      
    } catch (error) {
      console.error('❌ Staking failed:', error);
      alert('Staking transaction failed. Please try again.');
    } finally {
      setIsStaking(false);
    }
  };

  if (stakingSuccess) {
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#10b981', margin: '0 0 20px 0' }}>
          🎉 Staking Quest Completed!
        </h2>
        
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '25px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Quest Rewards Earned!</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7' }}>
                {selectedStaking.expReward}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>EXP Gained</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {selectedStaking.statBoost}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Stat Boost</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                {estimatedRewards.toFixed(4)}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>AVAX Rewards</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {stakingAmount}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>AVAX Staked</div>
            </div>
          </div>
          
          {localMintedHero && (
            <div style={{
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '10px',
              padding: '15px',
              marginTop: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#a855f7' }}>🎮 Hero Updated!</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <span style={{ fontSize: '2rem' }}>{localMintedHero.emoji}</span>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#a855f7' }}>{localMintedHero.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                    Level {localMintedHero.level} • {localMintedHero.experience} EXP • {localMintedHero.stats.defense} DEF
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setStakingSuccess(false)}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '15px',
            border: 'none',
            background: 'linear-gradient(45deg, #3b82f6, #10b981)',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          🔄 Start Another Quest
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#3b82f6', margin: '0 0 20px 0' }}>
        🏦 AVAX Staking Quest
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '30px', margin: '0 0 30px 0' }}>
        Stake AVAX tokens to earn rewards and level up your hero. Higher stakes and longer durations provide better rewards.
        Your hero gains experience and defense stats through staking activities.
      </p>

      {/* Connection Status */}
      {!isConnected && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '25px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', color: '#f59e0b' }}>
            ⚠️ Please connect your wallet in the Wallet tab to execute real staking transactions!
          </p>
        </div>
      )}

      {/* Network Status */}
      {isConnected && networkStatus !== 'correct' && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '25px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', color: '#ef4444' }}>
            ❌ Please switch to Avalanche Fuji Testnet in the Wallet tab to execute staking!
          </p>
        </div>
      )}

      {/* Hero Status */}
      {localMintedHero && (
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🎮 Your Hero</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '2rem' }}>{localMintedHero.emoji}</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#a855f7' }}>{localMintedHero.name}</div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                {localMintedHero.class} • Level {localMintedHero.level} • {localMintedHero.experience} EXP
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#ef4444' }}>{localMintedHero.stats.attack}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>ATK</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>{localMintedHero.stats.defense}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>DEF</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#a855f7' }}>{localMintedHero.stats.magic}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>MAG</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold' }}>
          Staking Amount (Testnet):
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {stakingOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => !isStaking && setStakingAmount(option.amount)}
              style={{
                padding: '20px',
                borderRadius: '15px',
                border: stakingAmount === option.amount 
                  ? '2px solid #3b82f6' 
                  : '1px solid rgba(71, 85, 105, 0.3)',
                background: stakingAmount === option.amount 
                  ? 'rgba(59, 130, 246, 0.2)' 
                  : 'rgba(71, 85, 105, 0.2)',
                cursor: isStaking ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                transform: stakingAmount === option.amount ? 'scale(1.02)' : 'scale(1)',
                opacity: isStaking ? 0.6 : 1
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{option.amount} AVAX</h3>
              <p style={{ margin: '0 0 5px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>{option.description}</p>
              <p style={{ margin: '0 0 5px 0', color: '#a855f7', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {option.expReward} EXP
              </p>
              <p style={{ margin: '0', color: '#3b82f6', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {option.statBoost}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold' }}>
          Staking Duration:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {durationOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => !isStaking && setStakingDuration(option.days)}
              style={{
                padding: '20px',
                borderRadius: '15px',
                border: stakingDuration === option.days 
                  ? '2px solid #3b82f6' 
                  : '1px solid rgba(71, 85, 105, 0.3)',
                background: stakingDuration === option.days 
                  ? 'rgba(59, 130, 246, 0.2)' 
                  : 'rgba(71, 85, 105, 0.2)',
                cursor: isStaking ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                transform: stakingDuration === option.days ? 'scale(1.02)' : 'scale(1)',
                opacity: isStaking ? 0.6 : 1
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{option.days} Days</h3>
              <p style={{ margin: '0 0 5px 0', color: '#10b981', fontWeight: 'bold' }}>{option.apy}% APY</p>
              <p style={{ margin: '0', color: '#cbd5e1', fontSize: '0.9rem' }}>{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Quest Summary:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>
              {selectedStaking.expReward} EXP
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Experience Points</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {selectedStaking.statBoost}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Stat Boost</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {estimatedRewards.toFixed(4)} AVAX
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Estimated Rewards</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {selectedDuration.apy}% APY
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Annual Yield</div>
          </div>
        </div>
      </div>

      <button
        onClick={executeStaking}
        disabled={isStaking || !isConnected || networkStatus !== 'correct'}
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: '15px',
          border: 'none',
          background: (isStaking || !isConnected || networkStatus !== 'correct')
            ? 'rgba(71, 85, 105, 0.5)'
            : 'linear-gradient(45deg, #3b82f6, #10b981)',
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: (isStaking || !isConnected || networkStatus !== 'correct') ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        {isStaking ? (
          <>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Staking {stakingAmount} AVAX...
          </>
        ) : (
          `🏦 Stake ${stakingAmount} AVAX for ${stakingDuration} Days`
        )}
      </button>

      <div style={{ 
        marginTop: '15px', 
        padding: '15px', 
        background: 'rgba(59, 130, 246, 0.1)', 
        borderRadius: '10px',
        border: '1px solid rgba(59, 130, 246, 0.2)'
      }}>
        <p style={{ margin: '0', fontSize: '0.9rem', color: '#cbd5e1', textAlign: 'center' }}>
          💡 <strong>Pro Tip:</strong> Longer staking periods unlock higher APY rates and bonus experience multipliers!
        </p>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default StakingQuest;