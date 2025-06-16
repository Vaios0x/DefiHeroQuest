import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { useSherryRealAction } from './useSherryRealAction';
import {
  SocialAction,
  SocialStats,
  SocialActionResponse,
  SherryActionPayload
} from '../types/sherry';

interface UseSocialActionsReturn {
  isLoading: boolean;
  socialStats: SocialStats;
  availableActions: SocialAction[];
  executeAction: (actionId: string) => Promise<void>;
  amplifyContent: (contentId: string, platform: string) => Promise<void>;
  validateSocialProof: (proofId: string) => Promise<boolean>;
  refreshStats: () => Promise<void>;
}

export const useSocialActions = (): UseSocialActionsReturn => {
  const { address } = useAccount();
  const { execute } = useSherryRealAction();
  const [isLoading, setIsLoading] = useState(false);
  const [socialStats, setSocialStats] = useState<SocialStats>({
    totalReach: 0,
    engagement: 0,
    viralScore: 0,
    platforms: []
  });
  const [availableActions, setAvailableActions] = useState<SocialAction[]>([]);

  const refreshStats = useCallback(async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      const payload: SherryActionPayload = {
        type: 'fetch-social-stats',
        address
      };
      const response = await execute(payload);
      
      if (response.status === 'success' && response.data) {
        setSocialStats(response.data);
        
        // Actualizar acciones disponibles basadas en las estadísticas
        const actionsPayload: SherryActionPayload = {
          type: 'fetch-available-actions',
          address,
          socialScore: response.data.viralScore
        };
        const actions = await execute(actionsPayload);
        
        if (actions.status === 'success' && actions.data) {
          setAvailableActions(actions.data);
        }
      }
    } catch (error) {
      console.error('Error refreshing social stats:', error);
      window.alert('Error al actualizar estadísticas sociales');
    } finally {
      setIsLoading(false);
    }
  }, [address, execute]);

  const executeAction = useCallback(async (actionId: string) => {
    if (!address) {
      window.alert('Por favor conecta tu wallet');
      return;
    }

    try {
      setIsLoading(true);
      const payload: SherryActionPayload = {
        type: 'execute-social-action',
        address,
        actionId
      };
      const response = await execute(payload);

      if (response.status === 'success') {
        window.alert('¡Acción social completada exitosamente! 🎉');
        await refreshStats();
      } else {
        window.alert('Error al ejecutar la acción social');
      }
    } catch (error) {
      console.error('Error executing social action:', error);
      window.alert('Error al ejecutar la acción social');
    } finally {
      setIsLoading(false);
    }
  }, [address, execute, refreshStats]);

  const amplifyContent = useCallback(async (contentId: string, platform: string) => {
    if (!address) {
      window.alert('Por favor conecta tu wallet');
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Primero validamos el contenido con Cast Protocol
      const validationPayload: SherryActionPayload = {
        type: 'validate-cast-content',
        contentId,
        platform
      };
      const castValidation = await execute(validationPayload);

      if (castValidation.status !== 'success') {
        window.alert('Contenido no válido para amplificación');
        return;
      }

      // Ejecutamos la amplificación
      const signature = await signer.signMessage(
        `Amplify content ${contentId} on ${platform}`
      );
      
      const amplifyPayload: SherryActionPayload = {
        type: 'amplify-content',
        address,
        contentId,
        platform,
        signature
      };
      const response = await execute(amplifyPayload);

      if (response.status === 'success') {
        window.alert('¡Contenido amplificado exitosamente! 🚀');
        await refreshStats();
      } else {
        window.alert('Error al amplificar contenido');
      }
    } catch (error) {
      console.error('Error amplifying content:', error);
      window.alert('Error al amplificar contenido');
    } finally {
      setIsLoading(false);
    }
  }, [address, execute, refreshStats]);

  const validateSocialProof = useCallback(async (proofId: string): Promise<boolean> => {
    if (!address) {
      window.alert('Por favor conecta tu wallet');
      return false;
    }

    try {
      setIsLoading(true);
      const payload: SherryActionPayload = {
        type: 'validate-social-proof',
        address,
        proofId
      };
      const response = await execute(payload);

      return response.status === 'success';
    } catch (error) {
      console.error('Error validating social proof:', error);
      window.alert('Error al validar prueba social');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, execute]);

  // Cargar datos iniciales
  useEffect(() => {
    if (address) {
      refreshStats();
    }
  }, [address, refreshStats]);

  return {
    isLoading,
    socialStats,
    availableActions,
    executeAction,
    amplifyContent,
    validateSocialProof,
    refreshStats
  };
}; 