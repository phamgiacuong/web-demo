// src/app/product/[id]/page.tsx
import { getProductById } from '../../actions';
import { notFound } from 'next/navigation';
import FadeIn from '../../../components/FadeIn';
import ProductGallery from '../../../components/ProductGallery'; // <--- IMPORT MỚI
import { ShoppingCart, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return notFound();

  return (
      <div className="min-h-screen bg-white pb-20 pt-10">
        <div className="container mx-auto px-6">

          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition font-medium">
            <ArrowLeft className="w-4 h-4" /> Quay lại cửa hàng
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* CỘT TRÁI: THAY THẾ BẰNG GALLERY MỚI */}
            <FadeIn>
              <ProductGallery images={product.images} />
            </FadeIn>

            {/* CỘT PHẢI: THÔNG TIN (GIỮ NGUYÊN) */}
            <FadeIn delay={0.2} className="space-y-8 sticky top-24">
              <div>
              <span className="text-red-600 font-bold tracking-widest uppercase text-sm">
                {product.category === 'tpcn' ? 'Thực phẩm chức năng' :
                    product.category === 'doan' ? 'Đồ ăn nội địa' : 'Sản phẩm Nhật Bản'}
              </span>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-6 border-b border-gray-100 pb-8">
              <span className="text-4xl font-black text-red-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
              </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                Còn hàng
              </span>
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>Freeship nội thành</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Chính hãng 100%</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-black text-white h-16 rounded-full font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform">
                  <ShoppingCart className="w-6 h-6" /> Thêm vào giỏ
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
  );
}