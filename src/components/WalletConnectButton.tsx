'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function WalletConnectButton() {
  return (
    <ConnectButton
      label="Connect Wallet"
      accountStatus="avatar"
      chainStatus="icon"
      showBalance={true}
    />
  )
}
