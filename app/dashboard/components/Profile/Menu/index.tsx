'use client';
import { CSSProperties, SetStateAction, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";

import styles from './menu.module.css';

import ConfigIcon from "../../../../../public/icons/settings.svg";
import LogoutIcon from "../../../../../public/icons/logout.svg";

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

// Components
import Button from '../../../../../components/Button';
import Account from '../../../../../types/Account';

interface Props {
    isOpen: boolean;
    toggleOpen: () => SetStateAction<void>;
    account: Account
}

export default function DashboardProfileMenu({ isOpen, toggleOpen, account }: Props) {

    const onClick = (event: any) => {
        if (popout.current) {
            if (isOpen === true && popout.current.contains(event.target) === false) {
                toggleOpen()
                window.removeEventListener('click', onClick);
            }
        }
    }

    const router = useRouter()
    const popout = useRef<HTMLDivElement>(null);

    async function handleLogout() {
        await signOut();
        router.push("/");
    }

    useEffect(() => {
        setTimeout(() => {
            window.addEventListener('click', onClick);
            return () => window.removeEventListener('click', onClick);
        }, 500);
    }, [isOpen]);

    if (!account) {
        return <div></div>
    }

    const buttonStyle = {
        width: "100%",
        background: "none",
        border: "none",
        justifyContent: "flex-start",
        gap: "1.5rem",
        paddingInline: "1.5rem",
        color: "var(--primary-03)",
    } as CSSProperties;

    return (
        <AnimatePresence>
            {
                isOpen && (
                    <motion.div
                        className={styles.container}
                        initial={"closed"}
                        animate={"open"}
                        exit={"closed"}
                        key={"reports"}
                        ref={popout}
                        variants={{
                            open: {
                                opacity: 1,
                                y: 0,
                                transition: { ease: "backOut", duration: 0.45 }
                            },
                            closed: {
                                y: -35,
                                opacity: 0
                            },
                            exit: {
                                y: -35,
                                opacity: 0
                            }
                        }}
                    >
                        <header>
                            <h3>{`${account.name}`}</h3>
                        </header>
                        <div style={{ backgroundColor: "var(--primary-03)" }} className={styles.line}></div>
                        <ul className={styles.buttons}>
                            <Link href={`/dashboard/settings`}>
                                <Button
                                    label='Configurações'
                                    noEffects
                                    style={buttonStyle}
                                    icon={<ConfigIcon />}
                                />
                            </Link>
                            <Button
                                label='Log-out'
                                noEffects
                                onClick={handleLogout}
                                style={buttonStyle}
                                icon={<LogoutIcon />}
                            />
                        </ul>
                    </motion.div>
                )
            }
        </AnimatePresence>
    );
}