"use client";

import Image from "next/image";
import styles from "./ProductPage.module.css";
import { use } from "react";
import ShopNav from "@/app/components/shopNav/ShopNav.tsx";
import { supabase } from "@/lib/supabase.js";
import { useRef, useEffect, useState } from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

interface Product {
  id: number;
  title: string;
  main_image_url: string;
  price: string;
  in_stock: number;
  galery_images_url: string[];
  description: string;
}

interface CartedProduct {
  id: number;
  quantity: number;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [inlineWidth, setInlineWidth] = useState<number | null>(null);
  const [activeHeartId, setActiveHeartId] = useState<number | null>(null);
  // const [activeCartId, setActiveCartId] = useState<number | null>(null);

  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [cartedProducts, setCartedProducts] = useState<CartedProduct[]>([]);

  const containerInLineRef = useRef<HTMLDivElement>(null);

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
    const fetchProduct = async () => {
      await new Promise((res) => setTimeout(res, 1000));
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProduct(data);
        setMainImage(data.main_image_url);
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (containerInLineRef.current) {
      setInlineWidth(containerInLineRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerInLineRef.current) {
        setInlineWidth(containerInLineRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [product]);

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
          console.error("Помилка при читанні cartedProducts із localStorage:", err);
        }
      } else {
        setCartedProducts([]);
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;
      if (!product) return prev;
      if (newQuantity < 1) return 1;
      if (newQuantity > product.in_stock) return product.in_stock;
      return newQuantity;
    });
  };

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

    // setActiveCartId(productId);
    // setTimeout(() => {
    //   setActiveCartId(null);
    // }, 700);
  };

  useEffect(() => {
    if (product && cartedProducts.length > 0) {
      const existingProduct = cartedProducts.find((p) => p.id === product.id);
      if (existingProduct) {
        setQuantity(existingProduct.quantity);
      }
    }
  }, [product, cartedProducts]);

  const isOutOfStock = product ? product.in_stock === 0 : true;

  return (
    <div style={{ width: "100%" }}>
      <ShopNav />
      {isLoading ? (
        <>
          <div className={styles.containerWrapper}>
            <div className={styles.container}>
              <div className={styles.containerInLine}>
                <div className={styles.imageGaleryWrapper}>
                  <div
                    className={`${styles.imageWrapper} ${styles.skeleton}`}
                  ></div>
                  <div className={styles.thumbnailGallery}>
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`${styles.thumbnailWrapper} ${styles.skeleton}`}
                        style={{ width: 60, height: 60 }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className={styles.infoWrapper}>
                  <div className={`${styles.title} ${styles.skeleton}`}></div>
                  <div className={styles.titleWraper}>
                    <div className={`${styles.price} ${styles.skeleton}`}></div>
                    <div
                      className={`${styles.quantitySection} ${styles.skeleton}`}
                      style={{ height: 100, width: 250 }}
                    ></div>
                  </div>
                </div>
              </div>
              <div
                className={`${styles.descriptionBlock} ${styles.skeleton}`}
                style={{ height: 150, width: "80%" }}
              ></div>
            </div>
          </div>
        </>
      ) : !product ? (
        <>Товар не знайдено</>
      ) : (
        <>
          <div className={styles.containerWrapper}>
            <div className={styles.container}>
              <div className={styles.containerInLine} ref={containerInLineRef}>
                <div className={styles.imageGaleryWrapper}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.thumbnailGallery}>
                    {product.galery_images_url?.map((img, index) => (
                      <div key={index} className={styles.thumbnailWrapper}>
                        <Image
                          src={img}
                          alt={`Мініатюра ${index + 1}`}
                          width={60}
                          height={60}
                          className={styles.thumbnail}
                          onClick={() => setMainImage(img)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.infoWrapper}>
                  <h1 className={styles.title}>{product.title}</h1>
                  <div className={styles.titleWraper}>
                    <p className={styles.price}>
                      Ціна:{" "}
                      <span className={styles.priceValue}>
                        {product.price} грн
                      </span>
                    </p>
                    <div className={styles.down}>
                      {!isOutOfStock ? (
                        <>
                          <div className={styles.quantitySection}>
                            <div className={styles.quantityRow}>
                              <label className={styles.quantityLabel}>
                                Кількість:
                              </label>
                              <div className={styles.quantityControl}>
                                <button
                                  className={styles.quantityButton}
                                  onClick={() => handleQuantityChange(-1)}
                                  disabled={isOutOfStock}
                                >
                                  -
                                </button>
                                <span className={styles.quantity}>
                                  {quantity}
                                </span>
                                <button
                                  className={styles.quantityButton}
                                  onClick={() => handleQuantityChange(1)}
                                  disabled={isOutOfStock}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <p className={styles.inStock}>
                              На складі залишилось: {product.in_stock}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className={styles.notInStock}>Товар закінчився</p>
                      )}
                    </div>

                    <div className={styles.buttonGroup}>
                      <button
                        className={styles.addToCartButton}
                        disabled={cartedProducts.some(
                          (p) => p.id === product.id
                        )}
                        onClick={() => {
                          if (
                            !cartedProducts.some((p) => p.id === product.id)
                          ) {
                            handleCartClickOnProduct(product.id, quantity);
                          }
                        }}
                      >
                        {cartedProducts.some((p) => p.id === product.id)
                          ? "Вже у кошику"
                          : "Додати у кошик"}
                      </button>
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
                          width={23}
                          height={23}
                          className={`${styles.heartImage} ${
                            activeHeartId === product.id ? styles.animate : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={styles.descriptionBlock}
                style={inlineWidth ? { width: `${inlineWidth}px` } : undefined}
              >
                <p className={styles.descriptionTitle}>Опис товару: </p>
                <p className={styles.description}>{product.description}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
