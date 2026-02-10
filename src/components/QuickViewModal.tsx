'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AddToCartSection from './AddToCartSection';
import { formatCurrency } from '../lib/utils';

export default function QuickViewModal() {
  const { viewedProduct, closeProductModal } = useCart();

  if (!viewedProduct) return null;

  return (
    <AnimatePresence>
      {viewedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProductModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Nút đóng */}
            <button 
              onClick={closeProductModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Cột Trái: Ảnh */}
            <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative">
               <img 
                 src={viewedProduct.images?.[0] || 'https://via.placeholder.com/500'} 
                 alt={viewedProduct.name}
                 className="w-full h-full object-contain max-h-[400px] drop-shadow-xl"
               />
            </div>

            {/* Cột Phải: Thông tin & Add to Cart */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 capitalize border border-blue-100 mb-3">
                  {viewedProduct.category}
                </span>
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                  {viewedProduct.name}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-red-600">
                    {formatCurrency(viewedProduct.price)}
                  </span>
                  {viewedProduct.originPrice && (
                    <span className="text-sm text-gray-400 line-through font-medium">
                      {formatCurrency(viewedProduct.originPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="prose prose-sm text-gray-500 mb-8 line-clamp-3">
                {viewedProduct.description}
              </div>

              {/* Tái sử dụng AddToCartSection để có logic chọn thuộc tính */}
              <AddToCartSection product={viewedProduct} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}