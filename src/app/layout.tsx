// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';
import { Toaster } from 'react-hot-toast';
import NameModal from '../components/NameModal';
// ❌ XÓA DÒNG NÀY: import ProductModal from '../components/ProductModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Japan Store - Hàng Nhật Nội Địa',
    description: 'Chuyên cung cấp thực phẩm chức năng, mỹ phẩm Nhật Bản chính hãng.',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
        <body className={inter.className}>
        <CartProvider>
            <Toaster position="top-center" />

            <Navbar />

            {children}

            {/* Các Popup toàn cục */}
            <NameModal /> {/* Popup hỏi tên thì giữ lại */}

            {/* 👇 XÓA DÒNG DƯỚI ĐÂY ĐI VÌ NÓ GÂY LỖI */}
            {/* <ProductModal /> */}

            <Footer />
        </CartProvider>
        </body>
        </html>
    );
}