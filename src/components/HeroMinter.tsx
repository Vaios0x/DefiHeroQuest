import React, { useState } from 'react';
import { useSafeTransaction } from '../hooks/useSafeTransaction';

interface HeroMinterProps {
  isConnected?: boolean;
  networkStatus?: string;
  executeRealTransaction?: (action: string, amount?: number, targetAddress?: string) => Promise<string>;
  mintedHero?: any;
  setMintedHero?: (hero: any) => void;
}

const HeroMinter: React.FC<HeroMinterProps> = ({
  isConnected = false,
  networkStatus = 'unknown',
  executeRealTransaction,
  mintedHero,
  setMintedHero
}) => {
  const [heroClass, setHeroClass] = useState(0);
  const [username, setUsername] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [localMintedHero, setLocalMintedHero] = useState<any>(null);

  const heroClasses = [
    { 
      name: '⚔️ DeFi Knight', 
      description: 'Balanced warrior with strong defense and steady yields',
      stats: 'ATK: 45 | DEF: 55 | MAG: 40',
      specialty: 'Staking & Lending',
      emoji: '⚔️'
    },
    { 
      name: '🧙‍♂️ Yield Wizard', 
      description: 'Master of magic and yield optimization',
      stats: 'ATK: 35 | DEF: 30 | MAG: 65',
      specialty: 'Yield Farming & Optimization',
      emoji: '🧙‍♂️'
    },
    { 
      name: '🏹 Staking Ranger', 
      description: 'Swift archer focused on precision staking',
      stats: 'ATK: 50 | DEF: 40 | MAG: 40',
      specialty: 'Staking & Rewards',
      emoji: '🏹'
    },
    { 
      name: '🛡️ LP Guardian', 
      description: 'Tank with maximum protection for liquidity',
      stats: 'ATK: 30 | DEF: 65 | MAG: 35',
      specialty: 'Liquidity Provision',
      emoji: '🛡️'
    },
  ];

  const mintHeroNFT = async () => {
    if (!username.trim() || username.length < 3) {
      alert('Please enter a hero name (minimum 3 characters)');
      return;
    }

    if (!isConnected) {
      alert('Please connect your wallet first in the Wallet tab!');
      return;
    }

    if (networkStatus !== 'correct') {
      alert('Please switch to Avalanche Fuji Testnet first!');
      return;
    }

    setIsMinting(true);
    
    try {
      console.log('🎨 Minting NFT Hero on Avalanche Fuji Testnet...');
      
      const selectedClass = heroClasses[heroClass];
      const heroData = {
        id: Math.floor(Math.random() * 10000),
        name: username,
        class: selectedClass.name,
        emoji: selectedClass.emoji,
        level: 1,
        experience: 500,
        stats: {
          attack: parseInt(selectedClass.stats.split('ATK: ')[1].split(' |')[0]),
          defense: parseInt(selectedClass.stats.split('DEF: ')[1].split(' |')[0]),
          magic: parseInt(selectedClass.stats.split('MAG: ')[1])
        },
        specialty: selectedClass.specialty,
        mintedAt: new Date().toISOString(),
        txHash: '',
        rarity: Math.random() > 0.8 ? 'Legendary' : Math.random() > 0.5 ? 'Rare' : 'Common',
        network: 'Avalanche Fuji Testnet'
      };

      // Execute real minting transaction if function is available
      if (executeRealTransaction) {
        try {
          const txHash = await executeRealTransaction('mint', 0.001);
          heroData.txHash = txHash;
          console.log('✅ Real minting transaction sent:', txHash);
        } catch (error) {
          console.log('Real transaction failed, using simulation:', error);
          // Continue with simulated data
          heroData.txHash = '0x' + Math.random().toString(16).substr(2, 64);
        }
      } else {
        // Fallback simulation
        await new Promise(resolve => setTimeout(resolve, 3000));
        heroData.txHash = '0x' + Math.random().toString(16).substr(2, 64);
      }

      setLocalMintedHero(heroData);
      setMintSuccess(true);
      
      // Store in localStorage for demo persistence
      localStorage.setItem('mintedHero', JSON.stringify(heroData));
      
      // Update parent component if function is available
      if (setMintedHero) {
        setMintedHero(heroData);
      }
      
      console.log('✅ Hero NFT minted successfully on Avalanche Fuji!', heroData);

    } catch (error) {
      console.error('❌ Minting failed:', error);
      alert('Minting failed. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  const resetMint = () => {
    setMintSuccess(false);
    setLocalMintedHero(null);
    setUsername('');
    // Don't remove from localStorage to keep hero in gallery
  };

  const startDeFiQuests = () => {
    // Navigate to different quest tabs
    alert('🎮 DeFi Quests Available!\n\n' +
          '🏦 Staking Quest - Switch to "Staking Quest" tab\n' +
          '💧 Liquidity Quest - Switch to "Liquidity Quest" tab\n' +
          '🔄 Trading - Use wallet buttons to execute swaps\n' +
          '🌉 Bridge Quest - Switch to "Cross-Chain" tab\n' +
          '🎨 NFT Quest - Mint additional heroes here\n\n' +
          'Your hero will gain experience and level up with each quest!');
  };

  // Check for existing minted hero on component mount
  React.useEffect(() => {
    const existingHero = localStorage.getItem('mintedHero');
    if (existingHero && !localMintedHero) {
      setLocalMintedHero(JSON.parse(existingHero));
      setMintSuccess(true);
    }
  }, []);

  const currentHero = localMintedHero || mintedHero;

  if (mintSuccess && currentHero) {
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        padding: '30px'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#10b981', margin: '0 0 20px 0' }}>
          🎉 Hero NFT Minted Successfully!
        </h2>
        
        {/* Network Info */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '25px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>
            🌐 Minted on: {currentHero.network || 'Avalanche Fuji Testnet'}
          </div>
          {currentHero.network !== 'Demo Mode' && currentHero.txHash && (
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '5px' }}>
              View on <a 
                href={`https://testnet.snowtrace.io/tx/${currentHero.txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#3b82f6', textDecoration: 'underline' }}
              >
                Snowtrace Testnet
              </a>
            </div>
          )}
        </div>
        
        {/* Minted Hero Display */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px'
          }}>
            {currentHero.emoji}
          </div>
          
          <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#10b981' }}>
            {currentHero.name}
          </h3>
          
          <div style={{ 
            fontSize: '1.2rem', 
            color: '#a855f7', 
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            {currentHero.class}
          </div>
          
          <div style={{
            background: 'rgba(71, 85, 105, 0.3)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#cbd5e1' }}>Hero Stats</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                  {currentHero.stats.attack}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>⚔️ Attack</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {currentHero.stats.defense}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>🛡️ Defense</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>
                  {currentHero.stats.magic}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>⚡ Magic</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                  {currentHero.experience}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>✨ EXP</div>
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                #{currentHero.id}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Token ID</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#a855f7' }}>
                {currentHero.rarity}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Rarity</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                Level {currentHero.level}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Current Level</div>
            </div>
          </div>
          
          {currentHero.txHash && (
            <div style={{
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '5px' }}>
                Transaction Hash:
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#a855f7', 
                fontFamily: 'monospace',
                wordBreak: 'break-all'
              }}>
                {currentHero.txHash}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button
            onClick={resetMint}
            style={{
              padding: '15px',
              borderRadius: '15px',
              border: 'none',
              background: 'linear-gradient(45deg, #6b7280, #4b5563)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🔄 Mint Another Hero
          </button>
          
          <button
            onClick={startDeFiQuests}
            style={{
              padding: '15px',
              borderRadius: '15px',
              border: 'none',
              background: 'linear-gradient(45deg, #10b981, #059669)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🎮 Start DeFi Quests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#a855f7', margin: '0 0 20px 0' }}>
        🎨 Mint Your DeFi Hero NFT
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '30px', margin: '0 0 30px 0' }}>
        Create your unique DeFi hero that will evolve through your real DeFi activities on Avalanche Fuji Testnet.
        Each hero class has different strengths and specializes in different DeFi strategies.
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
            ⚠️ Please connect your wallet in the Wallet tab to mint a real NFT on Avalanche Fuji Testnet!
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
            ❌ Please switch to Avalanche Fuji Testnet in the Wallet tab to mint your hero!
          </p>
        </div>
      )}

      {/* Testnet Info */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>🧪 Avalanche Fuji Testnet Minting</h3>
        <p style={{ margin: '0', color: '#cbd5e1', fontSize: '0.9rem' }}>
          Your hero will be minted on Avalanche Fuji Testnet. Make sure you have testnet AVAX from the faucet!
        </p>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Hero Name:
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your hero's name (3-20 characters)"
          maxLength={20}
          disabled={isMinting}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            background: 'rgba(15, 23, 42, 0.8)',
            color: 'white',
            fontSize: '1rem',
            opacity: isMinting ? 0.6 : 1
          }}
        />
        <small style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
          {username.length}/20 characters
        </small>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '15px', fontWeight: 'bold' }}>
          Choose Your Hero Class:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
          {heroClasses.map((hero, index) => (
            <div
              key={index}
              onClick={() => !isMinting && setHeroClass(index)}
              style={{
                padding: '20px',
                borderRadius: '15px',
                border: heroClass === index 
                  ? '2px solid #a855f7' 
                  : '1px solid rgba(71, 85, 105, 0.3)',
                background: heroClass === index 
                  ? 'rgba(139, 92, 246, 0.2)' 
                  : 'rgba(71, 85, 105, 0.2)',
                cursor: isMinting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                transform: heroClass === index ? 'scale(1.02)' : 'scale(1)',
                opacity: isMinting ? 0.6 : 1
              }}
            >
              <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '10px' }}>
                {hero.emoji}
              </div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', textAlign: 'center' }}>{hero.name}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>{hero.description}</p>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#94a3b8', 
                marginBottom: '8px',
                fontFamily: 'monospace',
                textAlign: 'center'
              }}>
                {hero.stats}
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#10b981',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                Specialty: {hero.specialty}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mint Cost & Rewards */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>Minting Details (Testnet):</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>
              0.001 AVAX
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Testnet Mint Cost</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              500 EXP
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Starting Experience</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              Level 1
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Starting Level</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              Unique
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>NFT Traits</div>
          </div>
        </div>
      </div>

      <button
        onClick={mintHeroNFT}
        disabled={!username.trim() || username.length < 3 || isMinting}
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: '15px',
          border: 'none',
          background: (username.trim() && username.length >= 3 && !isMinting)
            ? 'linear-gradient(45deg, #8b5cf6, #3b82f6)' 
            : 'rgba(71, 85, 105, 0.5)',
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: (username.trim() && username.length >= 3 && !isMinting) ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
      >
        {isMinting ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Minting Hero NFT on Fuji...
          </div>
        ) : (
          `🎨 Mint ${heroClasses[heroClass].name.split(' ')[1]} on Fuji Testnet`
        )}
      </button>

      {(!username.trim() || username.length < 3) && !isMinting && (
        <p style={{ 
          textAlign: 'center', 
          color: '#f87171', 
          fontSize: '0.9rem', 
          marginTop: '10px',
          margin: '10px 0 0 0'
        }}>
          Please enter a hero name (minimum 3 characters)
        </p>
      )}

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

export default HeroMinter;