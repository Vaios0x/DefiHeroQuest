import { useState } from 'react';
import { createMetadata, createDynamicExecutor } from '@sherrylinks/sdk';
import { SherryActionResponse } from '../types/sherry';

export const useSherryAction = <T = any>(actionType: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<T | undefined>();

  const execute = async (data?: any): Promise<SherryActionResponse<T>> => {
    setLoading(true);
    setError(undefined);

    try {
      // Use Sherry SDK for validation and metadata
      console.log('🔗 Initializing Sherry SDK for action:', actionType);
      
      // Try to use Sherry SDK functions for validation
      let sherryValidation = false;
      try {
        // Basic metadata creation
        createMetadata({
          url: 'https://defi-hero-quest.vercel.app',
          icon: '🎮',
          title: `DeFi Hero ${actionType}`,
          description: `Execute ${actionType} action in DeFi Hero Quest`,
          actions: []
        });
        
        // Basic executor creation
        createDynamicExecutor(actionType);
        
        console.log('✅ Sherry SDK validation successful');
        sherryValidation = true;
      } catch (sdkError) {
        console.log('⚠️ Sherry SDK validation failed, using fallback:', sdkError);
        sherryValidation = false;
      }

      // Execute the action with or without Sherry SDK validation
      const response = await executeAction(actionType, data, sherryValidation);

      setResult(response.data);
      return { data: response.data, loading: false };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return { error: errorMessage, loading: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
    result
  };
};

// Execute action with optional Sherry SDK validation
async function executeAction(actionType: string, data: any, sherryValidated: boolean) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('🎯 Executing action:', { actionType, data, sherryValidated });

  // Generate response based on action type
  switch (actionType) {
    case 'mint-hero':
      return {
        data: {
          hero: {
            id: `hero-${Date.now()}`,
            class: data?.class || 'DeFi Knight',
            rarity: Math.random() > 0.7 ? 'Legendary' : 'Common',
            stats: {
              attack: Math.floor(Math.random() * 40) + 60,
              defense: Math.floor(Math.random() * 40) + 60,
              intelligence: Math.floor(Math.random() * 40) + 60,
              luck: Math.floor(Math.random() * 40) + 60
            },
            mintedAt: new Date().toISOString(),
            sherryValidated
          },
          hash: `0x${Math.random().toString(16).slice(2, 66)}`
        }
      };

    case 'create-agent':
      return {
        data: {
          id: `agent-${Date.now()}`,
          name: data?.name || 'AI Agent',
          status: 'Active',
          task: data?.task || 'Monitoring DeFi opportunities',
          savings: '+$0',
          icon: data?.icon || '🤖',
          config: data?.config || {},
          sherryValidated
        }
      };

    case 'create-fuji-trigger':
    case 'create-social-trigger':
      return {
        data: {
          id: `trigger-${Date.now()}`,
          type: data?.type || 'Custom',
          status: 'Active',
          created: new Date().toISOString(),
          sherryValidated,
          ...data
        }
      };

    default:
      return {
        data: {
          success: true,
          actionType,
          timestamp: new Date().toISOString(),
          sherryValidated,
          ...data
        }
      };
  }
} 