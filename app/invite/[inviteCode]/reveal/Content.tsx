'use client';
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

import styles from "../invite.module.css";

import GiftIcon from '@public/icons/gift.svg';

// Components
import Button from "components/Button";
import ScrollAnimation from "./ScrollAnimation";
import EventTitle from "../components/EventTitle";

import Guest from "types/Guest";

interface Props {
    guestsImages: string[];
    chosenGuest: Guest;
    eventProps: { name: string, type: string }
}

export default function RevealContent({ guestsImages, chosenGuest, eventProps }: Props) {
    const [status, setStatus] = useState<"idle" | "animating">("idle");

    async function updateStatus() {
        setStatus("animating")

        try {
            const response = await axios.patch(`/api/guests/${chosenGuest.id}`, {
                status: "VISUALIZED"
            })
            if (response) {
                console.log("Status atualizado com sucesso!")
            } else {
                console.log("Erro ao atualizar status.")
            }
        } catch (error) {
            console.log(error, "Erro ao atualizar status.")
        }
    }

    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                layout
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring" }}
            >
                <EventTitle type={eventProps.type} name={eventProps.name} />
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
                            icon={<GiftIcon width={"1.8rem"} height={"1.8rem"} fill={`var(--neutral)`} />}
                            onClick={updateStatus}
                        >
                            <p className={`${styles.buttonFont}`}>Descobrir meu Amigo Secreto</p>
                        </Button>
                        <div className={"divisor"} />
                    </div>
                    :
                    <ScrollAnimation guestsImages={guestsImages} chosenGuest={chosenGuest} />
            }
        </AnimatePresence>

    )
}