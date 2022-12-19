// Stylesheets
import styles from './reveal.module.css'

// Components
import RevealContent from './Content'

export default function Reveal() {
    const GUESTS = ["https://github.com/megalovania.png", "https://github.com/teste.png", "https://github.com/juliano.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/maxwell.png", "https://github.com/max.png", "https://github.com/robert.png"]

    return (
        <div className={styles.container}>
            <div className={styles.gradient} />
            <RevealContent guests={GUESTS} />
            <div className={`${styles.gradient} ${styles.fromRight}`} />
        </div>
    )
}