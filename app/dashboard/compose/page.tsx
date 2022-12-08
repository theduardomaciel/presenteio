// Components
import EventEdit from '../components/EventEdit';
import DashboardHeader from '../components/Header';

// Stylesheets
import styles from '../dashboard.module.css';

export default function ComposeEvent() {
    return <div>
        <DashboardHeader>
            <EventEdit />
        </DashboardHeader>
    </div>
}
