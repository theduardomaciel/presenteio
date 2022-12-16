'use client';
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import styles from "../invite.module.css";

// Components
import Button from "../../../../components/Button";

import GiftIcon from '../../../../public/icons/gift.svg';
import Guest from "../../../../types/Guest";
import ScrollAnimation from "../components/ScrollAnimation";
import EventTitle from "../components/EventTitle";

export default function RevealContent({ guests }: { guests: string[] }) {
    const [status, setStatus] = useState<"idle" | "animating">("idle");

    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                layout
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring" }}
            >
                <EventTitle />
            </motion.div>
            {
                status === "idle" ?
                    <div className={styles.content}>
                        <h1>Chegou a hora de descobrir seu amigo secreto.</h1>
                        <p><strong>Estamos naquele aguardado momento do ano!</strong> <br />
                            Por trás de um botão está a descoberta de quem é seu amigo secreto, então, o que está esperando? <br />
                            Vai lá e descobre!</p>
                        <Button
                            additionalClasses={styles.button}
                            style={{ cursor: "pointer" }}
                            icon={<GiftIcon width={"1.8rem"} heigth={"1.8rem"} fill={`var(--neutral)`} />}
                            textStyle={styles.buttonFont}
                            onClick={() => setStatus("animating")}
                            label={`Descobrir meu Amigo Secreto`}
                        />
                        <div className={"divisor"} />
                    </div>
                    :
                    <ScrollAnimation guests={guests} />
            }
        </AnimatePresence>

    )
}