"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import ShopNav from "@/app/components/shopNav/ShopNav.tsx";
import styles from "./CategoryPage.module.css";
import { useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  imageUrl: string;
  price: string;
}

const categoryData: Record<string, Product[]> = {
  care: [
    {
      id: 1,
      title: "Крем для обличчя",
      imageUrl: "/shop/IMG_1962.png",
      price: "350₴",
    },
    {
      id: 2,
      title: "Маска для шкіри",
      imageUrl: "/shop/IMG_1981.png",
      price: "280₴",
    },
    {
      id: 3,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 4,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 5,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 6,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 7,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
        id: 8,
        title: "Сироватка",
        imageUrl: "/shop/IMG_1984.png",
        price: "410₴",
      },
      {
        id: 8,
        title: "Сироватка",
        imageUrl: "/shop/IMG_1984.png",
        price: "410₴",
      },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 8,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
  ],
  cosmetic: [
    {
      id: 4,
      title: "Косметичка",
      imageUrl: "/shop/IMG_1984.png",
      price: "450₴",
    },
  ],
};

const categoryTitles: Record<string, string> = {
  care: "Догляд",
  cosmetic: "Косметика",
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const products = categoryData[category];
  const [activeHeartId, setActiveHeartId] = useState<number | null>(null);
  const [activeCartId, setActiveCartId] = useState<number | null>(null);

  if (!products) {
    notFound();
  }

  const readableCategory = categoryTitles[category] || category;

  const handleLikeClickOnProduct = (productId: number) => {
    setActiveHeartId(productId);

    setTimeout(() => {
      setActiveHeartId(null);
    }, 700);
  };

  const handleCartClickOnProduct = (productId: number) => {
    setActiveCartId(productId);

    setTimeout(() => {
      setActiveCartId(null);
    }, 700);
  };

  return (
    <div style={{ width: "100%" }}>
      <ShopNav />
      <div className={styles.container}>
        <h1 className={styles.title}>Категорія: {readableCategory}</h1>
        <div className={styles.productListWraper}>
          <div className={styles.productList}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.cardButtons}>
                  <button
                    className={styles.likeButton}
                    onClick={() => handleLikeClickOnProduct(product.id)}
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
                    onClick={() => handleCartClickOnProduct(product.id)}
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
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className={styles.productImage}
                  />
                </div>
                <p>{product.title}</p>
                <p className={styles.bold}>{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
