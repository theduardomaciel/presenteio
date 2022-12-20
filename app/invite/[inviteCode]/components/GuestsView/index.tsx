'use client';

import Image from 'next/image';

// Stylesheets
import styles from './styles.module.css'

// Assets
import CheckIcon from '@public/icons/check.svg';
import ChevronLeft from "@public/icons/chevron_left.svg";
import useHorizontalScroll from 'hooks/useHorizontalScroll';

export default function GuestsView() {
    const GUESTS = [
        {
            name: "João",
            image_url: "https://github.com/theduardomaciel.png",
            status: "visualized",
        },
        {
            name: "Maria",
            image_url: "https://github.com/theduardomaciel.png",
            status: "waiting",
        },
        {
            name: "José",
            image_url: "https://github.com/theduardomaciel.png",
            status: "waiting",
        },
        {
            name: "Joana",
            image_url: "https://github.com/theduardomaciel.png",
            status: "waiting",
        },
        {
            name: "Joana",
            image_url: "https://github.com/theduardomaciel.png",
            status: "waiting",
        },
        {
            name: "Joana",
            image_url: "https://github.com/theduardomaciel.png",
            status: "waiting",
        },
        {
            name: "Joana",
            image_url: "https://github.com/theduardomaciel.png",
            status: "waiting",
        },
        {
            name: "Joana",
            image_url: "https://github.com/theduardomaciel.png",
            status: "waiting",
        },
        {
            name: "Joana",
            image_url: "https://github.com/theduardomaciel.png",
            status: "waiting",
        },
    ]

    const { moveScroll } = useHorizontalScroll('guestsHolder', true);

    const VisualizedFilter = () => <div className={styles.visualized}>
        <CheckIcon />
    </div>

    return (
        <div className={styles.container}>
            <ChevronLeft onClick={() => moveScroll(-25)} style={{ cursor: "pointer", userSelect: "none" }} />
            <ul id='guestsHolder' className={styles.guestsHolder}>
                {
                    GUESTS.map((guest, index) => (
                        <li key={index} className={styles.guest}>
                            {
                                guest.status === "visualized" && <VisualizedFilter />
                            }
                            <Image style={{ zIndex: 0, borderRadius: "50%" }} src={guest.image_url} alt={guest.name} width={40} height={40} />
                        </li>
                    ))
                }
            </ul>
            <ChevronLeft onClick={() => moveScroll(25)} style={{ transform: "rotate(180deg)", cursor: "pointer", userSelect: "none" }} />
        </div>
    )
}