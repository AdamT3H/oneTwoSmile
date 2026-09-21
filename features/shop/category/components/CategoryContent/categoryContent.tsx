"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import styles from "./CategoryPage.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase.js";
import { useTranslation } from "react-i18next";
import { useLikedProducts } from "@/features/shop/hooks/useLikedProducts";
import { useCartedProducts } from "@/features/shop/hooks/useCartedProducts";
import { Product, SortOption } from "../../types";
import { usePagination } from "@/features/shop/hooks/usePagination";
import { getCategoryProducts } from "../../services/getCategoryProducts";

const ITEMS_PER_PAGE = 20;
const PAGE_RANGE = 2;

export default function CategoryContent({
  params,
  locale
}: {
  params: Promise<{ category: string }>;
  locale: string
}) {
  const { category } = use(params);
  const [categoryTitle, setCategoryTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const {likedProducts, activeHeartId, toggleLike} = useLikedProducts();
  const {cartedProducts, activeCartId, toggleCart} = useCartedProducts();

  const { currentPage, totalPages, startPage, endPage, goToPage, resetPage } = usePagination({
    totalItems: totalProducts,
    itemsPerPage: ITEMS_PER_PAGE,
    pageRange: PAGE_RANGE,
  });

  const { t } = useTranslation("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const result = await getCategoryProducts({
        category,
        locale,
        page: currentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        sortBy,
      });

      if (!result.categoryFound) {
        notFound();
        return;
      }

      setCategoryTitle(result.categoryTitle);
      setProducts(result.products);
      setTotalProducts(result.totalCount);
      setLoading(false);
    };

    fetchProducts();
  }, [category, locale, currentPage, sortBy]);

  useEffect(() => {
    resetPage();
  }, [category, sortBy]);

  return (
    <div style={{ width: "100%" }}>
      {/* <ShopNav /> */}
      {loading ? (
        <>
          <div className={styles.containerSceleton}>
            <div className={styles.titleSceletonWrapper}>
              <h1 className={styles.titleSceleton}></h1>
            </div>

            <div className={styles.productListWraperSceleton}>
              <div className={styles.productListSceleton}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className={styles.productCardSceleton}></div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : products.length === 0 ? (
        notFound()
      ) : (
        <>
          <div className={styles.container}>
            <h1 className={styles.title}>
              {t("categoryTitle")}: {categoryTitle}
            </h1>

            <div className={styles.sortContainer}>
              <label htmlFor="sort" className={styles.sortLabel}>
                {t("sortLabel")}
              </label>
              <select
                id="sort"
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  resetPage();
                }}
              >
                <option value="">{t("noSort")}</option>
                <option value="price-asc">{t("priceAsc")}</option>
                <option value="price-desc">{t("priceDesc")}</option>
              </select>
            </div>

            <div className={styles.productListWraper}>
              <div className={styles.productList}>
                {products.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.cardButtons}>
                      <button
                        className={styles.likeButton}
                        onClick={() => toggleLike(product.id)}
                      >
                        <Image
                          src={
                            likedProducts.includes(product.id)
                              ? "/shop/likeRed.png"
                              : "/shop/like.png"
                          }
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
                        onClick={() => toggleCart(product.id)}
                      >
                        <Image
                          src={
                            cartedProducts.some((p) => p.id === product.id)
                              ? "/shop/cartBlue.png"
                              : "/shop/cart.png"
                          }
                          alt="Shopping cart"
                          width={20}
                          height={20}
                          className={`${styles.cartImage} ${
                            activeCartId === product.id ? styles.animate : ""
                          }`}
                        />
                      </button>
                    </div>
                    <Link
                      href={`/shop/product/${product.id}`}
                      className={styles.productLink}
                    >
                      <div className={styles.productImageWrapper}>
                        <img
                          src={product.main_image_url}
                          alt={product.title}
                          className={styles.productImage}
                        />
                      </div>
                      <p>{product.title}</p>
                      <p className={styles.bold}>{product.price}₴</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Пагінація */}
            <div className={styles.paginationWrapper}>
              <div className={`${styles.pagination} ${styles.desktopPagination}`}>
                <div className={styles.paginationFirstRow}>
                  {currentPage > PAGE_RANGE + 1 && (
                    <>
                      <button onClick={() => goToPage(1)}>1</button>
                      <span>...</span>
                    </>
                  )}
                  {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                    <button
                      key={startPage + index}
                      onClick={() => goToPage(startPage + index)}
                      className={currentPage === startPage + index ? styles.activePage : ""}
                    >
                      {startPage + index}
                    </button>
                  ))}
                  {currentPage < totalPages - PAGE_RANGE && (
                    <>
                      <span>...</span>
                      <button onClick={() => goToPage(totalPages)}>{totalPages}</button>
                    </>
                  )}
                </div>
                <div className={styles.paginationControls}>
                  <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    {t("prev")}
                  </button>
                  <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    {t("next")}
                  </button>
                </div>
              </div>

              <div className={`${styles.pagination} ${styles.mobilePagination}`}>
                <div className={styles.paginationFirstRow}>
                  {currentPage > 2 && (
                    <>
                      <button onClick={() => goToPage(1)}>1</button>
                      <span className={styles.dots}>...</span>
                    </>
                  )}
                  {currentPage > 1 && <button onClick={() => goToPage(currentPage - 1)}>{currentPage - 1}</button>}
                  <button className={styles.activePage}>{currentPage}</button>
                  {currentPage < totalPages && (
                    <button onClick={() => goToPage(currentPage + 1)}>{currentPage + 1}</button>
                  )}
                  {currentPage + 2 < totalPages && <span className={styles.dots}>...</span>}
                  {currentPage + 1 < totalPages && (
                    <button onClick={() => goToPage(totalPages)}>{totalPages}</button>
                  )}
                </div>
                <div className={styles.paginationControls}>
                  <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    {t("prev")}
                  </button>
                  <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    {t("next")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
