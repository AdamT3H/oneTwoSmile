"use client";
import { useState, useEffect } from "react";
import styles from "./AllServices.module.css";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

type Service = {
  id: number;
  title: string;
  title_ENG: string;
  title_PL: string;
  description: string;
  description_ENG: string;
  description_PL: string;
  duration: string;
  price: string;
  category_id: number;
};

type Category = {
  id: number;
  name: string;
  name_ENG: string;
  name_PL: string;
};

const ALL = "all";

export default function AllServices() {
  const [selected, setSelected] = useState<number | typeof ALL>(ALL);
  const [expandedServices, setExpandedServices] = useState<
    Record<number, boolean>
  >({});
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const lang = pathname.includes("/pl")
    ? "pl"
    : pathname.includes("/en")
    ? "en"
    : "ua";

  const getTranslatedText = (
    ua: string,
    eng: string,
    pl: string
  ): string => {
    if (lang === "en") return eng;
    if (lang === "pl") return pl;
    return ua;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: serviceData, error: serviceError } = await supabase
        .from("all_services")
        .select("*");

      const { data: categoryData, error: categoryError } = await supabase
        .from("service_categories")
        .select("*");

      if (serviceError) {
        console.error("Помилка при завантаженні послуг:", serviceError);
      } else {
        setServices(serviceData || []);
      }

      if (categoryError) {
        console.error("Помилка при завантаженні категорій:", categoryError);
      } else {
        setCategories(categoryData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedServices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredServices =
    selected === ALL
      ? services
      : services.filter((service) => service.category_id === selected);

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
            <div
              className={`${styles.option} ${
                selected === ALL ? styles.active : ""
              }`}
              onClick={() => setSelected(ALL)}
            >
              {lang === "pl"
                ? "Wszystkie"
                : lang === "en"
                ? "All"
                : "Усі"}
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`${styles.option} ${
                  selected === cat.id ? styles.active : ""
                }`}
                onClick={() => setSelected(cat.id)}
              >
                {getTranslatedText(cat.name, cat.name_ENG, cat.name_PL)}
              </div>
            ))}
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
              <h3 className={styles.serviceName}>
                {getTranslatedText(
                  service.title,
                  service.title_ENG,
                  service.title_PL
                )}
              </h3>
              <div className={styles.details}>
                <span className={styles.duration}>
                  {lang === "pl"
                    ? `Czas trwania: ${service.duration} min`
                    : lang === "en"
                    ? `Duration: ${service.duration} min`
                    : `Тривалість: ${service.duration} хв`}
                </span>
                <span className={styles.price}>
                  {lang === "pl"
                    ? `Cena: ${service.price} UAH`
                    : lang === "en"
                    ? `Price: ${service.price} UAH`
                    : `Ціна: ${service.price} грн`}
                </span>
              </div>
              <p>
                {expandedServices[service.id]
                  ? getTranslatedText(
                      service.description,
                      service.description_ENG,
                      service.description_PL
                    )
                  : `${getTranslatedText(
                      service.description,
                      service.description_ENG,
                      service.description_PL
                    ).slice(0, 150)}...`}
              </p>
              <button
                className={styles.toggleButton}
                onClick={() => toggleExpand(service.id)}
              >
                {expandedServices[service.id]
                  ? lang === "pl"
                    ? "Zwiń"
                    : lang === "en"
                    ? "Collapse"
                    : "Згорнути"
                  : lang === "pl"
                  ? "Czytaj więcej"
                  : lang === "en"
                  ? "Read more"
                  : "Читати більше"}
              </button>
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
