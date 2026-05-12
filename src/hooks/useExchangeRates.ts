'use client'

import { useQuery } from '@tanstack/react-query'

interface RatesResponse {
  rates: Record<string, number>
  cached: boolean
  updatedAt: string
  fallback?: boolean
}

async function fetchRates(): Promise<RatesResponse> {
  const res = await fetch('/api/rates')
  if (!res.ok) throw new Error('Failed to fetch rates')
  return res.json()
}

export function useExchangeRates() {
  return useQuery({
    queryKey: ['exchange-rates'],
    queryFn: fetchRates,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
  })
}
