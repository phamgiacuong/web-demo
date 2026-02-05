// app/product/[id]/page.tsx
import { getProductById } from '../../actions';
import { notFound } from 'next/navigation';

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) return notFound();

  return (
    <div className="container mx-auto p-4 pt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery ảnh */}
        <div className="grid gap-4">
          <img src={product.images[0]} alt={product.name} className="w-full rounded-lg bg-gray-100" />
          <div className="grid grid-cols-4 gap-2">
            {product.images.slice(1).map((img, idx) => (
              <img key={idx} src={img} className="rounded border hover:border-black cursor-pointer" />
            ))}
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div>
          <span className="bg-gray-200 px-2 py-1 rounded text-sm text-gray-700">{product.category}</span>
          <h1 className="text-4xl font-bold mt-2 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-green-600 mb-6">${Number(product.price).toFixed(2)}</p>
          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
          
          <button className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}