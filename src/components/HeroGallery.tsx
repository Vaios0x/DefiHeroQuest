import React, { useState, useEffect } from 'react';

interface Hero {
  id: number;
  name: string;
  class: string;
  emoji: string;
  level: number;
  experience: number;
  stats: {
    attack: number;
    defense: number;
    magic: number;
  };
  specialty: string;
  mintedAt: string;
  txHash: string;
  rarity: string;
  questsCompleted: number;
  totalEarnings: number;
  achievements: string[];
}

const HeroGallery: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [activeHero, setActiveHero] = useState<Hero | null>(null);
  const [sortBy, setSortBy] = useState<'level' | 'experience' | 'rarity' | 'recent'>('level');
  const [filterBy, setFilterBy] = useState<'all' | 'knight' | 'wizard' | 'ranger' | 'guardian'>('all');

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = () => {
    // Load heroes from localStorage
    const savedHeroes = [];
    
    // Check for current minted hero
    const currentHero = localStorage.getItem('mintedHero');
    if (currentHero) {
      const hero = JSON.parse(currentHero);
      // Add some demo data for better showcase
      hero.questsCompleted = Math.floor(Math.random() * 15) + 1;
      hero.totalEarnings = parseFloat((Math.random() * 50 + 10).toFixed(2));
      hero.achievements = generateAchievements(hero);
      savedHeroes.push(hero);
    }

    // Add some demo heroes for showcase
    const demoHeroes = generateDemoHeroes();
    savedHeroes.push(...demoHeroes);

    setHeroes(savedHeroes);
    
    // Set active hero (first one or current minted)
    if (savedHeroes.length > 0) {
      setActiveHero(savedHeroes[0]);
    }
  };

  const generateDemoHeroes = (): Hero[] => {
    const demoHeroes = [
      {
        id: 1001,
        name: "CryptoKnight",
        class: "⚔️ DeFi Knight",
        emoji: "⚔️",
        level: 5,
        experience: 2340,
        stats: { attack: 52, defense: 68, magic: 45 },
        specialty: "Staking & Lending",
        mintedAt: "2025-01-10T14:30:00Z",
        txHash: "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
        rarity: "Rare",
        questsCompleted: 12,
        totalEarnings: 45.67,
        achievements: ["First Stake", "Yield Master", "Guild Leader"]
      },
      {
        id: 1002,
        name: "MagicYielder",
        class: "🧙‍♂️ Yield Wizard",
        emoji: "🧙‍♂️",
        level: 7,
        experience: 3890,
        stats: { attack: 38, defense: 42, magic: 78 },
        specialty: "Yield Farming & Optimization",
        mintedAt: "2025-01-08T09:15:00Z",
        txHash: "0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
        rarity: "Legendary",
        questsCompleted: 18,
        totalEarnings: 89.23,
        achievements: ["Yield Optimizer", "Magic Master", "Community Favorite", "Legendary Farmer"]
      },
      {
        id: 1003,
        name: "SwiftStaker",
        class: "🏹 Staking Ranger",
        emoji: "🏹",
        level: 3,
        experience: 1250,
        stats: { attack: 58, defense: 48, magic: 44 },
        specialty: "Staking & Rewards",
        mintedAt: "2025-01-12T16:45:00Z",
        txHash: "0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
        rarity: "Common",
        questsCompleted: 7,
        totalEarnings: 23.45,
        achievements: ["Quick Starter", "Precision Staker"]
      }
    ];

    return demoHeroes;
  };

  const generateAchievements = (hero: Hero): string[] => {
    const achievements = ["First Hero"];
    
    if (hero.level >= 2) achievements.push("Level Up");
    if (hero.experience >= 1000) achievements.push("Experience Collector");
    if (hero.stats.defense >= 40) achievements.push("Defender");
    if (hero.stats.magic >= 50) achievements.push("Magical");
    if (hero.stats.attack >= 50) achievements.push("Warrior");
    
    return achievements;
  };

  const sortedAndFilteredHeroes = heroes
    .filter(hero => {
      if (filterBy === 'all') return true;
      return hero.class.toLowerCase().includes(filterBy);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return b.level - a.level;
        case 'experience':
          return b.experience - a.experience;
        case 'rarity':
          const rarityOrder = { 'Legendary': 3, 'Rare': 2, 'Common': 1 };
          return (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0);
        case 'recent':
          return new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime();
        default:
          return 0;
      }
    });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return '#f59e0b';
      case 'Rare': return '#a855f7';
      case 'Common': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const setAsActiveHero = (hero: Hero) => {
    setActiveHero(hero);
    // Save as active hero in localStorage
    localStorage.setItem('activeHero', JSON.stringify(hero));
    // If it's the minted hero, update the mintedHero as well
    if (hero.id === JSON.parse(localStorage.getItem('mintedHero') || '{}').id) {
      localStorage.setItem('mintedHero', JSON.stringify(hero));
    }
  };

  const deleteHero = (heroId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este hero?')) {
      setHeroes(prev => prev.filter(h => h.id !== heroId));
      if (selectedHero?.id === heroId) {
        setSelectedHero(null);
      }
      if (activeHero?.id === heroId) {
        const remainingHeroes = heroes.filter(h => h.id !== heroId);
        setActiveHero(remainingHeroes.length > 0 ? remainingHeroes[0] : null);
      }
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
        👑 Hero Gallery
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '30px', margin: '0 0 30px 0' }}>
        Manage your collection of DeFi heroes. View stats, achievements, and set your active hero for quests.
      </p>

      {/* Active Hero Display */}
      {activeHero && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>🌟 Active Hero</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '3rem' }}>{activeHero.emoji}</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', color: '#10b981' }}>
                {activeHero.name}
              </h4>
              <div style={{ color: '#cbd5e1', marginBottom: '10px' }}>
                {activeHero.class} • Level {activeHero.level} • {activeHero.experience} EXP
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <span style={{ color: '#ef4444' }}>⚔️ {activeHero.stats.attack}</span>
                <span style={{ color: '#3b82f6' }}>🛡️ {activeHero.stats.defense}</span>
                <span style={{ color: '#a855f7' }}>⚡ {activeHero.stats.magic}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: getRarityColor(activeHero.rarity), fontWeight: 'bold' }}>
                {activeHero.rarity}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                {activeHero.questsCompleted} Quests • ${activeHero.totalEarnings} Earned
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sorting */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#cbd5e1' }}>
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              background: 'rgba(15, 23, 42, 0.8)',
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            <option value="level">Level (High to Low)</option>
            <option value="experience">Experience (High to Low)</option>
            <option value="rarity">Rarity (Legendary First)</option>
            <option value="recent">Recently Created</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#cbd5e1' }}>
            Filter by class:
          </label>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              background: 'rgba(15, 23, 42, 0.8)',
              color: 'white',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">All Classes</option>
            <option value="knight">DeFi Knights</option>
            <option value="wizard">Yield Wizards</option>
            <option value="ranger">Staking Rangers</option>
            <option value="guardian">LP Guardians</option>
          </select>
        </div>
      </div>

      {/* Heroes Grid */}
      {sortedAndFilteredHeroes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'rgba(71, 85, 105, 0.2)',
          borderRadius: '15px',
          border: '1px solid rgba(71, 85, 105, 0.3)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👑</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>No Heroes Found</h3>
          <p style={{ margin: '0', color: '#94a3b8' }}>
            {filterBy !== 'all' 
              ? `No heroes found for the selected class filter.`
              : 'Create your first hero in the Mint Hero tab to get started!'
            }
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '25px'
        }}>
          {sortedAndFilteredHeroes.map((hero) => (
            <div
              key={hero.id}
              onClick={() => setSelectedHero(hero)}
              style={{
                background: 'rgba(71, 85, 105, 0.2)',
                border: selectedHero?.id === hero.id 
                  ? `2px solid ${getRarityColor(hero.rarity)}` 
                  : `1px solid ${getRarityColor(hero.rarity)}40`,
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedHero?.id === hero.id ? 'scale(1.02)' : 'scale(1)',
                position: 'relative'
              }}
            >
              {/* Active Badge */}
              {activeHero?.id === hero.id && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  borderRadius: '12px',
                  padding: '4px 8px',
                  fontSize: '0.7rem',
                  color: '#10b981',
                  fontWeight: 'bold'
                }}>
                  ACTIVE
                </div>
              )}

              {/* Hero Display */}
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{hero.emoji}</div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#cbd5e1' }}>
                  {hero.name}
                </h3>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '5px' }}>
                  {hero.class}
                </div>
                <div style={{
                  display: 'inline-block',
                  background: `${getRarityColor(hero.rarity)}20`,
                  border: `1px solid ${getRarityColor(hero.rarity)}40`,
                  borderRadius: '12px',
                  padding: '4px 8px',
                  fontSize: '0.8rem',
                  color: getRarityColor(hero.rarity),
                  fontWeight: 'bold'
                }}>
                  {hero.rarity}
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ef4444' }}>
                    {hero.stats.attack}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>⚔️ ATK</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {hero.stats.defense}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>🛡️ DEF</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#a855f7' }}>
                    {hero.stats.magic}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>⚡ MAG</div>
                </div>
              </div>

              {/* Level and Experience */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Level {hero.level}</span>
                  <span style={{ fontSize: '0.9rem', color: '#a855f7' }}>{hero.experience} EXP</span>
                </div>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  borderRadius: '4px',
                  height: '6px',
                  position: 'relative'
                }}>
                  <div style={{
                    background: 'linear-gradient(45deg, #a855f7, #3b82f6)',
                    height: '100%',
                    borderRadius: '4px',
                    width: `${Math.min((hero.experience % 1000) / 10, 100)}%`
                  }} />
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                fontSize: '0.8rem',
                color: '#94a3b8'
              }}>
                <div>🎯 {hero.questsCompleted} Quests</div>
                <div>💰 ${hero.totalEarnings}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hero Details Modal */}
      {selectedHero && (
        <div style={{
          background: 'rgba(71, 85, 105, 0.2)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <h3 style={{ margin: '0', color: '#a855f7' }}>
              Hero Details: {selectedHero.name}
            </h3>
            <button
              onClick={() => setSelectedHero(null)}
              style={{
                background: 'rgba(71, 85, 105, 0.5)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              ✕ Close
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Basic Info */}
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Basic Information</h4>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6' }}>
                <div><strong>Class:</strong> {selectedHero.class}</div>
                <div><strong>Specialty:</strong> {selectedHero.specialty}</div>
                <div><strong>Level:</strong> {selectedHero.level}</div>
                <div><strong>Experience:</strong> {selectedHero.experience}</div>
                <div><strong>Rarity:</strong> <span style={{ color: getRarityColor(selectedHero.rarity) }}>{selectedHero.rarity}</span></div>
                <div><strong>Minted:</strong> {new Date(selectedHero.mintedAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Achievements</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedHero.achievements.map((achievement, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '12px',
                      padding: '4px 8px',
                      fontSize: '0.8rem',
                      color: '#f59e0b'
                    }}
                  >
                    🏆 {achievement}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {activeHero?.id !== selectedHero.id && (
              <button
                onClick={() => setAsActiveHero(selectedHero)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🌟 Set as Active Hero
              </button>
            )}
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedHero.txHash);
                alert('Transaction hash copied to clipboard!');
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📋 Copy TX Hash
            </button>

            {/* Only show delete for demo heroes, not the minted one */}
            {selectedHero.id !== JSON.parse(localStorage.getItem('mintedHero') || '{}').id && (
              <button
                onClick={() => deleteHero(selectedHero.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🗑️ Delete Hero
              </button>
            )}
          </div>
        </div>
      )}

      {/* Gallery Stats */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>📊 Collection Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7' }}>
              {heroes.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Total Heroes</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {heroes.filter(h => h.rarity === 'Legendary').length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Legendary</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {Math.max(...heroes.map(h => h.level), 0)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Highest Level</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {heroes.reduce((sum, h) => sum + h.questsCompleted, 0)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Total Quests</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
              ${heroes.reduce((sum, h) => sum + h.totalEarnings, 0).toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Total Earnings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroGallery;