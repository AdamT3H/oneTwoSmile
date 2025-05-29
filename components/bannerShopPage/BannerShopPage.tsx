import styles from "./BannerShopPage.module.css";
import Image from "next/image";
import initTranslations from "../../app/i18n";

export default async function BannerShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { t } = await initTranslations(locale, [
    "banerOnShop",
  ]);
  
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
          {t('banerOnShop:text')}
        </h2>
      </div>
    </div>
  );
}
