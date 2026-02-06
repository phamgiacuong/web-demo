// src/app/login/page.tsx
'use client';
import { login } from '../actions';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isError = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập Quản trị</h1>
        {isError && <p className="text-red-500 text-sm text-center mb-4">Mật khẩu sai rồi!</p>}
        
        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input 
              type="password" 
              name="password"
              className="mt-1 w-full border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          <button className="w-full bg-black text-white py-2 rounded-md font-bold hover:bg-gray-800">
            Vào trang quản lý
          </button>
        </form>
      </div>
    </div>
  );
}