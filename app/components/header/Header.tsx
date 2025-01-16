"use client";

import Image from 'next/image';
import Link from 'next/link';

import styles from './Header.module.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import clinicInfo from '@/data/clinicInfo'; // Імпорт даних

export default function Header() {
  const [isMoreOptionsVisible, setMoreOptionsVisible] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.logo}>
            <Image
              src="/header/Logo.png"
              alt="Header Background"
              width={80}
              height={0} 
              objectFit="cover"
              className={styles.imageMargin}
            />
            Інноваційна клініка стоматології та косметології
            <button className="OnlineBookingBtn">Online запис</button>
          </div>

          <div className={styles.burger}>
            <Link href="/" className={`${styles.burgerOptionsMain} ${pathname === "/" ? styles.burgerOptionsMainActive : ""}`}>Головна</Link>
            <h1 className={styles.burgerOptionsMain}>|</h1>
            <Link href="/" className={styles.burgerOptionsTeam}>Наша команда</Link>
            <h1 className={styles.burgerOptionsTeam}>|</h1>
            <Link href="/" className={styles.burgerOptionsMed}>Медичний туризм</Link>
            <h1 className={styles.burgerOptionsMed}>|</h1>
            <Link href="/" className={styles.burgerOptionsService}>Наші послуги</Link>
            <h1 className={styles.burgerOptionsService}>|</h1>
            <button className={styles.burgerOptionsMore} onClick={() => setMoreOptionsVisible(!isMoreOptionsVisible)}>Більше<Image className={styles.burgerOptionsMoreArrow} alt="Open more" src="/header/arrow.png" width={10} height={0}  objectFit="cover"/></button>
          </div>

          <div className={styles.info}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px'}}>
              <Image
                  src="/header/Phone.png"
                  alt="Header Background"
                  width={13}
                  height={0} 
                  objectFit="cover"
              />
              <div>{clinicInfo.phone}</div>
            </div>
            <div style={{ fontSize: '9px' }}>
              {clinicInfo.location}
            </div>
              {/* <button style={{color:"var(--onlineBeckGround)", fontWeight: '400',backgroundImage: 'url("/header/bg.png")', backgroundSize: 'cover', backgroundPosition: 'center', border: 'none', padding: '10px 45px', fontSize: '12px', borderRadius: '6px', cursor: 'pointer'}} className="OnlineBookingBtn">Online запис</button> */}
          </div>
        </div>
      </header>

      <div className={`${styles.overlay} ${isMoreOptionsVisible ? styles.overlayVisible : ''}`} onClick={() => setMoreOptionsVisible(false)}></div>
      <div className={`${styles.moreOptions} ${isMoreOptionsVisible ? styles.moreOptionsVisible : ''}`}>
        <div className={styles.moreOptionsContainer}>
          <Link href="/" className={styles.optionShop}>Магазин</Link>
          <Link href="/" className={styles.optionAbout}>Про нас</Link>
          <Link href="/" className={styles.optionMain}>Головна</Link>
          <Link href="/" className={styles.optionTeam}>Наша команда</Link>
          <Link href="/" className={styles.optionMed}>Медичний туризм</Link>
          <Link href="/" className={styles.optionService}>Наші послуги</Link>
        </div>
      </div>

    </>
  );
}