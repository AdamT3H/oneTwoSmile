"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";

export interface TourismOption {
  id: number;
  title: string;
  details: string;
}

export interface MedicalTourism {
  id: number;
  name: string;
  price: number;
  duration: string;
  photo: string;
  description: string;
  options: TourismOption[];
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function MedicalTourismLinkUser() {
  const [medicalTourism, setMedicalTourism] = useState<MedicalTourism>();
  const { name } = useParams() as { name: string };

  const { t } = useTranslation("");
  const { i18n } = useTranslation();

  const faqs = t("faq", { returnObjects: true }) as FaqItem[];

  useEffect(() => {
    const fetchMT = async () => {
      const currentLang = i18n.language;

      const { data, error } = await supabase
        .from("medical_turism")
        .select(
          `
          *,
          medical_tourism_translations:medical_tourism_translations_tourism_id_fkey (
            name,
            description,
            language_code
          ),
          medical_tourism_options:medical_tourism_options_medical_id_fkey (
            id,
            medical_tourism_option_translations:medical_tourism_option_translations_option_id_fkey (
              title,
              details,
              language_code
            )
          )
        `
        )
        .eq("name_url", name) // шукаємо потрібний пакет
        .single();

      if (error) {
        console.error(error);
        return;
      }

      const tr = data.medical_tourism_translations?.find(
        (t: any) => t.language_code === currentLang
      );

      const options: TourismOption[] =
        data.medical_tourism_options?.map((opt: any) => {
          const trOpt =
            opt.medical_tourism_option_translations?.find(
              (t: any) => t.language_code === currentLang
            ) ??
            opt.medical_tourism_option_translations?.find(
              (t: any) => t.language_code === "en"
            );

          return {
            id: opt.id,
            title: trOpt?.title ?? "No title",
            details: trOpt?.details ?? "",
          };
        }) ?? [];

      setMedicalTourism({
        id: data.id,
        name: tr?.name ?? data.name,
        description: tr?.description ?? data.description,
        duration: data.duration,
        photo: data.photo,
        price: data.price,
        options,
      });
    };

    fetchMT();
  }, [i18n.language]);

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
