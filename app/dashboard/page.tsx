// Components
import DashboardHeader from './components/Header';
import EventCard from './components/EventCard';
import CreateEventButton from './components/CreateEventButton';

// Stylesheets
import styles from './dashboard.module.css';

export default function Dashboard() {
    return <div>
        <DashboardHeader profileChildren={<CreateEventButton />} />
        <div className={styles.content}>
            <h2>Meus Eventos</h2>
            <div className={styles.events}>
                <EventCard />
            </div>
        </div>
    </div>
}
