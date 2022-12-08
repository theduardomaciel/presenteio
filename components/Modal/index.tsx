'use client';

import styles from './modal.module.css';
import React from 'react';

import { AnimatePresence, MotionStyle, motion } from "framer-motion";

// Components
import Button from '../Button';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    isVisible: boolean;
    style?: MotionStyle;
    toggleVisibility: () => void;

    color: string;
    title?: string;
    description?: React.ReactNode;

    icon: React.ReactElement;
    headerProps?: {
        size: string;
        position: "center" | "flex-start" | "flex-end";
        builtWithTitle?: boolean;
    }

    actionProps?: {
        buttonText: string,
        buttonIcon?: React.ReactElement,
        disabled?: boolean,
        function?: () => void,
    },

    isLoading?: boolean;
}

export default function Modal({ isVisible, toggleVisibility, style, color, isLoading, icon, title, description, headerProps, actionProps, children }: Props) {

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = event.nativeEvent.target as HTMLDivElement;
        if (target.id === "background" && !isLoading) {
            toggleVisibility()
        };
    }

    return (
        <AnimatePresence mode='wait'>
            {
                isVisible && (
                    <motion.div
                        className={styles.background}
                        key="modal"
                        id='background'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={(event) => handleClick(event)}
                    >
                        <motion.div
                            className={styles.container}
                            key="modalContent"
                            style={style}
                            initial={{ y: 300, x: 0, opacity: 0 }}
                            animate={{ y: 0, x: 0, opacity: 1 }}
                            exit={{ y: 300, x: 0, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.65 }}
                        >
                            <div className={styles.headerContainer} style={{ justifyContent: headerProps?.position ? headerProps?.position : "center" }}>
                                <div style={{ backgroundColor: color }} className={styles.iconHolder}>
                                    {icon}
                                </div>
                                {
                                    headerProps?.builtWithTitle && <h2 style={{ textAlign: "left", lineHeight: "3.55rem" }}>{title}</h2>
                                }
                            </div>

                            {
                                title && !headerProps?.builtWithTitle &&
                                <h2 style={{ color: color ? color : "var(--primary-02)" }}>{title}</h2>
                            }
                            {
                                description &&
                                <p className={styles.description} style={{ color: color ? color : "var(--primary-02)" }}>{description}</p>
                            }

                            {children}

                            <footer>
                                {
                                    actionProps?.function &&
                                    <Button
                                        onClick={actionProps?.function}
                                        title={actionProps?.buttonText}
                                        disabled={actionProps?.disabled}
                                        isLoading={isLoading}
                                        icon={actionProps.buttonIcon ? actionProps.buttonIcon : undefined}
                                        style={{
                                            background: actionProps?.disabled ? "var(--light-gray)" : color,
                                            padding: `1rem 2.5rem`,
                                            cursor: actionProps.disabled || isLoading ? "not-allowed" : "pointer"
                                        }}
                                        accentColor={color ? color : undefined}
                                    />
                                }
                            </footer>
                        </motion.div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
}