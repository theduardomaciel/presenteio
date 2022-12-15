import { redirect } from 'next/navigation';

// Components
import DashboardHeader from './components/Header';
import EventCard from './components/EventCard';
import CreateEventButton from './components/CreateEventButton';

// Stylesheets
import styles from './dashboard.module.css';

import { cookies } from 'next/headers';
import Event from '../../types/Event';

async function getEvents() {
    const nextCookies = cookies();
    const token = nextCookies.get('presenteio.token');

    const response = await fetch(`http://localhost/api/events`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        next: {
            revalidate: 10
        }
    })

    const data = await response.json();
    return data?.events as Event[];

}

export default async function Dashboard() {
    const events = await getEvents();

    return <div className={styles.container}>
        <DashboardHeader profileChildren={<CreateEventButton />} />
        <div className={`${styles.content} ${styles.grid}`}>
            <h2>Meus Eventos</h2>
            <div className={styles.events}>
                <EventCard />
            </div>
        </div>
    </div>
}
