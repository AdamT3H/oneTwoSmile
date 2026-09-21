"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./Success.module.css";
import { useTranslation } from "react-i18next";
import { useOrderStatus } from "../../hooks/useOrderStatus";

export default function ClientSuccess() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const order = useOrderStatus(ref);
  const { t } = useTranslation("");

  useEffect(() => {
    if (order?.status === "paid") {
      localStorage.removeItem("cartedProducts");
      window.dispatchEvent(new Event("storage"));
    }
  }, [order?.status]);

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
