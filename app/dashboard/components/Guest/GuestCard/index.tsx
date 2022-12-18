import Image from 'next/image';

import styles from "./styles.module.css";

// Icons
import EmailIcon from "@public/icons/email.svg";

import DataIcon from "@public/icons/guestStatus/data.svg";
import PendingIcon from "@public/icons/guestStatus/pending.svg";
import ConfirmedIcon from "@public/icons/guestStatus/confirmed.svg";

// Utils
import Guest from 'types/Guest';

const GuestCard = ({ guest }: { guest: Guest }) => {
    return (
        <div className={styles.guestCard}>
            <header>
                <div className={styles.iconAndLabel}>
                    <Image className={styles.image} src={guest.image_url} alt="Guest image." height={28} width={28} />
                    <h6>{guest.name}</h6>
                </div>

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
                                <p>Pendente</p>
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