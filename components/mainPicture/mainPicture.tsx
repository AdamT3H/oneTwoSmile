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
      <video
        className={styles.backgroundVideo}
        src="/videos/Lviv.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.overlay}>
        <div
          className={`${styles.containerCenter} ${
            isEnglish ? styles.containerCenterENG : ""
          }`}
        >
          <Image
            className={`${styles.logoPic} ${isEnglish ? styles.logoPicEN : ""}`}
            src="/header/LogoW.png"
            width={170}
            height={170}
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
    </div>
  );
}
