"use client";

import { useEffect, useState } from "react";
import CategorySection from "@/components/categorySection/CategorySection";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
  title: string;
  main_image_url: string;
  price: string;
  in_stock: number;
  galery_images_url: string[];
  description: string;
  category_id: number;
}

interface RawProduct {
  id: number;
  price: string;
  in_stock: number;
  main_image_url: string;
  galery_images_url: string[];
  category_id: number;
  product_translations: {
    title: string;
    description: string;
  }[];
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
          const { data: categoriesData, error: categoriesError } = await supabase
            .from("shop_categories")
            .select("*");
      
          if (categoriesError) throw new Error(categoriesError.message);
      
          setCategories(categoriesData || []);
      
          const productsFetches = categoriesData.map((cat: Category) =>
            supabase
              .from("products")
              .select(
                `
                  id,
                  price,
                  in_stock,
                  main_image_url,
                  galery_images_url,
                  category_id,
                  product_translations:product_translations_product_id_fkey (
                    title,
                    description
                  )
                `
              )
              .eq("category_id", cat.id)
              .eq("product_translations.language_code", locale) // !!! locale тут
              .limit(15)
          );
      
          const productsResults = await Promise.all(productsFetches);
      
          const productsMap: { [key: number]: Product[] } = {};
      
          productsResults.forEach((res, index) => {
            if (res.error) throw new Error(res.error.message);
            const catId = categoriesData[index].id;
      
            // Перетворимо продукти з перекладами
            const transformed = (res.data || []).map((prod: RawProduct) => ({
              id: prod.id,
              price: prod.price,
              in_stock: prod.in_stock,
              main_image_url: prod.main_image_url,
              galery_images_url: prod.galery_images_url,
              category_id: prod.category_id,
              title: prod.product_translations?.[0]?.title ?? "Без назви",
              description: prod.product_translations?.[0]?.description ?? "",
            }));
      
            productsMap[catId] = transformed;
          });
      
          setProductsByCategory(productsMap);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error("Помилка при завантаженні:", err.message);
          } else {
            console.error("Невідома помилка:", err);
          }
          setError("Не вдалося завантажити продукти.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchProducts()
  }, []);

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
