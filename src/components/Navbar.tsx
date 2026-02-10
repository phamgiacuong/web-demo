// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { usePathname } from 'next/navigation';
import { checkAuth, logout } from '../app/actions/auth';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { cart } = useCart();
  const pathname = usePathname();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await checkAuth();
      setUser(session);
    };
    fetchUser();
  }, [pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Di chuyển logic ẩn Navbar xuống dưới cùng, sau khi tất cả Hooks đã được gọi
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Thực phẩm CN', href: '/?cat=tpcn' },
    { name: 'Mỹ phẩm', href: '/?cat=mypham' },
    { name: 'Bánh kẹo', href: '/?cat=doan' },
    { name: 'Thời trang', href: '/?cat=quanao' },
  ];

  const shouldShowBackground = pathname !== '/' || isScrolled;

  return (
      <>
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
            shouldShowBackground 
                ? 'bg-white/95 backdrop-blur-xl shadow-sm py-3 border-b border-gray-100' 
                : 'bg-transparent py-6'
        }`}>
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">

            {/* 1. LOGO */}
            <Link href="/" className="flex items-center gap-2 group z-50">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">JP</div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tighter leading-none text-gray-900 group-hover:text-red-600 transition-colors">Hàng Nhật nội địa</span>
              </div>
            </Link>

            {/* 2. MENU DESKTOP */}
            <div className={`hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all duration-300 ${
                shouldShowBackground ? 'bg-gray-50 border-gray-200' : 'bg-white/50 backdrop-blur-md border-gray-100 shadow-sm'
            }`}>
              {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className="px-5 py-2 rounded-full text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-white transition-all duration-300"
                  >
                    {link.name}
                  </Link>
              ))}
            </div>

            {/* 3. ICON PHẢI */}
            <div className="flex items-center gap-3">
              {/* Nút Tìm kiếm */}
              <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition text-gray-600">
                <Search className="w-5 h-5" />
              </button>

              {/* User Menu (Login/Logout) */}
              {user ? (
                <div className="relative group">
                  <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition text-gray-900 bg-gray-50 border border-gray-200">
                    <User className="w-5 h-5" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tài khoản</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}</p>
                    </div>
                    
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition">
                        Trang quản trị
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => logout()} 
                      className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition text-gray-600" title="Đăng nhập">
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Giỏ hàng */}
              <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-full hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 group">
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in shadow-sm">
                  {totalItems}
                </span>
                )}
              </Link>

              {/* Nút Hamburger (Mobile) */}
              <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* 4. MOBILE MENU DRAWER */}
        <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={() => setIsMobileMenuOpen(false)} 
          />

          {/* Nội dung Menu */}
          <div className={`absolute top-0 right-0 w-[85%] max-w-xs h-full bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-6 flex justify-between items-center border-b border-gray-50">
              <span className="font-black text-xl text-gray-900">Danh mục</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-6">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, idx) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center justify-between p-4 rounded-2xl text-gray-600 font-bold bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all group"
                        style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                      {link.name}
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-400" />
                    </Link>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-400 uppercase">Xin chào</p>
                        <p className="font-bold text-gray-900">{user.role === 'ADMIN' ? 'Admin' : 'Thành viên'}</p>
                      </div>
                    </div>
                    
                    {user.role === 'ADMIN' && (
                      <Link
                          href="/admin"
                          className="flex items-center justify-center gap-3 p-4 bg-gray-900 rounded-2xl font-bold text-white hover:bg-blue-600 transition shadow-lg"
                      >
                        <User className="w-5 h-5" /> Khu vực Quản trị
                      </Link>
                    )}
                    
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition"
                    >
                      <LogOut className="w-5 h-5" /> Đăng xuất
                    </button>
                  </div>
                ) : (
                  <Link
                      href="/login"
                      className="flex items-center justify-center gap-3 p-4 bg-gray-900 rounded-2xl font-bold text-white hover:bg-red-600 transition shadow-lg shadow-gray-200"
                  >
                    <User className="w-5 h-5" /> Đăng nhập / Đăng ký
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
  );
}