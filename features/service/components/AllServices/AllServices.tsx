"use client";

import { useState, useEffect } from "react";
import styles from "./AllServices.module.css";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Service, Category } from "../../types";
import { getServicesAndCategories } from "../../services/getServicesAndCategories";

const ALL = "all";

export default function AllServices() {
  const [selected, setSelected] = useState<number | typeof ALL>(ALL);
  const [expandedServices, setExpandedServices] = useState<Record<number, boolean>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation("service");
  const lang = i18n.language;

  const getTranslatedText = (ua: string, eng: string, pl: string): string => {
    if (lang === "en") return eng;
    if (lang === "pl") return pl;
    return ua;
  };

  const getFormattedPrice = (service: Service): string => {
    if (service.price_from && service.price_to) {
      return t("priceRange", { from: service.price_from, to: service.price_to });
    }
    if (service.price) return t("priceUah", { price: service.price });
    if (service.price_euro) return t("priceEuro", { price: service.price_euro });
    if (service.price_usdt) return t("priceUsdt", { price: service.price_usdt });
    return t("priceNotAvailable");
  };

  useEffect(() => {
    getServicesAndCategories().then((result) => {
      setServices(result.services);
      setCategories(result.categories);
      setLoading(false);
    });
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
              {t("all")}
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
                    <span>{t("before")}</span>
                  </div>
                  <div className={styles.singlePhoto}>
                    <Image
                      src={service.photo_after}
                      alt="After"
                      width={250}
                      height={200}
                    />
                    <span>{t("after")}</span>
                  </div>
                </div>
              )}
              <button
                className={styles.toggleButton}
                onClick={() => toggleExpand(service.id)}
              >
                {expandedServices[service.id] ? t("collapse") : t("readMore")}
              </button>
            </div>
          ))
        ) : (
          <p>{t("noServicesInCategory")}</p>
        )}
      </div>
    </div>
  );
}
