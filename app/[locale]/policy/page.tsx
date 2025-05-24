export const metadata = {
  title: "Політика конфіденційності | One Two Smile",
  description:
    "Дізнайтеся про нашу політику конфіденційності, обробку персональних даних та правила повернення товарів.",
  keywords: [
    "конфіденційність",
    "політика",
    "персональні дані",
    "повернення товару",
    "One Two Smile",
  ],
  openGraph: {
    title: "Політика конфіденційності | One Two Smile",
    description:
      "Як ми обробляємо ваші персональні дані та забезпечуємо безпеку під час замовлення.",
    url: "https://one-two-smile.vercel.app/policy",
    siteName: "One Two Smile",
    locale: "uk_UA",
    type: "website",
  },
};

import styles from "./page.module.css";
import initTranslations from "../../i18n";

export default async function Policy({
  params,
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(params.locale, ["policy"]);

  return (
    <div className="w-full flex justify-center">
      <div className={styles.container}>
        <h1>{t("1.title")}</h1>
        <h2>{t("1.text")}</h2>

        <h1>{t("2.title")}</h1>
        <h2>{t("2.text")}</h2>

        <h1>{t("3.title")}</h1>
        <h2>{t("3.text")}</h2>

        <h1>{t("4.title")}</h1>
        <h2>{t("4.text")}</h2>

        <h1>{t("5.title")}</h1>
        <h2>{t("5.text")}</h2>

        <h1>{t("6.title")}</h1>
        <h2>{t("6.text")}</h2>

        <h1>{t("7.title")}</h1>
        <h2>{t("7.text")}</h2>
      </div>
    </div>
  );
}
