// Stylesheets
import styles from './revelation.module.css'

// Components
import EventTitle from '../EventTitle'
import ScrollAnimation from '../ScrollAnimation'

export default function Revelation() {
    const GUESTS = ["https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png"]

    return (
        <div className={styles.container}>
            <div className={styles.gradient} />
            <EventTitle />
            <ScrollAnimation guests={GUESTS} />
            <div className={`${styles.gradient} ${styles.fromRight}`} />
        </div>
    )
}