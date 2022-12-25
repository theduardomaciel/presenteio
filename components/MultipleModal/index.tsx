'use client';

import React, { CSSProperties, Dispatch, SetStateAction } from 'react';

import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion"

import Logo from '../../public/logo.svg';

// Style
import styles from './styles.module.css';

export interface Section {
    title: string;
    description: React.ReactNode;
    hideVisibility?: {
        background?: boolean;
        container?: boolean;
    }

    footer?: React.ReactNode;
    children?: React.ReactNode;

    logoPosition?: "top" | "bottom";
    isLoading?: boolean;
}

interface Props {
    actualSection: string;
    direction?: number;
    setActualSection?: Dispatch<SetStateAction<[number, number]>>;
    sections: { [key: string]: Section };
    initial?: boolean;
    hasBackground?: boolean;
}

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        };
    },
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => {
        return {
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        };
    }
};

const transition = {
    x: { type: "spring", stiffness: 65, damping: 15, mass: 1, duration: 0.7 },
    opacity: { duration: 0.75 },
}

export default function AuthModal({ actualSection, direction, sections, initial }: Props) {

    const titleStyle = {
        justifyContent: "center",
        gap: "4.5rem",
        textAlign: "center"
    } as CSSProperties;

    let sectionsModals = {} as { [key: string]: React.ReactNode };

    Object.keys(sections).map((key, index) => {
        const section = sections[key];
        sectionsModals[key] = <motion.div
            className={`${styles.holder} ${section.hideVisibility?.background ? styles.noBackground : section.hideVisibility?.container ? styles.noContainer : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            key={`modalHolder_${index}`}
        >
            <motion.div
                className={styles.container}
                key={`modalContent_${index}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
            >
                <div className={styles.headerContainer} style={section.logoPosition === "top" ? titleStyle : undefined}>
                    {section.logoPosition === "top" && <Logo />}
                    <h2>{section.title}</h2>
                    <p>{section.description}</p>
                </div>
                {section.children}
                <div className={styles.divisor} />
                {section.footer}
            </motion.div>
        </motion.div>
    })

    return (
        <AnimatePresence initial={initial} mode='sync'>
            {sectionsModals[actualSection]}
        </AnimatePresence>
    );
}