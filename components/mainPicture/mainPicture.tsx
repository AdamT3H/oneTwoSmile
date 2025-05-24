import Image from "next/image";
import styles from "./mainPicture.module.css";
import initTranslations from "../../app/i18n";

export default async function MainPicture(params: { locale: string }) {
  const { t } = await initTranslations(params.locale, ["home"]);
  const isEnglish = params.locale === "en";

  return (
    <div
      className={`${styles.container} ${isEnglish ? styles.containerEN : ""}`}
    >
      <div
        className={`${styles.containerStart} ${
          isEnglish ? styles.containerStartEN : ""
        }`}
      >
        <img
          className={`${styles.smilingWomanMainPage} ${
            isEnglish ? styles.smilingWomanMainPageEN : ""
          }`}
          src="/main/smilingWomanMainPage.png"
          alt="Smiling women photo"
        />
      </div>

      <div
        className={`${styles.containerCenter} ${
          isEnglish ? styles.containerCenterENG : ""
        }`}
      >
        <Image
          className={`${styles.logoPic} ${isEnglish ? styles.logoPicEN : ""}`}
          src="/header/Logo.png"
          width={150}
          height={150}
          alt="Logo"
        />
        <div className={isEnglish ? styles.sloganEN : styles.slogan}>
          {t("slogan")
            .split("\n")
            .map((line: string, i: number) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
        </div>
      </div>

      <div
        className={`${styles.containerEndButton} ${
          isEnglish ? styles.containerEndButtonENG : ""
        }`}
      >
        <div
          className={`${styles.containerEnd} ${
            isEnglish ? styles.containerEndENG : ""
          }`}
        >
          {t("approach360")}
        </div>
        <button id={styles.OnlineBookingBtnId} className="OnlineBookingBtn">
          {t("onlineBooking")}
        </button>
      </div>

      <button id={styles.OnlineBookingBtnId2} className="OnlineBookingBtn">
        {t("onlineBooking")}
      </button>
    </div>
  );
}
