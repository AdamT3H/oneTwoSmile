import { useEffect, useRef, useState } from "react";

export function useLikedProducts() {
    const [likedProducts, setLikedProducts] = useState<number[]>([]);
    const [activeHeartId, setActiveHeartId] = useState<number | null>(null);
    const heartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const readFromStorage = () => {
        try {
            const stored = localStorage.getItem("likedProducts");
            const parsed = stored ? JSON.parse(stored) : [];
            setLikedProducts(Array.isArray(parsed) ? parsed : []);
        } catch (err) {
            console.error("Error while reading likedProducts:", err);
        }
    }

    useEffect(() => {
        readFromStorage();
        window.addEventListener("storage", readFromStorage);
        return () => window.removeEventListener("storage", readFromStorage);
    }, []);

    const toggleLike = (productId: number) => {
        const updatedLikes = likedProducts.includes(productId)
          ? likedProducts.filter((id) => id !== productId)
          : [...likedProducts, productId];
    
        setLikedProducts(updatedLikes);
        localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
        window.dispatchEvent(new Event("storage"));
    
        if (heartTimeoutRef.current) {
            clearTimeout(heartTimeoutRef.current);
        }

        setActiveHeartId(productId);

        heartTimeoutRef.current = setTimeout(() => 
            setActiveHeartId(null), 700
        );
    };

    return { likedProducts, activeHeartId, toggleLike };
}