// src/app/admin/orders/page.tsx
import { getOrders, toggleOrderStatus } from '../../actions';
import { Package, CheckCircle, Clock } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function AdminOrders() {
  const orders = await getOrders();

  return (
      <div className="min-h-screen bg-gray-50 p-8 pt-32">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <Package className="w-8 h-8" /> Quản lý đơn hàng
          </h1>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                <tr>
                  <th className="p-6">Mã đơn / Khách hàng</th>
                  <th className="p-6">Sản phẩm</th>
                  <th className="p-6 text-right">Tổng tiền</th>
                  <th className="p-6 text-center">Trạng thái</th>
                  <th className="p-6 text-right">Xử lý</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="p-6">
                        <div className="font-bold text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-400 mt-1">#{order.id.slice(-6)}</div>
                        <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          {order.items.map((item) => (
                              <div key={item.id} className="text-sm">
                                <span className="font-bold">{item.quantity}x</span> {item.product.name}
                              </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-6 text-right font-black text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.total))}
                      </td>
                      <td className="p-6 text-center">
                        {order.status === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          <CheckCircle className="w-3 h-3" /> Đã xong
                        </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                          <Clock className="w-3 h-3" /> Chờ xử lý
                        </span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <form action={async () => {
                          'use server';
                          await toggleOrderStatus(order.id, order.status);
                        }}>
                          <button className={`p-2 rounded-lg font-bold text-sm transition ${
                              order.status === 'confirmed'
                                  ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                          }`}>
                            {order.status === 'confirmed' ? 'Mở lại' : '✓ Xác nhận'}
                          </button>
                        </form>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
              {orders.length === 0 && <div className="p-12 text-center text-gray-400">Chưa có đơn hàng nào</div>}
            </div>
          </div>
        </div>
      </div>
  );
}