import styles from "../dashboard.module.css";

// Components
import EventEdit from "@/dashboard/components/Event/EventNameEdit";
import DashboardHeader from "@/dashboard/components/Header";
import ComposeEventForm from "./Form";

export default function ComposeEvent() {
	return (
		<div className={styles.container}>
			<ComposeEventForm>
				<DashboardHeader>
					<EventEdit />
				</DashboardHeader>
			</ComposeEventForm>
		</div>
	);
}
