import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  connectorsForWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  rainbowWallet,
  walletConnectWallet,
  trustWallet,
  ledgerWallet,
  braveWallet,
  argentWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { 
  avalancheFuji,
  avalanche,
  mainnet,
  base,
  polygon
} from 'wagmi/chains';
import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

// Configurar las cadenas y proveedores
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [avalancheFuji, avalanche, mainnet, base, polygon],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || 'default-key' }),
    publicProvider(),
  ]
);

// Configurar las billeteras
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

const connectors = connectorsForWallets([
  {
    groupName: 'Recomendado',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      coinbaseWallet({ appName: 'DeFi Hero Quest', chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
  {
    groupName: 'Otros',
    wallets: [
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
      braveWallet({ chains }),
      argentWallet({ projectId, chains }),
    ],
  },
]);

// Crear la configuración de Wagmi
export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains }; 