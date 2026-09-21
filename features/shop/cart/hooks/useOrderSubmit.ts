import { useState } from "react";
import { validateForm } from "../utils/validateForm";
import { OrderData } from "../types";
import { TFunction } from "i18next";

export function useOrderSubmit(endpoint: "/api/payment" | "/api/noPayment", t: TFunction<"cartPage">) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async (order: OrderData): Promise<{ invoiceUrl?: string; message?: string } | null> => {
    const validationError = validateForm(order, t);
    if (validationError) {
      setErrorMessage(validationError);
      return null;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: order.totalPrice,
          productName: order.items.map((i) => i.name),
          productCount: order.items.map((i) => i.count),
          productPrice: order.items.map((i) => i.price),
          productId: order.items.map((i) => i.id),
          clientEmail: order.email,
          customerName: `${order.lastName} ${order.firstName} ${order.middleName}`,
          phone: order.phone,
          paymentType: order.paymentType,
          comment: order.comment,
          deliveryInfo: {
            deliveryType: order.deliveryType,
            oblastName: order.oblastName,
            city: order.selectedCity?.label,
            warehouse: order.selectedWarehouse?.label,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.message ?? null);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Order submit error:", err);
      setErrorMessage(err instanceof Error ? err.message : null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, errorMessage, setErrorMessage };
}