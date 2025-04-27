"use client";
import { useState } from "react";
import styles from "./ShopNav.module.css";
import Link from "next/link";
import Image from "next/image";
import CartDrawer from "@/app/components/cartDrawer/CartDrawer.tsx";
import LikeDrawer from "@/app/components/likeDrawer/LikeDrawer.tsx";

export default function ShopNav() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLikeOpen, setIsLikeOpen] = useState(false);

  return (
    <>
      <nav className={styles.navWrapper}>
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
                <button className={styles.iconButton}
                 onClick={() => setIsLikeOpen(true)}>
                  <Image
                    src="/shop/like.png"
                    alt="Liked products"
                    width={24}
                    height={24}
                  />
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
                </button>
              </div>
            </div>
          </div>
          <div className={styles.bottomRow}>
            <div className={styles.center}>
              <div className={styles.searchInShopList}>
                <input
                  className={styles.searchInShopListInput}
                  placeholder="Search"
                />

                <button className={styles.searchInShopListLoopButton}>
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
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LikeDrawer isOpen={isLikeOpen} onClose={() => setIsLikeOpen(false)} />
    </>
  );
}
