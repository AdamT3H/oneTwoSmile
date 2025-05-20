"use client";
import { useState, useEffect } from "react";
import styles from "./AllServices.module.css";
import { supabase } from "@/lib/supabase";

type Service = {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: string;
  category_id: number;
  categories?: {
    name: string;
  };
};

export default function AllServices() {
  const [selected, setSelected] = useState<number | "Усі">("Усі");
  const [expandedServices, setExpandedServices] = useState<
    Record<number, boolean>
  >({});
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: serviceData, error: serviceError } = await supabase
        .from("all_services")
        .select("*, categories:service_categories(name)");

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
    selected === "Усі"
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
                selected === "Усі" ? styles.active : ""
              }`}
              onClick={() => setSelected("Усі")}
            >
              Усі
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`${styles.option} ${
                  selected === cat.id ? styles.active : ""
                }`}
                onClick={() => setSelected(cat.id)}
              >
                {cat.name}
              </div>
            ))}
          </>
        )}
      </div>

      <div className={styles.servicesList}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>

            </div>
          ))
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <h3 className={styles.serviceName}>{service.title}</h3>
              <div className={styles.details}>
                <span className={styles.duration}>
                  Тривалість: {service.duration} хв
                </span>
                <span className={styles.price}>Ціна: {service.price} грн</span>
              </div>
              <p>
                {expandedServices[service.id]
                  ? service.description
                  : `${service.description.slice(0, 150)}...`}
              </p>
              <button
                className={styles.toggleButton}
                onClick={() => toggleExpand(service.id)}
              >
                {expandedServices[service.id] ? "Згорнути" : "Читати більше"}
              </button>
            </div>
          ))
        ) : (
          <p>Послуг у цій категорії немає.</p>
        )}
      </div>
    </div>
  );
}
