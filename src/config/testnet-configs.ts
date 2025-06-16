// src/config/testnet-configs.ts
// 🧪 Configuraciones específicas para desarrollo en L2 testnets

import { ProjectConfig } from '../lib/web3-config'

// 🔥 CONFIGURACIÓN COMPLETA L2 TESTNETS
export const L2_TESTNET_CONFIG: ProjectConfig = {
  appName: 'L2 MultiChain DApp',
  projectId: 'l2-multichain-testnet',
  supportedChains: [
    // Ethereum L1 (para comparación)
    11155111,  // Sepolia
    
    // Avalanche (tu configuración actual)
    43113,     // Avalanche Fuji
    
    // Layer 2 principales
    421614,    // Arbitrum Sepolia
    11155420,  // Optimism Sepolia
    80001,     // Polygon Mumbai
    84532,     // Base Sepolia
    
    // Layer 2 emergentes
    534351,    // Scroll Sepolia
    59141,     // Linea Sepolia
    999999999, // Zora Sepolia (solo si soporta wagmi)
  ],
  defaultChain: 43113,    // Avalanche Fuji (mantienes tu configuración)
  testnetMode: true
}

// 🎯 CONFIGURACIÓN SOLO ARBITRUM & OPTIMISM
export const ARB_OP_TESTNET_CONFIG: ProjectConfig = {
  appName: 'Arbitrum & Optimism DApp',
  projectId: 'arb-op-testnet',
  supportedChains: [
    11155111,  // Sepolia (L1 reference)
    421614,    // Arbitrum Sepolia
    11155420,  // Optimism Sepolia
    43113,     // Avalanche Fuji (tu favorito)
  ],
  defaultChain: 421614,   // Arbitrum como principal
  testnetMode: true
}

// 🟣 CONFIGURACIÓN POLYGON + BASE
export const POLYGON_BASE_TESTNET_CONFIG: ProjectConfig = {
  appName: 'Polygon & Base DApp',
  projectId: 'polygon-base-testnet',
  supportedChains: [
    80001,     // Polygon Mumbai
    84532,     // Base Sepolia
    43113,     // Avalanche Fuji (siempre incluido)
  ],
  defaultChain: 80001,    // Polygon Mumbai como principal
  testnetMode: true
}

// 🚀 CONFIGURACIÓN TODAS LAS L2 (máxima compatibilidad)
export const ALL_L2_TESTNET_CONFIG: ProjectConfig = {
  appName: 'Universal L2 DApp',
  projectId: 'universal-l2-testnet',
  supportedChains: [
    // L1 Reference
    11155111,  // Sepolia
    
    // Tu configuración original
    43113,     // Avalanche Fuji
    
    // Optimistic Rollups
    421614,    // Arbitrum Sepolia
    11155420,  // Optimism Sepolia
    84532,     // Base Sepolia
    
    // Polygon
    80001,     // Polygon Mumbai
    
    // zkEVM & otros
    534351,    // Scroll Sepolia
    59141,     // Linea Sepolia
  ],
  defaultChain: 43113,    // Avalanche como principal
  testnetMode: true
}

// 💰 CONFIGURACIÓN PARA DEFI EN L2
export const DEFI_L2_TESTNET_CONFIG: ProjectConfig = {
  appName: 'DeFi L2 Protocol',
  projectId: 'defi-l2-testnet',
  supportedChains: [
    43113,     // Avalanche Fuji (DeFi ecosystem)
    421614,    // Arbitrum Sepolia (mejor para DeFi)
    11155420,  // Optimism Sepolia (bajas fees)
    80001,     // Polygon Mumbai (yield farming)
  ],
  defaultChain: 43113,
  testnetMode: true
}

// 🎮 CONFIGURACIÓN PARA GAMING EN L2
export const GAMING_L2_TESTNET_CONFIG: ProjectConfig = {
  appName: 'Gaming L2 DApp',
  projectId: 'gaming-l2-testnet',
  supportedChains: [
    80001,     // Polygon Mumbai (gaming ecosystem)
    84532,     // Base Sepolia (rápido y barato)
    421614,    // Arbitrum Sepolia (alta velocidad)
    43113,     // Avalanche Fuji (siempre incluido)
  ],
  defaultChain: 80001,    // Polygon para gaming
  testnetMode: true
}

// 🎨 CONFIGURACIÓN PARA NFTS EN L2
export const NFT_L2_TESTNET_CONFIG: ProjectConfig = {
  appName: 'NFT L2 Marketplace',
  projectId: 'nft-l2-testnet',
  supportedChains: [
    11155111,  // Sepolia (para NFTs premium)
    84532,     // Base Sepolia (NFT ecosystem)
    421614,    // Arbitrum Sepolia (bajas fees)
    80001,     // Polygon Mumbai (minting barato)
    43113,     // Avalanche Fuji (velocidad)
    999999999, // Zora Sepolia (specialized for NFTs)
  ],
  defaultChain: 84532,    // Base para NFTs
  testnetMode: true
}

// 📋 FUNCIONES UTILES PARA CONFIGURACIÓN

