"use client";
import { useState, useEffect } from "react";
import styles from "./AllExperience.module.css";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import Image from "next/image";

type Service = {
  id: number;
  photo_before: string;
  photo_after: string;
  category_id: number;
  translations: {
    language_code: string;
    name: string;
    description: string;
  }[];
};

type Category = {
  id: number;
  experience_category_translation: {
    id: number;
    name: string;
    language_code: string;
  }[];
};

export default function AllExperience() {
  const [selected, setSelected] = useState<number>();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const lang = pathname.includes("/pl")
    ? "pl"
    : pathname.includes("/en")
    ? "en"
    : "ua";

  const getTranslated = (
    translations: Service["translations"],
    field: "name" | "description"
  ): string => {
    const tr = translations.find((t) => t.language_code === lang);
    return tr?.[field] || "Без перекладу";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: expData, error: expError } = await supabase
        .from("experience")
        .select("*");

      const { data: expTrData, error: expTrError } = await supabase
        .from("experience_translation")
        .select("*");

      const { data: categoryData, error: categoryError } = await supabase.from(
        "experience_category"
      ).select(`
          id,
          experience_category_translation (
            id,
            name,
            language_code
          )
        `);

      if (expError) console.error("Помилка experience:", expError);
      if (expTrError)
        console.error("Помилка experience_translation:", expTrError);
      if (categoryError) console.error("Помилка категорій:", categoryError);

      if (expData && expTrData) {
        const fullServices = expData.map((exp) => {
          const translations = expTrData.filter(
            (tr) => tr.experience_id === exp.id
          );

          return {
            id: exp.id,
            photo_before: exp.photo_before,
            photo_after: exp.photo_after,
            category_id: exp.category_id,
            translations,
          };
        });

        setServices(fullServices);
      }

      if (categoryData) {
        setCategories(categoryData);
        if (categoryData.length > 0) {
          setSelected(categoryData[0].id);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredServices = services.filter(
    (service) => service.category_id === selected
  );

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        {loading ? (
          <div className={styles.sceletonOptions}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.sceletonOption}></div>
            ))}
          </div>
        ) : (
          <>
            {categories.map((cat) => {
              const translation = cat.experience_category_translation.find(
                (tr) => tr.language_code === lang
              );

              return (
                <div
                  key={cat.id}
                  className={`${styles.option} ${
                    selected === cat.id ? styles.active : ""
                  }`}
                  onClick={() => setSelected(cat.id)}
                >
                  {translation?.name || "Без назви"}
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className={styles.servicesList}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}></div>
          ))
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.photoGroup}>
                <div className={styles.singlePhoto}>
                  <Image
                    src={service.photo_before}
                    alt="Before"
                    width={250}
                    height={200}
                  />
                  <span>             
                    {lang === "pl"
                      ? "PRZED"
                      : lang === "en"
                      ? "BEFORE"
                      : "ДО"
                    }
                  </span>
                </div>
                <div className={styles.singlePhoto}>
                  <Image
                    src={service.photo_after}
                    alt="After"
                    width={250}
                    height={200}
                  />
                  <span>
                  {lang === "pl"
                      ? "PO"
                      : lang === "en"
                      ? "AFTER"
                      : "ПІСЛЯ"
                    }
                  </span>
                </div>
              </div>

              <div className={styles.textsWrapper}>
                <h3 className={styles.serviceName}>
                  {getTranslated(service.translations, "name")}
                </h3>
                <p>{getTranslated(service.translations, "description")}</p>
              </div>
            </div>
          ))
        ) : (
          <p>
            {lang === "pl"
              ? "Brak usług w tej kategorii."
              : lang === "en"
              ? "No services in this category."
              : "Послуг у цій категорії немає."}
          </p>
        )}
      </div>
    </div>
  );
}
