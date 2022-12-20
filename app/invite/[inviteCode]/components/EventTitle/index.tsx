// Stylesheet
import styles from './styles.module.css';

// Assets
import GiftIcon from '@public/gift.svg'
import getWordGenre from '@utils/wordGenre';

interface Props {
    type: string;
    name: string;
}

export default function EventTitle({ type, name }: Props) {
    return (
        <div className={styles.eventTitle}>
            <GiftIcon fill={`var(--primary-02)`} />
            <h2>{type === "AMIGOSECRETO" ? "Amigo Secreto" : "Sorteio"}</h2>
            <h3>d{name ? getWordGenre(name) : "e"} {name}</h3>
        </div>
    )
}