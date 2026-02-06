// src/components/ProductCard.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, index }: { product: any; index: number }) {
  const { openProductModal } = useCart();

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Number(product.price));

  return (
      <div
          className="group relative rounded-[2rem] transition-all duration-500 ease-out transform hover:-translate-y-3 z-0"
          style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* --- 1. LỚP HÀO QUANG (Glow Effect) --- */}
        {/* Lớp này nằm ẩn phía sau, khi hover sẽ hiện lên tạo hiệu ứng phát sáng màu đỏ */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-red-200 via-red-100 to-red-200 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>

        {/* Card chính */}
        <div className="bg-white rounded-[2rem] border border-gray-100/80 overflow-hidden shadow-sm group-hover:shadow-[0_20px_40px_rgba(220,38,38,0.1)] transition-all relative z-10 backdrop-blur-sm">

          {/* 2. ẢNH SẢN PHẨM VỚI NỀN STUDIO */}
          <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden cursor-pointer">
            {/* Nền gradient tỏa tròn tạo chiều sâu */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-100 opacity-50"></div>

            <img
                src={product.images?.[0] || 'https://via.placeholder.com/300'}
                alt={product.name}
                // Thêm drop-shadow cho chính bức ảnh để tách nền
                className="w-full h-full object-contain p-6 transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110 relative z-10 drop-shadow-xl"
            />

            {/* Badge HOT */}
            <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm z-20">
              Hot
            </div>
          </Link>

          {/* NÚT TÁC VỤ (Giữ nguyên, chỉ tinh chỉnh shadow) */}
          <div className="absolute inset-x-4 bottom-40 flex gap-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-30">
            <button
                className="flex-1 bg-white/90 backdrop-blur-md text-gray-900 py-3.5 rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-black hover:text-white transition flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                onClick={(e) => {
                  e.preventDefault();
                  openProductModal({
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    images: product.images,
                    image: product.images?.[0]
                  });
                }}
            >
              <ShoppingCart className="w-5 h-5" /> Thêm nhanh
            </button>
            <button className="p-3.5 bg-white/90 backdrop-blur-md text-gray-900 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:text-red-500 transition hover:scale-105 active:scale-95">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* THÔNG TIN SẢN PHẨM */}
          <div className="p-6 pt-4 relative bg-white/80 backdrop-blur-lg">
            <div className="text-[10px] text-red-600 font-black uppercase tracking-widest mb-2 opacity-80">
              {product.category === 'tpcn' ? 'Thực phẩm chức năng' : 'Sản phẩm Nhật Premium'}
            </div>

            <Link href={`/product/${product.id}`}>
              <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-red-600 transition-colors cursor-pointer min-h-[3.5rem]">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-dashed border-gray-100">
              <span className="text-2xl font-black text-gray-900 tracking-tight">{formattedPrice}</span>
              <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Sẵn hàng
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}