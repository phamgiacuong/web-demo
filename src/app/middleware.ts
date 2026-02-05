// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Kiểm tra nếu người dùng đang cố vào trang admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Kiểm tra xem có bánh quy (cookie) 'auth' chưa
    const authCookie = request.cookies.get('auth')

    if (authCookie?.value !== 'true') {
      // Chưa có thì đá về trang login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return NextResponse.next()
}

// Cấu hình: Chỉ chạy middleware trên các đường dẫn bắt đầu bằng /admin
export const config = {
  matcher: '/admin/:path*',
}