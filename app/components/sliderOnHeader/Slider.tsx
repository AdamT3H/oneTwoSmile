// "use client";

// import React, { useState, useEffect } from "react";
// import styles from "./Slider.module.css";
// import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import Image from "next/image";

// const AdaptiveHeight: KeenSliderPlugin = (slider) => {
//   function updateHeight() {
//     slider.container.style.height =
//       slider.slides[slider.track.details.rel].offsetHeight + "px";
//   }
//   slider.on("created", updateHeight);
//   slider.on("slideChanged", updateHeight);
// };

// export default function App() {
//   const [currentSlide, setCurrentSlide] = React.useState(0);
//   const [loaded, setLoaded] = useState(false);
//   const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
//     {
//       initial: 0,
//       slideChanged(s) {
//         setCurrentSlide(s.track.details.rel);
//       },
//       created() {
//         setLoaded(true);
//       },
//     },
//     [AdaptiveHeight]
//   );

//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 1);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       <div className={styles.containForSlider}>
//         <div
//           className={`${styles.navigationWrapper} ${
//             isVisible ? styles.visible : styles.hidden
//           }`}
//         >
//           <div ref={sliderRef} className={`${styles.keenSlider} keen-slider `}>
//             <div
//               className={`${styles.keenSlider__slide} ${styles.numberSlide1} keen-slider__slide number-slide1`}
//             >
//               <div className={styles.background}></div>
//               <div className={styles.mainTextSlide1}>Чому обирають нас?</div>
//               <Image
//                 className={styles.sliderPhoto}
//                 src="/main/sliderPhoto.png"
//                 alt="Slider"
//                 width={250}
//                 height={250}
//               />
//             </div>

//             <div
//               className={`${styles.keenSlider__slide} ${styles.numberSlide2} keen-slider__slide number-slide2`}
//             >
//               <div className={styles.background}></div>
//               <div className={styles.mainContentWrapper}>
//                 <div className={styles.textBlock}>
//                   <h1>Команда висококваліфікованих лікарів</h1>
//                 </div>

//                 <Image
//                   className={styles.sliderPhoto1}
//                   src="/main/TEST.png"
//                   alt="Slider"
//                   width={750}
//                   height={750}
//                 />
//               </div>
//             </div>

//             <div
//               className={`${styles.keenSlider__slide} ${styles.numberSlide3} keen-slider__slide number-slide3`}
//             >
//               <div className={styles.background}></div>
//               <div className={styles.mainContentWrapper}>
//                 <div className={styles.textBlock}>
//                   <h1>Команда висококваліфікованих лікарів</h1>
//                 </div>

//                 <Image
//                   className={styles.sliderPhoto1}
//                   src="/main/TEST.png"
//                   alt="Slider"
//                   width={750}
//                   height={750}
//                 />
//               </div>
//             </div>
//           </div>
//           {loaded && instanceRef.current && (
//             <>
//               <Arrow
//                 left
//                 onClick={(e: React.MouseEvent<SVGElement>) => {
//                   e.stopPropagation();
//                   instanceRef.current?.prev();
//                 }}
//                 disabled={currentSlide === 0}
//               />

//               <Arrow
//                 onClick={(e: React.MouseEvent<SVGElement>) => {
//                   e.stopPropagation();
//                   instanceRef.current?.next();
//                 }}
//                 disabled={
//                   currentSlide ===
//                   instanceRef.current.track.details.slides.length - 1
//                 }
//               />
//             </>
//           )}
//           {loaded &&
//           instanceRef.current &&
//           instanceRef.current.track.details.slides ? (
//             <div className={styles.dots}>
//               {[
//                 ...Array(
//                   instanceRef.current.track.details.slides.length
//                 ).keys(),
//               ].map((idx) => {
//                 return (
//                   <button
//                     key={idx}
//                     onClick={() => {
//                       instanceRef.current?.moveToIdx(idx);
//                     }}
//                     className={`${styles.dot} ${
//                       currentSlide === idx ? styles.active : ""
//                     }`}
//                   ></button>
//                 );
//               })}
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </>
//   );
// }

// interface ArrowProps {
//   disabled: boolean;
//   left?: boolean;
//   onClick: (e: React.MouseEvent<SVGElement>) => void;
// }

// const Arrow: React.FC<ArrowProps> = ({ disabled, left, onClick }) => {
//   return (
//     <svg
//       onClick={disabled ? undefined : onClick}
//       className={`${styles.arrow} ${
//         left ? styles.arrowLeft : styles.arrowRight
//       } ${disabled ? styles["arrow--disabled"] : ""}`}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//     >
//       {left ? (
//         <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
//       ) : (
//         <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
//       )}
//     </svg>
//   );
// };

"use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Navigation } from "swiper/modules";
import styles from "./Slider.module.css";
// import Image from "next/image";

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

      {/* <Swiper
        navigation={true}
        modules={[Navigation]}
        className={styles.mySwiper}
      >
        <SwiperSlide>
          <div className={styles.slideContent1}>
            <div >Чому обирають нас?</div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={styles.slideContent}>Слайд 2</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={styles.slideContent}>Слайд 3</div>
        </SwiperSlide>
      </Swiper> */}
    </div>
  );
};

export default Carousel;
