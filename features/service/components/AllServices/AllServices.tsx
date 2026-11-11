"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./AllServices.module.css";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Service, Category } from "../../types";
import getCategories from "../../services/getCategories";
import getServices from "../../services/getServices";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import EasyWeekIntegration from "@/components/EasyWeekIntegration";

export default function AllServices() {
  const [expandedServices, setExpandedServices] = useState<Record<number, boolean>>({});
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [servicesloading, setServicesLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categoryParam = searchParams.get("category");
  const parsed = categoryParam ? Number(categoryParam) : null;
  const selected = parsed !== null && !Number.isNaN(parsed) ? parsed : null;

  const { t, i18n } = useTranslation("service");
  const lang = i18n.language;

  const updateArrows = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  const scrollList = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const selectCategory = (id: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === null) params.delete("category");
    else params.set("category", String(id));

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

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
    getCategories()
      .then((res) => setCategories(res.categories))
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setCategoriesLoading(false))
  }, []);

  useEffect(() => {
    let cancelled = false;
    setServicesLoading(true);

    getServices(selected)
      .then((res) => {
        if (!cancelled) {
          setServices(res.services);
        }
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => {
        if (!cancelled) {
          setServicesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selected]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, categories, categoriesLoading]);

  const toggleExpand = (id: number) => {
    setExpandedServices((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.container}>
      <EasyWeekIntegration services={services} />

      <div className={styles.optionsWrapper}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => scrollList(-1)}
          disabled={!canLeft}
          aria-label="Прокрутити вліво"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.options} ref={listRef}>
          {categoriesLoading ? (
            <div className={styles.sceletonOptions}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.sceletonOption}></div>
              ))}
            </div>
          ) : (
            <>
              <div
                className={`${styles.option} ${
                  selected === null ? styles.active : ""
                }`}
                onClick={() => selectCategory(null)}
              >
                {t("all")}
              </div>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`${styles.option} ${
                    selected === cat.id ? styles.active : ""
                  }`}
                  onClick={() => selectCategory(cat.id)}
                >
                  {getTranslatedText(cat.name, cat.name_ENG, cat.name_PL)}
                </div>
              ))}
            </>
          )}
        </div>

        <button
          type="button"
          className={styles.arrow}
          onClick={() => scrollList(1)}
          disabled={!canRight}
          aria-label="Прокрутити вправо"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.servicesList}>
        {servicesloading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}></div>
          ))
        ) : services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.detailsWrapper}>
                <div className={styles.details}>
                  <h3 className={styles.serviceName}>
                    {getTranslatedText(
                      service.title,
                      service.title_ENG,
                      service.title_PL
                    )}
                  </h3>

                  <span className={styles.price}>
                    {getFormattedPrice(service)}
                  </span>
                </div>
                <button className={`${styles.bookButton} service-book-${service.id}`}>
                  {t("book")}
                </button>
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