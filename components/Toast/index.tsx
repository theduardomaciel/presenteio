'use client';
import * as React from 'react';
import * as Toast from '@radix-ui/react-toast';

import styles from './toast.module.css';

import InfoIcon from '@public/icons/info.svg'

export function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <Toast.Provider swipeDirection="right">
            {children}
            <Toast.Viewport className={styles.toastViewport} />
        </Toast.Provider>
    )
}

interface ToastProps {
    title: string,
    description: string,
    icon?: React.ReactElement;
    status?: "success" | "error" | "warning" | "info";
}

export type ToastDynamicProps = [boolean, ToastProps?];

interface Props {
    isOpened: boolean;
    toastProps?: ToastProps;
    setDynamicOpened?: React.Dispatch<React.SetStateAction<ToastDynamicProps>>
    setOpened?: React.Dispatch<React.SetStateAction<boolean>>;
}

// dynamic props example: const [[isToastVisible, toastProps], setToastVisible] = useState<ToastDynamicProps>([false]);

export default function DashboardToast({ isOpened, setOpened, setDynamicOpened, toastProps }: Props) {
    return (
        <Toast.Root className={`${styles.toastRoot} ${styles[toastProps?.status as string]}`} open={isOpened} onOpenChange={(opened) => {
            if (setOpened) {
                setOpened(opened);
            } else if (setDynamicOpened) {
                setDynamicOpened([opened]);
            }
        }}>
            {
                toastProps?.icon && <div className={styles.column}>
                    {toastProps.icon}
                </div>
            }
            {
                !toastProps?.icon && toastProps?.status === "info" && <div className={styles.column}>
                    <InfoIcon />
                </div>
            }
            <div className={styles.column}>
                <Toast.Title className={styles.toastTitle}>{toastProps?.title}</Toast.Title>
                <Toast.Description className={styles.toastDescription} >
                    {toastProps?.description}
                </Toast.Description>
            </div>
        </Toast.Root>
    );
};