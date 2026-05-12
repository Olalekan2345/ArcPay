# ArcPay — Setup Guide

## 5-Step Setup to Go Live on Testnet

---

### Step 1 — Fill in `.env.local`

Open `.env.local` and replace all placeholder values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...your actual key
OPENAI_API_KEY=sk-...your actual key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=abc123...your project id
```

- **Supabase**: supabase.com → Project Settings → API
- **OpenAI**: platform.openai.com/api-keys
- **WalletConnect**: cloud.walletconnect.com → Create Project

---

### Step 2 — Set up Supabase Database

1. Go to supabase.com → your project → SQL Editor
2. Paste the entire contents of `supabase-schema.sql`
3. Click Run — this creates all tables with RLS policies

Also in Supabase:
- Authentication → Providers → Enable **Google** (for Google login)
- Authentication → URL Configuration → Add `http://localhost:3000` to allowed redirect URLs

---

### Step 3 — Configure Arc Network Testnet in MetaMask

Add the Arc Network Testnet to MetaMask:
- Network Name: `Arc Network Testnet`
- RPC URL: Check arc.network for their testnet RPC
- Chain ID: Check arc.network docs
- Currency: `ARC`
- Explorer: Check arc.network docs

> Update `NEXT_PUBLIC_ARC_TESTNET_RPC` and `NEXT_PUBLIC_ARC_CHAIN_ID` in `.env.local` once you have the values.

---

### Step 4 — Get Testnet USDC

Once on Arc Testnet:
1. Visit the Arc Network testnet faucet for ARC tokens (for gas)
2. Visit the USDC testnet faucet (or mint test USDC)
3. Update `NEXT_PUBLIC_USDC_CONTRACT` in `.env.local` with the testnet USDC contract address

---

### Step 5 — Run the App

```bash
npm run dev
```

Open http://localhost:3000

---

## What Works Right Now

| Feature | Status |
|---|---|
| Landing page | ✅ Fully working |
| Sign up / Sign in (email) | ✅ Real Supabase auth |
| Google login | ✅ Real OAuth (needs Supabase Google provider enabled) |
| Dashboard UI | ✅ Fully working with mock data |
| Wallet connect (MetaMask) | ✅ Real wallet connection |
| Wallet connect (WalletConnect) | ✅ Real WC connection (needs project ID) |
| USDC balance display | ✅ Real on-chain balance once wallet connected |
| AI Assistant | ✅ Real GPT-4o responses (needs API key) |
| Currency converter | ✅ Live exchange rates from open.er-api.com |
| Route protection | ✅ Middleware redirects unauthenticated users |
| USDC payments | 🔧 Wired up, needs testnet USDC contract address |
| Arc Network explorer links | 🔧 Needs correct explorer URL |

## Architecture

```
Frontend: Next.js 15 + TypeScript + TailwindCSS + Framer Motion
Auth: Supabase Auth (email + Google OAuth)
Database: Supabase PostgreSQL + RLS
Wallet: wagmi v3 + viem (MetaMask, WalletConnect, Coinbase)
Chain: Arc Network Testnet
Payments: USDC ERC-20 transfers via viem
AI: OpenAI GPT-4o-mini via /api/ai route
Rates: open.er-api.com (free, no key needed)
```
