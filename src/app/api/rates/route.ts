import { NextResponse } from 'next/server'

// Cache rates for 5 minutes
let cachedRates: Record<string, number> | null = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000

export async function GET() {
  try {
    const now = Date.now()

    if (cachedRates && now - cacheTime < CACHE_DURATION) {
      return NextResponse.json({ rates: cachedRates, cached: true, updatedAt: new Date(cacheTime).toISOString() })
    }

    // Fetch from open exchange rates API (no key needed for USD base)
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 300 },
    })

    if (!res.ok) throw new Error('Rate fetch failed')

    const data = await res.json()

    const relevantRates: Record<string, number> = {
      NGN: data.rates.NGN || 1580,
      EUR: data.rates.EUR || 0.92,
      GBP: data.rates.GBP || 0.79,
      INR: data.rates.INR || 83.5,
      KES: data.rates.KES || 129,
      CAD: data.rates.CAD || 1.36,
      AUD: data.rates.AUD || 1.53,
      BRL: data.rates.BRL || 4.97,
      SGD: data.rates.SGD || 1.34,
      AED: data.rates.AED || 3.67,
      ZAR: data.rates.ZAR || 18.5,
    }

    cachedRates = relevantRates
    cacheTime = now

    return NextResponse.json({
      rates: relevantRates,
      cached: false,
      updatedAt: new Date().toISOString(),
    })
  } catch {
    // Return fallback rates if API fails
    return NextResponse.json({
      rates: {
        NGN: 1580, EUR: 0.92, GBP: 0.79, INR: 83.5,
        KES: 129, CAD: 1.36, AUD: 1.53, BRL: 4.97,
        SGD: 1.34, AED: 3.67, ZAR: 18.5,
      },
      cached: true,
      updatedAt: new Date().toISOString(),
      fallback: true,
    })
  }
}
