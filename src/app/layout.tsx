// src/app/layout.tsx
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import { CartProvider } from "../context/CartContext";
import NameModal from "../components/NameModal";
import ProductModal from "../components/ProductModal";

// Cấu hình Font chữ
const mainFont = Be_Vietnam_Pro({
    subsets: ["latin", "vietnamese"],
    weight: ["300", "400", "500", "600", "700", "900"],
    display: 'swap',
});

export const metadata: Metadata = {
    title: "JapanStore - Tinh hoa Nhật Bản",
    description: "Chuyên cung cấp thực phẩm chức năng, mỹ phẩm, đồ ăn Nhật Bản chính hãng.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" className="scroll-smooth">
        <body className={`${mainFont.className} antialiased bg-[#fdfdfd] text-slate-900 selection:bg-red-100 selection:text-red-900`}>

        {/* Bọc toàn bộ ứng dụng trong CartProvider để dùng tính năng giỏ hàng */}
        <CartProvider>

            {/* 1. Thanh Loading chạy trên cùng khi chuyển trang */}
            <NextTopLoader
                color="#DC2626"
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #DC2626,0 0 5px #DC2626"
            />

            {/* 2. Menu chính */}
            <Navbar />

            {/* 3. Nội dung trang web */}
            {children}

            {/* 4. Các Popup toàn cục */}
            <NameModal />    {/* Hỏi tên khách hàng */}
            <ProductModal /> {/* Xem nhanh & chọn số lượng */}

            {/* 5. Chân trang */}
            <Footer />

            {/* 6. Hệ thống thông báo (Style kính mờ Apple) */}
            <Toaster
                position="bottom-center"
                toastOptions={{
                    className: '',
                    style: {
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0, 0, 0, 0.8)', // Nền đen mờ
                        backdropFilter: 'blur(10px)',      // Hiệu ứng kính
                        color: '#fff',
                        padding: '16px 24px',
                        borderRadius: '50px',              // Bo tròn
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#22c55e',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

        </CartProvider>
        </body>
        </html>
    );
}