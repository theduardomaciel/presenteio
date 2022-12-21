'use client';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { InfiniteLoopSlider, Tag } from "./InfiniteScroll";

import styles from './styles.module.css';

// Properties
const DURATION = 10000;
const ROWS = 3;
const TAGS_PER_ROW = 10;

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
                    if (div.classList.contains(styles.chosenGuest) === false) {
                        div.style.opacity = "0";
                    }
                })
                setStatus("animated")
                fadeTimeout && clearTimeout(fadeTimeout);
                removeTimeout && clearTimeout(removeTimeout);
            }, 5 * 1000);
        }, DURATION);
    }, [])

    const MULTIPLY_BY = Math.floor(TAGS_PER_ROW / guestsImages.length) + 3;
    const IS_ARRAY_EVEN = guestsImages.length % 2 === 0;
    const SORTED_ARRAY = useMemo(() => IS_ARRAY_EVEN ? makeRepeated(shuffle(guestsImages), MULTIPLY_BY)
        : makeRepeated(shuffle(guestsImages), MULTIPLY_BY).concat([guestsImages[guestsImages.length - 1]]), []);

    const MIDDLE_INDEX = Math.floor(SORTED_ARRAY.length / 2);

    const images = SORTED_ARRAY.map((guest, i) => (
        <Tag
            key={i.toString()}
            additionalClass={i === MIDDLE_INDEX ? styles.chosenGuest : undefined}
            image_url={i === MIDDLE_INDEX ? chosenGuest.image_url : guest}
            size={150}
            removeMargin
        />
    ));

    return (
        <AnimatePresence>
            <motion.div
                key={'scrollAnimation'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.tagList}
            >
                {
                    status === "animating" && <InfiniteLoopSlider key={'firstAnimator'} duration={random(DURATION - 5000, DURATION + 5000)} reverse={0}>
                        {shuffle(guestsImages.length < TAGS_PER_ROW ? makeRepeated(guestsImages, 3) : guestsImages).slice(0, TAGS_PER_ROW).map((guest, i) => (
                            <Tag key={i.toString()} image_url={guest} size={125} />
                        ))}
                    </InfiniteLoopSlider>
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
                        key={'animatorDiv'}
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
                    status === "animating" && <InfiniteLoopSlider key={"secondAnimator"} duration={random(DURATION - 5000, DURATION + 5000)} reverse={0}>
                        {shuffle(guestsImages.length < TAGS_PER_ROW ? makeRepeated(guestsImages, 3) : guestsImages).slice(0, TAGS_PER_ROW).map((guest, i) => (
                            <Tag key={i.toString()} image_url={guest} size={125} />
                        ))}
                    </InfiniteLoopSlider>
                }
            </motion.div>
        </AnimatePresence>
    );
}