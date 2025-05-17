"use client";

import { useState } from "react";
import styles from "./WayForPayElem.module.css";
import { validateForm } from "./validateForm.ts";

interface ProductPay {
  name: string;
  count: number;
  price: number;
  id: number;
  inStock: number;
}

interface NoPaymentProps {
  totalPrice: number;
  items: ProductPay[];
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  comment: string;
  email: string;
  deliveryType: string;
  oblastName?: string | null;
  selectedCity?: { label: string } | null;
  selectedWarehouse?: { label: string } | null;
}

export default function NoPaymentElem({
  totalPrice,
  items,
  lastName,
  firstName,
  middleName,
  phone,
  comment,
  email,
  deliveryType,
  oblastName,
  selectedCity,
  selectedWarehouse,
}: NoPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
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
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/noPayment", {
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

      if (res.ok) {
        setSuccessMessage("Замовлення успішно оформлено. Очікуйте на дзвінок оператора.");
      } else {
        setErrorMessage(data?.message || "Не вдалося оформити замовлення.");
      }
    } catch (err) {
      console.error("NoPayment error:", err);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Сталася помилка при надсиланні замовлення.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`${styles.payButton} ${loading ? styles.loading : ""}`}
      >
        {loading ? "Очікуйте..." : "Оформити замовлення"}
      </button>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
    </div>
  );
}
