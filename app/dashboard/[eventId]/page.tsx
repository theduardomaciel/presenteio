import Image from 'next/image';
import { notFound } from 'next/navigation';

import dashboardStyles from "../dashboard.module.css";
import styles from './styles.module.css';

// Components
import EventEdit from '@dashboard/components/Event/EventEdit';
import DashboardHeader from '@dashboard/components/Header';
import Overlay from '@dashboard/components/Overlay';
import DashboardSectionHeader from '@dashboard/components/Section/SectionHeader';
import ButtonsHolder from './components/ButtonsHolder';

// Icons
import LinkIcon from "@public/icons/link.svg";

// Utils
import { getEvent } from '@utils/getEvents';
import Event from 'types/Event';
import GuestCard from 'app/dashboard/[eventId]/components/GuestCard';
import EmptyGuests from '@dashboard/components/Guest/EmptyGuests';
import AddGuest from './components/AddGuest';
import InviteLink from './components/InviteLink';

export default async function EventPage({ params }: { params: any }) {
    const event = await getEvent(parseInt(params.eventId)) as unknown as Event;

    if (!event) {
        notFound();
    }

    const { createdAt, ...rest } = event;

    return <div className={dashboardStyles.container}>
        {/* @ts-expect-error */}
        <DashboardHeader>
            <EventEdit event={rest} />
        </DashboardHeader>
        <div className={dashboardStyles.content}>
            <div className={styles.section1}>
                <div className={styles.info}>
                    <div className={styles.iconHolder}>
                        <LinkIcon />
                        <h6>Link de Convite</h6>
                    </div>
                    {
                        event.allowInvite ? <InviteLink inviteCode={event.inviteCode} /> : <p>Convites desativados neste evento</p>
                    }
                </div>
                {
                    event.image_url && <Image src={event.image_url} className={'imageContain'} fill alt="" />
                }
                <Overlay />
            </div>
            <DashboardSectionHeader title='Participantes'>
                <AddGuest eventId={event.id} />
            </DashboardSectionHeader>
            <div className={`${styles.guestsHolder} scroll ${event.guests && event.guests.length === 0 ? styles.empty : ""}`}>
                {
                    event.guests && event.guests.length > 0 ?
                        event.guests.map((guest, index) => {
                            return <GuestCard key={index} guest={guest} event={rest} />
                        })
                        :
                        <EmptyGuests label={`Nenhum convidado foi adicionado ao evento até o momento.\nEnvie o convite para que novos usuários possam entrar!`} />
                }
            </div>
            <ButtonsHolder event={rest} />
        </div>
    </div>
}