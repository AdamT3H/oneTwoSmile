"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ShopNav from "@/app/components/shopNav/ShopNav";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

interface Product {
  id: number;
  title: string;
  main_image_url: string;
  price: string;
}

interface CartedProduct {
  id: number;
  quantity: number;
}

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeHeartId, setActiveHeartId] = useState<number | null>(null);
  const [activeCartId, setActiveCartId] = useState<number | null>(null);

  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [cartedProducts, setCartedProducts] = useState<CartedProduct[]>([]);

  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    const getLikes = localStorage.getItem("likedProducts");
    const getCarts = localStorage.getItem("cartedProducts");

    if (getLikes) {
      setLikedProducts(JSON.parse(getLikes));
    }

    if (getCarts) {
      setCartedProducts(JSON.parse(getCarts));
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("likedProducts");
      if (stored) {
        setLikedProducts(JSON.parse(stored));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("cartedProducts");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCartedProducts(parsed);
          }
        } catch (err) {
          console.error(
            "Помилка при читанні cartedProducts із localStorage:",
            err
          );
        }
      } else {
        setCartedProducts([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLikeClickOnProduct = (productId: number) => {
    let updatedLikes;

    if (likedProducts.includes(productId)) {
      updatedLikes = likedProducts.filter((id) => id !== productId);
    } else {
      updatedLikes = [...likedProducts, productId];
    }

    setLikedProducts(updatedLikes);
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));

    setActiveHeartId(productId);

    setTimeout(() => {
      setActiveHeartId(null);
    }, 700);
  };

  const handleCartClickOnProduct = (
    productId: number,
    quantity: number = 1
  ) => {
    let updatedCarts;

    const existing = cartedProducts.find((p) => p.id === productId);

    if (existing) {
      if (existing.quantity === quantity) {
        updatedCarts = cartedProducts.filter((p) => p.id !== productId);
      } else {
        updatedCarts = cartedProducts.map((p) =>
          p.id === productId ? { ...p, quantity } : p
        );
      }
    } else {
      updatedCarts = [...cartedProducts, { id: productId, quantity }];
    }

    setCartedProducts(updatedCarts);
    localStorage.setItem("cartedProducts", JSON.stringify(updatedCarts));

    setActiveCartId(productId);
    setTimeout(() => {
      setActiveCartId(null);
    }, 700);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const range = 2;
  const startPage = Math.max(currentPage - range, 1);
  const endPage = Math.min(currentPage + range, totalPages);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("title", `%${query}%`);

      if (error) {
        console.error("Search error:", error.message);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    if (query.trim()) {
      fetchSearchResults();
    }
  }, [query]);

  const getSortedProducts = () => {
    const sorted = [...products];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return sorted;
  };

  const sortedProducts = getSortedProducts();
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div style={{ width: "100%" }}>
      <ShopNav />
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
            <h1 className={styles.title}>Пошук: {query}</h1>

            <div className={styles.sortContainer}>
              <label htmlFor="sort" className={styles.sortLabel}>
                Сортувати:
              </label>
              <select
                id="sort"
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Без сортування</option>
                <option value="price-asc">Дешевше - дороще</option>
                <option value="price-desc">Дороще - дешевше</option>
                <option value="title-asc">Від А до Я</option>
                <option value="title-desc">Від Я до A</option>
              </select>
            </div>

            {products.length === 0 ? (
              <p>Нічого не знайдено.</p>
            ) : (
              <>
                <div className={styles.productListWraper}>
                  <div className={styles.productList}>
                    {currentProducts.map((product) => (
                      <div key={product.id} className={styles.productCard}>
                        <div className={styles.cardButtons}>
                          <button
                            className={styles.likeButton}
                            onClick={() => handleLikeClickOnProduct(product.id)}
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
                              handleCartClickOnProduct(product.id, 1)
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
                          href={`/product/${product.id}`}
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
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Попередня
                    </button>

                    {currentPage > range + 1 && (
                      <>
                        <button onClick={() => handlePageChange(1)}>1</button>
                        <span>...</span>
                      </>
                    )}

                    {Array.from(
                      { length: endPage - startPage + 1 },
                      (_, index) => (
                        <button
                          key={startPage + index}
                          onClick={() => handlePageChange(startPage + index)}
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

                    {currentPage < totalPages - range && (
                      <>
                        <span>...</span>
                        <button onClick={() => handlePageChange(totalPages)}>
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Пагінація для телефонів */}
                  <div
                    className={`${styles.pagination} ${styles.mobilePagination}`}
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Попередня
                    </button>

                    {currentPage > 1 && (
                      <button onClick={() => handlePageChange(currentPage - 1)}>
                        {currentPage - 1}
                      </button>
                    )}

                    <button className={styles.activePage}>{currentPage}</button>

                    {currentPage < totalPages && (
                      <button onClick={() => handlePageChange(currentPage + 1)}>
                        {currentPage + 1}
                      </button>
                    )}

                    {currentPage + 2 < totalPages && (
                      <span className={styles.dots}>...</span>
                    )}

                    {currentPage + 1 < totalPages && (
                      <button onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                      </button>
                    )}
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

export default function Page() {
  return (
    <Suspense fallback={<p>Завантаження…</p>}>
      <SearchPage />
    </Suspense>
  );
}
