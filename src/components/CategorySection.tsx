// src/components/CategorySection.tsx
'use client';

import Link from 'next/link';
import { Sparkles, Shirt, Pill, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
    {
        id: 'tpcn',
        name: 'Thực phẩm CN',
        desc: 'Bổ trợ sức khỏe',
        icon: Pill,
        color: 'bg-blue-100 text-blue-600',
        hoverColor: 'group-hover:bg-blue-600 group-hover:text-white'
    },
    {
        id: 'mypham',
        name: 'Mỹ phẩm Nhật',
        desc: 'Chăm sóc sắc đẹp',
        icon: Sparkles,
        color: 'bg-pink-100 text-pink-600',
        hoverColor: 'group-hover:bg-pink-600 group-hover:text-white'
    },
    {
        id: 'doan',
        name: 'Bánh kẹo & Đồ ăn',
        desc: 'Hương vị nội địa',
        icon: UtensilsCrossed,
        color: 'bg-orange-100 text-orange-600',
        hoverColor: 'group-hover:bg-orange-600 group-hover:text-white'
    },
    {
        id: 'quanao',
        name: 'Thời trang',
        desc: 'Phong cách tối giản',
        icon: Shirt,
        color: 'bg-purple-100 text-purple-600',
        hoverColor: 'group-hover:bg-purple-600 group-hover:text-white'
    },
];

export default function CategorySection() {

    // Hàm xử lý khi click vào danh mục:
    // Thay vì nhảy lên đầu trang, nó sẽ lướt êm xuống phần danh sách sản phẩm
    const handleCategoryClick = () => {
        const productSection = document.getElementById('products');
        if (productSection) {
            // Trừ đi một chút padding (100px) để không bị che mất tiêu đề
            const yOffset = -100;
            const y = productSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-10 -mt-10 relative z-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                href={`/?cat=${cat.id}`}
                                scroll={false} // 👈 QUAN TRỌNG: Ngăn chặn nhảy lên đầu trang
                                onClick={handleCategoryClick} // 👈 QUAN TRỌNG: Tự động lướt xuống sản phẩm
                                className="group block bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Background Decor khi hover */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 group-hover:bg-gray-100"></div>

                                <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${cat.hoverColor} shadow-inner`}>
                                    <cat.icon className="w-7 h-7" strokeWidth={1.5} />
                                </div>

                                <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-red-600 transition-colors">
                                    {cat.name}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1 font-medium">{cat.desc}</p>

                                {/* Arrow icon ẩn, hiện khi hover */}
                                <div className="absolute bottom-6 right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}