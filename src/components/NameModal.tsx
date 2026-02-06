// src/components/NameModal.tsx
'use client';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function NameModal() {
    const { isNameModalOpen, closeNameModal, setCustomerName } = useCart();
    const [name, setName] = useState('');

    if (!isNameModalOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            setCustomerName(name);
            closeNameModal();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Xin chào bạn mới! 👋</h2>
                <p className="text-gray-500 mb-6">Vui lòng nhập tên để chúng mình tiện xưng hô và ghi đơn hàng nhé.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Tên của bạn là..."
                        className="w-full border border-gray-300 rounded-xl p-4 text-lg font-medium focus:ring-2 focus:ring-red-600 outline-none mb-4"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition">
                        Xác nhận
                    </button>
                </form>
            </div>
        </div>
    );
}