"use client";

import Image from "next/image";
import styles from "./ProductContent.module.css";
import { use } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Product } from "../../types";
import { useCartedProducts } from "@/features/shop/hooks/useCartedProducts";
import { useLikedProducts } from "@/features/shop/hooks/useLikedProducts";
import { getProductById } from "../../services/getProductById";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const MAX_QUANTITY = 20;

export default function ProductPageContent({ params }: ProductPageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const { likedProducts, activeHeartId, toggleLike } = useLikedProducts();
  const { cartedProducts, addToCart } = useCartedProducts();

  const { t } = useTranslation("");

  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setLoadError(false);

      const result = await getProductById(id, i18n.language)

      if (!result) {
        setLoadError(true);
        setIsLoading(false);
        return;
      }

      setProduct(result);
      setMainImage(result.main_image_url);
      setIsLoading(false);
    }

    fetchProduct();
  }, [id, i18n.language]);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;

      if (newQuantity < 1) return 1;
      if (newQuantity > MAX_QUANTITY) return MAX_QUANTITY;

      return newQuantity;
    });
  };

  const isOutOfStock = product ? !product.in_stock : true;
  
  const handleAddToCart = () => {
    if (!product || isOutOfStock) {
      console.warn("Товару немає в наявності");
      return;
    }
    if (cartedProducts.some((p) => p.id === product.id)) return;
    addToCart(product.id, quantity);
  };

  useEffect(() => {
    if (product && cartedProducts.length > 0) {
      const existingProduct = cartedProducts.find((p) => p.id === product.id);
      if (existingProduct) {
        setQuantity(existingProduct.quantity);
      }
    }
  }, [product, cartedProducts]);

  return (
    <div style={{ width: "100%" }}>
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
        ) : loadError ? (
          <p>{t("loadError")}</p>
        ) : !product ? (
          <p>{t("notFound")}</p>
        ) : (
        <>
          <div className={styles.containerWrapper}>
            <div className={styles.container}>
              <div className={styles.containerInLine}>
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
                      {t("price")}:{" "}
                      <span className={styles.priceValue}>
                        {product.price} {t("currency")}
                      </span>
                    </p>
                    <div className={styles.down}>
                      {!isOutOfStock ? (
                        <>
                          <div className={styles.quantitySection}>
                            <div className={styles.quantityRow}>
                              <label className={styles.quantityLabel}>
                                {t("quantity")}:
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
                                  disabled={isOutOfStock || quantity >= MAX_QUANTITY}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <p className={styles.inStock}>{t("inStock")}</p>
                          </div>
                        </>
                      ) : (
                        <p className={styles.notInStock}>{t("outOfStock")}</p>
                      )}
                    </div>

                    <div className={styles.buttonGroup}>
                      <button
                        className={styles.addToCartButton}
                        disabled={cartedProducts.some((p) => p.id === product.id)}
                        onClick={handleAddToCart}
                      >
                        {cartedProducts.some((p) => p.id === product.id)
                          ? t("alreadyInCart")
                          : t("addToCart")}
                      </button>
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
              >
                <p className={styles.descriptionTitle}>
                  {t("productDescription")}:{" "}
                </p>
                <p className={styles.description}>{product.description}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
