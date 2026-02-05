// src/app/product/[id]/page.tsx
import { getProductById } from '../../actions';
import { notFound } from 'next/navigation';
import ProductImageGallery from '../../../components/ProductImageGallery'; // Import component ảnh vừa tạo
import { Star, Truck, ShieldCheck, Heart, ShoppingCart } from 'lucide-react'; // Thêm icon cho sinh động

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetail(props: Props) {
  const params = await props.params;
  const product = await getProductById(params.id);

  if (!product) return notFound();

  const price = Number(product.price);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Card chứa nội dung chính */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* Cột Trái: Gallery Ảnh */}
            <div className="p-8 bg-gray-50/50">
              <ProductImageGallery images={product.images} />
            </div>

            {/* Cột Phải: Thông tin chi tiết */}
            <div className="p-8 md:p-12 flex flex-col">
              
              {/* Breadcrumb & Rating */}
              <div className="flex justify-between items-center mb-4">
                <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>4.9</span>
                  <span className="text-gray-400 font-normal ml-1">(128 đánh giá)</span>
                </div>
              </div>
              
              {/* Tên sản phẩm */}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                {product.name}
              </h1>
              
              {/* Giá tiền (Màu đỏ theo yêu cầu) */}
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-8 w-fit">
                <p className="text-4xl font-extrabold text-red-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                </p>
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm font-medium">
                  <span className="bg-red-100 px-2 py-0.5 rounded text-xs">-15%</span>
                  <span className="line-through text-gray-400">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 1.15)}
                  </span>
                </div>
              </div>

              {/* Mô tả & Chính sách */}
              <div className="prose prose-gray text-gray-600 mb-8 flex-grow">
                <p className="line-clamp-4">{product.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Freeship toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span>Bảo hành 12 tháng</span>
                  </div>
                </div>
              </div>
              
              {/* Nút bấm hành động */}
              <div className="flex gap-4 mt-auto pt-6 border-t border-gray-100">
                <button className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition shadow-lg hover:shadow-red-200 flex items-center justify-center gap-2 transform active:scale-95">
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <button className="px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-500 hover:border-red-500 hover:text-red-500 transition bg-white">
                  <Heart className="w-6 h-6" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}