'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { arcTestnet } from '@/lib/wagmi-config'
import { USDC_CONTRACT_ADDRESS, parseUSDC, formatUSDC } from '@/lib/usdc'
import { erc20Abi } from 'viem'

export function useWallet() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()

  // Read USDC balance via ERC-20 interface (6 decimals)
  // Contract: 0x3600000000000000000000000000000000000000
  const { data: usdcBalance, refetch: refetchBalance } = useBalance({
    address,
    token: USDC_CONTRACT_ADDRESS,
    chainId: arcTestnet.id,
  })

  const { writeContractAsync, isPending: isSending } = useWriteContract()

  // Send USDC via ERC-20 transfer (6 decimals)
  const sendUSDC = async (to: `0x${string}`, amount: number) => {
    const amountInUnits = parseUSDC(amount)
    return writeContractAsync({
      address: USDC_CONTRACT_ADDRESS,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [to, amountInUnits],
      chainId: arcTestnet.id,
    })
  }

  const isOnArcTestnet = chain?.id === arcTestnet.id

  const formattedUSDC = usdcBalance
    ? parseFloat(formatUSDC(usdcBalance.value)).toFixed(2)
    : '0.00'

  return {
    address,
    isConnected,
    isConnecting,
    isOnArcTestnet,
    chain,
    connectors,
    connect,
    disconnect,
    usdcBalance,
    isSending,
    sendUSDC,
    refetchBalance,
    formattedUSDC,
  }
}
