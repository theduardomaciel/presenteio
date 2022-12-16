'use client';

import styles from './eventCard.module.css';

// Icons
import PersonIcon from '../../../../public/icons/person.svg';
import SecretFriend from '../../../../public/icons/secret_friend.svg';

// Types
import Event from '../../../../types/Event';
import Image from 'next/image';
import Overlay from '../Overlay';

interface Props {
    event?: Event | any;
}

export default function EventCard({ event }: Props) {
    return <div className={styles.eventCard}>
        <header>
            <div className={styles.iconAndLabel}>
                <PersonIcon width={`1.2rem`} heigth={`1.2rem`} />
                <p style={{ whiteSpace: "nowrap" }}>12 participantes</p>
            </div>
        </header>
        <div className={styles.info}>
            <h3>Família Tal Tal da Silva Bem Grande Memo</h3>
            <div className={styles.iconAndLabel}>
                <SecretFriend />
                <p>Amigo Secreto</p>
            </div>
        </div>
        <Overlay />
        <Image src={"/images/placeholder.webp"} className={styles.image} fill alt='' />
    </div>
}