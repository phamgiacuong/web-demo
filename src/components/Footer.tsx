// src/components/Footer.tsx
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10 mt-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Cột 1: Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <h3 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-1">
                                Hàng Nhật<span className="text-red-600"> nội địa</span>
                            </h3>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-xs">
                            Tinh hoa hàng Nhật nội địa. Chúng tôi cam kết mang đến những sản phẩm chất lượng nhất cho cuộc sống của bạn.
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all duration-300 hover:-translate-y-1">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Cột 2: Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6 text-lg">Mua sắm</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            {['Thực phẩm chức năng', 'Mỹ phẩm Tokyo', 'Bánh kẹo & Đồ ăn', 'Thời trang Uniqlo'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-red-600 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-red-500 transition-colors"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6 text-lg">Hỗ trợ</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            {['Hướng dẫn mua hàng', 'Chính sách đổi trả', 'Vận chuyển & Giao nhận', 'Câu hỏi thường gặp'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-red-600 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-red-500 transition-colors"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 4: Newsletter */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6 text-lg">Đăng ký nhận tin</h4>
                        <p className="text-gray-500 text-sm mb-4">Nhận thông tin khuyến mãi mới nhất từ chúng tôi.</p>
                        <form className="flex flex-col gap-3">
                            <input 
                                type="email" 
                                placeholder="Email của bạn..." 
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-50 transition-all outline-none text-sm font-medium"
                            />
                            <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group">
                                Đăng ký ngay <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p className="text-xs font-medium text-gray-400">© 2026 Hàng Nhật nội địa. All rights reserved.</p>
                        <div className="flex gap-4 text-xs font-medium text-gray-400">
                            <Link href="#" className="hover:text-gray-900 transition">Điều khoản</Link>
                            <Link href="#" className="hover:text-gray-900 transition">Bảo mật</Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-5" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-5" alt="Mastercard" />
                    </div>
                </div>
            </div>
        </footer>
    );
}