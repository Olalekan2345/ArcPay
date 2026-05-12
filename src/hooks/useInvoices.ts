'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'

export type Invoice = {
  id: string
  invoiceNumber: string
  client: string
  clientEmail: string
  description: string
  amount: number
  dueDate: string
  status: 'draft' | 'pending' | 'paid' | 'overdue'
  createdAt: string
  walletAddress: string
}

function storageKey(address: string) {
  return `arcpay_invoices_${address.toLowerCase()}`
}

export function useInvoices() {
  const { address, isConnected } = useAccount()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    if (!address) { setLoading(false); return }
    try {
      const raw = localStorage.getItem(storageKey(address))
      setInvoices(raw ? JSON.parse(raw) : [])
    } catch {
      setInvoices([])
    }
    setLoading(false)
  }, [address])

  useEffect(() => { load() }, [load])

  const save = (list: Invoice[]) => {
    if (!address) return
    localStorage.setItem(storageKey(address), JSON.stringify(list))
    setInvoices(list)
  }

  const addInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => {
    const inv: Invoice = {
      ...data,
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    }
    save([...invoices, inv])
    return inv
  }

  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    save(invoices.map(i => i.id === id ? { ...i, ...data } : i))
  }

  const deleteInvoice = (id: string) => {
    save(invoices.filter(i => i.id !== id))
  }

  const totalInvoiced = invoices.reduce((a, i) => a + i.amount, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((a, i) => a + i.amount, 0)
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((a, i) => a + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((a, i) => a + i.amount, 0)

  return {
    invoices, loading, isConnected,
    addInvoice, updateInvoice, deleteInvoice,
    totalInvoiced, totalPaid, totalPending, totalOverdue,
  }
}
