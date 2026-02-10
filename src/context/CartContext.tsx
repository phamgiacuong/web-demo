// src/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

type CartItem = {
    cartItemId: string; // ID duy nhất trong giỏ hàng (kết hợp productId + attributes)
    id: string; // Product ID gốc
    name: string;
    price: number;
    image: string;
    quantity: number;
    selectedAttributes?: Record<string, string>; // Thuộc tính đã chọn
};

type CartContextType = {
    cart: CartItem[];
    customerName: string;
    isNameModalOpen: boolean;
    viewedProduct: any | null;
    addToCart: (product: any, quantity?: number) => void;
    openProductModal: (product: any) => void;
    closeProductModal: () => void;
    removeFromCart: (cartItemId: string) => void; // Sửa tham số thành cartItemId
    updateQuantity: (cartItemId: string, quantity: number) => void; // Sửa tham số thành cartItemId
    setCustomerName: (name: string) => void;
    closeNameModal: () => void;
    clearCart: () => void;
    totalAmount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerNameState] = useState('');
    const [isNameModalOpen, setNameModalOpen] = useState(false);

    const [viewedProduct, setViewedProduct] = useState<any | null>(null);
    const [pendingProduct, setPendingProduct] = useState<any>(null);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedName = localStorage.getItem('customerName');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedName) setCustomerNameState(savedName);
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('customerName', customerName);
    }, [cart, customerName]);

    const setCustomerName = (name: string) => {
        setCustomerNameState(name);
        if (pendingProduct) {
            addItemToCartLogic(pendingProduct.product, pendingProduct.quantity);
            setPendingProduct(null);
        }
    };

    const addItemToCartLogic = (product: any, quantity: number = 1) => {
        // Tạo ID duy nhất cho item trong giỏ hàng dựa trên ID sản phẩm và thuộc tính
        // Sắp xếp key của attributes để đảm bảo thứ tự không ảnh hưởng đến stringify
        const sortedAttributes = product.selectedAttributes 
            ? Object.keys(product.selectedAttributes).sort().reduce((obj: any, key) => {
                obj[key] = product.selectedAttributes[key];
                return obj;
            }, {})
            : {};
            
        const cartItemId = `${product.id}-${JSON.stringify(sortedAttributes)}`;

        const productToCart: CartItem = {
            cartItemId: cartItemId,
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || (Array.isArray(product.images) ? product.images[0] : product.images) || 'https://via.placeholder.com/300',
            quantity: quantity,
            selectedAttributes: product.selectedAttributes
        };

        const existingInCart = cart.find((item) => item.cartItemId === productToCart.cartItemId);

        if (existingInCart) {
            toast.success(`Đã cập nhật số lượng ${productToCart.name}!`);
            setCart((prev) => prev.map((item) =>
                item.cartItemId === productToCart.cartItemId
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            toast.success(`Đã thêm ${productToCart.name} vào giỏ!`);
            setCart((prev) => [...prev, productToCart]);
        }
    };

    const addToCart = (product: any, quantity: number = 1) => {
        if (!customerName) {
            // Lưu ý: pendingProduct cũng cần lưu thông tin đầy đủ để add sau này
            setPendingProduct({ product, quantity });
            // Tạm thời bỏ qua check tên ở đây nếu muốn flow mượt hơn, hoặc giữ nguyên logic cũ
            // Ở đây tôi giữ nguyên logic cũ là bắt nhập tên (hoặc login)
            // Nhưng vì bạn đã có cơ chế login bắt buộc khi checkout, có thể bỏ check tên ở đây nếu muốn
            // Tuy nhiên code cũ đang dùng logic này nên tôi giữ nguyên để tránh break flow hiện tại
            // Nếu đã login (có customerName hoặc user session - cần check thêm auth context nếu muốn chặt chẽ)
            // Hiện tại code chỉ check customerName từ localStorage
            
            // Nếu muốn bắt buộc login mới add được thì check session ở đây.
            // Nhưng logic hiện tại là cho add, khi checkout mới bắt login.
            // Vấn đề là customerName đang được dùng như một flag "đã nhập tên".
            
            // Để đơn giản và khớp với yêu cầu "đăng nhập khi thanh toán", ta cứ cho add vào giỏ.
            // Việc check login sẽ làm ở trang Cart.
            // Vì vậy tôi sẽ bỏ qua check customerName ở đây và add thẳng.
            addItemToCartLogic(product, quantity);
        } else {
            addItemToCartLogic(product, quantity);
        }
        setViewedProduct(null);
    };

    const openProductModal = (product: any) => setViewedProduct(product);
    const closeProductModal = () => setViewedProduct(null);

    const removeFromCart = (cartItemId: string) => {
        setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
        toast.success('Đã xóa sản phẩm');
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart((prev) =>
            prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => setCart([]);
    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart, customerName, isNameModalOpen, viewedProduct,
            addToCart, openProductModal, closeProductModal,
            removeFromCart, updateQuantity,
            setCustomerName, closeNameModal: () => setNameModalOpen(false),
            clearCart, totalAmount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};