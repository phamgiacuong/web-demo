// src/components/ProductGallery.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ProductGallery({ images }: { images: string[] }) {
    // Đảm bảo luôn có ít nhất 1 ảnh để không lỗi
    const imageList = images && images.length > 0 ? images : ['https://via.placeholder.com/600'];

    // Dùng index để dễ tính toán Next/Prev
    const [currentIndex, setCurrentIndex] = useState(0);

    // Hàm chuyển ảnh tiếp theo
    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    }, [imageList.length]);

    // Hàm lùi ảnh
    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    }, [imageList.length]);

    // --- LẮNG NGHE BÀN PHÍM (Arrow Left/Right) ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    return (
        <div className="space-y-4 select-none">

            {/* 1. KHUNG ẢNH LỚN (MAIN IMAGE) */}
            <div className="relative aspect-[4/5] w-full bg-white rounded-3xl overflow-hidden border border-gray-100 group shadow-sm">

                {/* Ảnh chính với hiệu ứng chuyển đổi */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full flex items-center justify-center p-4" // Thêm padding để ảnh không dính sát mép
                    >
                        <img
                            src={imageList[currentIndex]}
                            alt="Product View"
                            // QUAN TRỌNG: object-contain giúp ảnh hiển thị ĐẦY ĐỦ, không bị cắt
                            className="w-full h-full object-contain drop-shadow-lg"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* --- NÚT ĐIỀU HƯỚNG TRÊN ẢNH (Chỉ hiện khi có > 1 ảnh) --- */}
                {imageList.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Badge phóng to */}
                <div className="absolute top-4 right-4 bg-gray-900/5 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <Maximize2 className="w-3 h-3" /> Zoom
                </div>
            </div>

            {/* 2. DANH SÁCH ẢNH NHỎ (THUMBNAILS) */}
            {imageList.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                    {imageList.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                currentIndex === index
                                    ? 'border-gray-900 ring-2 ring-gray-200 scale-95 opacity-100' // Active
                                    : 'border-transparent hover:border-gray-300 opacity-60 hover:opacity-100' // Inactive
                            }`}
                        >
                            <img
                                src={img}
                                alt={`Thumb ${index}`}
                                className="w-full h-full object-cover" // Thumb thì vẫn nên cover cho đẹp đội hình
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}