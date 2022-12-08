'use client';

import styles from './eventEdit.module.css';

// Icons
import DownArrow from '../../../../public/icons/down_arrow.svg';

interface Props {
    event?: Event;
}

export default function EventEdit({ event }: Props) {
    return <div className={styles.container}>
        <p>Amigo Secreto</p>
        <p>/</p>
        <h3>Novo Evento</h3>
        <DownArrow />
    </div>
}