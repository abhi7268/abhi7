import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options)
        },
        remove(name: string, options: any) {
          res.cookies.set(name, '', options)
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = req.nextUrl.pathname

  // 1. In pages ko bina login ke access nahi kiya ja sakta
  const isProtected =
    pathname.startsWith('/dashboard') || // ✅ Added dashboard to protection
    pathname.startsWith('/settings') ||
    pathname.startsWith('/problems') ||
    pathname.startsWith('/mentor') ||
    pathname.startsWith('/streak')

  // 2. Agar user logged in nahi hai aur protected page par hai -> Login par bhejo
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 3. Agar user logged in hai aur login page ya home page par hai -> Dashboard bhejo
  // Isse 404 error (Home page wala) nahi aayega
  if ((pathname === '/login' || pathname === '/') && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  // Static files aur images ko ignore karein
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}