import styles from '../dashboard.module.css';

// Components
import EventEdit from '@dashboard/components/Event/EventEdit';
import DashboardHeader from '@dashboard/components/Header';

export default function EventPage() {
    return <div className={styles.container}>
        <DashboardHeader>
            <EventEdit />
        </DashboardHeader>
    </div>
}