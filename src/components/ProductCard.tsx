// src/components/ProductCard.tsx
import { ShoppingCart, Heart } from 'lucide-react';

export default function ProductCard({ product, index }: { product: any; index: number }) {
  // Format tiền tệ
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price));

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 ease-out transform hover:-translate-y-2"
      // Hiệu ứng xuất hiện lần lượt (Stagger Animation)
      style={{ animationDelay: `${index * 50}ms` }} 
    >
      {/* 1. Hình ảnh */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badge Giảm giá (Giả lập) */}
        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
          -15%
        </div>

        {/* Nút hành động nhanh (Chỉ hiện khi hover) */}
        <div className="absolute inset-x-4 bottom-4 flex gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <button className="flex-1 bg-white/90 backdrop-blur-sm text-gray-900 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-black hover:text-white transition flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Thêm nhanh
          </button>
          <button className="p-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl shadow-lg hover:text-red-500 transition">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Thông tin */}
      <div className="p-5">
        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
          {product.category === 'tpcn' ? 'Thực phẩm chức năng' : 
           product.category === 'doan' ? 'Đồ ăn Nhật' : 
           product.category === 'douong' ? 'Đồ uống' : 'Thời trang'}
        </div>
        
        <h3 className="font-bold text-gray-800 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-end gap-2">
          <span className="text-xl font-black text-gray-900">{formattedPrice}</span>
          <span className="text-sm text-gray-400 line-through mb-1 opacity-60">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price) * 1.15)}
          </span>
        </div>
      </div>
    </div>
  );
}