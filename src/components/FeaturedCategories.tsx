// src/components/FeaturedCategories.tsx
'use client';

import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
    { id: 'tpcn', name: 'Thực phẩm CN', icon: '💊', color: 'bg-blue-100 text-blue-600' },
    { id: 'mypham', name: 'Mỹ phẩm', icon: '💄', color: 'bg-pink-100 text-pink-600' },
    { id: 'doan', name: 'Đồ ăn vặt', icon: '🍪', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'quanao', name: 'Thời trang', icon: '👕', color: 'bg-purple-100 text-purple-600' },
];

export default function FeaturedCategories() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Lấy category hiện tại từ URL để highlight (nếu cần)
    const currentCat = searchParams.get('cat');

    const handleCategoryClick = (catId: string) => {
        // Tạo URL mới: Giữ nguyên logic chỉ lọc theo category
        // scroll: false -> GIỮ NGUYÊN VỊ TRÍ MÀN HÌNH
        router.replace(`/?cat=${catId}`, { scroll: false });
    };

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <motion.div
                            key={cat.id}
                            whileHover={{ y: -5 }}
                            onClick={() => handleCategoryClick(cat.id)} // Dùng onClick thay vì Link
                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group select-none
                ${currentCat === cat.id
                                ? 'border-red-600 bg-red-50 shadow-md ring-1 ring-red-100' // Style khi đang chọn
                                : 'border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${cat.color} group-hover:scale-110 transition`}>
                                {cat.icon}
                            </div>
                            <div>
                                <h3 className={`font-bold transition ${currentCat === cat.id ? 'text-red-600' : 'text-gray-900'}`}>
                                    {cat.name}
                                </h3>
                                <p className="text-xs text-gray-400">Xem ngay</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}