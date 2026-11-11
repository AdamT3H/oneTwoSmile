"use client";

import styles from "./Reviews.module.css";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useTranslation } from "react-i18next";

type Review = {
  id: number;
  name: string;
  text: string;
  rating: number;
  link: string;
}

const reviewsData: Review[] = [
  { id: 1, name: "Julia Berlach", text: "slide1.quote", rating: 5, link: "https://maps.app.goo.gl/S9KeE6rkbyYncpLFA" },
  { id: 2, name: "G97", text: "slide2.quote", rating: 5, link: "https://maps.app.goo.gl/wrXNJEeiEDQhF6SK9" },
  { id: 3, name: "Yana Mykhalchenko", text: "slide3.quote", rating: 5, link: "https://maps.app.goo.gl/vNsywcb3Yw5BkekN9" },
  { id: 4, name: "Віталіна Чепік", text: "slide4.quote", rating: 5, link: "https://maps.app.goo.gl/JoJxQ6x1wNrjfLDC7" },
  { id: 5, name: "Nestor", text: "slide5.quote", rating: 5, link: "https://maps.app.goo.gl/5jvbC7hm7HL5Apmz9" },
  { id: 6, name: "Daria Kovalyk", text: "slide6.quote", rating: 5, link: "https://maps.app.goo.gl/6xyopK8XXWtPMr437" },
  { id: 7, name: "Solomia Shpynda", text: "slide7.quote", rating: 5, link: "https://maps.app.goo.gl/TsHCDY61aDk6ktBM7" },
  { id: 8, name: "К Віта", text: "slide8.quote", rating: 5, link: "https://maps.app.goo.gl/1Ws1N6moesshykLx8" },
  { id: 9, name: "Oleksandra Klymenko", text: "slide9.quote", rating: 5, link: "https://maps.app.goo.gl/khLFuj1h9SYJUazC6" },
  { id: 10, name: "Serhii Makhov", text: "slide10.quote", rating: 5, link: "https://maps.app.goo.gl/MLGY73wNpPe9sPwx8" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className={styles.stars} aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? styles.starOn : styles.starOff}>
          ★
        </span>
      ))}
    </div>
  );
}

function Reviews() {
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

      <div className={styles.sliderWrapper}>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop
          autoplay={{
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }}
          spaceBetween={50}
          slidesPerView={1}
        >
          {reviewsData.map((review, index) => (
            <SwiperSlide key={index}>
              <article className={styles.card}>
                <span className={styles.quoteMark} aria-hidden="true">
                  “
                </span>

                <Stars rating={review.rating} />

                <p className={styles.text}>{t(review.text)}</p>

                <div className={styles.footer}>
                  <div className={styles.avatar}>
                    {review.name.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.author}>
                    <span className={styles.name}>{review.name}</span>
                    <a
                      href={review.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.googleLink}
                    >
                      {t("readOnGoogle", { defaultValue: "Перейти на відгук" })}
                    </a>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Reviews;