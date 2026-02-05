// app/admin/add/page.tsx
import { addProduct } from '../../actions';

export default function AddProductPage() {
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h1>
      <form action={addProduct} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tên sản phẩm</label>
          <input name="name" required className="w-full border p-2 rounded" placeholder="Ví dụ: iPhone 15" />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Danh mục</label>
          <select name="category" className="w-full border p-2 rounded">
            <option value="fashion">Thời trang</option>
            <option value="tech">Công nghệ</option>
            <option value="home">Đời sống</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Giá ($)</label>
          <input name="price" type="number" step="0.01" required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Link Ảnh (Phân cách bằng dấu phẩy)</label>
          <textarea 
            name="images" 
            required 
            className="w-full border p-2 rounded h-24" 
            placeholder="https://anh1.jpg, https://anh2.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">*MVP: Hãy dùng link ảnh có sẵn trên mạng.</p>
        </div>

        <div>
          <label className="block text-sm font-medium">Mô tả chi tiết</label>
          <textarea name="description" required className="w-full border p-2 rounded h-32" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Lưu sản phẩm
        </button>
      </form>
    </div>
  );
}