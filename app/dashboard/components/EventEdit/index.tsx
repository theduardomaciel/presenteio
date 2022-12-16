'use client';
import { useState } from 'react';

import styles from './eventEdit.module.css';

// Icons
import DownArrow from '../../../../public/icons/down_arrow.svg';

interface Props {
    event?: Event;
}

export default function EventEdit({ event }: Props) {
    const [state, setState] = useState<"default" | "rename">("default");

    function onFocus(event: React.FocusEvent<HTMLInputElement>) {
        setState("rename");
        event.target.select();
    }

    function onBlur(event: React.FocusEvent<HTMLInputElement>) {
        setState("default");
    }

    return <div className={`${styles.container} ${styles[state]}`}>
        <p>Amigo Secreto</p>
        <p>/</p>
        <input
            type="text"
            defaultValue={"Novo Evento"}
            width={"fit-content"}
            onFocus={onFocus}
            onBlur={onBlur}
            maxLength={30}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.currentTarget.blur();
                }
                if (event.currentTarget.value.length === 0) {
                    event.currentTarget.style.width = `20rem`;
                } else {
                    event.currentTarget.style.width = `${event.currentTarget.value.length + 0.5}ch`;
                }
            }}
            minLength={1}
            placeholder={"Novo Evento"}
        />
        <DownArrow />
    </div>
}