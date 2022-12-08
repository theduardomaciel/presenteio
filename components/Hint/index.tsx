import styles from './hint.module.css'

import LampIcon from "../../public/icons/lamp.svg";
import React from 'react';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    hint: React.ReactElement | string;
    size?: "small" | "medium" | "large";
    textColor?: string;
}

export default function Hint({ hint, size, textColor, ...rest }: Props) {
    return <div className={styles.container} {...rest}>
        <div className={styles.iconHolder}>
            <LampIcon width={size === "medium" ? "2.4rem" : "1.8rem"} height={size === "medium" ? "2.4rem" : "1.8rem"} />
        </div>
        <div className={styles.textHolder}>
            {
                typeof hint === "string" ? <p style={{ color: textColor ? textColor : "var(--primary-02)" }} className={styles.hint}>{hint}</p> : hint
            }
        </div>
    </div>
}