import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Định nghĩa các route được bảo vệ
  const isAdminRoute = path.startsWith('/admin');
  const isLoginRoute = path.startsWith('/login');

  // 2. Lấy session từ cookie
  const token = request.cookies.get('session')?.value;
  const session = token ? await verifySession(token) : null;

  // 3. Logic bảo vệ Route
  
  // Nếu đang vào trang Admin mà chưa đăng nhập hoặc không phải ADMIN
  if (isAdminRoute) {
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Nếu đã đăng nhập mà cố vào trang Login -> Chuyển hướng về Admin hoặc Home
  if (isLoginRoute && session) {
    if (session.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};