// Stylesheet
import Image from 'next/image';
import styles from './styles.module.css';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    reverse: boolean | number;
    duration: number;
    children: React.ReactNode;
}

export function InfiniteLoopSlider({ reverse, duration, children, id }: Props) {
    return (
        <div
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
    );
}

const MAX_DELAY = 5000;

export function Tag({ size = 125, image_url = "https://github.com/theduardomaciel.png" }: { size?: number, image_url?: string }) {
    const DELAY = Math.random() * MAX_DELAY;
    const DURATION = Math.random() * (MAX_DELAY / 2);
    return (
        <Image
            className={styles.image}
            style={{ animationDelay: `${DELAY}ms`, animationDuration: `${DURATION}ms` }}
            src={image_url}
            alt={""}
            width={size}
            height={size}
        />
    );
}