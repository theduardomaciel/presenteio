import Image from 'next/image';

import styles from "./styles.module.css";

// Components
import ActionButtons from './ActionButtons';

// Icons
import EmailIcon from "@public/icons/email.svg";

import DataIcon from "@public/icons/guestStatus/data.svg";
import PendingIcon from "@public/icons/guestStatus/pending.svg";
import VisualizedIcon from "@public/icons/view.svg";
import ConfirmedIcon from "@public/icons/guestStatus/confirmed.svg";

// Utils
import Guest from 'types/Guest';
import Event from 'types/Event';

const GuestCard = ({ guest, event }: { guest: Omit<Guest, "event">, event: Omit<Event, 'createdAt'> }) => {
    return (
        <div className={styles.guestCard}>
            <header>
                <div className={styles.iconAndLabel}>
                    {
                        guest.image_url && <Image
                            className={`${styles.image} imageContain`}
                            src={guest.image_url}
                            alt="Guest image."
                            height={28}
                            width={28} />
                    }
                    <h6>{guest.name}</h6>
                </div>
                <ActionButtons guest={guest} event={event} />
            </header>
            <footer>
                <div className={styles.iconAndLabel}>
                    {
                        guest.status === "CONFIRMED" && event.status !== "DIVULGATED" ? <>
                            <DataIcon width={16} height={16} />
                            <p>Dados Confirmados</p>
                        </> : guest.status === "VISUALIZED" ?
                            <>
                                <ConfirmedIcon width={16} height={16} />
                                <p>Visualizado</p>
                            </> :
                            event.status === "DIVULGATED" ?
                                <>
                                    <VisualizedIcon width={16} height={16} fill={`var(--neutral)`} />
                                    <p>Visualização pendente...</p>
                                </>
                                :
                                <>
                                    <PendingIcon width={16} height={16} />
                                    <p>Aguardando convidado...</p>
                                </>
                    }
                </div>
                <div className='divisor vertical' onClick={() => console.log(guest.chosenGuest ? guest.chosenGuest.name : "")} />
                {
                    guest.status !== "PENDING" &&
                    <div className={styles.iconAndLabel}>
                        <EmailIcon />
                        <p>{guest.email ? guest.email : "[e-mail pendente]"}</p>
                    </div>
                }
            </footer>
        </div>
    )
}

export default GuestCard;