'use client';

import styles from "../invite.module.css";

// Components
import Button from "../../../../../components/Button";
import EventTitle from "../../components/EventTitle";

export default function RevealIntroduction() {
    return (
        <div className={styles.content}>
            <EventTitle />
            <h1>Chegou a hora de descobrir seu amigo secreto.</h1>
            <p><strong>Estamos naquele aguardado momento do ano!</strong> <br />
                Por trás de um botão está a descoberta de quem é seu amigo secreto, então, o que está esperando? <br />
                Vai lá e descobre!</p>
            <Button additionalClasses={styles.button} textStyle={styles.buttonFont} label={`Descobrir meu Amigo Secreto`} />
            <div className={"divisor"} />
        </div>
    )
}