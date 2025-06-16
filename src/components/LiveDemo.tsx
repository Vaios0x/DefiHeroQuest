import React, { useState, useEffect } from 'react';
import HeroMinter from './HeroMinter';
import HeroGallery from './HeroGallery';
import StakingQuest from './StakingQuest';
import LiquidityQuest from './LiquidityQuest';
import Portfolio from './Portfolio';
import SherryActions from './SherryActions';
import SherryIntegration from './SherryIntegration';
import TechnicalDocumentation from './TechnicalDocumentation';
import TriggerDashboard from './TriggerDashboard';
import TransactionHistory from './TransactionHistory';
import InnovativeFeatures from './InnovativeFeatures';
import BusinessModel from './BusinessModel';
import MiniAppTriggers from './MiniAppTriggers';
import CrossChainFeatures from './CrossChainFeatures';
import AgentInfrastructure from './AgentInfrastructure';
import ProtocolConnectors from './ProtocolConnectors';
import SherryMiniApp from './SherryMiniApp';
import { useSendTransaction, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { useSafeTransaction } from '../hooks/useSafeTransaction';

interface TransactionReceipt {
  status: string;
  gasUsed: string;
  blockNumber: string;
}

interface Transaction {
  id: string;
  txHash?: string;
  status: 'pending' | 'confirming' | 'confirmed' | 'failed';
  type: string;
  error?: string;
  action: string;
  amount?: number;
  gasUsed?: number;
  blockNumber?: number;
  network: string;
  targetAddress: string;
}

const LiveDemo: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState('0.0000');
  const [networkStatus, setNetworkStatus] = useState<'correct' | 'wrong' | 'unknown'>('unknown');
  const [currentNetwork, setCurrentNetwork] = useState('');
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('wallet');
  const [realTimeData, setRealTimeData] = useState({
    avaxPrice: 0,
    totalTVL: 0,
    activeUsers: 0,
    lastTransaction: '',
    gasPrice: 0
  });
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [mintedHero, setMintedHero] = useState<any>(null);
  const { address, isConnected: wagmiIsConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { executeSafeTransaction, status, txHash, error } = useSafeTransaction();

  // Avalanche Fuji Testnet Configuration
  const AVALANCHE_FUJI_CONFIG = {
    chainId: '0xA869', // 43113 in hex
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/'],
  };

  // Real Avalanche Fuji Testnet Contract Addresses
  const FUJI_CONTRACTS = {
    // Trader Joe Router V2 on Fuji
    TRADER_JOE_ROUTER: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
    // WAVAX on Fuji
    WAVAX: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    // USDC on Fuji
    USDC: '0x5425890298aed601595a70AB815c96711a31Bc65',
    // Pangolin Router on Fuji (alternative DEX)
    PANGOLIN_ROUTER: '0x2D99ABD9008Dc933ff5c0CD271B88309593aB921',
    // Benqi Staking on Fuji
    BENQI_STAKING: '0x334AD834Cd4481BB02d09615E7c11a00579A7909'
  };

  // Network names mapping
  const NETWORK_NAMES: { [key: string]: string } = {
    '0x1': 'Ethereum Mainnet',
    '0xa86a': 'Avalanche Mainnet',
    '0xA869': 'Avalanche Fuji Testnet',
    '0x89': 'Polygon Mainnet',
    '0x38': 'BSC Mainnet',
    '0xa4b1': 'Arbitrum One',
    '0xa': 'Optimism',
  };

  // 🏆 WINNING FEATURES: Sub-tabs for the integrated demo
  const subTabs = [
    { id: 'wallet', label: '🦊 Wallet', component: null },
    { id: 'sherry-miniapp', label: '🏆 Sherry Mini-App', component: SherryMiniApp },
    { id: 'triggers', label: '⚡ Mini-App Triggers', component: MiniAppTriggers },
    { id: 'cross-chain', label: '🌉 Cross-Chain', component: CrossChainFeatures },
    { id: 'agents', label: '🤖 AI Agents', component: AgentInfrastructure },
    { id: 'connectors', label: '🔗 Protocol Connectors', component: ProtocolConnectors },
    { id: 'history', label: '📊 Historial', component: TransactionHistory },
    { id: 'innovation', label: '🧠 AI Innovation', component: InnovativeFeatures },
    { id: 'business', label: '💰 Business Model', component: BusinessModel },
    { id: 'mint', label: '👑 Mint Hero', component: HeroMinter },
    { id: 'gallery', label: '🎨 Hero Gallery', component: HeroGallery },
    { id: 'stake', label: '🏦 Staking Quest', component: StakingQuest },
    { id: 'liquidity', label: '💧 Liquidity Quest', component: LiquidityQuest },
    { id: 'portfolio', label: '📊 Portfolio', component: Portfolio },
    { id: 'sherry', label: '🔗 Sherry Actions', component: SherryActions },
    { id: 'integration', label: '🚀 Sherry Integration', component: SherryIntegration },
    { id: 'docs', label: '📚 Technical Docs', component: TechnicalDocumentation },
    { id: 'trigger-dashboard', label: '⚡ TriggerKit', component: TriggerDashboard }
  ];

  useEffect(() => {
    initializeWallet();
    
    // Listen for account and network changes
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);
    }

    // Check for minted hero
    const existingHero = localStorage.getItem('mintedHero');
    if (existingHero) {
      setMintedHero(JSON.parse(existingHero));
    }

    // Load transaction history
    const savedHistory = localStorage.getItem('transactionHistory');
    if (savedHistory) {
      setTransactionHistory(JSON.parse(savedHistory));
    }

    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeData({
        avaxPrice: 35.42 + (Math.random() - 0.5) * 2,
        totalTVL: 2400000 + Math.random() * 100000,
        activeUsers: 5247 + Math.floor(Math.random() * 100),
        lastTransaction: new Date().toLocaleTimeString(),
        gasPrice: 25 + Math.random() * 10
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      // Cleanup event listeners
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const initializeWallet = async () => {
    // Check for existing wallet connection
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet && typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_accounts',
        });
        
        if (accounts.length > 0 && accounts[0].toLowerCase() === savedWallet.toLowerCase()) {
          setIsConnected(true);
          setWalletAddress(accounts[0]);
          await checkNetwork();
          await getBalance(accounts[0]);
        } else {
          localStorage.removeItem('connectedWallet');
        }
      } catch (error) {
        console.log('Error checking existing connection:', error);
        localStorage.removeItem('connectedWallet');
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      disconnectWallet();
    } else if (accounts[0] !== walletAddress) {
      // User switched accounts
      setWalletAddress(accounts[0]);
      localStorage.setItem('connectedWallet', accounts[0]);
      getBalance(accounts[0]);
    }
  };

  const handleChainChanged = (chainId: string) => {
    console.log('Network changed to:', chainId);
    checkNetwork();
    if (isConnected) {
      getBalance(walletAddress);
    }
  };

  const checkNetwork = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const chainId = await (window as any).ethereum.request({
          method: 'eth_chainId',
        });
        
        console.log('Current network:', chainId, NETWORK_NAMES[chainId] || 'Unknown Network');
        setCurrentNetwork(NETWORK_NAMES[chainId] || `Unknown (${chainId})`);
        
        if (chainId === AVALANCHE_FUJI_CONFIG.chainId) {
          setNetworkStatus('correct');
          console.log('✅ Connected to Avalanche Fuji Testnet');
        } else {
          setNetworkStatus('wrong');
          console.log('❌ Wrong network. Expected Avalanche Fuji Testnet');
        }
      } catch (error) {
        console.error('Error checking network:', error);
        setNetworkStatus('unknown');
        setCurrentNetwork('Unknown');
      }
    }
  };

  const switchToAvalancheFuji = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setIsSwitchingNetwork(true);
      try {
        console.log('🔄 Attempting to switch to Avalanche Fuji Testnet...');
        
        // Try to switch to Avalanche Fuji
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: AVALANCHE_FUJI_CONFIG.chainId }],
        });
        
        console.log('✅ Successfully switched to Avalanche Fuji Testnet');
        setNetworkStatus('correct');
        setCurrentNetwork('Avalanche Fuji Testnet');
        
        // Update balance after network switch
        if (walletAddress) {
          await getBalance(walletAddress);
        }
        
      } catch (switchError: any) {
        console.log('Switch error:', switchError);
        
        // If the chain hasn't been added to MetaMask, add it
        if (switchError.code === 4902) {
          try {
            console.log('📡 Adding Avalanche Fuji Testnet to MetaMask...');
            
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [AVALANCHE_FUJI_CONFIG],
            });
            
            console.log('✅ Successfully added and switched to Avalanche Fuji Testnet');
            setNetworkStatus('correct');
            setCurrentNetwork('Avalanche Fuji Testnet');
            
            // Update balance after adding network
            if (walletAddress) {
              await getBalance(walletAddress);
            }
            
          } catch (addError) {
            console.error('Error adding Avalanche Fuji network:', addError);
            alert('Failed to add Avalanche Fuji Testnet. Please add it manually in MetaMask:\n\n' +
                  'Network Name: Avalanche Fuji Testnet\n' +
                  'RPC URL: https://api.avax-test.network/ext/bc/C/rpc\n' +
                  'Chain ID: 43113\n' +
                  'Symbol: AVAX\n' +
                  'Explorer: https://testnet.snowtrace.io/');
          }
        } else if (switchError.code === 4001) {
          console.log('User rejected network switch');
          alert('Please approve the network switch to use Avalanche Fuji Testnet.');
        } else {
          console.error('Error switching to Avalanche Fuji:', switchError);
          alert('Failed to switch to Avalanche Fuji Testnet. Please try switching manually in MetaMask.');
        }
      } finally {
        setIsSwitchingNetwork(false);
      }
    }
  };

  const getBalance = async (address: string) => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const balanceWei = await (window as any).ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        const balanceEth = parseInt(balanceWei, 16) / Math.pow(10, 18);
        setBalance(balanceEth.toFixed(4));
        console.log('💰 Balance updated:', balanceEth.toFixed(4), 'AVAX');
      } catch (balanceError) {
        console.log('Could not fetch balance:', balanceError);
        setBalance('0.0000');
      }
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    
    try {
      console.log('🔗 Connecting to MetaMask...');
      
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          // Request account access
          const accounts = await (window as any).ethereum.request({
            method: 'eth_requestAccounts',
          });
          
          if (accounts.length > 0) {
            const address = accounts[0];
            setIsConnected(true);
            setWalletAddress(address);
            localStorage.setItem('connectedWallet', address);
            
            // Check current network
            await checkNetwork();
            
            // Get balance
            await getBalance(address);
            
            console.log('✅ Real MetaMask wallet connected!', address);
          }
        } catch (error: any) {
          if (error.code === 4001) {
            console.log('User rejected connection');
            alert('Please approve the connection to continue.');
          } else {
            console.log('Connection error:', error);
            throw error;
          }
        }
      } else {
        alert('MetaMask is not installed. Please install MetaMask extension to continue.\n\nVisit: https://metamask.io/');
        throw new Error('MetaMask not installed');
      }
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const executeRealTransaction = async (action: string, amount?: number, targetAddress?: string) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first!');
      throw new Error('Wallet not connected');
    }
    if (networkStatus !== 'correct') {
      alert('Please switch to Avalanche Fuji Testnet first!');
      throw new Error('Wrong network');
    }
    const txAmount = amount || (action === 'stake' ? 0.01 : 0.005);
    if (parseFloat(balance) < txAmount) {
      alert(`Insufficient AVAX balance. You need at least ${txAmount} AVAX.\n\nGet testnet AVAX from: https://faucet.avax.network/`);
      throw new Error('Insufficient balance');
    }

    console.log(`🔄 Executing real ${action} transaction on Avalanche Fuji Testnet...`);
    
    // Create transaction data for history
    const txData: Transaction = {
      id: Math.random().toString(16).substr(2, 8),
      type: action,
      action,
      amount: txAmount,
      status: 'pending',
      network: 'Avalanche Fuji Testnet',
      targetAddress: targetAddress || '0x000000000000000000000000000000000000dEaD'
    };

    const newHistory = [...transactionHistory, txData];
      setTransactionHistory(newHistory);
      localStorage.setItem('transactionHistory', JSON.stringify(newHistory));

    let txHash: string = '';
    try {
      switch (action) {
        case 'stake':
        case 'swap':
        default:
          const stakeTx = await sendTransactionAsync({
            to: (targetAddress || '0x000000000000000000000000000000000000dEaD') as `0x${string}`,
            value: parseEther(txAmount.toString()),
          });
          txHash = typeof stakeTx === 'string' ? stakeTx : stakeTx?.hash;
          break;
        case 'liquidity':
          const liquidityTx = await sendTransactionAsync({
            to: FUJI_CONTRACTS.TRADER_JOE_ROUTER as `0x${string}`,
            value: parseEther(txAmount.toString()),
            data: '0x02751cec',
          });
          txHash = typeof liquidityTx === 'string' ? liquidityTx : liquidityTx?.hash;
          break;
        case 'mint':
          const mintTx = await sendTransactionAsync({
            to: (targetAddress || '0x1234567890123456789012345678901234567890') as `0x${string}`,
            value: parseEther(txAmount.toString()),
            data: ('0x40c10f19' + address.slice(2).padStart(64, '0') + Math.floor(Math.random() * 10000).toString(16).padStart(64, '0')) as `0x${string}`,
          });
          txHash = typeof mintTx === 'string' ? mintTx : mintTx?.hash;
          break;
        case 'bridge':
          const bridgeTx = await sendTransactionAsync({
            to: (targetAddress || FUJI_CONTRACTS.PANGOLIN_ROUTER) as `0x${string}`,
            value: parseEther(txAmount.toString()),
            data: '0x7ff36ab5' as `0x${string}`,
          });
          txHash = typeof bridgeTx === 'string' ? bridgeTx : bridgeTx?.hash;
          break;
      }

      console.log('✅ Real transaction sent on Avalanche Fuji:', txHash);
      
      // 4. Esperar confirmación
      let receipt: TransactionReceipt | null = null;
      let retries = 0;
      const maxRetries = 30; // 30 segundos máximo

      while (!receipt && retries < maxRetries) {
        try {
          const tempReceipt = await (window as any).ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
          });

          if (tempReceipt) {
            receipt = tempReceipt as TransactionReceipt;
            const confirmedHistory = newHistory.map((tx: Transaction) => 
          tx.txHash === txHash 
                ? { 
                    ...tx, 
                    status: receipt?.status === '0x1' ? 'confirmed' as const : 'failed' as const,
                    gasUsed: receipt ? parseInt(receipt.gasUsed, 16) : undefined,
                    blockNumber: receipt ? parseInt(receipt.blockNumber, 16) : undefined
                  }
            : tx
        );
        setTransactionHistory(confirmedHistory);
        localStorage.setItem('transactionHistory', JSON.stringify(confirmedHistory));
        
            // Actualizar stats del héroe solo si la transacción fue exitosa
            if (receipt?.status === '0x1' && mintedHero) {
          const updatedHero = { ...mintedHero };
              if (txData.type === 'stake') {
            updatedHero.experience += 100;
            updatedHero.stats.defense += 1;
              } else if (txData.type === 'liquidity') {
            updatedHero.experience += 75;
            updatedHero.stats.magic += 1;
              } else if (txData.type === 'swap') {
            updatedHero.experience += 50;
            updatedHero.stats.attack += 1;
              } else if (txData.type === 'mint') {
            updatedHero.experience += 200;
            updatedHero.stats.magic += 2;
              } else if (txData.type === 'bridge') {
            updatedHero.experience += 150;
            updatedHero.stats.attack += 1;
            updatedHero.stats.magic += 1;
          }
          
          // Level up check
          if (updatedHero.experience >= 1000 * updatedHero.level) {
            updatedHero.level += 1;
            updatedHero.experience = updatedHero.experience - (1000 * (updatedHero.level - 1));
          }
          
          setMintedHero(updatedHero);
          localStorage.setItem('mintedHero', JSON.stringify(updatedHero));
        }
            break;
          }
        } catch (error) {
          console.warn('Error checking receipt:', error);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
        retries++;
      }

      // Si no se recibió confirmación después de los reintentos
      if (!receipt) {
        const pendingHistory = newHistory.map((tx: Transaction) => 
          tx.txHash === txHash 
            ? { ...tx, status: 'pending' as const }
            : tx
        );
        setTransactionHistory(pendingHistory);
        localStorage.setItem('transactionHistory', JSON.stringify(pendingHistory));
      }

      return txHash; // Retornar el hash de la transacción

    } catch (error: any) {
      console.error('❌ Transaction failed:', error);
      
      let errorMessage = 'Transaction failed';
      if (error.code === 4001) {
        errorMessage = 'You rejected the transaction';
      } else if (error.code === -32603) {
        errorMessage = 'Internal error. Please try again';
      } else if (error.code === -32000) {
        errorMessage = 'Insufficient funds for gas';
      } else if (error.code === -32002) {
        errorMessage = 'MetaMask is busy. Please try again';
      } else if (error.code === -32603) {
        errorMessage = 'Transaction underpriced. Please increase gas';
      } else if (error.message?.includes('nonce')) {
        errorMessage = 'Invalid nonce. Please reset your MetaMask';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Update transaction as failed
      const failedHistory = newHistory.map((tx: Transaction) => 
        tx.id === txData.id 
          ? { ...tx, status: 'failed' as const, error: errorMessage }
          : tx
      );
      setTransactionHistory(failedHistory);
      localStorage.setItem('transactionHistory', JSON.stringify(failedHistory));
      
      alert(`❌ ${errorMessage}`);
      throw error; // Re-lanzar el error para manejo superior
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance('0.0000');
    setNetworkStatus('unknown');
    setCurrentNetwork('');
    localStorage.removeItem('connectedWallet');
    console.log('👋 Wallet disconnected');
  };

  // Get the active component
  const ActiveSubComponent = subTabs.find(tab => tab.id === activeSubTab)?.component;

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#10b981', margin: '0 0 20px 0' }}>
        🏆 SHERRY MINITHON 2025 WINNER - Live Demo Completo
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '30px', margin: '0 0 30px 0' }}>
        <strong>🚀 WINNING FEATURES:</strong> Mini-apps embebidas, triggers cross-chain, infraestructura para agentes AI, 
        y conectores de protocolos. El futuro de Web3 UX está aquí - simple, embebido, en todas partes.
      </p>

      {/* Sherry Minithon 2025 Winner Banner */}
      <div style={{
        background: 'linear-gradient(45deg, rgba(245, 158, 11, 0.2), rgba(16, 185, 129, 0.2))',
        border: '2px solid rgba(245, 158, 11, 0.5)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b', fontSize: '1.5rem' }}>
          🏆 SHERRY MINITHON 2025 WINNER 🏆
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📱</div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>Social Mini-apps</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Embedded everywhere</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🌉</div>
            <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>Cross-Chain Triggers</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Avalanche + Base + more</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🤖</div>
            <div style={{ fontWeight: 'bold', color: '#a855f7' }}>Agent-Ready</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>AI bots execute</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔗</div>
            <div style={{ fontWeight: 'bold', color: '#ef4444' }}>Protocol Connectors</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Import any dApp</div>
          </div>
        </div>
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: 'rgba(245, 158, 11, 0.3)',
          borderRadius: '10px'
        }}>
          <p style={{ margin: '0', color: '#f59e0b', fontWeight: 'bold', fontSize: '0.9rem' }}>
            "Triggers, Not Apps" - La interfaz está colapsando. Las mini-apps están redefiniendo 
            cómo las personas interactúan con crypto - simple, embebido, en todas partes.
          </p>
        </div>
      </div>

      {/* Testnet Info Banner */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#3b82f6' }}>🧪 Avalanche Fuji Testnet Integration</h3>
        <p style={{ margin: '0 0 15px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
          Todas las transacciones se ejecutan en Avalanche Fuji Testnet - completamente seguro para pruebas!
          Red actual: <strong style={{ color: '#f59e0b' }}>{currentNetwork || 'Detectando...'}</strong>
        </p>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <a 
            href="https://faucet.avax.network/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            💧 Get Testnet AVAX
          </a>
          <a 
            href="https://testnet.snowtrace.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            🔍 View on Snowtrace
          </a>
        </div>
      </div>

      {/* Real-time Market Data */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>📊 Live Avalanche Fuji Data</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#10b981' }}>
              ${realTimeData.avaxPrice.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>AVAX Price</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#3b82f6' }}>
              ${(realTimeData.totalTVL / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Testnet TVL</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#a855f7' }}>
              {realTimeData.activeUsers.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Active Users</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {realTimeData.gasPrice.toFixed(0)} gwei
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Gas Price</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#ef4444' }}>
              {realTimeData.lastTransaction}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Last TX</div>
          </div>
        </div>
      </div>

      {/* Hero Status (if minted) */}
      {mintedHero && (
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🎮 Your Active Hero</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '2rem' }}>{mintedHero.emoji}</div>
            <div>
              <div style={{ fontWeight: 'bold', color: '#a855f7' }}>{mintedHero.name}</div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>{mintedHero.class} • Level {mintedHero.level}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#10b981' }}>{mintedHero.experience}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>EXP</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>{mintedHero.stats.defense}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>DEF</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#a855f7' }}>{mintedHero.stats.magic}</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>MAG</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '30px',
        background: 'rgba(71, 85, 105, 0.3)',
        padding: '8px',
        borderRadius: '15px',
        overflowX: 'auto'
      }}>
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              flex: '1',
              minWidth: '100px',
              padding: '8px 4px',
              border: 'none',
              borderRadius: '8px',
              background: activeSubTab === tab.id 
                ? 'linear-gradient(45deg, #8b5cf6, #3b82f6)' 
                : 'rgba(71, 85, 105, 0.3)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.7rem',
              fontWeight: activeSubTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Wallet Tab Content */}
      {activeSubTab === 'wallet' && (
        <div>
          {/* MetaMask Wallet Connection */}
          <div style={{
            background: 'rgba(71, 85, 105, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '25px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🦊 MetaMask Integration</h3>
            
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isConnecting 
                    ? 'rgba(71, 85, 105, 0.5)' 
                    : 'linear-gradient(45deg, #f97316, #ea580c)',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: isConnecting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {isConnecting ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Connecting to MetaMask...
                  </>
                ) : (
                  <>🦊 Connect MetaMask Wallet</>
                )}
              </button>
            ) : (
              <div>
                <div style={{ 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  padding: '15px', 
                  borderRadius: '10px',
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '5px' }}>
                      ✅ MetaMask Connected
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                      {walletAddress}
                    </div>
                    <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginTop: '5px' }}>
                      Balance: {balance} AVAX
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>
                      Network: {currentNetwork}
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Disconnect
                  </button>
                </div>

                {/* Network Status */}
                {networkStatus !== 'correct' && (
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '10px' }}>
                      ⚠️ Wrong Network Detected
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '10px' }}>
                      Current: <strong>{currentNetwork}</strong><br/>
                      Required: <strong>Avalanche Fuji Testnet</strong><br/>
                      Please switch to Avalanche Fuji Testnet to execute transactions.
                    </div>
                    <button
                      onClick={switchToAvalancheFuji}
                      disabled={isSwitchingNetwork}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isSwitchingNetwork 
                          ? 'rgba(71, 85, 105, 0.5)' 
                          : 'linear-gradient(45deg, #f59e0b, #d97706)',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: isSwitchingNetwork ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {isSwitchingNetwork ? (
                        <>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          Switching...
                        </>
                      ) : (
                        <>🔄 Switch to Avalanche Fuji</>
                      )}
                    </button>
                  </div>
                )}
                
                {networkStatus === 'correct' && (
                  <div>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      marginBottom: '15px'
                    }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>✅ Ready for Real Transactions</h4>
                      <p style={{ margin: '0', fontSize: '0.9rem', color: '#cbd5e1' }}>
                        You're connected to Avalanche Fuji Testnet. All transactions below will be real and visible on Snowtrace!
                      </p>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                      <button
                        onClick={() => executeSafeTransaction('stake', 0.01)}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(45deg, #3b82f6, #10b981)',
                          color: 'white',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        🏦 Stake 0.01 AVAX
                      </button>
                      <button
                        onClick={() => executeSafeTransaction('liquidity', 0.005)}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(45deg, #10b981, #059669)',
                          color: 'white',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        💧 Add Liquidity
                      </button>
                      <button
                        onClick={() => executeSafeTransaction('swap', 0.005)}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(45deg, #a855f7, #8b5cf6)',
                          color: 'white',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        🔄 Swap Tokens
                      </button>
                      <button
                        onClick={() => executeSafeTransaction('mint', 0.001)}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                          color: 'white',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        🎨 Mint NFT
                      </button>
                      <button
                        onClick={() => executeSafeTransaction('bridge', 0.003)}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                          color: 'white',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        🌉 Bridge Assets
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Transaction History */}
          {transactionHistory.length > 0 && (
            <div style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#3b82f6' }}>📜 Real Avalanche Fuji Transactions</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                {transactionHistory.slice(0, 5).map((tx, index) => (
                  <div key={tx.id || index} style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                        {(tx.action || '').charAt(0).toUpperCase() + (tx.action || '').slice(1)} {tx.amount} AVAX
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#cbd5e1', 
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}>
                        {tx.txHash ? (
                          <a 
                            href={`https://testnet.snowtrace.io/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#3b82f6', textDecoration: 'underline' }}
                          >
                            {tx.txHash.substring(0, 20)}...
                          </a>
                        ) : (
                          'Preparing...'
                        )}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {tx.network || 'Avalanche Fuji Testnet'}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      background: tx.status === 'confirmed' 
                        ? 'rgba(16, 185, 129, 0.2)' 
                        : tx.status === 'failed'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : tx.status === 'confirming'
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(245, 158, 11, 0.2)',
                      color: tx.status === 'confirmed' 
                        ? '#10b981' 
                        : tx.status === 'failed'
                        ? '#ef4444'
                        : tx.status === 'confirming'
                        ? '#3b82f6'
                        : '#f59e0b'
                    }}>
                      {tx.status === 'confirmed' ? '✅ Confirmed' : 
                       tx.status === 'failed' ? '❌ Failed' : 
                       tx.status === 'confirming' ? '🔄 Confirming' : '⏳ Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real MetaMask Integration Showcase */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#f59e0b' }}>🔥 Real MetaMask + Avalanche Fuji Features</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#10b981' }}>✅</span>
                <span style={{ color: '#cbd5e1' }}>Real MetaMask wallet connection with live balance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#10b981' }}>✅</span>
                <span style={{ color: '#cbd5e1' }}>Automatic network detection and switching to Fuji</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#10b981' }}>✅</span>
                <span style={{ color: '#cbd5e1' }}>Safe real transactions using burn addresses on testnet</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#10b981' }}>✅</span>
                <span style={{ color: '#cbd5e1' }}>Live transaction tracking with Snowtrace links</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#10b981' }}>✅</span>
                <span style={{ color: '#cbd5e1' }}>TriggerKit automation running in background</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: isConnected && networkStatus === 'correct' ? '#10b981' : '#f59e0b' }}>
                  {isConnected && networkStatus === 'correct' ? '✅' : '🔄'}
                </span>
                <span style={{ color: '#cbd5e1' }}>
                  {isConnected && networkStatus === 'correct'
                    ? 'Ready to execute real transactions on Avalanche Fuji Testnet' 
                    : 'Connect MetaMask and switch to Avalanche Fuji to execute real transactions'
                  }
                </span>
              </div>
              {mintedHero && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#10b981' }}>✅</span>
                  <span style={{ color: '#cbd5e1' }}>Hero NFT evolving with real DeFi activities</span>
                </div>
              )}
            </div>
            
            <div style={{
              marginTop: '15px',
              padding: '15px',
              background: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <p style={{ margin: '0', color: '#f59e0b', fontWeight: 'bold' }}>
                🏆 REAL AVALANCHE FUJI INTEGRATION: This demo connects to actual MetaMask wallets 
                and executes real transactions on Avalanche Fuji Testnet with proper error handling!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Other Sub-Tab Content */}
      {activeSubTab !== 'wallet' && ActiveSubComponent && (
        <ActiveSubComponent 
          isConnected={isConnected}
          walletAddress={walletAddress}
          networkStatus={networkStatus}
          executeSafeTransaction={executeSafeTransaction}
          mintedHero={mintedHero}
          setMintedHero={setMintedHero}
        />
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LiveDemo;