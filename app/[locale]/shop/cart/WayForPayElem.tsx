"use client";

import { useState } from "react";
import styles from "./WayForPayElem.module.css";
import { validateForm } from "./validateForm.ts";
import { TFunction } from "i18next";

interface ProductPay {
  name: string;
  count: number;
  price: number;
  id: number;
  inStock: number;
}

interface WayForPayProps {
  totalPrice: number;
  items: ProductPay[];
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  paymentType: string;
  comment: string;
  email: string;
  deliveryType: string;
  oblastName?: string | null;
  selectedCity?: { label: string } | null;
  selectedWarehouse?: { label: string } | null;
  t: TFunction<"WayForPay">;
}

export default function WayForPayElem({
  totalPrice,
  items,
  lastName,
  firstName,
  middleName,
  phone,
  paymentType,
  comment,
  email,
  deliveryType,
  oblastName,
  selectedCity,
  selectedWarehouse,
  t,
}: WayForPayProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePay = async () => {
    const error = validateForm({
      lastName,
      firstName,
      middleName,
      phone,
      email,
      deliveryType,
      oblastName,
      selectedCity,
      selectedWarehouse,
      items,
    });
  
    if (error) {
      setErrorMessage(error);
      return;
    }
  
    setErrorMessage(null);
    setLoading(true);
  
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          productName: items.map((i) => i.name),
          productCount: items.map((i) => i.count),
          productPrice: items.map((i) => i.price),
          productId: items.map((i) => i.id),
          clientEmail: email,
          customerName: `${lastName} ${firstName} ${middleName}`,
          phone,
          paymentType,
          comment,
          deliveryInfo: {
            deliveryType,
            oblastName,
            city: selectedCity?.label,
            warehouse: selectedWarehouse?.label,
          },
        }),
      });
  
      const data = await res.json();
  
      if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl;
      } else {
        setErrorMessage("Не вдалося отримати посилання на оплату.");
      }
    } catch (err) {
      console.error("Payment error:", err);

      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Сталася помилка під час обробки платежу.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <button
        onClick={handlePay}
        disabled={loading}
        className={`${styles.payButton} ${loading ? styles.loading : ""}`}
      >
        {loading ? "Очікуйте..." : t('WayForPay:text')}
      </button>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}
