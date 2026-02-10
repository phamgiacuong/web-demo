'use client';

import { register } from '../actions/auth';
import { useSearchParams } from 'next/navigation';
import { Lock, Phone, User, Mail, AtSign } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = '';
  if (error === 'username_exists') errorMessage = 'Tên đăng nhập này đã được sử dụng.';
  if (error === 'password_mismatch') errorMessage = 'Mật khẩu xác nhận không khớp.';
  if (error === 'missing_fields') errorMessage = 'Vui lòng điền đầy đủ thông tin.';
  if (error === 'unknown') errorMessage = 'Có lỗi xảy ra, vui lòng thử lại.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Đăng ký</h1>
          <p className="text-gray-500 mt-2">Tạo tài khoản thành viên mới</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-6 text-center border border-red-100">
            {errorMessage}
          </div>
        )}
        
        <form action={register} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                name="name"
                placeholder="Nguyễn Văn A"
                className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên đăng nhập</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                name="username"
                placeholder="nguyenvana123"
                className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required 
                pattern="[a-zA-Z0-9_]{3,20}"
                title="Tên đăng nhập 3-20 ký tự, không dấu, không khoảng trắng"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email hoặc Số điện thoại</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                name="contactInfo"
                placeholder="0912345678 hoặc email@example.com"
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
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nhập lại mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="••••••••"
                className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required 
                minLength={6}
              />
            </div>
          </div>

          <button className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-red-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Đăng ký ngay
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Đã có tài khoản? <Link href="/login" className="text-blue-600 font-bold cursor-pointer hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}