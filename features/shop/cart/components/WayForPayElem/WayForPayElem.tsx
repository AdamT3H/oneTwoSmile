"use client";

import styles from "./WayForPayElem.module.css";
import { OrderData } from "../../types";
import { useOrderSubmit } from "../../hooks/useOrderSubmit";
import { useTranslation } from "react-i18next";

export default function WayForPayElem(orderData: OrderData) {
  const { t } = useTranslation(["cartPage", "WayForPay"]);
  const { submit, loading, errorMessage, setErrorMessage } = useOrderSubmit("/api/payment", t);

  const handlePay = async () => {
    const result = await submit(orderData);

    if (result?.invoiceUrl) {
      window.location.href = result.invoiceUrl;
    } else if (result && !result.invoiceUrl) {
      setErrorMessage(t('WayForPay:payment_link_error'));
    }
  };
  
  return (
    <div className={styles.wrapper}>
      <button
        onClick={handlePay}
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
