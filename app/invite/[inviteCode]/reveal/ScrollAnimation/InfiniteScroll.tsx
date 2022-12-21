import { GUEST_IMAGE_PLACEHOLDER } from "@dashboard/components/Guest/GuestModal";
import PersonIcon from "@public/icons/person.svg";

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
    style?: React.CSSProperties;
}

export function Tag({ size = 125, image_url, additionalClass, style }: TagProps) {
    const DELAY = Math.random() * MAX_DELAY;
    const DURATION = Math.random() * (MAX_DELAY / 2);

    const BLINK_ANIMATION = additionalClass?.includes(styles.chosenGuest) ? {} : { animationDelay: `${DELAY}ms`, animationDuration: `${DURATION}ms` }

    return (
        <div
            className={`${styles.image} imageContain ${additionalClass ? additionalClass : ""}`}
            style={{ ...GUEST_IMAGE_PLACEHOLDER, ...style, width: size, height: size, cursor: "default", ...BLINK_ANIMATION }}
        >
            {
                image_url &&
                <Image
                    src={image_url}
                    fill
                    priority={true}
                    className={`imageContain`}
                    style={{ zIndex: 2, borderRadius: "50%" }}
                    alt={""}
                />
            }
            <PersonIcon width={64} height={64} opacity={0.5} />
        </div>
    );
}