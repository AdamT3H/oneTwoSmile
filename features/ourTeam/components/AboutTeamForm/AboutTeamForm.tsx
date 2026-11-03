"use client";

import { useState } from "react";
import styles from "./AboutTeamForm.module.css";

export default function AboutTeamForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("loading");

    try {
      const res = await fetch("/api/telegramHelpOurTeamFormToAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.get("phone"),
          name: data.get("name"),
          comment: data.get("comment"),
        })
      });

      if (!res.ok) throw new Error();
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className={styles.container}>
      <section className={styles.wrapper}>
        <div className={styles.text}>
          <h2 className={styles.title}>Не знаєте, до якого лікаря звернутися?</h2>
          <p className={styles.subtitle}>
            Залиште заявку — ми передзвонимо та допоможемо підібрати спеціаліста
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="tel"
            name="phone"
            placeholder="Номер телефону"
            autoComplete="tel"
            required
          />
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Ім'я (необов'язково)"
            autoComplete="given-name"
          />
          <textarea
            className={styles.textarea}
            name="comment"
            placeholder="Коментар (необов'язково)"
            rows={3}
          />
          <button className={styles.button} type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Надсилаємо..." : "Надіслати заявку"}
          </button>
          {status === "success" && <p>Дякуємо! Ми скоро передзвонимо.</p>}
          {status === "error" && <p>Не вдалося надіслати. Спробуйте ще раз.</p>}
        </form>
      </section>
    </div>
  );
}