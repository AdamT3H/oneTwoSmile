"use client";

import { useState, useEffect } from "react";
import styles from "./CartDrawer.module.css";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase.js";
import { useTranslation } from "react-i18next";
import { useCartedProducts } from "@/features/shop/hooks/useCartedProducts";
import { getCartedItems } from "@/features/shop/cart/services/getCartedItems";
import { CartItem } from "@/features/shop/cart/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function CartDrawerContext({
  isOpen,
  onClose,
  locale,
}: CartDrawerProps) {
  const [displayItems, setDisplayItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const { cartedProducts, removeFromCart, updateQuantity } = useCartedProducts();

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    getCartedItems(locale).then((items) => {
      setDisplayItems(items);
      setIsLoading(false);
    });
  }, [isOpen, locale, cartedProducts]);

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
          ) : displayItems.length === 0 ? (
            <p className={styles.noContent}>{t("empty")}</p>
          ) : (
            <ul className={styles.productList}>
              {displayItems.map((product) => (
                <div key={product.id} className={styles.productItem}>
                  <Link href={`shop/product/${product.id}`}>
                    <Image
                      src={product.main_image_url}
                      alt={product.title || "—"}
                      width={90}
                      height={90}
                      className={styles.productImage}
                    />
                  </Link>
                  <div className={styles.productInfo}>
                    <p className={styles.productTitle}>
                      <button onClick={onClose}>
                        <Link href={`/shop/product/${product.id}`}>
                          {product.title || "—"}
                        </Link>
                      </button>
                    </p>
                    <p className={styles.productPrice}>{product.price} ₴</p>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(product.id, Math.max(1, product.quantity - 1))}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>
                        {product.quantity}
                      </span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles.deleteButton}
                      onClick={() => removeFromCart(product.id)}
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
          {displayItems.length > 0 ? (
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
