import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { 
  avalanche, 
  avalancheFuji, 
  base, 
  baseSepolia, 
  mainnet, 
  sepolia, 
  polygon, 
  polygonMumbai,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  scrollSepolia,
  lineaTestnet,
  zoraSepolia
} from 'wagmi/chains'

// 🌐 Configuración de redes soportadas
export const SUPPORTED_NETWORKS = {
  // Mainnets
  ETHEREUM: mainnet,
  AVALANCHE: avalanche,
  BASE: base,
  POLYGON: polygon,
  ARBITRUM: arbitrum,
  OPTIMISM: optimism,
  
  // L2 Testnets (Principales)
  ETHEREUM_SEPOLIA: sepolia,
  AVALANCHE_FUJI: avalancheFuji,
  BASE_SEPOLIA: baseSepolia,
  POLYGON_MUMBAI: polygonMumbai,
  ARBITRUM_SEPOLIA: arbitrumSepolia,
  OPTIMISM_SEPOLIA: optimismSepolia,
  
  // L2 Testnets (Adicionales)
  SCROLL_SEPOLIA: scrollSepolia,
  LINEA_TESTNET: lineaTestnet,
  ZORA_SEPOLIA: zoraSepolia,
} as const

// 🔧 Configuración de red personalizada
export interface NetworkConfig {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
  faucetUrl?: string
  testnet: boolean
}

// 📋 Configuraciones de red detalladas
export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  // Avalanche
  '43114': {
    chainId: '0xA86A',
    chainName: 'Avalanche Mainnet',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/'],
    testnet: false
  },
  '43113': {
    chainId: '0xA869',
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/'],
    faucetUrl: 'https://faucet.avax.network/',
    testnet: true
  },
  
  // Base
  '8453': {
    chainId: '0x2105',
    chainName: 'Base',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org/'],
    testnet: false
  },
  '84532': {
    chainId: '0x14A34',
    chainName: 'Base Sepolia Testnet',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org/'],
    faucetUrl: 'https://faucet.quicknode.com/base/sepolia',
    testnet: true
  },
  
  // Ethereum
  '1': {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/YOUR_KEY'],
    blockExplorerUrls: ['https://etherscan.io/'],
    testnet: false
  },
  '11155111': {
    chainId: '0xAA36A7',
    chainName: 'Sepolia Testnet',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.infura.io/v3/YOUR_KEY'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    faucetUrl: 'https://sepoliafaucet.com/',
    testnet: true
  },
  
  // Polygon
  '137': {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com/'],
    testnet: false
  },
  '80001': {
    chainId: '0x13881',
    chainName: 'Polygon Mumbai',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    faucetUrl: 'https://faucet.polygon.technology/',
    testnet: true
  },
  
  // Arbitrum
  '42161': {
    chainId: '0xA4B1',
    chainName: 'Arbitrum One',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io/'],
    testnet: false
  },
  '421614': {
    chainId: '0x66eee',
    chainName: 'Arbitrum Sepolia',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
    faucetUrl: 'https://faucet.quicknode.com/arbitrum/sepolia',
    testnet: true
  },
  
  // Optimism
  '10': {
    chainId: '0xA',
    chainName: 'Optimism',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io/'],
    testnet: false
  },
  '11155420': {
    chainId: '0xAA37DC',
    chainName: 'Optimism Sepolia',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.optimism.io'],
    blockExplorerUrls: ['https://sepolia-optimism.etherscan.io/'],
    faucetUrl: 'https://faucet.quicknode.com/optimism/sepolia',
    testnet: true
  },
  
  // Scroll (L2)
  '534351': {
    chainId: '0x8274F',
    chainName: 'Scroll Sepolia',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia-rpc.scroll.io'],
    blockExplorerUrls: ['https://sepolia.scrollscan.com/'],
    faucetUrl: 'https://docs.scroll.io/en/user-guide/faucet/',
    testnet: true
  },
  
  // Linea (L2)
  '59141': {
    chainId: '0xE708',
    chainName: 'Linea Sepolia',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.sepolia.linea.build'],
    blockExplorerUrls: ['https://sepolia.lineascan.build/'],
    faucetUrl: 'https://faucet.goerli.linea.build/',
    testnet: true
  },
  
  // Zora (L2)
  '999999999': {
    chainId: '0x3B9AC9FF',
    chainName: 'Zora Sepolia',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://sepolia.rpc.zora.energy'],
    blockExplorerUrls: ['https://sepolia.explorer.zora.energy/'],
    faucetUrl: 'https://sepoliafaucet.com/',
    testnet: true
  }
}

// 🎯 Configuración de proyecto específica
export interface ProjectConfig {
  appName: string
  projectId: string
  supportedChains: number[]
  defaultChain: number
  testnetMode: boolean
}

// 🔧 Crear configuración de Wagmi
export const createWeb3Config = (projectConfig: ProjectConfig) => {
  const chains = projectConfig.supportedChains.map(chainId => {
    const chain = Object.values(SUPPORTED_NETWORKS).find(c => c.id === chainId)
    if (!chain) throw new Error(`Unsupported chain ID: ${chainId}`)
    return chain
  })

  return getDefaultConfig({
    appName: projectConfig.appName,
    projectId: projectConfig.projectId,
    chains: chains as any,
    ssr: false,
  })
}

// 🌐 Obtener configuración de red
export const getNetworkConfig = (chainId: number): NetworkConfig | null => {
  return NETWORK_CONFIGS[chainId.toString()] || null
}

// 🔍 Verificar si es testnet
export const isTestnet = (chainId: number): boolean => {
  const config = getNetworkConfig(chainId)
  return config?.testnet || false
}

// 🎨 Colores de red para UI
export const NETWORK_COLORS = {
  // Ethereum
  '1': '#627eea',      // Ethereum
  '11155111': '#627eea', // Sepolia
  
  // Avalanche
  '43114': '#e84142',  // Avalanche
  '43113': '#e84142',  // Avalanche Fuji
  
  // Base
  '8453': '#0052ff',   // Base
  '84532': '#0052ff',  // Base Sepolia
  
  // Polygon
  '137': '#8247e5',    // Polygon
  '80001': '#8247e5',  // Polygon Mumbai
  
  // Arbitrum
  '42161': '#28a0f0',  // Arbitrum
  '421614': '#28a0f0', // Arbitrum Sepolia
  
  // Optimism
  '10': '#ff0420',     // Optimism
  '11155420': '#ff0420', // Optimism Sepolia
  
  // Scroll
  '534351': '#fbeaa7', // Scroll Sepolia
  
  // Linea
  '59141': '#121212',  // Linea Sepolia
  
  // Zora
  '999999999': '#000000', // Zora Sepolia
} as const 