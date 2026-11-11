"use client";

import { useState } from "react";
import styles from "./AboutTeamForm.module.css";
import { useTranslation } from "react-i18next";

export default function AboutTeamForm() {
  const { t } = useTranslation("aboutTeamForm");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const contactMethods = [
    { value: "call", label: t("call") },
    { value: "telegram", label: "Telegram" },
    { value: "viber", label: "Viber" },
  ];

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
          contactMethod: data.get("contactMethod"),
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
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="tel"
            name="phone"
            placeholder={t("phone")}
            autoComplete="tel"
            required
          />
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder={t("name")}
            autoComplete="given-name"
          />
          <textarea
            className={styles.textarea}
            name="comment"
            placeholder={t("comment")}
            rows={3}
          />

          <fieldset className={styles.contactGroup}>
            <legend className={styles.contactLegend}>{t("contactLegend")}</legend>
            <div className={styles.contactOptions}>
              {contactMethods.map((m, i) => (
                <label key={m.value} className={styles.contactOption}>
                  <input
                    type="radio"
                    name="contactMethod"
                    value={m.value}
                    defaultChecked={i === 0}
                    className={styles.contactRadio}
                  />
                  <span className={styles.contactPill}>{m.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button className={styles.button} type="submit" disabled={status === "loading"}>
            {status === "loading" ? t("loading") : t("submit")}
          </button>


          {status === "success" && <p>{t("success")}</p>}
          {status === "error" && <p>{t("error")}</p>}
        </form>
      </section>
    </div>
  );
}