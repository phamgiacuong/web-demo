// src/app/admin/edit/[id]/EditForm.tsx
'use client';

import { updateProduct } from '../../../actions';
import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function EditForm({ product }: { product: any }) {
  const [images, setImages] = useState<string[]>(product.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setIsUploading(true);
      const newImages: string[] = [];
      const fileReaders: Promise<void>[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const promise = new Promise<void>((resolve) => {
          reader.onload = (event) => {
            if (event.target?.result) newImages.push(event.target.result as string);
            resolve();
          };
          reader.readAsDataURL(file);
        });
        fileReaders.push(promise);
      });
      Promise.all(fileReaders).then(() => {
        setImages((prev) => [...prev, ...newImages]);
        setIsUploading(false);
      });
    }
  };

  const updateWithId = updateProduct.bind(null, product.id);

  return (
    <form action={updateWithId} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Tên sản phẩm</label>
        <input name="name" defaultValue={product.name} className="w-full border p-3 rounded-lg" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-semibold mb-2">Danh mục</label>
           <select name="category" defaultValue={product.category} className="w-full border p-3 rounded-lg">
              <option value="tpcn">Thực phẩm chức năng</option>
              <option value="doan">Đồ ăn</option>
              <option value="douong">Đồ uống</option>
              <option value="quanao">Quần áo</option>
           </select>
        </div>
        <div>
           <label className="block text-sm font-semibold mb-2">Giá (VNĐ)</label>
           <input name="price" type="number" defaultValue={Number(product.price)} className="w-full border p-3 rounded-lg" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Hình ảnh</label>
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed p-4 text-center cursor-pointer hover:bg-gray-50 rounded-lg">
           <p className="text-blue-600 text-sm">+ Thêm ảnh mới</p>
           <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
        </div>
        <input type="hidden" name="images" value={images.join('|||')} />
        
        <div className="grid grid-cols-4 gap-2 mt-4">
          {images.map((img, idx) => (
             <div key={idx} className="relative aspect-square border rounded overflow-hidden group">
               <img src={img} className="w-full h-full object-cover" />
               {/* Đã sửa: Nút xóa luôn hiện để dễ bấm trên mobile */}
               <button 
                 type="button" 
                 onClick={(e) => {
                   e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền
                   e.preventDefault(); // Ngăn chặn hành vi mặc định
                   setImages(images.filter((_, i) => i !== idx));
                 }} 
                 className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-all z-20 cursor-pointer"
                 title="Xóa ảnh"
               >
                 <X className="w-3 h-3" />
               </button>
             </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Mô tả</label>
        <textarea name="description" defaultValue={product.description} rows={5} className="w-full border p-3 rounded-lg" />
      </div>

      {/* --- NÚT HỦY DÙNG LINK --- */}
      <div className="flex gap-4">
        <Link 
            href="/admin" 
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition text-center"
        >
            Hủy bỏ
        </Link>
        <button type="submit" disabled={isUploading} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
            {isUploading ? 'Đang xử lý ảnh...' : 'Lưu thay đổi'}
        </button>
      </div>

    </form>
  );
}