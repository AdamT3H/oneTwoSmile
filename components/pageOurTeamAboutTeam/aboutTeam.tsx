import styles from "./aboutTeam.module.css";
import initTranslations from "../../app/i18n";

export default async function AboutTeam(params: { locale: string }) {
  const { t } = await initTranslations(params.locale, ["aboutTeamHeader"]);

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("title")}</h1>

        <h2 className={styles.subtitle}>
          {t("subtitle1")} <br />
          {t("subtitle2")}
        </h2>
      </div>

      <p className={styles.outsideText}>
      {t("outsideText1")}<br />
      {t("outsideText2")}
      </p>
    </>
  );
}
