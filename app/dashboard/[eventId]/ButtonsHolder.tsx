import styles from "./styles.module.css";

import Button from "components/Button";

// Assets
import SendEmail from "@public/icons/send_email.svg";
import SettingsIcon from "@public/icons/settings.svg";

import Event from "types/Event";

export default function ButtonsHolder({ event }: { event: Omit<Event, 'createdAt'> }) {
    return (
        <div className={styles.buttonsHolder}>
            <Button style={{
                width: "49%",
                padding: "1rem 2.5rem",
                borderRadius: "0.8rem",
            }}>
                <SendEmail height={24} width={24} />
                Enviar e-mails
            </Button>
            <Button style={{
                width: "49%",
                padding: "1rem 2.5rem",
                borderRadius: "0.8rem",
            }}>
                <SettingsIcon />
                Configurações do Evento
            </Button>
        </div>
    )
}