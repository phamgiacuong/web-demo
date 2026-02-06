// src/components/ProductGallery.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images }: { images: string[] }) {
    const displayImages = images.length > 0 ? images : ['https://via.placeholder.com/500'];
    const [activeIndex, setActiveIndex] = useState(0);

    // Hàm chuyển ảnh
    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    }, [displayImages.length]);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    }, [displayImages.length]);

    // Lắng nghe sự kiện bàn phím
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrev, handleNext]);

    return (
        <div className="space-y-6 sticky top-32">
            {/* ẢNH CHÍNH - HIỆU ỨNG STUDIO & FLOATING */}
            <div className="relative aspect-square rounded-[2.5rem] border-2 border-gray-100 overflow-hidden group cursor-crosshair bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">

                {/* Nền Studio Light: Tạo điểm sáng ở giữa */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-50 via-gray-100 to-white opacity-70"></div>

                {/* Hiệu ứng bóng dưới chân sản phẩm */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-black/20 blur-3xl rounded-[100%] transition-all duration-500 group-hover:w-1/2 group-hover:blur-2xl"></div>

                <AnimatePresence mode="wait">
                    <motion.img
                        key={displayImages[activeIndex]}
                        src={displayImages[activeIndex]}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 1.05 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        alt="Product Detail"
                        // Thêm drop-shadow mạnh và hiệu ứng float khi hover
                        className="w-full h-full object-contain p-10 relative z-10 drop-shadow-2xl transition-all duration-700 group-hover:scale-125 group-hover:-translate-y-4"
                    />
                </AnimatePresence>

                {/* Nút điều hướng trái/phải (chỉ hiện khi hover) */}
                <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-20"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-20"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black text-gray-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 flex items-center gap-2">
                    🔍 Phóng to
                </div>
            </div>

            {/* DANH SÁCH ẢNH NHỎ - Tinh chỉnh lại */}
            <div className="grid grid-cols-5 gap-3">
                {displayImages.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`aspect-square rounded-2xl overflow-hidden relative transition-all duration-300 ${
                            activeIndex === index
                                ? 'ring-2 ring-red-600 ring-offset-2 shadow-md scale-105 z-10 bg-white'
                                : 'ring-1 ring-gray-200 bg-gray-50 hover:bg-white hover:shadow-sm opacity-70 hover:opacity-100'
                        }`}
                    >
                        <img src={img} alt="" className="w-full h-full object-contain p-2 drop-shadow-md" />
                    </button>
                ))}
            </div>
        </div>
    );
}