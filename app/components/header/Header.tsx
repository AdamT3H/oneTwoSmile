"use client";

import Image from 'next/image';
import Link from 'next/link';

import styles from './Header.module.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import clinicInfo from '@/data/clinicInfo';

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
            <h1 className={styles.logoText}>Інноваційна клініка стоматології та косметології</h1>
          </div>

          <nav className={styles.burger}>
            <Link href="/" className={`${styles.burgerOptionsMain} ${pathname === "/" ? styles.burgerOptionsMainActive : ""}`}>Головна</Link>
            <h1 className={styles.burgerOptionsMainDecor}>|</h1>
            <Link href="/ourTeam" className={`${styles.burgerOptionsTeam} ${pathname === "/ourTeam" ? styles.burgerOptionsTeamActive : ""}`}>Наша команда</Link>
            <h1 className={styles.burgerOptionsTeam}>|</h1>
            <Link href="/medicalTourism" className={`${styles.burgerOptionsMed} ${pathname === "/medicalTourism" ? styles.burgerOptionsMedActive : ""}`}>Медичний туризм</Link>
            <h1 className={styles.burgerOptionsMed}>|</h1>
            <Link href="/service" className={`${styles.burgerOptionsService} ${pathname === "/service" ? styles.burgerOptionsServiceActive : ""}`}>Наші послуги</Link>
            <h1 className={styles.burgerOptionsService}>|</h1>
            <button className={styles.burgerOptionsMore} onClick={() => setMoreOptionsVisible(!isMoreOptionsVisible)}>Більше<Image alt="Open more" src="/header/arrow.png" width={10} height={0}  objectFit="cover"/></button>
          </nav>

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
            <div style={{ fontSize: '9px', display: 'inline-block' }}>
              {clinicInfo.location}
            </div>
              {/* <button style={{color:"var(--onlineBeckGround)", fontWeight: '400',backgroundImage: 'url("/header/bg.png")', backgroundSize: 'cover', backgroundPosition: 'center', border: 'none', padding: '10px 45px', fontSize: '12px', borderRadius: '6px', cursor: 'pointer'}} className="OnlineBookingBtn">Online запис</button> */}
          </div>
        </div>
      </header>

      <div className={`${styles.overlay} ${isMoreOptionsVisible ? styles.overlayVisible : ''}`} onClick={() => setMoreOptionsVisible(false)}></div>
      <div className={`${styles.moreOptions} ${isMoreOptionsVisible ? styles.moreOptionsVisible : ''}`}>
        <div className={styles.moreOptionsContainer}>
          <Link href="/shop" onClick={() => setMoreOptionsVisible((prev) => !prev)} className={styles.optionShop}>Магазин</Link>
          <Link href="/aboutUs" onClick={() => setMoreOptionsVisible((prev) => !prev)} className={styles.optionAbout}>Про нас</Link>
          <Link href="/" onClick={() => setMoreOptionsVisible((prev) => !prev)} className={styles.optionMain}>Головна</Link>
          <Link href="/ourTeam" onClick={() => setMoreOptionsVisible((prev) => !prev)} className={styles.optionTeam}>Наша команда</Link>
          <Link href="/medicalTourism" onClick={() => setMoreOptionsVisible((prev) => !prev)} className={styles.optionMed}>Медичний туризм</Link>
          <Link href="/service" onClick={() => setMoreOptionsVisible((prev) => !prev)} className={styles.optionService}>Наші послуги</Link>
        </div>
      </div>

    </>
  );
}