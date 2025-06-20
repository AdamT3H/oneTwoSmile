import React from "react";
import styles from "./page.module.css";
import initTranslations from "@/app/i18n";

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await params;

  const { t } = await initTranslations(locale, ["successnc"]);
  
  return (
    <div className="w-full">
      <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.mainText}>{t('order_created')}</h1>
          <>
            <p className={styles.thankText}>
              {t('thank_you_simple')}
            </p>
          </>
        <p className={styles.alertText}>
          {t('check_email')}
        </p>
      </div>
    </div>
    </div>
  );
}