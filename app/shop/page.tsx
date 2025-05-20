"use client";

import { useEffect, useState } from "react";
import ShopNav from "@/app/components/shopNav/ShopNav";
import BannerShopPage from "@/app/components/bannerShopPage/BannerShopPage";
import CategorySection from "@/app/components/categorySection/CategorySection";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

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

interface Category {
  id: number;
  name: string;
  title: string;
}

export default function Shop() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<{
    [key: number]: Product[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Штучна затримка для наочності
        await new Promise((res) => setTimeout(res, 1000));

        const { data: categoriesData, error: categoriesError } = await supabase
          .from("shop_categories")
          .select("*");

        if (categoriesError) throw new Error(categoriesError.message);

        setCategories(categoriesData || []);

        const productsFetches = categoriesData.map((cat: Category) =>
          supabase
            .from("products")
            .select("*")
            .eq("category_id", cat.id)
            .limit(15)
        );

        const productsResults = await Promise.all(productsFetches);

        const productsMap: { [key: number]: Product[] } = {};

        productsResults.forEach((res, index) => {
          if (res.error) throw new Error(res.error.message);
          const catId = categoriesData[index].id;
          productsMap[catId] = res.data || [];
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

    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      <ShopNav />
      <BannerShopPage />

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
              title={category.title}
              categoryLink={`/shop/category/${category.name}`}
              products={productsByCategory[category.id] || []}
            />
          ))}
        </>
      )}
    </div>
  );
}
