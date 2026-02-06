// src/app/actions.ts
'use server'

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// --- AUTH & PRODUCTS ---
export async function login(formData: FormData) {
  const password = formData.get('password') as string;
  if (password === '123') {
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

export async function getProductById(id: string) {
  return await prisma.product.findUnique({ where: { id } });
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin');
  revalidatePath('/');
}

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

// --- ORDER ACTIONS (MỚI) ---

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