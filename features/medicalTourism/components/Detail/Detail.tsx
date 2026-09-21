"use client";

import Image from "next/image";
import styles from "./Detail.module.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { MedicalTourism, FaqItem } from "../../types";
import { getMedicalTourismByName } from "../../services/getMedicalTourismByName";

export default function Detail() {
  const [medicalTourism, setMedicalTourism] = useState<MedicalTourism>();
  const { name } = useParams() as { name: string };

  const { t } = useTranslation("");
  const { i18n } = useTranslation();

  const faqs = t("faq", { returnObjects: true }) as FaqItem[];

  useEffect(() => {
    getMedicalTourismByName(name, i18n.language).then((result) => {
        if (result) setMedicalTourism(result);
    });
  }, [i18n.language, name]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      {!medicalTourism ? (
        <p>{t("loading")}</p>
      ) : (
        <>
          <div className={styles.imageWrapper}>
            <Image
              src={medicalTourism.photo}
              alt={medicalTourism.name}
              fill
              className={styles.image}
            />
            <div className={styles.imageText}>
              <h1>{medicalTourism.name}</h1>
              <p>${medicalTourism.price}</p>
              <span className={styles.duration}>
                {medicalTourism.duration} {t("daysNights")}
              </span>
            </div>
          </div>

          <div className={styles.descriptionBlock}>
            <p className={styles.description}>{medicalTourism.description}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.subtitle}>{t("packageIncludes")}</h2>
            <p className={styles.explanation}>{t("packageExplanation")}</p>
            <ul className={styles.options}>
              {medicalTourism?.options.map((option, index) => (
                <li
                  key={option.id ?? index}
                  className={`${styles.optionItem} ${
                    openIndex === index ? styles.active : ""
                  }`}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <div className={styles.optionTitle}>{option.title}</div>

                  {openIndex === index && (
                    <div className={styles.optionDetails}>{option.details}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <button className={styles.button}>{t("contactButton")}</button>

          <div className={styles.faqSection}>
            <h2 className={styles.subtitle}>{t("faqTitle")}</h2>
            <ul className={styles.options}>
              {faqs.map((faq, index) => (
                <li
                  key={index}
                  className={`${styles.optionItem} ${
                    openFaqIndex === index ? styles.active : ""
                  }`}
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                >
                  <div className={styles.optionTitle}>{faq.question}</div>
                  {openFaqIndex === index && (
                    <div className={styles.optionDetails}>{faq.answer}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
