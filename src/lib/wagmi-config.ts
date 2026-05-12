import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
  rabbyWallet,
  phantomWallet,
  braveWallet,
  trustWallet,
  safeWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'
import { sepolia } from 'wagmi/chains'

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
      webSocket: ['wss://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
})

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Detected',
      wallets: [injectedWallet], // auto-detects Rabby, Phantom, Brave, and any EIP-1193 wallet
    },
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        coinbaseWallet,
        phantomWallet,
        braveWallet,
        trustWallet,
        rainbowWallet,
      ],
    },
    {
      groupName: 'More',
      wallets: [
        walletConnectWallet,
        ledgerWallet,
        safeWallet,
      ],
    },
  ],
  {
    appName: 'ArcPay',
    projectId,
  }
)

export const wagmiConfig = createConfig({
  connectors,
  chains: [arcTestnet, sepolia],
  transports: {
    [arcTestnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
})
