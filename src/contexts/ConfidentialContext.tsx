'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useSignMessage } from 'wagmi'
import { useAccount } from 'wagmi'

interface ConfidentialContextValue {
  revealed: boolean
  revealing: boolean
  reveal: () => Promise<void>
  conceal: () => void
  mask: (value: number) => string
  maskRaw: (value: number) => string | number
}

const ConfidentialContext = createContext<ConfidentialContextValue | null>(null)

export function ConfidentialProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const { signMessageAsync } = useSignMessage()
  const { isConnected } = useAccount()

  const reveal = async () => {
    if (!isConnected) return
    setRevealing(true)
    try {
      await signMessageAsync({
        message: [
          'ArcPay Confidential Salary Access',
          '',
          'I authorize decryption of encrypted salary data for this session.',
          'This signature proves wallet ownership via Arcium MPC authorization.',
          'No transaction will be broadcast.',
          '',
          `Timestamp: ${new Date().toISOString()}`,
        ].join('\n'),
      })
      setRevealed(true)
    } catch {
      // User rejected or wallet error — stay concealed
    } finally {
      setRevealing(false)
    }
  }

  const conceal = () => setRevealed(false)

  // Returns formatted string — masked or real
  const mask = (value: number): string => {
    if (revealed) return `$${value.toLocaleString()}`
    return '••••••'
  }

  // Returns raw number when revealed, masked string when not
  const maskRaw = (value: number): string | number => {
    if (revealed) return value
    return '••••••'
  }

  return (
    <ConfidentialContext.Provider value={{ revealed, revealing, reveal, conceal, mask, maskRaw }}>
      {children}
    </ConfidentialContext.Provider>
  )
}

export function useConfidential() {
  const ctx = useContext(ConfidentialContext)
  if (!ctx) throw new Error('useConfidential must be used inside ConfidentialProvider')
  return ctx
}
