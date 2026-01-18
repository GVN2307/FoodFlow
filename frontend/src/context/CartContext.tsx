import { createContext, useContext, useState, ReactNode } from 'react';

interface Product {
    id: number;
    name: string;
    price_per_kg: number;
    farmer?: {
        full_name: string;
    };
    image_url?: string;
}

interface CartItem extends Product {
    cartId: string; // Unique ID for cart item to allow multiples
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (cartId: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        const newItem = { ...product, cartId: Math.random().toString(36).substr(2, 9) };
        setCart((prev) => [...prev, newItem]);
    };

    const removeFromCart = (cartId: string) => {
        setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const total = cart.reduce((sum, item) => sum + (item.price_per_kg || 0), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
