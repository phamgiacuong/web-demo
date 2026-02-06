// src/app/page.tsx
import FadeIn from '../components/FadeIn';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import FeaturedCategories from '../components/FeaturedCategories';
import SearchForm from '../components/SearchForm'; // <--- IMPORT MỚI
import { getProducts } from './actions';
// Bỏ import Search từ 'lucide-react' vì đã chuyển sang file kia

export default async function Home({
                                       searchParams
                                   }: {
    searchParams: Promise<{ q?: string; cat?: string }>
}) {
    const { q, cat } = await searchParams;
    const products = await getProducts(q || '', cat || '');

    return (
        <main className="pb-20 min-h-screen bg-gray-50/30">
            <Hero />
            <FeaturedCategories />

            <div className="container mx-auto px-6 py-16" id="products">

                {/* Header Section */}
                <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            {cat ? (
                                <>Đang xem: <span className="text-red-600 capitalize">{cat}</span></>
                            ) : (
                                'Sản phẩm mới về'
                            )}
                        </h2>
                        <div className="h-1 w-20 bg-red-600 rounded-full mt-3"></div>
                    </div>

                    {/* --- THAY THẾ FORM CŨ BẰNG COMPONENT MỚI Ở ĐÂY --- */}
                    <SearchForm />

                </FadeIn>

                {/* ... (Phần lưới sản phẩm bên dưới giữ nguyên) ... */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <FadeIn key={product.id} delay={index * 0.05}>
                                <ProductCard
                                    product={{ ...product, price: Number(product.price) }}
                                    index={index}
                                />
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    // ... (Phần hiển thị khi không tìm thấy giữ nguyên) ...
                    <FadeIn className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="text-6xl mb-4 grayscale opacity-50">📦</div>
                        <p className="text-gray-500 font-medium text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
                        <a href="/" className="text-red-600 font-bold hover:underline mt-2 inline-flex items-center gap-1">
                            <span className="text-xl">↺</span> Xóa bộ lọc
                        </a>
                    </FadeIn>
                )}
            </div>
        </main>
    );
}