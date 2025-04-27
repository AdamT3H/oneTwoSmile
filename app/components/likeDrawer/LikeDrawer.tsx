"use client";
import { useState, useEffect } from "react";
import styles from "./LikeDrawer.module.css";
import Image from "next/image";

interface LikeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LikeDrawer({ isOpen, onClose }: LikeDrawerProps) {
  const [likedItems, setlikedItems] = useState([
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
      title: "Сироватка піздата шо пздц",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
      />
      <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h2>Вподобане</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          {likedItems.length === 0 ? (
            <p className={styles.noContent}>У вас ще немає вподобань</p>
          ) : (
            <ul className={styles.productList}>
              {likedItems.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={90}
                    height={90}
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                    <p className={styles.productTitle}>{product.title}</p>
                    <p className={styles.productPrice}>{product.price}</p>
                    <button className={styles.deleteButton}>Видалити</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
