"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ShopNav from "@/app/components/shopNav/ShopNav";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

// Тип для замовлення
interface Order {
  id: number;
  order_reference: string;
  status: string;
  customer_name: string;
  // ...інші поля, які вам потрібні
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [order, setOrder] = useState<Order | null>(null);

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
        { event: "UPDATE", schema: "public", table: "orders", filter: `order_reference=eq.${ref}` },
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

  return (
    <div className="w-full">
      <ShopNav />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.mainText}>Оплата успішна!</h1>
          {order ? (
            <>
              <p className={styles.thankText}>
                Дякуємо, {order.customer_name}! Ваше замовлення #{order.id} прийнято.
              </p>
              <p className={styles.alertText}>
                Статус: <strong>{order.status}</strong>
              </p>
            </>
          ) : (
            <p>Завантажуємо інформацію про замовлення…</p>
          )}
          <p className={styles.alertText}>
            Очікуйте лист на електронну пошту з підтвердженням.
          </p>
        </div>
      </div>
    </div>
  );
}
