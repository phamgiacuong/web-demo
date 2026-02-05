// src/app/admin/page.tsx
import Link from 'next/link';
import { getProducts } from '../actions';
import { Pencil, Plus, Package, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import DeleteButton from './DeleteButton';

export default async function AdminDashboard() {
  const products = await getProducts('', '');

  // Tính toán số liệu giả lập cho đẹp
  const totalValue = products.reduce((acc, p) => acc + Number(p.price), 0);
  const totalProducts = products.length;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500">Xin chào, chào mừng trở lại hệ thống quản trị JapanStore.</p>
          </div>
          <Link 
            href="/admin/add" 
            className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-red-600 transition shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" /> Thêm sản phẩm
          </Link>
        </div>

        {/* --- Stats Cards (Thống kê) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition hover:shadow-md">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Tổng sản phẩm</p>
              <p className="text-2xl font-black text-gray-900">{totalProducts}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition hover:shadow-md">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Giá trị kho hàng</p>
              <p className="text-2xl font-black text-gray-900">
                {new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(totalValue)} ₫
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition hover:shadow-md">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Đang kinh doanh</p>
              <p className="text-2xl font-black text-gray-900">Hoạt động</p>
            </div>
          </div>
        </div>

        {/* --- Bảng Danh sách --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-400" /> Danh sách sản phẩm
            </h2>
            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-500">
              {products.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Sản phẩm</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Giá bán</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Danh mục</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm flex-shrink-0">
                           <img 
                             src={product.images[0] || 'https://via.placeholder.com/150'} 
                             alt="" 
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                           />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{product.name}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">ID: {product.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize border border-blue-100">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-sm text-gray-600 font-medium">Sẵn hàng</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/admin/edit/${product.id}`} 
                          className="p-2 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 rounded-lg transition shadow-sm"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteButton id={product.id} /> 
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {products.length === 0 && (
             <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-white">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                   <Package className="w-12 h-12 text-gray-300" />
                </div>
                <p className="text-lg font-medium text-gray-600">Kho hàng đang trống</p>
                <p className="text-sm mb-6">Hãy thêm sản phẩm đầu tiên của bạn</p>
                <Link href="/admin/add" className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition">
                  Thêm ngay
                </Link>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}