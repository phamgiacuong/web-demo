// src/components/ProductCard.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';

export default function ProductCard({ product, index }: { product: any; index: number }) {
  // Format tiền tệ
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price));

  return (
      <div
          className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] transition-all duration-500 ease-out transform hover:-translate-y-2"
          style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* --- PHẦN HÌNH ẢNH --- */}
        <Link href={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-white cursor-pointer">
          <img
              src={product.images[0] || 'https://via.placeholder.com/300'}
              alt={product.name}
              // --- SỬA Ở ĐÂY: object-contain + p-4 ---
              // object-contain: Hiển thị ĐỦ ảnh, không bị cắt
              // p-4: Tạo khoảng trắng xung quanh cho thoáng
              className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          />

          {/* Badge (Giữ nguyên) */}
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm z-10">
            Hot
          </div>
        </Link>

        {/* --- CÁC NÚT HÀNH ĐỘNG (Giữ nguyên) --- */}
        <div className="absolute inset-x-4 bottom-36 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20 pointer-events-none group-hover:pointer-events-auto">
          <button
              className="flex-1 bg-white/90 backdrop-blur-md text-gray-900 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-black hover:text-white transition flex items-center justify-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                alert('Đã thêm vào giỏ hàng (Demo)');
              }}
          >
            <ShoppingCart className="w-4 h-4" /> Thêm
          </button>
          <button className="p-3 bg-white/90 backdrop-blur-md text-gray-900 rounded-xl shadow-lg hover:text-red-500 transition hover:bg-red-50">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* --- PHẦN THÔNG TIN (Giữ nguyên) --- */}
        <div className="p-5">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
            {product.category === 'tpcn' ? 'Thực phẩm chức năng' : 'Sản phẩm Nhật'}
          </div>

          <Link href={`/product/${product.id}`}>
            <h3 className="font-bold text-gray-800 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-red-600 transition-colors cursor-pointer min-h-[3.5rem]">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-end gap-2 mt-auto">
            <span className="text-xl font-black text-gray-900">{formattedPrice}</span>
          </div>
        </div>
      </div>
  );
}