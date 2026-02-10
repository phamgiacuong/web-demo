'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ProductService, CreateProductDTO, ProductAttribute } from '../../services/product.service';

// Helper để xử lý ảnh từ FormData
const parseImages = (formData: FormData): string[] => {
  const imagesString = formData.get('images') as string;
  let finalImages: string[] = [];

  if (imagesString && imagesString.trim() !== '') {
    finalImages = imagesString.split('|||').filter(img => img.trim() !== '');
  }

  if (finalImages.length === 0) {
    finalImages = ['https://placehold.co/600x400?text=No+Image'];
  }
  return finalImages;
};

// Helper để xử lý attributes từ FormData
const parseAttributes = (formData: FormData): ProductAttribute[] => {
  const attributesString = formData.get('attributes') as string;
  try {
    if (attributesString) {
      return JSON.parse(attributesString);
    }
  } catch (e) {
    console.error("Error parsing attributes:", e);
  }
  return [];
};

export async function getProducts(query: string, category: string) {
  return await ProductService.getAll(query, category);
}

export async function getProductById(id: string) {
  return await ProductService.getById(id);
}

export async function deleteProduct(id: string) {
  try {
    await ProductService.delete(id);
    revalidatePath('/admin');
    revalidatePath('/');
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Không thể xóa sản phẩm. Có thể sản phẩm đang nằm trong một đơn hàng.");
  }
}

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const originPrice = formData.get('originPrice') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  
  const images = parseImages(formData);
  const attributes = parseAttributes(formData);

  if (!name || !price) {
    throw new Error("Tên và giá sản phẩm là bắt buộc");
  }

  const productData: CreateProductDTO = {
    name,
    price: parseFloat(price),
    originPrice: originPrice ? parseFloat(originPrice) : null,
    description,
    category,
    images,
    attributes
  };

  await ProductService.create(productData);

  revalidatePath('/');
  revalidatePath('/admin');
  redirect('/admin');
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const originPrice = formData.get('originPrice') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;

  const imagesString = formData.get('images') as string;
  let finalImages: string[] = [];
  if (imagesString && imagesString.trim() !== '') {
    finalImages = imagesString.split('|||').filter(img => img.trim() !== '');
  }
  
  const attributes = parseAttributes(formData);

  const dataToUpdate: any = {
    name,
    price: parseFloat(price),
    originPrice: originPrice ? parseFloat(originPrice) : null,
    description,
    category,
    attributes // Cập nhật attributes
  };

  if (finalImages.length > 0) {
    dataToUpdate.images = finalImages;
  }

  await ProductService.update(id, dataToUpdate);

  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}