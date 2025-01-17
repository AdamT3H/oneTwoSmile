import Image from 'next/image';

import styles from './mainPicture.module.css';

export default function MainPicture() {

  return (
    <div className={styles.container}>
        <div className={styles.containerStart}>
            <Image className={styles.smilingWomanMainPage} src="/main/smilingWomanMainPage.png" width={480} height={4800} alt='Smiling women photo'/>
        </div>

        <div className={styles.containerCenter}>
            <Image src="/header/Logo.png" width={150} height={150} alt='Logo'/>
            Клініка для тих, хто<br />обирає себе.
        </div>

        <div className={styles.containerEnd}>
            Підхід 360°
        </div>

    </div>
  );
}