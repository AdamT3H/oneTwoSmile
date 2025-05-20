import styles from "./Slider.module.css";

const Carousel = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Чому обирають нас?</h1>
        <div className={styles.underline}></div>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <img
            src="/main/TEST.png"
            alt="Ортодонтія"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>Ортодонтія</h2>
          <p className={styles.cardText}>
            Виправлення прикусу за допомогою брекетів, елайнерів та системи
            Insignia для ідеальної усмішки.
          </p>
        </div>

        <div className={styles.card}>
          <img
            src="/main/TEST.png"
            alt="Імплантація"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>Імплантація</h2>
          <p className={styles.cardText}>
            Сучасні методи імплантації зубів, включаючи видалення зубів мудрості
            та хірургічні операції будь-якої складності.
          </p>
        </div>

        <div className={styles.card}>
          <img
            src="/main/TEST.png"
            alt="Естетична стоматологія"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>Естетична стоматологія</h2>
          <p className={styles.cardText}>
            Відбілювання зубів, встановлення вінірів та коронок для бездоганної
            усмішки.
          </p>
        </div>

        <div className={styles.card}>
          <img
            src="/main/TEST.png"
            alt="Дитяча стоматологія"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>Дитяча стоматологія</h2>
          <p className={styles.cardText}>
            Лікування дітей у комфортній атмосфері, включаючи лікування уві сні
            та спеціальні програми для малюків.
          </p>
        </div>

        <div className={styles.card}>
          <img
            src="/main/TEST.png"
            alt="Косметологія"
            className={styles.cardImage}
          />
          <h2 className={styles.cardTitle}>Косметологія</h2>
          <p className={styles.cardText}>
            Професійний догляд за шкірою обличчя: пілінги, маски, ін`&apos;`єкційні
            методики та індивідуальний підбір домашнього догляду.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
