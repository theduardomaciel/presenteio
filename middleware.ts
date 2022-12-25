// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import isAuthenticated from 'lib/isAuthenticated'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // API
    const accountAuthenticated = isAuthenticated(request)
    if (request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.includes('auth') && !accountAuthenticated) {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Authentication failed.' }),
            { status: 401, headers: { 'content-type': 'application/json' } }
        )
    }

    if ((request.nextUrl.pathname.length === 1 || request.nextUrl.pathname.startsWith('/auth')) && accountAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/dashboard') && !accountAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/:path', '/dashboard/:path*', '/auth/:path*', '/api/:function*'],
}