// src/components/ProductModal.tsx
'use client';

import { X, ShoppingCart, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// 👇 QUAN TRỌNG: Định nghĩa kiểu dữ liệu (Interface) để fix lỗi build
interface ProductModalProps {
  product: any;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`Đã thêm ${product.name} vào giỏ!`);
    onClose();
  };

  return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl relative animate-in fade-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition z-10">
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Cột ảnh */}
          <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
            <img
                src={product.images ? JSON.parse(product.images)[0] : 'https://via.placeholder.com/300'}
                alt={product.name}
                className="max-h-[300px] object-contain drop-shadow-xl"
            />
          </div>

          {/* Cột thông tin */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <div className="mb-4">
             <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
               {product.category || 'Sản phẩm mới'}
             </span>
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h2>

            <div className="flex items-center gap-1 text-yellow-500 mb-4">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-gray-400 text-sm ml-2">(50+ đánh giá)</span>
            </div>

            <p className="text-3xl font-bold text-red-600 mb-6">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>

            <p className="text-gray-500 mb-8 leading-relaxed line-clamp-3">
              {product.description || 'Sản phẩm chính hãng chất lượng cao từ Nhật Bản.'}
            </p>

            <div className="flex gap-3">
              <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ
              </button>
              <button className="px-4 py-3 border-2 border-gray-100 rounded-xl hover:border-gray-300 transition">
                <Check className="w-5 h-5 text-green-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}