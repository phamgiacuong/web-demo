// src/app/admin/add/page.tsx
'use client'; 

import { addProduct } from '../../actions'; 
import { useState, useRef } from 'react';
import { Upload, X, DollarSign, Tag, FileText, Package } from 'lucide-react'; 
import Link from 'next/link'; // <--- Quan trọng: Import Link để điều hướng

export default function AddProductPage() {
  const [images, setImages] = useState<string[]>([]);
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
            if (event.target?.result) {
              newImages.push(event.target.result as string);
            }
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

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Thêm sản phẩm mới</h1>
          <p className="mt-2 text-sm text-gray-600">Điền thông tin chi tiết sản phẩm để đăng bán</p>
        </div>

        <div className="bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100">
          <form action={addProduct} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Package className="w-4 h-4 mr-2" /> Tên sản phẩm
                </label>
                <input 
                  name="name" 
                  required 
                  placeholder="Ví dụ: Áo phông Basic" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4 mr-2" /> Danh mục
                </label>
                <select 
                  name="category" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                >
                  <option value="tpcn">Thực phẩm chức năng</option>
                  <option value="doan">Đồ ăn</option>
                  <option value="douong">Đồ uống</option>
                  <option value="quanao">Quần áo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 mr-2" /> Giá bán (VNĐ)
              </label>
              <div className="relative">
                <input 
                  name="price" 
                  type="number" 
                  required 
                  min="0"
                  step="1000"
                  placeholder="0" 
                  className="w-full border border-gray-300 rounded-lg pl-4 pr-12 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition font-mono font-medium"
                />
                <span className="absolute right-4 top-3 text-gray-500 font-bold">₫</span>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Upload className="w-4 h-4 mr-2" /> Hình ảnh sản phẩm
              </label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition group"
              >
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:scale-110 transition">
                     <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Click để tải ảnh lên</p>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>

              <input type="hidden" name="images" value={images.join('|||')} />

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2" /> Mô tả chi tiết
              </label>
              <textarea 
                name="description" 
                required 
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Mô tả đặc điểm, chất liệu, thông số kỹ thuật..."
              />
            </div>

            {/* --- NÚT HỦY DÙNG LINK ĐỂ VỀ ADMIN --- */}
            <div className="flex gap-4 pt-4">
                <Link 
                    href="/admin"
                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition text-center"
                >
                    Hủy bỏ
                </Link>
                <button 
                    type="submit" 
                    disabled={isUploading}
                    className="flex-1 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition transform hover:scale-[1.01] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? 'Đang xử lý ảnh...' : 'Lưu sản phẩm'}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}