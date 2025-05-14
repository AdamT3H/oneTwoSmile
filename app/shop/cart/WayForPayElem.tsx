"use client";

import { useState } from "react";
import styles from "./WayForPayElem.module.css";
import { validateForm } from "./validateForm.ts";

interface ProductPay {
  name: string;
  count: number;
  price: number;
}

interface WayForPayProps {
  totalPrice: number;
  items: ProductPay[];
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  email: string;
  deliveryType: string;
  oblastRef?: string | null;
  selectedCity?: { label: string } | null;
}

export default function WayForPayElem({
  totalPrice,
  items,
  lastName,
  firstName,
  middleName,
  phone,
  email,
  deliveryType,
  oblastRef,
  selectedCity,
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
      oblastRef,
      selectedCity,
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
          clientEmail: email,
          customerName: `${lastName} ${firstName} ${middleName}`,
          phone,
          deliveryInfo: {
            deliveryType,
            oblastRef,
            city: selectedCity?.label,
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
      setErrorMessage("Сталася помилка під час обробки платежу.");
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
        {loading ? "Очікуйте..." : "Оформити замовлення"}
      </button>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}
