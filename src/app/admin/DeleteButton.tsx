// src/app/admin/DeleteButton.tsx
'use client'; // <--- Bắt buộc phải có dòng này để dùng được onClick và confirm

import { Trash2 } from 'lucide-react';
import { deleteProduct } from '../actions'; // Import hành động xóa từ server

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    // Hiện popup xác nhận của trình duyệt
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      await deleteProduct(id);
    }
  };

  return (
    <button 
      onClick={handleDelete} // Dùng onClick chuẩn của React
      className="p-2 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
      title="Xóa sản phẩm"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}