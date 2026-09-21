"use client";

import { useState, useEffect } from "react";
import styles from "./LikeDrawer.module.css";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useLikedProducts } from "@/features/shop/hooks/useLikedProducts";
import { getLikedItems } from "../../services/getLikedItems";
import { LikedProduct } from "../../types";


interface LikeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function LikeDrawerContext({
  isOpen,
  onClose,
  locale,
}: LikeDrawerProps) {
  const [displayItems, setDisplayItems] = useState<LikedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const { likedProducts, toggleLike } = useLikedProducts();

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    getLikedItems(likedProducts, locale).then((items) => {
      setDisplayItems(items);
      setIsLoading(false);
    });
  }, [isOpen, locale, likedProducts]);

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
            <p className={styles.loading}>{t("loading")}</p>
          ) : displayItems.length === 0 ? (
            <p className={styles.noContent}>{t("empty")}</p>
          ) : (
            <ul className={styles.productList}>
              {displayItems.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  <div className={styles.productImageWrapper}>
                    <Link href={`/shop/product/${product.id}`}>
                      <Image
                        src={product.main_image_url}
                        alt={product.title || "—"}
                        width={90}
                        height={90}
                        className={styles.productImage}
                      />
                    </Link>
                  </div>
                  <div className={styles.productInfo}>
                  <Link href={`/shop/product/${product.id}`} className={styles.productTitle} onClick={onClose}>
                    {product.title || "—"}
                  </Link>

                    <p className={styles.productPrice}>{product.price} ₴</p>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleLike(product.id);
                      }}
                    >
                      {t("remove")}
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
