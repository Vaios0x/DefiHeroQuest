import { useState, useCallback } from 'react'
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi'
import { parseEther, formatEther, parseGwei } from 'viem'
import { getNetworkConfig, isTestnet, NETWORK_CONFIGS } from '../lib/web3-config'
import { GasManager, TransactionType, GasSpeed } from '../lib/gas-config'

export interface TransactionConfig {
  to: string
  value?: string // En ETH/AVAX/MATIC etc.
  data?: string
  gasLimit?: string
  gasPrice?: string
  gasSpeed?: GasSpeed
  transactionType?: TransactionType
  targetChainId?: number
}

export interface TransactionResult {
  hash: string
  blockNumber?: number
  gasUsed?: string
  status: 'success' | 'failed'
  explorerUrl: string
}

export interface TransactionState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  error: string | null
  result: TransactionResult | null
}

export const useMultichainTransactions = () => {
  const { address, chainId, isConnected } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const { switchChainAsync } = useSwitchChain()
  
  const [state, setState] = useState<TransactionState>({
    isLoading: false,
    isPending: false,
    isConfirming: false,
    error: null,
    result: null
  })

  // 🔄 Cambiar de red automáticamente
  const switchToChain = useCallback(async (targetChainId: number) => {
    if (!isConnected) {
      throw new Error('Wallet not connected')
    }

    if (chainId === targetChainId) {
      return // Ya está en la red correcta
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      // Intentar cambiar de red
      await switchChainAsync({ chainId: targetChainId })
      
      setState(prev => ({ ...prev, isLoading: false }))
    } catch (error: any) {
      // Si la red no está añadida, intentar añadirla
      if (error.code === 4902) {
        await addNetworkToWallet(targetChainId)
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: `Failed to switch network: ${error.message}` 
        }))
        throw error
      }
    }
  }, [chainId, isConnected, switchChainAsync])

  // ➕ Añadir red a MetaMask
  const addNetworkToWallet = useCallback(async (targetChainId: number) => {
    const networkConfig = getNetworkConfig(targetChainId)
    if (!networkConfig) {
      throw new Error(`Network configuration not found for chain ID: ${targetChainId}`)
    }

    try {
      await (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      })
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: `Failed to add network: ${error.message}` 
      }))
      throw error
    }
  }, [])

  // 💰 Verificar balance
  const checkBalance = useCallback(async (requiredAmount: string, targetChainId?: number) => {
    if (!address || !isConnected) {
      throw new Error('Wallet not connected')
    }

    const currentChainId = targetChainId || chainId
    if (!currentChainId) {
      throw new Error('Chain ID not available')
    }

    try {
      const balance = await (window as any).ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })
      
      const balanceInEth = formatEther(BigInt(balance))
      const required = parseFloat(requiredAmount)
      
      if (parseFloat(balanceInEth) < required) {
        const networkConfig = getNetworkConfig(currentChainId)
        const symbol = networkConfig?.nativeCurrency.symbol || 'ETH'
        
        let errorMessage = `Insufficient ${symbol} balance. Required: ${requiredAmount} ${symbol}, Available: ${parseFloat(balanceInEth).toFixed(4)} ${symbol}`
        
        if (isTestnet(currentChainId) && networkConfig?.faucetUrl) {
          errorMessage += `\n\nGet testnet tokens from: ${networkConfig.faucetUrl}`
        }
        
        throw new Error(errorMessage)
      }
      
      return true
    } catch (error: any) {
      throw new Error(`Balance check failed: ${error.message}`)
    }
  }, [address, chainId, isConnected])

  // 🚀 Ejecutar transacción
  const executeTransaction = useCallback(async (config: TransactionConfig) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      isPending: false, 
      isConfirming: false, 
      error: null, 
      result: null 
    }))

    try {
      // 1. Cambiar de red si es necesario
      if (config.targetChainId && config.targetChainId !== chainId) {
        await switchToChain(config.targetChainId)
      }

      const currentChainId = config.targetChainId || chainId
      if (!currentChainId) {
        throw new Error('Chain ID not available')
      }

      // 2. Verificar balance si se especifica valor
      if (config.value) {
        await checkBalance(config.value, currentChainId)
      }

      // 3. Preparar parámetros de transacción
      const txParams: any = {
        to: config.to as `0x${string}`,
      }

      if (config.value) {
        txParams.value = parseEther(config.value)
      }

      if (config.data) {
        txParams.data = config.data as `0x${string}`
      }

      // 🔥 Configuración inteligente de gas
      const txType = config.transactionType || 'contractCall'
      const gasSpeed = config.gasSpeed || 'standard'

      // Gas Limit - Primero intentar estimación real
      let estimatedGasLimit: bigint
      try {
        estimatedGasLimit = await (window as any).ethereum.request({
          method: 'eth_estimateGas',
          params: [{ ...txParams, from: address }]
        }).then((gas: string) => BigInt(gas))

        // Añadir buffer de seguridad
        estimatedGasLimit = estimatedGasLimit * 120n / 100n // 20% buffer
      } catch (error) {
        console.warn('Gas estimation failed, using fallback:', error)
        // Usar estimación automática basada en tipo de transacción como fallback
        const fallbackGasLimit = GasManager.estimateGasLimit(currentChainId, txType)
        estimatedGasLimit = BigInt(fallbackGasLimit)
      }

      txParams.gas = estimatedGasLimit

      // Gas Price - Primero intentar obtener precio actual de la red
      let gasPrice: bigint
      try {
        const currentGasPrice = await (window as any).ethereum.request({
          method: 'eth_gasPrice',
          params: []
        }).then((price: string) => BigInt(price))

        // Ajustar según velocidad seleccionada
        const multiplier = gasSpeed === 'slow' ? 0.9
          : gasSpeed === 'fast' ? 1.2
          : gasSpeed === 'instant' ? 1.5
          : 1.0

        gasPrice = currentGasPrice * BigInt(Math.floor(multiplier * 100)) / 100n
      } catch (error) {
        console.warn('Gas price fetch failed, using fallback:', error)
        // Usar precio recomendado basado en velocidad como fallback
        const recommendedGasPrice = GasManager.getGasPrice(currentChainId, gasSpeed)
        gasPrice = parseGwei(recommendedGasPrice)
      }

      // Validar que el precio de gas no exceda el máximo
      const gasConfig = GasManager.getAutoGasConfig(currentChainId)
      if (gasConfig?.maxGasPrice) {
        const maxGasPrice = parseGwei(gasConfig.maxGasPrice)
        if (gasPrice > maxGasPrice) {
          gasPrice = maxGasPrice
        }
      }

      txParams.gasPrice = gasPrice

      setState(prev => ({ ...prev, isLoading: false, isPending: true }))

      // 4. Enviar transacción
      const hash = await sendTransactionAsync(txParams)

      setState(prev => ({ ...prev, isPending: false, isConfirming: true }))

      // 5. Generar URL del explorador
      const networkConfig = getNetworkConfig(currentChainId)
      const explorerUrl = networkConfig 
        ? `${networkConfig.blockExplorerUrls[0]}/tx/${hash}`
        : `https://etherscan.io/tx/${hash}`

      // 6. Esperar confirmación y obtener recibo
      let receipt
      try {
        receipt = await (window as any).ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [hash]
        })
      } catch (error) {
        console.warn('Failed to get receipt:', error)
      }

      // 7. Resultado con datos del recibo si disponible
      const result: TransactionResult = {
        hash,
        status: receipt?.status === '0x1' ? 'success' : 'failed',
        blockNumber: receipt?.blockNumber ? parseInt(receipt.blockNumber, 16) : undefined,
        gasUsed: receipt?.gasUsed ? receipt.gasUsed.toString() : undefined,
        explorerUrl
      }

      setState(prev => ({ 
        ...prev, 
        isConfirming: false, 
        result 
      }))

      return result

    } catch (error: any) {
      console.error('Transaction failed:', error)
      
      let errorMessage = 'Transaction failed'
      if (error.code === 4001) {
        errorMessage = 'User rejected the transaction'
      } else if (error.code === -32603) {
        errorMessage = 'Internal error. Please try again'
      } else if (error.code === -32000) {
        errorMessage = 'Insufficient funds for gas'
      } else if (error.code === -32002) {
        errorMessage = 'MetaMask is busy. Please try again'
      } else if (error.code === -32603) {
        errorMessage = 'Transaction underpriced. Please increase gas price'
      } else if (error.message?.includes('nonce')) {
        errorMessage = 'Invalid nonce. Please reset your MetaMask account'
      } else if (error.message) {
        errorMessage = error.message
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isPending: false, 
        isConfirming: false, 
        error: errorMessage 
      }))

      throw new Error(errorMessage)
    }
  }, [isConnected, address, chainId, sendTransactionAsync, switchToChain, checkBalance])

  // 🔄 Reset del estado
  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      isPending: false,
      isConfirming: false,
      error: null,
      result: null
    })
  }, [])

  // 🌐 Obtener información de la red actual
  const getCurrentNetworkInfo = useCallback(() => {
    if (!chainId) return null
    
    const config = getNetworkConfig(chainId)
    return config ? {
      ...config,
      isTestnet: isTestnet(chainId),
      chainId: chainId
    } : null
  }, [chainId])

  // 🔥 Obtener estimación de gas
  const getGasEstimate = useCallback((txType: TransactionType, gasSpeed: GasSpeed = 'standard') => {
    if (!chainId) return null
    
    return GasManager.calculateCost(chainId, txType, gasSpeed)
  }, [chainId])

  // 🔥 Obtener recomendaciones de gas
  const getGasRecommendations = useCallback(() => {
    if (!chainId) return null
    
    return GasManager.getGasRecommendations(chainId)
  }, [chainId])

  // 🔥 Validar precio de gas
  const validateGasPrice = useCallback((gasPrice: string) => {
    if (!chainId) return { isValid: true }
    
    return GasManager.validateGasPrice(chainId, gasPrice)
  }, [chainId])

  return {
    // Estado
    ...state,
    chainId,
    address,
    isConnected,
    
    // Funciones principales
    executeTransaction,
    switchToChain,
    checkBalance,
    resetState,
    getCurrentNetworkInfo,
    
    // Funciones de gas
    getGasEstimate,
    getGasRecommendations,
    validateGasPrice,
    
    // Configuraciones disponibles
    availableNetworks: NETWORK_CONFIGS
  }
} 