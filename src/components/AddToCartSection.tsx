// src/components/AddToCartSection.tsx
'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function AddToCartSection({ product }: { product: any }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            images: product.images,
            image: product.images[0]
        }, quantity);
    };

    return (
        <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">

            {/* Bộ chọn số lượng */}
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900 mr-2">Số lượng:</span>
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-full bg-white text-gray-900 shadow-sm flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
                        disabled={quantity <= 1}
                    >
                        <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-12 text-center font-black text-lg text-gray-900">{quantity}</span>

                    <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 rounded-full bg-white text-gray-900 shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Nút Mua Hàng */}
            <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white h-14 rounded-full font-bold text-lg hover:bg-red-600 transition flex items-center justify-center gap-3 shadow-xl hover:shadow-red-200 hover:-translate-y-1 transform"
            >
                <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price) * quantity)}
            </button>
        </div>
    );
}