import { formatGwei, parseGwei } from 'viem'

// 🔥 Configuración de gas por red
export interface GasConfig {
  chainId: number
  chainName: string
  nativeCurrency: string
  
  // Configuración de gas
  gasLimits: {
    transfer: string          // Transferencia ETH/AVAX/MATIC
    erc20Transfer: string     // Transferencia tokens ERC20
    erc721Mint: string        // Mint NFT
    contractCall: string      // Llamada a contrato genérica
    complexContract: string   // Contratos complejos (DEX, lending)
    deployment: string        // Deploy de contratos
  }
  
  // Precios de gas por velocidad
  gasPrices: {
    slow: string     // Gwei - Transacción lenta (5-10 min)
    standard: string // Gwei - Transacción normal (2-5 min)
    fast: string     // Gwei - Transacción rápida (<2 min)
    instant: string  // Gwei - Transacción instantánea (<30s)
  }
  
  // Configuración automática
  autoGas: {
    enabled: boolean
    fallbackGasPrice: string // Gwei - Si falla la estimación
    maxGasPrice: string      // Gwei - Límite máximo
    gasMultiplier: number    // Multiplicador para estimaciones (1.1 = +10%)
  }
  
  // Costos estimados en USD (aproximados)
  estimatedCosts: {
    transfer: string        // USD
    erc20Transfer: string   // USD
    erc721Mint: string     // USD
    contractCall: string   // USD
  }
}

