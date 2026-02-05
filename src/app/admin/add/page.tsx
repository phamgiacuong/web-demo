// src/app/admin/add/page.tsx
import { addProduct } from '../../actions'; // Đảm bảo import đúng đường dẫn actions

export default function AddProductPage() {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Page: Admin Add</h1>
      <p className="mb-4 text-green-600">Nếu bạn thấy dòng này nghĩa là trang đã hoạt động!</p>
      
      <form action={addProduct} className="space-y-4 border p-4 rounded">
        <input name="name" placeholder="Tên sản phẩm" required className="border p-2 w-full" />
        <input name="price" type="number" placeholder="Giá" required className="border p-2 w-full" />
        <input name="category" placeholder="Danh mục" required className="border p-2 w-full" />
        <textarea name="description" placeholder="Mô tả" required className="border p-2 w-full" />
        <input name="images" placeholder="Link ảnh" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Thêm</button>
      </form>
    </div>
  );
}