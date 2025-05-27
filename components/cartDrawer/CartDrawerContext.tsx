"use client";

import { useState, useEffect } from "react";
import styles from "./CartDrawer.module.css";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase.js";
import { useTranslation } from "react-i18next";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: number;
  title: string;
  main_image_url: string;
  price: string;
  in_stock: number;
  quantity: number;
}

export default function CartDrawerContext({
  isOpen,
  onClose,
}: CartDrawerProps) {
  const [cartedItems, setCartedItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCartedItems = async () => {
      const stored = localStorage.getItem("cartedProducts");
      if (!stored) return;

      setIsLoading(true);
      try {
        const cartedData: { id: number; quantity: number }[] =
          JSON.parse(stored);
        if (Array.isArray(cartedData) && cartedData.length > 0) {
          const cartedIDs = cartedData.map((item) => item.id);

          const { data, error } = await supabase
            .from("products")
            .select("*")
            .in("id", cartedIDs);

          if (!error && data) {
            const merged = data.map((product) => {
              const match = cartedData.find((item) => item.id === product.id);
              return {
                ...product,
                quantity: match?.quantity ?? 1,
              };
            });

            setCartedItems(merged);
          } else {
            console.error("Error fetching carted products:", error);
          }
        } else {
          setCartedItems([]);
        }
      } catch (err) {
        console.error("Failed to parse carted products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCartedItems();
    }
  }, [isOpen]);

  const handleRemove = (id: number) => {
    const stored = localStorage.getItem("cartedProducts");
    if (!stored) return;

    try {
      const cartedItems: { id: number; quantity: number }[] =
        JSON.parse(stored);
      const updatedItems = cartedItems.filter((item) => item.id !== id);

      localStorage.setItem("cartedProducts", JSON.stringify(updatedItems));

      setCartedItems((prevItems) => prevItems.filter((item) => item.id !== id));

      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (err) {
      console.error("Помилка при видаленні товару з корзини:", err);
    }
  };

  const handleQuantityChange = (id: number, change: number) => {
    setCartedItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;

          const clampedQuantity = Math.max(
            1,
            Math.min(item.in_stock, newQuantity)
          );

          return { ...item, quantity: clampedQuantity };
        }
        return item;
      });

      window.dispatchEvent(new CustomEvent("liked-products-updated"));
      saveCartToLocalStorage(updatedItems);
      return updatedItems;
    });
  };

  const saveCartToLocalStorage = (items: Product[]) => {
    const cartToStore = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));
    localStorage.setItem("cartedProducts", JSON.stringify(cartToStore));

    window.dispatchEvent(new Event("storage"));
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
          <h2>{t("title")}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          {isLoading ? (
            <p className={styles.loadingText}>{t("loading")}</p>
          ) : cartedItems.length === 0 ? (
            <p className={styles.noContent}>{t("empty")}</p>
          ) : (
            <ul className={styles.productList}>
              {cartedItems.map((product) => (
                <div key={product.id} className={styles.productItem}>
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={product.main_image_url}
                      alt={product.title}
                      width={90}
                      height={90}
                      className={styles.productImage}
                    />
                  </Link>
                  <div className={styles.productInfo}>
                    <p className={styles.productTitle}>
                      <Link href={`/product/${product.id}`}>
                        {product.title}
                      </Link>
                    </p>
                    <p className={styles.productPrice}>{product.price} ₴</p>
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
                      onClick={() => handleRemove(product.id)}
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.linkWrapper}>
          {cartedItems.length > 0 ? (
            <button onClick={onClose}>
              <Link href="/shop/cart" className={styles.link}>
                {t("order")}
              </Link>
            </button>
          ) : (
            <button className={styles.disabledButton} disabled>
              {t("order")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
