'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { InfiniteLoopSlider, Tag } from "./InfiniteScroll";

import styles from './styles.module.css';

// Properties
const DURATION = 10000;
const ROWS = 3;
const TAGS_PER_ROW = 8;

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
const shuffle = (arr: string[]) => [...arr].sort(() => .5 - Math.random());

export default function ScrollAnimation({ guests }: { guests: string[] }) {
    const [status, setStatus] = useState<"animating" | "animated">("animating");

    useEffect(() => {
        /* const interval = setInterval(() => {
            const RANDOM_INDEX = random(0, TAGS_PER_ROW * ROWS);
            const RANDOM_IMAGE = document.querySelectorAll(`.${styles.image}`)[RANDOM_INDEX];
            RANDOM_IMAGE.classList.toggle(styles.blink);
            const timeout = setTimeout(() => {
                RANDOM_IMAGE.classList.toggle(styles.blink);
                timeout && clearTimeout(timeout);
            }, 850);
        }, 1000); */

        const fadeTimeout = setTimeout(() => {
            const elements = document.querySelectorAll(`.${styles.inner}`);
            elements.forEach(element => {
                console.log("foi uma")
                const div = element as HTMLDivElement;
                div.style.opacity = "0";
            })
            const removeTimeout = setTimeout(() => {
                setStatus("animated");
                fadeTimeout && clearTimeout(fadeTimeout);
                removeTimeout && clearTimeout(removeTimeout);
                /* interval && clearInterval(interval); */
            }, 1 * 1000);
        }, DURATION);
    }, [])

    return (
        status === "animating" ?
            <div className={styles.tagList}>
                {
                    [...new Array(ROWS)].map((_, i) => (
                        <InfiniteLoopSlider key={i} id={`row_${i}`} duration={random(DURATION - 5000, DURATION + 5000)} reverse={i % 2}>
                            {shuffle(guests).slice(0, TAGS_PER_ROW).map(guest => (
                                <Tag image_url={guest} size={i === 1 ? 150 : 125} />
                            ))}
                        </InfiniteLoopSlider>
                    ))
                }
            </div>
            :
            <div className={styles.chosenReveal}>
                <Image
                    className={styles.chosenGuest}
                    src={"https://github.com/theduardomaciel.png"}
                    alt={""}
                    width={150}
                    height={150}
                />
                <div className={styles.title}>
                    <h2>Seu amigo secreto é</h2>
                    <h1>Fulano da Silva!</h1>
                </div>
                <p>Não se preocupe, você poderá ver o nome de seu amigo secreto novamente a qualquer momento. <br />
                    Agora é só preparar o presente e aguardar o tão aguardado dia do amigo secreto!</p>
                <div className={'divisor'} />
            </div>
    )
}