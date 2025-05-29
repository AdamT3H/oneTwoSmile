import styles from './aboutTeam.module.css';
import initTranslations from "../../app/i18n";

export default async function AboutTeam(params: { locale: string }) {
  const { t } = await initTranslations(params.locale, ["aboutTeamHeader"]);
  // const isEnglish = params.locale === "en";

  return (
    <div className={styles.container}>
      <div className={styles.containerMain}>
        <h1 className={styles.mainText}>{t('title')}</h1>
        <h2 className={styles.lowerText}>{t('subtitle')}</h2>
      </div>
      <ul className={styles.features}>
        <li>{t('experience')}</li>
        <li>{t('professionalism')}</li>
        <li>{t('modernTreatment')}</li>
        <li>{t('care')}</li>
        <li>{t('satisfiedPatients')}</li>
      </ul>
      <div className={styles.logoText}>one two smile</div>
    </div>
  );
}