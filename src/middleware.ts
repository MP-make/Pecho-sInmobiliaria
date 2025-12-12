import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acceso a la página de login
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Proteger todas las rutas /admin/*
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