// 📊 Configuraciones por red
export const GAS_CONFIGS: Record<number, GasConfig> = {
  // ETHEREUM MAINNET
  1: {
    chainId: 1,
    chainName: 'Ethereum',
    nativeCurrency: 'ETH',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '65000',
      erc721Mint: '150000',
      contractCall: '100000',
      complexContract: '300000',
      deployment: '2000000'
    },
    gasPrices: {
      slow: '10',      // 10 gwei
      standard: '15',  // 15 gwei
      fast: '25',      // 25 gwei
      instant: '40'    // 40 gwei
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '20',
      maxGasPrice: '100',
      gasMultiplier: 1.1
    },
    estimatedCosts: {
      transfer: '$5-15',
      erc20Transfer: '$15-25',
      erc721Mint: '$30-60',
      contractCall: '$20-40'
    }
  },

  // AVALANCHE C-CHAIN
  43114: {
    chainId: 43114,
    chainName: 'Avalanche',
    nativeCurrency: 'AVAX',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '50000',
      erc721Mint: '120000',
      contractCall: '80000',
      complexContract: '200000',
      deployment: '1500000'
    },
    gasPrices: {
      slow: '25',      // 25 nAVAX
      standard: '27',  // 27 nAVAX
      fast: '30',      // 30 nAVAX
      instant: '35'    // 35 nAVAX
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '28',
      maxGasPrice: '100',
      gasMultiplier: 1.05
    },
    estimatedCosts: {
      transfer: '$0.01-0.03',
      erc20Transfer: '$0.03-0.05',
      erc721Mint: '$0.08-0.15',
      contractCall: '$0.05-0.10'
    }
  },

  // AVALANCHE FUJI (TESTNET)
  43113: {
    chainId: 43113,
    chainName: 'Avalanche Fuji',
    nativeCurrency: 'AVAX',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '50000',
      erc721Mint: '120000',
      contractCall: '80000',
      complexContract: '200000',
      deployment: '1500000'
    },
    gasPrices: {
      slow: '25',
      standard: '27',
      fast: '30',
      instant: '35'
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '28',
      maxGasPrice: '100',
      gasMultiplier: 1.05
    },
    estimatedCosts: {
      transfer: 'FREE (testnet)',
      erc20Transfer: 'FREE (testnet)',
      erc721Mint: 'FREE (testnet)',
      contractCall: 'FREE (testnet)'
    }
  },

  // BASE
  8453: {
    chainId: 8453,
    chainName: 'Base',
    nativeCurrency: 'ETH',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '45000',
      erc721Mint: '100000',
      contractCall: '70000',
      complexContract: '180000',
      deployment: '1200000'
    },
    gasPrices: {
      slow: '0.001',    // 0.001 gwei (muy barato)
      standard: '0.002', // 0.002 gwei
      fast: '0.005',    // 0.005 gwei
      instant: '0.01'   // 0.01 gwei
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '0.003',
      maxGasPrice: '1',
      gasMultiplier: 1.1
    },
    estimatedCosts: {
      transfer: '$0.001-0.01',
      erc20Transfer: '$0.002-0.02',
      erc721Mint: '$0.005-0.05',
      contractCall: '$0.003-0.03'
    }
  },

  // POLYGON
  137: {
    chainId: 137,
    chainName: 'Polygon',
    nativeCurrency: 'MATIC',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '55000',
      erc721Mint: '130000',
      contractCall: '85000',
      complexContract: '220000',
      deployment: '1600000'
    },
    gasPrices: {
      slow: '30',      // 30 gwei
      standard: '35',  // 35 gwei
      fast: '45',      // 45 gwei
      instant: '60'    // 60 gwei
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '40',
      maxGasPrice: '200',
      gasMultiplier: 1.1
    },
    estimatedCosts: {
      transfer: '$0.01-0.05',
      erc20Transfer: '$0.02-0.08',
      erc721Mint: '$0.05-0.15',
      contractCall: '$0.03-0.10'
    }
  },

  // POLYGON MUMBAI (TESTNET)
  80001: {
    chainId: 80001,
    chainName: 'Polygon Mumbai',
    nativeCurrency: 'MATIC',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '55000',
      erc721Mint: '130000',
      contractCall: '85000',
      complexContract: '220000',
      deployment: '1600000'
    },
    gasPrices: {
      slow: '1',       // 1 gwei (testnet)
      standard: '2',   // 2 gwei
      fast: '5',       // 5 gwei
      instant: '10'    // 10 gwei
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '2',
      maxGasPrice: '50',
      gasMultiplier: 1.1
    },
    estimatedCosts: {
      transfer: 'FREE (testnet)',
      erc20Transfer: 'FREE (testnet)',
      erc721Mint: 'FREE (testnet)',
      contractCall: 'FREE (testnet)'
    }
  },

  // ARBITRUM ONE
  42161: {
    chainId: 42161,
    chainName: 'Arbitrum One',
    nativeCurrency: 'ETH',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '50000',
      erc721Mint: '120000',
      contractCall: '75000',
      complexContract: '180000',
      deployment: '1400000'
    },
    gasPrices: {
      slow: '0.1',     // 0.1 gwei (muy barato)
      standard: '0.15', // 0.15 gwei
      fast: '0.25',    // 0.25 gwei
      instant: '0.5'   // 0.5 gwei
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '0.2',
      maxGasPrice: '2',
      gasMultiplier: 1.1
    },
    estimatedCosts: {
      transfer: '$0.001-0.01',
      erc20Transfer: '$0.002-0.02',
      erc721Mint: '$0.005-0.05',
      contractCall: '$0.003-0.03'
    }
  },

  // ARBITRUM SEPOLIA (TESTNET)
  421614: {
    chainId: 421614,
    chainName: 'Arbitrum Sepolia',
    nativeCurrency: 'ETH',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '50000',
      erc721Mint: '120000',
      contractCall: '75000',
      complexContract: '180000',
      deployment: '1400000'
    },
    gasPrices: {
      slow: '0.01',    // 0.01 gwei (testnet)
      standard: '0.02', // 0.02 gwei
      fast: '0.05',    // 0.05 gwei
      instant: '0.1'   // 0.1 gwei
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '0.02',
      maxGasPrice: '1',
      gasMultiplier: 1.1
    },
    estimatedCosts: {
      transfer: 'FREE (testnet)',
      erc20Transfer: 'FREE (testnet)',
      erc721Mint: 'FREE (testnet)',
      contractCall: 'FREE (testnet)'
    }
  },

  // OPTIMISM
  10: {
    chainId: 10,
    chainName: 'Optimism',
    nativeCurrency: 'ETH',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '50000',
      erc721Mint: '120000',
      contractCall: '75000',
      complexContract: '180000',
      deployment: '1400000'
    },
    gasPrices: {
      slow: '0.001',   // 0.001 gwei (muy barato)
      standard: '0.002', // 0.002 gwei
      fast: '0.005',   // 0.005 gwei
      instant: '0.01'  // 0.01 gwei
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '0.002',
      maxGasPrice: '0.1',
      gasMultiplier: 1.1
    },
    estimatedCosts: {
      transfer: '$0.001-0.01',
      erc20Transfer: '$0.002-0.02',
      erc721Mint: '$0.005-0.05',
      contractCall: '$0.003-0.03'
    }
  },

  // OPTIMISM SEPOLIA (TESTNET)
  11155420: {
    chainId: 11155420,
    chainName: 'Optimism Sepolia',
    nativeCurrency: 'ETH',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '50000',
      erc721Mint: '120000',
      contractCall: '75000',
      complexContract: '180000',
      deployment: '1400000'
    },
    gasPrices: {
      slow: '0.001',   // 0.001 gwei (testnet)
      standard: '0.002', // 0.002 gwei
      fast: '0.005',   // 0.005 gwei
      instant: '0.01'  // 0.01 gwei
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '0.002',
      maxGasPrice: '0.1',
      gasMultiplier: 1.1
    },
    estimatedCosts: {
      transfer: 'FREE (testnet)',
      erc20Transfer: 'FREE (testnet)',
      erc721Mint: 'FREE (testnet)',
      contractCall: 'FREE (testnet)'
    }
  },

  // SCROLL SEPOLIA (TESTNET)
  534351: {
    chainId: 534351,
    chainName: 'Scroll Sepolia',
    nativeCurrency: 'ETH',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '50000',
      erc721Mint: '120000',
      contractCall: '75000',
      complexContract: '180000',
      deployment: '1400000'
    },
    gasPrices: {
      slow: '0.001',   // 0.001 gwei (testnet)
      standard: '0.002', // 0.002 gwei
      fast: '0.005',   // 0.005 gwei
      instant: '0.01'  // 0.01 gwei
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '0.002',
      maxGasPrice: '0.1',
      gasMultiplier: 1.1
    },
    estimatedCosts: {
      transfer: 'FREE (testnet)',
      erc20Transfer: 'FREE (testnet)',
      erc721Mint: 'FREE (testnet)',
      contractCall: 'FREE (testnet)'
    }
  },

  // LINEA SEPOLIA (TESTNET)
  59141: {
    chainId: 59141,
    chainName: 'Linea Sepolia',
    nativeCurrency: 'ETH',
    gasLimits: {
      transfer: '21000',
      erc20Transfer: '50000',
      erc721Mint: '120000',
      contractCall: '75000',
      complexContract: '180000',
      deployment: '1400000'
    },
    gasPrices: {
      slow: '0.001',   // 0.001 gwei (testnet)
      standard: '0.002', // 0.002 gwei
      fast: '0.005',   // 0.005 gwei
      instant: '0.01'  // 0.01 gwei
    },
    autoGas: {
      enabled: true,
      fallbackGasPrice: '0.002',
      maxGasPrice: '0.1',
      gasMultiplier: 1.1
    },
    estimatedCosts: {
      transfer: 'FREE (testnet)',
      erc20Transfer: 'FREE (testnet)',
      erc721Mint: 'FREE (testnet)',
      contractCall: 'FREE (testnet)'
    }
  }
}

