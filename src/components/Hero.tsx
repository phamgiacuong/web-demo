// src/components/Hero.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Hiệu ứng Parallax nhẹ cho ảnh sản phẩm (di chuyển chậm hơn khi cuộn)
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section ref={ref} className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-[#fdfdfd]">

            {/* --- HẬU CẢNH (Giữ nguyên để tạo không khí) --- */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Mặt trời mọc mờ ảo */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl"></div>

                {/* Cánh hoa Sakura rơi */}
                <FloatingSakura delay={0} className="top-1/4 left-[5%] w-8 h-8 text-red-300/70" />
                <FloatingSakura delay={2} className="top-1/3 right-[40%] w-6 h-6 text-pink-300/70 rotate-45" />
                <FloatingSakura delay={5} className="bottom-1/4 left-[15%] w-10 h-10 text-red-200/70 -rotate-12" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* --- CỘT TRÁI: NỘI DUNG CHỮ --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        {/* Trust Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm mb-6 cursor-default">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                    <img key={i} className="w-6 h-6 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="" />
                                ))}
                            </div>
                            <div className="h-3 w-[1px] bg-gray-200 mx-2"></div>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-bold text-gray-700">4.9/5 (5k+ Đánh giá)</span>
                            </div>
                        </div>

                        {/* Tiêu đề chính */}
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6 text-gray-900">
                            Tinh hoa <br />
                            <span className="relative inline-block text-red-600">
                Nhật Bản
                                {/* Nét gạch chân */}
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-red-100 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
                            <span> trong tầm tay</span>
                        </h1>

                        <p className="text-lg text-gray-500 max-w-lg mb-8 leading-relaxed font-medium">
                            Khám phá bộ sưu tập thực phẩm chức năng, mỹ phẩm và đồ gia dụng <span className="text-gray-900 font-bold">chuẩn nội địa Nhật</span>. Nâng tầm chất lượng cuộc sống của bạn.
                        </p>

                        {/* Nút bấm */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="#products"
                                className="group px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-100 hover:-translate-y-1 flex items-center gap-2"
                            >
                                Mua sắm ngay
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/about"
                                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-full font-bold text-lg hover:border-gray-300 transition flex items-center gap-2"
                            >
                                <ShieldCheck className="w-5 h-5 text-gray-400" /> Cam kết chính hãng
                            </Link>
                        </div>
                    </motion.div>

                    {/* --- CỘT PHẢI: ẢNH SẢN PHẨM ĐỘNG --- */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }} // Easing mượt mà
                        style={{ y, opacity }} // Áp dụng hiệu ứng Parallax
                        className="relative hidden lg:block"
                    >
                        {/* Vòng tròn nền sau ảnh */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gray-100 rounded-full -z-10"></div>

                        {/* Ảnh chính: Bạn thay link ảnh sản phẩm đẹp vào đây */}
                        {/* Đã cập nhật đường dẫn ảnh local */}
                        <img
                            src="/images/banner/hero-main.jpg"
                            alt="Sản phẩm Nhật Bản cao cấp"
                            className="w-full h-auto object-cover rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10"
                        />

                        {/* Ảnh phụ trôi nổi (Floating) */}
                        <motion.img
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            src="/images/banner/hero-sub1.jpg"
                            alt="Sản phẩm phụ 1"
                            className="absolute -bottom-10 -left-10 w-40 h-40 object-cover rounded-2xl shadow-xl border-4 border-white z-20"
                        />
                        <motion.img
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            src="/images/banner/hero-sub2.jpg"
                            alt="Sản phẩm phụ 2"
                            className="absolute -top-10 -right-10 w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white z-0"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Lớp phủ mờ chuyển tiếp */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#fdfdfd] to-transparent z-10"></div>
        </section>
    );
}

// Component Cánh hoa Sakura
function FloatingSakura({ className, delay, duration = 15 }: { className: string, delay: number, duration?: number }) {
    return (
        <motion.div
            animate={{
                y: [0, 150],
                x: [0, 20, -20, 10],
                rotate: [0, 90, 180],
                opacity: [0, 0.8, 0]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                delay: delay
            }}
            className={`absolute pointer-events-none ${className}`}
        >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-sm">
                <path d="M12,2C12,2 10,4 10,7C10,10 12,12 12,12C12,12 14,10 14,7C14,4 12,2 12,2M12,12C12,12 9,14 7,14C5,14 3,12 3,12C3,12 5,16 8,18C11,20 12,22 12,22C12,22 13,20 16,18C19,16 21,12 21,12C21,12 19,14 17,14C15,14 12,12 12,12Z" />
            </svg>
        </motion.div>
    )
}