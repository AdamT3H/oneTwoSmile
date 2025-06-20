"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";

interface Order {
  id: number;
  order_reference: string;
  status: string;
  customer_name: string;
}

export default function ClientSuccess() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [order, setOrder] = useState<Order | null>(null);
  const { t } = useTranslation("");

  const clearCart = () => {
    localStorage.removeItem("cartedProducts");
  };

  useEffect(() => {
    if (!ref) return;

    supabase
      .from("orders")
      .select("*")
      .eq("order_reference", ref)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Помилка отримання замовлення:", error);
          return;
        }
        setOrder(data);

        if (data?.status === "paid") {
          clearCart();
        }
      });

    const subscription = supabase
      .channel("public:orders")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `order_reference=eq.${ref}`,
        },
        (payload) => {
          const updated: Order = payload.new as Order;
          setOrder(updated);

          if (updated.status === "paid") {
            clearCart();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [ref]);

  if (!ref) return <p className={styles.alertText}>{t("no_ref")}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.mainText}>{t("payment_successful")}</h1>
        {order ? (
          <>
            <p className={styles.thankText}>
              {t("thank_you", { name: order.customer_name, id: order.id })}
            </p>
          </>
        ) : (
          <p>{t("loading_order")}</p>
        )}
        <p className={styles.alertText}>{t("check_email")}</p>
      </div>
    </div>
  );
}
