// src/app/cart/page.tsx
'use client';

import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'; // Thêm icon ShoppingBag
import Link from 'next/link';
import { createOrder } from '../actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti'; // <--- IMPORT MỚI

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalAmount, customerName, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // 1. HIỆU ỨNG PHÁO HOA
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    const toastId = toast.loading('Đang gửi đơn hàng...');
    try {
      await createOrder(customerName, cart, totalAmount);
      clearCart();
      toast.success('Đặt hàng thành công! Cảm ơn bạn.', { id: toastId });
      router.push('/');
    } catch (error) {
      toast.error('Có lỗi xảy ra.', { id: toastId });
    }
  };

  // ... (Phần render bên dưới giữ nguyên, hoặc bạn có thể copy lại nếu cần update giao diện)
  if (cart.length === 0) {
    return (
        <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Giỏ hàng đang buồn thiu</h2>
          <p className="text-gray-500 mb-8">Chưa có gì ở đây cả, hãy lấp đầy nó nhé!</p>
          <Link href="/" className="px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-red-600 hover:shadow-lg hover:-translate-y-1 transition transform">
            Quay lại mua sắm
          </Link>
        </div>
    );
  }

  // ... (Return chính giữ nguyên logic cũ)
  return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Giỏ hàng của {customerName}</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* DANH SÁCH SẢN PHẨM */}
            <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-6 border-b border-gray-100 last:border-0 group">
                    {/* Container ảnh với hiệu ứng nổi nhẹ */}
                    <div className="relative overflow-hidden rounded-2xl border-2 border-white bg-gray-50 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] group-hover:shadow-[0_12px_24px_-6px_rgba(220,38,38,0.15)] transition-all duration-300">
                      {/* Nền gradient nhẹ bên trong */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 opacity-50"></div>
                      <img
                          src={item.image}
                          alt={item.name}
                          // Thêm drop-shadow cho ảnh nhỏ
                          className="w-28 h-28 object-contain p-3 relative z-10 drop-shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                      <p className="text-red-600 font-bold mt-1">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white rounded-lg transition shadow-sm"><Minus className="w-4 h-4" /></button>
                      <span className="font-bold w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white rounded-lg transition shadow-sm"><Plus className="w-4 h-4" /></button>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
              ))}
            </div>

            {/* THANH TOÁN */}
            <div className="lg:w-96">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-32">
                <h3 className="font-black text-xl mb-6">Tổng quan</h3>
                <div className="flex justify-between mb-4 text-gray-500">
                  <span>Tạm tính</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-4"></div>
                <div className="flex justify-between mb-8 text-2xl font-black text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                </div>

                <button
                    onClick={handleCheckout}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold hover:bg-red-600 transition flex items-center justify-center gap-2 shadow-xl hover:shadow-red-500/30 hover:-translate-y-1 transform duration-300"
                >
                  Thanh toán ngay <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}