// 🎯 Tipos de transacción
export type TransactionType = 
  | 'transfer' 
  | 'erc20Transfer' 
  | 'erc721Mint' 
  | 'contractCall' 
  | 'complexContract' 
  | 'deployment'

export type GasSpeed = 'slow' | 'standard' | 'fast' | 'instant'

// 🔧 Utilidades de gas
export class GasManager {
  
  // Obtener configuración de gas para una red
  static getGasConfig(chainId: number): GasConfig | null {
    return GAS_CONFIGS[chainId] || null
  }

  // Estimar gas para un tipo de transacción
  static estimateGasLimit(chainId: number, txType: TransactionType): string {
    const config = this.getGasConfig(chainId)
    if (!config) return '100000' // Fallback genérico
    
    return config.gasLimits[txType]
  }

  // Obtener precio de gas según velocidad
  static getGasPrice(chainId: number, speed: GasSpeed = 'standard'): string {
    const config = this.getGasConfig(chainId)
    if (!config) return '20' // Fallback genérico
    
    return config.gasPrices[speed]
  }

  // Calcular costo total estimado
  static calculateCost(chainId: number, txType: TransactionType, speed: GasSpeed = 'standard'): {
    gasLimit: string
    gasPrice: string
    totalGas: bigint
    estimatedCostGwei: string
    estimatedCostUSD: string
  } {
    const config = this.getGasConfig(chainId)
    if (!config) {
      return {
        gasLimit: '100000',
        gasPrice: '20',
        totalGas: BigInt(2000000000000000), // 0.002 ETH
        estimatedCostGwei: '2000000',
        estimatedCostUSD: '$2-5'
      }
    }

    const gasLimit = config.gasLimits[txType]
    const gasPrice = config.gasPrices[speed]
    const totalGas = BigInt(gasLimit) * parseGwei(gasPrice)

    // Mapear tipos de transacción a costos estimados
    const getCostEstimate = (type: TransactionType): string => {
      switch (type) {
        case 'transfer':
          return config.estimatedCosts.transfer
        case 'erc20Transfer':
          return config.estimatedCosts.erc20Transfer
        case 'erc721Mint':
          return config.estimatedCosts.erc721Mint
        case 'contractCall':
          return config.estimatedCosts.contractCall
        case 'complexContract':
          return config.estimatedCosts.contractCall // Usar contractCall como fallback
        case 'deployment':
          return config.estimatedCosts.contractCall // Usar contractCall como fallback
        default:
          return config.estimatedCosts.contractCall
      }
    }

    return {
      gasLimit,
      gasPrice,
      totalGas,
      estimatedCostGwei: formatGwei(totalGas),
      estimatedCostUSD: getCostEstimate(txType)
    }
  }

