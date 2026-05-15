import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

const SYSTEM_PROMPT = `You are ArcPay's AI treasury and payroll assistant for a confidential USDC payroll platform built on Arc Network Testnet using Arcium MPC privacy.

You help with:
1. Scheduling and managing payroll on Arc Network using USDC
2. Treasury analysis, burn rate, and runway calculations
3. Multi-currency conversion (USDC to NGN, EUR, GBP, INR, KES, etc.)
4. HR questions, hiring, and contractor management
5. Generating payroll reports and financial insights
6. Detecting budget anomalies and recommending optimizations

When suggesting actions, mention that payments are executed on Arc Network Testnet with USDC. Be concise, professional, and data-driven. Use bullet points and bold for key numbers.`

export async function POST(req: NextRequest) {
  try {
    const { messages, systemContext } = await req.json()

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.startsWith('gsk_YOUR')) {
      return NextResponse.json({
        content: "⚠️ Groq API key not configured. Add your GROQ_API_KEY to Vercel environment variables to enable the AI assistant. Get a free key at console.groq.com — no credit card required.",
      })
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemContext || SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({
      content: completion.choices[0].message.content,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
