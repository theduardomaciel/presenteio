// Stylesheets
import styles from './reveal.module.css'

// Components
import EventTitle from '../../components/EventTitle'
import ScrollAnimation from '../../components/ScrollAnimation'

import RevealIntroduction from './Introduction'

export default function Reveal() {
    const GUESTS = ["https://github.com/megalovania.png", "https://github.com/teste.png", "https://github.com/juliano.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/theduardomaciel.png", "https://github.com/maxwell.png", "https://github.com/max.png", "https://github.com/robert.png"]

    return (
        <div className={styles.container}>
            <div className={styles.gradient} />
            <RevealIntroduction />
            {/* <EventTitle />
            <ScrollAnimation guests={GUESTS} /> */}
            <div className={`${styles.gradient} ${styles.fromRight}`} />
        </div>
    )
}