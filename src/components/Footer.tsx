// src/components/Footer.tsx
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Cột 1: Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-1">
                            JAPAN<span className="text-red-600">STORE</span>
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Chuyên cung cấp các sản phẩm nội địa Nhật Bản chính hãng. Chất lượng là danh dự, uy tín là vàng.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-600 hover:text-white transition cursor-pointer">
                                <Facebook className="w-5 h-5" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-600 hover:text-white transition cursor-pointer">
                                <Instagram className="w-5 h-5" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-400 hover:text-white transition cursor-pointer">
                                <Twitter className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Cột 2: Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Mua sắm</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="hover:text-red-600 cursor-pointer transition">Thực phẩm chức năng</li>
                            <li className="hover:text-red-600 cursor-pointer transition">Mỹ phẩm Tokyo</li>
                            <li className="hover:text-red-600 cursor-pointer transition">Bánh kẹo & Đồ ăn</li>
                            <li className="hover:text-red-600 cursor-pointer transition">Thời trang Uniqlo</li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Hỗ trợ khách hàng</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="hover:text-red-600 cursor-pointer transition">Hướng dẫn mua hàng</li>
                            <li className="hover:text-red-600 cursor-pointer transition">Chính sách đổi trả</li>
                            <li className="hover:text-red-600 cursor-pointer transition">Vận chuyển & Giao nhận</li>
                            <li className="hover:text-red-600 cursor-pointer transition">Câu hỏi thường gặp</li>
                        </ul>
                    </div>

                    {/* Cột 4: Liên hệ */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Liên hệ</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <span>Tầng 7, Tòa nhà Keangnam, Phạm Hùng, Hà Nội</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <span>1900 6688 (8:00 - 22:00)</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <span>support@japanstore.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400">© 2024 JapanStore. All rights reserved.</p>
                    <div className="flex gap-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 opacity-50 grayscale hover:grayscale-0 transition" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4 opacity-50 grayscale hover:grayscale-0 transition" alt="Mastercard" />
                    </div>
                </div>
            </div>
        </footer>
    );
}