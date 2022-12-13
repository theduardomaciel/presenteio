import { redirect } from 'next/navigation';

// Components
import DashboardHeader from './components/Header';
import EventCard from './components/EventCard';
import CreateEventButton from './components/CreateEventButton';

// Stylesheets
import styles from './dashboard.module.css';

// Auth
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function Dashboard() {
    const session = await unstable_getServerSession(authOptions)

    if (!session) {
        redirect("/");
    }

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
