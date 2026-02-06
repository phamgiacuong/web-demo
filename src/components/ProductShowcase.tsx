// src/components/ProductShowcase.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import ProductCard from './ProductCard';
import FadeIn from './FadeIn';
import { Sparkles, Shirt, Pill, UtensilsCrossed, LayoutGrid, PackageOpen } from 'lucide-react';

const tabs = [
    { id: 'all', label: 'Tất cả', icon: LayoutGrid },
    { id: 'tpcn', label: 'Thực phẩm CN', icon: Pill },
    { id: 'mypham', label: 'Mỹ phẩm', icon: Sparkles },
    { id: 'doan', label: 'Đồ ăn', icon: UtensilsCrossed },
    { id: 'quanao', label: 'Thời trang', icon: Shirt },
];

// Animation variants cho container
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1 // Hiệu ứng xuất hiện lần lượt
        }
    }
};

// Animation variants cho từng item
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 50
        }
    }
};

export default function ProductShowcase({ products }: { products: any[] }) {
    const [activeTab, setActiveTab] = useState('all');

    const filteredProducts = activeTab === 'all'
        ? products
        : products.filter(p => p.category === activeTab);

    return (
        <div className="container mx-auto px-6 py-16" id="products">
            <FadeIn>
                {/* Header Section */}
                <div className="text-center mb-12">
                    <span className="text-red-600 font-bold tracking-widest uppercase text-xs mb-3 block">Bộ sưu tập 2026</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-8">
                        Sản phẩm nổi bật
                    </h2>

                    {/* BỘ LỌC */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border-2
                    ${isActive
                                        ? 'bg-gray-900 text-white border-gray-900 shadow-xl scale-105'
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-red-100 hover:text-red-600 hover:shadow-md'
                                    }
                  `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </FadeIn>

            {/* GRID SẢN PHẨM */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={activeTab} // Re-trigger animation khi đổi tab
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <motion.div
                                variants={itemVariants}
                                layout
                                key={product.id}
                            >
                                <ProductCard
                                    product={{
                                        ...product,
                                        price: Number(product.price)
                                    }}
                                    index={index}
                                />
                            </motion.div>
                        ))
                    ) : (
                        // TRẠNG THÁI KHÔNG CÓ SẢN PHẨM
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-full text-center py-20"
                        >
                            <div className="inline-block p-6 rounded-full bg-gray-50 mb-4 animate-bounce">
                                <PackageOpen className="w-12 h-12 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có sản phẩm</h3>
                            <p className="text-gray-500 font-medium">Danh mục này hiện đang được cập nhật thêm.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}