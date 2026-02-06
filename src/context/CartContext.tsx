// src/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
};

type CartContextType = {
    cart: CartItem[];
    customerName: string;
    isNameModalOpen: boolean;
    viewedProduct: any | null; // <--- MỚI: Sản phẩm đang hiện popup
    addToCart: (product: any, quantity?: number) => void; // <--- CẬP NHẬT: Nhận thêm số lượng
    openProductModal: (product: any) => void; // <--- MỚI
    closeProductModal: () => void; // <--- MỚI
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
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

    const [viewedProduct, setViewedProduct] = useState<any | null>(null); // <--- State popup sản phẩm
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
            // Nếu có đơn treo, thêm vào ngay với số lượng đã chọn
            addItemToCartLogic(pendingProduct.product, pendingProduct.quantity);
            setPendingProduct(null);
        }
    };

    const addItemToCartLogic = (product: any, quantity: number = 1) => {
        // Chuẩn hóa dữ liệu sản phẩm trước khi đưa vào giỏ hàng
        const productToCart: CartItem = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            // Lấy ảnh: ưu tiên trường 'image', nếu không có thì lấy ảnh đầu tiên trong mảng 'images'
            image: product.image || (Array.isArray(product.images) ? product.images[0] : product.images) || 'https://via.placeholder.com/300',
            quantity: quantity
        };

        const existingInCart = cart.find((item) => item.id === productToCart.id);

        if (existingInCart) {
            toast.success(`Đã cập nhật số lượng ${productToCart.name}!`);
        } else {
            toast.success(`Đã thêm ${productToCart.name} vào giỏ!`);
        }

        setCart((prev) => {
            const existing = prev.find((item) => item.id === productToCart.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === productToCart.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, productToCart];
        });
    };

    const addToCart = (product: any, quantity: number = 1) => {
        if (!customerName) {
            setPendingProduct({ product, quantity });
            setNameModalOpen(true);
        } else {
            addItemToCartLogic(product, quantity);
        }
        // Đóng modal xem nhanh sau khi đã thêm vào giỏ
        setViewedProduct(null);
    };

    // Các hàm mở/đóng popup sản phẩm
    const openProductModal = (product: any) => setViewedProduct(product);
    const closeProductModal = () => setViewedProduct(null);

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
        toast.success('Đã xóa sản phẩm');
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCart((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
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