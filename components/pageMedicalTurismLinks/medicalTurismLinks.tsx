"use client"

import Link from "next/link";
import styles from "./medicalTurismLinks.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js";
import { useTranslation } from "react-i18next";

export interface MedicalTourism {
  id: number;
  name: string;
  price: number;
  duration: string;
  photo: string;
  name_url: string;
  description: string;
}

export default function MedicalTurismLinks() {
  const [medicalTourism, setMedicalTourism] = useState<MedicalTourism[]>([]);

  const { t } = useTranslation("");
  const { i18n } = useTranslation();

  useEffect(() => {
    interface MedicalTourismTranslation {
      name: string;
      description: string;
      language_code: string;
    }
  
    interface MedicalTourismRow extends MedicalTourism {
      medical_tourism_translations?: MedicalTourismTranslation[];
    }

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
          )
          `
        );
  
      if (error) {
        console.error(error);
        return;
      }
  
    const results = (data as MedicalTourismRow[]).map((item) => {
      const translation = item.medical_tourism_translations?.find(
        (tr) => tr.language_code === currentLang
      );
      
        return {
          id: item.id,
          name: translation?.name || item.name,
          description: translation?.description || item.description,
          duration: item.duration,
          photo: item.photo,
          name_url: item.name_url,
          price: item.price,
        };
      });
  
      setMedicalTourism(results);
    };
  
    fetchMT();
  }, [i18n.language]);


  // const data = [
  //   {
  //     id: 1,
  //     name: "Premium",
  //     price: "1200",
  //     duration: "3 дні / 2 ночі",
  //     photo: "https://kamon.ua/b/l9tz49cmyx-one-two-smile-innovacijna-klinika-stomatologiyi-ta-kosmetologiyi/ogimage",
  //     description:
  //       "Повний VIP-пакет для іноземних пацієнтів, які цінують комфорт, приватність і персоналізоване лікування з високим рівнем сервісу.",
  //     optionsIncluded: [
  //       { title: "Індивідуальна консультація зі стоматологом", details: "Персональний огляд та план лікування." },
  //       { title: "3D-сканування зубів і діагностика", details: "Сучасне сканування для точного планування." },
  //       { title: "Повне естетичне відбілювання зубів", details: "Сертифіковані засоби та професійний результат." },
  //       { title: "Розміщення в 4-зірковому готелі (3 ночі)", details: "Зручності у центрі міста." },
  //       { title: "Трансфер з/до аеропорту", details: "Комфортний індивідуальний трансфер." },
  //       { title: "Супровід перекладача (англ/польськ)", details: "Забезпечення комунікації." },
  //       { title: "Комплект засобів гігієни після лікування", details: "Усе для догляду після процедури." },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Standard",
  //     price: "700",
  //     duration: "2 дні / 2 ночі",
  //     photo: "https://kamon.ua/b/l9tz49cmyx-one-two-smile-innovacijna-klinika-stomatologiyi-ta-kosmetologiyi/ogimage",
  //     description:
  //       "Стандартний пакет для пацієнтів, що приїжджають для лікування та профілактики. Оптимальний баланс ціни та якості.",
  //     optionsIncluded: [
  //       { title: "Консультація зі стоматологом", details: "Оцінка стану та план дій." },
  //       { title: "Огляд та базова діагностика", details: "Базова оцінка і рентген (якщо потрібно)." },
  //       { title: "Професійна чистка зубів", details: "Ультразвук + полірування." },
  //       { title: "Розміщення в готелі (2 ночі)", details: "Комфортне проживання недалеко від клініки." },
  //       { title: "Трансфер з/до аеропорту", details: "Зустріч та доставка до місця." },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: "Basic",
  //     price: "400",
  //     duration: "1 день",
  //     photo: "https://kamon.ua/b/l9tz49cmyx-one-two-smile-innovacijna-klinika-stomatologiyi-ta-kosmetologiyi/ogimage",
  //     description:
  //       "Бюджетний пакет для тих, хто приїжджає лише на короткочасну процедуру без додаткових послуг.",
  //     optionsIncluded: [
  //       { title: "Стоматологічна консультація", details: "Швидке обстеження та рекомендації." },
  //       { title: "Огляд і рекомендації щодо лікування", details: "Попередній план лікування." },
  //       { title: "Одна базова процедура", details: "Наприклад, пломба або чистка." },
  //       { title: "Допомога з пошуком житла", details: "Рекомендації поруч із клінікою." },
  //     ],
  //   },
  // ];

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
                <Link href={`/medicalTourism/${item.name_url}`} className={styles.button}>
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
