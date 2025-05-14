import ShopNav from "@/app/components/shopNav/ShopNav";
import styles from "./page.module.css";

export default function SuccessPage() {
  return (
    <div className="w-full">
      <ShopNav />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.mainText}>Оплата успішна!</h1>
          <p className={styles.thankText}>Дякуємо за ваше замовлення!</p>
          <p className={styles.alertText}>
            Очікуйте лист на елетронну пошту з рахунком та підтвердженням вашого
            замовлення
          </p>
        </div>
      </div>
    </div>
  );
}
