import { useSendTransaction, useAccount, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';

const AVALANCHE_FUJI_CONFIG = {
  chainId: '0xA869',
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/'],
};

export function useSafeTransaction() {
  const { address, isConnected, chainId } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();

  // Cambia automáticamente a Fuji si es necesario
  const ensureFuji = async () => {
    if (chainId !== 43113) {
      try {
        await switchChainAsync({ chainId: 43113 });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_FUJI_CONFIG],
          });
        } else {
          throw switchError;
        }
      }
    }
  };

  // Valida balance antes de enviar
  const validateBalance = async (amount: string) => {
    const balanceWei = await (window as any).ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    const balance = Number(BigInt(balanceWei) / BigInt(1e14)) / 1e4;
    if (balance < parseFloat(amount)) {
      throw new Error('Insufficient AVAX balance.');
    }
  };

  // Envía la transacción y trackea en Snowtrace
  const sendSafeTx = async ({ to, value, data }: { to: string, value: string, data?: string }) => {
    if (!isConnected) throw new Error('Please connect your wallet first!');
    await ensureFuji();
    await validateBalance(value);

    try {
      const tx = await sendTransactionAsync({
        to: to as `0x${string}`,
        value: parseEther(value),
        data: data as `0x${string}` | undefined,
      });
      const hash = typeof tx === 'string' ? tx : tx?.hash;
      window.open(`https://testnet.snowtrace.io/tx/${hash}`, '_blank');
      return hash;
    } catch (txError: any) {
      let errorMessage = 'Transaction failed. ';
      if (txError.code === 4001) errorMessage += 'User rejected the transaction.';
      else if (txError.code === -32603) errorMessage += 'Internal error. Please try again.';
      else if (txError.code === -32000) errorMessage += 'Insufficient funds for gas.';
      else errorMessage += txError.message;
      throw new Error(errorMessage);
    }
  };

  return { sendSafeTx };
} 