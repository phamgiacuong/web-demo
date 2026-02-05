// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    // Thay đổi class ở đây: bg-white/70 (trắng mờ 70%) + backdrop-blur-xl (làm nhòe mạnh)
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase flex items-center gap-1">
          JAPAN<span className="text-red-600">STORE</span>
          <span className="w-2 h-2 bg-red-600 rounded-full mt-1 animate-pulse"></span>
        </Link>

        {/* Menu giữa */}
        <div className="hidden md:flex gap-8 font-medium text-sm text-gray-600">
          <Link href="/" className="hover:text-red-600 transition relative group">
            Trang chủ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/?cat=tpcn" className="hover:text-red-600 transition relative group">
            Thực phẩm chức năng
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/?cat=doan" className="hover:text-red-600 transition relative group">
            Đồ ăn
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/?cat=quanao" className="hover:text-red-600 transition relative group">
            Thời trang
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
          </Link>
        </div>

        {/* Nút Admin */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="bg-black/90 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-red-600 transition shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5">
            Quản lý
          </Link>
        </div>
      </div>
    </nav>
  );
}