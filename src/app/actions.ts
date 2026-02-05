// app/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

// --- 1. HÀM ĐĂNG NHẬP ---
export async function login(formData: FormData) {
  const password = formData.get('password') as string;
  
  // MẬT KHẨU CỐ ĐỊNH LÀ: admin123 (Bạn có thể đổi ở đây)
  if (password === 'admin123') {
    // Đăng nhập đúng -> Tạo cookie hạn 1 ngày
    const cookieStore = await cookies()
    cookieStore.set('auth', 'true', { maxAge: 86400 });
    redirect('/admin');
  } else {
    // Sai pass thì quay lại (bạn có thể xử lý hiển thị lỗi sau)
    redirect('/login?error=true');
  }
}

// --- 2. HÀM XÓA SẢN PHẨM ---
export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin');
}

// --- 3. HÀM UPDATE SẢN PHẨM (Mới) ---
export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  
  const priceRaw = formData.get('price') as string;
  const price = parseFloat(priceRaw.replace(/\./g, '').replace(/,/g, ''));

  const imagesRaw = formData.get('images') as string;
  // Logic: Nếu người dùng upload ảnh mới thì dùng ảnh mới, không thì giữ nguyên (xử lý ở client gửi lên)
  
  const data: any = {
      name,
      description,
      price,
      category,
  }

  // Chỉ update ảnh nếu có ảnh mới gửi lên
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

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  
  // Xử lý giá tiền (bỏ các dấu chấm/phẩy nếu có để lấy số thô)
  const priceRaw = formData.get('price') as string;
  const price = parseFloat(priceRaw.replace(/\./g, '').replace(/,/g, ''));

  // Xử lý ảnh: Vì Base64 rất dài và có chứa dấu phẩy, ta sẽ dùng dấu "|||" để ngăn cách các ảnh
  const imagesRaw = formData.get('images') as string;
  const imageUrls = imagesRaw ? imagesRaw.split('|||') : [];

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