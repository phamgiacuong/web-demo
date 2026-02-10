// src/app/page.tsx
import { getProducts } from './actions/product'; // Đã sửa import từ actions cũ sang actions/product
import Hero from '../components/Hero';
import ScrollToTop from '../components/ScrollToTop';
import ProductShowcase from '../components/ProductShowcase';

// Next.js 15+: searchParams là Promise
export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string, cat?: string }> }) {
    const { q } = await searchParams;

    // 1. Lấy dữ liệu thô từ Server (chứa Decimal)
    const rawProducts = await getProducts(q || '', '');

    // 2. 👇 QUAN TRỌNG: Ép kiểu Decimal sang Number để Client Component dùng được
    const products = rawProducts.map((product) => ({
        ...product,
        price: Number(product.price),
        originPrice: product.originPrice ? Number(product.originPrice) : null // Ép kiểu originPrice
    }));

    return (
        <main className="min-h-screen bg-[#fdfdfd]">

            {/* 1. HERO SECTION */}
            <Hero />

            {/* 2. PRODUCT SHOWCASE (Đã tích hợp bộ lọc) */}
            <ProductShowcase products={products} />

            {/* 3. NÚT CUỘN THÔNG MINH */}
            <ScrollToTop />

        </main>
    );
}