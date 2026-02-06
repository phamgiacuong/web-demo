// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, User, ShieldCheck } from 'lucide-react'; // Thêm ShieldCheck nếu muốn icon Admin ngầu hơn
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Navbar() {
  const { cart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
      <motion.nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isScrolled
                  ? 'bg-white/80 backdrop-blur-md shadow-sm py-4'
                  : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shadow-lg transition-colors ${
                isScrolled ? 'bg-red-600 text-white' : 'bg-white text-red-600'
            }`}>
              JP
            </div>
            <div className="flex flex-col">
            <span className={`font-black text-xl tracking-tighter leading-none transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-gray-900'
            }`}>
              JAPAN<span className="text-red-600">STORE</span>
            </span>
            </div>
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm">
            {['Thực phẩm CN', 'Mỹ phẩm', 'Bánh kẹo', 'Thời trang'].map((item) => (
                <Link
                    key={item}
                    href={`/?q=${item}`}
                    className={`transition-colors hover:text-red-600 ${
                        isScrolled ? 'text-gray-600' : 'text-gray-800'
                    }`}
                >
                  {item}
                </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-full transition-colors hover:bg-black/5 ${isScrolled ? 'text-gray-600' : 'text-gray-800'}`}>
              <Search className="w-5 h-5" />
            </button>

            <Link href="/cart" className="relative group">
              <div className={`p-2 rounded-full transition-colors hover:bg-black/5 ${isScrolled ? 'text-gray-600' : 'text-gray-800'}`}>
                <ShoppingBag className="w-5 h-5 group-hover:text-red-600 transition" />
              </div>
              {cart.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                {cart.length}
              </span>
              )}
            </Link>

            {/* 👇 ĐÃ SỬA: Biến nút User thành Link vào Admin */}
            <Link
                href="/admin"
                title="Vào trang quản trị"
                className={`hidden md:block p-2 rounded-full transition-colors hover:bg-black/5 ${isScrolled ? 'text-gray-600' : 'text-gray-800'}`}
            >
              <User className="w-5 h-5" />
            </Link>

            <button className={`md:hidden p-2 rounded-full transition-colors hover:bg-black/5 ${isScrolled ? 'text-gray-600' : 'text-gray-800'}`}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>
  );
}