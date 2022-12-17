import { motion } from "framer-motion";

// Stylesheet
import Image from 'next/image';
import styles from './styles.module.css';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    reverse: boolean | number;
    duration: number;
    children: React.ReactNode;
}

export function InfiniteLoopSlider({ reverse, duration, children, id }: Props) {
    return <div
        key={id}
        className={styles.inner}
        style={{
            animationDirection: reverse === 0 ? 'reverse' : 'normal',
            animationDuration: `${duration}ms`,
        }}
    >
        {children}
        {children}
    </div>
}

const MAX_DELAY = 5000;

interface TagProps {
    size?: number;
    additionalClass?: string;
    image_url?: string;
    removeMargin?: boolean;
}

export function Tag({ size = 125, image_url = "https://github.com/theduardomaciel.png", additionalClass, removeMargin }: TagProps) {
    const DELAY = Math.random() * MAX_DELAY;
    const DURATION = Math.random() * (MAX_DELAY / 2);
    return (
        <Image
            className={`${styles.image} ${additionalClass ? additionalClass : ""}`}
            style={additionalClass ? { marginRight: removeMargin ? 0 : "7.5rem" } : { animationDelay: `${DELAY}ms`, animationDuration: `${DURATION}ms`, marginRight: removeMargin ? 0 : "7.5rem" }}
            src={image_url}
            alt={""}
            width={size}
            height={size}
        />
    );
}