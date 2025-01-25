import Image from 'next/image';

import styles from './mainPicture.module.css';

export default function MainPicture() {

  return (
    <div className={styles.container}>
        <div className={styles.containerStart}>
            <Image className={styles.smilingWomanMainPage} src="/main/smilingWomanMainPage.png" width={480} height={4800} alt='Smiling women photo'/>
        </div>

        <div className={styles.containerCenter}>
            <Image className={styles.logoPic} src="/header/Logo.png" width={150} height={150} alt='Logo'/>
            Клініка для тих, хто<br />обирає себе.
        </div>

        <div className={styles.containerEndButton} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div className={styles.containerEnd}>
            Підхід 360°
          </div>

          <button id={styles.OnlineBookingBtnId} className="OnlineBookingBtn">Online запис</button>
        </div>

        <button  id={styles.OnlineBookingBtnId2} className="OnlineBookingBtn">Online запис</button>


    </div>
  );
}