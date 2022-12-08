'use client';

import styles from './eventCard.module.css';

// Icons
import PersonIcon from '../../../../public/icons/person.svg';
import SecretFriend from '../../../../public/icons/secret_friend.svg';

// Types
import Event from '../../../../types/Event';
import Image from 'next/image';

interface Props {
    event?: Event;
}

export default function EventCard({ event }: Props) {
    return <div className={styles.eventCard}>
        <header>
            <div className={styles.iconAndLabel}>
                <PersonIcon />
                <p>12 participantes</p>
            </div>
        </header>
        <div className={styles.info}>
            <h3>Família Tal Tal da Silva Bem Grande Memo</h3>
            <div className={styles.iconAndLabel}>
                <SecretFriend />
                <p>Amigo Secreto</p>
            </div>
        </div>
        <div className={styles.overlay} />
        <Image src={"/images/placeholder.webp"} className={styles.image} fill alt='' />
    </div>
}