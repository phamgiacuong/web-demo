// src/components/Hero.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-50">

            {/* BACKGROUND TRANG TRÍ (HÌNH TRÒN MỜ ẢO) */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-200/40 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* CỘT TRÁI: CHỮ */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm mb-6">
                            <span className="flex gap-1 text-yellow-400"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></span>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Hàng chuẩn Nhật 100%</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                            Tinh hoa <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Nhật Bản</span> trong tầm tay
                        </h1>

                        <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Khám phá bộ sưu tập thực phẩm chức năng, mỹ phẩm và đồ gia dụng nội địa Nhật cao cấp nhất.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="#products" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-600 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                Mua sắm ngay <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition shadow-sm">
                                Xem khuyến mãi
                            </button>
                        </div>
                    </motion.div>

                    {/* CỘT PHẢI: ẢNH MINH HỌA (DÙNG ẢNH MẪU UNPLASH) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition duration-700">
                            <img
                                src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=2787&auto=format&fit=crop"
                                alt="Japan Product"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Thẻ nổi trang trí */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Đã bán</p>
                                    <p className="text-lg font-black text-gray-900">1,200+</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}