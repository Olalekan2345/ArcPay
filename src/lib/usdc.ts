import { parseUnits, formatUnits } from 'viem'
import { erc20Abi } from 'viem'

// USDC on Arc Testnet — ERC-20 interface uses 6 decimals
// (18 decimals is only for internal gas accounting, not for token transfers/balances)
export const USDC_DECIMALS = 6

// Arc Testnet USDC ERC-20 contract: 0x3600000000000000000000000000000000000000
export const USDC_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_USDC_CONTRACT || '0x3600000000000000000000000000000000000000'
) as `0x${string}`

export const usdcAbi = erc20Abi

export function parseUSDC(amount: string | number): bigint {
  return parseUnits(amount.toString(), USDC_DECIMALS)
}

export function formatUSDC(amount: bigint): string {
  return formatUnits(amount, USDC_DECIMALS)
}
