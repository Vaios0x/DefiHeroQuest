export interface Agent {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  task: string;
  savings: string;
  icon: string;
  config: {
    riskLevel: string;
    maxInvestment?: string;
    targetAPY?: string;
    protocols?: string[];
    autoExecute: boolean;
    notifications: boolean;
    stopLoss?: string;
    maxExposure?: string;
    diversification?: boolean;
    autoRebalance?: boolean;
    minProfit?: string;
    maxSlippage?: string;
    gasLimit?: string;
  };
}

export interface Trigger {
  id: string;
  type: string;
  status: 'Active' | 'Inactive';
  created: string;
  mode?: string;
}

export interface DynamicAction {
  id: string;
  title: string;
  description: string;
  cost: string;
  category: string;
  reward: string;
  confidence: number;
  personalizedReason: string;
  icon: string;
  difficulty: string;
}

export interface UserProfile {
  risk_tolerance: string;
  experience_level: string;
  preferred_protocols: string[];
  total_value_locked: string;
  active_strategies: number;
  level: string;
  expertise: string;
  is_whale: boolean;
  is_influencer: boolean;
  is_new: boolean;
}

export interface SocialProfile {
  platform: string;
  followers: number;
  engagement_rate: number;
  defi_content_performance: string;
  viral_potential: number;
  audience_size: number;
}

export interface SherryActionResponse<T = any> {
  data?: T;
  error?: string;
  loading: boolean;
}

export interface SherryRealActionResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface SherryActionPayload {
  type: string;
  [key: string]: any;
}

export interface SocialStatsResponse {
  totalReach: number;
  engagement: number;
  viralScore: number;
  platforms: string[];
}

export interface SocialAction {
  type: 'tweet' | 'discord' | 'telegram';
  content: string;
  platform: string;
  reward: number;
  requirements: string[];
}

export interface SocialStats {
  totalReach: number;
  engagement: number;
  viralScore: number;
  platforms: string[];
}

export interface SocialActionResponse {
  success: boolean;
  data?: any;
  message?: string;
} 