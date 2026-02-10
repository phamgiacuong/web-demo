import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import DeleteButton from '../DeleteButton';
import AdminSearch from '../../../components/AdminSearch';
import { Plus, Package } from 'lucide-react';

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams;
  const query = q || '';

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-32">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Quản lý sản phẩm</h1>
            <p className="text-gray-500 mt-1">Danh sách tất cả sản phẩm trong kho.</p>
          </div>
          <Link
            href="/admin/add"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-red-600 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" /> Thêm mới
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 whitespace-nowrap">
              <Package className="w-5 h-5 text-gray-400" /> Danh sách
            </h2>
            <AdminSearch />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold tracking-wider">
                <tr>
                  <th className="p-6">Sản phẩm</th>
                  <th className="p-6 text-right">Giá gốc</th>
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
                      <td className="p-6 text-right font-medium text-gray-500">
                        {product.originPrice 
                          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.originPrice))
                          : <span className="text-gray-300 italic">--</span>
                        }
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
                    <td colSpan={6} className="text-center py-12 text-gray-400">
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
  );
}