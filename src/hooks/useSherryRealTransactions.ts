import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import {
  createMetadata,
  isAddress,
  VALID_CHAINS
} from '@sherrylinks/sdk';

export const useSherryRealTransactions = (sendTransactionAsync?: any) => {
  const { sendTransactionAsync: fallbackSendTx } = useSendTransaction();
  const sendTx = sendTransactionAsync || fallbackSendTx;

  const executeRealSherryTransaction = async (
    actionType: string,
    data: any,
    gasAmount: string = '0.001'
  ) => {
    console.log('🔥 EXECUTING REAL SHERRY TRANSACTION:', actionType);

    try {
      if (!data?.address) {
        throw new Error('No address provided for transaction');
      }

      // 1. Real Sherry SDK validation
      const metadata = createMetadata({
        url: 'https://defi-hero-quest.vercel.app',
        icon: '🎮',
        title: `DeFi Hero ${actionType}`,
        description: `Real blockchain transaction for ${actionType}`,
        actions: [{
          type: 'dynamic',
          label: `Execute ${actionType}`,
          path: `/api/actions/${actionType}`,
          chains: {
            source: 'fuji'
          },
          params: {
            action: actionType,
            ...data,
            chainId: data?.chainId || 43113,
            address: data?.address
          }
        }]
      });

      console.log('✅ Sherry metadata created for transaction');

      // 2. Address validation using real Sherry SDK
      if (!isAddress(data.address)) {
        throw new Error('Invalid sender address - Sherry SDK validation failed');
      }

      if (data?.to && !isAddress(data.to)) {
        throw new Error('Invalid recipient address - Sherry SDK validation failed');
      }

      // 3. Chain validation using real Sherry SDK
      const chainId = data?.chainId || 43113;
      if (!Object.values(VALID_CHAINS).includes(chainId)) {
        throw new Error(`Invalid chain ID: ${chainId}`);
      }

      // 4. Prepare transaction with real validation
      const transactionData = {
        to: data.to || data.address, // Use recipient address if provided, otherwise use sender
        value: parseEther(gasAmount),
        data: data?.data || '0x', // Transaction data
      };

      console.log('🎯 Sending real transaction with MetaMask:', transactionData);

      // 5. Execute real blockchain transaction
      const hash = await sendTx(transactionData);

      console.log('✅ REAL TRANSACTION SENT:', hash);

      // 6. Return enhanced response with Sherry SDK context
      return {
        success: true,
        hash,
        actionType,
        sherryValidated: true,
        metadata,
        chainId,
        gasAmount,
        timestamp: new Date().toISOString(),
        realBlockchainTransaction: true
      };

    } catch (error) {
      console.error('❌ REAL SHERRY TRANSACTION FAILED:', error);
      throw error;
    }
  };

  return {
    executeRealSherryTransaction
  };
}; 