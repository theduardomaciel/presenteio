'use client';
import React, { useRef, useState } from 'react';

import styles from './eventEdit.module.css';

// Icons
import DownArrow from '@public/icons/down_arrow.svg';
import EditIcon from '@public/icons/edit.svg';
import SaveIcon from '@public/icons/save.svg';

import Event from 'types/Event';
import axios from 'axios';
import DashboardToast, { ToastDynamicProps } from 'components/Toast';
import Spinner from 'components/Spinner';
import { useRouter } from 'next/navigation';

interface Props {
    event?: Omit<Event, 'createdAt'>;
}

export default function EventEdit({ event }: Props) {
    const [state, setState] = useState<"default" | "rename">("default");

    const DEFAULT_VALUE = event ? event.name : "Novo Evento"
    const [eventName, setEventName] = useState(DEFAULT_VALUE);

    function onFocus(event: React.FocusEvent<HTMLInputElement>) {
        setState("rename");
        event.target.select();
    }

    function onBlur(event: React.FocusEvent<HTMLInputElement>) {
        setState("default");
        if (event.target.value.length === 0) {
            setEventName(DEFAULT_VALUE);
        }
    }

    const [[isToastVisible, toastProps], setToastVisible] = useState<ToastDynamicProps>([false]);
    const [isLoading, setLoading] = useState(false);

    const router = useRouter();

    async function updateName() {
        if (event) {
            setLoading(true)
            try {
                const response = await axios.patch(`/api/events/${event.id}`, { name: eventName });
                if (response.status === 200) {
                    setToastVisible([true, {
                        title: "Tudo certo!",
                        description: "O nome do evento foi alterado com sucesso.",
                        icon: <EditIcon width={22} fill={`var(--primary-02)`} />,
                        status: "success"
                    }]);
                } else {
                    setToastVisible([true, {
                        title: "Algo deu errado...",
                        description: "Não foi possível alterar o nome do evento :(",
                        icon: <EditIcon width={22} fill={`var(--primary-02)`} />,
                        status: "error"
                    }]);
                }
                router.refresh();
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error)
            }
        }
    }

    return <div className={`${styles.container} ${styles[state]}`}>
        <p>Amigo Secreto</p>
        <p>/</p>
        {
            event && event.name !== eventName && (
                isLoading ? <Spinner /> : <SaveIcon fill='var(--primary-01)' className='icon click' onClick={updateName} />
            )
        }
        <input
            type="text"
            name="eventName"
            onFocus={onFocus}
            onBlur={onBlur}
            maxLength={30}
            style={{ width: `${eventName.length + 0.5}ch` }}
            value={eventName}
            onChange={(event) => {
                setEventName(event.target.value);
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.currentTarget.blur();
                }
                if (event.currentTarget.value.length === 0) {
                    event.currentTarget.style.width = `20rem`;
                } else {
                    event.currentTarget.style.width = `${eventName.length + 0.5}ch`;
                }
            }}
            minLength={1}
        />

        {/* <DownArrow /> */}
        <DashboardToast
            setDynamicOpened={setToastVisible}
            isOpened={isToastVisible}
            toastProps={toastProps}
        />
    </div>
}