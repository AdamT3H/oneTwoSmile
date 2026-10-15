import styles from "./AboutTeamForm.module.css";

export default function AboutTeamForm() {
  return (
    <div className={styles.container}>
      <section className={styles.wrapper}>
        <div className={styles.text}>
          <h2 className={styles.title}>Не знаєте, до якого лікаря звернутися?</h2>
          <p className={styles.subtitle}>
            Залиште заявку - ми допоможемо підібрати спеціаліста та передзвонимо.
          </p>
        </div>

        <form className={styles.form}>
          <input
            className={styles.input}
            type="tel"
            name="phone"
            placeholder="Номер телефону"
            autoComplete="tel"
            required
          />
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Ім'я (необов'язково)"
            autoComplete="given-name"
          />
          <textarea
            className={styles.textarea}
            name="comment"
            placeholder="Коментар (необов'язково)"
            rows={3}
          />
          <button className={styles.button} type="submit">
            Надіслати заявку
          </button>
        </form>
      </section>
    </div>
  );
}