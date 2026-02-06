// src/app/actions.ts
'use server'

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// --- 1. HÀM ĐĂNG NHẬP ---
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

// --- 2. HÀM ĐĂNG XUẤT ---
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth');
  redirect('/login');
}

// --- 3. LẤY DANH SÁCH SẢN PHẨM ---
export async function getProducts(query: string, category: string) {
  return await prisma.product.findMany({
    where: {
      AND: [
        { name: { contains: query, mode: 'insensitive' } },
        category ? { category: category } : {},
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

// --- 4. LẤY CHI TIẾT 1 SẢN PHẨM ---
export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

// --- 5. XÓA SẢN PHẨM ---
export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath('/');
}

// --- 6. THÊM SẢN PHẨM MỚI ---
export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const image = formData.get('image') as string;

  await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      description,
      category,
      images: [image],
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}

// --- 7. CẬP NHẬT SẢN PHẨM (MỚI THÊM) ---
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const image = formData.get('image') as string;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      price: parseFloat(price),
      description,
      category,
      images: [image],
    },
  });

  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}