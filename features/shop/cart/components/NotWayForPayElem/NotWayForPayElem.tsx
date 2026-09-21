"use client";

import styles from "./NotWayForPayElem.module.css";
import { useRouter } from "next/navigation";
import { OrderData } from "../../types";
import { useOrderSubmit } from "../../hooks/useOrderSubmit";
import { useTranslation } from "react-i18next";

export default function NotWayForPayElem(orderData: OrderData) {
  const { t } = useTranslation(["cartPage", "WayForPay"]);
  const router = useRouter();
  const { submit, loading, errorMessage, setErrorMessage } = useOrderSubmit("/api/noPayment", t);

  const handleSubmit = async () => {
    const result = await submit(orderData);

    if (result) {
      router.push("/shop/successnc");
      localStorage.removeItem("cartedProducts");
    } else if (!errorMessage) {
      setErrorMessage(t('WayForPay:orderError'));
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`${styles.payButton} ${loading ? styles.loading : ""}`}
      >
        {loading ? t('WayForPay:loading') : t('WayForPay:text')}
      </button>
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
}
