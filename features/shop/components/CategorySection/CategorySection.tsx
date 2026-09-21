"use client";

import styles from "./CategorySection.module.css";
import Link from "next/link";
import Image from "next/image";
import type { TFunction } from "i18next";
import { useLikedProducts } from "../../hooks/useLikedProducts";
import { useCartedProducts } from "../../hooks/useCartedProducts";

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
  t: TFunction<"categorySection">;
}

export default function CategorySection({
  title,
  categoryLink,
  products,
  t,
}: CategorySectionProps) {
  const { likedProducts, activeHeartId, toggleLike } = useLikedProducts();
  const { cartedProducts, activeCartId, toggleCart } = useCartedProducts();

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <Link href={categoryLink} className={styles.moreButton}>
            {t("more")} 
          </Link>
        </div>

        <div className={styles.productsWrapper}>
          <div className={styles.products}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.cardButtons}>
                  <button
                    className={styles.likeButton}
                    onClick={() => toggleLike(product.id)}
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
                    onClick={() => toggleCart(product.id)}
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
                  href={`/shop/product/${product.id}`}
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
