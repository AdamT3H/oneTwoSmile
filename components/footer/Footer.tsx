"use client";

import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.meinText}>
        <h1>{t("footer:slogan")}</h1>
      </div>

      <div className={styles.workingDaysAndMap}>
        <div className={styles.workingDays}>
          <h1>{t("footer:workingHoursTitle")}</h1>
          <h2>{t("footer:monFri")}</h2>
          <h2>{t("footer:sat")}</h2>
        </div>

        <div className={styles.infoAndMyDiv}>
          <div className={styles.info}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "5px",
              }}
            >
              <Image
                src="/header/Phone.png"
                alt="Header Background"
                width={13}
                height={0}
                objectFit="cover"
              />
              <div>+38 097 477 47 49</div>
            </div>
            <div style={{ fontSize: "9px", textAlign: "center" }}>
              {t("footer:address")}
            </div>
          </div>

          <div className={styles.myDiv}>
            <Image
              className={`${styles.arrowPngImageStart} ${styles.animate}`}
              src="/footer/arrow-png-image-start.png"
              width={55}
              height={30}
              alt="Way to clinic"
            />
            <Link
              href="https://maps.app.goo.gl/LZ2czQejsunVQqNA8"
              className={styles.mapText}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("footer:route")}
            </Link>
            <Image
              className={`${styles.arrowPngImageEnd} ${styles.animate}`}
              src="/footer/arrow-png-image-end.png"
              width={55}
              height={30}
              alt="Way to clinic"
            />
          </div>
        </div>
      </div>

      <div className={styles.linksAndGmail}>
        <h2>one.two.smile.dentistry@gmail.com</h2>
        <div className={styles.links}>
          <Link href="/" className={styles.instagram}>
            <Image
              src="/main/instagramLogo.png"
              alt="Instagram Logo"
              width={20}
              height={20}
            />
          </Link>
          <Link href="/" className={styles.tiktok}>
            <Image
              src="/main/tiktok-logo-4501.png"
              alt="TikTok Logo"
              width={20}
              height={20}
            />
          </Link>
          <Link href="/" className={styles.facebook}>
            <Image
              src="/main/facebook-logo-108.png"
              alt="Facebook Logo"
              width={20}
              height={20}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
