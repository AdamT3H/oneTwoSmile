import styles from "./Slider.module.css";
import initTranslations from "../../app/i18n";

async function Carousel(params: { locale: string }) {
  const { t } = await initTranslations(params.locale, ["slider"]);
  // const isEnglish = params.locale === "en";

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{t('whyUs')}</h1>
        <div className={styles.underline}></div>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <img
            src="/main/TEST.png"
            alt="Індивідуальний підхід"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>{t('card1Title')}</h2>
          <p className={styles.cardText}>
            {t('card1Text')}
          </p>
        </div>

        <div className={styles.card}>
          <img
            src="/main/TEST.png"
            alt="Досвід та експертність"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>{t('card2Title')}</h2>
          <p className={styles.cardText}>
            {t('card2Text')}
          </p>
        </div>

        <div className={styles.card}>
          <img
            src="/main/TEST.png"
            alt="Сучасні технології"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>{t('card3Title')}</h2>
          <p className={styles.cardText}>
          {t('card3Text')}
          </p>
        </div>

        <div className={styles.card}>
          <img
            src="/main/TEST.png"
            alt="Комфорт та безпека"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>{t('card4Title')}</h2>
          <p className={styles.cardText}>
          {t('card4Text')}
          </p>
        </div>

        <div className={styles.card}>
          <img
            src="/main/TEST.png"
            alt="Комплексні послуги"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>{t('card5Title')}</h2>
          <p className={styles.cardText}>
          {t('card5Text')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
