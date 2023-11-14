'use client';

import { MouseEvent } from 'react';
import { useRef } from 'react';

import styles from "./styles.module.css"

interface InputLabelProps {
    label: string;
}

export const InputLabel = (props: InputLabelProps) => <p className={styles.label}>
    {props.label}
</p>

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    fixedUnit?: string;
    height?: string | number;
    numberControl?: boolean;
    icon?: string;
    errorMessage?: string;
}
const Input = ({ label, fixedUnit, height, numberControl, icon, errorMessage, children, ...rest }: Props) => {
    const input = useRef<HTMLInputElement | null>(null);

    function animateArrow(button: HTMLElement) {
        button.classList.toggle(styles.clicked)
        setTimeout(() => {
            button.classList.toggle(styles.clicked)
        }, 1000 * 0.1);
    }

    function increaseCount(event: MouseEvent<HTMLSpanElement>) {
        const button = event.target as HTMLDivElement;
        animateArrow(button)

        console.log('increasing', input.current)

        if (input.current && parseInt(input.current.value)) {
            input.current.value = (Math.max(0, parseInt(input.current.value) + 1)).toString()
        } else {
            if (input.current) {
                input.current.value = "0"
            }
        }
    }

    function decreaseCount(event: MouseEvent<HTMLSpanElement>) {
        const button = event.target as HTMLDivElement;
        animateArrow(button)

        if (input.current && parseInt(input.current.value)) {
            input.current.value = (Math.max(0, parseInt(input.current.value) - 1)).toString()
        } else {
            if (input.current) {
                input.current.value = "0"
            }
        }
    }

    const inputElement = <input ref={input} style={{ height: height ? height : "3.8rem", textAlign: numberControl ? "end" : "start", paddingLeft: icon ? "3.4rem" : "1rem" }} className={styles.input} {...rest} />;
    const errorText = errorMessage && errorMessage.length > 0 && <p className={styles.errorText}>{errorMessage}</p>

    return <div className={styles.flex} key={'inputContainer'}>
        {
            label &&
            <div className={styles.labelContainer}>
                <InputLabel label={label} />
                {children}
            </div>
        }
        {
            fixedUnit ?
                <div className={styles.row}>
                    {
                        numberControl &&
                        <div className={`${styles.increaseControl}`}>
                            <span className={`click material-icons-round ${styles.increaseArrow}`} onClick={increaseCount}>expand_less</span>
                            <span className={`click material-icons-round ${styles.decreaseArrow}`} onClick={decreaseCount}>expand_more</span>
                        </div>
                    }
                    {inputElement}
                    <div className={`${styles.input} ${styles.fixedUnit}`}>
                        {fixedUnit}
                    </div>
                </div>
                :
                <div className={styles.row}>
                    {
                        icon &&
                        <span style={{ fontSize: "1.8rem" }} className={`static material-icons-round ${styles.icon}`}>{icon}</span>
                    }
                    {inputElement}
                </div>
        }
        {errorText}
    </div>
}

export default Input;