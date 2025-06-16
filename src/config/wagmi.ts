import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalanche, avalancheFuji } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'DeFi Yield Quest - Sherry Minithon 2025',
  projectId: 'defi-yield-quest-sherry', // You can get a real projectId from WalletConnect Cloud
  chains: [avalanche, avalancheFuji],
  ssr: false, // If your dApp uses server side rendering (SSR)
});