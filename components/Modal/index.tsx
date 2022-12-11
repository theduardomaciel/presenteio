'use client';
import React from 'react';
import { AnimatePresence, MotionStyle, motion } from "framer-motion";

import styles from './modal.module.css';

// Components
import Button from '../Button';

import CloseIcon from '../../public/icons/close.svg';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    isVisible: boolean;
    style?: MotionStyle;
    toggleVisibility: () => void;

    color?: string;
    title?: string;
    description?: React.ReactNode;

    icon?: React.ReactElement;
    headerProps?: {
        size: string;
        position: "center" | "flex-start" | "flex-end";
        builtWithTitle?: boolean;
    };

    supressReturnButton?: boolean;

    actionProps?: {
        buttonText: string,
        buttonIcon?: React.ReactElement,
        disabled?: boolean,
        function?: () => void,
    },

    isLoading?: boolean;
}

const DEFAULT_COLOR = "var(--primary-02)"

export default function Modal({ isVisible, toggleVisibility, style, color, isLoading, icon, supressReturnButton, title, description, headerProps, actionProps, children }: Props) {

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
                            {
                                icon && <div className={styles.headerContainer} style={{ justifyContent: headerProps?.position ? headerProps?.position : "center" }}>
                                    <div style={{ backgroundColor: color ? color : DEFAULT_COLOR }} className={styles.iconHolder}>
                                        {icon}
                                    </div>
                                    {
                                        headerProps?.builtWithTitle && <h2 style={{ textAlign: "left", lineHeight: "3.55rem" }}>{title}</h2>
                                    }
                                </div>
                            }

                            {
                                title && !headerProps?.builtWithTitle &&
                                <h2 style={{ color: color ? color : DEFAULT_COLOR }}>{title}</h2>
                            }
                            {
                                description &&
                                <p className={styles.description} style={{ color: color ? color : DEFAULT_COLOR }}>{description}</p>
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
                                {
                                    !supressReturnButton && <div className={'modalFooter'} onClick={toggleVisibility}>
                                        <CloseIcon width={"1.6rem"} height={"1.6rem"} />
                                        <p style={{ fontWeight: 700 }}> Cancelar </p>
                                    </div>
                                }
                            </footer>
                        </motion.div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
}