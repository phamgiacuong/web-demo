// src/app/admin/DeleteButton.tsx
'use client';

import { deleteProduct } from '../actions/product';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTransition, useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    // Đóng modal trước khi bắt đầu xóa để tránh UI bị kẹt nếu xóa lâu
    // Hoặc giữ modal và hiện loading (tùy chọn). Ở đây tôi chọn giữ modal và hiện loading.
    
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success('Đã xóa sản phẩm thành công!');
        setIsModalOpen(false);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa.');
        setIsModalOpen(false);
      }
    });
  };

  return (
      <>
        <button
            onClick={() => setIsModalOpen(true)}
            disabled={isPending}
            className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
            title="Xóa sản phẩm"
        >
          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          title="Xóa sản phẩm?"
          description="Sản phẩm này sẽ bị xóa vĩnh viễn khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?"
          confirmText="Xóa ngay"
          isLoading={isPending}
        />
      </>
  );
}