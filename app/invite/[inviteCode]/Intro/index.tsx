import Image from "next/image";

// Components
import ParticipateButton from "./ParticipateButton";

// Stylesheet
import styles from "./intro.module.css";

// Assets
import Gifts from "@/public/images/gifts.png";
import Gift from "@/public/images/gift.png";

import Guest from "types/Guest";
import Event from "types/Event";

import getWordGenre from "@utils/wordGenre";

interface Props {
    guest?: Guest;
    event: Event;
}

function getGreetings() {
    const date = new Date();
    const hour = date.getHours();

    if (hour >= 0 && hour < 12) {
        return "Bom dia";
    } else if (hour >= 12 && hour < 18) {
        return "Boa tarde";
    } else {
        return "Boa noite";
    }
}

export default function Intro({ guest, event }: Props) {
    const { createdAt, ...rest } = event;
    return (
        <>
            {guest && (
                <header className={styles.header}>
                    <h6>
                        {getGreetings()}, <strong>{guest.name}</strong>!
                    </h6>
                </header>
            )}
            <div className={styles.content}>
                <div className={styles.title}>
                    <div className={styles.titleContent}>
                        <h3>Chegou a hora do</h3>
                        <h1>
                            {event.type === "AMIGOSECRETO"
                                ? "Amigo Secreto"
                                : "Sorteio"}
                        </h1>
                        <h3>
                            d{getWordGenre(event.name)} {event.name}
                        </h3>
                    </div>

                    <ParticipateButton guest={guest} event={rest} />
                </div>

                <Image
                    className={styles.giftsImage}
                    width={305}
                    height={374}
                    src={Gifts}
                    priority
                    draggable={false}
                    alt="Vários presentes vermelhos com fita amarela que forma um laço no topo."
                />
                <Image
                    className={styles.giftImage}
                    width={155}
                    height={155}
                    src={Gift}
                    priority
                    draggable={false}
                    alt="Presente vermelho único com fita amarela que forma um laço no topo."
                />
            </div>
        </>
    );
}
