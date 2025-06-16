import cron from 'node-cron';

interface QuestProgress {
  userId: string;
  questId: string;
  questType: 'daily' | 'weekly' | 'epic' | 'social';
  progress: number;
  maxProgress: number;
  requirements: string[];
  rewards: {
    exp: number;
    coins: number;
    items?: string[];
    socialPoints?: number;
  };
  socialContext?: {
    guildId?: string;
    collaborators?: string[];
    communityBonus?: number;
  };
}

interface QuestCompletion {
  questId: string;
  completedAt: string;
  rewards: {
    exp: number;
    coins: number;
    items?: string[];
    socialPoints?: number;
  };
  heroStatBonus: {
    attack?: number;
    defense?: number;
    magic?: number;
    social?: number;
  };
  socialAchievements?: string[];
}

class QuestMonitor {
  private activeQuests: Map<string, QuestProgress[]> = new Map();

  constructor() {
    // Initialize with some default quests
    this.initializeDefaultQuests();
    
    // Schedule periodic quest checks
    cron.schedule('*/5 * * * *', () => {
      this.checkQuestProgress();
    });
  }

  private initializeDefaultQuests() {
    const defaultQuests: QuestProgress[] = [
      {
        userId: 'default-user',
        questId: 'social-yield-farmer-trial',
        questType: 'epic',
        progress: 0,
        maxProgress: 3,
        requirements: ['Stake AVAX', 'Provide USDC liquidity', 'Farm USDT yield'],
        rewards: {
          exp: 500,
          coins: 1000,
          items: ['Yield Farmer Badge'],
          socialPoints: 100
        },
        socialContext: {
          guildId: 'defi-pioneers',
          collaborators: [],
          communityBonus: 0.2
        }
      },
      {
        userId: 'default-user',
        questId: 'guild-staking-master',
        questType: 'weekly',
        progress: 0,
        maxProgress: 5,
        requirements: ['Stake 100+ tokens 5 times'],
        rewards: {
          exp: 300,
          coins: 500,
          socialPoints: 75
        },
        socialContext: {
          guildId: 'staking-guild',
          collaborators: [],
          communityBonus: 0.15
        }
      }
    ];

    this.activeQuests.set('default-user', defaultQuests);
  }

  async monitorUserAction(payload: { 
    userId: string; 
    action: string; 
    amount?: number; 
    socialContext?: any 
  }) {
    console.log("🎯 Monitoring social quest progress", { 
      userId: payload.userId, 
      action: payload.action,
      socialContext: payload.socialContext 
    });

    // Get user's active quests
    const activeQuests = this.activeQuests.get(payload.userId) || [];

    console.log("📋 Active social quests retrieved", { 
      questCount: activeQuests.length 
    });

    const completedQuests: QuestCompletion[] = [];

    // Check each quest for completion based on user action
    for (const quest of activeQuests) {
      const updatedProgress = await this.updateQuestProgressWithSocial(
        quest, 
        payload.action, 
        payload.amount,
        payload.socialContext
      );
      
      if (updatedProgress.progress >= updatedProgress.maxProgress) {
        // Quest completed with social validation!
        const completion: QuestCompletion = {
          questId: quest.questId,
          completedAt: new Date().toISOString(),
          rewards: quest.rewards,
          heroStatBonus: this.calculateSocialQuestStatBonus(quest.questType, quest.questId, quest.socialContext),
          socialAchievements: await this.checkSocialAchievements(quest)
        };
        
        completedQuests.push(completion);
        
        // Remove completed quest from active quests
        const userQuests = this.activeQuests.get(payload.userId) || [];
        const remainingQuests = userQuests.filter(q => q.questId !== quest.questId);
        this.activeQuests.set(payload.userId, remainingQuests);
        
        console.log("🎉 Social quest completed!", { 
          questId: quest.questId,
          rewards: quest.rewards,
          socialAchievements: completion.socialAchievements 
        });
      } else {
        // Update quest progress
        const userQuests = this.activeQuests.get(payload.userId) || [];
        const questIndex = userQuests.findIndex(q => q.questId === quest.questId);
        if (questIndex !== -1) {
          userQuests[questIndex] = updatedProgress;
          this.activeQuests.set(payload.userId, userQuests);
        }
        
        console.log("📈 Social quest progress updated", { 
          questId: quest.questId,
          progress: `${updatedProgress.progress}/${updatedProgress.maxProgress}` 
        });
      }
    }

    // Generate social notifications for completed quests
    const notifications = await this.generateSocialNotifications(completedQuests, payload.userId);

    return {
      userId: payload.userId,
      action: payload.action,
      completedQuests,
      notifications,
      totalExpEarned: completedQuests.reduce((sum, q) => sum + q.rewards.exp, 0),
      totalCoinsEarned: completedQuests.reduce((sum, q) => sum + q.rewards.coins, 0),
      totalSocialPoints: completedQuests.reduce((sum, q) => sum + (q.rewards.socialPoints || 0), 0),
      socialAchievements: completedQuests.flatMap(q => q.socialAchievements || [])
    };
  }

