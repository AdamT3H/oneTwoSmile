import styles from "./page.module.css";
import initTranslations from "../../i18n";

export { metadata } from "./metadata";

export default async function Policy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { t } = await initTranslations(locale, ["policy"]);

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

        <h1>{t("8.title")}</h1>
        <h2>{t("8.text")}</h2>

        <h1>{t("9.title")}</h1>
        <h2>{t("9.text")}</h2>
      </div>
    </div>
  );
}
