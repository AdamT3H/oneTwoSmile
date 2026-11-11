"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./ShopNav.module.css";
import Link from "next/link";
import Image from "next/image";
import LikeDrawer from "@/features/shop/cart/components/likeDrawer/LikeDrawer";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Resource } from "i18next";
import CartDrawer from "../../cart/components/cartDrawer/CartDrawer";
import { useLikedProducts } from "../../hooks/useLikedProducts";
import { useCartedProducts } from "../../hooks/useCartedProducts";

export default function ShopNav({
  locale,
  cartResources,
  likeResources,
}: {
  locale: string;
  cartResources: Resource;
  likeResources: Resource;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLikeOpen, setIsLikeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {likedProducts} = useLikedProducts();
  const {cartedProducts} = useCartedProducts();
  const navRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const router = useRouter();
  const { t } = useTranslation();

  const likeProductsCount = likedProducts.length;
  const cartedProductsCount = cartedProducts.reduce((total, product) => total + product.quantity, 0);

  useEffect(() => {
    let ticking = false;
  
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
  
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const diff = y - lastScrollY.current;
  
        if (y <= 80) {
          setIsNavHidden(false);
          lastScrollY.current = y;
        } else if (Math.abs(diff) > 8) {
          setIsNavHidden(diff > 0);
          lastScrollY.current = y;
        }
  
        ticking = false;
      });
    };
  
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`${styles.navWrapper} ${isNavHidden ? styles.navHidden : ""}`}>
        <div className={styles.container}>
          <div className={styles.topRow}>
            <div className={styles.left}>
              <Link href="/shop" className={styles.shopLinkButton}>
                <Image
                  src="/shop/homeButton.png"
                  alt="Go back to shoping main page"
                  className={styles.shopLinkButtonImg}
                  width={32}
                  height={32}
                  objectFit="cover"
                />
              </Link>
            </div>

            <div className={styles.right}>
              <div className={styles.likesAndCartContainer}>
                <button
                  className={styles.iconButton}
                  onClick={() => setIsLikeOpen(true)}
                >
                  <Image
                    src="/shop/like.png"
                    alt="Liked products"
                    width={24}
                    height={24}
                  />
                  { likeProductsCount > 0 && (
                    <div key={likeProductsCount} className={styles.countNumberOfLikes}>
                      {likeProductsCount > 99 ? "99+" : likeProductsCount}
                    </div>
                  )}
                  
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => setIsCartOpen(true)}
                >
                  <Image
                    src="/shop/cart.png"
                    alt="Shopping cart"
                    width={24}
                    height={24}
                  />
                  { cartedProductsCount > 0 && (
                    <div key={cartedProductsCount} className={styles.countNumberOfCarts}>
                      {cartedProductsCount > 99 ? "99+" : cartedProductsCount}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className={styles.bottomRow}>
            <div className={styles.center}>
              <div className={styles.searchInShopList}>
                <input
                  className={styles.searchInShopListInput}
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button
                  className={styles.searchInShopListLoopButton}
                  onClick={() => {
                    if (searchQuery.trim()) {
                      router.push(
                        `/shop/search?query=${encodeURIComponent(searchQuery)}`
                      );
                    }
                  }}
                >
                  <Image
                    src="/shop/search.png"
                    alt="Search button"
                    width={18}
                    height={18}
                    className={styles.searchInShopListLoopImg}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <CartDrawer
        locale={locale}
        resources={cartResources}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      <LikeDrawer
        locale={locale}
        resources={likeResources}
        isOpen={isLikeOpen}
        onClose={() => setIsLikeOpen(false)}
      />
    </>
  );
}
