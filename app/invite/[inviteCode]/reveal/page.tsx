import { notFound } from 'next/navigation';

// Stylesheets
import styles from './reveal.module.css'

// Components
import RevealContent from './Content'


import { getEventFromInviteCode } from '@utils/getEvents';
import { getGuest } from '@utils/getGuest';

// Types
import { InviteProps } from '../page'
import Guest from 'types/Guest';
import Event from 'types/Event';

export default async function Reveal({ params, searchParams }: InviteProps) {
    const event = await getEventFromInviteCode(params?.inviteCode as string) as unknown as Event;
    const guest = await getGuest(searchParams?.guest as string) as unknown as Guest;

    if (!guest || event?.status !== "DIVULGATED" || !guest.chosenGuest) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <div className={styles.gradient} />
            <RevealContent guestsImages={event.guests.map(guest => guest.image_url)} chosenGuest={guest.chosenGuest} eventProps={{ type: event.type, name: event.name }} />
            <div className={`${styles.gradient} ${styles.fromRight}`} />
        </div>
    )
}