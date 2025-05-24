import styles from "./BannerShopPage.module.css";
import Image from "next/image";

export default function BannerShopPage() {
  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <Image
          src="/header/Logo.png"
          alt="Company Logo"
          width={150}
          height={150}
        />
      </div>
      <div className={styles.textWrapper}>
        <h2 className={`${styles.mainText} ${styles.desktopText}`}>
          Купуй. Доглядай. Посміхайся
        </h2>
      </div>
    </div>
  );
}
