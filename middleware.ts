// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // On désactive TOUTE protection / login / redirect
  return NextResponse.next()
}

// On applique ce middleware à TOUT le site
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}