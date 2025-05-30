"use client";
import { useState, useEffect } from "react";
import styles from "./LikeDrawer.module.css";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase.js";
import { useTranslation } from "react-i18next";

interface LikeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

interface Product {
  id: number;
  main_image_url: string;
  price: string;
  product_translations: {
    title: string;
  }[];
}

export default function LikeDrawerContext({
  isOpen,
  onClose,
  locale,
}: LikeDrawerProps) {
  const [likedItems, setLikedItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLikedItems = async () => {
      const stored = localStorage.getItem("likedProducts");
      if (!stored) return;

      setIsLoading(true);
      try {
        const likedIDs = JSON.parse(stored);
        if (Array.isArray(likedIDs) && likedIDs.length > 0) {
          const { data, error } = await supabase
            .from("products")
            .select(
              `
              id,
              main_image_url,
              price,
              in_stock,
              product_translations:product_translations_product_id_fkey (
                title
              )
            `
            )
            .in("id", likedIDs)
            .eq("product_translations.language_code", locale);

          if (!error && data) {
            setLikedItems(data);
          } else {
            console.error("Error fetching liked products:", error);
          }
        } else {
          setLikedItems([]);
        }
      } catch (err) {
        console.error("Failed to parse liked products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchLikedItems();
    }
  }, [isOpen]);

  const handleRemove = (id: number) => {
    const stored = localStorage.getItem("likedProducts");
    if (!stored) return;

    try {
      const likedIDs: number[] = JSON.parse(stored);
      const updatedIDs = likedIDs.filter((itemId) => itemId !== id);

      localStorage.setItem("likedProducts", JSON.stringify(updatedIDs));

      setLikedItems((prevItems) => prevItems.filter((item) => item.id !== id));

      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Помилка при видаленні вподобаного товару:", err);
    }
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
            <p className={styles.loading}>{t("loading")}</p>
          ) : likedItems.length === 0 ? (
            <p className={styles.noContent}>{t("empty")}</p>
          ) : (
            <ul className={styles.productList}>
              {likedItems.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  <div className={styles.productImageWrapper}>
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src={product.main_image_url}
                        alt={product.product_translations?.[0]?.title || "—"}
                        width={90}
                        height={90}
                        className={styles.productImage}
                      />
                    </Link>
                  </div>
                  <div className={styles.productInfo}>

                      <Link
                        href={`/shop/product/${product.id}`}
                        className={styles.productTitle}
                      >                    <button onClick={onClose}>
                        {product.product_translations?.[0]?.title || "—"}
                        </button>
                      </Link>

                    <p className={styles.productPrice}>{product.price} ₴</p>
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleRemove(product.id);
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
