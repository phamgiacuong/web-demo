import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

// Định nghĩa kiểu dữ liệu đầu vào (DTO)
export type ProductAttribute = {
  name: string;
  value: string; // Giá trị nhập vào (ví dụ: "Đỏ, Xanh" hoặc "S, M, L")
};

export type CreateProductDTO = {
  name: string;
  price: number;
  originPrice?: number | null;
  description?: string;
  category: string;
  images: string[];
  attributes?: ProductAttribute[]; // Thêm trường attributes
};

export type UpdateProductDTO = Partial<CreateProductDTO>;

export const ProductService = {
  async getAll(query: string, category: string) {
    return await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } }
            ]
          },
          category ? { category: category } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    return await prisma.product.findUnique({ where: { id } });
  },

  async create(data: CreateProductDTO) {
    return await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        originPrice: data.originPrice,
        description: data.description || '',
        category: data.category || 'other',
        images: data.images,
        attributes: data.attributes ? JSON.stringify(data.attributes) : undefined, // Lưu dưới dạng JSON string hoặc Json object tùy Prisma version, ở đây để an toàn ta để Prisma tự xử lý Json
      },
    });
  },

  async update(id: string, data: UpdateProductDTO) {
    // Xử lý attributes riêng nếu cần
    const updateData: any = { ...data };
    if (data.attributes) {
      updateData.attributes = JSON.stringify(data.attributes); // Hoặc để nguyên object nếu Prisma client hỗ trợ tốt
    }

    return await prisma.product.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: string) {
    return await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { productId: id }
      });
      return await tx.product.delete({ where: { id } });
    });
  }
};