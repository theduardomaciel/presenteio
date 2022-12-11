'use client';

import styles from './styles.module.css';

// Icons
import GiftIcon from '../../../../public/icons/gift.svg';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
}

export default function EmptyGuests({ label, ...rest }: Props) {
    return <div className={styles.emptyContainer} {...rest}>
        <header>
            <GiftIcon />
            <h6>Parece que está vazio por aqui...</h6>
        </header>
        <p>{label}</p>
    </div>
}