'use client';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { InfiniteLoopSlider, Tag } from "./InfiniteScroll";

import styles from './styles.module.css';

// Properties
const DURATION = 10000;
const ROWS = 3;
const TAGS_PER_ROW = 8;

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
const shuffle = (arr: string[]) => [...arr].sort(() => .5 - Math.random());

const makeRepeated = (arr: string[], repeats: number) =>
    Array.from({ length: repeats }, () => arr).flat();

import Guest from "types/Guest";

interface Props {
    guestsImages: string[];
    chosenGuest: Guest;
}

export default function ScrollAnimation({ guestsImages, chosenGuest }: Props) {
    const [status, setStatus] = useState<"animating" | "finishing" | "animated">("animating");

    useEffect(() => {
        const interval = setInterval(() => {
            const RANDOM_INDEX = random(0, TAGS_PER_ROW * ROWS);
            const RANDOM_IMAGE = document.querySelectorAll(`.${styles.image}`)[RANDOM_INDEX];
            RANDOM_IMAGE.classList.toggle(styles.blink);
            const timeout = setTimeout(() => {
                RANDOM_IMAGE.classList.toggle(styles.blink);
                timeout && clearTimeout(timeout);
            }, 850);
        }, 1000);

        const removeTimeout = setTimeout(() => {
            const elements = document.querySelectorAll(`.${styles.inner}`);
            elements.forEach(element => {
                const div = element as HTMLDivElement;
                if (div.classList.contains(styles.chosenGuest)) return;
                div.style.opacity = "0";
            })
            const fadeTimeout = setTimeout(() => {
                const elements = document.querySelectorAll(`.${styles.image}`);
                elements.forEach(element => {
                    const div = element as HTMLDivElement;
                    if (div.classList.contains(styles.chosenGuest)) return;
                    div.style.opacity = "0";
                })
                setStatus("animated")
                fadeTimeout && clearTimeout(fadeTimeout);
                removeTimeout && clearTimeout(removeTimeout);
                interval && clearInterval(interval);
            }, 5 * 1000);
        }, DURATION);
    }, [])

    const isGuestsArrayEven = guestsImages.length % 2 === 0;
    const SORTED_ARRAY = useMemo(() => isGuestsArrayEven ? makeRepeated(shuffle(guestsImages), 3).concat([guestsImages[guestsImages.length - 1]]) : makeRepeated(shuffle(guestsImages), 3), []);

    const images = SORTED_ARRAY.map((guest, i) => (
        <Tag additionalClass={i === 15 ? styles.chosenGuest : undefined} image_url={i === 15 ? chosenGuest.image_url : guest} size={150} removeMargin />
    ));

    return (
        <AnimatePresence>
            <motion.div
                key={'infiniteLoopSlidersHolder'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.tagList}
            >
                {
                    status === "animating" && (
                        <motion.div
                            key={'infiniteLoopSlider1'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <InfiniteLoopSlider duration={random(DURATION - 5000, DURATION + 5000)} reverse={0}>
                                {shuffle(guestsImages).slice(0, TAGS_PER_ROW).map(guest => (
                                    <Tag image_url={guest} size={125} />
                                ))}
                            </InfiniteLoopSlider>
                        </motion.div>
                    )
                }

                <motion.div
                    layout
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring" }}
                    className={styles.center}
                >
                    {images}
                </motion.div>

                {
                    status === "animated" &&
                    <motion.div
                        className={styles.chosenReveal}
                        initial={{ transform: "translateY(50%)", opacity: 0 }}
                        animate={{ transform: "translateY(0%)", opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className={styles.title}>
                            <h2>Seu amigo secreto é</h2>
                            <h1>{chosenGuest.name}!</h1>
                        </div>
                        <p>Não se preocupe, você poderá ver o nome de seu amigo secreto novamente a qualquer momento. <br />
                            Agora é só preparar o presente e aguardar o tão aguardado dia do amigo secreto!</p>
                        <div className={'divisor'} />
                    </motion.div>
                }

                {
                    status === "animating" && <InfiniteLoopSlider duration={random(DURATION - 5000, DURATION + 5000)} reverse={0}>
                        {shuffle(guestsImages).slice(0, TAGS_PER_ROW).map(guest => (
                            <Tag image_url={guest} size={125} />
                        ))}
                    </InfiniteLoopSlider>
                }
            </motion.div>
        </AnimatePresence>
    );
}