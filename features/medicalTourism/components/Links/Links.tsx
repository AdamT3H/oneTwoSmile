"use client"

import Link from "next/link";
import styles from "./Links.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMedicalTourismList } from "../../services/getMedicalTourismList";
import { MedicalTourismListItem } from "../../types";

export default function Links() {
  const [medicalTourism, setMedicalTourism] = useState<MedicalTourismListItem[]>([]);

  const { t } = useTranslation("");
  const { i18n } = useTranslation();

  useEffect(() => {
    getMedicalTourismList(i18n.language).then(setMedicalTourism);
  }, [i18n.language]);

  return (
    <div className={styles.wrapper}>
      {medicalTourism.length > 0 ? (
        medicalTourism.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={item.photo}
                alt={item.name}
                fill
                className={styles.image}
              />
            </div>

            <div className={styles.content}>
              <div className={styles.titleBlock}>
                <div className={styles.titleBlockWrapper}>
                  <h3 className={styles.name}>{item.name}</h3>
                  <p className={styles.price}>${item.price}</p>
                  <p className={styles.duration}>{item.duration} {t("daysNights")}</p>
                </div>
                <p className={styles.description}>{item.description}</p>
              </div>

              <div className={styles.rightBlock}>
                <Link href={`/medicalTourism/${item.name}`} className={styles.button}>
                  {t("view")}
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>{t('no_available_packages')}</div>
      )}
    </div>
  );
}
