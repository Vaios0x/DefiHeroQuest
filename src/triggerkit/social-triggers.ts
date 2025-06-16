import { ethers } from 'ethers';
import { createTrigger, TriggerContext } from '../types/sherry-sdk';
import { SocialGuildSystem, ICastProtocol } from '../contracts/types';

interface SocialTriggerConfig {
  guildId: number;
  platform: string;
  minReach: number;
  minEngagement: number;
  rewardMultiplier: number;
}

interface SocialProof {
  contentId: string;
  platform: string;
  reach: number;
  engagement: number;
  timestamp: number;
  signature: string;
}

export const createSocialTriggers = (config: SocialTriggerConfig) => {
  // Trigger para amplificación de contenido
  const contentAmplificationTrigger = createTrigger({
    name: 'Content Amplification',
    description: 'Trigger para amplificar contenido social con Cast Protocol',
    
    // Condiciones que deben cumplirse
    conditions: async (context: TriggerContext) => {
      const { guildSystem, castProtocol } = context.contracts as {
        guildSystem: SocialGuildSystem;
        castProtocol: ICastProtocol;
      };

      // Verificar que el usuario es miembro del guild
      const isMember = await guildSystem.getMemberInfo(config.guildId, context.sender);
      if (!isMember.isActive) {
        return {
          success: false,
          message: 'Debes ser miembro activo del guild'
        };
      }

      // Verificar métricas sociales
      const contentStats = await castProtocol.getContentStats(context.data.contentId);
      if (contentStats.reach < config.minReach) {
        return {
          success: false,
          message: `El alcance mínimo requerido es ${config.minReach}`
        };
      }

      if (contentStats.engagement < config.minEngagement) {
        return {
          success: false,
          message: `El engagement mínimo requerido es ${config.minEngagement}%`
        };
      }

      return { success: true };
    },

    // Acciones a ejecutar
    actions: async (context: TriggerContext) => {
      const { guildSystem, castProtocol } = context.contracts as {
        guildSystem: SocialGuildSystem;
        castProtocol: ICastProtocol;
      };

      // Amplificar contenido con Cast Protocol
      const amplificationResult = await castProtocol.amplifyContent(
        context.data.contentId,
        config.platform
      );

      // Calcular recompensa basada en el alcance
      const rewardAmount = Math.floor(
        amplificationResult.reach * config.rewardMultiplier
      );

      // Distribuir recompensas
      await guildSystem.distributeRewards(
        config.guildId,
        context.sender,
        rewardAmount
      );

      return {
        success: true,
        data: {
          reach: amplificationResult.reach,
          reward: rewardAmount
        }
      };
    },

    // Validación de prueba social
    validate: async (context: TriggerContext) => {
      const proof: SocialProof = context.data.proof;
      
      // Verificar firma
      const message = ethers.utils.solidityKeccak256(
        ['string', 'string', 'uint256', 'uint256', 'uint256'],
        [
          proof.contentId,
          proof.platform,
          proof.reach,
          proof.engagement,
          proof.timestamp
        ]
      );
      
      const signer = ethers.utils.verifyMessage(message, proof.signature);
      if (signer.toLowerCase() !== context.sender.toLowerCase()) {
        return {
          success: false,
          message: 'Firma inválida'
        };
      }

      // Verificar timestamp
      const now = Math.floor(Date.now() / 1000);
      if (now - proof.timestamp > 3600) { // 1 hora máximo
        return {
          success: false,
          message: 'Prueba social expirada'
        };
      }

      return { success: true };
    }
  });

  // Trigger para logros sociales
  const socialAchievementTrigger = createTrigger({
    name: 'Social Achievement',
    description: 'Trigger para desbloquear logros sociales',
    
    conditions: async (context: TriggerContext) => {
      const { guildSystem } = context.contracts as {
        guildSystem: SocialGuildSystem;
      };

      // Verificar que el usuario es miembro del guild
      const member = await guildSystem.getMemberInfo(config.guildId, context.sender);
      if (!member.isActive) {
        return {
          success: false,
          message: 'Debes ser miembro activo del guild'
        };
      }

      // Verificar requisitos del logro
      const achievement = context.data.achievement;
      switch (achievement.type) {
        case 'viral_content':
          const viralThreshold = 100000; // 100k alcance
          if (achievement.reach < viralThreshold) {
            return {
              success: false,
              message: `Se requiere un alcance de ${viralThreshold}`
            };
          }
          break;

        case 'community_leader':
          if (member.reputation < 1000) {
            return {
              success: false,
              message: 'Se requiere 1000+ puntos de reputación'
            };
          }
          break;

        case 'social_pioneer':
          const guildInfo = await guildSystem.getGuildInfo(config.guildId);
          if (guildInfo.totalMembers < 100) {
            return {
              success: false,
              message: 'El guild necesita 100+ miembros'
            };
          }
          break;
      }

      return { success: true };
    },

    actions: async (context: TriggerContext) => {
      const { guildSystem, achievementNFT } = context.contracts as {
        guildSystem: SocialGuildSystem;
        achievementNFT: any;
      };

      // Desbloquear logro y mintear NFT
      await achievementNFT.unlockAchievement(
        context.data.achievement.id,
        context.sender
      );

      // Actualizar estadísticas del guild
      await guildSystem.updateGuildStats(
        config.guildId,
        context.data.achievement.type
      );

      return {
        success: true,
        data: {
          achievementId: context.data.achievement.id,
          type: context.data.achievement.type
        }
      };
    },

    validate: async (context: TriggerContext) => {
      const { achievementNFT } = context.contracts as {
        achievementNFT: any;
      };

      // Verificar que el logro no ha sido desbloqueado
      const hasAchievement = await achievementNFT.hasAchievement(
        context.sender,
        context.data.achievement.id
      );

      if (hasAchievement) {
        return {
          success: false,
          message: 'Este logro ya ha sido desbloqueado'
        };
      }

      return { success: true };
    }
  });

  // Trigger para recompensas de guild
  const guildRewardTrigger = createTrigger({
    name: 'Guild Reward',
    description: 'Trigger para distribuir recompensas del guild',
    
    conditions: async (context: TriggerContext) => {
      const { guildSystem } = context.contracts as {
        guildSystem: SocialGuildSystem;
      };

      // Verificar balance del treasury
      const guildInfo = await guildSystem.getGuildInfo(config.guildId);
      if (guildInfo.treasuryBalance < context.data.rewardAmount) {
        return {
          success: false,
          message: 'Balance insuficiente en el treasury'
        };
      }

      // Verificar que el miembro cumple los requisitos
      const member = await guildSystem.getMemberInfo(config.guildId, context.sender);
      if (member.contribution < context.data.rewardAmount * 2) {
        return {
          success: false,
          message: 'Contribución insuficiente al guild'
        };
      }

      return { success: true };
    },

    actions: async (context: TriggerContext) => {
      const { guildSystem } = context.contracts as {
        guildSystem: SocialGuildSystem;
      };

      // Distribuir recompensa
      await guildSystem.distributeRewards(
        config.guildId,
        context.sender,
        context.data.rewardAmount
      );

      return {
        success: true,
        data: {
          amount: context.data.rewardAmount,
          recipient: context.sender
        }
      };
    },

    validate: async (context: TriggerContext) => {
      // Verificar que la recompensa es razonable
      if (context.data.rewardAmount > 10000) {
        return {
          success: false,
          message: 'Recompensa demasiado alta'
        };
      }

      // Verificar cooldown
      const lastReward = context.data.lastRewardTimestamp;
      const now = Math.floor(Date.now() / 1000);
      if (now - lastReward < 86400) { // 24 horas
        return {
          success: false,
          message: 'Debes esperar 24 horas entre recompensas'
        };
      }

      return { success: true };
    }
  });

  return {
    contentAmplificationTrigger,
    socialAchievementTrigger,
    guildRewardTrigger
  };
}; 