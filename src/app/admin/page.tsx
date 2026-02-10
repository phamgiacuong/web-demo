import { prisma } from '../../lib/prisma';
import { Package, DollarSign, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count();
  
  // Tối ưu: Dùng aggregate để tính tổng giá trị kho trực tiếp từ DB
  const aggregations = await prisma.product.aggregate({
    _sum: { price: true },
  });
  const totalValue = Number(aggregations._sum.price) || 0;

  const totalOrders = await prisma.order.count();
  const totalUsers = await prisma.user.count();

  return (
    <div className="p-8 pt-10">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tổng quan</h1>
            <p className="text-gray-500 mt-1">Chào mừng trở lại, Admin!</p>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Sản phẩm</p>
              <p className="text-2xl font-black text-gray-900">{totalProducts}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Giá trị kho</p>
              <p className="text-2xl font-black text-gray-900">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Đơn hàng</p>
              <p className="text-2xl font-black text-gray-900">{totalOrders}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Người dùng</p>
              <p className="text-2xl font-black text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Có thể thêm biểu đồ hoặc danh sách đơn hàng mới nhất ở đây */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center py-20">
          <TrendingUp className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">Biểu đồ doanh thu</h3>
          <p className="text-gray-500">Tính năng đang được phát triển...</p>
        </div>

      </div>
    </div>
  );
}