// Obtener configuración según tipo de proyecto
export const getConfigByProjectType = (projectType: 'defi' | 'gaming' | 'nft' | 'universal' | 'arb-op' | 'polygon-base'): ProjectConfig => {
  switch (projectType) {
    case 'defi':
      return DEFI_L2_TESTNET_CONFIG
    case 'gaming':
      return GAMING_L2_TESTNET_CONFIG
    case 'nft':
      return NFT_L2_TESTNET_CONFIG
    case 'arb-op':
      return ARB_OP_TESTNET_CONFIG
    case 'polygon-base':
      return POLYGON_BASE_TESTNET_CONFIG
    case 'universal':
    default:
      return ALL_L2_TESTNET_CONFIG
  }
}

// Verificar si una chain es L2
export const isL2Chain = (chainId: number): boolean => {
  const l2Chains = [421614, 11155420, 80001, 84532, 534351, 59141, 999999999]
  return l2Chains.includes(chainId)
}

// Obtener tipo de L2
export const getL2Type = (chainId: number): string => {
  const l2Types: Record<number, string> = {
    421614: 'Optimistic Rollup (Arbitrum)',
    11155420: 'Optimistic Rollup (Optimism)', 
    84532: 'Optimistic Rollup (Base)',
    80001: 'Plasma/PoS (Polygon)',
    534351: 'zkEVM (Scroll)',
    59141: 'zkEVM (Linea)',
    999999999: 'Optimistic Rollup (Zora)'
  }
  return l2Types[chainId] || 'L1 or Unknown'
}

// Obtener faucets específicos para L2
export const getL2Faucets = (chainId: number): { name: string, url: string }[] => {
  const faucets: Record<number, { name: string, url: string }[]> = {
    // Ethereum L1
    11155111: [
      { name: 'Sepolia Faucet', url: 'https://sepoliafaucet.com/' },
      { name: 'QuickNode Faucet', url: 'https://faucet.quicknode.com/ethereum/sepolia' }
    ],
    
    // Avalanche
    43113: [
      { name: 'Avalanche Faucet', url: 'https://faucet.avax.network/' },
      { name: 'Core Faucet', url: 'https://core.app/tools/testnet-faucet/' }
    ],
    
    // Arbitrum
    421614: [
      { name: 'QuickNode Arbitrum', url: 'https://faucet.quicknode.com/arbitrum/sepolia' },
      { name: 'Alchemy Faucet', url: 'https://sepoliafaucet.com/' }
    ],
    
    // Optimism
    11155420: [
      { name: 'QuickNode Optimism', url: 'https://faucet.quicknode.com/optimism/sepolia' },
      { name: 'Superchain Faucet', url: 'https://app.optimism.io/faucet' }
    ],
    
    // Polygon
    80001: [
      { name: 'Polygon Faucet', url: 'https://faucet.polygon.technology/' },
      { name: 'QuickNode Polygon', url: 'https://faucet.quicknode.com/polygon/mumbai' }
    ],
    
    // Base
    84532: [
      { name: 'QuickNode Base', url: 'https://faucet.quicknode.com/base/sepolia' },
      { name: 'Coinbase Faucet', url: 'https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet' }
    ],
    
    // Scroll
    534351: [
      { name: 'Scroll Faucet', url: 'https://docs.scroll.io/en/user-guide/faucet/' }
    ],
    
    // Linea
    59141: [
      { name: 'Linea Faucet', url: 'https://faucet.goerli.linea.build/' }
    ]
  }
  
  return faucets[chainId] || []
}

// 💡 INFORMACIÓN SOBRE CADA L2
export const L2_INFO = {
  arbitrum: {
    name: 'Arbitrum',
    type: 'Optimistic Rollup',
    strengths: ['Baja latencia', 'Compatibilidad EVM completa', 'Ecosystem DeFi robusto'],
    bestFor: ['DeFi protocols', 'Trading applications', 'Complex smart contracts'],
    gasMultiplier: 0.1, // ~10x más barato que Ethereum
  },
  optimism: {
    name: 'Optimism',
    type: 'Optimistic Rollup', 
    strengths: ['Muy bajas fees', 'Rápida finalidad', 'Simplicidad'],
    bestFor: ['Pagos', 'DEXs simples', 'Aplicaciones de usuario'],
    gasMultiplier: 0.05, // ~20x más barato que Ethereum
  },
  polygon: {
    name: 'Polygon',
    type: 'Plasma/PoS',
    strengths: ['Muy maduro', 'Ecosystem grande', 'Gaming friendly'],
    bestFor: ['Gaming', 'NFTs', 'High throughput apps'],
    gasMultiplier: 0.01, // ~100x más barato que Ethereum
  },
  base: {
    name: 'Base',
    type: 'Optimistic Rollup',
    strengths: ['Backed by Coinbase', 'Crecimiento rápido', 'Developer friendly'],
    bestFor: ['Consumer apps', 'NFTs', 'Social applications'],
    gasMultiplier: 0.02, // ~50x más barato que Ethereum
  }
} as const

// Exportar configuración por defecto (tu configuración actual + L2s)
export const DEFAULT_L2_CONFIG = L2_TESTNET_CONFIG 