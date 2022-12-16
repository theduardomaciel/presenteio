// Components
import DashboardHeader from './components/Header';
import EventCard from './components/EventCard';
import CreateEventButton from './components/CreateEventButton';

// Stylesheets
import styles from './dashboard.module.css';

import { getEvents } from '../../utils/getEvents';
import Event from '../../types/Event';
import EmptyGuests from './components/GuestsDisplay/EmptyGuests.tsx';

export default async function Dashboard() {
    const events = await getEvents();

    return <div className={styles.container}>
        <DashboardHeader profileChildren={<CreateEventButton />} />
        <div className={`${styles.content}`}>
            <h2>Meus Eventos</h2>
            <div className={`${styles.events} ${events && events.length > 0 ? "" : styles.empty}`}>
                {
                    events && events?.length > 0 ?
                        events?.map((event, index) => {
                            return <EventCard key={index} event={event} />
                        })
                        :
                        <EmptyGuests label={`Você ainda não criou nenhum evento.\nPara criar novos, clique no botão "Criar Evento" acima.`} />
                }
            </div>
        </div>
    </div>
}
