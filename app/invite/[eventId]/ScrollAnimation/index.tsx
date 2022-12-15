// Stylesheet
import Image from 'next/image';
import React from 'react';
import styles from './styles.module.css';

// Properties
const DURATION = 10000;
const ROWS = 3;
const TAGS_PER_ROW = 8;

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;
const shuffle = (arr: string[]) => [...arr].sort(() => .5 - Math.random());

interface Props {
    reverse: boolean | number;
    duration: number;
    children: React.ReactNode;
}

function InfiniteLoopSlider({ reverse, duration, children }: Props) {
    console.log(reverse);
    return (
        <div
            className={`${styles.inner}`}
            style={{
                animationDirection: reverse === 1 ? 'reverse' : 'normal',
                animationDuration: `${duration}ms`,
                marginLeft: reverse === 1 ? '-12rem' : '0',
            }}
        >
            {children}
            {children}
        </div>
    );
}

function Tag({ size = 125, image_url = "https://github.com/theduardomaciel.png" }: { size?: number, image_url?: string }) {
    return (
        <Image
            className={styles.image}
            src={image_url}
            alt={""}
            width={size}
            height={size}
        />
    );
}

export default function ScrollAnimation({ guests }: { guests: string[] }) {
    return (
        <div className={styles.tagList}>
            {
                [...new Array(ROWS)].map((_, i) => (
                    <InfiniteLoopSlider key={i} duration={random(DURATION - 5000, DURATION + 5000)} reverse={i % 2}>
                        {shuffle(guests).slice(0, TAGS_PER_ROW).map(guest => (
                            <Tag size={i === 1 ? 150 : 125} />
                        ))}
                    </InfiniteLoopSlider>
                ))
            }
        </div>
    )
}