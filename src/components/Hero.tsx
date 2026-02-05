// src/components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative h-[500px] w-full bg-gray-900 overflow-hidden mb-12 rounded-3xl mx-auto container mt-6">
      {/* Ảnh nền mới: Phong cách quán xá Nhật Bản (Đèn lồng đỏ)
         Link dự phòng nếu ảnh này lỗi: 
         1. https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070 
         2. https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2070
      */}
      <img 
        src="https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2036&auto=format&fit=crop" 
        alt="Japanese Store Banner" 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      
      <div className="relative z-10 h-full flex flex-col justify-center px-12 max-w-3xl text-white">
        <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-1 bg-red-600 rounded-full"></span>
            <span className="uppercase tracking-widest text-sm font-bold text-red-100">Japan Authentic</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 drop-shadow-lg">
          Tinh hoa Nhật Bản <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-white">
            Trong tầm tay bạn
          </span>
        </h1>
        
        <p className="text-lg text-gray-200 mb-8 max-w-lg shadow-black drop-shadow-md leading-relaxed">
          Thiên đường mua sắm hàng nội địa Nhật: Thực phẩm chức năng, bánh kẹo, mỹ phẩm và thời trang Tokyo mới nhất.
        </p>
        
        <div className="flex gap-4">
          <Link href="#products" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg hover:shadow-red-900/50 transform hover:-translate-y-1">
            Mua ngay
          </Link>
          <Link href="/about" className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-full font-bold hover:bg-white/20 transition">
            Về chúng tôi
          </Link>
        </div>
      </div>
    </div>
  );
}