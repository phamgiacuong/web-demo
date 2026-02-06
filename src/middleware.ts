// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Lấy cookie tên là 'auth'
  const authCookie = request.cookies.get('auth')

  // Nếu người dùng muốn vào trang bắt đầu bằng '/admin'
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Nếu không có cookie 'auth' -> ĐÁ VỀ TRANG LOGIN
    if (!authCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Cấu hình: Middleware chỉ chạy trên các đường dẫn này
export const config = {
  matcher: '/admin/:path*',
}