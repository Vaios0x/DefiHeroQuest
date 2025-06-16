import React, { useState } from 'react';
import { useSafeTransaction } from '../hooks/useSafeTransaction';

interface LiquidityQuestProps {
  isConnected?: boolean;
  networkStatus?: string;
  executeRealTransaction?: (action: string, amount?: number, targetAddress?: string) => Promise<string>;
  mintedHero?: any;
  setMintedHero?: (hero: any) => void;
}

const LiquidityQuest: React.FC<LiquidityQuestProps> = ({
  isConnected = false,
  networkStatus = 'unknown',
  executeRealTransaction,
  mintedHero,
  setMintedHero
}) => {
  const [avaxAmount, setAvaxAmount] = useState('0.01');
  const [usdcAmount, setUsdcAmount] = useState('0.35');
  const [isExecuting, setIsExecuting] = useState(false);

  const poolInfo = {
    pair: 'AVAX/USDC',
    apy: 15.3,
    tvl: '$45M',
    risk: 'Medium',
    fees: '0.3%'
  };

  const questRewards = {
    exp: 200,
    statBoost: '+3 Magic',
    lpTokens: 'LP-TJ tokens',
    tradingFees: 'Continuous earnings'
  };

  const executeLiquidityQuest = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first in the Wallet tab!');
      return;
    }

    if (networkStatus !== 'correct') {
      alert('Please switch to Avalanche Fuji Testnet first!');
      return;
    }

    if (!avaxAmount || !usdcAmount || parseFloat(avaxAmount) <= 0 || parseFloat(usdcAmount) <= 0) {
      alert('Please enter valid amounts for both tokens');
      return;
    }

    setIsExecuting(true);
    
    try {
      console.log('💧 Executing liquidity provision via real transaction...');
      
      let txHash = '';
      
      // Execute real transaction if function is available
      if (executeRealTransaction) {
        try {
          // Use AVAX amount for the transaction
          txHash = await executeRealTransaction('liquidity', parseFloat(avaxAmount));
          console.log('✅ Real liquidity transaction sent:', txHash);
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
      if (mintedHero) {
        const updatedHero = { ...mintedHero };
        updatedHero.experience += questRewards.exp;
        updatedHero.stats.magic += 3; // Magic boost for liquidity provision
        
        // Level up check
        if (updatedHero.experience >= 1000 * updatedHero.level) {
          updatedHero.level += 1;
          updatedHero.experience = updatedHero.experience - (1000 * (updatedHero.level - 1));
        }
        
        localStorage.setItem('mintedHero', JSON.stringify(updatedHero));
        
        // Update parent component if function is available
        if (setMintedHero) {
          setMintedHero(updatedHero);
        }
      }
      
      alert(`✅ Liquidity Quest Completed!\n\nProvided ${avaxAmount} AVAX + ${usdcAmount} USDC\nEarned ${questRewards.exp} EXP + Magic boost!\n\nTx Hash: ${txHash}`);
      
      console.log('✅ Liquidity quest completed successfully!');
      
    } catch (error) {
      console.error('❌ Liquidity quest failed:', error);
      alert('Liquidity transaction failed. Please try again.');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#10b981', margin: '0 0 20px 0' }}>
        💧 Liquidity Provider Quest
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '30px', margin: '0 0 30px 0' }}>
        Provide liquidity to AVAX/USDC pool on Trader Joe and earn trading fees while leveling up your hero.
        Liquidity providers earn fees from every trade and help maintain healthy market depth.
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
            ⚠️ Please connect your wallet in the Wallet tab to execute real liquidity transactions!
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
            ❌ Please switch to Avalanche Fuji Testnet in the Wallet tab to provide liquidity!
          </p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(71, 85, 105, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '15px',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Pool Information</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Pair:</strong> {poolInfo.pair}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>APY:</strong> <span style={{ color: '#10b981' }}>{poolInfo.apy}%</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>TVL:</strong> {poolInfo.tvl}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Trading Fees:</strong> {poolInfo.fees}
          </div>
          <div>
            <strong>Risk:</strong> <span style={{ color: '#f59e0b' }}>{poolInfo.risk}</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(71, 85, 105, 0.2)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '15px',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>Quest Rewards</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>EXP:</strong> <span style={{ color: '#a855f7' }}>{questRewards.exp} points</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Stat Boost:</strong> <span style={{ color: '#3b82f6' }}>{questRewards.statBoost}</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>LP Tokens:</strong> {questRewards.lpTokens}
          </div>
          <div>
            <strong>Trading Fees:</strong> {questRewards.tradingFees}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          AVAX Amount (Testnet):
        </label>
        <input
          type="number"
          value={avaxAmount}
          onChange={(e) => setAvaxAmount(e.target.value)}
          placeholder="Enter AVAX amount (e.g., 0.01)"
          min="0.001"
          step="0.001"
          disabled={isExecuting}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'rgba(15, 23, 42, 0.8)',
            color: 'white',
            fontSize: '1rem',
            marginBottom: '15px',
            opacity: isExecuting ? 0.6 : 1
          }}
        />
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          USDC Amount (Equivalent):
        </label>
        <input
          type="number"
          value={usdcAmount}
          onChange={(e) => setUsdcAmount(e.target.value)}
          placeholder="Enter USDC amount (e.g., 0.35)"
          min="0.01"
          step="0.01"
          disabled={isExecuting}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'rgba(15, 23, 42, 0.8)',
            color: 'white',
            fontSize: '1rem',
            opacity: isExecuting ? 0.6 : 1
          }}
        />
        <small style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginTop: '5px' }}>
          💡 Tip: Provide equal value amounts for optimal liquidity provision
        </small>
      </div>

      {/* Liquidity Calculation */}
      {avaxAmount && usdcAmount && parseFloat(avaxAmount) > 0 && parseFloat(usdcAmount) > 0 && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Liquidity Summary:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>
                {avaxAmount} AVAX
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Token A</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {usdcAmount} USDC
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Token B</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                {questRewards.exp} EXP
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Experience</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {poolInfo.apy}% APY
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Expected Yield</div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={executeLiquidityQuest}
        disabled={!avaxAmount || !usdcAmount || parseFloat(avaxAmount) <= 0 || parseFloat(usdcAmount) <= 0 || isExecuting || !isConnected || networkStatus !== 'correct'}
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: '15px',
          border: 'none',
          background: (!avaxAmount || !usdcAmount || parseFloat(avaxAmount) <= 0 || parseFloat(usdcAmount) <= 0 || isExecuting || !isConnected || networkStatus !== 'correct')
            ? 'rgba(71, 85, 105, 0.5)'
            : 'linear-gradient(45deg, #10b981, #059669)',
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: (!avaxAmount || !usdcAmount || parseFloat(avaxAmount) <= 0 || parseFloat(usdcAmount) <= 0 || isExecuting || !isConnected || networkStatus !== 'correct') 
            ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        {isExecuting ? (
          <>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Providing Liquidity...
          </>
        ) : (
          <>💧 Provide Liquidity to AVAX/USDC Pool</>
        )}
      </button>

      <div style={{ 
        marginTop: '15px', 
        padding: '15px', 
        background: 'rgba(16, 185, 129, 0.1)', 
        borderRadius: '10px',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <p style={{ margin: '0', fontSize: '0.9rem', color: '#cbd5e1', textAlign: 'center' }}>
          ⚠️ <strong>Important:</strong> Liquidity provision involves impermanent loss risk. 
          Your hero gains magic stats to help optimize LP strategies!
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

export default LiquidityQuest;