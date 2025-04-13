"use client";
import { useState } from "react";
import styles from "./CategorySection.module.css";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  imageUrl: string;
  price: string;
}

interface CategorySectionProps {
  title: string;
  categoryLink: string;
  products: Product[];
}

export default function CategorySection({
  title,
  categoryLink,
  products,
}: CategorySectionProps) {
  const [activeHeartId, setActiveHeartId] = useState<number | null>(null);
  const [activeCartId, setActiveCartId] = useState<number | null>(null);

  const handleLikeClick = (productId: number) => {
    setActiveHeartId(productId);

    setTimeout(() => {
      setActiveHeartId(null);
    }, 700);
  };

  const handleCartClick = (productId: number) => {
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
                    onClick={() => handleLikeClick(product.id)}
                  >
                    <Image
                      src="/shop/like.png"
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
                    onClick={() => handleCartClick(product.id)}
                  >
                    <Image
                      src="/shop/cart.png"
                      alt="Shopping cart"
                      width={20}
                      height={20}
                      className={`${styles.cartImage} ${
                        activeCartId === product.id ? styles.animate : ""
                      }`}
                    />
                  </button>
                </div>

                <div className={styles.productImageWrapper}>
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={160}
                    height={160}
                    className={styles.productImage}
                  />
                </div>
                <p className={styles.productTitle}>{product.title}</p>
                <p className={styles.productPrice}>{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
