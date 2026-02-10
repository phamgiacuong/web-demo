// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';
import { Toaster } from 'react-hot-toast';
import NameModal from '../components/NameModal';
import QuickViewModal from '../components/QuickViewModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Hàng Nhật Nội Địa',
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
            <NameModal />
            <QuickViewModal />

            <Footer />
        </CartProvider>
        </body>
        </html>
    );
}