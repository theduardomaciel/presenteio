import styles from "./dashboard.module.css";

// Components
import DashboardHeader from "@/dashboard/components/Header";
import EventCard from "@/dashboard/components/Event/EventCard";
import EmptyGuests from "@/dashboard/components/Guest/EmptyGuests";
import CreateEventButton from "@/dashboard/components/CreateEventButton";

import { getEvents } from "lib/getEvents";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const events = await getEvents();

	if (!events) {
		return redirect("/login");
	}

	return (
		<div className={`${styles.container} min-h-screen`}>
			<DashboardHeader profileChildren={<CreateEventButton />} />
			<div className={`${styles.content}`}>
				<h2 className={styles.title}>Meus Eventos</h2>
				<div
					className={`${styles.events} ${
						events && events.length > 0 ? "" : styles.empty
					}`}
				>
					{events && events?.length > 0 ? (
						events?.map((event, index) => {
							return <EventCard key={index} event={event} />;
						})
					) : (
						<EmptyGuests
							label={`Você ainda não criou nenhum evento.\nPara criar novos, clique no botão "Criar Evento" acima.`}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
