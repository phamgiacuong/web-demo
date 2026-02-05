// src/components/ProductImageGallery.tsx
'use client'; 

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export default function ProductImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false); // Đổi tên để tránh nhầm lẫn

  // --- LOGIC CHUYỂN ẢNH ---
  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation(); 
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  // --- LẮNG NGHE BÀN PHÍM (SỬA ĐỔI QUAN TRỌNG) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Luôn cho phép chuyển ảnh bằng mũi tên (Bất kể đang zoom hay không)
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      
      // 2. Phím ESC chỉ dùng để tắt Zoom nội bộ (Nếu đang zoom)
      if (e.key === 'Escape' && isInternalModalOpen) {
        e.stopPropagation(); // Chặn không cho Popup cha (ProductModal) bị tắt theo
        setIsInternalModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, isInternalModalOpen]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* === 1. GIAO DIỆN CHÍNH (Trong ProductModal) === */}
      <div className="space-y-4 select-none">
        <div 
          className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 cursor-zoom-in group"
          onClick={() => setIsInternalModalOpen(true)}
        >
          <img
            src={images[currentIndex]}
            alt="Product Main"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Icon Zoom */}
          <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition z-10">
             <Maximize2 className="w-5 h-5 text-gray-600" />
          </div>

          {/* Nút điều hướng (Luôn hiện để dễ bấm) */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage} 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button 
                onClick={nextImage} 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            </>
          )}
        </div>

        {/* List ảnh nhỏ (Thumbnails) */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === idx 
                    ? 'border-red-500 opacity-100 ring-2 ring-red-100' 
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* === 2. CHẾ ĐỘ ZOOM TOÀN MÀN HÌNH (Internal Modal) === */}
      {isInternalModalOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200"
          onClick={() => setIsInternalModalOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>

          <div 
            className="relative w-full max-w-7xl h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} 
          >
            <img 
              src={images[currentIndex]} 
              className="max-h-[90vh] max-w-full object-contain rounded select-none"
            />
            
            {/* Nút Next/Prev LỚN trong màn hình Zoom */}
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition">
                  <ChevronLeft className="w-16 h-16" />
                </button>
                <button onClick={nextImage} className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition">
                  <ChevronRight className="w-16 h-16" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
               {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}