  // Obtener configuración automática de gas
  static getAutoGasConfig(chainId: number) {
    const config = this.getGasConfig(chainId)
    return config?.autoGas || {
      enabled: true,
      fallbackGasPrice: '20',
      maxGasPrice: '100',
      gasMultiplier: 1.1
    }
  }

  // Validar si el precio de gas está dentro de límites
  static validateGasPrice(chainId: number, gasPrice: string): {
    isValid: boolean
    reason?: string
    suggestion?: string
  } {
    const config = this.getGasConfig(chainId)
    if (!config) return { isValid: true }

    const gasPriceNum = parseFloat(gasPrice)
    const maxGasPrice = parseFloat(config.autoGas.maxGasPrice)

    if (gasPriceNum > maxGasPrice) {
      return {
        isValid: false,
        reason: `Gas price ${gasPrice} gwei exceeds maximum ${maxGasPrice} gwei`,
        suggestion: `Use max ${maxGasPrice} gwei or wait for lower network congestion`
      }
    }

    return { isValid: true }
  }

  // Obtener recomendaciones de gas
  static getGasRecommendations(chainId: number): {
    network: string
    recommendations: Array<{
      speed: GasSpeed
      gasPrice: string
      description: string
      timeEstimate: string
    }>
  } {
    const config = this.getGasConfig(chainId)
    if (!config) {
      return {
        network: 'Unknown',
        recommendations: [{
          speed: 'standard',
          gasPrice: '20',
          description: 'Standard transaction',
          timeEstimate: '2-5 minutes'
        }]
      }
    }

    return {
      network: config.chainName,
      recommendations: [
        {
          speed: 'slow',
          gasPrice: config.gasPrices.slow,
          description: 'Economical - Save on fees',
          timeEstimate: '5-10 minutes'
        },
        {
          speed: 'standard',
          gasPrice: config.gasPrices.standard,
          description: 'Recommended - Good balance',
          timeEstimate: '2-5 minutes'
        },
        {
          speed: 'fast',
          gasPrice: config.gasPrices.fast,
          description: 'Fast - Priority processing',
          timeEstimate: '< 2 minutes'
        },
        {
          speed: 'instant',
          gasPrice: config.gasPrices.instant,
          description: 'Instant - Maximum priority',
          timeEstimate: '< 30 seconds'
        }
      ]
    }
  }
}

// 📊 Exportar configuraciones para fácil acceso
export const getGasConfig = GasManager.getGasConfig
export const estimateGasLimit = GasManager.estimateGasLimit
export const getGasPrice = GasManager.getGasPrice
export const calculateGasCost = GasManager.calculateCost
export const getGasRecommendations = GasManager.getGasRecommendations

// 🎨 Configuración UI para mostrar gas
export const GAS_UI_CONFIG = {
  colors: {
    slow: '#10b981',     // Verde (económico)
    standard: '#3b82f6', // Azul (recomendado)
    fast: '#f59e0b',     // Naranja (rápido)
    instant: '#ef4444'   // Rojo (caro)
  },
  icons: {
    slow: '🐌',
    standard: '⚡',
    fast: '🚀',
    instant: '💨'
  }
} 