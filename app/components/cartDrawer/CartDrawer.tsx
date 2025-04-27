"use client";
import { useState, useEffect } from "react";
import styles from "./CartDrawer.module.css";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [cartedItems, setCartedItems] = useState([
    {
      id: 1,
      title: "Крем для обличчя",
      imageUrl: "/shop/IMG_1962.png",
      price: "350₴",
      quantity: 1,
    },
    {
      id: 2,
      title: "Маска для шкіри",
      imageUrl: "/shop/IMG_1981.png",
      price: "280₴",
      quantity: 1,
    },
    {
      id: 3,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
      quantity: 1,
    },
    {
      id: 4,
      title: "Сироватка",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
      quantity: 1,
    },
    {
      id: 5,
      title: "Сироватка піздата шо пздц",
      imageUrl: "/shop/IMG_1984.png",
      price: "410₴",
      quantity: 1,
    },
  ]);

  const handleQuantityChange = (id: number, change: number) => {
    setCartedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

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
          <h2>Корзина</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          {cartedItems.length === 0 ? (
            <p className={styles.noContent}>Ваша корзинка порожня</p>
          ) : (
            <ul className={styles.productList}>
              {cartedItems.map((product) => (
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
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(product.id, -1)}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>
                        {product.quantity}
                      </span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                    className={styles.deleteButton}
                  >
                    Видалити
                  </button>
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
