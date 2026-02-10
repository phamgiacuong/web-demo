// src/app/product/[id]/page.tsx
import { getProductById } from '../../actions/product'; // Cập nhật import
import { notFound } from 'next/navigation';
import FadeIn from '../../../components/FadeIn';
import ProductGallery from '../../../components/ProductGallery';
import Breadcrumbs from '../../../components/Breadcrumbs';
import AddToCartSection from '../../../components/AddToCartSection';
import { Truck, ShieldCheck } from 'lucide-react';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return notFound();

  const categoryName = product.category === 'tpcn' ? 'Thực phẩm chức năng' :
      product.category === 'doan' ? 'Đồ ăn nội địa' :
          product.category === 'mypham' ? 'Mỹ phẩm' :
              product.category === 'quanao' ? 'Thời trang' : 'Sản phẩm khác';

  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price));

  return (
      <div className="min-h-screen bg-white pb-20 pt-32">
        <div className="container mx-auto px-6">

          <FadeIn>
            <Breadcrumbs items={[
              { label: categoryName, href: `/?cat=${product.category}` },
              { label: product.name }
            ]} />
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-8">

            <FadeIn>
              <ProductGallery images={product.images} />
            </FadeIn>

            <FadeIn delay={0.2} className="space-y-8 sticky top-32">
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-6 border-b border-gray-100 pb-8">
                  <span className="text-4xl font-black text-red-600">{formattedPrice}</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Còn hàng
                </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <Truck className="w-6 h-6 text-blue-600" /> <span className="font-medium">Freeship Hà Nội</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <ShieldCheck className="w-6 h-6 text-blue-600" /> <span className="font-medium">Chính hãng 100%</span>
                </div>
              </div>

              <AddToCartSection
                  product={{
                    ...product,
                    price: Number(product.price),
                    originPrice: product.originPrice ? Number(product.originPrice) : null
                  }}
              />

            </FadeIn>
          </div>
        </div>
      </div>
  );
}