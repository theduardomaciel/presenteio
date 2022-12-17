// Stylesheet
import styles from './styles.module.css';

// Assets
import GiftIcon from '../../../../../public/gift.svg'

export default function EventTitle() {
    return (
        <div className={styles.eventTitle}>
            <GiftIcon fill={`var(--primary-02)`} />
            <h2>Amigo Secreto</h2>
            <h3>da Família buscapé</h3>
        </div>
    )
}