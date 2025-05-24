import ShopNav from "@/components/shopNav/ShopNav";
import React from "react";
import styles from "./page.module.css";

export default function SuccessPage() {
  return (
    <div className="w-full">
      <ShopNav />
      <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.mainText}>Ви створили замовлення!</h1>
          <>
            <p className={styles.thankText}>
              Дякуємо! Ваше замовлення прийнято.
            </p>
          </>
        <p className={styles.alertText}>
          Очікуйте лист на електронну пошту з підтвердженням.
        </p>
      </div>
    </div>
    </div>
  );
}