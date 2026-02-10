'use server';

import { revalidatePath } from 'next/cache';
import { OrderService } from '../../services/order.service';

export async function createOrder(customerName: string, cartItems: any[], total: number) {
  // Map cartItems từ UI sang DTO của Service
  const itemsDTO = cartItems.map(item => ({
    id: item.id,
    quantity: item.quantity,
    price: item.price
  }));

  await OrderService.create(customerName, itemsDTO, total);
  revalidatePath('/admin/orders');
}

export async function getOrders() {
  return await OrderService.getAll();
}

export async function toggleOrderStatus(orderId: string, currentStatus: string) {
  await OrderService.toggleStatus(orderId, currentStatus);
  revalidatePath('/admin/orders');
}