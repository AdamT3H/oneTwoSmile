import styles from './aboutTeam.module.css';

export default function AboutTeam() {
  return (
    <div className={styles.container}>
      <div className={styles.containerMain}>
        <h1 className={styles.mainText}>Спеціалісти</h1>
        <h2 className={styles.lowerText}>Клініка об`єднала фахівців у сфері догляду</h2>
      </div>
      <ul className={styles.features}>
        <li>Досвідченість</li>
        <li>Професіоналізм</li>
        <li>Лікування за сучасними протоколами.</li>
        <li>Турбота</li>
        <li>Завжди задоволені пацієнти</li>
      </ul>
      <div className={styles.logoText}>one two smile</div>
    </div>
  );
}