"use client";

import styles from "./medicalTurismVideo.module.css";

export default function MedicalTurismBanner() {
  return (
    <div className={styles.videoSection}>
      <video
        className={styles.backgroundVideo}
        src="/videos/Lviv.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.overlay}>
        <h1 className={styles.title}></h1>
      </div>
    </div>
  );
}