  private async updateQuestProgressWithSocial(
    quest: QuestProgress, 
    action: string, 
    amount?: number,
    socialContext?: any
  ): Promise<QuestProgress> {
    let newProgress = quest.progress;
    
    // Update progress based on action type with social validation
    switch (action) {
      case 'stake':
        if (quest.questId === 'social-yield-farmer-trial' && quest.progress === 0) {
          newProgress = 1; // First requirement: Stake AVAX
          
          // Check for social bonus (guild members staking together)
          if (socialContext?.guildMembers && socialContext.guildMembers.length > 0) {
            const guildBonus = Math.min(socialContext.guildMembers.length * 0.1, 0.5);
            quest.rewards.exp = Math.floor(quest.rewards.exp * (1 + guildBonus));
            quest.rewards.socialPoints = (quest.rewards.socialPoints || 0) + 50;
          }
        }
        if (quest.questId === 'guild-staking-master' && amount && amount >= 100) {
          newProgress = Math.min(quest.progress + 1, quest.maxProgress);
        }
        break;
        
      case 'liquidity':
        if (quest.questId === 'social-yield-farmer-trial' && quest.progress === 1) {
          newProgress = 2; // Second requirement: Provide USDC liquidity
          
          // Social validation bonus
          if (socialContext?.communityValidation) {
            quest.rewards.socialPoints = (quest.rewards.socialPoints || 0) + 25;
          }
        }
        break;
        
      case 'yield-farm':
        if (quest.questId === 'social-yield-farmer-trial' && quest.progress === 2) {
          newProgress = 3; // Third requirement: Farm USDT yield
        }
        break;
        
      case 'social_interaction':
        if (quest.questType === 'social') {
          newProgress = Math.min(quest.progress + 1, quest.maxProgress);
          quest.rewards.socialPoints = (quest.rewards.socialPoints || 0) + 10;
        }
        break;
    }
    
    return { ...quest, progress: newProgress };
  }

  private calculateSocialQuestStatBonus(
    _questType: string, 
    questId: string, 
    socialContext?: any
  ) {
    const baseBonuses: Record<string, { attack?: number; defense?: number; magic?: number; social?: number }> = {
      'social-yield-farmer-trial': { magic: 3, defense: 1, social: 2 },
      'guild-staking-master': { defense: 5, attack: 2, social: 3 },
      'community-liquidity-provider': { magic: 4, attack: 1, social: 4 },
      'cross-chain-social-bridge': { magic: 2, defense: 3, social: 5 }
    };
    
    const baseBonus = baseBonuses[questId] || { magic: 1, social: 1 };
    
    // Apply social multipliers
    if (socialContext?.guildId) {
      baseBonus.social = (baseBonus.social || 0) + 2; // Guild bonus
    }
    
    if (socialContext?.collaborators && socialContext.collaborators.length > 0) {
      const collaboratorBonus = Math.min(socialContext.collaborators.length, 3);
      baseBonus.social = (baseBonus.social || 0) + collaboratorBonus;
    }
    
    return baseBonus;
  }

  private async checkSocialAchievements(quest: QuestProgress): Promise<string[]> {
    const achievements: string[] = [];
    
    // Check for social achievements
    if (quest.socialContext?.guildId) {
      achievements.push('Guild Collaborator');
    }
    
    if (quest.socialContext?.collaborators && quest.socialContext.collaborators.length >= 3) {
      achievements.push('Community Leader');
    }
    
    if (quest.rewards.socialPoints && quest.rewards.socialPoints >= 100) {
      achievements.push('Social DeFi Pioneer');
    }
    
    return achievements;
  }

  private async generateSocialNotifications(
    completedQuests: QuestCompletion[], 
    _userId: string
  ): Promise<any[]> {
    const notifications = [];
    
    for (const quest of completedQuests) {
      // Basic completion notification
      notifications.push({
        type: 'quest_completed',
        title: `🎉 Quest Completed!`,
        message: `You've completed the ${quest.questId} quest and earned ${quest.rewards.exp} EXP!`,
        timestamp: quest.completedAt,
        socialContext: quest.socialAchievements
      });
      
      // Social achievement notifications
      if (quest.socialAchievements && quest.socialAchievements.length > 0) {
        for (const achievement of quest.socialAchievements) {
          notifications.push({
            type: 'social_achievement',
            title: `🏆 Social Achievement Unlocked!`,
            message: `You've earned the "${achievement}" achievement!`,
            timestamp: quest.completedAt
          });
        }
      }
      
      // Guild notifications
      if (quest.rewards.socialPoints && quest.rewards.socialPoints > 0) {
        notifications.push({
          type: 'social_points_earned',
          title: `⭐ Social Points Earned!`,
          message: `You've earned ${quest.rewards.socialPoints} social points!`,
          timestamp: quest.completedAt
        });
      }
    }
    
    return notifications;
  }

  private checkQuestProgress() {
    // Periodic check for time-based quest updates
    console.log("🔍 Checking quest progress for all users");
  }

  // Public method to trigger quest monitoring
  public async triggerQuestCheck(userId: string, action: string, amount?: number, socialContext?: any) {
    return this.monitorUserAction({ userId, action, amount, socialContext });
  }
}

// Export singleton instance
export const questMonitor = new QuestMonitor();