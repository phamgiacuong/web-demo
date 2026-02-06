// src/app/admin/page.tsx
import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import DeleteButton from './DeleteButton';
import AdminSearch from '../../components/AdminSearch'; // <--- Import component mới
import { Plus, Package, DollarSign, TrendingUp, LogOut } from 'lucide-react';
import { logout } from '../actions';

// Next.js 15+: searchParams là Promise
export default async function AdminDashboard({
                                               searchParams
                                             }: {
  searchParams: Promise<{ q?: string }>
}) {

  // 1. Lấy từ khóa tìm kiếm từ URL
  const { q } = await searchParams;
  const query = q || '';

  // 2. Lọc dữ liệu trong Database
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive', // Tìm kiếm không phân biệt hoa thường
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalProducts = products.length;
  // Tính tổng giá trị (Fix lỗi Decimal nếu có)
  const totalValue = products.reduce((acc, p) => acc + Number(p.price), 0);

  return (
      <div className="min-h-screen bg-gray-50 p-8 pt-32">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Dashboard */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-gray-500 mt-1">Hệ thống quản trị sản phẩm.</p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <form action={logout}>
                <button className="bg-white border border-gray-200 text-gray-600 px-5 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-gray-50 hover:text-red-600 transition shadow-sm h-full">
                  <LogOut className="w-5 h-5" /> <span className="hidden md:inline">Thoát</span>
                </button>
              </form>

              <Link
                  href="/admin/add"
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-red-600 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Plus className="w-5 h-5" /> Thêm mới
              </Link>
            </div>
          </div>

          {/* Thống kê nhanh */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Kết quả tìm thấy</p>
                <p className="text-2xl font-black text-gray-900">{totalProducts}</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Tổng giá trị</p>
                <p className="text-2xl font-black text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalValue)}
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Trạng thái</p>
                <p className="text-2xl font-black text-gray-900">Hoạt động</p>
              </div>
            </div>
          </div>

          {/* Bảng danh sách sản phẩm */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 whitespace-nowrap">
                <Package className="w-5 h-5 text-gray-400" /> Danh sách
              </h2>

              {/* --- NHÚNG THANH TÌM KIẾM Ở ĐÂY --- */}
              <AdminSearch />

            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold tracking-wider">
                <tr>
                  <th className="p-6">Sản phẩm</th>
                  <th className="p-6 text-right">Giá bán</th>
                  <th className="p-6 text-center">Danh mục</th>
                  <th className="p-6">Trạng thái</th>
                  <th className="p-6 text-right">Tác vụ</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {products.length > 0 ? (
                    products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/50 transition group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <img
                                  src={product.images[0] || 'https://via.placeholder.com/100'}
                                  alt=""
                                  className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm group-hover:scale-105 transition"
                              />
                              <div>
                                <p className="font-bold text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">ID: {product.id.substring(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 text-right font-bold text-gray-900">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
                          </td>
                          <td className="p-6 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 capitalize border border-blue-100">
                          {product.category}
                        </span>
                          </td>
                          <td className="p-6">
                        <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Sẵn hàng
                        </span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/admin/edit/${product.id}`} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-900 hover:text-white transition" title="Sửa">
                                ✏️
                              </Link>
                              <DeleteButton id={product.id} />
                            </div>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400">
                        {query ? `Không tìm thấy sản phẩm nào tên "${query}"` : 'Kho hàng đang trống.'}
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  )
}