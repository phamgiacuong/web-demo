'use client';

import { useState } from 'react';
import { updateUserRole, deleteUser } from '../../actions/user';
import { Role } from '@prisma/client';
import { Trash2, Shield, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../components/ConfirmModal';

export function UserRoleSelect({ userId, currentRole }: { userId: string, currentRole: Role }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    if (newRole === currentRole) return;

    setIsUpdating(true);
    try {
      await updateUserRole(userId, newRole);
      toast.success(`Đã cập nhật quyền thành ${newRole}`);
    } catch (error) {
      toast.error('Lỗi khi cập nhật quyền');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentRole}
        onChange={handleChange}
        disabled={isUpdating}
        className={`appearance-none pl-8 pr-8 py-1.5 rounded-full text-xs font-bold border cursor-pointer outline-none transition disabled:opacity-50 ${
          currentRole === 'ADMIN'
            ? 'bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100'
            : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100'
        }`}
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        {isUpdating ? (
          <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
        ) : currentRole === 'ADMIN' ? (
          <Shield className="w-3 h-3" />
        ) : (
          <User className="w-3 h-3" />
        )}
      </div>
    </div>
  );
}

export function DeleteUserButton({ userId }: { userId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(userId);
      toast.success('Đã xóa người dùng');
    } catch (error) {
      toast.error('Lỗi khi xóa người dùng');
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
        title="Xóa"
      >
        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa người dùng?"
        description="Hành động này sẽ xóa vĩnh viễn tài khoản người dùng này khỏi hệ thống. Bạn không thể hoàn tác."
        confirmText="Xóa ngay"
        isLoading={isDeleting}
      />
    </>
  );
}