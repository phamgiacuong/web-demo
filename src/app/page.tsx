// app/page.tsx
import Link from 'next/link';
import { getProducts } from './actions';

export default async function Home({ searchParams }: { searchParams: { q?: string; cat?: string } }) {
  const query = searchParams.q || '';
  const category = searchParams.cat || '';
  const products = await getProducts(query, category);

  return (
    <main className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">MyShopify Clone</h1>
        <Link href="/admin/add" className="bg-black text-white px-4 py-2 rounded">
          + Thêm sản phẩm
        </Link>
      </header>

      {/* Search & Filter UI */}
      <div className="flex gap-4 mb-6">
        <form className="flex-1 flex gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder="Tìm kiếm sản phẩm..."
            className="border p-2 rounded w-full"
          />
          <select name="cat" defaultValue={category} className="border p-2 rounded">
            <option value="">Tất cả danh mục</option>
            <option value="fashion">Thời trang</option>
            <option value="tech">Công nghệ</option>
            <option value="home">Đời sống</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Lọc</button>
        </form>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 relative">
              {/* Hiển thị ảnh đầu tiên */}
              <img src={product.images[0] || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-lg truncate">{product.name}</h2>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <p className="font-bold text-green-600 mt-2">${Number(product.price).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {products.length === 0 && <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>}
    </main>
  );
}