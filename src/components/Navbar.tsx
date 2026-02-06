// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State cho menu mobile
  const { cart } = useCart();
  const pathname = usePathname();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Hiệu ứng cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Thực phẩm CN', href: '/?cat=tpcn' },
    { name: 'Mỹ phẩm', href: '/?cat=mypham' },
    { name: 'Bánh kẹo', href: '/?cat=doan' },
    { name: 'Thời trang', href: '/?cat=quanao' },
  ];

  return (
      <>
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
        }`}>
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">

            {/* 1. LOGO */}
            <Link href="/" className="flex items-center gap-2 group z-50">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition">JP</div>
              <div className="flex flex-col">
                <span className="font-black text-lg md:text-xl tracking-tighter leading-none text-gray-900">JAPAN<span className="text-red-600">STORE</span></span>
                <span className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-widest uppercase">Authentic</span>
              </div>
            </Link>

            {/* 2. MENU DESKTOP (Ẩn trên mobile) */}
            <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
              {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-red-600 transition relative group">
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                  </Link>
              ))}
            </div>

            {/* 3. ICON PHẢI (Tìm kiếm, Admin, Giỏ hàng, Hamburger) */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Nút Tìm kiếm */}
              <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
                <Search className="w-5 h-5 md:w-5 md:h-5" />
              </button>

              {/* 👇 ADMIN LINK (Đã hiện trên mobile) */}
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
                <User className="w-5 h-5 md:w-5 md:h-5" />
              </Link>

              {/* Giỏ hàng */}
              <Link href="/cart" className="relative p-2 bg-black text-white rounded-full hover:bg-red-600 transition shadow-lg group mr-1 md:mr-0">
                <ShoppingBag className="w-5 h-5 md:w-5 md:h-5" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                  {totalItems}
                </span>
                )}
              </Link>

              {/* Nút Hamburger (Chỉ hiện trên mobile) */}
              <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* 4. MOBILE MENU DRAWER (Trượt từ phải sang) */}
        <div className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Backdrop tối */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />

          {/* Nội dung Menu */}
          <div className={`absolute top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <span className="font-black text-xl text-gray-900">Danh mục</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {/* Danh sách link */}
              <div className="flex flex-col px-6 gap-2">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center justify-between py-4 text-gray-600 font-medium border-b border-gray-50 hover:text-red-600 hover:pl-2 transition-all"
                    >
                      {link.name}
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </Link>
                ))}
              </div>

              {/* Khu vực Admin trong Menu (Dự phòng nếu muốn ẩn icon trên header) */}
              <div className="mt-8 px-6">
                <Link
                    href="/admin"
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition"
                >
                  <User className="w-5 h-5" /> Khu vực Quản trị
                </Link>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 text-center text-xs text-gray-400">
              &copy; 2026 JapanStore Mobile
            </div>
          </div>
        </div>
      </>
  );
}