import initTranslations from "@/app/i18n";
import styles from "./medicalTurismBanner.module.css";

export default async function MedicalTurismBanner({
  locale,
}: {
  locale: string;
}) {
  const { t } = await initTranslations(locale, ["medicalTourismBaner"]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.arrow}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#777"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div className={styles.arrowText}>{t("scroll_down")}</div>

      <div className={styles.container}>
        <h1 className={styles.title}>{t("medical_tourism")}</h1>
        <h2 className={styles.titleUnder}>
          {t("medical_tourism_description")}
        </h2>
      </div>
    </div>
  );
}
