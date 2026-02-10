// src/components/AddToCartSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Attribute = {
    name: string;
    value: string; // Chuỗi giá trị phân cách bằng dấu phẩy (VD: "Đỏ, Xanh")
};

export default function AddToCartSection({ product }: { product: any }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    
    // State lưu các lựa chọn của khách hàng: { "Màu sắc": "Đỏ", "Size": "M" }
    const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
    
    // Parse attributes từ product
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    useEffect(() => {
        if (product.attributes) {
            try {
                // Nếu attributes là string thì parse, nếu là object thì dùng luôn
                const parsed = typeof product.attributes === 'string' 
                    ? JSON.parse(product.attributes) 
                    : product.attributes;
                
                if (Array.isArray(parsed)) {
                    setAttributes(parsed);
                    // Tự động chọn giá trị đầu tiên cho mỗi thuộc tính
                    const initialSelection: Record<string, string> = {};
                    parsed.forEach((attr: Attribute) => {
                        const values = attr.value.split(',').map(v => v.trim());
                        if (values.length > 0) {
                            initialSelection[attr.name] = values[0];
                        }
                    });
                    setSelectedAttrs(initialSelection);
                }
            } catch (e) {
                console.error("Failed to parse attributes", e);
            }
        }
    }, [product.attributes]);

    const handleSelect = (name: string, value: string) => {
        setSelectedAttrs(prev => ({ ...prev, [name]: value }));
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            images: product.images,
            image: product.images[0],
            selectedAttributes: selectedAttrs // Gửi kèm thuộc tính đã chọn
        }, quantity);
    };

    return (
        <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">

            {/* --- PHẦN CHỌN THUỘC TÍNH --- */}
            {attributes.length > 0 && (
                <div className="space-y-4">
                    {attributes.map((attr, idx) => {
                        // Tách chuỗi giá trị thành mảng các lựa chọn
                        const options = attr.value.split(',').map(v => v.trim()).filter(v => v !== '');
                        
                        if (options.length === 0) return null;

                        return (
                            <div key={idx}>
                                <span className="text-sm font-bold text-gray-900 mb-2 block">{attr.name}:</span>
                                <div className="flex flex-wrap gap-2">
                                    {options.map((option) => {
                                        const isSelected = selectedAttrs[attr.name] === option;
                                        return (
                                            <button
                                                key={option}
                                                onClick={() => handleSelect(attr.name, option)}
                                                className={`
                                                    px-4 py-2 rounded-lg text-sm font-medium border transition-all relative
                                                    ${isSelected 
                                                        ? 'border-red-600 bg-red-50 text-red-700 shadow-sm' 
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                    }
                                                `}
                                            >
                                                {option}
                                                {isSelected && (
                                                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                                                        <Check className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bộ chọn số lượng */}
            <div className="flex items-center gap-4 mt-2">
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