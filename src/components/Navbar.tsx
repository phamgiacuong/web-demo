// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Hiệu ứng: Khi cuộn xuống thì Navbar đổi màu
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
              ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' // Khi cuộn: Kính mờ, gọn gàng
              : 'bg-transparent py-6' // Khi ở đầu: Trong suốt, thoáng
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition">
              JP
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none text-gray-900">JAPAN<span className="text-red-600">STORE</span></span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Authentic & Premium</span>
            </div>
          </Link>

          {/* MENU GIỮA (Ẩn trên mobile) */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
            <NavLink href="/?cat=tpcn">Thực phẩm chức năng</NavLink>
            <NavLink href="/?cat=mypham">Mỹ phẩm</NavLink>
            <NavLink href="/?cat=doan">Bánh kẹo</NavLink>
            <NavLink href="/?cat=quanao">Thời trang</NavLink>
          </div>

          {/* ICON BÊN PHẢI */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
              <User className="w-5 h-5" />
            </Link>
            <button className="relative p-2 bg-black text-white rounded-full hover:bg-red-600 transition shadow-lg group">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              0
            </span>
            </button>
          </div>
        </div>
      </nav>
  );
}

// Component link nhỏ
function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
      <Link href={href} className="relative py-2 hover:text-red-600 transition-colors group">
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
      </Link>
  );
}