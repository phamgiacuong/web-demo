// src/app/page.tsx
import { getProducts } from './actions';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';

type SearchParams = Promise<{ q?: string; cat?: string }>;

export default async function Home(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';
  const category = searchParams.cat || '';

  // 1. Lấy dữ liệu từ Database
  const rawProducts = await getProducts(query, category);

  // 2. Ép kiểu Decimal -> Number để tránh lỗi khi truyền xuống Client Component
  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <main className="pb-20 min-h-screen">
      {/* Banner đầu trang */}
      <Hero />

      <div className="container mx-auto px-6">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm nổi bật</h2>
            <p className="text-gray-500">Tuyển chọn những món đồ tốt nhất dành cho bạn</p>
          </div>
          
          <form className="flex gap-3 w-full md:w-auto bg-white p-2 rounded-full shadow-sm border border-gray-100">
            <input 
              name="q" 
              defaultValue={query} 
              placeholder="Tìm tên sản phẩm..." 
              className="pl-4 outline-none text-sm bg-transparent w-full md:w-48"
            />
            <select 
              name="cat" 
              defaultValue={category} 
              className="bg-gray-100 border-none py-2 px-4 rounded-full text-sm font-medium cursor-pointer hover:bg-gray-200 transition outline-none"
            >
              <option value="">Tất cả</option>
              <option value="tpcn">Thực phẩm chức năng</option>
              <option value="doan">Đồ ăn</option>
              <option value="douong">Đồ uống</option>
              <option value="quanao">Quần áo</option>
            </select>
            <button type="submit" className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-gray-800 transition">
              Lọc
            </button>
          </form>
        </div>

        {/* 3. Truyền danh sách vào ProductGrid */}
        <ProductGrid products={products} />
        
        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl mt-8 shadow-sm border border-dashed border-gray-300">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900">Không tìm thấy sản phẩm nào</h3>
            <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác.</p>
          </div>
        )}
      </div>
    </main>
  );
}