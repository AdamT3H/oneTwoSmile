"use client";
import { useState, useEffect } from "react";
import styles from "./CategorySection.module.css";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  main_image_url: string;
  price: string;
}

interface CategorySectionProps {
  title: string;
  categoryLink: string;
  products: Product[];
}

interface CartedProduct {
  id: number;
  quantity: number;
}

export default function CategorySection({
  title,
  categoryLink,
  products,
}: CategorySectionProps) {
  const [activeHeartId, setActiveHeartId] = useState<number | null>(null);
  const [activeCartId, setActiveCartId] = useState<number | null>(null);

  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [cartedProducts, setCartedProducts] = useState<CartedProduct[]>([]);

  useEffect(() => {
    const getLikes = localStorage.getItem("likedProducts");
    const getCarts = localStorage.getItem("cartedProducts");

    if (getLikes) {
      setLikedProducts(JSON.parse(getLikes));
    }

    if (getCarts) {
      setCartedProducts(JSON.parse(getCarts));
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("cartedProducts");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCartedProducts(parsed); 
          }
        } catch (err) {
          console.error("Помилка при читанні cartedProducts із localStorage:", err);
        }
      } else {
        setCartedProducts([]);
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("likedProducts");
      if (stored) {
        setLikedProducts(JSON.parse(stored));
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLikeClickOnProduct = (productId: number) => {
    let updatedLikes;

    if (likedProducts.includes(productId)) {
      updatedLikes = likedProducts.filter((id) => id !== productId);
    } else {
      updatedLikes = [...likedProducts, productId];
    }

    setLikedProducts(updatedLikes);
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));

    setActiveHeartId(productId);

    setTimeout(() => {
      setActiveHeartId(null);
    }, 700);
  };

  const handleCartClickOnProduct = (
    productId: number,
    quantity: number = 1
  ) => {
    let updatedCarts;

    const existing = cartedProducts.find((p) => p.id === productId);

    if (existing) {
      if (existing.quantity === quantity) {
        updatedCarts = cartedProducts.filter((p) => p.id !== productId); // toggle off
      } else {
        updatedCarts = cartedProducts.map((p) =>
          p.id === productId ? { ...p, quantity } : p
        );
      }
    } else {
      updatedCarts = [...cartedProducts, { id: productId, quantity }];
    }

    setCartedProducts(updatedCarts);
    localStorage.setItem("cartedProducts", JSON.stringify(updatedCarts));

    setActiveCartId(productId);
    setTimeout(() => {
      setActiveCartId(null);
    }, 700);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <Link href={categoryLink} className={styles.moreButton}>
            Більше →
          </Link>
        </div>

        <div className={styles.productsWrapper}>
          <div className={styles.products}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.cardButtons}>
                  <button
                    className={styles.likeButton}
                    onClick={() => handleLikeClickOnProduct(product.id)}
                  >
                    <Image
                      src={
                        likedProducts.includes(product.id)
                          ? "/shop/likeRed.png"
                          : "/shop/like.png"
                      }
                      alt="Liked products"
                      width={20}
                      height={20}
                      className={`${styles.heartImage} ${
                        activeHeartId === product.id ? styles.animate : ""
                      }`}
                    />
                  </button>
                  <button
                    className={styles.cartButton}
                    onClick={() => handleCartClickOnProduct(product.id, 1)}
                  >
                    <Image
                      src={
                        cartedProducts.some((p) => p.id === product.id)
                          ? "/shop/cartBlue.png"
                          : "/shop/cart.png"
                      }
                      alt="Shopping cart"
                      width={20}
                      height={20}
                      className={`${styles.cartImage} ${
                        activeCartId === product.id ? styles.animate : ""
                      }`}
                    />
                  </button>
                </div>

                <Link
                  href={`/product/${product.id}`}
                  className={styles.productLink}
                >
                  <div className={styles.productImageWrapper}>
                    <Image
                      src={product.main_image_url}
                      alt={product.title}
                      width={160}
                      height={160}
                      className={styles.productImage}
                    />
                  </div>
                  <p className={styles.productTitle}>{product.title}</p>
                  <p className={styles.productPrice}>{product.price}₴</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
