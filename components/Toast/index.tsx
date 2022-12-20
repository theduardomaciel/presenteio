'use client';
import * as React from 'react';

import * as Toast from '@radix-ui/react-toast';

import styles from './toast.module.css';

export function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <Toast.Provider swipeDirection="right">
            {children}
            <Toast.Viewport className={styles.toastViewport} />
        </Toast.Provider>
    )
}

interface Props {
    isOpened: boolean;
    setOpened: (value: boolean) => void;
    title: string;
    description: string;
    icon: React.ReactElement;
}

export default function DashboardToast({ isOpened, setOpened, title, description, icon }: Props) {
    return (
        <Toast.Root className={styles.toastRoot} open={isOpened} onOpenChange={setOpened}>
            <div className={styles.column}>
                {icon}
            </div>
            <div className={styles.column}>
                <Toast.Title className={styles.toastTitle}>{title}</Toast.Title>
                <Toast.Description className={styles.toastDescription} >
                    {description}
                </Toast.Description>
            </div>
        </Toast.Root>
    );
};