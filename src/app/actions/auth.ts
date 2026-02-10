'use server';

import { redirect } from 'next/navigation';
import { UserService } from '../../services/user.service';
import { createSession, deleteSession, getSession } from '../../lib/auth';
import bcrypt from 'bcryptjs';

// Hàm kiểm tra đăng nhập (dùng cho Client Component)
export async function checkAuth() {
  const session = await getSession();
  return session;
}

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const callbackUrl = formData.get('callbackUrl') as string;

  if (!username || !password) {
    redirect(`/login?error=missing_fields${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`);
  }

  const user = await UserService.findByUsername(username);

  if (!user) {
    redirect(`/login?error=invalid_credentials${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    redirect(`/login?error=invalid_credentials${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`);
  }

  // Tạo session
  await createSession({ userId: user.id, role: user.role });

  // Điều hướng
  if (callbackUrl) {
    redirect(callbackUrl);
  } else if (user.role === 'ADMIN') {
    redirect('/admin');
  } else {
    redirect('/');
  }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

export async function register(formData: FormData) {
  const username = formData.get('username') as string;
  const contactInfo = formData.get('contactInfo') as string; // Email hoặc SĐT
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!username || !contactInfo || !name || !password || !confirmPassword) {
    redirect('/register?error=missing_fields');
  }

  // 1. Validate Password
  if (password !== confirmPassword) {
    redirect('/register?error=password_mismatch');
  }

  // 2. Validate Username trùng
  const existingUser = await UserService.findByUsername(username);
  if (existingUser) {
    redirect('/register?error=username_exists');
  }

  try {
    await UserService.create(username, password, name, contactInfo, 'USER');
  } catch (error) {
    console.error("Register error:", error);
    // Nếu lỗi không phải do redirect (mặc dù ở trên chưa gọi redirect trong try), thì redirect về trang lỗi
    redirect('/register?error=unknown');
  }

  // Redirect thành công phải ở ngoài try-catch
  redirect('/login?success=registered');
}