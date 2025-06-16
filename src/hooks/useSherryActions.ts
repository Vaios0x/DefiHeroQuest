import { useSherryRealAction } from './useSherryRealAction';
import { 
  Agent, 
  Trigger, 
  DynamicAction, 
  UserProfile, 
  SocialProfile 
} from '../types/sherry';

export const useSherryActions = () => {
  // Dynamic Actions - using action types instead of HTTP endpoints
  const fetchDynamicActions = useSherryRealAction<DynamicAction[]>('fetch-dynamic-actions');
  const fetchUserProfile = useSherryRealAction<UserProfile>('fetch-user-profile');
  const fetchSocialProfile = useSherryRealAction<SocialProfile>('fetch-social-profile');

  // Hero Actions
  const mintHero = useSherryRealAction<{ hash: string; hero: any }>('mint-hero');
  const joinQuest = useSherryRealAction<{ hash: string; quest: any }>('join-quest');

  // Agent Actions
  const createAgent = useSherryRealAction<Agent>('create-agent');
  const toggleAgent = useSherryRealAction<{ status: 'Active' | 'Inactive' }>('toggle-agent');
  const deleteAgent = useSherryRealAction<{ success: boolean }>('delete-agent');
  const updateAgentConfig = useSherryRealAction<Agent>('update-agent-config');

  // Trigger Actions
  const createFujiTrigger = useSherryRealAction<Trigger>('create-fuji-trigger');
  const toggleFujiTrigger = useSherryRealAction<{ status: 'Active' | 'Inactive' }>('toggle-fuji-trigger');
  const createSocialTrigger = useSherryRealAction<Trigger>('create-social-trigger');
  const toggleSocialTrigger = useSherryRealAction<{ status: 'Active' | 'Inactive' }>('toggle-social-trigger');

  // Portfolio Actions
  const executePortfolioAction = useSherryRealAction<{ hash: string; action: any }>('portfolio-action');

  // Cross Chain Actions
  const executeBridge = useSherryRealAction<{ hash: string; bridge: any }>('bridge-action');

  return {
    // Dynamic Actions
    fetchDynamicActions,
    fetchUserProfile,
    fetchSocialProfile,

    // Hero Actions
    mintHero,
    joinQuest,

    // Agent Actions
    createAgent,
    toggleAgent,
    deleteAgent,
    updateAgentConfig,

    // Trigger Actions
    createFujiTrigger,
    toggleFujiTrigger,
    createSocialTrigger,
    toggleSocialTrigger,

    // Portfolio Actions
    executePortfolioAction,

    // Cross Chain Actions
    executeBridge
  };
}; 