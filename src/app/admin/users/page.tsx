import { UserService } from '../../../services/user.service';
import { User } from 'lucide-react';
import { UserRoleSelect, DeleteUserButton } from './UserActions';

export default async function UsersPage() {
  const users = await UserService.getAll();

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-32">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Quản lý người dùng</h1>
            <p className="text-gray-500 mt-1">Danh sách tài khoản và phân quyền hệ thống.</p>
          </div>
          {/* Nút thêm user có thể dẫn tới trang register hoặc modal, tạm thời ẩn hoặc để đó */}
          {/* <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg">
            + Thêm User
          </button> */}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <tr>
                <th className="p-6">Người dùng</th>
                <th className="p-6">Tên đăng nhập</th>
                <th className="p-6">Liên hệ</th>
                <th className="p-6">Vai trò</th>
                <th className="p-6">Ngày tạo</th>
                <th className="p-6 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-gray-900">{user.name || 'Chưa đặt tên'}</span>
                    </div>
                  </td>
                  <td className="p-6 text-gray-600 font-medium">{user.username}</td>
                  <td className="p-6 text-gray-500 text-sm">{user.contactInfo || user.email || '--'}</td>
                  <td className="p-6">
                    <UserRoleSelect userId={user.id} currentRole={user.role} />
                  </td>
                  <td className="p-6 text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-6 text-right">
                    <DeleteUserButton userId={user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}