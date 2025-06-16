import { ethers } from 'ethers';

export interface TriggerContext {
  sender: string;
  data: any;
  contracts: {
    [key: string]: ethers.Contract;
  };
}

export interface TriggerResult {
  success: boolean;
  message?: string;
  data?: any;
}

export interface TriggerConfig {
  name: string;
  description: string;
  conditions: (context: TriggerContext) => Promise<TriggerResult>;
  actions: (context: TriggerContext) => Promise<TriggerResult>;
  validate?: (context: TriggerContext) => Promise<TriggerResult>;
}

export function createTrigger(config: TriggerConfig) {
  return {
    ...config,
    async execute(context: TriggerContext): Promise<TriggerResult> {
      try {
        // Validación opcional
        if (config.validate) {
          const validationResult = await config.validate(context);
          if (!validationResult.success) {
            return validationResult;
          }
        }

        // Verificar condiciones
        const conditionsResult = await config.conditions(context);
        if (!conditionsResult.success) {
          return conditionsResult;
        }

        // Ejecutar acciones
        return await config.actions(context);

      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Error desconocido'
        };
      }
    }
  };
} 