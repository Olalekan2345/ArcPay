'use client'

import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'

export type PayrollTx = {
  employeeId: string
  employeeName: string
  wallet: string
  amount: number
  txHash: string
  status: 'success' | 'failed'
  error?: string
}

export type PayrollRun = {
  id: string
  date: string
  transactions: PayrollTx[]
  totalAmount: number
  totalPaid: number
  status: 'completed' | 'partial' | 'failed'
}

function storageKey(address: string) {
  return `arcpay_payroll_${address.toLowerCase()}`
}

export function usePayrollHistory() {
  const { address } = useAccount()

  const getHistory = useCallback((): PayrollRun[] => {
    if (!address) return []
    try {
      const raw = localStorage.getItem(storageKey(address))
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [address])

  const saveRun = useCallback((run: PayrollRun) => {
    if (!address) return
    const history: PayrollRun[] = (() => {
      try {
        const raw = localStorage.getItem(storageKey(address))
        return raw ? JSON.parse(raw) : []
      } catch { return [] }
    })()
    localStorage.setItem(storageKey(address), JSON.stringify([run, ...history]))
  }, [address])

  return { getHistory, saveRun }
}
