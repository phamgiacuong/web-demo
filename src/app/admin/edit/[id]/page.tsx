// src/app/admin/edit/[id]/page.tsx
import { getProductById } from '../../../actions';
import { notFound } from 'next/navigation';
import EditForm from './EditForm'; 

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPage(props: Props) {
  const params = await props.params;
  const product = await getProductById(params.id);

  if (!product) return notFound();

  // --- FIX LỖI Ở ĐÂY ---
  // Tạo một object mới, ép kiểu price từ Decimal -> Number
  const plainProduct = {
    ...product,
    price: Number(product.price)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Chỉnh sửa sản phẩm</h1>
        <div className="bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100">
           {/* Truyền object đã được làm sạch (plainProduct) vào form */}
           <EditForm product={plainProduct} />
        </div>
      </div>
    </div>
  );
}