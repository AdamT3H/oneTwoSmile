"use client";

import styles from "./peopleSmilesSlider.module.css";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useTranslation } from "react-i18next";

const slidesData = [
  {
    image: "/main/smile1.jpeg",
    quoteKey: "slide1.quote",
    nameKey: "slide1.name",
  },
  {
    image: "/main/smile2.jpeg",
    quoteKey: "slide2.quote",
    nameKey: "slide2.name",
  },
  {
    image: "/main/smile3.jpeg",
    quoteKey: "slide3.quote",
    nameKey: "slide3.name",
  },
  {
    image: "/main/smile4.jpeg",
    quoteKey: "slide4.quote",
    nameKey: "slide4.name",
  },
];


function PeopleSmilesSlider() {
  const { t } = useTranslation("slider");

  return (
    <div className={styles.container}>
      <div className={styles.introSection}>
        <p className={styles.lead}>{t("lead")}</p>
        <div className={styles.underline}></div>

        <p className={styles.subtext}>
          {t('subtext.line1')} <br /> {t('subtext.line2')}
        </p>
      </div>

      <div style={{ width: "100%" }}>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={50}
          slidesPerView={1}
        >
          {slidesData.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className={styles.slideContainer}>
                <img
                  src={slide.image}
                  alt={t(slide.nameKey)}
                  className={styles.image}
                />
                <div className={styles.text}>
                  <p className={styles.quote}>&quot;{t(slide.quoteKey)}&quot;</p>
                  <p className={styles.name}>— {t(slide.nameKey)}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default PeopleSmilesSlider;
