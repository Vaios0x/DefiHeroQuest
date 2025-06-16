import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTwitter, FaDiscord, FaTelegram, FaMedal, FaCrown, FaUsers } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import SocialGuildSystemABI from '../contracts/abis/SocialGuildSystem.json';
import SocialAchievementNFTABI from '../contracts/abis/SocialAchievementNFT.json';
import { useSherryRealAction } from '../hooks/useSherryRealAction';
import { useWeb3Modal } from '@web3modal/react';
import { useSafeTransaction } from '../hooks/useSafeTransaction';

interface Guild {
  id: number;
  name: string;
  level: number;
  totalMembers: number;
  socialScore: number;
  treasuryBalance: string;
  isActive: boolean;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  rarity: number;
  socialScore: number;
  isSpecial: boolean;
  claimed: boolean;
}

interface SocialStats {
  totalReach: number;
  engagement: number;
  viralScore: number;
  platforms: string[];
}

const SocialGuildHub: React.FC = () => {
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const { executeAction } = useSherryRealAction();
  const { safeTransaction } = useSafeTransaction();

  // Estados
  const [activeTab, setActiveTab] = useState<'guilds' | 'achievements' | 'leaderboard'>('guilds');
  const [userGuilds, setUserGuilds] = useState<Guild[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [socialStats, setSocialStats] = useState<SocialStats>({
    totalReach: 0,
    engagement: 0,
    viralScore: 0,
    platforms: []
  });
  const [isCreatingGuild, setIsCreatingGuild] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);

  // Efectos
  useEffect(() => {
    if (address) {
      loadUserData();
    }
  }, [address]);

  const loadUserData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Cargar datos del sistema social
      const guildSystem = new ethers.Contract(
        process.env.NEXT_PUBLIC_GUILD_SYSTEM_ADDRESS!,
        SocialGuildSystemABI,
        signer
      );

      // Cargar guilds del usuario
      const userGuildIds = await guildSystem.getUserGuilds(address);
      const guildsData = await Promise.all(
        userGuildIds.map(async (id: number) => {
          const guildInfo = await guildSystem.getGuildInfo(id);
          return {
            id,
            name: guildInfo.name,
            level: guildInfo.level.toNumber(),
            totalMembers: guildInfo.totalMembers.toNumber(),
            socialScore: guildInfo.socialScore.toNumber(),
            treasuryBalance: ethers.utils.formatEther(guildInfo.treasuryBalance),
            isActive: guildInfo.isActive
          };
        })
      );
      setUserGuilds(guildsData);

      // Cargar logros
      const achievementNFT = new ethers.Contract(
        process.env.NEXT_PUBLIC_ACHIEVEMENT_NFT_ADDRESS!,
        SocialAchievementNFTABI,
        signer
      );

      const userAchievements = await achievementNFT.getUserAchievements(address);
      const achievementsData = await Promise.all(
        userAchievements.map(async (id: number) => {
          const info = await achievementNFT.getAchievementInfo(id);
          return {
            id,
            name: info.name,
            description: info.description,
            rarity: info.rarity.toNumber(),
            socialScore: info.socialScore.toNumber(),
            isSpecial: info.isSpecial,
            claimed: await achievementNFT.hasAchievement(address, id)
          };
        })
      );
      setAchievements(achievementsData);

      // Cargar estadísticas sociales
      const stats = await executeAction('fetch-social-stats', { address });
      setSocialStats(stats.data);

    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Error cargando datos del usuario');
    }
  };

  const handleCreateGuild = async () => {
    if (!address) {
      open();
      return;
    }

    try {
      setIsCreatingGuild(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const guildSystem = new ethers.Contract(
        process.env.NEXT_PUBLIC_GUILD_SYSTEM_ADDRESS!,
        SocialGuildSystemABI,
        signer
      );

      const tx = await guildSystem.createGuild(
        newGuildName,
        ethers.utils.parseEther('100') // 100 SOCIAL tokens required
      );
      
      toast.promise(tx.wait(), {
        loading: 'Creando guild...',
        success: '¡Guild creado exitosamente! 🎉',
        error: 'Error al crear guild'
      });

      await tx.wait();
      setIsCreatingGuild(false);
      setNewGuildName('');
      loadUserData();

    } catch (error) {
      console.error('Error creating guild:', error);
      toast.error('Error al crear guild');
      setIsCreatingGuild(false);
    }
  };

  const handleJoinGuild = async (guildId: number) => {
    if (!address) {
      open();
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const guildSystem = new ethers.Contract(
        process.env.NEXT_PUBLIC_GUILD_SYSTEM_ADDRESS!,
        SocialGuildSystemABI,
        signer
      );

      const tx = await guildSystem.joinGuild(guildId);
      
      toast.promise(tx.wait(), {
        loading: 'Uniéndose al guild...',
        success: '¡Te has unido al guild! 🎉',
        error: 'Error al unirse al guild'
      });

      await tx.wait();
      loadUserData();

    } catch (error) {
      console.error('Error joining guild:', error);
      toast.error('Error al unirse al guild');
    }
  };

  const handleAmplifyContent = async (contentId: string, platform: string) => {
    if (!address) {
      open();
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const guildSystem = new ethers.Contract(
        process.env.NEXT_PUBLIC_GUILD_SYSTEM_ADDRESS!,
        SocialGuildSystemABI,
        signer
      );

      const tx = await guildSystem.amplifyWithCast(selectedGuild?.id, contentId, platform);
      
      toast.promise(tx.wait(), {
        loading: 'Amplificando contenido...',
        success: '¡Contenido amplificado exitosamente! 🚀',
        error: 'Error al amplificar contenido'
      });

      await tx.wait();
      loadUserData();

    } catch (error) {
      console.error('Error amplifying content:', error);
      toast.error('Error al amplificar contenido');
    }
  };

  // Renderizado de componentes
  const renderGuildsTab = () => (
    <div className="space-y-6">
      {/* Crear Guild */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-purple-400 mb-4">Crear Nuevo Guild</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={newGuildName}
            onChange={(e) => setNewGuildName(e.target.value)}
            placeholder="Nombre del Guild"
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg"
          />
          <button
            onClick={handleCreateGuild}
            disabled={isCreatingGuild || !newGuildName}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {isCreatingGuild ? 'Creando...' : 'Crear Guild'}
          </button>
        </div>
      </div>

      {/* Lista de Guilds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userGuilds.map((guild) => (
          <motion.div
            key={guild.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-6 rounded-xl cursor-pointer hover:bg-gray-700"
            onClick={() => setSelectedGuild(guild)}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-blue-400">{guild.name}</h4>
              <span className="text-yellow-400 flex items-center">
                <FaCrown className="mr-2" /> Nivel {guild.level}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-300">
                <FaUsers className="mr-2" /> {guild.totalMembers} miembros
              </div>
              <div className="flex items-center text-green-400">
                <FaMedal className="mr-2" /> {guild.socialScore} puntos
              </div>
            </div>
            
            <div className="mt-4 text-right">
              <span className="text-purple-400">
                Treasury: {guild.treasuryBalance} SOCIAL
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`bg-gray-800 p-6 rounded-xl border-2 ${
            achievement.isSpecial ? 'border-yellow-400' : 'border-purple-500'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-blue-400">{achievement.name}</h4>
            <span className={`text-sm ${
              achievement.rarity === 4 ? 'text-yellow-400' :
              achievement.rarity === 3 ? 'text-purple-400' :
              achievement.rarity === 2 ? 'text-blue-400' :
              'text-gray-400'
            }`}>
              Rareza {achievement.rarity}
            </span>
          </div>
          
          <p className="text-gray-300 mb-4">{achievement.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-400">
              {achievement.socialScore} puntos sociales
            </span>
            {achievement.claimed && (
              <span className="text-purple-400 flex items-center">
                <FaMedal className="mr-2" /> Desbloqueado
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderLeaderboardTab = () => (
    <div className="space-y-6">
      {/* Estadísticas Personales */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-purple-400 mb-4">Tus Estadísticas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Alcance Total</div>
            <div className="text-2xl text-blue-400">{socialStats.totalReach.toLocaleString()}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Engagement</div>
            <div className="text-2xl text-green-400">{socialStats.engagement}%</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Viral Score</div>
            <div className="text-2xl text-yellow-400">{socialStats.viralScore}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-gray-400">Plataformas</div>
            <div className="flex gap-2 mt-2">
              {socialStats.platforms.map((platform) => (
                <span key={platform} className="text-purple-400">
                  {platform === 'twitter' && <FaTwitter />}
                  {platform === 'discord' && <FaDiscord />}
                  {platform === 'telegram' && <FaTelegram />}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Guilds */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-purple-400 mb-4">Top Guilds</h3>
        <div className="space-y-4">
          {userGuilds
            .sort((a, b) => b.socialScore - a.socialScore)
            .slice(0, 5)
            .map((guild, index) => (
              <div
                key={guild.id}
                className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-yellow-400 mr-4">#{index + 1}</span>
                  <div>
                    <div className="font-bold text-blue-400">{guild.name}</div>
                    <div className="text-sm text-gray-400">{guild.totalMembers} miembros</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400">{guild.socialScore} puntos</div>
                  <div className="text-sm text-purple-400">Nivel {guild.level}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-purple-400">Social Guild Hub</h2>
          {!address && (
            <button
              onClick={() => open()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Conectar Wallet
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('guilds')}
            className={`pb-4 px-6 ${
              activeTab === 'guilds'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Guilds
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`pb-4 px-6 ${
              activeTab === 'achievements'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Logros
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`pb-4 px-6 ${
              activeTab === 'leaderboard'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Contenido */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {activeTab === 'guilds' && renderGuildsTab()}
            {activeTab === 'achievements' && renderAchievementsTab()}
            {activeTab === 'leaderboard' && renderLeaderboardTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialGuildHub; 