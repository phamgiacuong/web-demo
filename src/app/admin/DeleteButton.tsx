// src/app/admin/DeleteButton.tsx
'use client';

import { deleteProduct } from '../actions';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTransition } from 'react';

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    // 1. Hỏi xác nhận
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.')) {

      // 2. Hiển thị thông báo đang xử lý
      const toastId = toast.loading('Đang xóa sản phẩm...');

      // 3. Gọi Server Action để xóa
      startTransition(async () => {
        try {
          await deleteProduct(id);
          toast.success('Đã xóa sản phẩm thành công!', { id: toastId });
        } catch (error) {
          toast.error('Có lỗi xảy ra khi xóa.', { id: toastId });
        }
      });
    }
  };

  return (
      <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
          title="Xóa sản phẩm"
      >
        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </button>
  );
}