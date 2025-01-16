import styles from './Footer.module.css';
import clinicInfo from '@/data/clinicInfo';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {

  return (
    <div className={styles.container}>
      <div className={styles.workingDays}>
        <h1>Графік роботи</h1> 
        <h2>{clinicInfo.workTime.weekdays}</h2>
        <h2>{clinicInfo.workTime.weekends}</h2>
      </div>

      <div className={styles.mein}>
        <h1>з нами ти полюбиш усміхатись!</h1>
        <h2>{clinicInfo.email}</h2>
        <div className={styles.links}>
          <Link href='/' className={styles.instagram}><Image src="/main/instagramLogo.png" alt="Instagram Logo" width={20} height={20} /></Link>
          <Link href='/'className={styles.tiktok}><Image src="/main/tiktok-logo-4501.png" alt="TikTok Logo" width={20} height={20} /></Link>
          <Link href='/' className={styles.facebook}><Image src="/main/facebook-logo-108.png" alt="Facebook Logo" width={20} height={20} /></Link>
        </div>
      </div>

      <div className={styles.map}>
        <Image className={`${styles.arrowPngImageStart} ${styles.animate}`} src="/footer/arrow-png-image-start.png" width={50} height={30} alt='Way to clinic'/>
        <Link href={clinicInfo.map} className={styles.mapText} target="_blank" rel="noopener noreferrer">Прoкласти маршрут</Link>
        <Image className={`${styles.arrowPngImageEnd} ${styles.animate}`} src="/footer/arrow-png-image-end.png" width={60} height={30} alt='Way to clinic'/>
      </div>
    </div>
  );
}