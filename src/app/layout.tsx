// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar'; // Đảm bảo bạn đã tạo file này
import { Toaster } from 'react-hot-toast'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopify Clone Pro",
  description: "E-commerce MVP developed with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {/* Navbar luôn hiển thị trên mọi trang */}
        <Navbar />
        
        <div className="min-h-screen">
          {children}
        </div>

        {/* Thông báo Toast */}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}