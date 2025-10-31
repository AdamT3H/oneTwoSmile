"use client";
import { useState, useEffect } from "react";
import styles from "./AllServices.module.css";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import Image from "next/image";

// type Service = {
//   id: number;
//   title: string;
//   title_ENG: string;
//   title_PL: string;
//   description: string;
//   description_ENG: string;
//   description_PL: string;
//   // duration: string;
//   price: number;
//   price_from: number;
//   price_to: number;
//   category_id: number;
//   photo_before: string;
//   photo_after: string;
// };

type Service = {
  id: number;
  title: string;
  title_ENG: string;
  title_PL: string;
  description: string;
  description_ENG: string;
  description_PL: string;
  price: number | null;
  price_from: number | null;
  price_to: number | null;
  price_euro: number | null;
  price_usdt: number | null;
  category_id: number;
  photo_before: string;
  photo_after: string;
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

  const getTranslatedText = (ua: string, eng: string, pl: string): string => {
    if (lang === "en") return eng;
    if (lang === "pl") return pl;
    return ua;
  };

  const getFormattedPrice = (service: Service): string => {
    const hasRange = service.price_from && service.price_to;
    const currency = "UAH";

    if (hasRange) {
      return lang === "pl"
        ? `Cena: od ${service.price_from} do ${service.price_to} ${currency}`
        : lang === "en"
        ? `Price: from ${service.price_from} to ${service.price_to} ${currency}`
        : `Ціна: від ${service.price_from} до ${service.price_to} грн`;
    }

    if (service.price) {
      return lang === "pl"
        ? `Cena: ${service.price} ${currency}`
        : lang === "en"
        ? `Price: ${service.price} ${currency}`
        : `Ціна: ${service.price} грн`;
    }

    if (service.price_euro) {
      return lang === "pl"
        ? `Cena: ${service.price_euro} EUR`
        : lang === "en"
        ? `Price: ${service.price_euro} EUR`
        : `Ціна: ${service.price_euro} євро`;
    }

    if (service.price_usdt) {
      return lang === "pl"
        ? `Cena: ${service.price_usdt} USDT`
        : lang === "en"
        ? `Price: ${service.price_usdt} USDT`
        : `Ціна: ${service.price_usdt} USDT`;
    }

    return lang === "pl"
      ? "Cena: brak"
      : lang === "en"
      ? "Price: not available"
      : "Ціна: не вказана";
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
              {lang === "pl" ? "Wszystkie" : lang === "en" ? "All" : "Усі"}
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
                {/* <span className={styles.duration}>
                  {lang === "pl"
                    ? `Czas trwania: ${service.duration} min`
                    : lang === "en"
                    ? `Duration: ${service.duration} min`
                    : `Тривалість: ${service.duration} хв`}
                </span> */}
                <span className={styles.price}>
                  {getFormattedPrice(service)}
                </span>
              </div>
              <p
                dangerouslySetInnerHTML={{
                  __html: expandedServices[service.id]
                    ? getTranslatedText(
                        service.description,
                        service.description_ENG,
                        service.description_PL
                      )
                    : `${getTranslatedText(
                        service.description,
                        service.description_ENG,
                        service.description_PL
                      ).slice(0, 150)}...`,
                }}
              ></p>
              {expandedServices[service.id] && (
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
                        : "ДО"}
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
                      {lang === "pl" ? "PO" : lang === "en" ? "AFTER" : "ПІСЛЯ"}
                    </span>
                  </div>
                </div>
              )}
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
