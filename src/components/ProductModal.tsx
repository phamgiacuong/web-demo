// src/components/ProductModal.tsx
'use client';

import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingCart, Star } from 'lucide-react'; // Thêm Star
import { useState, useEffect } from 'react';

export default function ProductModal() {
  const { viewedProduct, closeProductModal, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (viewedProduct) setQuantity(1);
  }, [viewedProduct]);

  if (!viewedProduct) return null;

  const handleAddToCart = () => {
    addToCart(viewedProduct, quantity);
  };

  const totalPrice = Number(viewedProduct.price) * quantity;

  return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* 1. BACKDROP MỜ ẢO (Blur Effect) */}
        <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
            onClick={closeProductModal}
        ></div>

        {/* 2. POPUP GLASSMORPHISM */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] w-full max-w-4xl shadow-2xl shadow-black/20 overflow-hidden relative animate-in zoom-in-95 fade-in duration-300 z-10 flex flex-col md:flex-row max-h-[90vh] ring-1 ring-white/50">

          <button
              onClick={closeProductModal}
              className="absolute top-5 right-5 p-2 bg-black/5 hover:bg-black/10 rounded-full transition z-20 backdrop-blur-sm"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          {/* Cột Trái: Ảnh với nền Gradient nhẹ */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100/50 p-10 flex items-center justify-center relative overflow-hidden">
            {/* Decor nền */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

            <img
                src={viewedProduct.images?.[0] || viewedProduct.image}
                alt={viewedProduct.name}
                className="w-full h-full object-contain mix-blend-multiply max-h-[350px] drop-shadow-xl transform transition-transform duration-700 hover:scale-110"
            />
          </div>

          {/* Cột Phải: Thông tin */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/60">
            <div className="flex items-center gap-1 text-yellow-500 mb-2">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-gray-400 text-xs font-bold ml-2">(120 đánh giá)</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">
              {viewedProduct.name}
            </h3>
            <p className="text-sm font-medium text-gray-400 mb-8 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Còn hàng sẵn kho
            </p>

            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Chọn số lượng</p>

              <div className="flex items-center gap-6 mb-8">
                <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition active:scale-95"
                >
                  <Minus className="w-5 h-5 text-gray-600" />
                </button>

                <span className="text-4xl font-black text-gray-900 w-16 text-center tabular-nums">{quantity}</span>

                <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Footer: Tổng tiền & Nút Mua */}
            <div className="border-t border-gray-100 pt-6 mt-auto">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-500 font-medium text-sm">Tổng thanh toán:</span>
                <span className="text-3xl font-black text-red-600 tracking-tight">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                 </span>
              </div>

              {/* Nút bấm có hiệu ứng Glow */}
              <button
                  onClick={handleAddToCart}
                  className="w-full bg-red-600 text-white h-16 rounded-2xl font-bold text-lg hover:bg-red-700 transition flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_35px_rgba(220,38,38,0.5)] hover:-translate-y-1 transform duration-300"
              >
                <ShoppingCart className="w-6 h-6" /> THÊM VÀO GIỎ
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}