import { prisma } from '../lib/prisma';

export type CreateOrderItemDTO = {
  id: string; // Product ID
  quantity: number;
  price: number;
  selectedAttributes?: any;
};

export const OrderService = {
  async create(customerName: string, cartItems: CreateOrderItemDTO[], total: number) {
    // 1. Tạo Order trước
    const order = await prisma.order.create({
      data: {
        customerName,
        total: total,
      },
    });

    // 2. Tạo OrderItem thủ công (vì không còn quan hệ)
    if (cartItems.length > 0) {
      await prisma.orderItem.createMany({
        data: cartItems.map((item) => ({
          orderId: order.id, // Link thủ công
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          selectedAttributes: item.selectedAttributes ? JSON.stringify(item.selectedAttributes) : undefined,
        })),
      });
    }

    return order;
  },

  async getAll() {
    // 1. Lấy tất cả Orders
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (orders.length === 0) return [];

    // 2. Lấy tất cả OrderItems liên quan
    const orderIds = orders.map(o => o.id);
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: { in: orderIds } },
    });

    // 3. Lấy thông tin Products liên quan
    const productIds = [...new Set(orderItems.map(i => i.productId))]; // Lọc trùng ID
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // 4. Ghép dữ liệu (Manual Join) trong Code
    // Tạo Map để tra cứu nhanh O(1)
    const productMap = new Map(products.map(p => [p.id, p]));
    
    // Group items theo orderId
    const itemsByOrderId = new Map<string, any[]>();
    
    orderItems.forEach(item => {
      const product = productMap.get(item.productId);
      const enrichedItem = {
        ...item,
        product: product || null // Ghép thông tin product vào item
      };
      
      if (!itemsByOrderId.has(item.orderId)) {
        itemsByOrderId.set(item.orderId, []);
      }
      itemsByOrderId.get(item.orderId)?.push(enrichedItem);
    });

    // 5. Trả về cấu trúc giống hệt cũ (Order có field items)
    return orders.map(order => ({
      ...order,
      items: itemsByOrderId.get(order.id) || []
    }));
  },

  async toggleStatus(orderId: string, currentStatus: string) {
    const newStatus = currentStatus === 'pending' ? 'confirmed' : 'pending';
    return await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
  }
};