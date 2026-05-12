import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const protectedRoutes = ['/dashboard', '/employees', '/payroll', '/treasury', '/hiring', '/invoices', '/ai-assistant', '/analytics', '/settings']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  if (!isProtected) return NextResponse.next()

  // Allow wallet-connected users through
  const walletConnected = request.cookies.get('wallet_connected')?.value
  if (walletConnected) return NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Demo mode — no Supabase configured
  if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT_ID') || !supabaseKey) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirected', 'true')
      return NextResponse.redirect(loginUrl)
    }
  } catch {
    return NextResponse.next()
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/employees/:path*',
    '/payroll/:path*',
    '/treasury/:path*',
    '/hiring/:path*',
    '/invoices/:path*',
    '/ai-assistant/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ],
}
