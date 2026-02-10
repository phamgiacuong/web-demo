'use server';

import { revalidatePath } from 'next/cache';
import { UserService } from '../../services/user.service';
import { Role } from '@prisma/client';

export async function updateUserRole(userId: string, newRole: Role) {
  try {
    await UserService.updateRole(userId, newRole);
    revalidatePath('/admin/users');
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Không thể cập nhật quyền người dùng.");
  }
}

export async function deleteUser(userId: string) {
  try {
    await UserService.delete(userId);
    revalidatePath('/admin/users');
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Không thể xóa người dùng.");
  }
}