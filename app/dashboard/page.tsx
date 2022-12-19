import styles from './dashboard.module.css';

// Components
import DashboardHeader from '@dashboard/components/Header';
import EventCard from '@dashboard/components/Event/EventCard';
import CreateEventButton from '@dashboard/components/CreateEventButton';
import EmptyGuests from '@dashboard/components/Guest/EmptyGuests';

import { getEvents } from '@utils/getEvents';
import Event from 'types/Event';

export default async function Dashboard() {
    const events = await getEvents();

    return <div className={styles.container}>
        <DashboardHeader profileChildren={<CreateEventButton />} />
        <div className={`${styles.content}`}>
            <h2 className={styles.title}>Meus Eventos</h2>
            <div className={`${styles.events} ${events && events.length > 0 ? "" : styles.empty}`}>
                {
                    events && events?.length > 0 ?
                        events?.map((event, index) => {
                            const { createdAt, ...rest } = event;
                            return <EventCard key={index} event={rest as unknown as Event} />
                        })
                        :
                        <EmptyGuests label={`Você ainda não criou nenhum evento.\nPara criar novos, clique no botão "Criar Evento" acima.`} />
                }
            </div>
        </div>
    </div>
}
