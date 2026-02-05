// src/components/ProductGrid.tsx
'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
};

export default function ProductGrid({ products }: { products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          // Thay vì dùng Link, ta dùng div và sự kiện onClick
          <div 
            key={product.id} 
            className="cursor-pointer"
            onClick={() => setSelectedProduct({
                ...product,
                price: Number(product.price) // Ép kiểu để tránh lỗi Decimal
            })}
          >
            <ProductCard 
              product={{
                ...product, 
                price: Number(product.price) 
              }} 
              index={index} 
            />
          </div>
        ))}
      </div>

      {/* Nếu có sản phẩm được chọn thì hiện Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}