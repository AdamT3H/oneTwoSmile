"use client";

import { useEffect, useState } from "react";
import CategorySection from "@/features/shop/components/CategorySection/CategorySection";
import { supabase } from "@/lib/supabase";
import styles from "./ShopContent.module.css";
import { useTranslation } from "react-i18next";
import { getShopContent } from "./services/getShopContent";

interface Product {
  id: number;
  title: string;
  main_image_url: string;
  price: string;
  in_stock: boolean;
  galery_images_url: string[];
  description: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  title: string;
  title_PL: string;
  title_ENG: string;
}

export default function ShopContent({
    locale,
  }: {
    locale: string;
  }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<{
    [key: number]: Product[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation("categorySection");

  useEffect(() => {
    const fetchProducts = async () => {
        try {
          setLoading(true);
          setError(null);

          const data = await getShopContent(
            locale,
            t("noTitle")
          )

          setCategories(data.categories);
          setProductsByCategory(data.productsByCategory);
        } catch (error) {
          console.error("Помилка при завантаженні:", error);
          setError(t("loadError"));
        } finally {
          setLoading(false);
        }
      };
      fetchProducts()
  }, [locale, t]);

  return (
    <div className="w-full">
      {loading ? (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.wrapper}>
              <div className={styles.container}>
                <h3 className={styles.title}></h3>
                <div className={styles.cards}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className={styles.card}></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : error ? (
        <p className="text-center py-10 text-red-500">{error}</p>
      ) : (
        <>
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              title={
                locale === "pl"
                  ? category.title_PL
                  : locale === "en"
                  ? category.title_ENG
                  : category.title 
              }
              categoryLink={`/shop/category/${category.name}`}
              products={productsByCategory[category.id] || []}
              t={t}
            />
          ))}
        </>
      )}
    </div>
  );
}
