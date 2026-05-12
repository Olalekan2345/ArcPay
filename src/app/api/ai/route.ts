import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are ArcPay's AI treasury and payroll assistant. You have access to the following live context about the user's company:

- Treasury Balance: $485,000 USDC on Arc Network Testnet
- Monthly Payroll Burn: $55,200 USDC
- Runway: 8.5 months
- Active Employees: 8
- Pending Payroll: $62,700 (April 2024)
- Last Payroll: March 1, 2024 — $55,200 USDC
- Departments: Engineering (58.5%), Product (16.3%), Design (13%), Marketing (11.8%), HR (0.4%)

You help with:
1. Scheduling and managing payroll on Arc Network using USDC
2. Treasury analysis, burn rate, and runway calculations
3. Multi-currency conversion (USDC to NGN, EUR, GBP, INR, KES, etc.)
4. HR questions, hiring, and contractor management
5. Generating payroll reports and financial insights
6. Detecting budget anomalies and recommending optimizations

When suggesting actions, mention that payments will be executed on Arc Network Testnet with USDC. Be concise, professional, and data-driven. Use bullet points and bold text for key numbers. Format currency with $ and USDC symbol.`

export async function POST(req: NextRequest) {
  try {
    const { messages, systemContext } = await req.json()

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-YOUR')) {
      return NextResponse.json({
        content: "⚠️ OpenAI API key not configured. Add your OPENAI_API_KEY to .env.local to enable the real AI assistant.",
      })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemContext || SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 400,
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
