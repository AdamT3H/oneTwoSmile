"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SearchContent.module.css";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Product, SortOption } from "../../types";
import { useLikedProducts } from "@/features/shop/hooks/useLikedProducts";
import { useCartedProducts } from "@/features/shop/hooks/useCartedProducts";
import { usePagination } from "@/features/shop/hooks/usePagination";
import { getSearchResults } from "../../services/getSearchResults";

const ITEMS_PER_PAGE = 20;
const PAGE_RANGE = 2;

export default function SearchContent({
  locale,
}: {
  locale: string;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { likedProducts, activeHeartId, toggleLike } = useLikedProducts();
  const { cartedProducts, activeCartId, toggleCart } = useCartedProducts();

  const [totalProducts, setTotalProducts] = useState(0);

  const { currentPage, totalPages, startPage, endPage, goToPage, resetPage } = usePagination({
    totalItems: totalProducts,
    itemsPerPage: ITEMS_PER_PAGE,
    pageRange: PAGE_RANGE,
  });

  const [sortBy, setSortBy] = useState<SortOption>("default");

  const { t } = useTranslation("search");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      const { products, totalCount } = await getSearchResults({
        query,
        locale,
        page: currentPage,
        itemsPerPage: ITEMS_PER_PAGE,
        sortBy,
      });
      setProducts(products);
      setTotalProducts(totalCount);
      setLoading(false);
    };
  
    if (query.trim()) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setTotalProducts(0);
      setLoading(false);
    }
  }, [query, locale, currentPage, sortBy]);

  useEffect(() => {
    resetPage();
  }, [query]);

  return (
    <div style={{ width: "100%" }}>
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
      ) : (
        <>
          <div className={styles.container}>
            <h1 className={styles.title}>{t("search")}: {query}</h1>

            <div className={styles.sortContainer}>
              <label htmlFor="sort" className={styles.sortLabel}>
                {t('sort')}:
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
                <option value="default">{t('sort_none')}</option>
                <option value="price-asc">{t('sort_price_asc')}</option>
                <option value="price-desc">{t('sort_price_desc')}</option>
              </select>
            </div>

            {products.length === 0 ? (
              <p>{t('no_results')}</p>
            ) : (
              <>
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
                                activeHeartId === product.id
                                  ? styles.animate
                                  : ""
                              }`}
                            />
                          </button>
                          <button
                            className={styles.cartButton}
                            onClick={() =>
                              toggleCart(product.id)
                            }
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
                                activeCartId === product.id
                                  ? styles.animate
                                  : ""
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
                  <div
                    className={`${styles.pagination} ${styles.desktopPagination}`}
                  >
                    <div className={styles.paginationFirstRow}>
                      {currentPage > PAGE_RANGE + 1 && (
                        <>
                          <button onClick={() => goToPage(1)}>1</button>
                          <span>...</span>
                        </>
                      )}

                      {Array.from(
                        { length: endPage - startPage + 1 },
                        (_, index) => (
                          <button
                            key={startPage + index}
                            onClick={() => goToPage(startPage + index)}
                            className={
                              currentPage === startPage + index
                                ? styles.activePage
                                : ""
                            }
                          >
                            {startPage + index}
                          </button>
                        )
                      )}

                      {currentPage < totalPages - PAGE_RANGE && (
                        <>
                          <span>...</span>
                          <button onClick={() => goToPage(totalPages)}>
                            {totalPages}
                          </button>
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

                  {/* Пагінація для телефонів */}
                  <div
                    className={`${styles.pagination} ${styles.mobilePagination}`}
                  >

                    <div className={styles.paginationFirstRow}>
                      {currentPage > 2 && (
                        <>
                          <button onClick={() => goToPage(1)}>1</button>
                          <span className={styles.dots}>...</span>
                        </>
                      )}
                    
                      {currentPage > 1 && (
                        <button onClick={() => goToPage(currentPage - 1)}>
                          {currentPage - 1}
                        </button>
                      )}

                      <button className={styles.activePage}>{currentPage}</button>

                      {currentPage < totalPages && (
                        <button onClick={() => goToPage(currentPage + 1)}>
                          {currentPage + 1}
                        </button>
                      )}

                      {currentPage + 2 < totalPages && (
                        <span className={styles.dots}>...</span>
                      )}

                      {currentPage + 1 < totalPages && (
                        <button onClick={() => goToPage(totalPages)}>
                          {totalPages}
                        </button>
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}