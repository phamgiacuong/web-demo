// src/app/login/page.tsx
'use client';
import { login } from '../actions/auth'; // Import từ actions mới
import { useSearchParams } from 'next/navigation';
import { Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const success = searchParams.get('success');
  const callbackUrl = searchParams.get('callbackUrl') || ''; // Lấy callbackUrl

  let errorMessage = '';
  if (error === 'invalid_credentials') errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng.';
  if (error === 'missing_fields') errorMessage = 'Vui lòng điền đầy đủ thông tin.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Đăng nhập</h1>
          <p className="text-gray-500 mt-2">Truy cập hệ thống Hàng Nhật Nội Địa</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-6 text-center border border-red-100">
            {errorMessage}
          </div>
        )}

        {success === 'registered' && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium mb-6 text-center border border-green-100">
            Đăng ký thành công! Vui lòng đăng nhập.
          </div>
        )}
        
        <form action={login} className="space-y-5">
          {/* Input hidden để gửi callbackUrl */}
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên đăng nhập</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                name="username"
                placeholder="nguyenvana123"
                className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required 
              />
            </div>
          </div>

          <button className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-red-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản? <Link href="/register" className="text-blue-600 font-bold cursor-pointer hover:underline">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}