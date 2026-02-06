// src/app/actions.ts
'use server'

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// --- AUTH (Giữ nguyên) ---
export async function login(formData: FormData) {
  const password = formData.get('password') as string;
  if (password === 'admin123') {
    const cookieStore = await cookies();
    cookieStore.set('auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    redirect('/admin');
  } else {
    redirect('/login?error=true');
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth');
  redirect('/login');
}

// --- PRODUCTS ---
export async function getProducts(query: string, category: string) {
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
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({ where: { id } });
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath('/');
}

// 👇 HÀM ADD: SỬA ĐỂ NHẬN CHUỖI ẢNH TỪ FRONTEND
export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;

  // 1. Lấy chuỗi ảnh từ input hidden (name="images")
  const imagesString = formData.get('images') as string;

  // 2. Tách chuỗi thành mảng dựa trên ký tự phân cách '|||'
  // Logic này khớp với code frontend: value={images.join('|||')}
  let finalImages: string[] = [];

  if (imagesString && imagesString.trim() !== '') {
    finalImages = imagesString.split('|||').filter(img => img.trim() !== '');
  }

  // Nếu không có ảnh nào, dùng ảnh placeholder
  if (finalImages.length === 0) {
    finalImages = ['https://placehold.co/600x400?text=No+Image'];
  }

  if (!name || !price) {
    throw new Error("Tên và giá sản phẩm là bắt buộc");
  }

  await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      description: description || '',
      category: category || 'other',
      images: finalImages, // Lưu mảng ảnh trực tiếp
    },
  });

  revalidatePath('/');
  revalidatePath('/admin');
  redirect('/admin');
}

// 👇 HÀM UPDATE: SỬA ĐỂ ĐỒNG BỘ VỚI FRONTEND
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;

  // 1. Lấy chuỗi ảnh từ input hidden
  // Ở trang Edit, frontend đã tự xử lý việc gộp ảnh cũ + ảnh mới vào chuỗi này rồi
  const imagesString = formData.get('images') as string;

  let finalImages: string[] = [];

  if (imagesString && imagesString.trim() !== '') {
    finalImages = imagesString.split('|||').filter(img => img.trim() !== '');
  }

  // Tạo object dữ liệu update
  const dataToUpdate: any = {
    name,
    price: parseFloat(price),
    description,
    category,
  };

  // Chỉ cập nhật trường images nếu mảng không rỗng
  if (finalImages.length > 0) {
    dataToUpdate.images = finalImages;
  }

  await prisma.product.update({
    where: { id },
    data: dataToUpdate,
  });

  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}

// --- ORDER ACTIONS (Giữ nguyên) ---
export async function createOrder(customerName: string, cartItems: any[], total: number) {
  await prisma.order.create({
    data: {
      customerName,
      total: total,
      items: {
        create: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  });
  revalidatePath('/admin/orders');
}

export async function getOrders() {
  return await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
}

export async function toggleOrderStatus(orderId: string, currentStatus: string) {
  const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending';
  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });
  revalidatePath('/admin/orders');
}