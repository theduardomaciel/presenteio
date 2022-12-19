'use client';
import React from 'react';
import { AnimatePresence, MotionStyle, motion } from "framer-motion";

import styles from './modal.module.css';

// Components
import Button from '../Button';

import Logo from "@public/logo.svg";
import CloseIcon from '../../public/icons/close.svg';

interface ModalButton {
    text?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
    icon?: React.ReactElement;
}

type Props = React.HTMLAttributes<HTMLDivElement> & {
    isVisible: boolean;
    style?: MotionStyle;
    toggleVisibility: () => void;

    insertLogo?: boolean;


    headerProps?: {
        title?: string;
        description?: React.ReactNode;
        icon?: React.ReactElement;
        iconSize?: string;
        position?: "center" | "flex-start" | "flex-end";
        integratedTitle?: boolean;
    };

    returnButton?: {
        enabled: boolean;
        text?: string;
        icon?: React.ReactElement;
        onClick?: () => void;
    };

    buttons?: Array<ModalButton>;

    isLoading?: boolean;
}

export type MODAL_STATE = { status: boolean | string, value?: string };

export default function Modal({ isVisible, toggleVisibility, style, isLoading, insertLogo, returnButton = { enabled: true }, headerProps, buttons, children }: Props) {

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = event.nativeEvent.target as HTMLDivElement;
        if (target.id === "background") {
            if (isLoading === true) return;
            toggleVisibility()
        };
    }

    console.log(buttons && buttons.length > 0)
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
                                headerProps?.icon && <div className={styles.headerContainer} style={{ justifyContent: headerProps?.position ? headerProps?.position : "center" }}>
                                    <div className={`${styles.iconHolder} ${headerProps?.integratedTitle ? styles.withTitle : ""}`}>
                                        {headerProps?.icon}
                                    </div>
                                    {
                                        headerProps?.title && headerProps?.integratedTitle && <h2 className={styles.title} style={{ textAlign: "left", lineHeight: "3.55rem" }}>{headerProps?.title}</h2>
                                    }
                                </div>
                            }

                            {
                                insertLogo &&
                                <div className={styles.headerContainer} style={{ justifyContent: headerProps?.position ? headerProps?.position : "center" }}>
                                    <Logo className={styles.logo} />
                                </div>
                            }

                            {
                                (headerProps?.description || headerProps?.title && !headerProps.integratedTitle) &&
                                <section>
                                    {
                                        headerProps?.title && !headerProps?.integratedTitle &&
                                        <h2 className={styles.title}>{headerProps.title}</h2>
                                    }
                                    {
                                        headerProps?.description &&
                                        <p className={styles.description}>{headerProps.description}</p>
                                    }
                                </section>
                            }

                            {children as any}


                            {
                                buttons && buttons.length > 0 &&
                                <div className={styles.buttonsHolder}>
                                    {
                                        buttons && buttons.map(button => {
                                            return (
                                                <Button
                                                    key={button.text}
                                                    onClick={button.onClick}
                                                    isLoading={isLoading}
                                                    style={{
                                                        ...button.style,
                                                        background: button.disabled ? "var(--light-gray)" : "var(--primary-01)",
                                                        padding: `1rem 2.5rem`,
                                                        cursor: button.disabled || isLoading ? "not-allowed" : "pointer"
                                                    }}
                                                >
                                                    {button.icon ? (button.icon) : headerProps?.icon ? (headerProps.icon) : null}
                                                    {button.text}
                                                </Button>
                                            )
                                        })
                                    }
                                </div>
                            }
                            {
                                returnButton.enabled && <div className={'modalFooterHolder'}>
                                    <div className='divisor' />
                                    <div className={'modalFooter'} onClick={toggleVisibility}>
                                        {
                                            returnButton.icon ? returnButton.icon : <CloseIcon width={"1.6rem"} height={"1.6rem"} />
                                        }
                                        <p style={{ fontWeight: 700 }}> {returnButton.text ? returnButton.text : "Cancelar"} </p>
                                    </div>
                                </div>
                            }
                        </motion.div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
}