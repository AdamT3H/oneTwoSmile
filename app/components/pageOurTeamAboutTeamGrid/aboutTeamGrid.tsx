"use client"

import styles from './aboutTeamGrid.module.css';
import Image from 'next/image';
import { useState } from 'react';

export default function AboutTeamGrid() {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className={styles.container}>
        <div className={styles.grid}>

          <div className={styles.flipCard} onClick={handleFlip}>
            <div className={styles.flipCardInner}>
              <div className={styles.flipCardFront}>
                <Image src="/team/person.png" alt="Team member" width={200} height={250} className={styles.image} />
                <h3 className={styles.name}>Огороднік Адам</h3>
              </div>
              <div className={styles.flipCardBack}>
                <h3 className={styles.name}>Огороднік Адам</h3>
                <p className={styles.role}>Ортодонт</p>
              </div>
            </div>
          </div>

          <div className={styles.flipCard} onClick={handleFlip}>
            <div className={styles.flipCardInner}>
              <div className={styles.flipCardFront}>
                <Image src="/team/person.png" alt="Team member" width={200} height={250} className={styles.image} />
                <h3 className={styles.name}>Огороднік Адам</h3>
              </div>
              <div className={styles.flipCardBack}>
                <h3 className={styles.name}>Огороднік Адам</h3>
                <p className={styles.role}>Ортодонт</p>
              </div>
            </div>
          </div>

          <div className={styles.flipCard} onClick={handleFlip}>
            <div className={styles.flipCardInner}>
              <div className={styles.flipCardFront}>
                <Image src="/team/person.png" alt="Team member" width={200} height={250} className={styles.image} />
                <h3 className={styles.name}>Огороднік Адам</h3>
              </div>
              <div className={styles.flipCardBack}>
                <h3 className={styles.name}>Огороднік Адам</h3>
                <p className={styles.role}>Ортодонт</p>
              </div>
            </div>
          </div>

          <div className={styles.flipCard} onClick={handleFlip}>
            <div className={styles.flipCardInner}>
              <div className={styles.flipCardFront}>
                <Image src="/team/person.png" alt="Team member" width={200} height={250} className={styles.image} />
                <h3 className={styles.name}>Огороднік Адам</h3>
              </div>
              <div className={styles.flipCardBack}>
                <h3 className={styles.name}>Огороднік Адам</h3>
                <p className={styles.role}>Ортодонт</p>
              </div>
            </div>
          </div>

          <div className={styles.flipCard} onClick={handleFlip}>
            <div className={styles.flipCardInner}>
              <div className={styles.flipCardFront}>
                <Image src="/team/person.png" alt="Team member" width={200} height={250} className={styles.image} />
                <h3 className={styles.name}>Огороднік Адам</h3>
              </div>
              <div className={styles.flipCardBack}>
                <h3 className={styles.name}>Огороднік Адам</h3>
                <p className={styles.role}>Ортодонт</p>
              </div>
            </div>
          </div>

          <div className={styles.flipCard} onClick={handleFlip}>
            <div className={styles.flipCardInner}>
              <div className={styles.flipCardFront}>
                <Image src="/team/person.png" alt="Team member" width={200} height={250} className={styles.image} />
                <h3 className={styles.name}>Огороднік Адам</h3>
              </div>
              <div className={styles.flipCardBack}>
                <h3 className={styles.name}>Огороднік Адам</h3>
                <p className={styles.role}>Ортодонт</p>
              </div>
            </div>
          </div>

          <div className={styles.flipCard} onClick={handleFlip}>
            <div className={styles.flipCardInner}>
              <div className={styles.flipCardFront}>
                <Image src="/team/person.png" alt="Team member" width={200} height={250} className={styles.image} />
                <h3 className={styles.name}>Огороднік Адам</h3>
              </div>
              <div className={styles.flipCardBack}>
                <h3 className={styles.name}>Огороднік Адам</h3>
                <p className={styles.role}>Ортодонт</p>
              </div>
            </div>
          </div>

        </div>
    </div>
  );
}