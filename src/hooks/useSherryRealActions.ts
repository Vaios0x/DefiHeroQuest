import { useSherryRealAction } from './useSherryRealAction';
import { 
  Agent, 
  Trigger, 
  DynamicAction, 
  UserProfile, 
  SocialProfile 
} from '../types/sherry';

// 🔥 100% REAL SHERRY SDK ACTIONS
export const useSherryRealActions = () => {
  console.log('🚀 Initializing 100% Real Sherry SDK Actions');

  // Dynamic Actions - 100% Real Sherry SDK
  const fetchDynamicActions = useSherryRealAction<DynamicAction[]>('fetch-dynamic-actions');
  const fetchUserProfile = useSherryRealAction<UserProfile>('fetch-user-profile');
  const fetchSocialProfile = useSherryRealAction<SocialProfile>('fetch-social-profile');

  // Hero Actions - 100% Real Sherry SDK
  const mintHero = useSherryRealAction<{ hash: string; hero: any }>('mint-hero');
  const joinQuest = useSherryRealAction<{ hash: string; quest: any }>('join-quest');

  // Agent Actions - 100% Real Sherry SDK
  const createAgent = useSherryRealAction<Agent>('create-agent');
  const toggleAgent = useSherryRealAction<{ status: 'Active' | 'Inactive' }>('toggle-agent');
  const deleteAgent = useSherryRealAction<{ success: boolean }>('delete-agent');
  const updateAgentConfig = useSherryRealAction<Agent>('update-agent-config');

  // Trigger Actions - 100% Real Sherry SDK
  const createFujiTrigger = useSherryRealAction<Trigger>('create-fuji-trigger');
  const toggleFujiTrigger = useSherryRealAction<{ status: 'Active' | 'Inactive' }>('toggle-fuji-trigger');
  const createSocialTrigger = useSherryRealAction<Trigger>('create-social-trigger');
  const toggleSocialTrigger = useSherryRealAction<{ status: 'Active' | 'Inactive' }>('toggle-social-trigger');

  // Portfolio Actions - 100% Real Sherry SDK
  const executePortfolioAction = useSherryRealAction<{ hash: string; action: any }>('portfolio-action');

  // Cross Chain Actions - 100% Real Sherry SDK
  const executeBridge = useSherryRealAction<{ hash: string; bridge: any }>('bridge-action');

  // DeFi Actions - 100% Real Sherry SDK
  const executeDefiSwap = useSherryRealAction<{ hash: string; swap: any }>('defi-swap');
  const executeYieldFarming = useSherryRealAction<{ hash: string; farm: any }>('yield-farming');
  const executeLiquidityProvision = useSherryRealAction<{ hash: string; liquidity: any }>('liquidity-provision');

  console.log('✅ All Real Sherry SDK Actions initialized');

  return {
    // Dynamic Actions - 100% Real
    fetchDynamicActions,
    fetchUserProfile,
    fetchSocialProfile,

    // Hero Actions - 100% Real
    mintHero,
    joinQuest,

    // Agent Actions - 100% Real
    createAgent,
    toggleAgent,
    deleteAgent,
    updateAgentConfig,

    // Trigger Actions - 100% Real
    createFujiTrigger,
    toggleFujiTrigger,
    createSocialTrigger,
    toggleSocialTrigger,

    // Portfolio Actions - 100% Real
    executePortfolioAction,

    // Cross Chain Actions - 100% Real
    executeBridge,

    // DeFi Actions - 100% Real
    executeDefiSwap,
    executeYieldFarming,
    executeLiquidityProvision
  };
}; 