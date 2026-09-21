import { useEffect, useRef, useState } from "react";
import { CartedProduct } from "../types";

export function useCartedProducts() {
    const [cartedProducts, setCartedProducts] = useState<CartedProduct[]>([]);
    const cartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [activeCartId, setActiveCartId] = useState<number | null>(null);

    const readFromStorage = () => {
        try {
            const stored = localStorage.getItem("cartedProducts");
            const parsed = stored ? JSON.parse(stored) : [];
            setCartedProducts(Array.isArray(parsed) ? parsed : []);
        } catch (err) {
            console.error("Error while reading cartedProducts:", err);
        }
    }

    useEffect(() => {
        readFromStorage();
        window.addEventListener("storage", readFromStorage);
        return () => window.removeEventListener("storage", readFromStorage);
    }, []);

    const toggleCart = (productId: number) => {
        const exists = cartedProducts.some((p) => p.id === productId);
        const updatedCarts = exists
          ? cartedProducts.filter((p) => p.id !== productId)
          : [...cartedProducts, { id: productId, quantity: 1 }];
    
        setCartedProducts(updatedCarts);
        localStorage.setItem("cartedProducts", JSON.stringify(updatedCarts));
        window.dispatchEvent(new Event("storage"));
    
        if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
        setActiveCartId(productId);
        cartTimeoutRef.current = setTimeout(() => setActiveCartId(null), 700);
    };

    const addToCart = (productId: number, quantity: number = 1) => {
        const exists = cartedProducts.some((p) => p.id === productId);

        const updatedCarts = exists
        ? cartedProducts.map((p) => (p.id === productId ? { ...p, quantity } : p))
        : [...cartedProducts, { id: productId, quantity }];

        setCartedProducts(updatedCarts);
        localStorage.setItem("cartedProducts", JSON.stringify(updatedCarts));
        window.dispatchEvent(new Event("storage"));
    };

    const removeFromCart = (productId: number) => {
        const updatedCarts = cartedProducts.filter((p) => p.id !== productId);
      
        setCartedProducts(updatedCarts);
        localStorage.setItem("cartedProducts", JSON.stringify(updatedCarts));
        window.dispatchEvent(new Event("storage"));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        const updatedCarts = cartedProducts.map((p) =>
          p.id === productId ? { ...p, quantity } : p
        );
      
        setCartedProducts(updatedCarts);
        localStorage.setItem("cartedProducts", JSON.stringify(updatedCarts));
        window.dispatchEvent(new Event("storage"));
    };

    return { cartedProducts, activeCartId, toggleCart, addToCart, removeFromCart, updateQuantity };
}