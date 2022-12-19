import Image from 'next/image';

import styles from "./styles.module.css";

// Components
import ActionButtons from './ActionButtons';

// Icons
import EmailIcon from "@public/icons/email.svg";

import DataIcon from "@public/icons/guestStatus/data.svg";
import PendingIcon from "@public/icons/guestStatus/pending.svg";
import ConfirmedIcon from "@public/icons/guestStatus/confirmed.svg";

// Utils
import Guest from 'types/Guest';
import { EventStatus } from 'types/Event';

const GuestCard = ({ guest, eventInfo }: { guest: Omit<Guest, "event">, eventInfo: { status: EventStatus, inviteCode: string } }) => {
    return (
        <div className={styles.guestCard}>
            <header>
                <div className={styles.iconAndLabel}>
                    <Image className={styles.image} src={guest.image_url} alt="Guest image." height={28} width={28} />
                    <h6>{guest.name}</h6>
                </div>
                <ActionButtons eventStatus={eventInfo.status} guestStatus={guest.status} guestLink={`https://presenteio.vercel.app/invite/${eventInfo.inviteCode}?guest=${guest.id}`} />
            </header>
            <footer>
                <div className={styles.iconAndLabel}>
                    {
                        guest.status === "CONFIRMED" ? <>
                            <DataIcon width={16} height={16} />
                            <p>Dados Confirmados</p>
                        </> : guest.status === "VISUALIZED" ?
                            <>
                                <ConfirmedIcon width={16} height={16} />
                                <p>Visualizado</p>
                            </> :
                            <>
                                <PendingIcon width={16} height={16} />
                                <p>Aguardando convidado...</p>
                            </>
                    }
                </div>
                <div className='divisor vertical' />
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