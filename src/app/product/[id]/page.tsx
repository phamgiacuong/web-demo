// src/app/product/[id]/page.tsx
import { getProductById } from '../../actions';
import { notFound } from 'next/navigation';
import FadeIn from '../../../components/FadeIn';
import ProductGallery from '../../../components/ProductGallery';
import { ShoppingCart, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return notFound();

  // Format giá tiền
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Number(product.price));

  return (
      // SỬA Ở ĐÂY: Đổi 'pt-10' thành 'pt-32' để tránh bị Navbar che mất
      <div className="min-h-screen bg-white pb-20 pt-32">
        <div className="container mx-auto px-6">

          {/* Nút quay lại */}
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition font-medium group">
            <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Quay lại cửa hàng
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* CỘT TRÁI: ẢNH SẢN PHẨM (GALLERY) */}
            <FadeIn>
              <ProductGallery images={product.images} />
            </FadeIn>

            {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
            <FadeIn delay={0.2} className="space-y-8 sticky top-32">
              <div>
              <span className="text-red-600 font-bold tracking-widest uppercase text-xs border border-red-200 bg-red-50 px-3 py-1 rounded-full">
                {product.category === 'tpcn' ? 'Thực phẩm chức năng' :
                    product.category === 'doan' ? 'Đồ ăn nội địa' :
                        product.category === 'quanao' ? 'Thời trang' : 'Sản phẩm Nhật Bản'}
              </span>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-6 leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-6 border-b border-gray-100 pb-8">
              <span className="text-4xl font-black text-red-600">
                {formattedPrice}
              </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Còn hàng
              </span>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Các cam kết (Trust Badges) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">Freeship nội thành Hà Nội</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">Cam kết chính hãng 100%</span>
                </div>
              </div>

              {/* Nút Mua Hàng */}
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button className="flex-1 bg-black text-white h-14 rounded-full font-bold text-lg hover:bg-red-600 transition flex items-center justify-center gap-3 shadow-xl hover:shadow-red-200 hover:-translate-y-1 transform">
                  <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
  );
}