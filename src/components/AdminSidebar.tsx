'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Settings } from 'lucide-react';
import { logout } from '../app/actions/auth';

const menuItems = [
  { name: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
  { name: 'Sản phẩm', href: '/admin/products', icon: Package }, // Tạm thời trỏ về /admin/products (cần tạo trang này hoặc redirect /admin về đây)
  { name: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Người dùng', href: '/admin/users', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed top-0 left-0 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-110 transition">JP</div>
          <span className="font-black text-lg tracking-tight text-gray-900">Admin<span className="text-red-600">Panel</span></span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Logic active: 
          // - Nếu href là /admin thì active khi pathname chính xác là /admin
          // - Các mục khác active khi pathname bắt đầu bằng href
          const isActive = item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}