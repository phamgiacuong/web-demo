// src/components/ProductModal.tsx
'use client';

import { X, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';
import ProductImageGallery from './ProductImageGallery'; // Tận dụng lại gallery ảnh xịn xò
import { useEffect } from 'react';

// Định nghĩa kiểu dữ liệu cho sản phẩm
type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
};

export default function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  // Tắt popup khi bấm ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang chính
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
      {/* Nền đen mờ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Hộp nội dung Popup */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row">
        
        {/* Nút tắt */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Cột Trái: Ảnh */}
        <div className="w-full md:w-1/2 p-6 bg-gray-50">
           <ProductImageGallery images={product.images} />
        </div>

        {/* Cột Phải: Thông tin */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
          <span className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">{product.category}</span>
          <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h2>
          
          <div className="flex items-center gap-3 mb-6">
             <span className="text-3xl font-bold text-red-600">
               {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
             </span>
             <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">-15%</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-4 flex-grow">
            {product.description}
          </p>

          {/* Tiện ích */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Freeship</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Bảo hành 12T</div>
          </div>

          {/* Nút Mua */}
          <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg">
            <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}