import styles from "./Philosophy.module.css";
import initTranslations from "../../app/i18n";

async function Philosophy(params: { locale: string }) {
  const { t } = await initTranslations(params.locale, ["mainPicture"]);
  
  return (
    <div className={styles.container}>
      <h1 className={styles.mainText}>{t('philosophyTitle')}</h1>
      <div className={styles.underline}></div>

      <div className={styles.OneTwoSmileContainer}>
        <div className={styles.logoRow}>
          <img
            src="/header/ONE_trimmed.png"
            alt="ONE"
            className={styles.logoWord}
          />
          <img
            src="/header/TWO_trimmed.png"
            alt="TWO"
            className={styles.logoWord}
          />
          <img
            src="/header/SMILE_trimmed.png"
            alt="SMILE"
            className={styles.logoWord}
          />
        </div>
        <div className={styles.slogan}>
          —&nbsp;&nbsp;&nbsp;{t('slogan')}
        </div>
      </div>

      <div className={styles.secondaryContainer}>
        {t('secondaryContainer')}
      </div>

      <div className={styles.logoTextExp}>
        <div className={styles.logoTextExpElem}>
          <img
            src="/header/ONE_trimmed.png"
            alt="ONE"
            className={styles.logoWord}
          />
          <p className={styles.logoTextExpElemText}>
            —&nbsp;&nbsp;&nbsp;{t('oneText')}
          </p>
        </div>

        <div className={styles.logoTextExpElem}>
          <img
            src="/header/TWO_trimmed.png"
            alt="TWO"
            className={styles.logoWord}
          />
          <p className={styles.logoTextExpElemText}>
            —&nbsp;&nbsp;&nbsp;{t('twoText')}
          </p>
        </div>

        <div className={styles.logoTextExpElem}>
          <img
            src="/header/SMILE_trimmed.png"
            alt="SMILE"
            className={styles.logoWord}
          />
          <p className={styles.logoTextExpElemText}>
            —&nbsp;&nbsp;&nbsp;{t('smileText')}
          </p>
        </div>
      </div>

      <div className={styles.finalWords}>
        <p className={styles.finalWordsText}>{t('finalText1')}</p>
        <p className={styles.finalWordsText}>{t('finalText2')}</p>
      </div>
    </div>
  );
}

export default Philosophy;
