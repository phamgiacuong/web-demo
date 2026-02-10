import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const UserService = {
  async create(username: string, password: string, name: string, contactInfo: string, role: Role = 'USER') {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        contactInfo,
        role,
        // Tạm thời để email null hoặc lấy từ contactInfo nếu nó là email
        email: contactInfo.includes('@') ? contactInfo : undefined,
      },
    });
  },

  async findByUsername(username: string) {
    return await prisma.user.findUnique({ where: { username } });
  },

  // Giữ lại hàm này để tương thích cũ hoặc check trùng email
  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  },

  async getAll() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        contactInfo: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });
  },

  async delete(id: string) {
    return await prisma.user.delete({ where: { id } });
  },

  async updateRole(id: string, role: Role) {
    return await prisma.user.update({
      where: { id },
      data: { role },
    });
  }
};