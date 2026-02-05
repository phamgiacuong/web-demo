// src/app/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers' // <--- QUAN TRỌNG: Phải có dòng này mới build được

const prisma = new PrismaClient()

// --- 1. HÀM ĐĂNG NHẬP ---
export async function login(formData: FormData) {
  const password = formData.get('password') as string;
  
  // MẬT KHẨU: admin123
  if (password === 'admin123') {
    const cookieStore = await cookies() // Hàm này cần import ở dòng 6
    cookieStore.set('auth', 'true', { maxAge: 86400 });
    redirect('/admin');
  } else {
    redirect('/login?error=true');
  }
}

// --- 2. HÀM XÓA SẢN PHẨM ---
export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin');
}

// --- 3. HÀM UPDATE SẢN PHẨM ---
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  
  const priceRaw = formData.get('price') as string;
  const price = parseFloat(priceRaw.replace(/\./g, '').replace(/,/g, ''));

  const imagesRaw = formData.get('images') as string;
  
  const data: any = {
      name,
      description,
      price,
      category,
  }

  if (imagesRaw && imagesRaw.length > 0) {
      data.images = imagesRaw.split('|||');
  }

  await prisma.product.update({
    where: { id },
    data: data
  })

  revalidatePath('/')
  redirect('/admin')
}

// --- 4. HÀM THÊM SẢN PHẨM ---
export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  
  const priceRaw = formData.get('price') as string;
  const price = parseFloat(priceRaw.replace(/\./g, '').replace(/,/g, ''));
  
  const imagesRaw = formData.get('images') as string;
  const imageUrls = imagesRaw ? imagesRaw.split('|||') : [];

  await prisma.product.create({
    data: { name, description, price, category, images: imageUrls },
  })
  
  revalidatePath('/')
  redirect('/admin')
}

// --- 5. HÀM LẤY DANH SÁCH SẢN PHẨM ---
export async function getProducts(query: string, category: string) {
    return await prisma.product.findMany({
      where: {
        AND: [
          { name: { contains: query, mode: 'insensitive' } },
          category ? { category: { equals: category } } : {},
        ],
      },
      orderBy: { createdAt: 'desc' }
    })
}

// --- 6. HÀM LẤY CHI TIẾT SẢN PHẨM ---
export async function getProductById(id: string) {
    return await prisma.product.findUnique({ where: { id } })
}