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
      id: 9,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 10,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 11,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 12,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 13,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 14,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 15,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 16,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 17,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 18,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 19,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 20,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 21,
      title: "Крем для обличчя",
      imageUrl: "/shop/IMG_1962.png",
      price: "350₴",
    },
    {
      id: 22,
      title: "Маска для шкіри",
      imageUrl: "/shop/IMG_1981.png",
      price: "280₴",
    },
    {
      id: 23,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 24,
      title: "Крем для обличчя",
      imageUrl: "/shop/IMG_1962.png",
      price: "350₴",
    },
    {
      id: 25,
      title: "Маска для шкіри",
      imageUrl: "/shop/IMG_1981.png",
      price: "280₴",
    },
    {
      id: 26,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 27,
      title: "Крем для обличчя",
      imageUrl: "/shop/IMG_1962.png",
      price: "350₴",
    },
    {
      id: 28,
      title: "Маска для шкіри",
      imageUrl: "/shop/IMG_1981.png",
      price: "280₴",
    },
    {
      id: 29,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 30,
      title: "Крем для обличчя",
      imageUrl: "/shop/IMG_1962.png",
      price: "350₴",
    },
    {
      id: 31,
      title: "Маска для шкіри",
      imageUrl: "/shop/IMG_1981.png",
      price: "280₴",
    },
    {
      id: 32,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 33,
      title: "Крем для обличчя",
      imageUrl: "/shop/IMG_1962.png",
      price: "350₴",
    },
    {
      id: 34,
      title: "Маска для шкіри",
      imageUrl: "/shop/IMG_1981.png",
      price: "280₴",
    },
    {
      id: 35,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 36,
      title: "Крем для обличчя",
      imageUrl: "/shop/IMG_1962.png",
      price: "350₴",
    },
    {
      id: 37,
      title: "Маска для шкіри",
      imageUrl: "/shop/IMG_1981.png",
      price: "280₴",
    },
    {
      id: 38,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
    {
      id: 39,
      title: "Крем для обличчя",
      imageUrl: "/shop/IMG_1962.png",
      price: "350₴",
    },
    {
      id: 40,
      title: "Маска для шкіри",
      imageUrl: "/shop/IMG_1981.png",
      price: "280₴",
    },
    {
      id: 41,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
  ],
  cosmetic: [
    {
      id: 42,
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const range = 2; 
  const startPage = currentPage;
  const endPage = Math.min(currentPage + range, totalPages);



  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ width: "100%" }}>
      <ShopNav />
      <div className={styles.container}>
        <h1 className={styles.title}>Категорія: {readableCategory}</h1>
        <div className={styles.productListWraper}>
          <div className={styles.productList}>
            {currentProducts.map((product) => (
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
        {/* Пагінація */}
        <div className={styles.paginationWrapper}>
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Попередня
            </button>
            {currentPage > range + 1 && (
              <>
                <button onClick={() => handlePageChange(1)}>1</button>
                <span>...</span>
              </>
            )}
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
              <button
                key={startPage + index}
                onClick={() => handlePageChange(startPage + index)}
                className={
                  currentPage === startPage + index ? styles.activePage : ""
                }
              >
                {startPage + index}
              </button>
            ))}
            {currentPage < totalPages - range && (
              <>
                <span>...</span>
                <button onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Наступна
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
