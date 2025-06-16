import { ethers } from 'ethers';

export interface SocialGuildSystem extends ethers.Contract {
  getMemberInfo(guildId: number, address: string): Promise<{
    joinedAt: number;
    contribution: number;
    reputation: number;
    isActive: boolean;
    role: number;
  }>;

  getGuildInfo(guildId: number): Promise<{
    name: string;
    founder: string;
    level: number;
    totalMembers: number;
    socialScore: number;
    treasuryBalance: ethers.BigNumber;
    isActive: boolean;
  }>;

  distributeRewards(guildId: number, recipient: string, amount: number): Promise<ethers.ContractTransaction>;
  
  updateGuildStats(guildId: number, achievementType: string): Promise<ethers.ContractTransaction>;
}

export interface ICastProtocol extends ethers.Contract {
  amplifyContent(contentId: string, platform: string): Promise<{
    reach: number;
    engagement: number;
    viralScore: number;
    platforms: string[];
  }>;

  verifyContent(contentId: string): Promise<boolean>;

  getContentStats(contentId: string): Promise<{
    contentId: string;
    platform: string;
    reach: number;
    engagement: number;
    isVerified: boolean;
  }>;

  getAmplificationResult(contentId: string): Promise<{
    reach: number;
    engagement: number;
    viralScore: number;
    platforms: string[];
  }>;
} 