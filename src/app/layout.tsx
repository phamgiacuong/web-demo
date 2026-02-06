// src/app/layout.tsx
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google"; // Font chữ hiện đại
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from 'react-hot-toast'; // Thông báo đẹp
import NextTopLoader from 'nextjs-toploader'; // Thanh loading trên đầu

// Cấu hình Font chữ (Hỗ trợ tiếng Việt đầy đủ)
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

        {/* 1. THANH TIẾN TRÌNH LOADING (MÀU ĐỎ) */}
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

        {/* 2. NAVBAR (MENU TRÊN) */}
        <Navbar />

        {/* 3. NỘI DUNG CHÍNH CỦA TRANG */}
        {children}

        {/* 4. FOOTER (CHÂN TRANG) */}
        <Footer />

        {/* 5. KHU VỰC HIỂN THỊ THÔNG BÁO (Góc dưới phải) */}
        <Toaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: '#333',
                    color: '#fff',
                    borderRadius: '10px',
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

        </body>
        </html>
    );
}