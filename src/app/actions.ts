// app/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  
  // Lưu ý: Để upload file thật, bạn cần tích hợp Vercel Blob hoặc Cloudinary. 
  // Ở đây tôi dùng giải pháp nhập URL ảnh để demo nhanh gọn.
  const imageUrls = (formData.get('images') as string).split(',').map(url => url.trim())

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      category,
      images: imageUrls,
    },
  })

  revalidatePath('/')
  redirect('/')
}

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

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id }
  })
}