'use client';

import { useState } from "react";
import styles from "./NotWayForPayElem.module.css";

export default function NotWayForPayElem() {
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        disabled={loading}
        className={`${styles.payButton} ${loading ? styles.loading : ''}`}
      >
        {loading ? "Очікуйте..." : "Оформити замовлення"}
      </button>
    </div>
  );
}
