"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import LanguageChanger from "../LanguageChanger/LanguageChanger.tsx";

export default function Header() {
  const [isMoreOptionsVisible, setMoreOptionsVisible] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <>
      <header className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.wrapperleng}>
            <div className={styles.logo}>
              <Image
                src="/header/Logo.png"
                alt="Header Background"
                width={80}
                height={0}
                objectFit="cover"
                className={styles.imageMargin}
              />
              <h1 className={styles.logoText}>{t("underLogoText")}</h1>
            </div>
            <LanguageChanger />
          </div>

          <nav className={styles.burger}>
            <Link
              href="/"
              className={`${styles.burgerOptionsMain} ${
                pathname === "/" || pathname.match(/^\/(en|uk|pl)$/) ? styles.burgerOptionsMainActive : ""
              }`}
            >
              {t("main")}
            </Link>
            <h1 className={styles.burgerOptionsMainDecor}>|</h1>
            <Link
              href="/ourTeam"
              className={`${styles.burgerOptionsTeam} ${
                pathname.includes("/ourTeam")
                  ? styles.burgerOptionsTeamActive
                  : ""
              }`}
            >
              {t("ourTeam")}
            </Link>
            <h1 className={styles.burgerOptionsTeam}>|</h1>
            <Link
              href="/medicalTourism"
              className={`${styles.burgerOptionsMed} ${
                pathname.includes("/medicalTourism")
                  ? styles.burgerOptionsMedActive
                  : ""
              }`}
            >
              {t("medicalTourism")}
            </Link>
            <h1 className={styles.burgerOptionsMed}>|</h1>
            <Link
              href="/service"
              className={`${styles.burgerOptionsService} ${
                pathname.includes("/service")
                  ? styles.burgerOptionsServiceActive
                  : ""
              }`}
            >
              {t("services")}
            </Link>
            <h1 className={styles.burgerOptionsService}>|</h1>
            <button
              className={styles.burgerOptionsMore}
              onClick={() => setMoreOptionsVisible(!isMoreOptionsVisible)}
            >
              {t("more")}
              <Image
                alt="Open more"
                src="/header/arrow.png"
                width={10}
                height={0}
                objectFit="cover"
              />
            </button>
          </nav>

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
            <div style={{ fontSize: "9px", display: "inline-block" }}>
            {t("address")}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`${styles.overlay} ${
          isMoreOptionsVisible ? styles.overlayVisible : ""
        }`}
        onClick={() => setMoreOptionsVisible(false)}
      ></div>
      <div
        className={`${styles.moreOptions} ${
          isMoreOptionsVisible ? styles.moreOptionsVisible : ""
        }`}
      >
        <div className={styles.moreOptionsContainer}>
          <Link
            href="/shop"
            onClick={() => setMoreOptionsVisible((prev) => !prev)}
            className={styles.optionShop}
          >
            {t("shop")}
          </Link>
          <Link
            href="/policy"
            onClick={() => setMoreOptionsVisible((prev) => !prev)}
            className={styles.optionAbout}
          >
            {t("policy")}
          </Link>
          <Link
            href="/"
            onClick={() => setMoreOptionsVisible((prev) => !prev)}
            className={styles.optionMain}
          >
            {t("main")} 
          </Link>
          <Link
            href="/ourTeam"
            onClick={() => setMoreOptionsVisible((prev) => !prev)}
            className={styles.optionTeam}
          >
            {t("ourTeam")}  
          </Link>
          <Link
            href="/medicalTourism"
            onClick={() => setMoreOptionsVisible((prev) => !prev)}
            className={styles.optionMed}
          >
            {t("medicalTourism")}   
          </Link>
          <Link
            href="/service"
            onClick={() => setMoreOptionsVisible((prev) => !prev)}
            className={styles.optionService}
          >
            {t("services")}
          </Link>
        </div>
      </div>
    </>
  );
}

{
  /* <h1 className={styles.logoText}>Інноваційна клініка стоматології та косметології</h1> */
}
