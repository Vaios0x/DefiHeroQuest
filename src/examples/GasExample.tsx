import React from 'react'
import { useMultichainTransactions } from '../hooks/useMultichainTransactions'
import { GasSelector } from '../components/GasSelector'

const GasExample = () => {
  const { executeTransaction, isLoading } = useMultichainTransactions()

  const handleTransaction = async () => {
    await executeTransaction({
      to: '0x1234567890123456789012345678901234567890',
      value: '0.001',
      transactionType: 'transfer',
      gasSpeed: 'standard'
    })
  }

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>Gas Configuration Example</h2>
      <GasSelector transactionType="transfer" />
      <button onClick={handleTransaction} disabled={isLoading}>
        Send Transaction
      </button>
    </div>
  )
}

export default GasExample 